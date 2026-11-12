# dev-workflow

An evolving, dotfiles-style source for a Markdown engineering workflow:
Neovim configuration, project skills, workspace conventions and setup guidance.
It is not a disposable template and must not contain personal notes or tasks.

## Two repositories

| Repository | Default local folder | Contents |
| --- | --- | --- |
| `dev-workflow` | `$HOME\dev-workflow` | Shared configuration, skills, seed templates and bootstrap instructions |
| Your private workspace | `$HOME\work` | Actual projects, tasks, wiki and daily logs, plus reviewed deployed copies of workflow files |

Clone this repository normally on each machine. Keep its remote pointing to
the shared `dev-workflow` repository so improvements can be contributed back.
Clone the same private workspace repository on each machine to synchronize
your personal work. Do not create a new personal repository per machine.
Keep the two repositories as siblings, not nested repositories.

There are no hosted repository URLs yet in this local setup. Choose actual
owners, repository names and visibility before cloning or configuring remotes.
Never use the shared repository's URL as the private workspace's `origin`.

## New machine

Read [the AI-guided bootstrap checklist](docs/Bootstrap.md), or open this
repository in Copilot or Claude Code and request `/workspace-setup`.

The checklist covers tool installation, Neovim and its plugins, project-local
skills, validation and finally separate Git remote verification. Installation,
elevation, overwrites, remote changes and pushes require approval. Validated
source/workspace changes are committed automatically at the checkpoints below.
Existing machines should use the update procedure below instead of reinitializing
their workspace.

## Contents

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Instructions for agents working on the shared source |
| `docs/Bootstrap.md` | New-machine setup and verification |
| `config/nvim/init.lua` | Portable editor configuration |
| `config/nvim/nvim-pack-lock.json` | Tested plugin revisions |
| `bin/note.mjs` and `lib/note.mjs` | Node.js speech-to-text note command |
| `bin/aic.mjs` and `lib/aic.mjs` | Staged-first AI commit command with local mistake checks |
| `lib/ai.mjs` | Shared tool-free Copilot / Claude CLI adapters |
| `docs/Note.md` | Note command installation, usage, review loop and privacy |
| `docs/Aic.md` and `docs/Harnesses.md` | Commit command and harness portability/deployment |
| `.claude/skills/<name>/SKILL.md` | One shared skill set discovered by both harnesses |
| `.claude/agents/<name>.md` | Repository-local custom agent profiles, deployed alongside skills |
| `workspace/` | Full example workspace, instructions, note templates and `projects/_template` |

Project skills are deployed to `$HOME\work\.claude\skills`; no personal-global
skill registration is needed. The source repo also discovers these skills,
but task-management skills must operate on an explicitly identified workspace,
never on this repository's own files.

Skills: `/workspace-setup`, `/update-workflow`, `/project-new`, `/project-load`,
`/project-status`, `/project-plan`, `/task-new`, `/task-start`, `/task-complete`,
`/task-board`, `/daily-start`, `/wrap-up`.
In an existing Copilot session use `/skills reload` after deployment.
For Claude Code, restart the session after deployment. `CLAUDE.md` imports
the authoritative `AGENTS.md`; do not maintain two instruction bodies.
See [Harnesses](docs/Harnesses.md) for selection and migration from `.github`.

## Manage and load projects

Use `/project-new`, `/project-status <name>`, `/project-plan <name>` or
`/project-load <name>`. Each is a separate skill rather than a `/project`
subcommand.
New project folders use today's local date without a date question:
`YYYY-MM-DD-project-name`. Existing names and historical dates stay unchanged.
Each has a dashboard, one `notes` folder and four task-state folders.
Task and note types are defined in the workspace conventions.

The dashboard's `Workspace state` section describes its Herdr tabs, folders,
panes and additional wiki-linked reading documents. Keep those links in project
notes as well. `/project-new` automatically continues into loading, including
the validated preview and UI/coordinator approval in the creation flow.
Loading checks for an already-open project space first. Otherwise, after review
and explicit approval, the bundled Node.js script creates a space named with the
exact dated project slug. Its first tab pairs an interactive AI coordinator
with Neovim: the tree stays rooted at the private workspace, focused on the
project folder, with `PROJECT.md` open. Additional declared editor/shell tabs can
use a separate source checkout folder; arbitrary stored commands are not supported.
Existing spaces, including legacy title-named or partial spaces, are preserved.
No live UI is loaded during setup or tests.

The loader selects `.claude/agents/coordinator.md` with `--agent coordinator`.
Choose `--harness copilot|claude` or set `AI_HARNESS` (default: `copilot`).
The preview identifies the harness; use the same selection when applying it.
The project-specific initial prompt lives in `coordinatorPrompt()` in
`project-load/scripts/project-load.mjs`. It includes resolved reading context
and discovered skills, and initially permits inspection/reporting only.

`/project-plan` reads project files and interviews the owner about current status,
evidence, priorities and next steps. It proposes task/status/assignment changes,
then applies only the confirmed plan. Completion still requires every acceptance
criterion to pass. `/project-status` remains read-only.

