# Bootstrap a development workspace

This is an AI-guided checklist, not an unattended installer. Read the source
repository's `AGENTS.md` first. Work through each phase, record observed results
in the private workspace only, and stop on failure. Never infer completion from
a file existing.

## 1. Confirm destinations and inspect

- Confirm OS, source directory and private workspace directory. Defaults are
  `$HOME\dev-workflow` and `$HOME\work`, but derive actual roots from their
  `AGENTS.md` files, not a hard-coded username.
- Ask for the shared repository URL and the existing private workspace URL
  when they are needed. Do not invent URLs, create GitHub repositories, publish
  data or change remotes without approval.
- On the first machine, the private workspace may have no remote yet. Preserve
  its files, staged changes and history. On later machines, clone that same
  private workspace repository rather than creating a different one.
- Inspect existing tool versions, Neovim config, project skill locations,
  files and Git status/remotes. Do not read secrets or private credential stores.
- Existing local work is not a disposable template. Never delete `.git`,
  run a hard reset or replace an existing directory to get a "clean" setup.

If Git or the chosen AI CLI is missing, a person must install/authorize them using current
official instructions before those tools can run this checklist. An AI agent
cannot bootstrap its own unavailable runtime. The agent can handle later steps.

## 2. Install only missing approved tools

Ask before installation and elevation. The Windows package commands are:

```powershell
winget install --id Git.Git --exact --source winget
winget install --id Neovim.Neovim --exact --source winget --scope machine
winget install --id BurntSushi.ripgrep.MSVC --exact --source winget --scope user
winget install --id Microsoft.PowerToys --source winget
```

PowerToys is optional; install it only when requested.

The Neovim installer may require administrator approval. Reopen terminals to
refresh PATH and verify `git --version` and `nvim --version`. Require Neovim 0.12
or newer for `vim.pack`. Inspect its runtime for `markdown` and `markdown_inline`
parsers before assuming they are bundled on a different distribution.
Verify `rg --version` in the terminal that will launch Neovim, not only inside
an agent's tool environment. Restart the terminal host if it still has an old
PATH after installation.

Install Herdr app/core and the selected Copilot CLI or Claude Code only if needed and approved; consult
their current official install instructions rather than guessing package IDs.
Obsidian is optional for graphical vault and wiki-link navigation.
Do not install Basalt, standalone Vim, Vundle, a separate Neovim package manager
or parser build tools for this baseline.

This checklist is validated against Windows paths and winget. On another OS,
ask before selecting the package manager and use that OS's Neovim config path;
do not run Windows install commands there.

## 3. Deploy the editor baseline

- Source: `config/nvim/init.lua` and `config/nvim/nvim-pack-lock.json`.
- Windows destination: `%LOCALAPPDATA%\nvim`.
- Inspect existing destination files first. For absent files, create the
  directory and copy the approved source files. For existing files, compare
  diffs, ask before overwriting, and merge or make a named backup with approval.
- Keep configuration and lockfile together. A local deployment edit is not an
  automatic edit of the shared source.
- Start Neovim and approve the packages in `vim.pack`: Catppuccin, Neo-tree,
  plenary, nui, render-markdown, obsidian.nvim and Gitsigns. Do not bypass the install
  confirmation.
- Default theme is Catppuccin Mocha. There is no dependency on the old `.vimrc`.
- Obsidian-style navigation uses obsidian.nvim in `~/work`, or the directory
  specified by `NOTE_WORKSPACE`. Set that variable before starting Neovim if
  the private workspace is elsewhere. Install/approve ripgrep if missing;
  vault search and note resolution use it. Obsidian's desktop app is optional.
- Existing Markdown rendering stays with render-markdown; obsidian.nvim's UI
  and footer are disabled. Automatic frontmatter updates are disabled so it
  does not add IDs or rewrite task metadata on save.

## 4. Prepare the separate private workspace

Prefer cloning the existing private workspace on a new machine. Only if no
workspace exists yet, create its directory and seed from `workspace/` after
approval. Copy individual files; never overwrite existing notes or instructions
wholesale. Do not copy this shared repo's `.git` or its source-specific
`AGENTS.md` into the private workspace.

Ensure these directories exist, preserving any contents:

