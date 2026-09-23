import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const progressBarSchema = z.object({
  width: z.number().min(60).max(1200).default(360),
  height: z.number().min(4).max(40).default(10),
  borderRadius: z.number().min(0).max(20).default(999),
  trackColor: zColor().default("#3A382F"),
  fillColor: zColor().default("#DFE2D7"),
  sweepWidthPercent: z.number().min(10).max(100).default(35),
  sweepDurationInFrames: z.number().min(10).default(75),

  showText: z.boolean().default(false),
  text: z.string().default("Loading (sample)…"),
  textColor: zColor().default("#DFE2D7"),
  fontSize: z.number().min(10).max(60).default(18),
  fontFamily: z.string().default("'Line Seed JP_100'"),
  fontWeight: z.enum(["400", "700"]).default("400"),

  positionX: z.number().default(50), // %
  positionY: z.number().default(50), // %

  fadeInDuration: z.number().min(0).default(30),
  fadeOutDuration: z.number().min(0).default(30),
  delayFrames: z.number().min(0).default(0),
});

export type ProgressBarSchemaType = z.infer<typeof progressBarSchema>;

export const progressBarDurationFrames = 300;

export const defaultProgressBarProps = {
  width: 360,
  height: 10,
  borderRadius: 999,
  trackColor: "#3A382F",
  fillColor: "#DFE2D7",
  sweepWidthPercent: 35,
  sweepDurationInFrames: 75,

  showText: false,
  text: "Loading (sample)…",
  textColor: "#DFE2D7",
  fontSize: 18,
  fontFamily: "'Line Seed JP_100'",
  fontWeight: "400" as const,

  positionX: 50,
  positionY: 50,

  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
} as const;

export const progressBarPatterns = {
  default: {
    ...defaultProgressBarProps,
  },
  large: {
    ...defaultProgressBarProps,
    width: 520,
    height: 14,
  },
  custom: {
    ...defaultProgressBarProps,
    trackColor: "#3A0C1D",
    fillColor: "#FF6B9D",
  },
  defaultWithText: {
    ...defaultProgressBarProps,
    showText: true,
  },
  largeWithText: {
    ...defaultProgressBarProps,
    width: 520,
    height: 14,
    showText: true,
  },
  customWithText: {
    ...defaultProgressBarProps,
    trackColor: "#3A0C1D",
    fillColor: "#FF6B9D",
    showText: true,
  },
};
