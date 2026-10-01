---
name: grunge
description: >-
  Design spec for grunge looks: worn, dirty, scraped and torn textures.
  Covers the transparent grunge overlays, grunge surfaces, the torn-paper
  and grunge transitions, the stamp and grunge titles, and the existing
  distressed pieces. Apply when building
  or restyling anything rough, distressed or analog-dirty.
alwaysApply: false
---

# Grunge

Dirt, scratches, grain, worn ink, torn paper: a used, rough surface that adds rawness and weight (90s alternative record sleeves, streetwear, horror / action titles).

## Pieces

| Piece | Where | Role |
|---|---|---|
| GrungeOverlay | `src/Background/GrungeOverlay/` · `Background-GrungeOverlay-*` | Transparent textures for editors (export with `--alpha`) |
| GrungeSurface | `src/Background/GrungeSurface/` · `Background-GrungeSurface-*` | Full-frame surfaces: wall, collage, rust, cardboard |
| TornPaperTransition | `src/Effects/Transition/TornPaperTransition/` · `TornPaperTransition-*` | Paper slides in, seals the cut, rips apart (base + `-5s`) |
| GrungeTransition | `src/Effects/Transition/GrungeTransition/` · `GrungeTransition-*` | Tape, film burn, photocopy (base + `-5s`) |
| StampText | `src/Text/StampText/` · `StampText-*` | Rubber-stamp title landing with a jolt, worn ink |
| GrungeText | `src/Text/GrungeText/` · `GrungeText-*` | Stencil, ransom, typewriter, tape, burn, lower third, markup |
| Existing | `DistressTransition` (DryBrush, TonerScrape, DustBurn, ...), `DryBrushTransition`, `DistressedTitleCard`, `SprayPaintText`, `TornNoteCaption`, `FilmGrainOverlay`, `AgedParchmentOverlay`, `HalftoneOverlay` | Reuse before building new |

## GrungeOverlay

Shader marks measured in 1080p pixels (same size at any render scale) on a fully transparent background. Random marks re-roll every `holdFrames` on a step counter that wraps with the composition, so the jitter loops.

| Style | Marks | Blend in the editor |
|---|---|---|
| `dust` | Irregular specks (a few large), thin wavy hairs, vertical scratches that persist a few steps and wobble | Black: Multiply · White: Screen |
| `frame` | Blotchy grime eating in from the edges with spatter, clean center, slight boil | Black: Multiply · White: Screen (reads as scraped paint) |
| `toner` | Clustered 2–3 px toner grains, faint horizontal roller streaks, occasional blots | Black: Multiply · White: Screen |

| `stain` | Ink / coffee stains that spread, darken at the rim, then fade (looping) | Multiply |
| `lightLeak` | Warm leaks breathing in from the left / right edges, flickering per step | Screen / Add |
| `filmEdge` | Black film strips with scrolling sprocket holes, edge-code dashes, rounded gate corners, gate weave | Normal |
| `vhs` | Scanlines, bottom tracking noise, white dropouts, cyan / magenta streaks, rolling band | Normal / Screen |
| `misregister` | Patchy CMY halftone screens at print angles, slightly out of register (fixed CMY inks) | Multiply |

Props: `color`, `color2` (stain rim, leak edge, film edge codes), `density` (0–1), `size` (mark scale), `holdFrames` (jitter rate), `randomSeed`. Patterns: `blackDust`, `whiteDust`, `blackFrame`, `whiteFrame`, `blackToner`, `whiteToner`, `inkStain`, `coffeeStain`, `warmLightLeak`, `filmEdge`, `vhsTracking`, `cmykMisregister`. Control strength with the editor's opacity, not by baking it in.

## GrungeSurface

Opaque, looping backgrounds in 1080p pixel space with a roaming soft light. Uses the shared shader-background props plus `style`.

| Style | Look | colorA / colorB / colorC | Patterns |
|---|---|---|---|
| `wall` | Concrete with pores and hairline cracks, a spray patch with overspray and drips, masking tape | concrete / spray / tape | `concreteWall`, `graffitiWall` |
| `collage` | Torn paper scraps (plain and halftone-printed) with shadows and tape; scraps slide off and back with new content | board / scrap / tape | `paperCollage`, `newsCollage` |
| `rust` | Painted steel eaten by rust that slowly breathes, flaking paint rims, scratches | paint / dark rust / light rust | `rustedSteel`, `rustedNavy` |
| `cardboard` | Kraft board, a torn top layer showing corrugation, packing tape, water stains | kraft / flute shadow / tape | `cardboardBox` |

## TornPaperTransition

