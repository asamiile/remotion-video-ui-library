// Mini Map用の地点設定
export interface MapLocationPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  zoom?: number;
  pitch?: number;
  bearing?: number;
}

export const mapLocationPoints: MapLocationPoint[] = [
  {
    id: "TenjinBrickCross",
    name: "天神ブリッククロス",
    latitude: 33.59280493802063,
    longitude: 130.40067973150843,
  },
  {
    id: "OneFukuoka",
    name: "ONE FUKUOKA BLDG",
    latitude: 33.59135241138666,
    longitude: 130.3994274097612,
  },
  {
    id: "InabaConstruction",
    name: "因幡町通り工事現場",
    latitude: 33.59119047991814,
    longitude: 130.40023221822273,
  },
  {
    id: "TenjinBusinessCenter",
    name: "天神ビジネスセンター",
    latitude: 33.59150145919304,
    longitude: 130.40061419235556,
  },
  {
    id: "HurricSquare",
    name: "ヒューリックスクエア福岡天神",
    latitude: 33.59117379781744,
    longitude: 130.39754663124276,
  },
  {
    id: "DaimyoGardenCity",
    name: "大名ガーデンシティ",
    latitude: 33.59000266421397,
    longitude: 130.39476381775071,
  },
];

// デフォルトカメラ設定
export const defaultMapCameraConfig = {
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
export const mapboxMapOptions = {
  style: "mapbox://styles/asamiile/cmli18nq5002t01skhqfk1rfu",
  interactive: false,
  fadeDuration: 0,
  antialias: true,
} as const;

// Mini Map デフォルトプロパティ
export const defaultMiniMapProps = {
  mapLocationId: "map-fukuoka-tenjin",
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
