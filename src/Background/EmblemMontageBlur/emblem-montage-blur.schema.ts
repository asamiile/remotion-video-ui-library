import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const emblemMontageBlurSchema = z.object({
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

export type EmblemMontageBlurSchemaType = z.infer<
  typeof emblemMontageBlurSchemaV1
>;


export const defaultEmblemMontageBlurProps = {
  emblemCount: 6,
  colors: ["#eef1fc", "#7c86a8", "#37e9ff"],

  sizeMinPx: 50,
  sizeMaxPx: 160,
  blurMinPx: 1,
  blurMaxPx: 8,

  fadeInFrames: 20,
  randomSeed: "emblem-montage-v1",
};
export const emblemMontageBlurPatterns = {
  /** Cool neutral tones (English default) */
  cool: {
    ...defaultEmblemMontageBlurProps,
    colors: ["#eef1fc", "#7c86a8", "#37e9ff"],
  },

  /** OneTake brand colors */
  oneTakeBrand: {
    ...defaultEmblemMontageBlurProps,
    colors: ["#37e9ff", "#ff3d9e", "#9c7bff"],
  },
};
