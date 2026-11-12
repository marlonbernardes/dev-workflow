# Shared development workflow

This repository is the shared source for editor configuration, project skills,
workspace templates and bootstrap instructions. It is not the personal notes
workspace. Read `README.md` and `docs/Bootstrap.md` before setup or updates.

- Keep personal tasks, daily logs, machine records, credentials and private
  project data out of this repository.
- Ask before installing tools, elevation, deletion, publishing, changing Git
  remotes, creating worktrees or starting parallel agents.
- Automatically commit validated checkpoints here; follow README's Commit
  checkpoints policy. Preserve unrelated edits/staging. Task code commits need
  review/approval; Git identity/remotes and pushes need explicit requests.
- Derive the source root from this file. Ask for the destination workspace
  when unclear; never treat this repository as the task backlog.
- `config/nvim` is authoritative for the portable Neovim baseline.
  `.claude/skills` contains project-discoverable workflow skills and
  `.claude/agents` contains reusable custom agent profiles.
  `workspace` contains seed files for a separate private workspace.
- Project layouts belong in the private project's `PROJECT.md` Workspace state
  section. Deploy the complete project-load skill with its script, references
  and the coordinator profile. Keep the four project skills separate.
  Never load live UI or launch coordinators as implicit bootstrap/validation.
- Deployment is a reviewed copy, not a symlink or an automatic overwrite.
  Compare existing destinations, preserve local changes and resolve conflicts
  with the user. Changes made to deployed copies do not update this source.
- Validate Copilot skills with `copilot skill list --json` from the target
  repository; for Claude verify `/skills` and `/agents` after restarting.
  Validate editor changes with headless Neovim plus the affected behavior.
  Never invent verification or claim that a clean-machine bootstrap was tested.
- Setup and maintenance are AI-guided checklists, not unattended scripts.
- `note` and `aic` are cross-platform Node.js utilities, not bootstrap installers.
  Run `npm test`; no third-party dependencies are required. Shared tool-free
  harness adapters live in `lib/ai.mjs`; select via `--harness` or `AI_HARNESS`.
  Keep the AI proposal step tool-free and filesystem writes confined to the
  command's own note. Document command registration in `docs/Note.md`.
- `.claude` is the canonical shared discovery layout for both harnesses.
  `CLAUDE.md` imports `AGENTS.md`; keep instructions in one authoritative body.

## Agent tab titles

For terminal agents such as Copilot or Claude, actively keep the current tab's
title aligned with the chat's active topic. Update it at task start and meaningful
topic changes, not on every message.
Read `herdr-app --skill` and `hc --skill`, then inspect `herdr-app ls` and
`herdr-app status`. Map the current terminal ID to its exact tab before renaming;
never infer the target from window focus or `TERM_PROGRAM` alone.
Use a short topic description for default or agent-managed titles, including
titles set earlier in the conversation. Preserve explicit user-chosen titles
unless asked to change them, and leave unrelated tabs alone.
Other layout changes require a request. Never restart the person's app/core or
close unrelated work.
