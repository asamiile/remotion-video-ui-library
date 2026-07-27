import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const battleCalloutBannerV1DurationFrames = 60;

export const defaultBattleCalloutBannerV1Props = {
  text: "ALL-OUT ATTACK!",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontSize: 44,
  letterSpacing: "0.02em",

  bannerColor: "#0a0a0f",
  textColor: "#eef1fc",
  borderColor: "#eef1fc",
  borderWidthPx: 3,
  cornerCutPx: 28,

  avatarEnabled: true,
  avatarInitial: "P",
  avatarColor: "#37e9ff",
  avatarSizePx: 84,

  backgroundColor: "#060810",

  popInFrames: 8,
  delayFrames: 0,
};

export const battleCalloutBannerV1Patterns = {
  /** Red/black/white, matching the source's panel language (English default) */
  redBlack: {
    ...defaultBattleCalloutBannerV1Props,
    text: "ALL-OUT ATTACK!",
    borderColor: "#eef1fc",
    avatarColor: "#c81e2c",
  },

  /** Same layout, Japanese sample text */
  redBlackJp: {
    ...defaultBattleCalloutBannerV1Props,
    text: "総攻撃タイム！",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    avatarColor: "#c81e2c",
  },

  /** OneTake brand colors instead of the source's red accent */
  oneTakeBrand: {
    ...defaultBattleCalloutBannerV1Props,
    text: "SKILL GET!",
    borderColor: "#37e9ff",
    avatarColor: "#ff3d9e",
  },
};
