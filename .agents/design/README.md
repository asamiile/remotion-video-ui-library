---
name: design-patterns
description: >-
  Index of the visual design pattern specs (gradient, marble, halftone,
  infographics, grunge, machine vision, composition guide, ambient electronic). Read the matching file before creating or restyling a
  composition in that look, and update it when a design decision is made.
alwaysApply: false
---

# Design Patterns

Rules in `.agents/rules/` cover *how the repository works*. Files here cover *how things should look*: the approved style, color roles, palettes, parameter ranges and the decisions made in review. Each file points to the implementation, which stays the canonical source for exact values.

| File | Look | Implementation |
|---|---|---|
| [gradient.md](./gradient.md) | Modern pastel gradients: waves, mesh, linear streaks, soft marbling, ice-cream scoop | `src/Background/Gradient/` |
| [marble.md](./marble.md) | Stone-like marble with veins, translucency, sway and water ripples | `src/Background/MarbleFlow/` (+ the Gradient `marble` style) |
| [halftone.md](./halftone.md) | Print-style dot grids driven by a brightness field or a waveform, and transparent halftone textures for editors | `src/Background/HalftoneDots/`, `src/Background/HalftoneWaveform/`, `src/Background/HalftoneOverlay/` |
| [infographics.md](./infographics.md) | Flat geometric shapes for presentation / infographic motion backgrounds | `src/Background/Geometric/` |
| [grunge.md](./grunge.md) | Worn, dirty, torn textures: transparent overlays, spray and ink textures, surfaces, transitions and titles | `src/Background/GrungeOverlay/`, `src/Background/SprayTexture/`, `src/Background/InkTexture/`, `src/Background/GrungeSurface/`, `src/Effects/Transition/TornPaperTransition/`, `src/Effects/Transition/GrungeTransition/`, `src/Text/StampText/`, `src/Text/GrungeText/` |
| [machine-vision.md](./machine-vision.md) | Computer vision: the world as a machine perceives it (detection boxes, LiDAR, perception passes, optical flow, thermal, pose, footage passes) | `src/Background/{LidarPointCloud,SceneUnderstanding,OpticalFlow,ThermalDrone,PoseEstimation}/`, `src/Effects/Overlay/ObjectDetectionOverlay/`, `src/Effects/Stylize/FootagePass/` |
| [composition-guide.md](./composition-guide.md) | Transparent viewfinder guides: screen division lines, golden ratio and silver ratio grids, spirals and triangles | `src/Effects/Overlay/CompositionGuide/` |
| [ambient-electronic.md](./ambient-electronic.md) | Music-video overlays for slow electronic music: tempo-synced light leaks, dub-delay echo marks, spectrum hairlines and club lasers in white, coral and sky | `src/Background/{HazeBloomLeak,DubEchoTrails,SpectralLines,LaserBeams}/` |
| [catalog.md](./catalog.md) | Reference list of common design styles, what already exists, and how a missing one could be built | — |

## Shared principles

- **Seamless loops.** Backgrounds loop over the composition (20 s by default). Drive motion from a 0–1 loop phase with whole-turn sines, `fract`, or closed noise paths; never from unbounded time.
- **One palette source.** Reuse `gradientPalettes` (`src/Background/Gradient/gradient.schema.ts`) for light, modern looks so different families sit together. Add a family-specific palette only when its look needs it, and list it in that family's file.
- **Deterministic.** Use seeded randomness (`randomSeed`, Remotion `random()`), so Studio and renders match.
- **Leave room for content** when a background is meant for titles or slides (open center or a calm area).
- **Record decisions.** When a look is approved or rejected in review, write it down in the matching file (an "Avoid" list is as useful as the palette table).

## Adding a design file

Create `<look>.md` with the same frontmatter shape, list it in the table above, and keep it to: the look, styles and color roles, palettes, things to avoid, how to add a pattern, and how to reuse it.
