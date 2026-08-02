import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const codeNoiseWallSchema = z.object({
  backgroundColor: zColor().default("#04040c"),
  charColor: zColor().default("#2244cc"),
  glowPx: z.number().min(0).max(20).default(2),

  fontSize: z.number().min(8).max(60).default(22),
  /** Roughly how many characters wide each row is */
  columnsPerRow: z.number().min(10).max(160).default(64),
  rowCount: z.number().min(4).max(60).default(24),

  /** How often (in frames) the whole noise field re-scrambles */
  regenerateEveryFrames: z.number().min(1).default(3),

  /** Subtle 3D perspective tilt of the whole wall (degrees) */
  perspectiveTiltDeg: z.number().min(0).max(60).default(18),

  randomSeed: z.string().default("code-noise-wall"),
});

export type CodeNoiseWallSchemaType = z.infer<typeof codeNoiseWallSchema>;

export const defaultCodeNoiseWallProps = {
  backgroundColor: "#04040c",
  charColor: "#2244cc",
  glowPx: 2,

  fontSize: 22,
  columnsPerRow: 64,
  rowCount: 24,

  regenerateEveryFrames: 3,
  perspectiveTiltDeg: 18,

  randomSeed: "code-noise-wall",
} as const;

export const codeNoiseWallPatterns = {
  /** Dense blue-glow scrambled-character wall, constantly regenerating (English default) */
  blueGlow: {
    ...defaultCodeNoiseWallProps,
  },

  /** Warm amber variant */
  amberGlow: {
    ...defaultCodeNoiseWallProps,
    charColor: "#cc8822",
    backgroundColor: "#0a0603",
  },
};
