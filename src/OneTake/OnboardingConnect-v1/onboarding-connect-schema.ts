import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const onboardingConnectSchemaV1 = z.object({
  phoneColor: zColor().default("#37E9FF"),
  laptopColor: zColor().default("#9C7BFF"),
  backgroundColor: zColor().default("#060810"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.45),

  /** Wi-Fiパルスが往復する「接続前」フェーズの長さ（フレーム数） */
  pulsePhaseFrames: z.number().min(30).default(60),
  /** 1回のパルスが端から端まで到達するのにかかるフレーム数 */
  pulsePeriodFrames: z.number().min(10).default(45),

  fadeInDuration: z.number().min(0).default(15),
});

export type OnboardingConnectSchemaV1Type = z.infer<
  typeof onboardingConnectSchemaV1
>;
