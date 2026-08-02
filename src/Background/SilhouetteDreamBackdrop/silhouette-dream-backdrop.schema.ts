import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const silhouetteDreamBackdropSchema = z.object({
  backgroundColor: zColor().default("#5a0f14"),

  /** A generic abstract humanoid silhouette (not a specific character) */
  silhouetteEnabled: z.boolean().default(true),
  silhouetteColor: zColor().default("#0a0a0a"),
  silhouetteXPercent: z.number().min(0).max(100).default(50),
  silhouetteScale: z.number().min(0.2).max(3).default(1),

  orbColor: zColor().default("#ffe9a8"),
  orbGlowColor: zColor().default("#ff8a3d"),
  orbSizePx: z.number().min(10).max(400).default(70),
  orbXPercent: z.number().min(0).max(100).default(50),
  orbYPercent: z.number().min(0).max(100).default(34),

  particleCount: z.number().min(0).max(80).default(24),
  particleColor: zColor().default("#ffd9a0"),
  particleSizePx: z.number().min(1).max(12).default(3),
  particleDriftPxPerFrame: z.number().min(0).max(5).default(0.4),

  randomSeed: z.string().default("dream-backdrop"),
});

export type SilhouetteDreamBackdropSchemaType = z.infer<
  typeof silhouetteDreamBackdropSchema
>;

export const defaultSilhouetteDreamBackdropProps = {
  backgroundColor: "#5a0f14",

  silhouetteEnabled: true,
  silhouetteColor: "#0a0a0a",
  silhouetteXPercent: 50,
  silhouetteScale: 1,

  orbColor: "#ffe9a8",
  orbGlowColor: "#ff8a3d",
  orbSizePx: 70,
  orbXPercent: 50,
  orbYPercent: 34,

  particleCount: 24,
  particleColor: "#ffd9a0",
  particleSizePx: 3,
  particleDriftPxPerFrame: 0.4,

  randomSeed: "dream-backdrop",
} as const;

export const silhouetteDreamBackdropPatterns = {
  /** Red monochrome dreamscape with silhouette, glowing orb, and drifting particles (English default) */
  redDreamscape: {
    ...defaultSilhouetteDreamBackdropProps,
  },

  /** Same composition without the silhouette, for a purely abstract backdrop */
  orbOnly: {
    ...defaultSilhouetteDreamBackdropProps,
    silhouetteEnabled: false,
  },
};
