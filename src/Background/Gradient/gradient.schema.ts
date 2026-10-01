import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  shaderBackgroundSchema,
} from "../../helpers/shader/background/shader-background.schema";

export const GRADIENT_STYLES = ["waves", "mesh", "linear", "marble", "scoop"] as const;

/** Shared basic props plus gradient style, contrast, film grain and vignette. */
export const gradientSchema = shaderBackgroundSchema.extend({
  /**
   * waves = two sine waves bending a three-color gradient, mesh = soft color
   * blobs drifting over colorA (mesh-gradient wallpaper), linear = soft,
   * motion-blurred light streaks over a linear gradient, marble = soft
   * marbled swirls (domain warping) without veins, scoop = ice cream: base
   * with two-tone areas (colorC), sauce ribbons (colorB, ribbon2Color)
   */
  style: z.enum(GRADIENT_STYLES),
  /** Crisper blobs, more colorA showing through and an S-curve; 0 = soft */
  contrast: z.number().min(0).max(1),
  /** Animated film grain; 0 = clean */
  grain: z.number().min(0).max(1),
  /** Edge darkening; 1 = the original vignette */
  vignette: z.number().min(0).max(2),
  /** scoop only: sauce-ribbon width; 0 = no ribbon */
  ribbon: z.number().min(0).max(2),
  /** scoop only: second, thinner sauce ribbon on another swirl; 0 = none */
  ribbon2: z.number().min(0).max(2),
  /** scoop only: second ribbon color */
  ribbon2Color: zColor(),
});

export type GradientSchemaType = z.infer<typeof gradientSchema>;

export const gradientDurationFrames = shaderBackgroundDurationFrames;

const base = {
  ...shaderBackgroundBase,
  backgroundColor: "#000000",
  style: "waves",
  contrast: 0,
  grain: 0,
  vignette: 1,
  ribbon: 0,
  ribbon2: 0,
  ribbon2Color: "#3a2a25",
} as const;

type GradientPalette = { deep: string; light: string; accent: string };

/**
 * Approved gradient palettes (see .agents/design/gradient.md). Every
 * palette is available in every style below; add new palettes here first.
 */
export const gradientPalettes = {
  aqua: { deep: "#1aa9c4", light: "#7fe6d0", accent: "#d6f25a" },
  periwinkle: { deep: "#6d7cff", light: "#b7a6ff", accent: "#e8e4ff" },
  mint: { deep: "#86d9ee", light: "#cdf2ec", accent: "#9fe04c" },
  sky: { deep: "#0a64d8", light: "#6cb8ff", accent: "#d4ecff" },
  blush: { deep: "#ff8fb1", light: "#ffd3de", accent: "#ffe56b" },
  sunset: { deep: "#8f86e8", light: "#ffab9c", accent: "#ffd98a" },
  peach: { deep: "#c9b6f2", light: "#f6eee6", accent: "#ffb38a" },
  sorbet: { deep: "#ff7aa2", light: "#ffd6e0", accent: "#ffcf5c" },
} as const satisfies Record<string, GradientPalette>;

const P = gradientPalettes;

/** mesh: the light tone is the base, deep and accent tones are the blobs. */
const meshColors = (p: GradientPalette) => ({
  colorA: p.light,
  colorB: p.deep,
  colorC: p.accent,
});

/** waves, linear, marble: a deep-to-light ramp plus the accent. */
const rampColors = (p: GradientPalette) => ({
  colorA: p.deep,
  colorB: p.light,
  colorC: p.accent,
});

const wavesBase = { ...base, contrast: 0.2, grain: 0.15, vignette: 0 } as const;
const meshBase = {
  ...base,
  style: "mesh",
  intensity: 1.1,
  contrast: 0.4,
  grain: 0.15,
  vignette: 0,
} as const;
const linearBase = { ...base, style: "linear", grain: 0.12, vignette: 0 } as const;
const marbleBase = {
  ...base,
  style: "marble",
  contrast: 0.2,
  grain: 0.12,
  vignette: 0,
} as const;

