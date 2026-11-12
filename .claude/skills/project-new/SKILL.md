---
name: project-new
description: Create a private workspace project, then preview and request approval to load its layout and coordinator.
---
# New project

Operate only on an identified private notes workspace. Read its `AGENTS.md` and
`resources/Workspace conventions.md`. If invoked in dev-workflow, ask for the
private destination; never create personal projects in this shared source.

1. Obtain title, unique slug, objective and scope. Ask for missing decisions;
   do not invent goals or task ID prefixes. Use the current local calendar date
   for the new project's folder prefix and `started`; do not ask for a date.
   Preserve existing dated folders. Historical imports require a separately
   reviewed migration.
2. Search actual project names and dashboards for equivalent work. Exclude
   underscore-prefixed templates; never overwrite a project directory.
3. Use `resources/templates/Project.md` to create
   `projects/YYYY-MM-DD-<slug>/PROJECT.md`. Record the dated folder name as
   `project`, today's local date as `started`, and local creation/update dates.
   Keep this folder name stable after creation.
4. Create `notes` and `tasks/backlog`, `tasks/in-progress`, `tasks/review`,
   `tasks/done`. Do not create project daily/docs/artifacts/decisions folders,
   sample tasks or a nested Git repository. Empty directories can use `.gitkeep`.
5. Preserve the template's `Workspace state` section: one named tab with a
   coordinator beside Neovim rooted at the private workspace, with the project
   folder focused in Neo-tree and `PROJECT.md` available in the editor.
   For additional approved tabs/folders/panes and reading-context wiki links,
   read the sibling `project-load/references/Project-workspace.md`.
   Put linked reading context in project notes; link each repository's single
   `resources/repositories/<repository>.md` note.
6. Scan actual task files, populate counts and links, and use only confirmed
   priorities, milestones and repository references. Label unknowns. Repository
   notes contain the local checkout path, purpose and optional links to related
   repositories, without note-type filename prefixes or per-repository folders.
7. Verify names, metadata and links; checkpoint under the workspace commit policy,
   then invoke `/project-load` for this project.
   Include its validated preview and explicit approval for UI creation and the
   credit-consuming interactive coordinator in this creation flow. Once
   approved, apply immediately; do not require a separate user command.
   File creation alone is not launch approval. If approval is declined, keep
   the created Markdown and report it as not loaded. Do not publish.
