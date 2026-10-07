---
name: design-catalog
description: >-
  Reference catalog of common design styles for video backgrounds and motion
  graphics, mapped to what already exists in this repository and how a missing
  style could be built. Use it to pick a direction or plan a new design file.
alwaysApply: false
---

# Design Catalog

A reference list of common design styles. **Status** shows where each one stands in this repository:

- **Spec**: has a design file in this folder.
- **Component**: a component exists in `src/`, but there is no design file yet (write one when the look is next touched).
- **Idea**: not built yet; "How to build" suggests the closest existing approach.

## Covered by a design file

| Style | Design file | Implementation |
|---|---|---|
| Gradient (waves, mesh, linear streaks, soft marbling, ice-cream scoop) | [gradient.md](./gradient.md) | `Background/Gradient` |
| Marble (stone, veins, ripples) | [marble.md](./marble.md) | `Background/MarbleFlow` |
| Halftone (print dot grid) | [halftone.md](./halftone.md) | `Background/HalftoneDots`, `Background/HalftoneWaveform` |
| Infographics / flat geometric shapes | [infographics.md](./infographics.md) | `Background/Geometric` |
| Grunge (dust, grime, toner, stains, light leaks, film edge, VHS, CMY misregister, spray paint, ink splatter / bleed / brush / flow, walls, collage, rust, cardboard, torn paper, tape, film burn, photocopy, stamp, stencil, ransom, typewriter, tape label, burn, lower third, markup) | [grunge.md](./grunge.md) | `Background/GrungeOverlay`, `Background/SprayTexture`, `Background/InkTexture`, `Background/GrungeSurface`, `TornPaperTransition`, `GrungeTransition`, `StampText`, `GrungeText` |
| Machine vision (object detection, LiDAR, perception passes, optical flow, thermal drone, pose, footage passes) | [machine-vision.md](./machine-vision.md) | `Background/LidarPointCloud`, `Background/SceneUnderstanding`, `Background/OpticalFlow`, `Background/ThermalDrone`, `Background/PoseEstimation`, `Effect/Overlay/ObjectDetectionOverlay`, `Effect/Stylize/FootagePass` |
| Composition guide (rule of thirds, center cross, grid, diagonals, golden grid / spiral / triangle, silver grid / spiral) | [composition-guide.md](./composition-guide.md) | `Effect/Overlay/CompositionGuide` |

## Texture and material

| Style | Look | Status | Existing / how to build |
|---|---|---|---|
| Noise / Grain | Film or paper grain layered on top of other looks | Component | `Background/FilmGrainOverlay`; the `grain` prop in Gradient |
| Paper / Aged | Paper texture, aged edges | Component | `Background/AgedParchmentOverlay` |
| Glassmorphism | Frosted translucent panels blurring what is behind | Idea | SVG/CSS panels with `backdrop-filter: blur()` over a Gradient pattern |
| Collage | Torn paper, cut-outs, handmade feel | Spec | GrungeSurface `collage`, GrungeText `ransom` ([grunge.md](./grunge.md)) |
| Metallic / Chrome | Glossy chrome or liquid metal (Y2K) | Idea | Shader: environment-like gradient bands warped by noise (Gradient `marble` technique with a steel palette and sharp highlights) |

## Pattern and geometric

| Style | Look | Status | Existing / how to build |
|---|---|---|---|
| Stripes | Diagonal stripes, varying widths, moving borders | Spec | Geometric `stripe` ([infographics.md](./infographics.md)); `Background/StripeWaveField` |
| Checker / Plaid | Checkerboard, gingham, grid lines | Idea | Geometric `grid` tile machinery with stripe / check tiles |
| Polka dots / Dot matrix | Regular dots, cute or retro | Idea | Halftone grid with fixed dot size and pastel palettes |
| Isometric | Cubes and tiles seen from above at an angle | Idea | SVG with an isometric transform; tech diagrams |
| Memphis | 80s squiggles, zigzags, small primary shapes | Spec | Geometric `memphis` ([infographics.md](./infographics.md)) |
| Line art / Topographic | Contour lines, fine line patterns | Component | `Background/WaveInterferenceLines`, `Background/RandomLinesBackground`; contour lines from noise isolines in a shader |

## Light and space

| Style | Look | Status | Existing / how to build |
|---|---|---|---|
| Bokeh / Light leak | Blurred light orbs, film light leaks | Component | `Background/AmbientBlurOrbs`, `Background/SunsetLensFlareOverlay` |
| Aurora / Glow | Soft bands of light | Component | `Background/Aurora` |
| Particles / Constellation | Dots linked into a network | Component (partial) | `Background/Starfield`, `Background/DigitalFog`; a linked-network style is an Idea |
| Perspective grid | Floor grid receding into depth | Component | `Background/SynthGrid`, `Background/HolographicDepthGrid` |
| Smoke / Nebula | Volumetric clouds | Component | `Background/VolumetricSmoke`, `Background/Nebula` |
| Caustics / Water | Light patterns through water | Component | `Background/Caustics`, `Background/RippleRings` |
| Voronoi / Cells | Organic cell walls | Component | `Background/VoronoiCells` |
| Kaleidoscope | Mirrored radial symmetry | Component | `Background/Kaleidoscope` |

## Style and era

| Style | Look | Status | Existing / how to build |
|---|---|---|---|
| Retro / Vaporwave | 80s–90s sunsets, neon, grids | Component (partial) | `Background/SynthGrid`; palette work in a design file |
| Y2K | Gloss, bubbles, chrome, pastels | Idea | Combine Metallic and Gradient pastel palettes |
| Brutalism | Heavy type, raw layout, mono + one loud color | Idea | Text-led; SVG blocks with hard edges |
| Minimal / Swiss | White space, strict grid, type-first | Idea | Geometric `frame` with fewer, aligned shapes and a strict grid |
| Glitch / Analog | Signal errors, scanlines, VHS | Component | `Background/TvStatic`, `Background/ScanLine`, `Background/SignalInterferenceOverlay`, Glitch transitions in `Effects` |
| Japanese (Wa) patterns | Seigaiha, ichimatsu, asanoha, shippo | Idea | Geometric `grid`-style tiling with SVG motif tiles |

## Turning an entry into a design file

When building or restyling one of these, add `<look>.md` here (see [README.md](./README.md)), move the row into "Covered by a design file", and record approved palettes and rejected directions.
