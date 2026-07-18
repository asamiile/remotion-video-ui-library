import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const onboardingOperateSchemaV1 = z.object({
  recordColor: zColor().default("#FF3D9E"),
  mutedColor: zColor().default("#7C86A8"),
  laptopColor: zColor().default("#9C7BFF"),
  backgroundColor: zColor().default("#060810"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.45),

  /** タップ（Recordボタン押下）が発生するフレーム */
  tapFrame: z.number().min(0).default(24),
  fadeInDuration: z.number().min(0).default(15),
});

export type OnboardingOperateSchemaV1Type = z.infer<
  typeof onboardingOperateSchemaV1
>;
