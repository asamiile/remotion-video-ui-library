---
name: infographics
description: >-
  Design spec for flat geometric / infographic motion backgrounds
  (Background/Geometric: frame, orbit, grid, float, stripe, memphis): look, shape vocabulary,
  color roles, palettes, motion rules, and how to add a pattern. Apply when
  building presentation-style or infographic-style shape animations.
alwaysApply: false
---

# Infographics (Geometric)

Flat, modern shape compositions for presentation and infographic backgrounds. Implementation: `src/Background/Geometric/` (SVG + React, no WebGL).

| File | Role |
|---|---|
| `geometric.schema.ts` | Props schema and every pattern. **Canonical source for exact values** |
| `shapes.tsx` | Shape vocabulary: arc, hatch fill, plus / cross, dot grid, chevrons, tile shapes, squiggle, zigzag, `Pop` (reveal), seeded layout helpers |
| `layers.tsx` | One layer per style: `FrameLayer`, `OrbitLayer`, `GridLayer`, `FloatLayer`, `StripeLayer`, `MemphisLayer` |
| `GeometricTemplate.tsx` | Background gradient, the selected layer, and the reveal timing (`revealAt`) |

Composition IDs are `Background-Geometric-<palette><Style>` (e.g. `Background-Geometric-IndigoFrame`). Each style has its own Studio and output folder: `Background/Geometric/{Frame,Orbit,Grid,Float,Stripe,Memphis}`.

References: Envato "Abstract Geometric Shapes Motion Background Reveal" (frame of flat blocks around an open center) and "Abstract Geometric Dynamic Shapes Background Elements" (rounded arcs, rings, hatched discs on navy).

## The look

- **Flat shapes only:** solid fills, no gradients or shadows on shapes. Depth comes from overlap and size, not lighting.
- **Shape vocabulary:** rectangles and squares, circles, rings, rounded-cap arcs, half / quarter circles, triangles, diagonal hatching, plus / cross marks, small dot grids, chevron rows, thin concentric circles.
- **Hierarchy:** a few large shapes, more mid-size ones, many small ornaments. Ornaments use `accentColor` and stay small.
- **Room for content:** `frame`, `float` and `memphis` keep the middle open (`openCenter` ~0.4–0.5) for titles; `stripe` can mask out a rounded box of that size, but the approved stripe patterns are full frame (the center box was rejected).
- **Seamless rotation:** quarter-turn steps must add up to a symmetry of the shape per cycle (360° in general, 180° for rectangles, 90° for squares and plus marks).
- **Calm motion:** drifting, slow rotation, arcs growing and shrinking, ornaments blinking. No hard cuts. Every motion loops over the composition (20 s default) via whole-turn sines of the loop phase or quarter-turn steps that add up to 360°.

## Styles

| Style | Composition | Motion |
|---|---|---|
| `frame` | Rectangles clustered at the edges (edge-biased placement), faint diagonal light bands, ornaments | Parallax drift by depth. Each block also runs one staggered event 1–2× per cycle: **slide** out past the nearer edge and back, **wipe** (collapse into the outer edge), **grow** (stretch from it), or **turn** (eased quarter turns, even count so rectangles return upright); some stay still. Ornaments: plus / cross spin in quarter turns, dot grids pulse in a wave, small squares turn, concentric circles ripple outward, chevrons light up in sequence |
| `orbit` | One large cluster of rings and rounded arcs around a hatched disc, one or two smaller clusters, scattered dots and hatched circles | Arcs rotate and their sweep breathes, dots orbit, dashed inner ring turns |
| `grid` | Full-frame Bauhaus tiles: each cell has a background color and one shape (circle, half / quarter circle, triangle, ring, square, pill, hatch) | Each tile turns in four eased quarter turns per cycle, staggered |
| `float` | Sparse mixed shapes (filled and outlined) away from the center | Closed-loop drift and slow turns |
| `stripe` | Full-frame diagonal stripes of varying width (solid, hatched, gaps); optional open center box | Widths breathe; the stripe unit slides by exactly one unit per cycle |
| `memphis` | 80s Memphis: squiggles, zigzags, triangles with outlines, bars, rings, dot clusters, two large soft circles, dotted backdrop | Drift, slow turns or wobble, squiggles undulate |

### Intro: `loop` or `reveal`

- `loop` (default): seamless loop from the first frame; use for backgrounds.
- `reveal`: shapes build in over `introSeconds` (default 3), then the normal motion continues. Frame blocks wipe in from their outer edge (largest first), orbit arcs draw on (inner rings first), grid tiles fill in as a diagonal wave, other shapes pop in with a small overshoot. A reveal pattern is an **opener**: its end does not match its start, so it is not a loop. Reveal patterns use `durationSeconds: 10` and contain `Reveal` in the key (e.g. `indigoRevealFrame`).

