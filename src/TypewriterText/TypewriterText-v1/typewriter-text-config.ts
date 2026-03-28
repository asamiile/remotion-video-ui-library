import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const typewriterTextV1DurationFrames = 200;

const defaultTypewriterTextV1Props = {
  text: 'const ready = true;',
  fontFamily: JETBRAINS_MONO_FONT_FAMILY,
  fontWeight: "400" as const,
  fontSize: 36,
  letterSpacing: "0.02em",

  textColor: "#d8dee9",
  cursorColor: "#58a6ff",

  typingStartFrame: 10,
  typingDurationFrames: 80,

  cursorChar: "|",
  cursorBlinkPeriodFrames: 26,
  showCursorAfterComplete: true,

  fadeInDuration: 12,
  delayFrames: 0,

  positionX: 50,
  positionY: 50,

  backgroundColor: "#0d1117",
};

export const typewriterTextV1Patterns = {
  /** TypeScript 風 1 行 */
  codeLine: {
    ...defaultTypewriterTextV1Props,
    text: 'const ready = true;',
    typingDurationFrames: 72,
  },

  /** シェルコマンド */
  npmScript: {
    ...defaultTypewriterTextV1Props,
    text: "npm run build && echo 'done'",
    fontSize: 32,
    typingDurationFrames: 96,
  },

  /** 日本語コメント行（等幅フォントは LINE Seed に差し替え） */
  jpComment: {
    ...defaultTypewriterTextV1Props,
    text: "// 処理が完了しました",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontWeight: "700" as const,
    fontSize: 38,
    letterSpacing: "0.08em",
    typingDurationFrames: 84,
  },
};
