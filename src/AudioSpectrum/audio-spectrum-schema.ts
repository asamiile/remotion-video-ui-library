import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const audioSpectrumSchema = z.object({
  // 音声ファイル設定
  audioFile: z.string().default("audio.mp3"), // 公式まで使い方後ろ{public/} 相対パス
  audioOffsetInSeconds: z.number().default(0), // オーディオオフセット（秒）
  // スペクトラム表示設定
  barCount: z.number().min(8).max(128).default(32), // バー数
  barColor: zColor().default("#DFE2D7"), // バーの色
  barWidth: z.number().min(1).max(50).default(8), // バーの幅（px）
  barGap: z.number().min(0).max(20).default(2), // バー間隔（px）
  
  // アニメーション設定
  sensitivity: z.number().min(0.1).max(10).default(1), // 音量感度倍率
  smoothing: z.number().min(0).max(1).default(0.85), // スムージング値（大きいほど滑らか）
  
  // 位置設定
  positionX: z.number().default(50), // 水平位置（%）
  positionY: z.number().default(50), // 垂直位置（%）

});

export type AudioSpectrumSchemaType = z.infer<typeof audioSpectrumSchema>;
