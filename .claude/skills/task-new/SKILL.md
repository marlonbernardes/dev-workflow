---
name: task-new
description: Create a backlog task with a globally unique project-qualified ID and observable acceptance criteria.
---
# New task

Operate only in the private notes workspace. Read its root `AGENTS.md` and
`resources/Workspace conventions.md`; ask for that workspace if invoked in the
shared dev-workflow repository.

1. Identify the project and read its dashboard and `resources/templates/Task.md`.
   Read the Task types section in workspace conventions. Choose the primary
   outcome's `task_type`: code, research, verify, docs or coordination.
   Ask for missing scope and acceptance decisions instead of inventing them.
2. Search existing tasks for equivalent work and scan IDs across all projects
   and all statuses, excluding underscore-prefixed project templates. Reuse a
   duplicate task rather than creating another.
3. Use the project's existing ID prefix or ask for one. Allocate an unused
   project-qualified ID; verify the exact filename does not already exist.
4. Create one stable `<ID>-<slug>.md` in the project's `tasks/backlog`.
   Set type: task, task_type, id, title, project, status, assignee, local
   created/updated dates and tags. Use `assignee: me` for the owner, an existing
   `.claude/agents/<name>.md` filename stem for an approved agent assignment,
   or `assignee: null` if unassigned. Check any profile `name` agrees; ask about
   unknown names rather than inventing profiles. Preserve assignments already
   confirmed during `/project-plan`. Assignment does not start work.
   Use a needs-human tag for required human involvement.
5. Preserve every required section. Write actionable unchecked acceptance
   criteria, confirmed context, actual related links and feasible next steps.
   Verification starts as not yet verified.
6. Rescan task directories, update dashboard counts and the task link without
   replacing human strategy, then verify metadata and ID uniqueness. Checkpoint
   task/dashboard changes together under the workspace commit policy.
