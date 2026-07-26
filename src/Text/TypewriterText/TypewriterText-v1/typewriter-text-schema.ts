import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";

export const typewriterTextSchemaV1 = z.object({
  /** Assumes a single line (newlines are treated as just another character) */
  text: z.string().default('const ready = true;'),

  fontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  fontWeight: z.enum(["400", "500", "700"]).default("400"),
  fontSize: z.number().min(14).max(96).default(48),
  letterSpacing: z.string().default("0.02em"),

  textColor: zColor().default("#d8dee9"),
  cursorColor: zColor().default("#58a6ff"),

  /** Frame (after delay) at which typing starts */
  typingStartFrame: z.number().min(0).default(10),
  /** Frames until the full text has appeared */
  typingDurationFrames: z.number().min(8).default(80),

  /** For compatibility (rendering is always a vertical bar; character-based rendering is a possible future extension) */
  cursorChar: z.string().default("|"),
  /** Gap between the end of the text and the cursor (em) */
  cursorGapEm: z.number().min(0).max(1).default(0.26),
  /** Cursor height (1 = roughly one font em) */
  cursorHeightEm: z.number().min(0.85).max(2).default(1.36),
  /** Cursor thickness (em; the template enforces a 2px minimum width) */
  cursorWidthEm: z.number().min(0.02).max(0.25).default(0.088),
  /** Baseline adjustment (em; negative shifts it down slightly) */
  cursorVerticalAlignEm: z.number().min(-0.35).max(0.35).default(-0.16),
  /** 0 disables blinking (always shown) */
  cursorBlinkPeriodFrames: z.number().min(0).default(26),
  /** Keep the cursor visible after the full text has appeared */
  showCursorAfterComplete: z.boolean().default(true),

  fadeInDuration: z.number().min(0).default(12),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#0d1117"),
});

export type TypewriterTextSchemaV1Type = z.infer<typeof typewriterTextSchemaV1>;
