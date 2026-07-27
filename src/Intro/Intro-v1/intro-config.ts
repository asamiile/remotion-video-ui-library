import { msToFrame } from "../../helpers/ms-to-frame";
// import { fontFamily as FONT_FAMILY_LINE_SEED } from "@remotion/google-fonts/LineSeedJP";
const LINESEED_FONT = "'Line Seed JP_100', sans-serif";

export interface IntroScene {
  id: string;
  centerText?: string;
  centerFontSize?: number;
  centerFontWeight?: "400" | "700";
  centerLineHeight?: number;
  bottomRightText?: string;
  bottomRightFontSize?: number;
  bottomRightBottom?: number;
  bottomRightRight?: number;
  fadeOutStartSeconds?: number;
  duration: number;
}

/** Only scene timing/staging here — the copy itself is composed by IntroTemplate from props */
export const introSceneTimingV1 = [
  {
    id: "scene1",
    centerFontWeight: "700" as const,
    fadeOutStartSeconds: 6,
    duration: 300,
  },
  {
    id: "scene2",
    fadeOutStartSeconds: 10,
    duration: 420,
  },
] as const;

export const defaultIntroV1Props = {
  authorName: "著者名プレビュー",
  introTitle: "イントロタイトル（プレビュー）",
  introDescription: "説明文のプレビューです。\n改行を含められます。",
  backgroundColor: "#6B685C",
  textColor: "#DFE2D7",
  fontFamily: LINESEED_FONT,
  // fontFamily: FONT_FAMILY_LINE_SEED,
  titleFontSize: 76,
  titleFontWeight: "700" as const,
  titleLineHeight: 1.6,
  descriptionFontSize: 52,
  descriptionFontWeight: "400" as const,
  descriptionLineHeight: 1.8,
  bottomRightFontSize: 48,
  bottomRightBottom: 72,
  bottomRightRight: 100,
  fadeInDuration: msToFrame(4000),
  fadeOutDuration: msToFrame(2000),
};
