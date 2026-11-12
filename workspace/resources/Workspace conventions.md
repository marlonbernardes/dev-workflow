---
type: guide
tags: [workspace, workflow]
---
# Workspace conventions

## Notes and links

Use descriptive, globally unique note names where practical. Link notes as
`[[Note Name]]` or `[[Note Name|readable label]]`. For repeated names such as
PROJECT, use a vault-relative path:
`[[projects/_template/PROJECT|Project template]]`.
Use ordinary relative Markdown links in README files for GitHub rendering.

Obsidian derives backlinks from files. There is no separate backlink database
to maintain. Markdown rendering and Neo-tree do not implement wiki-link
resolution or note creation; verify those workflows separately.

Use YAML frontmatter with type, local ISO created/updated dates, lowercase tags
and optional aliases. Quote strings containing colons and wikilinks.
Search existing titles, aliases and content before creating a note. Improve an
existing note when possible and do not invent related links.

## Project layout

New project folders are `projects/YYYY-MM-DD-<slug>`, using the current local
calendar date without asking for a date, also recorded as `started`.
Do not invent historical dates for imported projects; confirm before migration.
Keep existing dated folder names stable.
Each project has `PROJECT.md`, `notes` and the four task-state directories.
Use the workspace-wide `daily` folder, not project daily logs.

Project notes share `notes`; there are no separate docs, research, decisions,
prompts or artifacts folders. Add `notes/attachments` only when supporting files
are needed. Keep secrets, unapproved screenshots and build outputs out.
Reusable cross-project explanations belong under `wiki/<category>`.
Each repository has one reference note at
`resources/repositories/<repository>.md`, shared by all projects using that repo.
Name the file after the repository, without a note-type filename prefix or a
per-repository folder. Keep it concise: confirmed local checkout path, purpose
and optional wiki links to other existing repository notes.
Use `resources/templates/Repository.md`; project-specific implementation and
verification context stays in project notes, and reusable guidance belongs in wiki.
Application source code stays outside the workspace.

Use `/project-new`, `/project-status <name>`, `/project-plan <name>` or
`/project-load <name>`. They are separate skills, not `/project` subcommands.
The dashboard's Workspace state describes desired tabs and panes, not process
history. Loading an existing space must not duplicate it; creating a new layout
or coordinator requires a preview and approval.
Creation automatically continues into loading; include approval for the visible
layout and credit-consuming coordinator in that flow, then load immediately.
New Herdr spaces use the exact dated folder slug. The first tab pairs the
coordinator with Neovim rooted at the workspace, focusing the project in Neo-tree.
Declare additional tabs, checkout folders and panes in Workspace state.
Declare additional reading documents there as wiki links and link them in
project notes. Missing or ambiguous context links must be resolved, not guessed.

## Note types

Use `type: note` and a `note_type` from this vocabulary. Name notes
`<note_type> - <descriptive title>.md`; the heading remains a readable title.
Repository reference notes are the filename exception described above.
Where a filename prefix is used, it must agree with the frontmatter.

| note_type | Purpose |
| --- | --- |
| note | General capture that needs no specialized structure |
| decision | Context, alternatives, proposed choice and approval evidence |
| research | Explore options and record sources and findings |
| investigation | Test hypotheses against reproducible observations |
| guide | Maintained explanation or instructions |
| prompt | Reusable AI instructions, not a conversation transcript |

Decision notes start with `status: proposed` and `decision_date: null`.
Capturing speech does not approve a decision. A filename prefix alone never
proves that an experiment ran or a proposal was accepted.
`note` proposes the category, destination and content for review; it writes
only its own note, not tasks, dashboards or logs.

## Decisions and investigations

Use `resources/templates/Architecture decision.md` for proposed decisions.
Mark accepted only after an explicit human decision with evidence and date.
Preserve and supersede earlier decisions rather than erasing history.

Use `resources/templates/Investigation.md` for investigations. Separate confirmed
observations, hypotheses, experiments and conclusions; cite real sources.
Keep project-specific material under its project's notes and reusable notes in wiki.

## Task types

Keep `type: task` to identify the document. Required `task_type` describes the
primary outcome, not the assignee or status:

