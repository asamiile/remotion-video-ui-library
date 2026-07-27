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
