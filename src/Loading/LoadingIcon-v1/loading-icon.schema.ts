import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const loadingIconSchemaV1 = z.object({
  size: z.number().min(50).max(300).default(150),
  lightColor: zColor().default("#DFE2D7"),
  darkColor: zColor().default("#6B685C"),
  strokeWidth: z.number().min(1).max(10).default(4),

  showText: z.boolean().default(true),
  text: z.string().default("読み込みサンプル…"),
  textColor: zColor().default("#DFE2D7"),
  fontSize: z.number().min(10).max(60).default(18),
  fontFamily: z.string().default("'Line Seed JP_100'"),
  fontWeight: z.enum(["400", "700"]).default("400"),

  positionX: z.number().default(50), // %
  positionY: z.number().default(50), // %

  rotationDuration: z.number().min(1).default(60), // frames for one full rotation
  fadeInDuration: z.number().min(0).default(30), // fade-in duration
  fadeOutDuration: z.number().min(0).default(30), // fade-out duration
  delayFrames: z.number().min(0).default(0), // delay before starting, in frames
});

export type LoadingIconSchemaV1Type = z.infer<typeof loadingIconSchemaV1>;


export const defaultLoadingIconV1Props = {
  size: 150,
  lightColor: "#DFE2D7",
  darkColor: "#6B685C",
  strokeWidth: 4,

  showText: false,
  text: "Loading (sample)…",
  textColor: "#DFE2D7",
  fontSize: 24,
  fontFamily: "'Line Seed JP_100'",
  fontWeight: "400" as const,

  positionX: 94,
  positionY: 90,

  rotationDuration: 60, // 2s (60 frames @ 30fps)
  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
};
export const loadingIconV1Patterns = {
  // Default size (100px) - no text
  default: {
    ...defaultLoadingIconV1Props,
    size: 100,
    showText: false,
  },

  // Large size (150px) - no text
  large: {
    ...defaultLoadingIconV1Props,
    size: 150,
    showText: false,
  },

  // Custom color pattern - no text
  custom: {
    ...defaultLoadingIconV1Props,
    size: 120,
    lightColor: "#FF6B9D",
    darkColor: "#C20039",
    showText: false,
  },

  // Default size (100px) - with text
  defaultWithText: {
    ...defaultLoadingIconV1Props,
    size: 100,
    showText: true,
  },

  // Large size (150px) - with text
  largeWithText: {
    ...defaultLoadingIconV1Props,
    size: 150,
    showText: true,
  },

  // Custom color pattern - with text
  customWithText: {
    ...defaultLoadingIconV1Props,
    size: 120,
    lightColor: "#FF6B9D",
    darkColor: "#C20039",
    showText: true,
  },
};
