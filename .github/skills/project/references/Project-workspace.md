# Project workspace state

The `## Workspace state` section of `PROJECT.md` describes the desired layout,
not a snapshot of running processes. It replaces named save/restore skills.
The loader never captures sessions, buffers, environment values or transcripts.

Include exactly one fenced JSON block under that heading:

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

The space uses the dashboard's title and the private workspace as its folder.
The first pane is the sole coordinator; the second is an editor opening
`PROJECT.md` beside it. Additional tabs can start with an `editor` or `shell`.
Subsequent panes split the preceding pane `right` (default) or `down`.
Limits: eight tabs and sixteen panes total, at most four panes per tab.
Tab names must be distinct.

An editor's `file` is an existing Markdown path relative to the project folder.
Use portable `/` separators in JSON, not absolute paths or `..`. The script
converts to native paths. Hidden paths and symlinks/junctions are rejected.
Shell panes open an ordinary shell in the private workspace; no stored commands
are executed. Unsupported keys/versions/roles fail before UI creation.

The coordinator starts a fresh interactive Copilot session with normal
permission prompts. Its initial message identifies the project and dashboard,
requires reading workspace instructions, asks for an evidence-based status
summary and lists the actually discovered project skills. It must not
implement work, change files or launch other agents until instructed.

From the deployed workspace, the skill runs its bundled script:

```text
node <skill>/scripts/project-load.mjs --workspace <workspace> --project <name>
node <skill>/scripts/project-load.mjs --workspace <workspace> --project <name> --apply
```

Without `--apply`, only inspection occurs. With it, the script checks again for
an existing space. A matching title with an incompatible folder or machine is a
conflict, not permission to reuse or replace it. Ambiguous project titles also
require disambiguation by exact folder name.

The script uses supported Herdr command signatures and argument arrays, not
shell interpolation. It verifies created IDs against the resulting layout and
checks new terminals with `hc get`. A live terminal alone is not proof of
application readiness; unresolved startups are explicitly reported with exit
code 2. A runtime error reports created IDs and leaves partial work visible.
Do not automatically retry uncertain launches or delete partial layouts.

Deploy this entire skill directory, including its script and this reference.
Existing projects need an explicitly reviewed workspace-state addition before
loading. Deployment and automated tests do not prove a live UI launch.
