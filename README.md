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
repository in Copilot and request `/workspace-setup`.

The checklist covers tool installation, Neovim and its plugins, project-local
skills, validation and finally separate Git remote verification. Installation,
elevation, overwrites and Git changes require approval; nothing is auto-committed
or pushed. Existing machines should use the update procedure below instead of
reinitializing their workspace.

## Contents

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Instructions for agents working on the shared source |
| `docs/Bootstrap.md` | New-machine setup and verification |
| `config/nvim/init.lua` | Portable editor configuration |
| `config/nvim/nvim-pack-lock.json` | Tested plugin revisions |
| `bin/note.mjs` and `lib/note.mjs` | Node.js speech-to-text note command |
| `docs/Note.md` | Note command installation, usage, review loop and privacy |
| `.github/skills/<name>/SKILL.md` | Project skills; `.skills` is not a Copilot skill discovery location |
| `workspace/` | Full example workspace, instructions, note templates and `projects/_template` |

Project skills are deployed to `$HOME\work\.github\skills`; no personal-global
skill registration is needed. The source repo also discovers these skills,
but task-management skills must operate on an explicitly identified workspace,
never on this repository's own files.

Skills: `/workspace-setup`, `/update-workflow`, `/project`, `/new-task`, `/start-task`,
`/complete-task`, `/board`, `/daily-start`, `/wrap-up`.
In an existing Copilot session use `/skills reload` after deployment.

## Manage and load projects

Use `/project new`, `/project status <name>` or `/project load <name>`.
New project folders use today's local date without a date question:
`YYYY-MM-DD-project-name`. Existing names and historical dates stay unchanged.
Each has a dashboard, one `notes` folder and four task-state folders.
Task and note types are defined in the workspace conventions.

The dashboard's `Workspace state` section describes its Herdr tabs, folders,
panes and additional wiki-linked reading documents. Keep those links in project
notes as well. `/project new` automatically continues into loading, including
the validated preview and UI/coordinator approval in the creation flow.
Loading checks for an already-open project space first. Otherwise, after review
and explicit approval, the bundled Node.js script creates a space named with the
exact dated project slug. Its first tab pairs an interactive Copilot coordinator
with Neovim: the tree stays rooted at the private workspace, focused on the
project folder, with `PROJECT.md` open. Additional declared editor/shell tabs can
use a separate source checkout folder; arbitrary stored commands are not supported.
Existing spaces, including legacy title-named or partial spaces, are preserved.
No live UI is loaded during setup or tests.

The coordinator prompt lives in `coordinatorPrompt()` in the project skill's
`scripts/project-load.mjs`. It includes resolved reading context and discovered
skills, and initially permits inspection/reporting only.

See the [project skill](.github/skills/project/SKILL.md) and its
[layout schema](.github/skills/project/references/Project-workspace.md).
This CLI build does not document custom argument autocomplete like built-in
`/skills`; `/project` dispatches text arguments without claiming native
subcommand completion. The previous creation/status and save/restore skills
are replaced, not deployed alongside it.

## Capture a note from speech

After the approved local setup in [Note](docs/Note.md):

```text
note "A long speech-to-text transcript..."
```

Copilot organizes one Markdown note and recommends an existing workspace
location. The command saves it, then asks you to accept or type revisions.
Cancelling preserves the latest draft. For long input use
`note --file transcript.txt` instead of shell arguments.

Requires Node.js 22+ and your authenticated Copilot CLI, with no npm dependencies.
On Windows use the standalone `copilot.exe`; on macOS use `copilot` on PATH.
The source package is private and is linked locally, not published to npm.

## Improve the workflow and roll it out

From the private workspace, use `/update-workflow` for an AI-guided upgrade.
It locates the separate source checkout (default: `~/dev-workflow`), inspects
both repositories, requests approval for a fast-forward-only pull and reviews
the source changes against actual deployed files. It proposes context-aware
updates, including existing project migrations, editor changes or tool installs
when warranted, then applies only approved changes and verifies the result.
An unchanged pull does not skip checking for previously undeployed updates.
See the [update skill](.github/skills/update-workflow/SKILL.md) for safeguards.

1. Make reusable changes here, not only in a deployed copy. If you experimented
   in `$HOME\work` or the live Neovim config, compare and port only the reusable
   changes back here; exclude private project data and machine-specific paths.
2. Test the affected configuration or skill, review the diff, and commit and
   push this repository only when explicitly requested.
3. On another machine inspect the shared repo's working tree before pulling.
   Resolve local edits first; pull the reviewed changes without force or reset.
4. Compare shared files with their deployed destinations. Ask before replacing
   existing files; merge machine/workspace-specific changes instead of erasing
   them. Update the Neovim lockfile along with its configuration when applicable.
5. Reload skills, restart Neovim and run the relevant checks. Changes deployed
   into the private workspace belong to its own separately reviewed commit.

The private workspace does not automatically track shared source changes.
Ordinary files, not symlinks, make both repositories independently usable.
Updating one repository never authorizes a push to the other.

## Validation status

The initial editor configuration and lockfile were taken from the working
Windows Neovim installation. Fresh-machine installs and GitHub publishing still
require an actual machine and approved repository destinations. No bootstrap
script, remote configuration, automatic commit or push is performed by this repo.

For the Note utility, run `npm test`. A synthetic Windows end-to-end check also
verified real Copilot generation, feedback, relocation and acceptance. macOS
execution and a fresh-machine bootstrap have not been tested.
