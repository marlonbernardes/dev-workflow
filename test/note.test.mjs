import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  buildPrompt, loadContext, localDate, parseArgs, parseCopilotOutput, parseProposal, resolveWorkspace, runNote, saveDraft,
} from "../lib/note.mjs";

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "note-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const dir of ["inbox", "wiki/engineering", "resources", "projects/demo/documentation"]) {
    await mkdir(path.join(root, dir), { recursive: true });
  }
  await writeFile(path.join(root, "AGENTS.md"), "Preserve human text. Never invent completed work.");
  await writeFile(path.join(root, "resources", "Workspace conventions.md"), "Use local ISO dates.");
  return root;
}

function proposal(overrides = {}) {
  return { title: "Test note", note_type: "note", directory: "inbox", body: "A confirmed observation.", reason: "Unclassified idea.", ...overrides };
}

async function context(root) {
  return loadContext(root, "a confirmed observation from speech");
}

test("parses quoted transcripts and file input without interpreting shell syntax", () => {
  const text = 'Speech with "quotes", $(), & commands and \n Unicode: café';
  assert.equal(parseArgs(["--workspace", "some folder", text]).transcript, text);
  assert.deepEqual(parseArgs(["--file", "long transcript.txt"]), { file: "long transcript.txt", transcript: undefined });
  assert.throws(() => parseArgs(["--file", "file.txt", "speech"]), /not both/);
  assert.throws(() => parseArgs(["--unknown"]), /Unknown option/);
  assert.throws(() => parseArgs([]), /required/);
});

test("resolves the private workspace from descendants, or an explicit path", async (t) => {
  const root = await fixture(t);
  const canonical = await resolveWorkspace(root);
  assert.equal(await resolveWorkspace(undefined, path.join(root, "wiki", "engineering")), canonical);
  await assert.rejects(resolveWorkspace(path.join(root, "resources")), /Not a notes workspace/);
});

test("uses local calendar components rather than UTC date conversion", () => {
  assert.equal(localDate(new Date(2026, 0, 2, 0, 1)), "2026-01-02");
});

test("searches note metadata and content locally but sends no existing bodies", async (t) => {
  const root = await fixture(t);
  const text = "---\naliases: [Widgets]\n---\n# Existing note\n\nPRIVATE-BODY-SENTINEL widgets";
  await writeFile(path.join(root, "wiki", "engineering", "Existing note.md"), text);
  const ctx = await loadContext(root, "widgets");
  assert.equal(ctx.notes[0].title, "Existing note");
  assert.equal(ctx.notes[0].path, "wiki/engineering/Existing note.md");
  assert.equal(ctx.notes[0].score, 1);
  assert.match(ctx.notes[0].aliases, /Widgets/);
  const prompt = buildPrompt(ctx, "widgets", undefined, undefined);
  assert.match(prompt, /Existing note/);
  assert.doesNotMatch(prompt, /PRIVATE-BODY-SENTINEL/);
  assert.ok(ctx.directories.includes("projects/demo/documentation"));
  assert.ok(ctx.directories.includes("wiki/engineering"));
  assert.ok(!ctx.directories.some((dir) => dir.includes("tasks")));
});

test("rejects malformed, empty and out-of-scope AI proposals before writing", async (t) => {
  const root = await fixture(t);
  const ctx = await context(root);
  for (const output of [
    "not json", "null", JSON.stringify({ ...proposal(), body: "" }),
    JSON.stringify(proposal({ directory: "../escape" })),
    JSON.stringify(proposal({ directory: "projects/demo/tasks/done" })),
    JSON.stringify(proposal({ title: "Two\nlines" })),
    JSON.stringify(proposal({ note_type: "accepted" })),
    JSON.stringify(proposal({ note_type: undefined })),
  ]) {
    assert.throws(() => parseProposal(output, ctx));
  }
  assert.equal(parseProposal("```json\n" + JSON.stringify(proposal()) + "\n```", ctx).title, "Test note");
  assert.deepEqual(await readdir(path.join(root, "inbox")), []);
});

test("extracts unwrapped assistant JSON from the CLI event stream", () => {
  const content = JSON.stringify(proposal({ body: "A long line ".repeat(50) + "\n\nA second paragraph." }));
  const stream = [
    { type: "user.message", data: { content: "Input must not be used as the answer" } },
    { type: "assistant.message", data: { content, toolRequests: [] } },
    { type: "result", exitCode: 0 },
  ].map((event) => JSON.stringify(event)).join("\n");
  assert.equal(parseCopilotOutput(stream), content);
  assert.deepEqual(JSON.parse(parseCopilotOutput(stream)).body, JSON.parse(content).body);
});

