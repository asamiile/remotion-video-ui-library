import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { gradientPalettes } from "../Gradient/gradient.schema";

export const GEOMETRIC_STYLES = ["frame", "orbit", "grid", "float", "stripe", "memphis"] as const;
export const GEOMETRIC_INTROS = ["loop", "reveal"] as const;

/**
 * Flat geometric motion background (presentation / infographic look).
 * See .agents/design/infographics.md for the design spec.
 */
export const geometricSchema = z.object({
  /**
   * frame = rectangles clustered at the edges with small ornaments, open
   * center; orbit = rounded arcs, rings and hatched discs turning around a
   * few centers; grid = Bauhaus tiles whose shapes rotate in steps;
   * float = sparse mixed shapes drifting and turning; stripe = diagonal
   * stripes that breathe and slide; memphis = 80s squiggles, zigzags and
   * bold small shapes over a dotted backdrop
   */
  style: z.enum(GEOMETRIC_STYLES),
  /**
   * loop = seamless loop from the first frame; reveal = shapes build in over
   * introSeconds first (an opener, so the end no longer matches the start)
   */
  intro: z.enum(GEOMETRIC_INTROS),
  /** reveal only: length of the build-in */
  introSeconds: z.number().min(1).max(8),
  /** "transparent" draws only the shapes, for layering over footage */
  backgroundColor: zColor(),
  /** Second stop of a diagonal background gradient; same as backgroundColor = flat */
  backgroundColorEnd: zColor(),
  /** Shape colors, used in order of prominence */
  colors: z.array(zColor()).min(2).max(6),
  /** Small ornaments: plus / cross marks, dot grids, chevrons, hatching */
  accentColor: zColor(),
  /** Amount of shapes; 1 = the designed default */
  density: z.number().min(0.3).max(2),
  /** Base stroke width in px for rings, arcs and outlines */
  strokeWidth: z.number().min(2).max(60),
  /** Empty area kept in the middle for titles (fraction of the frame); 0 = none */
  openCenter: z.number().min(0).max(0.8),
  /** Motion amplitude; 0 = still */
  motion: z.number().min(0).max(2),
  /** Animation cycles per composition; integers keep the loop seamless */
  loopCycles: z.number().int().min(1).max(4),
  randomSeed: z.number().int().min(0).max(999),
  /** Loop length in seconds (default 20) */
  durationSeconds: z.number().int().min(10).max(60).optional(),
});

export type GeometricSchemaType = z.infer<typeof geometricSchema>;

const DEFAULT_LOOP_SECONDS = 20;

export const geometricDurationFrames = (props: { durationSeconds?: number }) =>
  (props.durationSeconds ?? DEFAULT_LOOP_SECONDS) * 30;

const base = {
  intro: "loop",
  introSeconds: 3,
  density: 1,
  strokeWidth: 22,
  openCenter: 0.42,
  motion: 1,
  loopCycles: 1,
  randomSeed: 7,
} as const;

const P = gradientPalettes;

/**
 * Geometric-only palettes (bolder than the gradient ones). See
 * .agents/design/infographics.md.
 */
export const geometricPalettes = {
  mono: {
    backgroundColor: "#f4f4f2",
    backgroundColorEnd: "#e7e7e3",
    colors: ["#1d1d1f", "#8e8e93", "#d1d1d6", "#ffffff"],
    accentColor: "#b8e62e",
  },
  ink: {
    backgroundColor: "#f6f2ea",
    backgroundColorEnd: "#ebe4d6",
    colors: ["#1f2a5a", "#3d4f9a", "#9fb0e0", "#ffffff"],
    accentColor: "#1f2a5a",
  },
  citrus: {
    backgroundColor: "#fffbea",
    backgroundColorEnd: "#fff1c2",
    colors: ["#ffcf33", "#9fd43c", "#1fa59a", "#ffe7a3"],
    accentColor: "#1f4f4b",
  },
  terracotta: {
    backgroundColor: "#f3e9dc",
    backgroundColorEnd: "#e9d9c4",
    colors: ["#c9714c", "#8fa98a", "#e0a83c", "#fbf5ec"],
    accentColor: "#5b4636",
  },
} as const;

const G = geometricPalettes;
const withPalette = (palette: (typeof geometricPalettes)[keyof typeof geometricPalettes]) => ({
  ...palette,
  colors: [...palette.colors],
});

