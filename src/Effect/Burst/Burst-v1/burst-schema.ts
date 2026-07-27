import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const burstSchemaV1 = z.object({
  backgroundColor: zColor().default("#c81e2c"),
  inkColor: zColor().default("#0a0a0f"),
  flashColor: zColor().default("#ffffff"),
  lightningColor: zColor().default("#ffe14d"),

  inkShapeCount: z.number().min(0).max(12).default(6),
  lightningCount: z.number().min(0).max(12).default(5),

  /** Frames for the ink shapes to pop in */
  popInFrames: z.number().min(1).default(8),
  /** Frames for the white impact flash to fade out */
  flashDecayFrames: z.number().min(1).default(10),
  /** Frames for the lightning cracks to fade out (they appear immediately) */
  lightningDecayFrames: z.number().min(1).default(14),

  randomSeed: z.string().default("burst-v1"),
});

export type BurstSchemaV1Type = z.infer<typeof burstSchemaV1>;
