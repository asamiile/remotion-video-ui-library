import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const locationSchemaV1 = z.object({
  locationName: z.string().default("Tokyo"),
  fontSize: z.number().min(10).max(200).default(60),
  textColor: zColor().default("rgba(255, 255, 255, 1)"),

  backgroundColor: zColor().default("rgba(0, 0, 0, 0.5)"),
  showBackground: z.boolean().default(true),

  positionX: z.number().default(50), // percentage
  positionY: z.number().default(50), // percentage

  fontFamily: z.string().default("'Line Seed JP_100'"),
  fontWeight: z.enum(["400", "700"]).default("700"),

  animationDurationFrames: z.number().min(1).default(90), // frame count (1 second at 30fps)
  slideInDistance: z.number().min(0).max(500).default(100), // slide-in distance (px)
  delayDurationFrames: z.number().min(0).default(30), // delay (frame count)
  fadeInDurationFrames: z.number().min(1).default(9), // fade-in duration (frame count)
  textPaddingX: z.number().default(20), // horizontal text padding (px)
  textPaddingY: z.number().default(20), // vertical text padding (px)
  lineHeight: z.number().default(3), // line height (px)
  lineMaxWidth: z.number().default(100), // line max width (px)
  lineSpacing: z.number().default(20), // spacing between text and line (px)
  circleSize: z.number().default(16), // circle size (px)
});

export type LocationSchemaV1Type = z.infer<typeof locationSchemaV1>;

import { msToFrame } from "../../helpers/ms-to-frame";
const LINESEED_FONT = "'Line Seed JP_100', sans-serif";

export const locationV1DurationFrames = 90;

export const defaultLocationV1Props = {
  fontSize: 36,
  textColor: "rgb(195, 192, 187)",
  backgroundColor: "rgb(195, 192, 187)",
  showBackground: true,
  positionX: 5,
  positionY: 90,
  fontFamily: LINESEED_FONT,
  fontWeight: "400" as const,
  animationDurationFrames: 90,
  slideInDistance: 25,
  delayDurationFrames: 0,
  fadeInDurationFrames: msToFrame(500),
  textPaddingX: 0,
  textPaddingY: 20,
  lineHeight: 4,
  lineMaxWidth: 504,
  lineSpacing: 20,
  circleSize: 12,
} as const;

export const locationV1Patterns = {
  default: defaultLocationV1Props,
} as const;
