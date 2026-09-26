import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const skeletonScreenSchema = z.object({
  layout: z.enum(["card", "list", "text"]).default("card"),
  width: z.number().min(160).max(1200).default(420),
  baseColor: zColor().default("#3A382F"),
  highlightColor: zColor().default("#6B685C"),
  borderRadius: z.number().min(0).max(40).default(10),
  lineCount: z.number().min(1).max(8).default(3),
  shimmerDurationInFrames: z.number().min(10).default(60),

  positionX: z.number().default(50), // %
  positionY: z.number().default(50), // %

  fadeInDuration: z.number().min(0).default(30),
  fadeOutDuration: z.number().min(0).default(30),
  delayFrames: z.number().min(0).default(0),
});

export type SkeletonScreenSchemaType = z.infer<typeof skeletonScreenSchema>;

export const skeletonScreenDurationFrames = 300;

export const defaultSkeletonScreenProps = {
  layout: "card" as const,
  width: 420,
  baseColor: "#3A382F",
  highlightColor: "#6B685C",
  borderRadius: 10,
  lineCount: 3,
  shimmerDurationInFrames: 60,

  positionX: 50,
  positionY: 50,

  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
} as const;

export const skeletonScreenPatterns = {
  default: {
    ...defaultSkeletonScreenProps,
  },
  large: {
    ...defaultSkeletonScreenProps,
    width: 560,
  },
  custom: {
    ...defaultSkeletonScreenProps,
    baseColor: "#3A0C1D",
    highlightColor: "#FF6B9D",
  },
  listLayout: {
    ...defaultSkeletonScreenProps,
    layout: "list" as const,
    lineCount: 4,
  },
  textLayout: {
    ...defaultSkeletonScreenProps,
    layout: "text" as const,
    lineCount: 5,
  },
};
