import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/jetbrains-mono";

const statSchema = z.object({
  label: z.string(),
  /** 0-100 scale, drawn as a proportional bar width */
  value: z.number().min(0).max(100),
});

export const asymmetricStatusPanelSchemaV1 = z.object({
  characterName: z.string().default("PROTAGONIST"),
  subtitleText: z.string().default(""),
  level: z.number().min(0).default(38),
  nextExpText: z.string().default("NEXT EXP 4564"),

  stats: z.array(statSchema).default([
    { label: "STR", value: 40 },
    { label: "MAG", value: 54 },
    { label: "END", value: 48 },
    { label: "AGI", value: 50 },
    { label: "LUK", value: 82 },
  ]),

  /** Skill-icon row: plain colored squares, not real icon art */
  skillColors: z.array(zColor()).default(["#ff8a3d", "#37e9ff", "#9c7bff"]),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  monoFontFamily: z.string().default(JETBRAINS_MONO_FONT_FAMILY),

  panelColor: zColor().default("#c81e2c"),
  accentColor: zColor().default("#eef1fc"),
  textColor: zColor().default("#eef1fc"),
  barTrackColor: zColor().default("#242a42"),
  backgroundColor: zColor().default("#060810"),

  popInFrames: z.number().min(0).default(10),
  delayFrames: z.number().min(0).default(0),
});

export type AsymmetricStatusPanelSchemaV1Type = z.infer<
  typeof asymmetricStatusPanelSchemaV1
>;

export const asymmetricStatusPanelV1DurationFrames = 150;

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
} as const;

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
