import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const interlaceGlowBandSchema = z.object({
  glowColor: zColor().default("#d9a51c"),

  /** How much of the frame (from the bottom) the glow covers */
  bandHeightPercent: z.number().min(10).max(100).default(55),
  glowIntensity: z.number().min(0).max(1).default(0.85),

  interlaceLineSpacingPx: z.number().min(1).max(20).default(3),
  interlaceOpacity: z.number().min(0).max(1).default(0.35),

  /** Horizontal jitter applied to the interlace pattern (px) */
  glitchJitterPx: z.number().min(0).max(40).default(8),
  /** How often (in frames) the glitch jitter re-rolls */
  glitchEveryFrames: z.number().min(1).default(4),

  randomSeed: z.string().default("interlace-glow-band"),
});

export type InterlaceGlowBandSchemaType = z.infer<
  typeof interlaceGlowBandSchema
>;

export const defaultInterlaceGlowBandProps = {
  glowColor: "#d9a51c",

  bandHeightPercent: 55,
  glowIntensity: 0.85,

  interlaceLineSpacingPx: 3,
  interlaceOpacity: 0.35,

  glitchJitterPx: 8,
  glitchEveryFrames: 4,

  randomSeed: "interlace-glow-band",
} as const;

export const interlaceGlowBandPatterns = {
  /** Amber/gold glow with glitchy interlace lines (English default) */
  amberGlitch: {
    ...defaultInterlaceGlowBandProps,
  },

  /** Cyan variant, calmer (less jitter) */
  cyanCalm: {
    ...defaultInterlaceGlowBandProps,
    glowColor: "#37e9ff",
    glitchJitterPx: 2,
  },
};
