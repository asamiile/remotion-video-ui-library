import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const onboardingOperateSchemaV1 = z.object({
  recordColor: zColor().default("#FF3D9E"),
  backgroundColor: zColor().default("#060810"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.45),

  /** タップ（Recordボタン押下）が発生するフレーム */
  tapFrame: z.number().min(0).default(20),
  /** 波形が縮んで待機状態に戻り始めるフレーム（ここからループ終端に向けて減衰する） */
  resetStartFrame: z.number().min(0).default(65),
});

export type OnboardingOperateSchemaV1Type = z.infer<
  typeof onboardingOperateSchemaV1
>;
