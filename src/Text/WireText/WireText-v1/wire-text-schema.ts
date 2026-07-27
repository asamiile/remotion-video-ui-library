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
