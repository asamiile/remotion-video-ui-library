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
