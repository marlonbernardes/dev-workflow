# Harness portability

The workflow has one set of instructions, skills and agent bodies. Copilot CLI
and Claude Code are adapters, not separate workflows.

| Surface | Shared source / selection |
| --- | --- |
| Instructions | `AGENTS.md`; `CLAUDE.md` imports it with `@AGENTS.md` |
| Skills | `.claude/skills/<name>/SKILL.md`, including scripts/references |
| Agents | `.claude/agents/<name>.md` |
| `note` and `aic` | `--harness copilot|claude`, then `AI_HARNESS`, then `copilot` |
| Project coordinator | Same selection on the bundled project-load script |
| Models and authentication | Inherited from the selected CLI; never silently switched |

`.claude` is intentionally a common discovery location, not a requirement to use
Claude. Current Copilot CLI discovers project-local Claude skills and agents.
Claude tool names in the researcher/verifier profiles are compatible Copilot
aliases. Profile names and task assignees are independent of the harness.
Keep model settings out of these profiles.

The command adapters live in `lib/ai.mjs`. They spawn the selected native CLI
without a shell and supply prompts on stdin. Windows requires `copilot.exe` or
`claude.exe`; other platforms use `copilot` or `claude` on PATH. Missing binaries,
authentication failures and invalid output fail explicitly; there is no provider
fallback or installation attempt.

Copilot proposals disable custom instructions, builtin MCPs and plugin discovery,
and use a nonmatching explicit tool whitelist. Claude proposals use `--tools ""`,
an empty strict MCP configuration, no file-based setting sources, disabled hooks
and no persistent session. They use the normal subscription/authentication
configuration, **not `--bare`**, which bypasses Claude subscription credentials.
Managed settings/policies may still apply. The selected CLI must support these
flags; older unsupported versions fail instead of retrying with broader access.

Interactive coordinators retain normal tools, trust/permission prompts, local
configuration and inherited model settings. Copilot receives `--interactive
<prompt>`; Claude receives a positional prompt. Both select `--agent coordinator`.
The loader's script is self-contained so reviewed deployment need not include
the source package. Its small launch adapter intentionally stays in that script.

## Reviewed migration and deployment

This checkout uses `.claude` now. Existing private workspaces are not changed
implicitly. During `/workspace-setup` or `/update-workflow`:

1. Compare existing `.github/skills`, `.agents/skills`, `.claude/skills`, global
   copies and profile customizations before proposing changes. Legacy agent
   filenames were `.github/agents/<name>.agent.md`; their portable names are
   `.claude/agents/<name>.md`. Keep filename stems, frontmatter names and task
   `assignee` values consistent; no task rewrite is needed.
2. Preview exact source/destination paths and conflicts, then obtain approval
   for reviewed copies/moves/removal of duplicate active definitions. Deploy
   complete directories, not only `SKILL.md`. Merge local customizations.
   Do not duplicate names across discovery directories and rely on precedence.
3. Deploy `workspace/CLAUDE.md` alongside the workspace's own `AGENTS.md`, after
   comparing any existing Claude instructions. Merge existing Claude-specific
   guidance rather than erasing it or replacing workspace instructions with
   the source repo's instructions. No symlinks or personal-global registration.
4. In Copilot run `copilot skill list --json` from the target workspace, verify
   names, descriptions and `.claude` paths, then `/skills reload` in existing
   sessions. Inspect `/agent` for profiles. In Claude restart, then inspect
   `/skills` and `/agents`; confirm the instruction import. An unavailable
   harness is an unverified check, not a reason to install it automatically.
5. Run `npm test` in the source. Never load live layouts or launch coordinators
   as an implicit validation step. Preview the loader with each selected
   harness; actual UI/AI smoke tests need explicit approval.

Historical Copilot verification notes and harness-specific adapters, commands,
flags, environment variables and output parsers remain explicitly named.
Changing their names to "AI" would hide meaningful integration differences.
There is no claim of support for other harnesses yet.

## Primary references

- [Copilot's CLI configuration](https://docs.github.com/en/copilot/how-tos/copilot-cli)
  and its installed CLI documentation describe Claude project discovery.
- [Copilot agent tool aliases](https://docs.github.com/en/copilot/reference/custom-agents-configuration#tool-aliases)
  document the compatible `Read`, `Glob`, `Grep`, `Bash`, `Edit`, `Write` and web names.
- [Claude programmatic usage](https://code.claude.com/docs/en/headless) and
  [CLI reference](https://code.claude.com/docs/en/cli-reference) document print
  mode, tool restrictions, configuration and the bare-mode credential distinction.
