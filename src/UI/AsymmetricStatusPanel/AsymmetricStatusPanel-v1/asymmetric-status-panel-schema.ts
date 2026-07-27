import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/jetbrains-mono";

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
