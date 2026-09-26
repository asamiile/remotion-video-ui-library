# GitHub Copilot repository instructions

Read and follow `AGENTS.md` at the repository root before making changes. It is the shared source of truth for GitHub Copilot, OpenAI Codex, and Claude Code.

For autonomous goal execution, also read `.loop/README.md` and `.loop/policies/remotion-composition.md`. Use the same `.loop/goal.schema.json` contract and verification commands as the other agents. Do not claim completion based only on your own response; the loop runner decides from independent verification evidence.