// Each style has its own Studio subfolder; keys must end in the style name
// (render.sh routes Background-Gradient-*<Style> to that folder).

/** Two slow sine waves bending the palette ramp. */
export const gradientWavesPatterns: Record<string, GradientSchemaType> = {
  aquaWaves: { ...wavesBase, ...rampColors(P.aqua), randomSeed: 6 },
  periwinkleWaves: { ...wavesBase, ...rampColors(P.periwinkle), randomSeed: 27 },
  mintWaves: { ...wavesBase, ...rampColors(P.mint), randomSeed: 48 },
  skyWaves: { ...wavesBase, ...rampColors(P.sky), randomSeed: 72 },
  blushWaves: { ...wavesBase, ...rampColors(P.blush), randomSeed: 15 },
  sunsetWaves: { ...wavesBase, ...rampColors(P.sunset) },
  peachWaves: { ...wavesBase, ...rampColors(P.peach), randomSeed: 12 },
  sorbetWaves: { ...wavesBase, ...rampColors(P.sorbet), randomSeed: 58 },
};

/** Soft color blobs drifting over the light tone (mesh-gradient wallpaper). */
export const gradientMeshPatterns: Record<string, GradientSchemaType> = {
  aquaMesh: { ...meshBase, ...meshColors(P.aqua), randomSeed: 6 },
  periwinkleMesh: { ...meshBase, ...meshColors(P.periwinkle), randomSeed: 27 },
  mintMesh: {
    ...meshBase,
    ...meshColors(P.mint),
    scale: 1.1,
    intensity: 1,
    contrast: 0.3,
    randomSeed: 48,
  },
  skyMesh: { ...meshBase, ...meshColors(P.sky), contrast: 0.45, randomSeed: 72 },
  blushMesh: { ...meshBase, ...meshColors(P.blush), randomSeed: 15 },
  sunsetMesh: { ...meshBase, ...meshColors(P.sunset), randomSeed: 33 },
  peachMesh: {
    ...meshBase,
    ...meshColors(P.peach),
    intensity: 1,
    contrast: 0,
    grain: 0.35,
    randomSeed: 12,
  },
  sorbetMesh: {
    ...meshBase,
    ...meshColors(P.sorbet),
    scale: 1.2,
    intensity: 1,
    contrast: 0,
    grain: 0.25,
    randomSeed: 58,
  },
};

/** Soft, motion-blurred light streaks over the palette ramp. */
export const gradientLinearPatterns: Record<string, GradientSchemaType> = {
  aquaLinear: { ...linearBase, ...rampColors(P.aqua), randomSeed: 6 },
  periwinkleLinear: { ...linearBase, ...rampColors(P.periwinkle), randomSeed: 27 },
  mintLinear: { ...linearBase, ...rampColors(P.mint), intensity: 0.85, randomSeed: 48 },
  skyLinear: { ...linearBase, ...rampColors(P.sky), randomSeed: 72 },
  blushLinear: { ...linearBase, ...rampColors(P.blush), randomSeed: 15 },
  sunsetLinear: { ...linearBase, ...rampColors(P.sunset), randomSeed: 33 },
  peachLinear: { ...linearBase, ...rampColors(P.peach), randomSeed: 12 },
  sorbetLinear: { ...linearBase, ...rampColors(P.sorbet), randomSeed: 58 },
};

