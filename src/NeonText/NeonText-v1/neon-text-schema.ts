import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const neonTextSchemaV1 = z.object({
  text: z.string().default("SAMPLE"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(24).max(220).default(96),
  letterSpacing: z.string().default("0.12em"),

  coreColor: zColor().default("#fff8f4"),
  glowColor: zColor().default("#ff2fd0"),
  haloColor: zColor().default("#9d4dff"),

  tubeStrokeColor: zColor().default("rgba(20, 0, 40, 0.45)"),
  tubeStrokeWidth: z.number().min(0).max(6).default(1),

  shadowStrength: z.number().min(0.4).max(1.8).default(1),

  animationMode: z
    .enum(["static", "pulse", "flicker", "breathe"])
    .default("pulse"),
  pulsePeriodFrames: z.number().min(20).default(90),
  breathePeriodFrames: z.number().min(40).default(140),

  flickerStrength: z.number().min(0).max(0.45).default(0.12),
  randomSeed: z.string().default("neon-v1"),

  fadeInDuration: z.number().min(0).default(30),
  delayFrames: z.number().min(0).default(0),

  positionX: z.number().min(0).max(100).default(50),
  positionY: z.number().min(0).max(100).default(50),

  backgroundColor: zColor().default("#070712"),
  vignetteOpacity: z.number().min(0).max(0.85).default(0.55),
});

export type NeonTextSchemaV1Type = z.infer<typeof neonTextSchemaV1>;
