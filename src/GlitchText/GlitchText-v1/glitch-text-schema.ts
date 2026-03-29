import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const glitchTextSchemaV1 = z.object({
  text: z.string().default("MEASURING"),
  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(16).max(160).default(48),
  letterSpacing: z.string().default("0.06em"),
  lineHeight: z.number().min(1).max(2).default(1.2),

  textColor: zColor().default("#e8f4ff"),
  channelRColor: zColor().default("rgba(255, 51, 102, 0.55)"),
  channelBColor: zColor().default("rgba(51, 204, 255, 0.55)"),

  /** クロマずれの最大 px（セグメント乱数でスケール） */
  rgbOffsetMax: z.number().min(0).max(24).default(8),
  /** 強い区間（文字化け）が入るセグメント単位の確率 */
  strongGlitchProbability: z.number().min(0).max(1).default(0.2),
  /** 1 セグメントの長さ（フレーム） */
  glitchSegmentFrames: z.number().min(2).default(5),
  /** 強い区間で 1 文字あたり置き換わる確率 */
  garbleRate: z.number().min(0).max(1).default(0.42),
  /** 全体の微ジッター（px） */
  jitterPx: z.number().min(0).max(12).default(2),

  scanlineOpacity: z.number().min(0).max(0.35).default(0.08),
  backgroundColor: zColor().default("#0a0e12"),

  /** SlideInCaption と同じ: 左端・下端からの余白（%） */
  paddingLeftPercent: z.number().min(0).max(30).default(3.2),
  paddingBottomPercent: z.number().min(0).max(30).default(3.2),

  randomSeed: z.string().default("glitch-v1"),
  fadeInDuration: z.number().min(0).default(20),
  delayFrames: z.number().min(0).default(0),
});

export type GlitchTextSchemaV1Type = z.infer<typeof glitchTextSchemaV1>;
