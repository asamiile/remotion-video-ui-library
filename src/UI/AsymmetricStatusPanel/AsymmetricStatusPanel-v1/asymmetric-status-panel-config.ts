import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";

export const asymmetricStatusPanelV1DurationFrames = 90;

export const defaultAsymmetricStatusPanelV1Props = {
  characterName: "PROTAGONIST",
  subtitleText: "",
  level: 38,
  nextExpText: "NEXT EXP 4564",

  stats: [
    { label: "STR", value: 40 },
    { label: "MAG", value: 54 },
    { label: "END", value: 48 },
    { label: "AGI", value: 50 },
    { label: "LUK", value: 82 },
  ],

  skillColors: ["#ff8a3d", "#37e9ff", "#9c7bff"],

  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  monoFontFamily: JETBRAINS_MONO_FONT_FAMILY,

  panelColor: "#c81e2c",
  accentColor: "#eef1fc",
  textColor: "#eef1fc",
  barTrackColor: "#242a42",
  backgroundColor: "#060810",

  popInFrames: 10,
  delayFrames: 0,
};

export const asymmetricStatusPanelV1Patterns = {
  /** Red/black/white, matching the source's panel language (English default) */
  redBlack: {
    ...defaultAsymmetricStatusPanelV1Props,
    characterName: "PROTAGONIST",
  },

  /** Same layout, Japanese sample name */
  redBlackJp: {
    ...defaultAsymmetricStatusPanelV1Props,
    characterName: "主人公",
    stats: [
      { label: "力", value: 40 },
      { label: "魔", value: 54 },
      { label: "耐", value: 48 },
      { label: "速", value: 50 },
      { label: "運", value: 82 },
    ],
  },

  /** OneTake brand colors instead of the source's red accent */
  oneTakeBrand: {
    ...defaultAsymmetricStatusPanelV1Props,
    panelColor: "#242a42",
    accentColor: "#37e9ff",
    skillColors: ["#37e9ff", "#ff3d9e", "#9c7bff"],
  },
};
