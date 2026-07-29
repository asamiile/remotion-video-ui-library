import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const inkRippleTransitionSchemaV1 = z.object({
  backgroundColor: zColor().default("#060810"),
  ringColor: zColor().default("#eef1fc"),

  ringCount: z.number().min(1).max(8).default(3),
  /** Gap between each ring's start, in frames */
  ringStaggerFrames: z.number().min(0).default(4),
  /** Frames for a single ring to expand from 0 to maxRadiusPercent and fade out */
  ringDurationFrames: z.number().min(1).default(24),
  maxRadiusPercent: z.number().min(1).max(150).default(70),
  strokeWidthPx: z.number().min(1).max(40).default(6),

  /** Roughens the ring edges via an SVG turbulence displacement filter (ink-brush texture) */
  roughness: z.number().min(0).max(20).default(5),

  randomSeed: z.string().default("ink-ripple-v1"),
});

export type InkRippleTransitionSchemaV1Type = z.infer<
  typeof inkRippleTransitionSchemaV1
>;
