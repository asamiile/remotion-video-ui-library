import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const ambientBlurOrbsSchema = z.object({
  topLeftColor: zColor().default("#37E9FF"),
  bottomRightColor: zColor().default("#FF3D9E"),
  orbOpacity: z.number().min(0).max(1).default(0.24),
  blurPx: z.number().min(0).default(100),

  /** Frames for one full `glow-drift` cycle (corresponds to `14s` in the
   *  asami.tokyo implementation). Assumes a seamless loop, so the
   *  composition's total duration must match this value. */
  driftPeriodFrames: z.number().min(10).default(420),
});

export type AmbientBlurOrbsSchemaType = z.infer<
  typeof ambientBlurOrbsSchemaV1
>;

export const ambientBlurOrbsDurationFrames = 420;

export const defaultAmbientBlurOrbsProps = {
  topLeftColor: "#37E9FF",
  bottomRightColor: "#FF3D9E",
  orbOpacity: 0.24,
  blurPx: 100,
  driftPeriodFrames: 420,
} as const;

