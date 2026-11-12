import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import { stat } from "node:fs/promises";
import test from "node:test";
import { generateProposal, harnessName, parseClaudeOutput, proposalCommand } from "../lib/ai.mjs";

test("validates explicit harnesses and never silently falls back", () => {
  assert.equal(harnessName("claude"), "claude");
  assert.throws(() => harnessName("other"), /copilot or claude/);
});

test("Claude output must be a successful result, not a success-shaped error", () => {
  assert.equal(parseClaudeOutput('{"type":"result","subtype":"success","result":"answer"}'), "answer");
  for (const output of ["invalid", "null", "{}", '{"type":"result","is_error":true,"result":"Auth failed"}']) {
    assert.throws(() => parseClaudeOutput(output));
  }
});

test("both harnesses receive stdin without a shell or repository tool access", async () => {
  for (const harness of ["copilot", "claude"]) {
    let workingDirectory;
    const text = 'literal $() & "quotes"';
    const result = await generateProposal(text, {
      harness,
      spawnProcess(program, args, options) {
        assert.match(program, new RegExp(`^${harness}(?:\\.exe)?$`));
        assert.deepEqual(args, proposalCommand(harness));
        assert.equal(options.shell, false);
        assert.equal(options.env.COPILOT_ALLOW_ALL, "false");
        workingDirectory = options.cwd;
        const child = new EventEmitter();
        child.stdin = new PassThrough();
        child.stdout = new PassThrough();
        child.stderr = new PassThrough();
        let input = "";
        child.stdin.on("data", (chunk) => { input += chunk; });
        child.stdin.on("finish", () => {
          assert.equal(input, text);
          child.stdout.end(harness === "copilot"
            ? '{"type":"assistant.message","data":{"content":"answer"}}\n'
            : '{"type":"result","subtype":"success","is_error":false,"result":"answer"}');
          child.emit("close", 0);
        });
        return child;
      },
    });
    assert.equal(result, "answer");
    await assert.rejects(stat(workingDirectory), { code: "ENOENT" });
    const args = proposalCommand(harness);
    if (harness === "claude") {
      assert.equal(args[args.indexOf("--tools") + 1], "");
      assert.ok(args.includes("--strict-mcp-config"));
      assert.ok(!args.includes("--bare"));
    } else assert.equal(args[args.indexOf("--available-tools") + 1], "__workflow_no_tools__");
  }
});