// Each style has its own Studio subfolder; keys must end in the style name
// (render.sh routes Background-Geometric-*<Style> to that folder).

/** Edge-clustered rectangles with ornaments; the center stays open. */
export const geometricFramePatterns: Record<string, GeometricSchemaType> = {
  /** Deep indigo with violet, magenta and lavender blocks */
  indigoFrame: {
    ...base,
    style: "frame",
    backgroundColor: "#1a2280",
    backgroundColorEnd: "#121a5c",
    colors: ["#4a35ff", "#8b3dff", "#ff3fe8", "#d9d2ff", "#2a1d70"],
    accentColor: "#c9c2ff",
    openCenter: 0.5,
    randomSeed: 11,
  },
  /** Ice-blue paper with azure and sky blocks */
  skyFrame: {
    ...base,
    style: "frame",
    backgroundColor: "#eef6ff",
    backgroundColorEnd: "#dcebff",
    colors: [P.sky.deep, P.sky.light, P.sky.accent, "#ffffff", "#9fd0ff"],
    accentColor: P.sky.deep,
    openCenter: 0.5,
    randomSeed: 24,
  },
  /** Warm ivory with lilac and peach blocks */
  peachFrame: {
    ...base,
    style: "frame",
    backgroundColor: P.peach.light,
    backgroundColorEnd: "#efe2d6",
    colors: [P.peach.deep, P.peach.accent, "#ffd9c4", "#ffffff", "#a995e6"],
    accentColor: "#8f7bd6",
    openCenter: 0.5,
    randomSeed: 38,
  },
  /** Black, greys and white with a lime accent; Swiss-minimal */
  monoFrame: { ...base, style: "frame", ...withPalette(G.mono), openCenter: 0.5, randomSeed: 73 },
  /** indigoFrame, building in block by block (opener) */
  indigoRevealFrame: {
    ...base,
    style: "frame",
    intro: "reveal",
    backgroundColor: "#1a2280",
    backgroundColorEnd: "#121a5c",
    colors: ["#4a35ff", "#8b3dff", "#ff3fe8", "#d9d2ff", "#2a1d70"],
    accentColor: "#c9c2ff",
    openCenter: 0.5,
    randomSeed: 11,
    durationSeconds: 10,
  },
};

/** Rounded arcs, rings and hatched discs turning around a few centers. */
export const geometricOrbitPatterns: Record<string, GeometricSchemaType> = {
  /** Midnight navy with orange, lavender and mint arcs */
  midnightOrbit: {
    ...base,
    style: "orbit",
    backgroundColor: "#0b0f2a",
    backgroundColorEnd: "#05071a",
    colors: ["#ff9a62", "#9b8cff", "#5fe3b0"],
    accentColor: "#5fe3b0",
    openCenter: 0,
    randomSeed: 5,
  },
  /** Mint paper with teal and lime arcs */
  aquaOrbit: {
    ...base,
    style: "orbit",
    backgroundColor: "#effbf7",
    backgroundColorEnd: "#d9f5ee",
    colors: [P.aqua.deep, P.aqua.light, "#a9cf2f"],
    accentColor: P.aqua.deep,
    openCenter: 0,
    randomSeed: 17,
  },
  /** Peach dusk with lavender and gold arcs */
  sunsetOrbit: {
    ...base,
    style: "orbit",
    backgroundColor: "#fff1ea",
    backgroundColorEnd: "#ffe0d6",
    colors: [P.sunset.deep, P.sunset.light, "#f4b942"],
    accentColor: P.sunset.deep,
    openCenter: 0,
    randomSeed: 29,
  },
  /** Navy ink arcs on warm off-white */
  inkOrbit: { ...base, style: "orbit", ...withPalette(G.ink), openCenter: 0, randomSeed: 81 },
  /** midnightOrbit, arcs drawing on one by one (opener) */
  midnightRevealOrbit: {
    ...base,
    style: "orbit",
    intro: "reveal",
    backgroundColor: "#0b0f2a",
    backgroundColorEnd: "#05071a",
    colors: ["#ff9a62", "#9b8cff", "#5fe3b0"],
    accentColor: "#5fe3b0",
    openCenter: 0,
    randomSeed: 5,
    durationSeconds: 10,
  },
};

