import { zColor } from "@remotion/zod-types";
import { z } from "zod";

/**
 * - clean: 単色のグロー帯がスイープするだけの素直な捜査線
 * - crt: 画面全体に薄いラスター線（水平の走査線テクスチャ）を敷いた上で、
 *   電子ビームに相当する帯が走査する、ブラウン管テレビ風のスキャン
 */
export const SCAN_STYLES = ["clean", "crt"] as const;

export const scanLineSchemaV1 = z.object({
  scanColor: zColor().default("#37E9FF"),
  /** スキャン光の帯の高さ（px） */
  bandHeight: z.number().min(10).default(160),

  scanStyle: z.enum(SCAN_STYLES).default("clean"),

  /** 画面を1往復（上端→下端）スイープするフレーム数（シームレスループ前提のため、
   *  コンポジション全体の尺はこの値と一致させること） */
  scanPeriodFrames: z.number().min(10).default(150),
});

export type ScanLineSchemaV1Type = z.infer<typeof scanLineSchemaV1>;
