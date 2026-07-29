import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const emblemMontageBlurSchemaV1 = z.object({
  emblemCount: z.number().min(1).max(20).default(6),
  colors: z
    .array(zColor())
    .default(["#eef1fc", "#7c86a8", "#37e9ff"]),

  sizeMinPx: z.number().min(1).default(50),
  sizeMaxPx: z.number().min(1).default(160),
  blurMinPx: z.number().min(0).default(1),
  blurMaxPx: z.number().min(0).default(8),

  fadeInFrames: z.number().min(0).default(20),
  randomSeed: z.string().default("emblem-montage-v1"),
});

export type EmblemMontageBlurSchemaV1Type = z.infer<
  typeof emblemMontageBlurSchemaV1
>;


export const defaultEmblemMontageBlurV1Props = {
  emblemCount: 6,
  colors: ["#eef1fc", "#7c86a8", "#37e9ff"],

  sizeMinPx: 50,
  sizeMaxPx: 160,
  blurMinPx: 1,
  blurMaxPx: 8,

  fadeInFrames: 20,
  randomSeed: "emblem-montage-v1",
};
export const emblemMontageBlurV1Patterns = {
  /** Cool neutral tones (English default) */
  cool: {
    ...defaultEmblemMontageBlurV1Props,
    colors: ["#eef1fc", "#7c86a8", "#37e9ff"],
  },

  /** OneTake brand colors */
  oneTakeBrand: {
    ...defaultEmblemMontageBlurV1Props,
    colors: ["#37e9ff", "#ff3d9e", "#9c7bff"],
  },
};