Centered transition (60 frames, `-5s` padded variant): the sheet slides in from the left with a torn leading edge (0–45%), fully covers the frame through the cut (45–55%), then rips along a jagged near-vertical line and the halves pull apart (55–100%). Torn edges show a pale fiber rim and cast a soft shadow; the paper has fiber texture, mottling, stains and specks. Transparent before and after.

| Pattern | Paper | Fibers | Grime |
|---|---|---|---|
| `kraft` | `#c49a6c` | `#f1e3c8` | `#6b4a2b` |
| `newsprint` | `#e7e1d3` | `#ffffff` | `#5d5a54` |
| `blackPaper` | `#1b1a19` | `#8c877d` | `#000000` |

## GrungeTransition

Same timing contract as TornPaperTransition (60 frames, fully covered from 45% to 55%, transparent at both ends, `-5s` variant). `mode` picks the effect:

| Mode | Motion | colorA / colorB / colorC | Patterns |
|---|---|---|---|
| `tape` | Eight strips laid left → right bottom-up with torn ends, then peeled in reverse | tape / sheen / edge | `maskingTape`, `ductTape` |
| `filmBurn` | Burn holes spread to a white-hot frame (glowing edge, charred rim), then the white burns away | glow / white-hot / char | `filmBurn` |
| `photocopy` | A scan light sweeps down leaving a toner copy; a second pass lifts it off | paper / scan light / toner | `photocopy` |

## StampText

The stamp drops in large and faint, lands at `impactFrames` with a small squash and a decaying jolt (`shakePx`), and splatters ink around the border. The impression is worn: an SVG filter roughens edges (`roughness`, displacement) and knocks holes in the ink (`inkWear`, thresholded turbulence as an alpha mask). Borders: `none`, `box`, `double`, `circle`. 150 frames.

| Pattern | Ink | Paper | Border |
|---|---|---|---|
| `approved` | Black `#1f1d1b` | Kraft | box |
| `confidential` | Rust `#a3452f` + sub line | Newsprint | double |
| `soldOut` | Off-white `#ece6d8` | Black | circle |
| `approvedTransparent` | Black | Transparent (overlay) | box |
| `approvedJp` | Rust | Newsprint | box |

## GrungeText

One template, seven styles sharing `text`, `subText`, `fontFamily`, `fontSize`, `inkColor`, `accentColor`, `backgroundColor`, `roughness`, `inkWear`, `delayFrames`, `randomSeed` (150 frames).

| Style | Motion | accentColor role | Patterns |
|---|---|---|---|
| `stencil` | Letters with a stencil bridge fade from a blurry mist to sharp, with an overspray halo | overspray | `stencilSpray`, `stencilSprayJp` |
| `ransom` | Cut-out letters, each a different font / case / scrap, pasted one by one with a pop and shadow | one scrap color | `ransomNote` |
| `typewriter` | Keys struck one by one with uneven ink and jitter, a jolt per strike, blinking block caret | — | `typewriterMemo` |
| `tape` | Masking tape slaps down, then marker text is written left → right | tape | `tapeLabel` |
| `burn` | Letters burn in through spreading noise patches with an ember glow and rising sparks | ember glow | `burnTitle` |
| `lowerThird` | Rough painted band grows from the left, name slides in, black sub band follows | band | `grungeLowerThird` |
| `markup` | Marker circle drawn around a spot, an arrow from the note, then the note | marker | `markupCircle` |

`lowerThird` and `markup` default to a transparent backdrop for layering over footage.

## Palette

Grunge is mostly monochrome plus one muted accent:

- Black / off-white / kraft brown
- Rust `#a3452f` instead of strong red (strong reds stay avoided, as in [gradient.md](./gradient.md))
- Optional accents: warning yellow, acid green, sepia

## Avoid

- Clean, vector-perfect edges on anything meant to look worn: always roughen edges and break up fills.
- Uniform noise everywhere: grunge needs clusters, edges and empty areas.
- Strong saturated red as the main ink.
- Over-dense overlays baked at full strength: keep textures single-color and let opacity / blend mode set the strength.
- Duplicating existing pieces: check `DistressTransition` / `DryBrushTransition` before building another brush-style wipe.

## Shader notes

Shader compile errors fail **silently** on the ANGLE backend (the canvas renders empty, no console error). Two causes hit here:

- **Reserved words as identifiers:** a local named `patch` broke the whole shader. Avoid GLSL reserved words such as `patch`, `sample`, `filter`, `input`, `output`, `half`, `common`, `active`, `partition`.
- **A branch declaring locals:** an `if` block that declared locals inside `frameGrime` failed; the branch-free rewrite (`step(...) * cover(...)`) works. `GrungeTransition`'s film burn also computes both phases and mixes them instead of branching.

If a shader renders fully transparent with no error, bisect by stubbing functions, then check identifiers and branches.
