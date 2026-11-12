---
name: daily-start
description: Start the local day's workspace log with confirmed context and proposed priorities based on actual project tasks.
---
# Daily start

Use the private workspace only. Read its `AGENTS.md` and conventions. If invoked
in dev-workflow, ask for the private workspace path before writing anything.

1. Read the local system calendar date. Inspect `daily/YYYY-MM-DD.md` if it
   exists, the daily template, relevant project dashboards and actual active,
   review and backlog tasks. Exclude project directories starting with `_`;
   their example activity is not actual work. Do not read unrelated personal material.
2. Summarize actual active work and blockers. Suggest a short set of priorities;
   distinguish suggestions from priorities the user has accepted.
3. Create today's log from `resources/templates/Daily log.md` only if absent.
   Otherwise merge into existing sections without duplication or loss.
4. Record only confirmed context and label proposed plans. Do not move tasks,
   start agents, create worktrees, invent yesterday's work or mark tasks done.
5. Link existing tasks using unique basenames. Verify the date and log path;
   do not auto-commit.
