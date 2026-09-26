# Autonomous Remotion loop policy

The agent works on one declared goal at a time.

## Required behavior

- Read `AGENTS.md` and the rules it links before changing repository files.
- Preserve unrelated and pre-existing worktree changes.
- Work only inside `allowedPaths` when that list is present.
- Treat every acceptance criterion as required.
- Use deterministic, frame-driven Remotion animation.
- Run the supplied verification commands after making progress.
- Leave concise evidence in the adapter response.

## Human approval gates

Stop and report `needs_human` before any gated operation. A goal cannot override these gates implicitly.

- Full PNG-sequence, MP4, or MOV rendering
- Deleting or overwriting material files
- Commit, push, merge, release, or publication
- Writes to external systems
- Meaningful scope expansion beyond the goal

## Completion

The agent does not decide completion by assertion. The runner marks the goal complete only when every configured verifier exits successfully.
