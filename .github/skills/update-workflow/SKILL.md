---
name: update-workflow
description: Pull shared dev-workflow changes, assess their impact on the private workspace and machine, and apply approved AI-assisted updates while preserving local work.
---
# Update workflow

Run this from the private workspace to bring its workflow up to date with the
separate dev-workflow source. This is an AI-guided upgrade, not a bulk copy or
an unattended migration. Changes may affect skills, conventions, templates,
existing project structure, editor configuration or required tools. Inspect
what actually changed before deciding which actions are needed.

## 1. Locate and inspect

- Identify the private workspace from the invocation directory and its
  `AGENTS.md`; read that file and `resources/Workspace conventions.md`.
  If invoked from the shared source or the workspace is ambiguous, ask for
  the private destination before proceeding.
- Resolve the current user's home directory. Use an explicitly supplied source
  path, otherwise inspect the default `$HOME\dev-workflow` on Windows or
  `~/dev-workflow` on other systems. If absent or not the expected repository,
  ask for its location; do not clone, initialize or change remotes implicitly.
  Never derive the source root from this deployed skill's directory.
- Verify the two Git roots are distinct and not nested. Read the source
  `AGENTS.md`, `README.md` and `docs/Bootstrap.md`. Inspect both repositories'
  branch, status (including untracked files), staged changes and remotes without
  changing them. Do not copy private content into the shared repository.
- Require a clean source checkout, an existing HEAD, an attached branch and
  a configured upstream before pulling. If any is missing, stop and explain
  what needs resolution. Do not stash, stage, commit, reset, clean, switch
  branches or discard edits to make the pull possible. A dirty private workspace
  is not permission to discard work; preserve its initial changes and staging.

## 2. Pull and understand the source changes

- Record the source HEAD as `before`. Show the source path, branch and upstream,
  then obtain approval for `git -C "<source>" pull --ff-only` unless the user
  explicitly authorized that pull already. Do not pull the private workspace.
- Run the approved fast-forward-only pull. On failure or divergence, stop and
  report it; do not retry with merge, rebase, force or a different remote.
  Record the resulting HEAD as `after` and re-read any changed source guidance.
- Review `git log --oneline <before>..<after>`,
  `git diff --name-status <before> <after>` and the relevant file diffs.
  Inspect changed skills with their references, templates, documentation,
  configuration and tool manifests. Follow relevant dependencies rather than
  treating each changed path as an isolated copy operation.
- Summarize the observed changes and their implications. A separate changelog
  is not required. The pull diff explains newly fetched changes, not everything
  missing from this machine: also compare current shared workflow files with
  their actual deployed destinations. An unchanged HEAD does not mean the
  workspace is up to date, and a successful pull is not a successful upgrade.

## 3. Propose the upgrade

- Map source intent to real destinations: `.github/skills` to the workspace's
  project skills, `workspace/AGENTS.md` to its instructions, workspace conventions
  and templates to their counterparts, and editor/tool changes to this OS's
  actual configuration and installed tools. Never deploy the source repository's
  own `AGENTS.md` as workspace instructions.
- Compare before editing. When available, use the old source file at `before`,
  its new version at `after` and the current destination to distinguish shared
  changes from local customization. The old source revision is not proof of
  the version last deployed; without a reliable baseline, label ambiguities
  and ask rather than treating every difference as drift to erase.
- Use AI to adapt changes to the existing workspace, not to replace it with
  the seed. A template change may affect only future projects or may justify a
  migration of existing ones; inspect affected files and propose that choice
  explicitly. Do not recursively rewrite notes or copy synthetic example
  projects, tasks, logs or completed activity into real work.
- Present a concrete plan: source change and reason, affected destination paths,
  proposed edits/moves/install commands, local conflicts, risks and validation.
  Include readable patches for existing text and exact old/new paths for moves.
  Separate straightforward deployment from project/data migrations and machine
  changes. Mark uncertain or inapplicable changes instead of guessing.
- Obtain approval before applying the plan. Ask specifically before tool/package
  installation, elevation, deletion, overwrites or structural migrations.
  Identify the tool, command and purpose; never run new source scripts or
  package lifecycle hooks merely because they arrived in a pull.
  Changes outside the approved plan require another approval.

## 4. Apply only approved changes

- Recheck affected files against the reviewed versions before writing. If they
  changed during review, stop and reconcile. Merge human text and local
  configuration; preserve unrelated files and staging. Do not replace whole
  directories, use symlinks or silently remove obsolete destination files.
- Deploy complete skill directories, including reference assets and scripts.
  The project skill replaces new-project/project-status and the old save/restore
  skills. Propose removal of obsolete deployed copies explicitly; never delete
  a locally customized skill or private state file without approval.
  If updating this skill, finish using the approved plan; the newly deployed
  text does not authorize additional operations in the current run.
- Follow `docs/Bootstrap.md` for affected machine changes, with Neovim config
  and lockfile kept together. Inspect existing command registration and tool
  versions before proposing installs; use the current OS's supported commands.
- For approved project migrations, preserve task IDs, basenames, statuses,
  acceptance criteria, verification evidence and human content. Inspect
  destination collisions, move rather than duplicate, update affected links
  and reconcile dashboards from actual task files. Never infer completion or
  invent missing project decisions to satisfy a new template.
- Never load project UI, rewrite legacy `.workflow-state` snapshots,
  close editors, launch agents, alter Git identity/remotes, commit or push as an
  implicit upgrade step. Those actions need their own explicit requests and
  applicable safeguards.

## 5. Verify and report

- Inspect the resulting destination diffs and both Git statuses, including
  untracked files. Confirm only approved changes were made and prior staging
  was preserved. Re-running comparisons should not propose the same completed
  change again; explain intentional remaining differences.
- For skill updates, run `copilot skill list --json` from the private workspace
  and verify expected names, descriptions and project paths. Tell the user to
  use `/skills reload` in existing sessions. Do not claim discovery from the
  source repository proves deployment to the workspace.
- For editor changes, run the source's headless Neovim checks against the actual
  deployed config and verify affected behavior. For Note changes, run `npm test`
  in the source and verify the registered command as described in `docs/Note.md`;
  real AI generation needs approval. For installed tools, verify actual versions.
- For structural migrations, check exactly one copy of each affected task,
  matching directory/frontmatter status, preserved evidence, actual links and
  accurate dashboard counts. Use synthetic temporary data for behavioral checks,
  not real task completion or UI snapshots.
- Stop on errors and report partial application with exact affected paths and
  recovery options; never undo pre-existing work or hide failed checks. Report
  the source revision range, applied/skipped/blocked items and observed checks.
  No success claim for untested behavior, no automatic changelog or machine
  record in the shared source, and no commits or pushes in either repository.
