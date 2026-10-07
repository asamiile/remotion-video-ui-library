---
name: grunge
description: >-
  Design spec for grunge looks: worn, dirty, scraped and torn textures.
  Covers the transparent grunge overlays, spray and ink textures, grunge surfaces, the torn-paper
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
| SprayTexture | `src/Background/SprayTexture/` · `Background-SprayTexture-*` | Transparent spray paint: bursts, strokes, drips, mist, border (export with `--alpha`) |
| InkTexture | `src/Background/InkTexture/` · `Background-InkTexture-*` | Transparent ink: splatter, wet bleed, dry brush, flowing clouds (export with `--alpha`) |
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

## SprayTexture

Spray paint on a fully transparent background, measured in 1080p pixels, with a dynamic, streetwear feel: fast hits, bold diagonals, a constant rhythm. Every mark comes from one spray density: solid where dense (with a little grain), atomized 1–2 px dots thinning out toward the edge, then a few stray droplets beyond. Bursts, slashes and drips each live in a slot that restarts `tempo` times per loop at a random offset (an integer, so the loop stays seamless). They punch in within a few frames, hold, then **erode back into dots** instead of fading evenly.

| Style | Marks | Patterns |
|---|---|---|
| `burst` | Shots punching in from a solid core to a speckled edge, slightly stretched along a spray angle; a few oversized hero shots | `blackBurst`, `whiteBurst`, `acidBurst`, `neonBurst` |
| `stroke` | Diagonal slashes swiped across the frame in ~10% of a cycle, heavy blob where the nozzle starts, tapering out, slight bow | `blackSlash`, `whiteSlash`, `electricSlash` |
| `drip` | Heavy patches; drips run down fast, end in a bulb, then dry from the top | `blackDrip`, `neonDrip` |
| `mist` | Clouds of fine overspray swirling past on a closed noise path | `blackMist`, `whiteMist` |
| `frame` | Spray-painted border pulsing on the beat (quick push in, slow release) around a clean center | `blackFrame` |

Props: `color`, `color2` (second can: about half of the shots / slashes / drips, and part of the mist), `density` (0–1), `size` (dot and patch scale), `tempo` (restarts per loop, 1–10; 4–7 reads as dynamic at 20 s), `randomSeed`. Blend black with Multiply, white with Screen, colors with Normal.

## InkTexture

Ink on a fully transparent background, measured in 1080p pixels. Splats, bleeds and slashes use the same `tempo` slots as SprayTexture and **dissolve through grainy noise** at the end of each cycle; the flow clouds swirl `tempo` turns around a closed noise path.

| Style | Marks | color2 role | Patterns |
|---|---|---|---|
| `splatter` | Ink thrown at the frame: the splat slams in within ~1 frame with a small overshoot, bulges and spikes toward the throw, drops fling out and streak along it, fine mist | Alternate ink | `blackSplatter`, `whiteSplatter`, `acidSplatter`, `magentaSplatter` |
| `bleed` | Drops soak into wet paper: feathered edge, darker rim and core, granulated fill | Rim and core | `blackBleed`, `indigoBleed` |
| `brush` | Diagonal dry-brush slashes swept in ~9% of a cycle: pressed in at the start, bristle streaks opening up as the brush runs dry, ragged edges, slight bow | Alternate ink | `blackBrush`, `whiteBrush`, `electricBrush` |
| `flow` | Smoky ink clouds (domain-warped noise): translucent wisps thickening into dense cores | Thin wisps | `blackFlow`, `sepiaFlow` |

Props match SprayTexture. Blend with Multiply (dark ink) or Screen (white ink). `GrungeOverlay`'s `stain` stays the flat coffee / ink ring; use `bleed` for a wet, feathered look.

### Stylish accents (spray / ink only)

Approved for the dynamic spray and ink patterns, always paired with black or white rather than with each other in large amounts:

| Accent | Hex | Used in |
|---|---|---|
| Acid yellow | `#e4ff1a` | `acidBurst`, `electricSlash`, `acidSplatter` |
| Electric blue | `#2f5bff` | `electricSlash`, `electricBrush` |
| Hot magenta | `#ff2e9a` (darker `#c4157a`) | `neonBurst`, `neonDrip`, `magentaSplatter` |
| Cyan | `#19e3ff` | `neonBurst` |

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
- Spray / ink only: acid yellow, electric blue, hot magenta, cyan (see [Stylish accents](#stylish-accents-spray--ink-only))

## Avoid

- Clean, vector-perfect edges on anything meant to look worn: always roughen edges and break up fills.
- Uniform noise everywhere: grunge needs clusters, edges and empty areas.
- Strong saturated red as the main ink.
- Over-dense overlays baked at full strength: keep textures single-color and let opacity / blend mode set the strength.
- Duplicating existing pieces: check `DistressTransition` / `DryBrushTransition` before building another brush-style wipe.
- Vector-clean brush strokes: an early InkTexture `brush` with flat fill and square ends read as clip art. Keep streak gaps across the whole stroke and jag the start, head and end with the bristle noise.
- Thin iso-line filaments in ink clouds: they read as oily marble, not ink. Keep `flow` to soft wisps and dense cores.
- Slow, calm spray / ink: the first version (one mark per ~10 s, gentle sine-wave strokes, even fades) read as static. Keep `tempo` around 4–7, swipe strokes on diagonals in a few frames, and end marks by eroding or dissolving.
- Accent paired with near-black on a slash / stroke family meant for dark footage: half the marks vanish. Pair accents with white there.

## Shader notes

Shader compile errors fail **silently** on the ANGLE backend (the canvas renders empty, no console error). Two causes hit here:

- **Reserved words as identifiers:** a local named `patch` broke the whole shader. Avoid GLSL reserved words such as `patch`, `sample`, `filter`, `input`, `output`, `half`, `common`, `active`, `partition`.
- **A branch declaring locals:** an `if` block that declared locals inside `frameGrime` failed; the branch-free rewrite (`step(...) * cover(...)`) works. `GrungeTransition`'s film burn also computes both phases and mixes them instead of branching.

If a shader renders fully transparent with no error, bisect by stubbing functions, then check identifiers and branches.
