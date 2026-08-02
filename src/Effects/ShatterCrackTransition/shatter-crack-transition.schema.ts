import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const shatterCrackTransitionSchema = z.object({
  backgroundColor: zColor().default("#060810"),

  crackColor: zColor().default("rgba(238, 241, 252, 0.8)"),
  /** Number of radiating crack lines from the center point */
  crackCount: z.number().min(3).max(40).default(14),
  /** Longest crack length, as a percent of the frame's diagonal */
  crackMaxLengthPercent: z.number().min(5).max(100).default(48),

  /** Small triangular glass-shard accents scattered along the cracks */
  shardCount: z.number().min(0).max(60).default(18),
  shardColorA: zColor().default("#ff8a3d"),
  shardColorB: zColor().default("#d7263d"),

  /** A simple abstract silhouette (two overlapping rings) placed at the crack's origin */
  silhouetteEnabled: z.boolean().default(true),
  silhouetteColor: zColor().default("#eef1fc"),
  silhouetteSizePx: z.number().min(0).max(400).default(120),

  randomSeed: z.string().default("shatter-crack"),
});

export type ShatterCrackTransitionSchemaType = z.infer<
  typeof shatterCrackTransitionSchema
>;

export const shatterCrackTransitionDurationFrames = 24;

export const defaultShatterCrackTransitionProps = {
  backgroundColor: "#060810",

  crackColor: "rgba(238, 241, 252, 0.8)",
  crackCount: 14,
  crackMaxLengthPercent: 48,

  shardCount: 18,
  shardColorA: "#ff8a3d",
  shardColorB: "#d7263d",

  silhouetteEnabled: true,
  silhouetteColor: "#eef1fc",
  silhouetteSizePx: 120,

  randomSeed: "shatter-crack",
} as const;