```text
archive
daily
inbox
wiki\concepts
wiki\engineering
wiki\decisions
wiki\people
projects
resources\repositories
resources\templates
```

The seed includes synthetic notes and `projects/_template`, with `.gitkeep`
files preserving otherwise empty task directories. Review examples before
copying; they are optional reference material, not actual tasks or logs.
Underscore-prefixed project folders are excluded from boards and priorities.
Git does not preserve empty directories without a tracked file; recreate any
missing directories during setup. Do not create fake completed tasks or sample
projects in a user's real backlog.
Keep application source repositories outside both repositories.

## 5. Deploy project-local skills and agents

- Source: `.claude/skills` in this repository.
- Destination: `.claude/skills` in the private workspace.
- Review existing skills with the same names, including `.agents/skills`,
  legacy `.github/skills` and personal skill locations. Do not erase unrelated skills
  or add duplicate personal copies.
- Copy each absent skill directory, including its `SKILL.md` and reference
  assets, and approved updates under `<workspace>\.claude\skills\<name>`.
  Deploy `project-new`, `project-load`, `project-status` and `project-plan`.
  The complete `project-load` skill includes `scripts/project-load.mjs` and
  `references/Project-workspace.md`. Keep files versioned in the private
  workspace. Merge conflicts instead of replacing that whole directory.
  On upgrades, review removal of the obsolete `project` dispatcher, `new-project`
  and save/restore skill copies; compare any pre-existing `project-status`
  customization before merging. Do not silently delete local customizations.
- Source agent profiles: `.claude/agents`. Deploy reviewed profiles to
  `<workspace>/.claude/agents`, including `coordinator.md`,
  `researcher.md` and `verifier.md`. Preserve
  unrelated agents; keep the filename stem and frontmatter `name` consistent.
  Do not duplicate these as personal-global profiles or launch agents as a check.
- Follow `docs/Harnesses.md` for reviewed legacy `.github` migration, duplicate
  removal and the `workspace/CLAUDE.md` instruction bridge. Deploy it alongside
  the private workspace's `AGENTS.md`, preserving existing Claude instructions.
- For Copilot run `copilot skill list --json` from the workspace. In an existing interactive
  session use `/skills reload`; verify skill names, descriptions and project
  paths. No `~/.copilot/skills` registration is needed.
  For Claude restart the session and inspect `/skills` and `/agents` instead.
  Do not install a second harness just to validate the selected one.
- If an agent sees task skills in this shared source repo, it must ask for the
  actual private workspace path before writing tasks or logs.
- Project layouts live in each private project's `PROJECT.md` Workspace state
  section. Do not create live layouts or launch coordinators during setup.
  `/project-load` requires a preview and approval for UI changes and the chosen AI coordinator.
  Preserve legacy private snapshots; removing their old skills does not
  authorize deleting private state files.

## 6. Register the Note and Aic commands

Follow `docs/Note.md` after the private workspace exists. Inspect `node --version`,
`npm --version`, the selected CLI's `--version`, existing `note`/`aic` commands and npm's global
prefix first. Require Node.js 22+; ask before installing missing tools.

Ask before running `npm link --offline --ignore-scripts --no-audit --no-fund`
from this source checkout. It links the private local package; there are no
dependencies to download. Do not publish it to npm or use administrator access
to work around a prefix permission error. The source checkout must remain in
place for the linked command.

Check `note --help`, `aic --help` and `npm test`. See `docs/Aic.md` for its
staged-first scope and safety limits. Select `--harness copilot|claude` or set
`AI_HARNESS`. Real generation uses the selected AI
account and consumes AI credits; use only approved synthetic content for a smoke
test, and keep it outside real notes/repositories. On Windows the selected
standalone `copilot.exe` or `claude.exe` must be on PATH; elsewhere use the
selected command on PATH. Registration is shared; no extra package is required.

The command defaults to the current private workspace or `~/work`; pass
`--workspace` or set `NOTE_WORKSPACE` for another location. It never writes
notes into the shared dev-workflow repository.

## 7. Verify behavior

- Confirm Neovim starts without errors and `:colorscheme` reports
  `catppuccin-mocha`.
