---
name: project-plan
description: Interview the project owner, reconcile task status from evidence, and propose tasks and assignees before applying approved changes.
---
# Plan project

Operate only on an identified private notes workspace. Read its `AGENTS.md` and
`resources/Workspace conventions.md`. Ask for the private destination if invoked
in dev-workflow. Resolve the supplied project name; ask if missing or ambiguous.
Exclude underscore-prefixed templates.

## Read and establish the baseline

Read the dashboard, declared reading context, relevant wiki-linked project
notes, actual tasks in all four status directories and the task template.
Inspect `.claude/agents/*.md` for available roles; use each filename stem
as its stable assignment name and check that any frontmatter `name` agrees.
Do not assume agents exist from names mentioned in notes.

Derive counts and ownership from actual files. Identify duplicate work, missing
metadata, stale dashboard entries, unresolved assignees, dependencies, blockers
and unchecked or unverifiable acceptance criteria. Separate facts, recorded
prior checks, the owner's reports and assumptions.

## Interview

Use the question tool to ask focused questions in small rounds, adapting to
answers rather than repeating information already confirmed:

- What is the project's current situation, desired outcome and next milestone?
- What changed since the files were updated? Which work was attempted, delivered,
  blocked or actually verified? Request concrete evidence for proposed completion.
- What are the next priorities, scope exclusions, dependencies and decisions?
- Which tasks belong to `me`, an existing named agent, or nobody yet?

Summarize your understanding and resolve material ambiguities before proposing
changes. Do not invent dates, priorities, task prefixes or approved decisions.
An owner's statement can establish an explicitly required human review; it
cannot substitute for unperformed technical checks.

## Propose and confirm

Show a concise proposal containing:

- Existing tasks to retain or update: ID, current/proposed status, assignee,
  reason, acceptance evidence and any remaining gaps.
- New tasks: title, primary `task_type`, scope, observable acceptance criteria,
  dependencies and proposed assignee. Reuse equivalent existing tasks.
- Dashboard changes: confirmed priorities, milestone, blockers and actual counts.

Use `assignee: me`, `assignee: <agent-name>` matching an existing local profile,
or `assignee: null`. A missing legacy field means unassigned pending review.
If a suitable role does not exist, propose its definition separately and leave
the task unassigned; do not fabricate an agent or assign it to the coordinator
merely because that is the only profile.

Ask for confirmation of the proposed file changes. Uncertainty or silence is
not approval. If declined, keep the proposal in the conversation without edits.

## Apply the approved plan

Re-read affected files to preserve intervening edits. Use `/task-new` for approved
new tasks, passing already-confirmed scope, criteria and assignment. Allocate
globally unique project-qualified IDs only after checking all real projects.

Use `/task-complete` for proposed completion: every acceptance criterion needs
passing evidence. Keep unverifiable tasks in their current state, or use review
when justified and approved. For other approved status changes, follow the
workspace move procedure: check destination absence, preserve ID/basename and
content, update status/local date, and verify exactly one copy and working links.
Assignment alone does not mean work has started.

Preserve verification history and unchecked criteria. Reconcile dashboard
counts/links from actual files without replacing strategy or expanding scope.
Report applied, skipped and blocked changes, unresolved evidence and the next
decision. Checkpoint the validated planning batch under the workspace commit
policy. Do not implement the proposed tasks or publish.
