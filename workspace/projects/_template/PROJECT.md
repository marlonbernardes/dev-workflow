---
type: project
project: _template
started: "{{date}}"
created: "{{date}}"
updated: "{{date}}"
tags: [project, example]
---
# Project template

Synthetic reference only, based on the example project's structure. This folder
is not an active project and must not appear on the workspace board.

## Objective

Illustrate a Markdown project with a dashboard, observable tasks and linked notes.
Replace this objective with the real project's confirmed goal.

## Scope

Project notes, decisions, investigations, reusable prompts and task files.
Application code belongs in a separate repository.

## Current status

Example only. Backlog: 2; in-progress: 0; review: 0; done: 0.
These counts describe the sample files, not actual workspace work.

## Current priorities

1. Example: review the proposed workflow with the project owner.
2. Example: verify navigation between the dashboard and its notes.

## Next milestone

Example: the owner confirms the workflow and navigation has recorded evidence.
Neither outcome has been verified.

## Blockers and risks

No actual project has been defined. All sample task criteria remain unchecked.

## Tasks

- Backlog: [[TEMPLATE-001-review-workflow]]
- Backlog: [[TEMPLATE-002-verify-note-navigation]]

## Important documentation

- [Template project overview](notes/guide%20-%20template%20project%20overview.md)
- [Template project decision](notes/decision%20-%20template%20project%20decision.md)
- [Template project investigation](notes/investigation%20-%20template%20project%20investigation.md)
- [Template review prompt](notes/prompt%20-%20template%20project%20review.md)

## Relevant repositories

Not configured. Replace with confirmed repository links; do not nest Git repos.
Link the single repository note at `resources/repositories/<repository>.md`.

## Workspace state

Synthetic desired layout only. Real project folders use `YYYY-MM-DD-<slug>`.
Creation uses today's local date without asking and continues into loading,
with preview and UI/coordinator approval. The space uses the dated folder slug;
the first Neovim tree stays rooted at the workspace and focuses the project.
Declare reading-context wiki links and any additional tabs/folders/panes here.

```json
{
  "version": 1,
  "context": [],
  "tabs": [
    {
      "name": "Project",
      "panes": [
        { "role": "coordinator" },
        { "role": "editor", "file": "PROJECT.md", "direction": "right" }
      ]
    }
  ]
}
```
