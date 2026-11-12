---
name: task-board
description: Report the private workspace task board from actual directories and frontmatter, without modifying files.
---
# Task board

This skill is read-only. Identify the private workspace and read its `AGENTS.md`
and conventions. Ask for the path if invoked in the shared dev-workflow repo.

1. Enumerate `projects/*/tasks/{backlog,in-progress,review,done}` and read actual
   task metadata. Exclude project directories starting with `_` (templates and
   examples). Group by project and directory status.
2. Report counts, assignees and concise ID/title links for each status. Resolve
   named assignees against `.claude/agents`; flag unknown names and missing
   legacy fields without assigning them. Cite actual task
   paths; do not treat dashboard counts as the source of truth.
3. Detect duplicate IDs/copies, missing required metadata and status-directory
   mismatches. Report malformed files separately instead of omitting them.
4. Distinguish done files from verified completion; flag unchecked criteria in
   done tasks. Never infer completed work from a title or a directory alone.
5. Do not move files, repair dashboards, log activity or commit as part of this
   report. Ask before taking corrective actions.
