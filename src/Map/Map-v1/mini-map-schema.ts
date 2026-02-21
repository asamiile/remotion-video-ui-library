import { z } from "zod";

export const miniMapSchemaV1 = z.object({
  // マップ基本設定
  mapLocationId: z.string().default("map-fukuoka-tenjin"),
  
  // 表示設定
  width: z.number().min(100).max(1920).default(400),
  height: z.number().min(100).max(1080).default(300),
  
  // 位置設定
  positionX: z.number().default(50), // パーセンテージ
  positionY: z.number().default(50), // パーセンテージ
  
  // カメラアニメーション設定
  enableCameraAnimation: z.boolean().default(false),
  
  // マーカー設定
  showMarker: z.boolean().default(true),
  markerColor: z.string().default("#FFFFFF"),
  markerSize: z.number().min(1).max(50).default(16),
  
  // アニメーション
  fadeInDuration: z.number().min(1).default(30), // フレーム数
  fadeOutDuration: z.number().min(1).default(30), // フレーム数
  delayFrames: z.number().min(0).default(0),
  
  // スタイル
  borderRadius: z.number().min(0).max(50).default(0),
  boxShadow: z.string().default("0px 4px 12px rgba(0, 0, 0, 0.15)"),
});

export type MiniMapSchemaV1Type = z.infer<typeof miniMapSchemaV1>;
