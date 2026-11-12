# Using the project template

This is a synthetic reference, not a project to start or complete.

1. Choose a unique project slug without a leading underscore, confirm its actual
   start date and choose an unused project-qualified task ID prefix.
2. Use `/project new` to create `YYYY-MM-DD-<slug>` and its dashboard from
   `resources/templates/Project.md`, or copy this folder's structure manually
   without overwriting existing files.
3. Replace `_template`, `TEMPLATE`, `{{date}}`, `{{start_date}}`, titles and example text with
   confirmed values. Use local ISO dates, not the dates of a copied example.
4. Create only real tasks from `resources/templates/Task.md`. Leave the sample
   tasks here; do not carry them into the real backlog.
5. Update note names, links, dashboard counts and priorities from actual files.
   Decisions start proposed; completion requires evidence.

The four task directories are the board. The three empty statuses contain
`.gitkeep` files only so Git preserves their layout. Guides, decisions,
investigations and prompts share `notes`, with note-type filename prefixes.
There is no project daily folder; use the workspace-wide daily log.
The dashboard's Workspace state describes loadable Herdr tabs and panes.
Reusable conclusions can become linked notes under the workspace's `wiki` folder.
