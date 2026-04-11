// Mini Map 用の型とカメラ・UI デフォルト（地点ID・座標は composition-text の mapLocationPointsV1 で定義）
export interface MapLocationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
}

// デフォルトカメラ設定
export const defaultMapCameraV1Config = {
  // 初期状态の値
  initialZoom: 4,
  initialPitch: 0,
  initialBearing: 0,

  // アニメーション後の値
  targetZoom: 16,
  targetPitch: 0,
  targetBearing: 0,

  cameraAnimationDuration: 120,
};

// Mapbox Map オプション
export const mapboxMapV1Options = {
  style: "mapbox://styles/asamiile/cmli18nq5002t01skhqfk1rfu",
  interactive: false,
  fadeDuration: 0,
  antialias: true,
} as const;

// Mini Map デフォルトプロパティ
export const defaultMiniMapV1Props = {
  mapLocationId: "",
  width: 340,
  height: 340,
  positionX: 88,
  positionY: 80,
  enableCameraAnimation: true,
  showMarker: true,
  markerColor: "#B27873",
  markerSize: 12,
  markerCanvasSize: 24,
  markerStrokeColor: "#B27873",
  markerStrokeWidth: 1,
  markerIconRotate: 45,
  markerIconOpacity: 0.9,
  fadeInDuration: 30,
  fadeOutDuration: 30,
  delayFrames: 0,
  borderRadius: 0,
  border: "4px solid #C3C0BB",
  padding: "2px",
  boxShadow: "0px 4px 12px 8px rgba(107, 99, 84, 0.25)",
};
