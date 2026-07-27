import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const tornNoteCaptionV1DurationFrames = 150;

export const defaultTornNoteCaptionV1Props = {
  text: "I WILL NOT GIVE IN",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 40,
  letterSpacing: "0.02em",
  lineHeight: 1.3,

  paperColor: "#eef1fc",
  textColor: "#060810",
  backgroundColor: "#060810",

  rotationDeg: -4,
  paddingPx: 36,
  tornCornerPx: 22,

  popInFrames: 10,
  delayFrames: 0,
};

export const tornNoteCaptionV1Patterns = {
  /** Dialogue / quote (English default) */
  note: {
    ...defaultTornNoteCaptionV1Props,
    text: "I WILL NOT GIVE IN",
    rotationDeg: -4,
  },

  /** Dialogue / quote (Japanese sample) */
  noteJp: {
    ...defaultTornNoteCaptionV1Props,
    text: "これは僕の選択だ（サンプル）",
    rotationDeg: 3,
  },
};
