import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const locationSchema = z.object({
  // テキスト設定
  locationName: z.string().default("Tokyo"),
  fontSize: z.number().min(10).max(200).default(60),
  textColor: zColor().default("rgba(255, 255, 255, 1)"),
  
  // 背景設定
  backgroundColor: zColor().default("rgba(0, 0, 0, 0.5)"),
  showBackground: z.boolean().default(true),
  
  // 位置設定
  positionX: z.number().default(50), // パーセンテージ
  positionY: z.number().default(50), // パーセンテージ
  
  // フォント設定
  fontFamily: z.string().default("'Line Seed JP_100'"),
  fontWeight: z.enum(["400", "700"]).default("700"),
  
  // アニメーション設定
  animationDurationFrames: z.number().min(1).default(90), // フレーム数（ィ30fpsけ1科1秒）
  slideInDistance: z.number().min(0).max(500).default(100), // スライドイン距離（px）
  delayDurationFrames: z.number().min(0).default(30), // 遫枠（フレーム数）
  fadeInDurationFrames: z.number().min(1).default(9), // フェードイン期間（フレーム数）  
  // 要素設定
  textPaddingX: z.number().default(20), // テキスト水平padding（px）
  textPaddingY: z.number().default(20), // テキスト鉉直padding（px）
  lineHeight: z.number().default(3), // 線の高さ（px）
  lineMaxWidth: z.number().default(100), // 線の最大幅（px）
  lineSpacing: z.number().default(20), // テキストと線の間隔（px）
  circleSize: z.number().default(16), // 円のサイズ（px）
});

export type LocationSchemaType = z.infer<typeof locationSchema>;
