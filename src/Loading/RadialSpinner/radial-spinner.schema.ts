import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const radialSpinnerSchema = z.object({
  size: z.number().min(40).max(400).default(120),
  barCount: z.number().min(6).max(16).default(12),
  color: zColor().default("#FFFFFF"),
  minOpacity: z.number().min(0).max(1).default(0.15),
  rotationDuration: z.number().min(1).default(60), // frames for one full rotation

  showText: z.boolean().default(false),
  text: z.string().default("Loading (sample)…"),
  textColor: zColor().default("#FFFFFF"),
  fontSize: z.number().min(10).max(60).default(18),
  fontFamily: z.string().default("'Line Seed JP_100'"),
  fontWeight: z.enum(["400", "700"]).default("400"),

  positionX: z.number().default(50), // %
  positionY: z.number().default(50), // %

  fadeInDuration: z.number().min(0).default(30),
  fadeOutDuration: z.number().min(0).default(30),
  delayFrames: z.number().min(0).default(0),
});

export type RadialSpinnerSchemaType = z.infer<typeof radialSpinnerSchema>;

export const radialSpinnerDurationFrames = 300;

export const defaultRadialSpinnerProps = {
  size: 120,
  barCount: 12,
  color: "#FFFFFF",
  minOpacity: 0.15,
  rotationDuration: 60,

  showText: false,
  text: "Loading (sample)…",
  textColor: "#FFFFFF",
  fontSize: 18,
  fontFamily: "'Line Seed JP_100'",
  fontWeight: "400" as const,

  positionX: 50,
  positionY: 50,

  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
} as const;

export const radialSpinnerPatterns = {
  default: {
    ...defaultRadialSpinnerProps,
  },
  large: {
    ...defaultRadialSpinnerProps,
    size: 170,
  },
  defaultWithText: {
    ...defaultRadialSpinnerProps,
    showText: true,
  },
  largeWithText: {
    ...defaultRadialSpinnerProps,
    size: 170,
    showText: true,
  },
};
