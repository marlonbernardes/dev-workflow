# Personal engineering workspace

This private repository contains actual notes, projects, tasks and daily logs.
Its shared configuration source is the separate `dev-workflow` repository.
Keep this repository connected to your private remote, never to the shared
workflow source's remote. Use the same private repository across your machines.

## Start here

1. Read `AGENTS.md` and `resources/Workspace conventions.md`.
2. Follow `docs/Bootstrap.md` in your separate dev-workflow checkout when
   configuring a machine or refreshing shared configuration.
3. Run `copilot` or `claude` here. Both read `.claude/skills` and `.claude/agents`.
   After approved deployment, use `/skills reload` in Copilot or restart Claude.
   `CLAUDE.md` imports the authoritative `AGENTS.md`.
4. Use `/project-new`, `/task-new`, `/task-board`, `/daily-start` and `/wrap-up`.
   `/project-status <name>` reports state; `/project-plan <name>` interviews you
   and proposes task/status/assignment changes before applying confirmed edits.
   `/task-start` and `/task-complete` manage existing work.

Run `/update-workflow` here to pull approved changes from the separate shared
source and review an AI-proposed upgrade for this workspace and machine.
It preserves local customization and asks before applying file changes,
migrating project structure or installing tools. Validated deployment changes
are committed locally; pushes still need an explicit request.

Neovim is the supported terminal editor. Space, e toggles Neo-tree; Space, m
toggles Markdown rendering; Ctrl+h/j/k/l move between editor windows.

After approved command registration from dev-workflow, run
`note "speech-to-text..."` to create an AI-organized note and review its location.
Use `note --file transcript.txt` for long input. Feedback revises only that note;
cancelling keeps the latest draft. See `docs/Note.md` in the shared source.

## Load a project in Herdr

Use `/project-load <name>` to check for an already-open project space. If none
exists, preview the desired layout from `PROJECT.md` and approve creation of
its tabs/panes and interactive AI coordinator. Select the harness with
`--harness copilot|claude` on the loader, or `AI_HARNESS` (default: `copilot`).
By default, the coordinator
opens beside Neovim with the dashboard loaded, both in this workspace.
It reads the project, reports actual task state and lists available project
skills; it does not start implementation or other agents on its own.

The Workspace state section is a declarative recipe, not a process backup.
See `.claude/skills/project-load/references/Project-workspace.md` after deployment.
The separate project skills replace the old `/project` subcommands.

## Task ownership and agents

Set `assignee` to `me`, an existing agent profile name, or `null` for unassigned.
Profiles live in `.claude/agents/<name>.md`. Supplied roles are `coordinator`,
`researcher` and `verifier`; additional roles such as `pr-reviewer` or `game-dev`
need their own reviewed definitions. The loader selects the coordinator for new
project spaces.
It proposes ready tasks and assignments, dispatches approved work and reconciles
task/dashboard status from worker reports and acceptance evidence. Assignment
alone does not launch work or mark it in-progress.

## Layout

This seed includes synthetic examples, not personal work or completed activity.
Start with [the project template](projects/_template/PROJECT.md). Copy its
structure for a real project; do not treat the template as an active project.
Replace example text and date placeholders with confirmed information.
Top-level `_example.md` notes illustrate placement and are not dated daily logs.

| Path | Purpose |
| --- | --- |
| `projects/<slug>/PROJECT.md` | Project dashboard |
| `projects/<slug>/tasks/<status>` | Backlog, in-progress, review and done task files |
| `projects/<slug>/notes` | Guides, decisions, research, investigations and prompts, with filename prefixes |
| `projects/_template` | Copyable example project; excluded from task reports |
| `wiki/concepts` | Reusable technical concepts |
| `wiki/engineering` | Engineering practices and discoveries |
| `wiki/decisions` | Cross-project decision records |
| `wiki/people` | Optional non-sensitive collaboration guidance |
| `daily` | Lightweight local-date daily logs |
| `resources/templates` | Markdown templates |
| `resources/repositories/<repository>.md` | One note per repository: local checkout path, purpose and optional related-repository links |
| `.claude/skills` | Deployed, versioned project skills |
| `.claude/agents` | Deployed custom agent profiles |
| `inbox` and `archive` | Unprocessed and inactive material |

Example notes and `.gitkeep` files preserve the seed's directory layout in Git.
Application source repositories should live outside this notes repository.

Shared skill/convention edits should be ported back to dev-workflow after
review. Never copy personal data back to the shared source.

Agents automatically commit validated checkpoints in this workspace and
dev-workflow, not every save. Task code repositories require diff/check review
and commit approval. Pushes, Git identity/remotes and history rewrites still
need explicit requests. See workspace conventions' Commit checkpoints section
for scope, staging and coordination safeguards.
