import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";

export const typewriterTextSchemaV1 = z.object({
  /** 1 行のみ想定（改行はそのまま 1 文字として扱う） */
  text: z.string().default('const ready = true;'),

  fontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),
  fontWeight: z.enum(["400", "500", "700"]).default("400"),
  fontSize: z.number().min(14).max(96).default(48),
  letterSpacing: z.string().default("0.02em"),

  textColor: zColor().default("#d8dee9"),
  cursorColor: zColor().default("#58a6ff"),

  /** delay 後、何フレーム目から打鍵を始めるか */
  typingStartFrame: z.number().min(0).default(10),
  /** 全文が現れるまでのフレーム数 */
  typingDurationFrames: z.number().min(8).default(80),

  /** 互換用（描画は縦バー。文字で出したい場合は将来拡張） */
  cursorChar: z.string().default("|"),
  /** 本文右端とカーソルの間隔（em） */
  cursorGapEm: z.number().min(0).max(1).default(0.26),
  /** カーソル縦の長さ（1 = フォント 1em 相当） */
  cursorHeightEm: z.number().min(0.85).max(2).default(1.36),
  /** カーソル太さ（em。最小幅はテンプレで 2px） */
  cursorWidthEm: z.number().min(0.02).max(0.25).default(0.088),
  /** ベースライン調整（em、負でやや下げる） */
  cursorVerticalAlignEm: z.number().min(-0.35).max(0.35).default(-0.16),
  /** 0 で点滅なし（常に表示） */
  cursorBlinkPeriodFrames: z.number().min(0).default(26),
  /** 全文表示後もカーソルを付ける */
  showCursorAfterComplete: z.boolean().default(true),

  fadeInDuration: z.number().min(0).default(12),
  delayFrames: z.number().min(0).default(0),

  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  backgroundColor: zColor().default("#0d1117"),
});

export type TypewriterTextSchemaV1Type = z.infer<typeof typewriterTextSchemaV1>;
