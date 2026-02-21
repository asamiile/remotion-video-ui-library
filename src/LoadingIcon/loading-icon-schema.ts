import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const loadingIconSchema = z.object({
  // アイコン設定
  size: z.number().min(50).max(300).default(150),
  lightColor: zColor().default("#DFE2D7"),
  darkColor: zColor().default("#6B685C"),
  strokeWidth: z.number().min(1).max(10).default(4),
  
  // テキスト設定
  showText: z.boolean().default(true),
  text: z.string().default("Loading..."),
  textColor: zColor().default("#DFE2D7"),
  fontSize: z.number().min(10).max(60).default(18),
  fontFamily: z.string().default("'Line Seed JP_100'"),
  fontWeight: z.enum(["400", "700"]).default("400"),
  
  // 位置設定
  positionX: z.number().default(50), // パーセンテージ
  positionY: z.number().default(50), // パーセンテージ
  
  // アニメーション設定
  rotationDuration: z.number().min(1).default(60), // 1回転のフレーム数
  fadeInDuration: z.number().min(0).default(30), // フェードイン期間
  fadeOutDuration: z.number().min(0).default(30), // フェードアウト期間
  delayFrames: z.number().min(0).default(0), // 遅延フレーム数
});

export type LoadingIconSchemaType = z.infer<typeof loadingIconSchema>;
