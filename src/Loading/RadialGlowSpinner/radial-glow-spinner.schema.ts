import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const radialGlowSpinnerSchema = z.object({
  size: z.number().min(40).max(800).default(120),
  barCount: z.number().min(10).max(28).default(18),
  color: zColor().default("#FFFFFF"),
  minOpacity: z.number().min(0).max(1).default(0.12),
  glowRadius: z.number().min(0).max(100).default(14), // px, blur radius at the brightest bar
  rotationDuration: z.number().min(1).default(55), // frames for one full rotation

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

export type RadialGlowSpinnerSchemaType = z.infer<typeof radialGlowSpinnerSchema>;

export const radialGlowSpinnerDurationFrames = 300;

export const defaultRadialGlowSpinnerProps = {
  size: 120,
  barCount: 18,
  color: "#FFFFFF",
  minOpacity: 0.12,
  glowRadius: 14,
  rotationDuration: 55,

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

export const radialGlowSpinnerPatterns = {
  default: {
    ...defaultRadialGlowSpinnerProps,
  },
  large: {
    ...defaultRadialGlowSpinnerProps,
    size: 600,
    glowRadius: 70,
  },
  defaultWithText: {
    ...defaultRadialGlowSpinnerProps,
    showText: true,
  },
  largeWithText: {
    ...defaultRadialGlowSpinnerProps,
    size: 600,
    glowRadius: 70,
    showText: true,
  },
};
