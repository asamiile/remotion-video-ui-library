#!/bin/bash
set -euo pipefail

PROMPT_FILE="$1"
RESPONSE_FILE="$2"
WORKSPACE_ROOT="$3"

if ! command -v codex >/dev/null 2>&1; then
  echo "Codex CLI is not installed or not available on PATH." > "$RESPONSE_FILE"
  exit 127
fi

cd "$WORKSPACE_ROOT"
codex exec --full-auto --output-last-message "$RESPONSE_FILE" - < "$PROMPT_FILE"
