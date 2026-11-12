import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm, symlink, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  loadProject, parseWorkspaceState, resolveProject,
} from "../.github/skills/project/scripts/project-load.mjs";

function state() {
  return {
    version: 1,
    tabs: [{ name: "Project", panes: [{ role: "coordinator" }, { role: "editor", file: "PROJECT.md" }] }],
  };
}

async function fixture(t, layout = state()) {
  const root = await mkdtemp(path.join(tmpdir(), "project-load-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const folder = path.join(root, "projects", "2026-11-19-sample");
  await mkdir(path.join(folder, "notes"), { recursive: true });
  await mkdir(path.join(root, "resources"), { recursive: true });
  await writeFile(path.join(root, "AGENTS.md"), "Preserve human content.");
  await writeFile(path.join(root, "resources", "Workspace conventions.md"), "Use evidence.");
  await writeFile(path.join(folder, "PROJECT.md"),
    `---\ntype: project\n---\n# Sample project\n\n## Workspace state\n\n\`\`\`json\n${JSON.stringify(layout, null, 2)}\n\`\`\`\n\n## Other section\n`);
  return { root, folder };
}

function fakeHerdr(root, { spaces = [], fail, blocked = false, racing = false } = {}) {
  const calls = [];
  const apps = new Map();
  let serial = 0;
  let inspections = 0;
  const commands = [
    { name: "space.new", args: ["name", "folder", "tab", "argv", "machine"].map((name) => ({ name })) },
    { name: "tab.new", args: ["name", "space", "folder", "argv"].map((name) => ({ name })) },
    { name: "pane.split", args: ["pane", "direction", "argv"].map((name) => ({ name })) },
  ];
  function runCommand(program, args, cwd) {
    calls.push({ program, args, cwd });
    if (program === "copilot" && args[0] === "skill") {
      return JSON.stringify([
        { name: "project", description: "Manage projects.", source: "project", enabled: true },
        { name: "board", description: "Actual tasks.", source: "project", enabled: true },
        { name: "disabled", description: "Do not list.", source: "project", enabled: false },
      ]);
    }
    if (program === "hc" && args[0] === "get") {
      return JSON.stringify({
        state: "live", status: { app: apps.get(args[1]), state: blocked ? "blocked" : "idle" },
      });
    }
    if (program !== "herdr-app") return "";
    if (args[0] === "ls") {
      if (racing && ++inspections === 2) spaces.push({ id: "race", name: "Sample project", folder: root, tabs: [] });
      return JSON.stringify({ spaces });
    }
    if (args[0] === "commands") return JSON.stringify(commands);
    if (args[0] === "status") return '{"errors":[]}';
    const command = args[1];
    if (command === fail) throw new Error("Synthetic creation failure");
    const input = JSON.parse(args[2]);
    const number = ++serial;
    const result = { pane: `p${number}`, terminal: `t${number}` };
    const terminal = { pane: result.pane, terminal: result.terminal };
    apps.set(result.terminal, input.argv?.[0] ?? "shell");
    if (command === "space.new") {
      result.space = `s${number}`;
      result.tab = `tab${number}`;
      spaces.push({
        id: result.space, name: input.name, folder: input.folder, machine: null,
        tabs: [{ id: result.tab, name: input.tab, terminals: [terminal] }],
      });
    } else if (command === "tab.new") {
      result.tab = `tab${number}`;
      spaces.find((space) => space.id === input.space).tabs.push({
        id: result.tab, name: input.name, terminals: [terminal],
      });
    } else if (command === "pane.split") {
      const tab = spaces.flatMap((space) => space.tabs).find((tab) => tab.terminals.some((pane) => pane.pane === input.pane));
      tab.terminals.push(terminal);
    } else {
      throw new Error(`Unexpected command: ${command}`);
    }
    return JSON.stringify(result);
  }
  return { runCommand, calls, spaces, commands };
}

test("preview validates the dashboard and lists discovered skills without UI writes", async (t) => {
  const { root, folder } = await fixture(t);
  const fake = fakeHerdr(root);
  const result = await loadProject({ workspace: root, name: "Sample project", ...fake });
  assert.equal(result.status, "preview");
  assert.equal(result.project, "2026-11-19-sample");
  assert.ok(result.prompt.includes(JSON.stringify(path.join(folder, "PROJECT.md"))));
  assert.match(result.prompt, /coordinator\/project manager/);
  assert.match(result.prompt, /\/board: Actual tasks/);
  assert.doesNotMatch(result.prompt, /\/disabled/);
  assert.ok(!fake.calls.some((call) => call.args[0] === "do"));
});

test("already-open projects are not duplicated even if their dashboard lacks a recipe", async (t) => {
  const { root, folder } = await fixture(t);
  await writeFile(path.join(folder, "PROJECT.md"), "# Sample project\n");
  const fake = fakeHerdr(root, { spaces: [{ id: "existing", name: "Sample project", folder: root }] });
  const result = await loadProject({ workspace: root, name: "2026-11-19-sample", apply: true, ...fake });
  assert.equal(result.status, "already-open");
  assert.equal(result.space, "existing");
  assert.equal(fake.calls.length, 1);
});

test("rejects ambiguous projects, template selection and conflicting open spaces", async (t) => {
  const { root } = await fixture(t);
  await mkdir(path.join(root, "projects", "other"));
  await writeFile(path.join(root, "projects", "other", "PROJECT.md"), "# Sample project\n");
  await assert.rejects(resolveProject(root, "Sample project"), /Ambiguous/);
  assert.equal((await resolveProject(root, "2026-11-19-sample")).slug, "2026-11-19-sample");
  await mkdir(path.join(root, "projects", "_template"));
  await writeFile(path.join(root, "projects", "_template", "PROJECT.md"), "# Template\n");
  await assert.rejects(resolveProject(root, "_template"), /not found/);
  const fake = fakeHerdr(root, { spaces: [{ id: "wrong", name: "Sample project", folder: path.dirname(root) }] });
  await assert.rejects(loadProject({ workspace: root, name: "2026-11-19-sample", ...fake }), /conflicts/);
});

test("rejects invalid roles, commands, unsafe paths and missing state before creating UI", async (t) => {
  const { root, folder } = await fixture(t);
  const project = await resolveProject(root, "Sample project");
  for (const edit of [
    (layout) => { layout.version = 2; },
    (layout) => { layout.tabs[0].panes[0].command = "run arbitrary code"; },
    (layout) => { layout.tabs[0].panes[1].file = "../AGENTS.md"; },
    (layout) => { layout.tabs[0].panes[1].file = "C:\\outside.md"; },
    (layout) => { layout.tabs[0].panes[1].role = "agent"; },
    (layout) => { layout.tabs[0].panes[1].direction = "down"; },
  ]) {
    const layout = state();
    edit(layout);
    await assert.rejects(parseWorkspaceState({
      ...project, markdown: `# Sample project\n## Workspace state\n\`\`\`json\n${JSON.stringify(layout)}\n\`\`\`\n`,
    }));
  }
  await writeFile(path.join(folder, "PROJECT.md"), "# Sample project\n");
  const fake = fakeHerdr(root);
  await assert.rejects(loadProject({ workspace: root, name: "Sample project", apply: true, ...fake }), /Workspace state/);
  assert.ok(!fake.calls.some((call) => call.args[0] === "do"));
});

test("refuses symlink editor files", async (t) => {
  const { root, folder } = await fixture(t);
  const target = path.join(root, "AGENTS.md");
  const link = path.join(folder, "notes", "linked");
  await symlink(path.dirname(target), link, process.platform === "win32" ? "junction" : "dir");
  const project = await resolveProject(root, "Sample project");
  const layout = state();
  layout.tabs.push({ name: "Reference", panes: [{ role: "editor", file: "notes/linked/AGENTS.md" }] });
  await assert.rejects(parseWorkspaceState({
    ...project, markdown: `## Workspace state\n\`\`\`json\n${JSON.stringify(layout)}\n\`\`\`\n`,
  }), /real files/);
});

test("apply reuses the initial tab, splits by explicit IDs and supports additional tabs", async (t) => {
  const layout = state();
  layout.tabs.push({ name: "Notes", panes: [{ role: "editor", file: "PROJECT.md" }, { role: "shell", direction: "down" }] });
  const { root, folder } = await fixture(t, layout);
  const before = await readFile(path.join(folder, "PROJECT.md"), "utf8");
  const fake = fakeHerdr(root);
  const result = await loadProject({ workspace: root, name: "Sample project", apply: true, ...fake });
  assert.equal(result.status, "verified");
  assert.equal(result.checks.length, 4);
  const actions = fake.calls.filter((call) => call.args[0] === "do");
  assert.deepEqual(actions.map((call) => call.args[1]), ["space.new", "pane.split", "tab.new", "pane.split"]);
  const create = JSON.parse(actions[0].args[2]);
  assert.equal(create.machine, "");
  assert.equal(create.folder, root);
  assert.ok(create.argv.includes("--interactive"));
  assert.ok(!create.argv.includes("--allow-all"));
  assert.equal(JSON.parse(actions[1].args[2]).pane, "p1");
  assert.equal(JSON.parse(actions[2].args[2]).space, "s1");
  assert.equal(await readFile(path.join(folder, "PROJECT.md"), "utf8"), before);
});

test("rechecks for a space opened during preflight", async (t) => {
  const { root } = await fixture(t);
  const fake = fakeHerdr(root, { racing: true });
  const result = await loadProject({ workspace: root, name: "Sample project", apply: true, ...fake });
  assert.equal(result.status, "already-open");
  assert.ok(!fake.calls.some((call) => call.args[0] === "do"));
});

test("unsupported Herdr signatures stop before UI creation", async (t) => {
  const { root } = await fixture(t);
  const fake = fakeHerdr(root);
  fake.commands[0].args = [];
  await assert.rejects(loadProject({ workspace: root, name: "Sample project", apply: true, ...fake }), /lacks/);
  assert.ok(!fake.calls.some((call) => call.args[0] === "do"));
});

test("failures report partial IDs without retries or destructive cleanup", async (t) => {
  const { root } = await fixture(t);
  const fake = fakeHerdr(root, { fail: "pane.split" });
  await assert.rejects(loadProject({ workspace: root, name: "Sample project", apply: true, ...fake }),
    /partial creation:.*s1.*Synthetic creation failure/);
  assert.equal(fake.calls.filter((call) => call.args[1] === "space.new").length, 1);
  assert.ok(!fake.calls.some((call) => /close|kill|restart/.test(call.args[1] ?? "")));
});

test("live but blocked terminals are explicitly unverified", async (t) => {
  const { root } = await fixture(t);
  const fake = fakeHerdr(root, { blocked: true });
  const result = await loadProject({ workspace: root, name: "Sample project", apply: true, ...fake });
  assert.equal(result.status, "needs-verification");
  assert.ok(result.checks.every((check) => check.verified === false));
});
