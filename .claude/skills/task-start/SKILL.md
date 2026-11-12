---
name: task-start
description: Move an existing Markdown task to in-progress safely and reconcile its project dashboard with actual files.
---
# Start task

Use the private workspace only. Read root `AGENTS.md` and conventions first;
ask for its root if invoked in the shared source repository.

1. Resolve the requested ID or basename across all statuses. Require exactly
   one task and read it with the project dashboard. Ask on ambiguous selection.
2. Inspect metadata, dependencies, blockers and next steps. Do not claim that
   work has started or prerequisites passed without evidence.
3. For an approved start, check the in-progress destination is absent, move
   the existing file without changing its ID or basename, and set status to
   `in-progress` with today's local ISO updated date.
4. Preserve human text and unchecked criteria. Repair and report partial
   failures instead of leaving directory and frontmatter inconsistent.
5. Rescan task directories, reconcile dashboard counts/links, check moved-file
   links and verify exactly one copy. An already in-progress task is not moved
   again. Do not mark anything done. Checkpoint validated changes under the
   workspace commit policy.
