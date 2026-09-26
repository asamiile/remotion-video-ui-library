#!/bin/bash
set -euo pipefail

PROMPT_FILE="$1"
RESPONSE_FILE="$2"
WORKSPACE_ROOT="$3"

test -s "$PROMPT_FILE"
touch "$WORKSPACE_ROOT/${LOOP_MOCK_TARGET:-loop-mock-complete}"
echo "Mock agent created its verification marker." > "$RESPONSE_FILE"
