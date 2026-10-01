import { z } from "zod";
import { gradientPalettes } from "../Gradient/gradient.schema";
import {
  shaderBackgroundBase,
  shaderBackgroundSchema,
  shaderBackgroundDurationFrames,
} from "../../helpers/shader/background/shader-background.schema";

export const HALFTONE_FIELDS = [
  "sweep",
  "ripple",
  "contour",
  "spotlight",
  "interference",
  "ribbon",
] as const;
export const HALFTONE_SHAPES = [
  "dot",
  "diamond",
  "square",
  "line",
  "cross",
] as const;
export const HALFTONE_PALETTES = [
  "custom",
  "paper",
  "ocean",
  "terracotta",
  "lavender",
  "sky",
  "sorbet",
  "sunset",
] as const;

const inkOnPaper = (ink: string, paper: string) => ({
  backgroundColor: paper,
  colorA: ink,
  colorB: ink,
});

/** Flat paper with one or two inks; pastel colors share the gradient palette source. */
export const halftonePalettes = {
  paper: inkOnPaper("#242422", "#f3ecd9"),
  ocean: { backgroundColor: "#101e38", colorA: "#3889bf", colorB: "#9edee5" },
  terracotta: inkOnPaper("#b8563e", "#f5e8d5"),
  lavender: inkOnPaper(
    gradientPalettes.periwinkle.deep,
    gradientPalettes.periwinkle.accent,
  ),
  sky: inkOnPaper(gradientPalettes.sky.deep, gradientPalettes.sky.accent),
  sorbet: inkOnPaper(
    gradientPalettes.sorbet.deep,
    gradientPalettes.sorbet.light,
  ),
  sunset: inkOnPaper(
    gradientPalettes.sunset.deep,
    gradientPalettes.sunset.accent,
  ),
} as const;

export const halftoneDotsSchema = shaderBackgroundSchema.extend({
  field: z.enum(HALFTONE_FIELDS).default("sweep"),
  shape: z.enum(HALFTONE_SHAPES).default("dot"),
  palette: z
    .enum(HALFTONE_PALETTES)
    .default("custom")
    .describe(
      "Choose custom to use backgroundColor, colorA, and colorB directly.",
    ),
});
export type HalftoneDotsSchemaType = z.infer<typeof halftoneDotsSchema>;
export const halftoneDotsDurationFrames = shaderBackgroundDurationFrames;

export const defaultHalftoneDotsProps = {
  ...shaderBackgroundBase,
  backgroundColor: "transparent",
  colorA: "#ff4f6d",
  colorB: "#ffd166",
  colorC: "#ffffff",
  field: "sweep",
  shape: "dot",
  palette: "custom",
} as const;

export const halftoneDotsPatterns: Record<string, HalftoneDotsSchemaType> = {
  coralGoldSweep: defaultHalftoneDotsProps,
  newsprint: {
    ...defaultHalftoneDotsProps,
    backgroundColor: "#f3ecd9",
    colorA: "#242422",
    colorB: "#242422",
    scale: 1.35,
    intensity: 0.9,
  },
  ripple: {
    ...defaultHalftoneDotsProps,
    field: "ripple",
    backgroundColor: "#101e38",
    colorA: "#3889bf",
    colorB: "#9edee5",
    scale: 1.1,
    intensity: 0.88,
  },
  contour: {
    ...defaultHalftoneDotsProps,
    field: "contour",
    backgroundColor: "#f5e8d5",
    colorA: "#b8563e",
    colorB: "#b8563e",
    scale: 1.2,
    intensity: 0.92,
  },
  spotlight: {
    ...defaultHalftoneDotsProps,
    field: "spotlight",
    backgroundColor: "#101c30",
    colorA: "#428eac",
    colorB: "#a5dbe3",
    scale: 0.85,
    intensity: 0.86,
  },
  lavenderDiamonds: {
    ...defaultHalftoneDotsProps,
    ...halftonePalettes.lavender,
    palette: "lavender",
    shape: "diamond",
    field: "contour",
    scale: 0.8,
    intensity: 0.94,
  },
  skyLines: {
    ...defaultHalftoneDotsProps,
    ...halftonePalettes.sky,
    palette: "sky",
    shape: "line",
    field: "ribbon",
    scale: 0.75,
    intensity: 0.82,
  },
  sorbetCrosses: {
    ...defaultHalftoneDotsProps,
    ...halftonePalettes.sorbet,
    palette: "sorbet",
    shape: "cross",
    field: "ripple",
    scale: 0.7,
    intensity: 0.9,
  },
  sunsetSquares: {
    ...defaultHalftoneDotsProps,
    ...halftonePalettes.sunset,
    palette: "sunset",
    shape: "square",
    field: "sweep",
    scale: 0.9,
    intensity: 0.85,
  },
  oceanInterference: {
    ...defaultHalftoneDotsProps,
    ...halftonePalettes.ocean,
    palette: "ocean",
    field: "interference",
    scale: 1.05,
    intensity: 0.9,
  },
  paperRibbon: {
    ...defaultHalftoneDotsProps,
    ...halftonePalettes.paper,
    palette: "paper",
    field: "ribbon",
    scale: 1.25,
    intensity: 0.88,
  },
};
