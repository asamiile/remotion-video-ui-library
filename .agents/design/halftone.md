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
| `colorC` | Reserved shared accent; unused by HalftoneDots |
| `field` | `sweep`, `ripple`, `contour`, `spotlight`, `interference`, or `ribbon` brightness field |
| `shape` | `dot`, `diamond`, `square`, `line`, or `cross` printing mark |
| `palette` | Named ink/paper preset, or `custom` to use the color controls |
| `scale` | Cell density; larger = smaller, more numerous dots |
| `backgroundColor` | `transparent` for an overlay (the `coralGoldSweep` pattern) |

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

## HalftoneDots pattern set

All presets use a fixed dot grid and a 20-second seamless loop. CoralGoldSweep retains
its original transparent red/gold sweep. The new presets use flat backgrounds.

| Pattern | Palette | Motion / intended use |
|---|---|---|
| `newsprint` | Charcoal on warm paper | Fine diagonal sweep for editorial texture |
| `ripple` | Blue / pale aqua on navy | Expanding concentric waves |
| `contour` | Terracotta on cream | Broad warped contour bands |
| `spotlight` | Cyan / pale aqua on dark navy | Orbiting edge light with a calm title area |

Keep grid positions stationary and animate only the brightness field using
whole-turn periodic phases. Avoid random dot jitter or flashing. New presets
keep intensity below 1 so neighboring dots remain visibly separate.

## Independent palette, mark, and field controls

The original five presets default to `palette: custom` and `shape: dot`.
Named palettes override `backgroundColor`, `colorA`, and `colorB`; select `custom`
to edit those colors directly. `colorC` remains unused. Background transparency
export overrides still apply after palette resolution.

Available palettes: paper, ocean, terracotta, lavender, sky, sorbet, and sunset.
The last four reuse `gradientPalettes` for consistent pastel ink/paper colors.
Marks stay on a stationary grid. Line screens run horizontally and sample the
brightness field continuously along each row to avoid broken line segments.
Interference combines two circular wave sources; ribbon bends a broad sine band.

| Preset | Palette | Mark | Field |
|---|---|---|---|
| `lavenderDiamonds` | lavender | diamond | contour |
| `skyLines` | sky | line | ribbon |
| `sorbetCrosses` | sorbet | cross | ripple |
| `sunsetSquares` | sunset | square | sweep |
| `oceanInterference` | ocean | dot | interference |
| `paperRibbon` | paper | dot | ribbon |

Every palette can be paired with every mark and field in Studio. Keep presets
curated instead of registering every combination. All six additions loop over
20 seconds, use intensity below 1, and keep a flat background without grain.

## HalftoneOverlay (transparent texture for editors)

`src/Background/HalftoneOverlay/` renders only the ink marks on a fully transparent background, for compositing over footage in DaVinci Resolve or similar. It does **not** read the footage, so it adds a print texture; it does not convert the picture into halftone (that needs an effect that samples the video, e.g. in Fusion or a Remotion shader reading the clip). IDs: `Background-HalftoneOverlay-<Pattern>`. Always export with `./render.sh --alpha` (ProRes 4444).

| Prop | Role |
|---|---|
| `color` | Ink color: black for Multiply / Overlay / Soft Light, white for Screen / Add |
| `shape` | `dot` (round screen) or `line` (horizontal line screen) |
| `cellPx` | Screen pitch in output pixels; ~6–8 fine, ~12–16 coarse |
| `angle` | Screen angle; 45° is the classic print angle |
| `coverage` | Ink per cell (dot area / line thickness), 0–1 |
| `variation` | Slow, looping variation in mark size across the frame |
| `edgeFade` | 1 = marks only toward the edges (halftone vignette) |
| `driftCells` | Whole cells the screen slides per loop (0 = static) |

| Pattern | Use |
|---|---|
| `blackFine` / `blackCoarse` | Print / comic texture (Multiply or Overlay, lower opacity to taste) |
| `whiteFine` / `whiteCoarse` | Light dots for dark footage (Screen) |
| `blackEdge` | Halftone vignette, clean center |
| `blackLines` | Line-screen / scanline texture |
| `blackDrift` | Slowly breathing, sliding dots (seamless 20 s loop) |

Keep marks a single flat color with constant pitch so they blend predictably; control strength with the editor's opacity and blend mode rather than baking it in.
