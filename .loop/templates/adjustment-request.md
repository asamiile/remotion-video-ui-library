# Existing Feature Adjustment Prompt

Please adjust the following existing feature.

## Target

- Composition or feature name:
- Target files or folders:
- Time, frame, or conditions where the issue appears:

## Current issue

- Current state:
- Expected state:
- Steps to reproduce:

## Changes

- Items to change:
- Items to keep:
- Numeric specifications:
- Reference images, videos, or existing implementations:

## Completion criteria

- The specified issue is resolved
- The appearance and behavior of items to keep are unchanged
- Compatibility with existing settings is preserved
- `npm run lint` passes
- `./render.sh check` passes when Compositions are changed
- `git diff --check` passes
- The changes and verification results are reported

## Constraints

- Do not change `config/local/*.local.json` unless the target path is explicitly named in the change request
- Preserve existing unrelated changes
- Report any impact found outside the specified scope
- Do not delete, commit, push, merge, publish, or run full renders

Set this as a Loop Engineering goal and proceed autonomously until the completion criteria are met. If the specification can be interpreted in multiple ways that would lead to significantly different results, stop and explain why human judgment is needed.
