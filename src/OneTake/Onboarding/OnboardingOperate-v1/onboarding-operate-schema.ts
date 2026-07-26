import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const onboardingOperateSchemaV1 = z.object({
  recordColor: zColor().default("#FF3D9E"),
  backgroundColor: zColor().default("#060810"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.45),

  /** Frame at which the tap (pressing the Record button) occurs */
  tapFrame: z.number().min(0).default(20),
  /** Frame at which the waveform starts shrinking back to idle (decays from here toward the loop end) */
  resetStartFrame: z.number().min(0).default(65),
});

export type OnboardingOperateSchemaV1Type = z.infer<
  typeof onboardingOperateSchemaV1
>;
