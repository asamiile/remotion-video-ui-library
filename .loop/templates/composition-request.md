# Remotion Composition Addition Prompt

Please add the following Remotion Composition.

## Basic information

- Composition name:
- Composition ID:
- Folder:
- Purpose:
- Existing Composition to reference:

## Video specification

- Width: 1920px
- Height: 1080px
- FPS: 30
- Duration: 10 seconds
- Aspect ratio:
- Transparent background: yes / no
- Seamless loop: yes / no
- Audio: yes / no

## Look

- Appearance:
- Animation:
- Colors:
- Text elements:
- Handling of overflow outside the frame:
- Randomness:
- Adjustable props:

## Studio and export

- Placement in Remotion Studio:
- `render.sh` output location:
- Required export formats: PNG sequence / MP4 / transparent MOV / other
- Full render: ask for approval before running

## Completion criteria

- Implemented in the specified folder and registered in Studio
- Animation is frame-driven and deterministically reproducible
- schema, defaultProps, and types follow repository conventions
- `npm run lint` passes
- `./render.sh check` passes
- `git diff --check` passes
- The changes and verification results are reported

## Constraints

- Do not change `config/local/*.local.json`
- Preserve existing unrelated changes
- Do not delete, commit, push, merge, or publish

Set this as a Loop Engineering goal and proceed autonomously until the completion criteria are met. If a full render or human judgment becomes necessary, stop and explain why.