- Open an existing Markdown file. Confirm rendering and Space, m toggling.
- Space, e opens/closes Neo-tree; it reveals the current file.
- Ctrl+h/j/k/l move focus between sidebar and editor splits.
- Space, w saves; Space, q closes the current window.
- Gitsigns shows changed-line markers in tracked Git files. `]c` / `[c` jump
  between hunks, preserving native navigation in diff windows.
  Space, g, p previews a hunk; Space, g, d compares the buffer with the index;
  Space, g, D compares with HEAD. Close the comparison pane with `:q`.
  Space, g, b shows line blame. Space, t, b toggles inline blame;
  Space, t, w toggles word-level highlighting.
  Space, g, s stages/unstages a hunk; Space, g, r discards its changes.
  Both also work on selected lines in Visual mode. Discard is destructive;
  verify these actions only on synthetic files, never personal changes.
- In a workspace Markdown note, put the cursor on a `[[Note Name]]` or
  `[[path/to/note|label]]` link and press Enter in normal mode to follow it.
  Ctrl+o goes back; Ctrl+i goes forward. `]o` / `[o` move to the next / previous
  link. `:Obsidian follow_link` follows explicitly; `:Obsidian backlinks` lists
  incoming links. Missing targets prompt before creating a note; cancel if
  you only intended to navigate. Enter also performs the plugin's smart action
  on checkboxes and tags. Test with temporary notes, not actual tasks.
- Use `:checkhealth render-markdown` and `:checkhealth neo-tree`. Report optional
  font/icon/parser warnings accurately rather than calling every warning a
  failure or hiding actual errors.
- Confirm `/task-board` reads actual task files without modifying them. Verify
  templates and all skill paths from the private workspace.
- Wiki-link resolution comes from obsidian.nvim, not Markdown rendering or
  Neo-tree. Verify basename, vault-relative and aliased links, jump-back, and
  preservation of existing frontmatter on save.

After deploying the approved plugins, run the focused integration check from
the shared source repository. It uses a temporary synthetic vault, not private
notes, and exits nonzero on failure:

```powershell
nvim --headless -u NONE -i NONE -c "luafile test\neovim-navigation.lua"
nvim --headless -u NONE -i NONE -c "luafile test\neovim-gitsigns.lua"
```

Set `NVIM_TEST_CONFIG` to an absolute `init.lua` path to test a deployed copy
instead of the source configuration.
The Gitsigns check uses a temporary Git repository and index without making
commits; it verifies attachment, navigation, preview, diff, staging and discard.

Keep any smoke-test files temporary and outside real project tasks, and remove
only specifically identified test artifacts. Do not close the person's editors.

## 8. Check Git separation last

Inspect both repositories independently:

```powershell
git -C "$HOME\dev-workflow" status --short
git -C "$HOME\dev-workflow" remote -v
git -C "$HOME\work" status --short
git -C "$HOME\work" remote -v
```

Substitute actual approved directories if different.

- The shared source's `origin` should be the shared dev-workflow repository.
  Keep it connected; this is how improvements flow back to other machines.
- The private workspace's `origin` should be a different private repository,
  shared across the user's machines. Never point it at dev-workflow.
- If either directory has no Git repository, ask before initialization. If
  a remote is absent or wrong, show the proposed change and ask before adding,
  removing or replacing it. Do not delete history to change the destination.
- Follow README's Commit checkpoints policy for automatic validated commits in
  source/workspace, preserving unrelated edits/staging. Missing identity or
  unclear initial snapshot scope blocks the commit; do not change author identity.
- Task code commits require review/approval. Publishing, hosted repository
  creation, remote changes and pushes still need explicit requests. Review
  staged/unstaged changes for private content before publication.

## 9. Report and maintain

Report actual paths, versions, checks, unresolved items and Git destinations
(or their absence). Never mark blocked steps complete. Store machine-specific
verification in the private workspace, not in this shared repository.

For existing-workspace updates, invoke `/update-workflow` from the private
workspace; `/workspace-setup` remains the new-machine checklist. Deploy the new
skill by reviewed copy first if it is not available yet, then reload skills.
The update skill reviews the source pull and deployed differences, proposes
AI-assisted migrations or machine changes where needed, and asks before applying.
For manual updates, follow README's "Improve the workflow and roll it out" section.
Review changes before copying; never automatically overwrite local files,
discard local edits, pull with force or push either repository.
