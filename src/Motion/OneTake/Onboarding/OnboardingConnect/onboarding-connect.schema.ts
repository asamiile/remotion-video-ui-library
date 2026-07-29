import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const onboardingConnectSchemaV1 = z.object({
  phoneColor: zColor().default("#37E9FF"),
  laptopColor: zColor().default("#9C7BFF"),
  backgroundColor: zColor().default("#060810"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.45),

  /** Frames for one round trip of the bidirectional pulse. Assumes a seamless
   *  loop when embedded in the app, so the composition's total duration must
   *  be an integer multiple of this value. */
  pulsePeriodFrames: z.number().min(10).default(45),
  /** Frame position at which the "neon tube turning on" flicker effect fires once per loop */
  flickerTriggerFrame: z.number().min(0).default(6),
});

export type OnboardingConnectSchemaV1Type = z.infer<
  typeof onboardingConnectSchemaV1
>;

export const onboardingConnectV1DurationFrames = 90;

export const defaultOnboardingConnectV1Props = {
  phoneColor: "#37E9FF",
  laptopColor: "#9C7BFF",
  backgroundColor: "#060810",
  vignetteOpacity: 0.45,
  pulsePeriodFrames: 45,
  flickerTriggerFrame: 6,
} as const;