Tasks use `assignee: me`, `assignee: <agent-name>` or `assignee: null`.
Agent names match existing `.claude/agents/<name>.md` profiles. The
coordinator proposes ready tasks and assignments, dispatches explicitly approved
work, requests worker result reports and reconciles task/dashboard status from
evidence. Assignment is not dispatch approval. Supplied profiles are `coordinator`,
`researcher` for evidence-based comparisons and `verifier` for bounded checks.
Workers write only authorized findings and report back; the coordinator owns
task/dashboard updates. Additional specialists such as `pr-reviewer` or `game-dev`
need their own reviewed definitions. Models are inherited, not pinned in profiles.

See the [load skill](.claude/skills/project-load/SKILL.md),
[layout schema](.claude/skills/project-load/references/Project-workspace.md) and
[coordinator profile](.claude/agents/coordinator.md).
The old `/project` dispatcher is replaced, not deployed alongside these skills.

## Capture a note from speech

After the approved local setup in [Note](docs/Note.md):

```text
note "A long speech-to-text transcript..."
```

The selected AI organizes one Markdown note and recommends an existing workspace
location. The command saves it, then asks you to accept or type revisions.
Cancelling preserves the latest draft. For long input use
`note --file transcript.txt` instead of shell arguments.

Requires Node.js 22+ and an authenticated Copilot CLI or Claude Code, with no npm
dependencies. Both `note` and `aic` accept `--harness copilot|claude`, otherwise
use `AI_HARNESS`, then `copilot`. Windows requires the selected standalone `.exe`;
other platforms use the selected command on PATH.
The source package is private and is linked locally, not published to npm.

## Commit without a review session

After approved command registration, run `aic` in a Git checkout. It commits
staged changes if any exist, otherwise all changes. Local checks stop likely
secrets, accidentally tracked ignored/generated files and conflict debris before
AI sees content. AI supplies the message, not a code review or Git commands.
Use `aic --dry-run` to preview or `aic --harness claude` to select Claude.
Invocation explicitly authorizes that commit scope; other agent sessions still
follow the commit checkpoints policy. See [Aic](docs/Aic.md) for safeguards and limits.

## Improve the workflow and roll it out

From the private workspace, use `/update-workflow` for an AI-guided upgrade.
It locates the separate source checkout (default: `~/dev-workflow`), inspects
both repositories, runs the invocation-authorized fast-forward-only pull and reviews
the source changes against actual deployed files. It proposes context-aware
updates, including existing project migrations, editor changes or tool installs
when warranted, then applies only approved changes and verifies the result.
An unchanged pull does not skip checking for previously undeployed updates.
See the [update skill](.claude/skills/update-workflow/SKILL.md) for safeguards.

1. Make reusable changes here, not only in a deployed copy. If you experimented
   in `$HOME\work` or the live Neovim config, compare and port only the reusable
   changes back here; exclude private project data and machine-specific paths.
2. Test the affected configuration or skill, review the diff, and automatically
   commit the coherent source change. Push only when explicitly requested.
3. On another machine inspect the shared repo's working tree before pulling.
   Resolve local edits first; pull the reviewed changes without force or reset.
4. Compare shared files with their deployed destinations. Ask before replacing
   existing files; merge machine/workspace-specific changes instead of erasing
   them. Update the Neovim lockfile along with its configuration when applicable.
5. Reload skills, restart Neovim and run the relevant checks. Automatically
   commit validated deployment changes in the private workspace separately.

The private workspace does not automatically track shared source changes.
Ordinary files, not symlinks, make both repositories independently usable.
Updating one repository never authorizes a push to the other.

## Commit checkpoints

| Repository | Commit policy |
| --- | --- |
| `dev-workflow` | Automatically commit coherent changes after relevant checks |
| Private workspace, such as `work` | Automatically commit validated task/dashboard, planning, note/log and deployment updates |
| Task code repositories | Show diff, checks and proposed commit scope/message; obtain human review/approval before committing |

Agents commit before handoff, not on every save. Group nested skills into one
checkpoint; coordinators commit their workers' workspace outputs. Read-only runs
and the `note` utility itself create no commits. A checkpoint is not task completion.

Inspect status/staging and the proposed diff; stage only the operation's own
files/hunks, preserving unrelated work. Unclear scope (including an unreviewed
initial snapshot), failed checks or missing identity block the commit. Report
the blocker or the resulting repository/hash. Never commit secrets/private notes
to shared source. Pushes, identity/remotes and history rewrites still need explicit
requests; approval to implement code is not approval to commit it.

## Validation status

The initial editor configuration and lockfile were taken from the working
Windows Neovim installation. Fresh-machine installs and GitHub publishing still
require an actual machine and approved repository destinations. No bootstrap
script, remote configuration or push is performed by this repo. Agents make local
checkpoint commits according to the policy above.

For the Node utilities and project loader, run `npm test`. A synthetic Windows end-to-end check also
verified real Copilot generation, feedback, relocation and acceptance. macOS
execution and a fresh-machine bootstrap have not been tested. The registered
`aic` command also passed a real-Copilot Windows smoke check in a synthetic Git
repository. Claude adapter/launcher contracts are tested without launching
Claude; live Claude behavior is unverified on this machine.
