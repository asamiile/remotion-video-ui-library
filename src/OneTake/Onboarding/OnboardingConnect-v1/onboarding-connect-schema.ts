import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const onboardingConnectSchemaV1 = z.object({
  phoneColor: zColor().default("#37E9FF"),
  laptopColor: zColor().default("#9C7BFF"),
  backgroundColor: zColor().default("#060810"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.45),

  /** 双方向パルスが1往復するフレーム数（アプリ埋め込み時にシームレスループする前提のため、
   *  コンポジション全体の尺はこの整数倍にすること） */
  pulsePeriodFrames: z.number().min(10).default(45),
  /** 1ループ中に一度だけ「ネオン管が点灯する」フリッカー演出が起きるフレーム位置 */
  flickerTriggerFrame: z.number().min(0).default(6),
});

export type OnboardingConnectSchemaV1Type = z.infer<
  typeof onboardingConnectSchemaV1
>;
