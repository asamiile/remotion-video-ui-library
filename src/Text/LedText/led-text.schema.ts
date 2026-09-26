import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";

export const ledTextSchema = z.object({
  text: z.string().default("サンプル LED"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(8).max(200).default(48),
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
  randomSeed: z.string().default("led"),

  fadeInDuration: z.number().min(0).default(24),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  panelBackground: zColor().default("#0a0a0a"),
  panelPadding: z.number().min(0).default(28),
  panelBorderRadius: z.number().min(0).default(14),

  scanlinesOpacity: z.number().min(0).max(0.25).default(0.055),
});

export type LedTextSchemaType = z.infer<typeof ledTextSchema>;


export const defaultLedTextProps = {
  text: "SAMPLE LED",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  cellSize: 11,
  sampleThreshold: 120,
  paddingCells: 2,

  onColor: "#ffaa33",
  offColor: "#2a1800",
  coreColor: "#fff2cc",
  dotRadiusRatio: 0.36,

  glowEnabled: true,
  glowBlur: 16,
  glowOpacity: 0.52,
  glowSpreadRatio: 1.035,

  animationMode: "static" as const,
  typewriterFramesPerColumn: 2,
  scrollPixelsPerFrame: 2.5,
  scrollGapCells: 8,

  flickerStrength: 0.06,
  randomSeed: "led-default",

  fadeInDuration: 24,
  delayFrames: 6,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  panelBackground: "#080808",
  panelPadding: 32,
  panelBorderRadius: 16,

  scanlinesOpacity: 0.06,
};
export const ledTextPatterns = {
  redScroll: {
    ...defaultLedTextProps,
    text: "SAMPLE  ///  SCROLL  ///  TEXT  ///  ",
    fontSize: 48,
    cellSize: 9,
    animationMode: "scroll" as const,
    scrollPixelsPerFrame: 3,
    scrollGapCells: 10,
    onColor: "#ff4444",
    offColor: "#300808",
    coreColor: "#ffcccc",
  },

  redScrollJp: {
    ...defaultLedTextProps,
    text: "サンプル  ///  スクロール  ///  テキスト  ///  ",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    cellSize: 9,
    animationMode: "scroll" as const,
    scrollPixelsPerFrame: 3,
    scrollGapCells: 10,
    onColor: "#ff4444",
    offColor: "#300808",
    coreColor: "#ffcccc",
    randomSeed: "led-red-scroll-jp",
  },
};
