#!/bin/bash
set -euo pipefail

PROMPT_FILE="$1"
RESPONSE_FILE="$2"
WORKSPACE_ROOT="$3"

if ! command -v copilot >/dev/null 2>&1; then
  echo "GitHub Copilot CLI is not installed or not available on PATH." > "$RESPONSE_FILE"
  exit 127
fi

cd "$WORKSPACE_ROOT"
copilot --allow-tool=read --allow-tool=write --allow-tool=shell --deny-tool='shell(git push)' --deny-tool='shell(git commit)' --deny-tool='shell(rm)' < "$PROMPT_FILE" > "$RESPONSE_FILE"
