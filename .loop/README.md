# Repository loop foundation

This directory defines a bounded autonomous engineering loop for this Remotion repository. A human owns the goal and approval gates. The runner owns iteration, verification, state, budgets, and stopping.

## Request templates

Copy the relevant Japanese prompt template, fill in its blanks, and give it to Codex, Claude, or GitHub Copilot. Each template asks the agent to convert the request into the shared Loop Engineering goal contract.

- [`templates/feature-request.md`](./templates/feature-request.md): general feature work
- [`templates/composition-request.md`](./templates/composition-request.md): Remotion Composition additions
- [`templates/effect-request.md`](./templates/effect-request.md): transparent overlays and transition effects
- [`templates/adjustment-request.md`](./templates/adjustment-request.md): changes to existing features

## Quick start

1. Copy `.loop/goal.example.json` to `.loop/active-goal.json`.
2. Edit the objective, acceptance criteria, allowed paths, verification commands, and limits.
3. Validate it with `pnpm loop:validate -- .loop/active-goal.json`.
4. Preview the checks with `pnpm loop:verify -- --goal .loop/active-goal.json`.
5. Choose an installed agent and run it:

```console
pnpm loop:run -- --agent codex --goal .loop/active-goal.json
pnpm loop:run -- --agent claude --goal .loop/active-goal.json
pnpm loop:run -- --agent copilot --goal .loop/active-goal.json
```

The goal contract, verification, budgets, evidence, and stopping decisions are agent-neutral. Only the adapter changes. The selected CLI must already be installed and authenticated on the machine running the loop.

Runtime evidence is written to `.loop/runtime/<goal-id>/` and is intentionally ignored by Git:

- `state.json`: current terminal or running state
- `attempts.jsonl`: append-only attempt ledger
- `prompt-<n>.md`: exact task handed to the agent
- `agent-<n>.md`: adapter output
- `verification-<n>.json`: command evidence
- `final-report.md`: final status and evidence summary

## Adapter contract

The runner invokes the configured adapter with three positional arguments:

```text
adapter <prompt-file> <response-file> <workspace-root>
```

The adapter must return zero when the agent run itself completed. It may edit files only inside the workspace. Verification and the final completion decision remain the runner's responsibility.

Set `LOOP_AGENT_ADAPTER` to override the adapter without committing personal configuration:

```console
LOOP_AGENT_ADAPTER=/absolute/path/to/adapter pnpm loop:run -- --goal .loop/active-goal.json
```

Included adapters:

- `codex`: OpenAI Codex CLI
- `claude`: Anthropic Claude Code CLI
- `copilot`: GitHub Copilot CLI

Select one with `--agent`, `LOOP_AGENT`, or the uncommitted `.loop/config.local.json`. `LOOP_AGENT_ADAPTER` remains available for a custom adapter and takes precedence over those settings. Every bundled adapter fails clearly when its CLI is unavailable. Keep authentication, model selection, and machine-specific CLI settings outside this repository.

All agents receive the same generated prompt and must read `AGENTS.md` plus the loop policy. `CLAUDE.md` and `.github/copilot-instructions.md` are deliberately thin entry points back to that shared source so repository rules do not drift between products.

## Safety model

- The runner never commits, pushes, merges, deletes files, publishes, or performs a full render itself.
- Verification commands are explicit human-authored commands in the goal file.
- The default goal template runs `npm run lint`, `render.sh check`, and `git diff --check`.
- Attempt, elapsed-time, and no-progress limits always apply.
- A repeated verification fingerprint stops the run as `blocked`.
- Existing worktree changes are included in the prompt and must be preserved.
- Use a dedicated Git worktree for unattended execution when possible.

## Statuses

- `running`: another iteration may run
- `complete`: all verifiers passed
- `needs_human`: adapter requested human judgment or a gate
- `blocked`: repeated no-progress fingerprint or adapter failure
- `budget_exhausted`: attempt or elapsed-time limit reached
- `verification_failed`: `--verify-only` found failing checks
