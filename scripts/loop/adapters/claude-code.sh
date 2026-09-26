#!/bin/bash
set -euo pipefail

PROMPT_FILE="$1"
RESPONSE_FILE="$2"
WORKSPACE_ROOT="$3"

if ! command -v claude >/dev/null 2>&1; then
  echo "Claude Code CLI is not installed or not available on PATH." > "$RESPONSE_FILE"
  exit 127
fi

cd "$WORKSPACE_ROOT"
claude --print --permission-mode acceptEdits --output-format text < "$PROMPT_FILE" > "$RESPONSE_FILE"
