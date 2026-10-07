---
name: composition-guide
description: >-
  Design spec for the transparent composition guide overlays: screen
  division lines, golden ratio and silver ratio grids, spirals and
  triangles, drawn like the guides on a camera viewfinder. Apply when
  building or restyling framing / ratio guide overlays.
alwaysApply: false
---

# Composition Guide

The guide lines on a camera's screen while you frame a landscape through it: thin, quiet lines over the footage, nothing else. The asset is fully transparent; only the lines are drawn.

Implementation: `src/Effects/Overlay/CompositionGuide/` · `CompositionGuide-*` (Studio `Effect/Overlay/CompositionGuide`). SVG, not a shader, so lines stay crisp at any scale. Export with `--alpha`.

## Guides

| Guide | Lines | Patterns |
|---|---|---|
| `thirds` | Rule of thirds, 3 x 3 | `thirds` |
| `halves` | Center cross | `halves` |
| `grid` | Even `divisions` x `divisions` grid | `grid4` |
| `diagonal` | Corner diagonals plus 45-degree lines from each corner | `diagonal` |
| `goldenGrid` | Phi grid at 0.382 / 0.618 | `goldenGrid` |
| `goldenSpiral` | Whirling squares of a golden rectangle and the spiral through them | `goldenSpiral`, `goldenSpiralFlip` |
| `goldenTriangle` | One diagonal and the perpendiculars from the other two corners | `goldenTriangle` |
| `silverGrid` | 1 : sqrt(2) divisions at 0.414 / 0.586 | `silverGrid` |
| `silverSpiral` | A 1 : sqrt(2) rectangle halved again and again (each half is another 1 : sqrt(2) rectangle), with the spiral through the halves | `silverSpiral`, `silverSpiralFlip` |

Silver ratio here means the Japanese 白銀比 / 大和比, 1 : sqrt(2), not 1 : (1 + sqrt(2)).

Spirals are built on an exact ratio x 1 rectangle and then mapped onto the frame. `fit: "stretch"` fills 16:9 like camera apps do; `fit: "true"` keeps the exact ratio, centered at full height, with the rectangle's outline. `flipX` / `flipY` move where the spiral winds in.

## Look and motion

- White lines at 85% opacity, 2 px at 1080p, round caps, and a soft dark halo (`shadowColor` black, `shadowOpacity` 0.35) so they read on bright skies without looking like a UI panel.
- Every pattern also has a `*Black` version (e.g. `thirdsBlack`): black lines at 80% opacity with a light halo (`shadowColor` white, 0.3) for bright footage or a Multiply blend.
- Straight lines draw outward from their midpoints; lines start one after another (`staggerFrames`); the spiral draws from the outside in, after the dividers, at twice the draw time. Ease in-out.
- Then the lines hold to the last frame (10 s), so editors can trim freely. `outroFrames` adds a fade-out when wanted.

## Avoid

- Anything but the lines: no labels, ratio numbers, intersection dots, frame corners or tinted panels. The asset is a lens-like layer, not a HUD (use `ObjectDetectionOverlay` for HUD looks).
- Thick or fully opaque lines: they compete with the landscape.
- Building a ratio spiral on the 16:9 pixel rectangle directly: the "squares" stop being squares. Build on the exact ratio, then map.
