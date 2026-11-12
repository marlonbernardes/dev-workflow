import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectFile, parseArgs, parseCommitProposal, runAic } from "../lib/aic.mjs";

function git(root, ...args) {
  const result = spawnSync("git", args, {
    cwd: root, encoding: "utf8", windowsHide: true,
    env: { ...process.env, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null" },
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

async function fixture(t, initial = true) {
  const root = await mkdtemp(path.join(tmpdir(), "aic-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  git(root, "init");
  git(root, "config", "user.name", "Synthetic Test");
  git(root, "config", "user.email", "test@example.invalid");
  git(root, "config", "commit.gpgsign", "false");
  git(root, "config", "core.autocrlf", "false");
  git(root, "config", "core.hooksPath", path.join(root, "no-hooks"));
  await writeFile(path.join(root, "file.txt"), "original\n");
  if (initial) {
    git(root, "add", ".");
    git(root, "commit", "-m", "Initial fixture");
  }
  return root;
}

const generate = async () => JSON.stringify({ message: "Update synthetic fixture", warnings: [] });
const options = (root) => ({ cwd: root, generate, report() {} });

test("validates command options and malformed AI messages", () => {
  assert.deepEqual(parseArgs(["--harness", "claude", "--dry-run"]), { harness: "claude", dryRun: true });
  assert.throws(() => parseArgs(["--yes"]));
  for (const output of ["null", "{}", '{"message":"Oops","warnings":["suspicious file"]}', '{"message":"x","warnings":null}']) {
    assert.throws(() => parseCommitProposal(output));
  }
});

test("local checks flag credential names, secrets, generated files and conflict debris", () => {
  for (const [file, text] of [
    [".env.local", "a=1"],
    ["node_modules/dependency/index.js", "code"],
    ["app.js", "const value = 'ghp_" + "a".repeat(36) + "';"],
    ["app.js", "-----BEGIN " + "PRIVATE KEY-----"],
    ["app.js", "<<<<<<< ours\nconflict\n=======\nother\n>>>>>>> theirs\n"],
    ["photo.png", "\0binary"],
  ]) assert.ok(inspectFile(file, Buffer.from(text)).length, file);
  assert.deepEqual(inspectFile(".env.example", Buffer.from("TOKEN=<your-token>")), []);
});

test("commits all changes with no staged scope, including first commit", async (t) => {
  const root = await fixture(t, false);
  await writeFile(path.join(root, "space [literal].txt"), "new\n");
  const result = await runAic(options(root));
  assert.equal(result.status, "committed");
  assert.equal(result.scope, "all");
  assert.equal(git(root, "status", "--porcelain"), "");
  assert.match(git(root, "log", "-1", "--format=%B"), /Co-authored-by: Copilot/);
});

test("commits only staged content and preserves unstaged edits and untracked files", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "file.txt"), "staged\n");
  git(root, "add", "file.txt");
  await writeFile(path.join(root, "file.txt"), "unstaged\n");
  await writeFile(path.join(root, "other.txt"), "untracked\n");
  const result = await runAic(options(root));
  assert.equal(result.scope, "staged");
  assert.equal(git(root, "show", "HEAD:file.txt"), "staged");
  assert.equal(await readFile(path.join(root, "file.txt"), "utf8"), "unstaged\n");
  assert.equal(git(root, "diff", "--cached"), "");
  assert.match(git(root, "status", "--porcelain"), /\?\? other.txt/);
});

test("blocks secrets before AI and leaves staging byte-for-byte unchanged", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "credentials.json"), '{"user":"synthetic"}');
  const before = await readFile(path.join(root, ".git", "index"));
  let called = false;
  await assert.rejects(runAic({ ...options(root), generate: async () => { called = true; } }), /Nothing sent to AI/);
  assert.equal(called, false);
  assert.deepEqual(await readFile(path.join(root, ".git", "index")), before);
});

