import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export function harnessName(value = process.env.AI_HARNESS ?? "copilot") {
  if (!["copilot", "claude"].includes(value)) throw new Error("Harness must be copilot or claude.");
  return value;
}

export function executable(name) {
  return process.platform === "win32" ? `${name}.exe` : name;
}

export function proposalCommand(harness) {
  harnessName(harness);
  return harness === "copilot" ? [
    "--silent", "--output-format", "json", "--stream", "off", "--no-custom-instructions",
    "--disable-builtin-mcps", "--no-ask-user", "--no-auto-update",
    // An empty list selects Copilot's default tools instead of disabling them.
    "--available-tools", "__workflow_no_tools__",
  ] : [
    "--print", "--output-format", "json", "--tools", "", "--strict-mcp-config",
    "--mcp-config", '{"mcpServers":{}}', "--setting-sources", "",
    "--settings", '{"disableAllHooks":true}', "--no-session-persistence",
  ];
}

export function parseCopilotOutput(output) {
  let answer;
  for (const line of output.split(/\r?\n/).filter((value) => value.trim())) {
    let event;
    try {
      event = JSON.parse(line);
    } catch (error) {
      throw new Error("Copilot returned invalid JSONL output; no changes were applied.", { cause: error });
    }
    if (event.type === "session.error" || (event.type === "result" && event.exitCode !== 0)) {
      throw new Error(`Copilot failed: ${event.data?.message ?? event.exitCode ?? "session error"}`);
    }
    if (event.type?.startsWith("tool.execution") || event.data?.toolRequests?.length) {
      throw new Error("Copilot attempted a tool call despite the tool-free whitelist.");
    }
    if (event.type === "assistant.message" && typeof event.data?.content === "string") {
      answer = event.data.content;
    }
  }
  if (!answer?.trim()) throw new Error("Copilot returned no assistant response; no changes were applied.");
  return answer;
}

export function parseClaudeOutput(output) {
  let result;
  try {
    result = JSON.parse(output);
  } catch (error) {
    throw new Error("Claude returned invalid JSON output; no changes were applied.", { cause: error });
  }
  if (!result || result.type !== "result" || result.is_error || result.subtype !== "success" ||
      typeof result.result !== "string" || !result.result.trim()) {
    throw new Error("Claude failed or returned no successful response; no changes were applied.");
  }
  return result.result;
}

export async function generateProposal(prompt, { signal, harness = harnessName(), spawnProcess = spawn } = {}) {
  const args = proposalCommand(harness);
  const cwd = await mkdtemp(path.join(tmpdir(), "dev-workflow-ai-"));
  try {
    return await new Promise((resolve, reject) => {
      const program = executable(harness);
      const child = spawnProcess(program, args, {
        cwd, signal, windowsHide: true, shell: false,
        env: {
          ...process.env,
          COPILOT_ALLOW_ALL: "false",
          COPILOT_ASSISTED_APPROVAL: "false",
          COPILOT_PLUGIN_DIR_ONLY: "true",
        },
        stdio: ["pipe", "pipe", "pipe"],
      });
      let output = "";
      let errors = "";
      let failure;
      child.on("error", (error) => { failure = error; });
      child.stdin.on("error", (error) => { failure ??= error; });
      child.stdout.setEncoding("utf8").on("data", (chunk) => {
        output += chunk;
        if (Buffer.byteLength(output) > 8 * 1024 * 1024) {
          failure = new Error(`${harness} output exceeded 8 MiB.`);
          child.kill();
        }
      });
      child.stderr.setEncoding("utf8").on("data", (chunk) => {
        errors = (errors + chunk).slice(-16000);
      });
      child.on("close", (code) => {
        if (failure?.code === "ENOENT") {
          reject(new Error(`Cannot find ${program}. Install/authenticate ${harness} first.`));
        } else if (failure) {
          reject(failure);
        } else if (code !== 0) {
          reject(new Error(`${harness} exited with ${code}: ${errors.trim() || "no diagnostic output"}`));
        } else {
          try {
            resolve(harness === "copilot" ? parseCopilotOutput(output) : parseClaudeOutput(output));
          } catch (error) {
            reject(error);
          }
        }
      });
      child.stdin.end(prompt);
    });
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
}
