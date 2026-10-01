import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  shaderBackgroundSchema,
} from "../../helpers/shader/background/shader-background.schema";

export const GRADIENT_FLOW_STYLES = ["waves", "mesh", "linear", "marble", "scoop"] as const;

/** Shared basic props plus gradient style, contrast, film grain and vignette. */
export const gradientFlowSchema = shaderBackgroundSchema.extend({
  /**
   * waves = two sine waves bending a three-color gradient, mesh = soft color
   * blobs drifting over colorA (mesh-gradient wallpaper), linear = soft,
   * motion-blurred light streaks over a linear gradient, marble = soft
   * marbled swirls (domain warping) without veins, scoop = ice cream: base
   * with two-tone areas (colorC), sauce ribbons (colorB) and specks
   */
  style: z.enum(GRADIENT_FLOW_STYLES),
  /** Crisper blobs, more colorA showing through and an S-curve; 0 = soft */
  contrast: z.number().min(0).max(1),
  /** Animated film grain; 0 = clean */
  grain: z.number().min(0).max(1),
  /** Edge darkening; 1 = the original vignette */
  vignette: z.number().min(0).max(2),
  /** scoop only: sauce-ribbon width; 0 = no ribbon */
  ribbon: z.number().min(0).max(2),
  /** scoop only: amount of chips / sprinkles; 0 = none */
  specks: z.number().min(0).max(1),
  /** scoop only: chip / sprinkle color */
  speckColor: zColor(),
});

export type GradientFlowSchemaType = z.infer<typeof gradientFlowSchema>;

export const gradientFlowDurationFrames = shaderBackgroundDurationFrames;

const base = {
  ...shaderBackgroundBase,
  backgroundColor: "#000000",
  style: "waves",
  contrast: 0,
  grain: 0,
  vignette: 1,
  ribbon: 0,
  specks: 0,
  speckColor: "#3a2a25",
} as const;

export const gradientFlowPatterns: Record<string, GradientFlowSchemaType> = {
  /** Sunset: dusk lavender waves warming into peach and soft gold */
  classic: {
    ...base,
    colorA: "#8f86e8",
    colorB: "#ffab9c",
    colorC: "#ffd98a",
    contrast: 0.2,
    grain: 0.15,
    vignette: 0,
  },

  // --- Mesh gradients -----------------------------------------------------

  /** Peach, lilac and cream blobs on warm ivory, lightly grained */
  peachMesh: {
    ...base,
    style: "mesh",
    colorA: "#f6eee6",
    colorB: "#c9b6f2",
    colorC: "#ffb38a",
    intensity: 1,
    grain: 0.35,
    vignette: 0,
    randomSeed: 12,
  },
  /** Pink, tangerine and butter-yellow sorbet */
  sorbetMesh: {
    ...base,
    style: "mesh",
    colorA: "#ffd6e0",
    colorB: "#ff7aa2",
    colorC: "#ffcf5c",
    scale: 1.2,
    intensity: 1,
    grain: 0.25,
    vignette: 0,
    randomSeed: 58,
  },

  // --- Mesh in the Linear palettes ---------------------------------------

  /** Mint base with deep teal and lime blobs (Aqua palette) */
  aquaMesh: {
    ...base,
    style: "mesh",
    colorA: "#7fe6d0",
    colorB: "#1aa9c4",
    colorC: "#d6f25a",
    intensity: 1.1,
    contrast: 0.4,
    grain: 0.15,
    vignette: 0,
    randomSeed: 6,
  },
  /** Lilac base with periwinkle and pale lavender blobs */
  periwinkleMesh: {
    ...base,
    style: "mesh",
    colorA: "#b7a6ff",
    colorB: "#6d7cff",
    colorC: "#e8e4ff",
    intensity: 1.1,
    contrast: 0.4,
    grain: 0.15,
    vignette: 0,
    randomSeed: 27,
  },
  /** Pale aqua base with sky and soft green blobs */
  mintMesh: {
    ...base,
    style: "mesh",
    colorA: "#cdf2ec",
    colorB: "#86d9ee",
    colorC: "#9fe04c",
    scale: 1.1,
    intensity: 1,
    contrast: 0.3,
    grain: 0.15,
    vignette: 0,
    randomSeed: 48,
  },
  /** Bright sky base with deep azure and ice-blue blobs */
  skyMesh: {
    ...base,
    style: "mesh",
    colorA: "#6cb8ff",
    colorB: "#0a64d8",
    colorC: "#d4ecff",
    intensity: 1.1,
    contrast: 0.45,
    grain: 0.15,
    vignette: 0,
    randomSeed: 72,
  },
};

