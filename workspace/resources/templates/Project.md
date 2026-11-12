---
type: project
project: "{{project}}"
started: "{{start_date}}"
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

## Workspace state

Desired layout, not saved process state. `/project load` previews this recipe
and requires approval before creating a space or starting its coordinator.
Editor paths are relative to this project; all terminals start in the workspace.

```json
{
  "version": 1,
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
