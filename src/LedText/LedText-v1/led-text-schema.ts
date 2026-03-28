import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const ledTextSchemaV1 = z.object({
  text: z.string().default("HELLO"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(8).max(200).default(72),
  cellSize: z.number().min(4).max(40).default(10),
  sampleThreshold: z.number().min(0).max(255).default(128),
  paddingCells: z.number().min(0).max(12).default(2),

  onColor: zColor().default("#ffaa00"),
  offColor: zColor().default("#3d2800"),
  coreColor: zColor().optional(),
  dotRadiusRatio: z.number().min(0.1).max(0.48).default(0.36),

  glowEnabled: z.boolean().default(true),
  glowBlur: z.number().min(0).max(80).default(14),
  glowOpacity: z.number().min(0).max(1).default(0.5),
  glowSpreadRatio: z.number().min(1).max(1.2).default(1.03),

  animationMode: z.enum(["static", "typewriter", "scroll"]).default("static"),
  typewriterFramesPerColumn: z.number().min(1).default(2),
  scrollPixelsPerFrame: z.number().min(0.25).default(2.5),
  scrollGapCells: z.number().min(0).default(6),

  flickerStrength: z.number().min(0).max(0.35).default(0.07),
  randomSeed: z.string().default("led-v1"),

  fadeInDuration: z.number().min(0).default(24),
  delayFrames: z.number().min(0).default(0),

  positionX: z.number().min(0).max(100).default(50),
  positionY: z.number().min(0).max(100).default(50),

  panelBackground: zColor().default("#0a0a0a"),
  panelPadding: z.number().min(0).default(28),
  panelBorderRadius: z.number().min(0).default(14),

  scanlinesOpacity: z.number().min(0).max(0.25).default(0.055),
});

export type LedTextSchemaV1Type = z.infer<typeof ledTextSchemaV1>;
