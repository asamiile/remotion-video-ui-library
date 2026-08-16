import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const onboardingTestSchema = z.object({
  phoneColor: zColor().default("#37E9FF"),
  laptopColor: zColor().default("#9C7BFF"),
  recordColor: zColor().default("#FF3D9E"),
  successColor: zColor().default("#50F5A4"),
  backgroundColor: zColor().default("#060810"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.45),
});

export type OnboardingTestSchemaType = z.infer<typeof onboardingTestSchema>;

export const onboardingTestDurationFrames = 720;

export const defaultOnboardingTestProps = {
  phoneColor: "#37E9FF",
  laptopColor: "#9C7BFF",
  recordColor: "#FF3D9E",
  successColor: "#50F5A4",
  backgroundColor: "#060810",
  vignetteOpacity: 0.45,
} as const;

export const onboardingTestPatterns = {
  default: defaultOnboardingTestProps,
} as const;