test("rejects malformed CLI events, session errors and unexpected tool calls", () => {
  for (const output of [
    "warning: unexpected output",
    JSON.stringify({ type: "session.error", data: { message: "Auth failed" } }),
    JSON.stringify({ type: "result", exitCode: 1 }),
    JSON.stringify({ type: "tool.execution_start", data: {} }),
    JSON.stringify({ type: "assistant.message", data: { content: "Text", toolRequests: [{}] } }),
    JSON.stringify({ type: "result", exitCode: 0 }),
  ]) {
    assert.throws(() => parseCopilotOutput(output));
  }
});

test("creates note metadata and never overwrites an existing note", async (t) => {
  const root = await fixture(t);
  const original = path.join(root, "inbox", "note - Test note.md");
  await writeFile(original, "Human text");
  const draft = await saveDraft(await context(root), proposal(), undefined, "2026-11-12");
  assert.equal(draft.relative, "inbox/note - Test note (2).md");
  assert.equal(await readFile(original, "utf8"), "Human text");
  assert.match(draft.content, /type: note\nnote_type: note\ntitle: "Test note"\ncreated: 2026-11-12/);
  assert.match(draft.content, /# Test note/);
});

test("maintains globally unique basenames across note destinations", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "wiki", "engineering", "note - Test note.md"), "Existing");
  const draft = await saveDraft(await context(root), proposal());
  assert.equal(draft.relative, "inbox/note - Test note (2).md");
});

test("updates its own suffixed draft without renaming and preserves its created date", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "inbox", "note - Test note.md"), "Existing");
  const first = await saveDraft(await context(root), proposal(), undefined, "2026-11-11");
  const second = await saveDraft(await context(root), proposal({ body: "Revised" }), first, "2026-11-12");
  assert.equal(second.path, first.path);
  assert.match(second.content, /created: 2026-11-11\nupdated: 2026-11-12/);
  assert.match(second.content, /Revised/);
  assert.ok(!(await readdir(path.join(root, "inbox"))).some((file) => file.endsWith(".tmp")));
});

test("moves only its own draft when the location changes", async (t) => {
  const root = await fixture(t);
  const first = await saveDraft(await context(root), proposal());
  const second = await saveDraft(await context(root), proposal({ directory: "wiki/engineering" }), first);
  assert.equal(second.relative, "wiki/engineering/note - Test note.md");
  await assert.rejects(readFile(first.path), { code: "ENOENT" });
  assert.equal(await readFile(second.path, "utf8"), second.content);
});

test("preserves outside edits instead of replacing or moving a modified draft", async (t) => {
  const root = await fixture(t);
  const first = await saveDraft(await context(root), proposal());
  await writeFile(first.path, "Human change");
  await assert.rejects(saveDraft(await context(root), proposal({ directory: "wiki/engineering" }), first), /changed outside note/);
  assert.equal(await readFile(first.path, "utf8"), "Human change");
  assert.deepEqual(await readdir(path.join(root, "wiki", "engineering")), []);
});

test("refuses symlink or junction destinations and traversal on both path styles", async (t) => {
  const root = await fixture(t);
  const outside = await mkdtemp(path.join(tmpdir(), "note-outside-"));
  t.after(() => rm(outside, { recursive: true, force: true }));
  await symlink(outside, path.join(root, "inbox", "linked"), process.platform === "win32" ? "junction" : "dir");
  const ctx = await context(root);
  for (const directory of ["inbox/linked", "../escape", "..\\escape", "C:\\escape", "/escape"]) {
    await assert.rejects(saveDraft(ctx, proposal({ directory })));
  }
  assert.deepEqual(await readdir(outside), []);
});

test("refuses hidden and Windows-reserved output filenames", async (t) => {
  const root = await fixture(t);
  for (const title of [".secret", "CON", "NUL.txt"]) {
    await assert.rejects(saveDraft(await context(root), proposal({ title })), /unsafe filename/);
  }
});

