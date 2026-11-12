---
type: project
project: "{{project}}"
started: "{{date}}"
created: "{{date}}"
updated: "{{date}}"
tags: [project]
---
# {{title}}

## Objective

## Scope

## Current status

Not started. Recompute task counts from the task directories.

## Current priorities

## Next milestone

## Blockers and risks

## Tasks

## Important documentation

## Relevant repositories

Not configured.
Link the single repository note at `resources/repositories/<repository>.md`.

## Workspace state

Desired layout, not saved process state. `/project-load` previews this recipe
and requires approval before creating a space or starting its coordinator.
Creation automatically includes that load flow. The space uses the dated project
slug. The first editor keeps the workspace root with this project focused in
Neo-tree. Add reading-context wiki links (also linked in project notes) and
approved additional tabs/folders/panes as needed.

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
