# AI Agent Tool Usage & Token Efficiency

## Context

This repository's composition and config files are large and edited frequently by AI agents. Defensively reading a file again before every Edit call significantly increases token consumption without improving correctness — the Edit tool already fails loudly (with a clear error) if `old_string` doesn't match, so redundant reads add cost without adding safety.

This guide ensures efficient use of Read/Edit tool calls across all AI agents working in this repo.

## Read-Before-Edit Policy

### File Reading: When NOT to Read

Skip reading (or re-reading) a file before an Edit call if:

- **File already read in this conversation**: Earlier in the same session, you've already called Read on this file, and no external modification has been reported via `<system-reminder>` since then.
- **Content already visible in system-reminder**: A `<system-reminder>` block already shows the file's current content or a diff-style change summary.
- **Edit just succeeded**: You successfully executed an Edit call on this file in the immediately preceding turn. Success means the file now contains your intended changes — a verification Read is unnecessary.

### File Reading: When TO Read

Do read (or re-read) a file:

- **Never read in this conversation**: This session's first interaction with the file requires an initial Read before any Edit.
- **External modification reported**: A `<system-reminder>` indicates that the user, a linter, or another process has modified the file since you last saw it.
- **Confidence degraded over time**: Multiple turns have passed (e.g., >3 edits to other files, context compression, etc.) and you're uncertain about exact current whitespace, line numbers, or small formatting details.
- **Edit call just failed**: The previous Edit attempt returned an error (`old_string` not found or not unique). To fix it, get the current precise content via Read.

### Large Files: Targeted Reads

When working with large files (`src/root-*.tsx`, `render.sh`, `config/local/composition-text.example.json`, etc.):

- If you've already narrowed the target to a specific section (via grep, comments, line numbers, or prior context), use the `offset` and `limit` parameters of the Read tool to fetch only the relevant lines, rather than reading the entire file.
- This technique pairs well with the "read only when necessary" principle above — targeting a small section costs less than a full file read.

## Summary

**The goal**: Minimize token consumption while maintaining correctness. The Edit tool's error handling is robust — trust it, and avoid defensive reads.

| Scenario | Action |
|----------|--------|
| First time seeing this file | **Read** it |
| Already read earlier this turn, no external change reported | **Skip Read**, go straight to Edit |
| System-reminder shows the current diff | **Skip Read**, go straight to Edit |
| Edit just succeeded | **Skip Read** |
| Edit just failed (old_string not found) | **Read** to see current content |
| Uncertain about exact whitespace after several turns | **Read** to confirm |
| Working with a large file and know the target section | **Read with `offset`/`limit`** to fetch only that section |