| task_type | Purpose |
| --- | --- |
| code | Implement, fix or refactor software |
| research | Answer a question or compare options |
| verify | Check behavior and record evidence |
| docs | Write or improve documentation |
| coordination | Obtain feedback, approval or another external action |

Use a `needs-human` tag when human involvement is required; any type can need it.
Do not split a code task just because verification is part of its acceptance.
Legacy tasks missing task_type need a reviewed classification, not a fabricated
outcome or automatic mass rewrite.

## Task ownership and coordination

New tasks require an `assignee` field, independent of status and `task_type`:
`me` for the project owner, a local agent profile's filename stem, or YAML `null`
for unassigned. For example, `assignee: pr-reviewer` requires an existing
`.claude/agents/pr-reviewer.md` profile with a matching frontmatter `name`
if present. Unknown names are unresolved, not permission to invent a profile.
Legacy tasks without the field are reported as unassigned pending review;
do not bulk-assign them. Human involvement can still use the `needs-human` tag.

Agent definitions are Markdown with YAML frontmatter under
`.claude/agents/<name>.md`, not a root `agents` folder. Reusable definitions
live in the shared dev-workflow source and are deployed by reviewed copy.
Supplied profiles are `coordinator`, `researcher` and `verifier`. Other specialist
roles require a separately reviewed definition. Keep profile instructions generic
and private project state in task files/notes. Omit model settings to inherit the
user's choices.

`/project-plan` reads project files and interviews the owner about actual status,
verification evidence, priorities and next steps. It previews new tasks, status
changes, assignments and dashboard edits, then applies only confirmed changes.
An interview answer alone does not establish unperformed technical results.

The coordinator reads ownership and proposes ready tasks, assignments and
missing roles. Dispatch requires explicit approval for the concrete work and
any parallel execution; assignment is not launch approval or proof of a start.
After confirmed dispatch, the coordinator records the execution ID in Verification
and updates the task/dashboard from actual progress. Workers return task ID,
changed files, exact checks/results, blockers and remaining acceptance gaps.
Workers do not edit task/dashboard files; the coordinator serializes those
updates and verifies acceptance before completion. Record blockers in existing
task sections, not an invented status. Preserve `assignee` across status moves.

## Task state

Project folders starting with `_`, including `projects/_template`, are examples,
not backlog. Exclude them from task reports, priorities and ID allocation.
Use the template's structure for new projects, replacing all example content,
project identifiers and date placeholders with confirmed values.

The `backlog`, `in-progress`, `review` and `done` directories are the board.
Task status must match the directory, and ID/basename must remain stable.
Scan every project/status before allocating an ID or moving a task.

Read the task and dashboard, check destination absence, move rather than
duplicate, update status/local date, reconcile directory-derived dashboard
counts and verify one copy with working links. Repair partial moves.

Completion requires real evidence for every criterion. Unchecked, failed or
unverifiable criteria mean not done. Do not tick boxes because completion was
requested. Keep task sections and human text intact.

## Daily work and deployment

Inspect today's existing local-date log before merging meaningful confirmed
activity. Do not conflate planned, attempted, blocked and completed work.

Reusable source files live in the separate dev-workflow repository. Skills
here are project-local deployed copies under `.claude/skills`. Compare and
approve updates; do not overwrite local edits or send personal notes upstream.
Validated deployment changes follow the commit policy below.

## Commit checkpoints

- Automatically commit coherent, validated changes in this private workspace
  and dev-workflow before handoff: task/dashboard updates, planning batches,
  notes/logs and workflow changes. No commit approval or per-save commits.
- Task code repositories: show diff, checks and commit scope/message, then
  obtain human review/approval. Implementation/dispatch approval is not commit approval.
- Inspect status/staging and the exact diff; stage only the operation's own
  files/hunks. Preserve unrelated work. Unclear scope (including an unreviewed
  initial snapshot), failed checks or missing identity block commits; report why.
- Group nested skills into one checkpoint. Coordinators commit workers' workspace
  outputs; workers do not commit. Read-only runs and the `note` utility create no
  commits. Checkpoints do not prove task completion.
- Report repository/hash; record code hashes only after commits exist. No secrets
  or private notes in shared source. Pushes, identity/remotes and history rewrites
  still require explicit requests.
