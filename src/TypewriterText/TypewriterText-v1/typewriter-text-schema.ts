import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";

export const typewriterTextSchemaV1 = z.object({
  /** 1 行のみ想定（改行はそのまま 1 文字として扱う） */
  text: z.string().default('const ready = true;'),

  fontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  fontWeight: z.enum(["400", "500", "700"]).default("400"),
  fontSize: z.number().min(14).max(96).default(36),
  letterSpacing: z.string().default("0.02em"),

  textColor: zColor().default("#d8dee9"),
  cursorColor: zColor().default("#58a6ff"),

  /** delay 後、何フレーム目から打鍵を始めるか */
  typingStartFrame: z.number().min(0).default(10),
  /** 全文が現れるまでのフレーム数 */
  typingDurationFrames: z.number().min(8).default(80),

  cursorChar: z.string().default("|"),
  /** 0 で点滅なし（常に表示） */
  cursorBlinkPeriodFrames: z.number().min(0).default(26),
  /** 全文表示後もカーソルを付ける */
  showCursorAfterComplete: z.boolean().default(true),

  fadeInDuration: z.number().min(0).default(12),
  delayFrames: z.number().min(0).default(0),

  positionX: z.number().min(0).max(100).default(50),
  positionY: z.number().min(0).max(100).default(50),

  backgroundColor: zColor().default("#0d1117"),
});

export type TypewriterTextSchemaV1Type = z.infer<typeof typewriterTextSchemaV1>;
