---
type: note
note_type: guide
tags: [workflow, example]
aliases: []
---
# Example task state model

## Summary

A task's directory and frontmatter describe the same state.

## Explanation

`backlog` means not started, `in-progress` means active, `review` means awaiting
review and `done` requires evidence for every acceptance criterion. A status
move preserves the ID and basename and updates the dashboard.

## Examples

[[TEMPLATE-001-review-workflow]] illustrates unchecked criteria in backlog.
It is a template task, not actual work.

## Related notes

- [[guide - example evidence-led notes]]

## Sources and evidence

- [[resources/Workspace conventions|Workspace conventions]]
