import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const dotsLoaderSchema = z.object({
  dotCount: z.number().min(3).max(6).default(3),
  dotSize: z.number().min(8).max(40).default(16),
  gap: z.number().min(4).max(40).default(14),
  color: zColor().default("#DFE2D7"),
  bounceHeight: z.number().min(0).max(60).default(18),
  cycleDurationInFrames: z.number().min(10).default(45),

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

export type DotsLoaderSchemaType = z.infer<typeof dotsLoaderSchema>;

export const dotsLoaderDurationFrames = 300;

export const defaultDotsLoaderProps = {
  dotCount: 3,
  dotSize: 16,
  gap: 14,
  color: "#DFE2D7",
  bounceHeight: 18,
  cycleDurationInFrames: 45,

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

export const dotsLoaderPatterns = {
  default: {
    ...defaultDotsLoaderProps,
  },
  large: {
    ...defaultDotsLoaderProps,
    dotSize: 22,
    gap: 18,
    bounceHeight: 24,
  },
  custom: {
    ...defaultDotsLoaderProps,
    color: "#FF6B9D",
  },
  defaultWithText: {
    ...defaultDotsLoaderProps,
    showText: true,
  },
  largeWithText: {
    ...defaultDotsLoaderProps,
    dotSize: 22,
    gap: 18,
    bounceHeight: 24,
    showText: true,
  },
  customWithText: {
    ...defaultDotsLoaderProps,
    color: "#FF6B9D",
    showText: true,
  },
};
