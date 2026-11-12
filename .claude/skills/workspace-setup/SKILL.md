---
name: workspace-setup
description: Set up or refresh a machine from dev-workflow using an AI-guided checklist, reviewed file deployment, and separate private workspace Git configuration.
---
# Workspace setup

1. Identify the shared dev-workflow source and the private workspace. Locate
   `docs/Bootstrap.md` in the source; if its location is unknown, ask. Do not
   infer the source root from a deployed copy of this skill.
2. Read source `AGENTS.md`, `README.md` and `docs/Bootstrap.md`. If the private
   workspace exists, also read its `AGENTS.md` and conventions before editing.
3. Execute the checklist in order. For an existing workspace's workflow upgrade,
   use `/update-workflow` instead; it reviews source changes and proposes
   context-aware updates. Ask before installs, elevation, overwrites and remote
   changes; commits follow repository policy.
4. Inspect existing config and skills; compare deployed copies with source.
   Merge approved changes instead of overwriting local work.
5. Validate editor behavior and project skill discovery. Report exact observed
   checks and blockers; do not fabricate successful clean-machine testing.
6. Preserve separate Git repositories. Keep the shared source connected to its
   upstream and personal notes connected only to the private workspace remote.
   Checkpoint validated source/workspace changes under their commit policies.
   Do not create hosted repositories or push without explicit requests.
