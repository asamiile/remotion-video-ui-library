---
name: ambient-electronic
description: >-
  Music-video overlays for deep / dub techno, organic electronica and melodic
  house: slow tempo-synced light leaks, dub-delay echo marks, spectrum
  hairlines and club lasers in white, coral and sky. Read before building or restyling one.
alwaysApply: false
---

# Ambient Electronic (music-video overlays)

Overlays layered over live-action footage for slow, hypnotic, loop-based electronic music. They should feel analog, minimal and spacious: they breathe with the track rather than flash at it.

| Composition | Look | Blend in the editor |
|---|---|---|
| `Background/HazeBloomLeak` | Soft light leaks from the edges / corners / above, a colored fog, a burn band sweeping across, or an anamorphic streak, breathing every few bars | Screen / Add on the black-backed MP4, or Normal on the `--transparent-bg` alpha |
| `Background/DubEchoTrails` | Thin rings, squares, arcs, crosses, hairlines or grid dots that land on the beat on a layout grid and repeat like a dub delay, stepping, shrinking, softening and cooling with each repeat | Normal (alpha) |
| `Background/SpectralLines` | Hairlines driven by a spectrum: a stack of ridged lines, the stack folded around a center line, rays around a circle, or vertical columns | Normal (alpha) |
| `Background/LaserBeams` | Club lasers in haze: a fan from the top center, beams crossing from the bottom corners, a light sheet rippling overhead, beams scanning from the side edges, a rotating cone, or a lattice from the top corners; sweeps in bars, chase on the beat | Screen / Add on the black-backed MP4, or Normal on the `--transparent-bg` alpha |

## Tempo

- Every overlay shares `bpm`, `bars` and `offsetMs` (`src/helpers/tempo.ts`). The loop is exactly `bars` bars long, so beat-driven motion loops seamlessly. Default: 122 BPM, 8 bars.
- Set `bpm` to the track and `offsetMs` to its first downbeat; then the loop sits on the grid wherever it is cut in.
- Longer cycles (breaths, pads) are whole numbers of cycles per loop (`cyclesPerLoop`).
- `tempoPresets` (`dubTechno` 118 BPM, `melodicHouse` 124 BPM) can replace `defaultTempo` in a pattern. A few patterns use them; everything else stays at 122 BPM.
- `SpectralLines` without `audioFile` synthesizes a spectrum from the tempo (kick on the beat, clap on 2 and 4, hats on the off-beat, slow pads). With an `audioFile`, set `bars` long enough to cover the section.

## Pattern sets

- **Section sets**: every family has `sectionIntro`, `sectionBuild`, `sectionDrop` and `sectionBreakdown` at the same tempo, so one track can move from calm to peak and back with matching overlays. Intro and breakdown are faint and slow; build tightens the cycles; drop is brightest with the strongest beat response.
- **Vertical versions**: `*VerticalPatterns` in each `.schema.ts` register 1080x1920 compositions under the same family (`Background-<Family>-Vertical<Pattern>`). Shaders measure in 1080p units by height, so a portrait frame is about 607 units wide: keep marks smaller (`size` / `spread`) and leaks narrower there.

## Color roles

Palette: `src/helpers/palette-ambient-electronic.ts`.

| Role | Color | Use |
|---|---|---|
| White `#ffffff` | Main | Lines, dry hits, mid bands, burnt-out leak cores |
| Coral `#f98362` | Warm accent | Warm leak, accent hits, low bands (kick) |
| Sky `#61ccf9` | Cool accent | Cool leak, echo tails, high bands (hats) |

- Keep coral and sky apart: opposite sides of the frame (warm left / top-left, cool right / bottom-right), opposite ends of the spectrum, or alternating in time (warm and cool leaks breathe in turn). Never mix them into one area, which turns muddy.
- Every family has a duo (coral + sky), single-temperature and mono (white) pattern.
- Exception: `LaserBeams-ClassicGreen` / `-ClassicRed` use classic laser colors outside the palette, for scenes that need the literal club look.

## Motion

- Breathe, don't flash: leaks swell over 4 bars by default; the per-beat `kick` is a soft swell (0.1-0.2), never a strobe.
- Echoes keep `feedback` around 0.55-0.75 and a dotted-eighth (0.75 beat) or quarter delay; each repeat steps away, softens slightly and shifts toward the cool color.
- Marks snap to a layout grid, never random positions: rings on the rule-of-thirds points and the center (repeats concentric), lines flush to the 8% side margins on a row grid, columns on a shared baseline. Repeats step toward the frame center and shrink, so the decay reads like a measured graph.
- Lines stay thin (1-2 px at 1080p) with a faint glow; the footage is the subject.
- Lasers: white-hot core, colored scatter glow textured by drifting smoke. Coral and sky go on alternate beams or opposite emitters. Sweeps last whole bars; the beat chase alternates beams instead of strobing everything.

## Avoid

- Hard white flashes and fast strobing.
- Saturated full-frame washes: leaks stay at the edges, and the center stays clean for the subject.
- Coral and sky blended in the same pixel area.
- Thick, neon-style strokes.
- Marks scattered at random positions or drifting in random directions: it reads as noise, not as a designed frame.

## Adding a pattern

Add an entry to the family's `*Patterns` in its `.schema.ts`, starting from the shared `base` object, and keep the color roles above. IDs follow automatically (`Background-<Family>-<Pattern>`).