test("scans complete staged blobs even when the secret is outside changed lines", async (t) => {
  const root = await fixture(t);
  const secret = "ghp_" + "b".repeat(36);
  await writeFile(path.join(root, "file.txt"), `${secret}\n${"ordinary\n".repeat(50)}`);
  git(root, "add", ".");
  git(root, "commit", "-m", "Synthetic credential fixture");
  await writeFile(path.join(root, "file.txt"), `${secret}\n${"ordinary\n".repeat(49)}changed\n`);
  git(root, "add", ".");
  await assert.rejects(runAic({ ...options(root), generate: async () => assert.fail("must not invoke AI") }), /possible secret/);
});

test("flags force-added ignored files before invoking AI", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, ".gitignore"), "private-data.txt\n");
  await writeFile(path.join(root, "private-data.txt"), "not for Git\n");
  git(root, "add", "--force", "private-data.txt");
  await assert.rejects(runAic({ ...options(root), generate: async () => assert.fail("must not invoke AI") }), /matches an ignore rule/);
});

test("never leaks a removed secret to AI through deleted diff lines", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "file.txt"), "ghp_" + "c".repeat(36) + "\n");
  git(root, "add", ".");
  git(root, "commit", "-m", "Synthetic old credential");
  await writeFile(path.join(root, "file.txt"), "removed credential\n");
  await assert.rejects(runAic({
    ...options(root), generate: async () => assert.fail("must not invoke AI"),
  }), /including removed lines/);
});

test("preview and AI failure preserve HEAD and staging", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "file.txt"), "changed\n");
  const before = git(root, "rev-parse", "HEAD");
  const index = await readFile(path.join(root, ".git", "index"));
  assert.equal((await runAic({ ...options(root), dryRun: true })).status, "preview");
  await assert.rejects(runAic({ ...options(root), generate: async () => { throw new Error("Offline"); } }), /Offline/);
  assert.equal(git(root, "rev-parse", "HEAD"), before);
  assert.deepEqual(await readFile(path.join(root, ".git", "index")), index);
});

test("refuses a stale all-files snapshot or concurrent staging instead of committing it", async (t) => {
  for (const stage of [false, true]) {
    const root = await fixture(t);
    await writeFile(path.join(root, "file.txt"), "changed\n");
    const before = git(root, "rev-parse", "HEAD");
    await assert.rejects(runAic({
      ...options(root),
      generate: async () => {
        await writeFile(path.join(root, "file.txt"), "concurrent\n");
        if (stage) git(root, "add", ".");
        return generate();
      },
    }), /changed while AI/);
    assert.equal(git(root, "rev-parse", "HEAD"), before);
    assert.equal(git(root, "diff", "--cached", "--name-only"), stage ? "file.txt" : "");
  }
});

test("normal commit hooks run and failures preserve the original staging", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "file.txt"), "changed\n");
  git(root, "add", ".");
  git(root, "config", "core.hooksPath", path.join(root, ".git", "hooks"));
  await writeFile(path.join(root, ".git", "hooks", "pre-commit"), "#!/bin/sh\nexit 1\n", { mode: 0o755 });
  const before = git(root, "rev-parse", "HEAD");
  const index = await readFile(path.join(root, ".git", "index"));
  await assert.rejects(runAic(options(root)), /git commit failed/);
  assert.equal(git(root, "rev-parse", "HEAD"), before);
  assert.deepEqual(await readFile(path.join(root, ".git", "index")), index);
});

test("deletions and renames are included without losing their staged scope", async (t) => {
  const root = await fixture(t);
  git(root, "mv", "file.txt", "renamed.txt");
  await writeFile(path.join(root, "unrelated.txt"), "untracked\n");
  const result = await runAic({ ...options(root), harness: "claude" });
  assert.deepEqual(result.files.sort(), ["file.txt", "renamed.txt"]);
  assert.match(git(root, "log", "-1", "--format=%B"), /Co-authored-by: Claude/);
  assert.equal(git(root, "status", "--porcelain"), "?? unrelated.txt");
});
