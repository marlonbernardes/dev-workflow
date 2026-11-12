# Note: speech-to-text into a reviewed Markdown note

```text
note "A big speech-to-text transcript..."
note --workspace <your-private-workspace> "Another idea..."
note --file transcript.txt
note --harness claude "Use the same workflow with Claude Code..."
```

## Flow

1. The command resolves your private notes workspace, reads its agent instructions
   and conventions, and searches existing note titles, aliases and content locally.
2. The selected AI receives the transcript, those instructions, available destinations
   and up to 50 ranked existing-note metadata entries, but not existing note
   bodies. It proposes JSON containing a title, note_type, body, directory and
   explanation. Categories are note, decision, research, investigation, guide
   and prompt, as defined in workspace conventions.
3. The script validates that proposal and creates one new Markdown draft. It
   adds type, note_type, title, local created/updated dates, tags and the heading.
   Filenames use `<note_type> - <title>.md`. Decision drafts always start
   `status: proposed` with no approval date.
4. It prints the saved path, explanation and note contents. Press Enter or type
   `y` to accept, or type feedback such as "move it to project notes and
   shorten the summary". Typing `n` asks for the changes you want.
5. Feedback is sent with the original transcript and latest draft. The script
   revises or relocates only its own unchanged draft, then asks again.
6. `q`, EOF or Ctrl+C retains the latest saved draft and prints its location.
   AI failures also retain an already-created draft and report the error.

Acceptance ends the capture session; it does not mark a task done or change
frontmatter to a fictional completion status. Additional requests to edit other
files are outside this command's scope. Use a normal agent session for broader
workspace updates.

## Install on Windows or macOS

Requires Node.js 22+ with npm, plus an authenticated Copilot CLI or Claude Code.
Select `--harness copilot|claude`, otherwise `AI_HARNESS`, then `copilot`.
Ask before installing tools. Use the current official Node.js LTS installer
or an already-approved version manager; do not install another Node copy if an
appropriate one is already available.

On Windows the selected standalone `copilot.exe` or `claude.exe` must resolve
on PATH. Elsewhere the selected command is invoked directly, without a shell.
Authenticate using the selected CLI's normal login flow. Copilot must support
stdin prompts, `--output-format json` and `--available-tools`; this integration
was verified with Copilot CLI 1.0.109.
Claude must support print/JSON mode, `--tools`, strict MCP configuration and
setting-source restrictions described in [Harnesses](Harnesses.md).
The Claude adapter is covered by deterministic contract tests, not a live check.

In the dev-workflow checkout, inspect for conflicts and ask before registering:

```text
node --version
npm --version
copilot --version
npm config get prefix
npm test
npm link --offline --ignore-scripts --no-audit --no-fund
note --help
```

These are terminal commands, not a script to paste without review. If PowerShell
blocks npm's `.ps1` launcher, use the installed `npm.cmd` executable instead;
do not bypass execution policy.

`npm link` creates platform-appropriate `note` and `aic` command shims linked to this checkout.
It downloads no dependencies. Keep the checkout in place; shared updates take
effect for this command without copying its source into the private workspace.
Review changes before pulling or running updated code.

Ensure npm's global command directory is on PATH. On Windows it is usually the
prefix printed above; on macOS it is usually the `bin` directory inside that
prefix. Inspect the actual installation instead of hard-coding it. If linking
requires elevation or the command name already exists, stop for approval and
resolve the conflict; do not use sudo or overwrite unrelated commands.

On a new machine follow `docs/Bootstrap.md`, including the Note setup phase.
There is no background service and no npm registry publication.

## Workspace and input

Resolution order is `--workspace`, `NOTE_WORKSPACE`, the nearest current directory
containing the workspace markers, then `~/work`. The markers are `AGENTS.md`,
`resources/Workspace conventions.md` and `projects`.

Destinations must already exist and are limited to `inbox`, direct categories
under `wiki`, existing projects' `notes` folders and repository reference folders
under `resources/repositories`. Underscore-prefixed project/repository templates
are excluded. Existing `documentation` and `investigations` folders remain valid
for unmigrated projects. The command does not create projects, task records,
dashboards or logs.
Run workspace setup if the note destinations are absent.

Quote transcript arguments according to your shell. Shells have command-length
limits and may store arguments in history; use `--file` for long transcripts,
complex quoting or to keep speech out of shell history. Input and the proposed
note are capped at 1 MiB. The review prompts still use standard input, so it
is not also used to pipe a transcript. With no available review input, the
command keeps an unaccepted draft rather than hanging or claiming acceptance.

## Data and write boundaries

- The transcript and generated note go to your selected AI service
  and can be retained in CLI session history/logs according to its settings.
  Do not submit secrets or content your organization prohibits sending.
- Only note metadata from other notes is sent, not their full contents. Local
  searches skip links and hidden files and stop at 2000 notes with an explicit
  error rather than silently ignoring a larger collection.
- The AI runs from an empty temporary working directory with no proposal tools.
  Copilot disables custom instructions and automatic plugin discovery and uses
  an explicit nonmatching tool whitelist (an empty list would select defaults).
  Claude uses an empty tool list, strict empty MCP config, no file-based settings
  and disabled hooks. Machine-readable output preserves unwrapped JSON.
  Existing managed CLI policies still apply; this is not an OS sandbox.
  See [Harnesses](Harnesses.md) for the adapter boundaries.
- The script rejects unapproved paths, directory traversal, links/junctions and
  invalid filenames. It uses exclusive creation, adding a suffix on collisions
  rather than replacing another note.
- Revisions compare the saved draft against disk before changing it. If another
  editor changed the draft, the command refuses the revision instead of erasing
  those edits. Leave manual editing until the capture session is complete.
- No Git commands, commits, pushes, other-note edits or background agents run.

## Validation

`npm test` runs deterministic tests using Node's built-in runner and synthetic
temporary workspaces; it does not call AI. A separate real-Copilot smoke test
verified generation, revision, relocation and review on Windows. The code uses
cross-platform Node APIs, but macOS execution has not yet been verified.
