---
name: task-complete
description: Verify every acceptance criterion before moving a task to done; preserve incomplete tasks and report missing evidence.
---
# Complete task

Use only the private workspace. Read its `AGENTS.md` and conventions; ask for
the workspace path if invoked in dev-workflow.

1. Locate exactly one requested task and read it with the project dashboard.
2. Verify EVERY acceptance criterion using actual files, commands, observed
   results or the explicitly required human review. User intent to finish is
   not evidence. Record precise checks and meaningful limitations.
3. If any criterion is unchecked, failed or unverifiable, do not move to done.
   Explain blockers and keep the current status; use review only when justified
   and approved. Do not tick boxes merely to satisfy the request.
4. If all criteria genuinely pass, record their evidence, check the done
   destination is absent, move the existing task with the same ID/basename,
   and update status and today's local ISO date. Preserve other content.
5. Verify exactly one copy, metadata/directory agreement, task links and actual
   dashboard counts. Repair partial moves immediately and report failures.
6. Do not fabricate a daily completion entry. Checkpoint validated workspace
   changes under its commit policy; this does not authorize code commits.
