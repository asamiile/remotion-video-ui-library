// 地名設定の配列
import { msToFrame } from "../../helpers/ms-to-frame";
// import { fontFamily as FONT_FAMILY_LINE_SEED } from "@remotion/google-fonts/LineSeedJP";
const LINESEED_FONT = "'Line Seed JP_100', sans-serif";

export const locationConfigsV1 = [
  {
    id: "TenjinBrickCross",
    locationName: "天神ブリッククロス",
  },
  {
    id: "OneFukuoka",
    locationName: "ONE FUKUOKA BLDG",
  },
  {
    id: "InabaConstruction",
    locationName: "因幡町通り工事現場",
  },
  {
    id: "TenjinBusinessCenter",
    locationName: "天神ビジネスセンター",
  },
  {
    id: "HurricSquare",
    locationName: "ヒューリックスクエア福岡天神",
  },
  {
    id: "DaimyoGardenCity",
    locationName: "大名ガーデンシティ",
  },
];

// 共通のデフォルトプロパティ
export const defaultLocationV1Props = {
  fontSize: 36,
  textColor: "rgb(195, 192, 187)",
  backgroundColor: "rgb(195, 192, 187)",
  showBackground: true,
  positionX: 5,
  positionY: 90,
  fontFamily: LINESEED_FONT,
  // fontFamily: FONT_FAMILY_LINE_SEED,
  fontWeight: "400" as const,
  animationDurationFrames: 90, // 3秒
  slideInDistance: 25,
  delayDurationFrames: 0, // アニメーション遅延
  fadeInDurationFrames: msToFrame(500), // フェードイン期間
  textPaddingX: 0,
  textPaddingY: 20,
  lineHeight: 4,
  lineMaxWidth: 504,
  lineSpacing: 20,
  circleSize: 12,
};