/** Linear streak patterns; registered in their own Studio subfolder. */
export const gradientFlowLinearPatterns: Record<string, GradientFlowSchemaType> = {
  /** Teal to sky blue with a lime streak */
  aquaLinear: {
    ...base,
    style: "linear",
    colorA: "#1aa9c4",
    colorB: "#7fe6d0",
    colorC: "#d6f25a",
    grain: 0.12,
    vignette: 0,
    randomSeed: 6,
  },
  /** Periwinkle and lilac with a pale lavender glow */
  periwinkleLinear: {
    ...base,
    style: "linear",
    colorA: "#6d7cff",
    colorB: "#b7a6ff",
    colorC: "#e8e4ff",
    grain: 0.12,
    vignette: 0,
    randomSeed: 27,
  },
  /** Pale aqua with a soft green streak */
  mintLinear: {
    ...base,
    style: "linear",
    colorA: "#86d9ee",
    colorB: "#cdf2ec",
    colorC: "#9fe04c",
    intensity: 0.85,
    grain: 0.12,
    vignette: 0,
    randomSeed: 48,
  },
  /** Rose pink sweeping into butter yellow */
  blushLinear: {
    ...base,
    style: "linear",
    colorA: "#ff8fb1",
    colorB: "#ffd3de",
    colorC: "#ffe56b",
    grain: 0.12,
    vignette: 0,
    randomSeed: 15,
  },
  /** Deep azure to bright sky */
  skyLinear: {
    ...base,
    style: "linear",
    colorA: "#0a64d8",
    colorB: "#6cb8ff",
    colorC: "#d4ecff",
    grain: 0.12,
    vignette: 0,
    randomSeed: 72,
  },
};

/** Marble swirl patterns in the approved palettes; own Studio subfolder. */
export const gradientFlowMarblePatterns: Record<string, GradientFlowSchemaType> = {
  /** Deep teal and mint folded with lime */
  aquaMarble: {
    ...base,
    style: "marble",
    colorA: "#1aa9c4",
    colorB: "#7fe6d0",
    colorC: "#d6f25a",
    contrast: 0.2,
    grain: 0.12,
    vignette: 0,
    randomSeed: 6,
  },
  /** Periwinkle and lilac folded with pale lavender */
  periwinkleMarble: {
    ...base,
    style: "marble",
    colorA: "#6d7cff",
    colorB: "#b7a6ff",
    colorC: "#e8e4ff",
    contrast: 0.2,
    grain: 0.12,
    vignette: 0,
    randomSeed: 27,
  },
  /** Pale aqua folded with soft green */
  mintMarble: {
    ...base,
    style: "marble",
    colorA: "#86d9ee",
    colorB: "#cdf2ec",
    colorC: "#9fe04c",
    intensity: 0.85,
    grain: 0.12,
    vignette: 0,
    randomSeed: 48,
  },
  /** Rose pink folded with butter yellow */
  blushMarble: {
    ...base,
    style: "marble",
    colorA: "#ff8fb1",
    colorB: "#ffd3de",
    colorC: "#ffe56b",
    grain: 0.12,
    vignette: 0,
    randomSeed: 15,
  },
  /** Deep azure and sky folded with ice blue */
  skyMarble: {
    ...base,
    style: "marble",
    colorA: "#0a64d8",
    colorB: "#6cb8ff",
    colorC: "#d4ecff",
    contrast: 0.2,
    grain: 0.12,
    vignette: 0,
    randomSeed: 72,
  },
  /** Dusk lavender and peach folded with soft gold (Sunset palette) */
  sunsetMarble: {
    ...base,
    style: "marble",
    colorA: "#8f86e8",
    colorB: "#ffab9c",
    colorC: "#ffd98a",
    contrast: 0.2,
    grain: 0.12,
    vignette: 0,
    randomSeed: 33,
  },
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
export const gradientFlowScoopPatterns: Record<string, GradientFlowSchemaType> = {
  /** Mint green with chocolate chips */
  mintChipScoop: {
    ...scoopBase,
    colorA: "#a9e5cc",
    colorB: "#8fd8bb",
    colorC: "#bdeed8",
    specks: 0.7,
    speckColor: "#3a2a25",
    randomSeed: 4,
  },
  /** Vanilla with dark cookie chips */
  cookiesCreamScoop: {
    ...scoopBase,
    colorA: "#f4eddf",
    colorB: "#e8dfcd",
    colorC: "#ece4d3",
    specks: 0.8,
    speckColor: "#2b2522",
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
  /** Lavender with a cocoa ribbon and candy chips */
  lavenderCocoaScoop: {
    ...scoopBase,
    colorA: "#a58bd8",
    colorB: "#3f2f2e",
    colorC: "#9479cc",
    ribbon: 1.4,
    specks: 0.35,
    speckColor: "#f6c84a",
    randomSeed: 61,
  },
  /** Pastel pink with green sprinkles */
  bubblegumScoop: {
    ...scoopBase,
    colorA: "#f8c9d4",
    colorB: "#fbe3b5",
    colorC: "#f4b2c2",
    ribbon: 0.6,
    specks: 0.4,
    speckColor: "#45a85c",
    randomSeed: 40,
  },
  /** Sky blue with a cocoa ribbon and berry chips */
  sodaFloatScoop: {
    ...scoopBase,
    colorA: "#6cc0ea",
    colorB: "#3d2c29",
    colorC: "#82cbef",
    ribbon: 1.2,
    specks: 0.3,
    speckColor: "#d9536a",
    randomSeed: 78,
  },
};
