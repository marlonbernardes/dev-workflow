# Shared development workflow

This repository is the shared source for editor configuration, project skills,
workspace templates and bootstrap instructions. It is not the personal notes
workspace. Read `README.md` and `docs/Bootstrap.md` before setup or updates.

- Keep personal tasks, daily logs, machine records, credentials and private
  project data out of this repository.
- Ask before installing tools, elevation, deletion, publishing, changing Git
  remotes, creating worktrees or starting parallel agents.
- Do not auto-commit, change Git author identity or push without an explicit
  request. Inspect and preserve existing changes and staging.
- Derive the source root from this file. Ask for the destination workspace
  when unclear; never treat this repository as the task backlog.
- `config/nvim` is authoritative for the portable Neovim baseline.
  `.github/skills` contains project-discoverable workflow skills.
  `workspace` contains seed files for a separate private workspace.
- Project layouts belong in the private project's `PROJECT.md` Workspace state
  section. Deploy the complete project skill with its script and references.
  Never load live UI or launch coordinators as implicit bootstrap/validation.
- Deployment is a reviewed copy, not a symlink or an automatic overwrite.
  Compare existing destinations, preserve local changes and resolve conflicts
  with the user. Changes made to deployed copies do not update this source.
- Validate skills with `copilot skill list --json` from the target repository.
  Validate editor changes with headless Neovim plus the affected behavior.
  Never invent verification or claim that a clean-machine bootstrap was tested.
- Setup and maintenance are AI-guided checklists, not unattended scripts.
- `note` is a cross-platform Node.js utility, not a bootstrap installer. Run
  `npm test` for its focused tests; no third-party dependencies are required.
  Keep the AI proposal step tool-free and filesystem writes confined to the
  command's own note. Document command registration in `docs/Note.md`.
