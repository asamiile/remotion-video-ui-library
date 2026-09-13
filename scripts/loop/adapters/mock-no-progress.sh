#!/bin/bash
set -euo pipefail

PROMPT_FILE="$1"
RESPONSE_FILE="$2"

test -s "$PROMPT_FILE"
echo "Mock agent made no repository change." > "$RESPONSE_FILE"