test("accepts a draft and applies feedback across multiple AI revisions", async (t) => {
  const root = await fixture(t);
  const replies = ["Move it to engineering", "Make it shorter", "yes"];
  const prompts = [];
  const result = await runNote({
    root, transcript: "Original speech",
    ask: async () => replies.shift(),
    report: () => {},
    generate: async (prompt) => {
      prompts.push(prompt);
      return JSON.stringify(proposal({
        directory: prompts.length === 1 ? "inbox" : "wiki/engineering",
        body: prompts.length === 3 ? "Short." : "Longer explanation.",
      }));
    },
  });
  assert.equal(result.accepted, true);
  assert.equal(result.draft.relative, "wiki/engineering/note - Test note.md");
  assert.match(prompts[2], /Move it to engineering/);
  assert.match(prompts[2], /Make it shorter/);
  assert.match(result.draft.content, /Short\./);
  assert.deepEqual(await readdir(path.join(root, "inbox")), []);
});

test("retains drafts on quit, EOF and interrupts, reporting their actual paths", async (t) => {
  const root = await fixture(t);
  for (const answer of ["q", null, "interrupt"]) {
    const controller = new AbortController();
    const messages = [];
    const job = runNote({
      root, transcript: "Speech", signal: controller.signal,
      report: (text) => messages.push(text),
      ask: async () => {
        if (answer === "interrupt") controller.abort(new Error("Cancelled"));
        return answer;
      },
      generate: async () => JSON.stringify(proposal()),
    });
    if (answer === "interrupt") {
      await assert.rejects(job, /Cancelled/);
    } else {
      assert.equal((await job).accepted, false);
    }
    const kept = messages.find((text) => text.startsWith("Note kept at: "));
    assert.ok(kept);
    assert.match(await readFile(kept.slice("Note kept at: ".length), "utf8"), /confirmed observation/);
  }
});

test("does not call AI again for 'no' followed by blank feedback", async (t) => {
  const root = await fixture(t);
  const replies = ["no", "", "yes"];
  let calls = 0;
  const result = await runNote({
    root, transcript: "Speech", report: () => {},
    ask: async () => replies.shift(),
    generate: async () => { calls++; return JSON.stringify(proposal()); },
  });
  assert.equal(result.accepted, true);
  assert.equal(calls, 1);
});

test("keeps the previous draft when a later AI response fails validation", async (t) => {
  const root = await fixture(t);
  const messages = [];
  let calls = 0;
  await assert.rejects(runNote({
    root, transcript: "Speech", report: (text) => messages.push(text),
    ask: async () => "Change something",
    generate: async () => ++calls === 1 ? JSON.stringify(proposal()) : "broken JSON",
  }), /valid note JSON/);
  assert.match(await readFile(path.join(root, "inbox", "note - Test note.md"), "utf8"), /confirmed observation/);
  assert.ok(messages.some((text) => text.startsWith("Note kept at: ")));
});

test("CLI help and invalid input work without calling AI", () => {
  const bin = fileURLToPath(new URL("../bin/note.mjs", import.meta.url));
  const help = spawnSync(process.execPath, [bin, "--help"], { encoding: "utf8" });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /--file/);
  const invalid = spawnSync(process.execPath, [bin], { encoding: "utf8" });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /transcript is required/);
});

test("discovers project notes and repository references but excludes templates", async (t) => {
  const root = await fixture(t);
  for (const dir of ["projects/2026-11-19-search/notes", "projects/_template/notes",
    "resources/repositories/search", "resources/repositories/_template"]) {
    await mkdir(path.join(root, dir), { recursive: true });
  }
  const ctx = await context(root);
  assert.ok(ctx.directories.includes("projects/2026-11-19-search/notes"));
  assert.ok(ctx.directories.includes("resources/repositories/search"));
  assert.ok(!ctx.directories.some((directory) => directory.includes("_template")));
  assert.match(buildPrompt(ctx, "research a question"), /note_type/);
});

test("changing a draft category renames only that draft and keeps decisions proposed", async (t) => {
  const root = await fixture(t);
  const first = await saveDraft(await context(root), proposal(), undefined, "2026-11-11");
  const next = await saveDraft(await context(root), proposal({ note_type: "decision" }), first, "2026-11-12");
  assert.equal(next.relative, "inbox/decision - Test note.md");
  assert.match(next.content, /note_type: decision\nstatus: proposed\ndecision_date: null/);
  assert.match(next.content, /created: 2026-11-11\nupdated: 2026-11-12/);
  await assert.rejects(readFile(first.path), { code: "ENOENT" });
  assert.deepEqual(await readdir(path.join(root, "inbox")), ["decision - Test note.md"]);
});
