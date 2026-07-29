import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const posterizeGradeOverlaySchemaV1 = z.object({
  /** Single-hue wash applied over the footage (mix-blend-mode: color) */
  washColor: zColor().default("#b91c2c"),
  washOpacity: z.number().min(0).max(1).default(0.55),

  /** Adds a grayscale layer beneath the wash (mix-blend-mode: luminosity) for a flatter, less photoreal look */
  desaturateFirst: z.boolean().default(true),
  desaturateOpacity: z.number().min(0).max(1).default(0.6),

  /** Optional accent vignette at the frame edges */
  vignetteColor: zColor().default("#000000"),
  vignetteOpacity: z.number().min(0).max(1).default(0),
});

export type PosterizeGradeOverlaySchemaV1Type = z.infer<
  typeof posterizeGradeOverlaySchemaV1
>;


export const defaultPosterizeGradeOverlayV1Props = {
  washColor: "#b91c2c",
  washOpacity: 0.55,

  desaturateFirst: true,
  desaturateOpacity: 0.6,

  vignetteColor: "#000000",
  vignetteOpacity: 0,
};
export const posterizeGradeOverlayV1Patterns = {
  redFlat: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#c81e2c",
    washOpacity: 0.6,
    desaturateFirst: true,
    desaturateOpacity: 0.7,
  },

  beige: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#c9a876",
    washOpacity: 0.35,
    desaturateFirst: true,
    desaturateOpacity: 0.3,
  },

  navyRed: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#1c2a4a",
    washOpacity: 0.55,
    desaturateFirst: true,
    desaturateOpacity: 0.4,
    vignetteColor: "#8a1420",
    vignetteOpacity: 0.35,
  },

  teal: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#1f6f6a",
    washOpacity: 0.5,
    desaturateFirst: true,
    desaturateOpacity: 0.4,
  },
};
