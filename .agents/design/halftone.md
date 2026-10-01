---
name: halftone
description: >-
  Design spec for halftone (print dot grid) looks: HalftoneDots (shader dot
  field) and HalftoneWaveform (dot-matrix audio-style waveform). Apply when
  creating or restyling halftone patterns.
alwaysApply: false
---

# Halftone

Halftone builds an image from a regular grid of dots whose size (or presence) follows a brightness field, like print screening.

| Family | Technique | IDs |
|---|---|---|
| `src/Background/HalftoneDots/` | WebGL: `floor`/`fract` grid cells, one circle per cell, radius from a wave sweeping across the frame | `Background-HalftoneDots-<Pattern>` |
| `src/Background/HalftoneWaveform/` | SVG/React: dot columns lit up to a waveform height (`sine` or `spikyNoise`), with hue-rotating color bands and white flashes | `Background-HalftoneWaveform-*` |

## HalftoneDots

Uses the shared shader-background props (`src/helpers/shader/background/`).

| Prop | Role |
|---|---|
| `colorA` → `colorB` | Dot color across the sweep |
| `colorC` | Highlight on the largest dots |
| `scale` | Cell density; larger = smaller, more numerous dots |
| `backgroundColor` | `transparent` for an overlay (the `classic` pattern) |

## HalftoneWaveform

| Prop | Role |
|---|---|
| `bandColors` / `hueRotateSpeed` | Color bands behind the dots and how fast they cycle |
| `waveShapeType` / `waveColor` | `sine` or `spikyNoise`, and the lit-dot color |
| `gridColumns`, `maxRows`, `dotSizePx` | Grid resolution and dot size |
| `amplitudePercent`, `frequency`, `phaseSpeed` | Waveform shape and motion |
| `flashCount`, `flashHoldFrames`, `flashColor` | Brief full-grid flashes |

## Guidance

- Keep dots on an exact grid; the regularity is what reads as "halftone". Vary size, not position.
- Prefer one or two dot colors on a flat background; gradients belong in the field that drives dot size.
- For pastel, modern variants, take colors from `gradientPalettes` (see [gradient.md](./gradient.md)).
- Halftone can be used as a texture in other looks (e.g. hatched or dotted shapes in [infographics.md](./infographics.md)).

## Adding a pattern

HalftoneDots: add an entry to `halftoneDotsPatterns` starting from `...shaderBackgroundBase`. Check stills, then run `npm run lint`, `./render.sh check`, and `git diff --check`.