/** Bauhaus tiles: each cell holds one shape that rotates in quarter turns. */
export const geometricGridPatterns: Record<string, GeometricSchemaType> = {
  /** Cream, periwinkle, azure and butter yellow */
  bauhausGrid: {
    ...base,
    style: "grid",
    backgroundColor: "#f7f1e6",
    backgroundColorEnd: "#f7f1e6",
    colors: ["#f7f1e6", P.periwinkle.deep, P.sky.deep, "#ffd166", "#1f2340"],
    accentColor: "#1f2340",
    openCenter: 0,
    randomSeed: 3,
  },
  /** Blush pinks and butter yellow */
  blushGrid: {
    ...base,
    style: "grid",
    backgroundColor: "#fff4f6",
    backgroundColorEnd: "#fff4f6",
    colors: ["#fff4f6", P.blush.deep, P.blush.light, P.blush.accent, "#c95b86"],
    accentColor: "#c95b86",
    openCenter: 0,
    randomSeed: 47,
  },
  /** Terracotta, sage and mustard tiles; Scandinavian earth tones */
  terracottaGrid: { ...base, style: "grid", ...withPalette(G.terracotta), openCenter: 0, randomSeed: 58 },
  /** bauhausGrid, tiles filling in as a diagonal wave (opener) */
  bauhausRevealGrid: {
    ...base,
    style: "grid",
    intro: "reveal",
    backgroundColor: "#f7f1e6",
    backgroundColorEnd: "#f7f1e6",
    colors: ["#f7f1e6", P.periwinkle.deep, P.sky.deep, "#ffd166", "#1f2340"],
    accentColor: "#1f2340",
    openCenter: 0,
    randomSeed: 3,
    durationSeconds: 10,
  },
};

/** Sparse mixed shapes drifting and slowly turning. */
export const geometricFloatPatterns: Record<string, GeometricSchemaType> = {
  /** Lilac paper with periwinkle and lavender shapes */
  periwinkleFloat: {
    ...base,
    style: "float",
    backgroundColor: "#f3f1ff",
    backgroundColorEnd: "#e6e1ff",
    colors: [P.periwinkle.deep, P.periwinkle.light, "#ffb38a", "#ffffff"],
    accentColor: P.periwinkle.deep,
    strokeWidth: 16,
    density: 1.2,
    randomSeed: 52,
  },
  /** Sky shapes on no backdrop, for layering over footage */
  skyTransparentFloat: {
    ...base,
    style: "float",
    backgroundColor: "transparent",
    backgroundColorEnd: "transparent",
    colors: [P.sky.deep, P.sky.light, P.aqua.accent, "#ffffff"],
    accentColor: "#ffffff",
    strokeWidth: 16,
    density: 1.2,
    randomSeed: 66,
  },
  /** Lemon, lime and teal shapes on cream */
  citrusFloat: { ...base, style: "float", ...withPalette(G.citrus), strokeWidth: 16, density: 1.2, randomSeed: 91 },
};

/** Diagonal stripes that breathe and slide. */
export const geometricStripePatterns: Record<string, GeometricSchemaType> = {
  /** Sky blues and white with hatching, full frame */
  skyStripe: {
    ...base,
    style: "stripe",
    backgroundColor: "#eef6ff",
    backgroundColorEnd: "#dcebff",
    colors: [P.sky.deep, P.sky.light, "#ffffff", P.sky.accent],
    accentColor: P.sky.deep,
    openCenter: 0,
    randomSeed: 14,
  },
  /** Full-frame earth-tone stripes */
  terracottaStripe: { ...base, style: "stripe", ...withPalette(G.terracotta), openCenter: 0, randomSeed: 22 },
  /** Monochrome stripes with a lime accent, full frame */
  monoStripe: { ...base, style: "stripe", ...withPalette(G.mono), openCenter: 0, randomSeed: 36 },
};

/** 80s Memphis: squiggles, zigzags and bold small shapes. */
export const geometricMemphisPatterns: Record<string, GeometricSchemaType> = {
  /** Lemon, lime and teal with dark-teal squiggles */
  citrusMemphis: { ...base, style: "memphis", ...withPalette(G.citrus), strokeWidth: 18, randomSeed: 12 },
  /** Blush pinks and butter yellow with berry squiggles */
  blushMemphis: {
    ...base,
    style: "memphis",
    backgroundColor: "#fff4f6",
    backgroundColorEnd: "#ffe6ec",
    colors: [P.blush.deep, P.blush.accent, P.periwinkle.light, "#ffd3de"],
    accentColor: "#8c2f5a",
    strokeWidth: 18,
    randomSeed: 44,
  },
};
