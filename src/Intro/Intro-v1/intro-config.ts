import { msToFrame } from "../../helpers/ms-to-frame";
// import { fontFamily as FONT_FAMILY_LINE_SEED } from "@remotion/google-fonts/LineSeedJP";
const LINESEED_FONT = "'Line Seed JP_100', sans-serif";

const AUTHOR_NAME = process.env.REMOTION_AUTHOR_NAME as string;
const INTRO_TITLE = process.env.REMOTION_INTRO_TITLE as string;
const INTRO_DESCRIPTION = (process.env.REMOTION_INTRO_DESCRIPTION as string).replace(/\\n/g, '\n');

export interface IntroScene {
  id: string;
  centerText?: string;
  centerFontSize?: number;
  centerFontWeight?: "400" | "700";
  centerLineHeight?: number;
  bottomRightText?: string;
  bottomRightFontSize?: number;  bottomRightBottom?: number;
  bottomRightRight?: number;
  fadeOutStartSeconds?: number;
  duration: number;
}

export const introScenesV1: IntroScene[] = [
  {
    id: "scene1",
    centerText: INTRO_TITLE,
    centerFontWeight: "700",
    bottomRightText: AUTHOR_NAME,
    fadeOutStartSeconds: 6,
    duration: 300,
  },
  {
    id: "scene2",
    centerText: INTRO_DESCRIPTION,
    fadeOutStartSeconds: 10,
    duration: 420,
  },
];

// デフォルトプロパティ
export const defaultIntroV1Props = {
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
