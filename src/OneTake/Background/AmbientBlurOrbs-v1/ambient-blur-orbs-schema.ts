import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const ambientBlurOrbsSchemaV1 = z.object({
  topLeftColor: zColor().default("#37E9FF"),
  bottomRightColor: zColor().default("#FF3D9E"),
  orbOpacity: z.number().min(0).max(1).default(0.24),
  blurPx: z.number().min(0).default(100),

  /** `glow-drift`が1周するフレーム数（asami.tokyo実装の`14s`に対応。
   *  シームレスループ前提のため、コンポジション全体の尺はこの値と一致させること） */
  driftPeriodFrames: z.number().min(10).default(420),
});

export type AmbientBlurOrbsSchemaV1Type = z.infer<
  typeof ambientBlurOrbsSchemaV1
>;
