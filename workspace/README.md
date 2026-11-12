# Personal engineering workspace

This private repository contains actual notes, projects, tasks and daily logs.
Its shared configuration source is the separate `dev-workflow` repository.
Keep this repository connected to your private remote, never to the shared
workflow source's remote. Use the same private repository across your machines.

## Start here

1. Read `AGENTS.md` and `resources/Workspace conventions.md`.
2. Follow `docs/Bootstrap.md` in your separate dev-workflow checkout when
   configuring a machine or refreshing shared configuration.
3. Run `copilot` here. Project skills live in `.github/skills`; use
   `/skills reload` in an existing session after their approved deployment.
4. Use `/project new`, `/new-task`, `/board`, `/daily-start` and `/wrap-up`.
   `/start-task`, `/complete-task` and `/project status <name>` manage existing work.

Run `/update-workflow` here to pull approved changes from the separate shared
source and review an AI-proposed upgrade for this workspace and machine.
It preserves local customization and asks before applying file changes,
migrating project structure or installing tools; it does not commit or push.

Neovim is the supported terminal editor. Space, e toggles Neo-tree; Space, m
toggles Markdown rendering; Ctrl+h/j/k/l move between editor windows.

After approved command registration from dev-workflow, run
`note "speech-to-text..."` to create an AI-organized note and review its location.
Use `note --file transcript.txt` for long input. Feedback revises only that note;
cancelling keeps the latest draft. See `docs/Note.md` in the shared source.

## Load a project in Herdr

Use `/project load <name>` to check for an already-open project space. If none
exists, preview the desired layout from `PROJECT.md` and approve creation of
its tabs/panes and interactive Copilot coordinator. By default, the coordinator
opens beside Neovim with the dashboard loaded, both in this workspace.
It reads the project, reports actual task state and lists available project
skills; it does not start implementation or other agents on its own.

The Workspace state section is a declarative recipe, not a process backup.
See `.github/skills/project/references/Project-workspace.md` after deployment.
`/project` accepts `new`, `status` and `load` arguments; custom subcommand
autocomplete is not documented by this CLI build.

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
| `resources/repositories/<repository>` | Shared reference documents about one source repository |
| `.github/skills` | Deployed, versioned project skills |
| `inbox` and `archive` | Unprocessed and inactive material |

Example notes and `.gitkeep` files preserve the seed's directory layout in Git.
Application source repositories should live outside this notes repository.

Shared skill/convention edits should be ported back to dev-workflow after
review. Never copy personal data back to the shared source. Do not auto-commit,
change Git identity, configure remotes or push without explicit authorization.
