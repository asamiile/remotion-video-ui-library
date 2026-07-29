import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const wireTextSchemaV1 = z.object({
  text: z.string().default("WIRE"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(20).max(220).default(48),
  letterSpacing: z.string().default("0.06em"),
  /** Line spacing when text has multiple lines (\\n) (em) */
  lineHeight: z.number().min(1).max(2).default(1.15),

  /** Color of the wire (stroke) */
  wireColor: zColor().default("#7ae2ff"),
  strokeWidth: z.number().min(0.5).max(16).default(2.2),
  /** 0 disables the glow. Blur in pixels (bleeds around the tip) */
  wireGlowBlur: z.number().min(0).max(12).default(2.4),

  /** When false, only the outline (wire) is shown */
  fillEnabled: z.boolean().default(true),
  fillColor: zColor().default("rgba(230, 248, 255, 0.92)"),
  fillFadeInFrames: z.number().min(0).default(18),
  /** Wait after the outline finishes tracing before the fill starts (frames) */
  fillDelayAfterDrawFrames: z.number().min(0).default(6),

  /** Duration of the path-tracing animation (frames) */
  drawDurationFrames: z.number().min(12).default(78),
  drawEasing: z.enum(["easeOut", "easeInOut", "linear"]).default("easeOut"),

  fadeInDuration: z.number().min(0).default(12),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#0a1018"),
});

export type WireTextSchemaV1Type = z.infer<typeof wireTextSchemaV1>;


export const defaultWireTextV1Props = {
  text: "TRACE",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 48,
  letterSpacing: "0.06em",
  lineHeight: 1.15,

  wireColor: "#7ae2ff",
  strokeWidth: 2.2,
  wireGlowBlur: 2.4,

  fillEnabled: true,
  fillColor: "rgba(230, 248, 255, 0.92)",
  fillFadeInFrames: 18,
  fillDelayAfterDrawFrames: 6,

  drawDurationFrames: 78,
  drawEasing: "easeOut" as const,

  fadeInDuration: 12,
  delayFrames: 0,

  paddingLeftPercent: 3.2,
  paddingBottomPercent: 3.2,

  backgroundColor: "#0a1018",
};
export const wireTextV1Patterns = {
  /** Latin script, thinner wire */
  trace: {
    ...defaultWireTextV1Props,
    text: "WIRE TRACE",
    fontSize: 48,
    drawDurationFrames: 90,
    wireGlowBlur: 2,
  },

  /** Japanese version of trace */
  traceJp: {
    ...defaultWireTextV1Props,
    text: "測定ライン",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    letterSpacing: "0.1em",
    drawDurationFrames: 96,
    wireColor: "#9cf0ff",
    fillColor: "rgba(220, 245, 255, 0.9)",
    wireGlowBlur: 3,
  },

  /** Outline only (fill effectively off) */
  outlineOnly: {
    ...defaultWireTextV1Props,
    text: "OUTLINE ONLY",
    fontSize: 48,
    fillEnabled: false,
    wireGlowBlur: 1.5,
    strokeWidth: 2.8,
  },

  /** Japanese version of outlineOnly */
  outlineOnlyJp: {
    ...defaultWireTextV1Props,
    text: "輪郭のみ",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 48,
    letterSpacing: "0.1em",
    fillEnabled: false,
    wireGlowBlur: 1.5,
    strokeWidth: 2.8,
    drawDurationFrames: 96,
  },
};
