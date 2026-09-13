#!/bin/bash
set -euo pipefail

PROMPT_FILE="$1"
RESPONSE_FILE="$2"

test -s "$PROMPT_FILE"
echo "NEEDS_HUMAN: the requested operation crosses an approval gate." > "$RESPONSE_FILE"
