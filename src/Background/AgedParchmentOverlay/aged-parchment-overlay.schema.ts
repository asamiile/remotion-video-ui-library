import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const agedParchmentOverlaySchema = z.object({
  baseColor: zColor().default("#e9dcc3"),

  /** Darkened, worn-looking edges */
  edgeVignetteColor: zColor().default("#3a2c18"),
  edgeVignetteOpacity: z.number().min(0).max(1).default(0.45),

  /** Soft mottled blotches scattered across the surface */
  mottleColor: zColor().default("#8a6f45"),
  mottleOpacity: z.number().min(0).max(1).default(0.12),
  mottleCount: z.number().min(0).max(40).default(10),

  /** Fine fiber/grain texture via SVG turbulence */
  grainOpacity: z.number().min(0).max(1).default(0.15),
  grainScale: z.number().min(0.05).max(2).default(0.7),

  randomSeed: z.string().default("aged-parchment"),
});

export type AgedParchmentOverlaySchemaType = z.infer<
  typeof agedParchmentOverlaySchema
>;

export const defaultAgedParchmentOverlayProps = {
  baseColor: "#e9dcc3",

  edgeVignetteColor: "#3a2c18",
  edgeVignetteOpacity: 0.45,

  mottleColor: "#8a6f45",
  mottleOpacity: 0.12,
  mottleCount: 10,

  grainOpacity: 0.15,
  grainScale: 0.7,

  randomSeed: "aged-parchment",
} as const;

export const agedParchmentOverlayPatterns = {
  /** Cream parchment, restrained wear (English default) */
  parchment: {
    ...defaultAgedParchmentOverlayProps,
    baseColor: "#e9dcc3",
    edgeVignetteColor: "#3a2c18",
  },

  /** Darker, more worn leather look */
  leather: {
    ...defaultAgedParchmentOverlayProps,
    baseColor: "#5b4632",
    mottleColor: "#2c2013",
    edgeVignetteColor: "#0f0a05",
    edgeVignetteOpacity: 0.6,
    grainOpacity: 0.22,
  },
};