/** Soft paint marbling (domain warping) without veins. */
export const gradientMarblePatterns: Record<string, GradientSchemaType> = {
  aquaMarble: { ...marbleBase, ...rampColors(P.aqua), randomSeed: 6 },
  periwinkleMarble: { ...marbleBase, ...rampColors(P.periwinkle), randomSeed: 27 },
  mintMarble: {
    ...marbleBase,
    ...rampColors(P.mint),
    intensity: 0.85,
    contrast: 0,
    randomSeed: 48,
  },
  skyMarble: { ...marbleBase, ...rampColors(P.sky), randomSeed: 72 },
  blushMarble: { ...marbleBase, ...rampColors(P.blush), contrast: 0, randomSeed: 15 },
  sunsetMarble: { ...marbleBase, ...rampColors(P.sunset), randomSeed: 33 },
  peachMarble: { ...marbleBase, ...rampColors(P.peach), randomSeed: 12 },
  sorbetMarble: { ...marbleBase, ...rampColors(P.sorbet), randomSeed: 58 },
};

const scoopBase = {
  ...base,
  style: "scoop",
  scale: 1,
  intensity: 1,
  grain: 0.1,
  vignette: 0,
} as const;

/** Ice-cream scoop patterns; own Studio subfolder. */
export const gradientScoopPatterns: Record<string, GradientSchemaType> = {
  /** Mint green with a chocolate ribbon */
  mintChipScoop: {
    ...scoopBase,
    colorA: "#a9e5cc",
    colorB: "#3a2a25",
    colorC: "#bdeed8",
    ribbon: 0.8,
    randomSeed: 4,
  },
  /** Vanilla with a dark cookie ribbon */
  cookiesCreamScoop: {
    ...scoopBase,
    colorA: "#f4eddf",
    colorB: "#2f2825",
    colorC: "#ece4d3",
    ribbon: 0.9,
    randomSeed: 32,
  },
  /** Cream with a soft strawberry-pink ribbon */
  strawberryRippleScoop: {
    ...scoopBase,
    colorA: "#fbf1e4",
    colorB: "#e8607a",
    colorC: "#f9d9d8",
    ribbon: 1,
    randomSeed: 19,
  },
  /** Matcha and vanilla two-tone */
  matchaSwirlScoop: {
    ...scoopBase,
    colorA: "#f5f1e1",
    colorB: "#7fa94e",
    colorC: "#a6c777",
    ribbon: 0.5,
    randomSeed: 27,
  },
  /** Lemon and milk-white with a hint of lime */
  lemonSorbetScoop: {
    ...scoopBase,
    colorA: "#fbf8ee",
    colorB: "#c9df6a",
    colorC: "#f1e15a",
    ribbon: 0.6,
    randomSeed: 48,
  },
  /** Magenta and orange on white */
  berryCitrusScoop: {
    ...scoopBase,
    colorA: "#fbf4f1",
    colorB: "#c7356f",
    colorC: "#ffb24f",
    ribbon: 1.6,
    randomSeed: 84,
  },
  /** Caramel and cream two-tone with a cream swirl */
  caramelSwirlScoop: {
    ...scoopBase,
    colorA: "#f3ead9",
    colorB: "#a77d57",
    colorC: "#c39d77",
    ribbon: 0.7,
    randomSeed: 15,
  },
  /** Lavender with cocoa and candy-yellow ribbons */
  lavenderCocoaScoop: {
    ...scoopBase,
    colorA: "#a58bd8",
    colorB: "#3f2f2e",
    colorC: "#9479cc",
    ribbon: 1.4,
    ribbon2: 0.5,
    ribbon2Color: "#f6c84a",
    randomSeed: 61,
  },
  /** Pastel pink with cream and green ribbons */
  bubblegumScoop: {
    ...scoopBase,
    colorA: "#f8c9d4",
    colorB: "#fbe3b5",
    colorC: "#f4b2c2",
    ribbon: 0.6,
    ribbon2: 0.5,
    ribbon2Color: "#45a85c",
    randomSeed: 40,
  },
  /** Sky blue with cocoa and berry ribbons */
  sodaFloatScoop: {
    ...scoopBase,
    colorA: "#6cc0ea",
    colorB: "#3d2c29",
    colorC: "#82cbef",
    ribbon: 1.2,
    ribbon2: 0.5,
    ribbon2Color: "#d9536a",
    randomSeed: 78,
  },
};
