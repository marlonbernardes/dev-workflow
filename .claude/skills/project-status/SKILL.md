---
name: project-status
description: Report one project's objective, priorities, task counts, ownership and verification gaps without modifying files.
---
# Project status

Read-only. Operate only on an identified private notes workspace. Read its
`AGENTS.md` and `resources/Workspace conventions.md`. Ask for the private
destination if invoked in dev-workflow.

1. Resolve the supplied name against actual dashboards and folders; ask when
   missing or ambiguous. Do not select an underscore-prefixed template.
2. Read `PROJECT.md`, its declared context, relevant wiki-linked project notes
   and actual tasks across backlog, in-progress, review and done.
3. Report objective, scope, priorities, next milestone and confirmed blockers
   with file links. Label missing information instead of inventing it.
4. Derive counts from task directories, not dashboard claims. Surface duplicate
   IDs/copies, missing metadata, status-directory mismatches and stale counts.
5. Report each task's `assignee`: `me`, an existing local agent profile name,
   or unassigned. Flag missing legacy fields and unresolved agent names; do not
   silently repair them. Read `.claude/agents` to verify named profiles.
6. Separate planned, active, review and done work. Check completion evidence;
   never infer acceptance from the directory or a checked box alone. Flag
   unverifiable criteria and distinguish recorded prior checks from checks
   performed now. Label suggested next steps and assignments as proposals.
7. Do not edit files, update logs, move tasks, load UI or launch agents.
