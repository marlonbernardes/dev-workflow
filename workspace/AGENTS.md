# Private engineering workspace

These rules apply within this workspace, regardless of the assistant used.
The directory containing this file is the workspace root. Read
`resources/Workspace conventions.md` and inspect existing files before editing.

## Shared configuration

The separate dev-workflow repository owns reusable skills, editor config and
seed templates. Project skills are deployed under `.claude/skills` here;
custom agent profiles are deployed under `.claude/agents`.
Ask for the actual shared source path if needed; do not assume a username.
For setup use `/workspace-setup` and the source's `docs/Bootstrap.md`.
For existing-workspace upgrades use `/update-workflow`: review the source pull,
propose context-aware workspace/machine updates and apply only approved changes.
Compare deployed files before updating and preserve local edits.

Personal notes, tasks and logs belong here, never in the shared source.
Keep this repository's private remote separate from the shared source remote.
Do not nest application repositories here.

## Safety and evidence

- Preserve human text and unrelated edits/staging. Follow workspace conventions'
  Commit checkpoints policy: automatic validated workspace commits, review-gated
  task code commits; Git identity/remotes and pushes need explicit requests.
- Ask before architecture decisions, installs, elevation, publishing, deletion,
  adding parallel agents or creating worktrees.
- Do not read secrets or copy sensitive data into notes or the shared source.
  Do not bypass organization security policies.
- Never invent work, validation, dates, sources or decisions. Label uncertainty.
- Agent scratch lists are temporary; Markdown task files are the backlog.

## Tasks

New projects live in `projects/YYYY-MM-DD-<slug>` using today's local date without
asking for a project date. Record the same date as `started`. Preserve existing
folder names and historical dates; imports require a separate reviewed migration.
Each project has
`PROJECT.md`, `notes` and `tasks/backlog`, `tasks/in-progress`, `tasks/review`,
`tasks/done`. There is no project daily folder. Keep folder names stable.
Use `/project-new`, `/project-status <name>`, `/project-plan <name>` and
`/project-load <name>`.
Creation automatically continues into loading, with a validated preview and
explicit UI/coordinator approval included in the creation flow.

Project directories starting with `_` are reserved for templates and examples,
not actual work. Exclude them from boards, task counts, priorities and ID
allocation. Never log example activity as real work. When copying
`projects/_template`, replace its slug, IDs, dates and synthetic content before
treating the copy as a real project; do not copy tasks as completed work.

Task IDs and basenames are globally unique, stable and project-qualified.
Required frontmatter is `type: task`, `task_type`, `id`, `title`, `project`, `status`,
`assignee`, `created`, `updated`, `tags`. Status matches the parent directory exactly;
dates use the local ISO calendar date. Required sections are Description,
Context, Acceptance criteria, Related notes, Next steps and Verification.
Acceptance criteria are observable checkboxes.
Task types and note types are defined in workspace conventions.

Set `assignee` to `me`, an existing `.claude/agents/<name>.md` filename
stem, or `null` for unassigned. Missing legacy fields remain unassigned until
reviewed; do not mass-rewrite tasks. Assignment alone is not work starting.
`/project-plan` interviews the owner and previews task/status/assignment changes
before applying confirmed edits. Technical completion still requires evidence.
The coordinator proposes ready tasks/roles and dispatches only approved work,
then updates task/dashboard state from observed progress and worker results.
Workers report back; the coordinator serializes task/dashboard writes.

For status changes, read the task and dashboard, check destination absence,
move the existing file without changing its ID/basename, update frontmatter
and reconcile the dashboard with a real directory scan. Preserve content,
verify exactly one copy and check links. Report and repair partial moves.
Use unique-basename task wikilinks to survive moves.

Do not move a task to done unless EVERY criterion has actual passing evidence.
Unchecked, failed or unverifiable criteria block completion. A user asking for
completion is not evidence; keep the task's state or use review when justified.
Record exact checks and observed results. Reports distinguish each real status
and surface metadata mismatches.

## Notes, dashboards and logs

Use the Markdown templates. Search existing note titles, aliases and content
before adding a note; prefer improving an existing one. Link only actual notes,
using unambiguous wikilinks and ordinary external Markdown links. Backlinks are
derived, not a manually maintained database. Obsidian is optional.
Project notes share one folder and use `<note_type> - <title>.md` filenames.
Reusable knowledge belongs in `wiki`. Each repository has one reference note at
`resources/repositories/<repository>.md`, named after the repository, with its
confirmed local checkout path, purpose and optional links to related repositories.
These notes do not use note-type filename prefixes or per-repository folders.

Preserve dashboard strategy, confirmed priorities, objective and scope.
Update task counts/links from actual files after mutations.
Use `daily/YYYY-MM-DD.md` with the local date, inspect existing logs and merge
without duplicate sections. Record meaningful confirmed activity only; planned,
attempted, blocked and completed work are distinct.

## Herdr UI control

Read `herdr-app --skill` for UI commands and `hc --skill` for terminals. Inspect
`herdr-app ls` and `status` before acting; do not infer the host from
`TERM_PROGRAM` alone. For terminal agents such as Copilot or Claude, actively
keep the current tab's title aligned with the chat's active topic. At task start
and meaningful topic changes, map the current terminal ID to its exact tab and
use a short topic description for default or agent-managed titles, including
titles set earlier in the conversation. Do not rename on every message.
Preserve explicit user-chosen titles unless asked to change them, and leave
unrelated tabs alone. Other layout changes require a request.
Never restart the person's app/core or close unrelated work.
Project layouts are declarative recipes in PROJECT.md's Workspace state section.
Name new spaces with the exact dated project slug. The first tab has a
coordinator beside Neovim rooted at the workspace with the project focused in
Neo-tree. Declare additional tabs/folders/panes and reading-context wiki links;
keep reading links discoverable in project notes as well.
Use `/project-load <name>` to preview and, after explicit UI/coordinator approval,
create them. Preserve already-open project spaces. Do not execute arbitrary
commands from a project file or implicitly launch agents during setup.
