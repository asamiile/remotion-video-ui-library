# Video Effect Addition Prompt

Please add the following video Effect.

## Basic information

- Effect name:
- Composition ID:
- Location: `src/Effects/<EffectName>/`
- Purpose: overlay on video / transition / other
- Theme:
- Existing Effect to reference:

## Video specification

- Width: 1920px
- Height: 1080px
- FPS: 30
- Duration: 10 seconds
- Transparent background: yes
- Seamless loop: yes / no
- Text elements: none / yes

## Look

- Main visual elements:
- Motion:
- Colors:
- Intended compositing method:
- Randomness:
- Adjustable props such as intensity or speed:

## Export

- PNG sequence: required / not required
- Transparent MOV: required / not required
- MP4: required / not required
- Output structure: `Effect/<EffectName>/png`, `Effect/<EffectName>/*.mov`, etc.
- Full render: ask for approval before running

## Completion criteria

- Shown in Remotion Studio as `Effect/<EffectName>`
- When transparency is specified, no background color is baked in
- Animation is frame-driven and deterministically reproducible
- The specified formats can be exported from `render.sh`
- `npm run lint` passes
- `./render.sh check` passes
- `git diff --check` passes
- The changes and verification results are reported

## Constraints

- Do not change `config/local/*.local.json`
- Preserve existing unrelated changes
- Do not delete, commit, push, merge, or publish

Set this as a Loop Engineering goal and proceed autonomously until the completion criteria are met. If a full render or human judgment becomes necessary, stop and explain why.
