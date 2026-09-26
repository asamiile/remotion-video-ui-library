import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const pulseCircleSchema = z.object({
  size: z.number().min(40).max(400).default(140),
  coreSizeRatio: z.number().min(0.1).max(0.6).default(0.28),
  ringCount: z.number().min(1).max(4).default(3),
  strokeWidth: z.number().min(1).max(12).default(3),
  color: zColor().default("#DFE2D7"),
  pulseDurationInFrames: z.number().min(15).default(90),

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

export type PulseCircleSchemaType = z.infer<typeof pulseCircleSchema>;

export const pulseCircleDurationFrames = 300;

export const defaultPulseCircleProps = {
  size: 140,
  coreSizeRatio: 0.28,
  ringCount: 3,
  strokeWidth: 3,
  color: "#DFE2D7",
  pulseDurationInFrames: 90,

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

export const pulseCirclePatterns = {
  default: {
    ...defaultPulseCircleProps,
  },
  large: {
    ...defaultPulseCircleProps,
    size: 200,
  },
  custom: {
    ...defaultPulseCircleProps,
    color: "#FF6B9D",
  },
  defaultWithText: {
    ...defaultPulseCircleProps,
    showText: true,
  },
  largeWithText: {
    ...defaultPulseCircleProps,
    size: 200,
    showText: true,
  },
  customWithText: {
    ...defaultPulseCircleProps,
    color: "#FF6B9D",
    showText: true,
  },
};
