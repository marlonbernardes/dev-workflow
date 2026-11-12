# Aic: commit and get out of the way

```text
aic
aic --harness claude
aic --dry-run
```

Requires Git, Node.js 22+ and an authenticated Copilot CLI or Claude Code.
Select `--harness copilot|claude`, otherwise `AI_HARNESS`, then `copilot`.
Registration is shared with `note`: inspect command conflicts and npm's prefix,
then obtain approval for `npm link --offline --ignore-scripts --no-audit --no-fund`
in this checkout. See [Note](Note.md). Until registered, use `node bin/aic.mjs`
from this checkout, or its absolute path from another repository.

## What it does

1. Inspect Git status and refuse conflicts or an unfinished merge/rebase.
2. Select the existing staged snapshot if nonempty, otherwise snapshot all tracked
   and untracked nonignored changes, including deletions. An initial commit works.
   Partial staging is respected: unstaged edits and untracked files stay out when
   anything is staged. Run from any subdirectory of the checkout.
3. Locally inspect the full selected blobs, not just changed lines, for likely
   credentials/tokens, conflict markers, generated/local filenames and files
   matching ignore rules despite being staged/tracked. Binary files, symlinks,
   submodules and oversized scopes require manual inspection. Findings stop the
   command before sending content to AI or changing staging.
   Removed diff lines and recent commit subjects are also checked for recognizable
   secrets; removing a committed secret may therefore require a manual commit.
4. Send filenames, a diff summary, five recent commit subjects and at most
   64,000 diff characters to the selected AI. It returns an imperative message
   matching local style and may flag conspicuous mistakes. This is not a code
   review: it does not critique design, run tests or modify files. AI warnings
   stop the commit rather than silently dropping files.
5. Print the scope/message and commit without another confirmation. Invocation
   authorizes the described scope, including in task code repositories. A
   harness-specific co-author trailer is added. Normal Git hooks and signing
   remain enabled. No pushes, amendments, remote/identity edits or history rewrites.

`--dry-run` performs the same inspection and AI request, but leaves HEAD and the
real index unchanged. Clean worktrees do not call AI. To narrow scope, stage the
files/hunks yourself and rerun. To override a false positive, inspect and commit
manually; there is deliberately no "ignore all warnings" switch.

## Boundaries and failure handling

The AI receives only supplied data and has no built-in/MCP tools. It runs in an
empty temporary directory through the same adapter as `note`. This is not an OS
sandbox; configured CLI/admin policy and authentication still apply.

Selected content goes to the chosen provider and may enter its logs/history.
The local checks are conservative heuristics, not an exhaustive secret scanner,
malware scanner or guarantee that proprietary content is safe to send. Do not
run this command on content your organization prohibits sending. Known-pattern
findings report paths/reasons, never the detected value.

Inspection stops above 1000 changed paths, 2 MiB per blob or 16 MiB total blob
content. Oversized diffs fail explicitly if Git's bounded output limit is hit.
AI context truncation is disclosed to the model; the local content scan is never
silently truncated. Large/binary legitimate changes can be committed manually.
Existing secrets elsewhere in the unchanged tree are not scanned.

An alternate temporary index leaves real staging untouched during inspection,
AI errors and dry runs. Before committing, an exclusive real-index lock protects
against concurrent staging, HEAD is checked, and an all-files snapshot is
rechecked. If files/staging changed, rerun rather than committing a stale proposal.
Do not run concurrent commit/history operations; this is not a repository-wide
transaction against external processes.

Hook/signing failures leave the original index intact. Hooks still run with
normal Git powers and inherit the temporary index, so their own edits or external
effects are not rolled back. If a hook changes the committed tree, or index
synchronization fails after committing, the command reports the existing commit
hash and an error. Inspect before retrying; do not assume failure means no commit.

## Checks

`npm test` covers real Git operations in synthetic temporary repositories:
initial/all-files commits, staged-only/partial staging, literal filenames,
renames/deletions, ignored files, secrets outside diff context, dry runs,
concurrent edits/staging, AI failures and rejecting hooks. AI output is stubbed.
Adapter tests cover both CLI contracts without consuming credits. Live Claude
and macOS execution require separate machine checks.