## Color roles

| Prop | Role |
|---|---|
| `backgroundColor` → `backgroundColorEnd` | Diagonal background gradient; `transparent` for an overlay |
| `colors` | Shape colors, 2–6, most prominent first. In `grid`, also the tile backgrounds |
| `accentColor` | Ornaments and hatching |

## Palettes

Light patterns reuse `gradientPalettes` (see [gradient.md](./gradient.md)) so they sit with the gradient backgrounds. Dark patterns follow the references and are approved for this family only. Bolder palettes for this family live in `geometricPalettes`:

| Palette | Background | Shapes | Accent | Mood |
|---|---|---|---|---|
| `mono` | `#f4f4f2` warm grey-white | Black `#1d1d1f`, greys, white | Lime `#b8e62e` | Swiss, minimal |
| `ink` | `#f6f2ea` off-white | Navy `#1f2a5a`, indigo, pale blue, white | Navy | Calm, business |
| `citrus` | `#fffbea` cream | Lemon `#ffcf33`, lime, teal `#1fa59a` | Dark teal `#1f4f4b` | Fresh, bright |
| `terracotta` | `#f3e9dc` beige | Terracotta `#c9714c`, sage, mustard | Brown `#5b4636` | Scandinavian, earthy |

Patterns:

| Pattern | Background | Shapes | Mood |
|---|---|---|---|
| `indigoFrame` | Indigo `#1a2280` → `#121a5c` | Violet, purple, magenta, lavender | Reference 1, tech presentation |
| `skyFrame` | Ice blue | `sky` palette + white | Clean corporate |
| `peachFrame` | Ivory | `peach` palette (lilac, peach) | Soft editorial |
| `midnightOrbit` | Midnight navy `#0b0f2a` | Orange `#ff9a62`, lavender `#9b8cff`, mint `#5fe3b0` | Reference 2 |
| `aquaOrbit` | Pale mint | `aqua` palette, lime | Fresh |
| `sunsetOrbit` | Peach dusk | `sunset` palette, gold | Warm |
| `bauhausGrid` | Cream | Periwinkle, azure, butter yellow, ink `#1f2340` | Bauhaus, bold |
| `blushGrid` | Pale pink | `blush` palette, berry `#c95b86` | Playful |
| `periwinkleFloat` | Lilac | `periwinkle` palette, peach | Light, airy |
| `skyTransparentFloat` | Transparent | `sky` palette, lime, white | Overlay (export with `--alpha`) |
| `monoFrame` | `mono` | | Swiss, minimal |
| `inkOrbit` | `ink` | | Business |
| `terracottaGrid` | `terracotta` | | Earthy Bauhaus |
| `citrusFloat` | `citrus` | | Fresh |
| `skyStripe` | Ice blue | `sky` palette, full frame | Corporate |
| `terracottaStripe` | `terracotta` | Full frame | Earthy |
| `monoStripe` | `mono` | Full frame | Minimal |
| `citrusMemphis` | `citrus` | | 80s pop |
| `blushMemphis` | Pale pink | `blush`, periwinkle, berry squiggles | Playful pop |
| `indigoRevealFrame`, `midnightRevealOrbit`, `bauhausRevealGrid` | As their loop versions | | Openers (`intro: "reveal"`) |

## Avoid

- Strong reds as a main color (same as [gradient.md](./gradient.md)); terracotta stays muted.
- Gradients, glows or drop shadows on the shapes themselves.
- Filling the center in `frame` / `float`; the open area is the point of those styles.
- Too many large shapes: keep the large → small hierarchy.

## Adding a pattern

1. Add an entry to `geometric<Style>Patterns` (`Frame`, `Orbit`, `Grid`, `Float`, `Stripe`, `Memphis`) starting from `...base`; for a `geometricPalettes` color set, spread `...withPalette(G.<name>)`.
2. Name the key `<palette><Style>`; keys **must** end in the style name (`Frame`, `Orbit`, `Grid`, `Float`, `Stripe`, `Memphis`) because `render.sh` routes `Background-Geometric-*<Style>` to `out/Background/Geometric/<Style>/`.
3. Prefer `gradientPalettes` colors; vary layouts with `randomSeed`, `density` and `openCenter`.
4. Check stills at a few frames, then run `npm run lint`, `./render.sh check`, and `git diff --check`.

A new style goes in `layers.tsx` as another layer (call `p.revealAt(order)` for each shape so the reveal intro works), plus an entry in `GEOMETRIC_STYLES`, a pattern record, a Studio `<Folder>`, the ID script and a `render.sh` route.
