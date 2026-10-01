import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

export const GRUNGE_TEXT_STYLES = [
  "stencil",
  "ransom",
  "typewriter",
  "tape",
  "burn",
  "lowerThird",
  "markup",
] as const;

/**
 * Grunge title styles sharing one set of props. See
 * .agents/design/grunge.md for what each style does and its color roles.
 */
export const grungeTextSchema = z.object({
  /**
   * stencil = sprayed stencil letters with bridges and overspray; ransom =
   * cut-out letters pasted one by one; typewriter = hard-struck keys with
   * uneven ink; tape = masking tape slapped down, then marker text written
   * on it; burn = letters burnt in with glowing embers; lowerThird = rough
   * painted label band sliding in; markup = hand-drawn circle and arrow
   * pointing at something, with a note
   */
  style: z.enum(GRUNGE_TEXT_STYLES),
  text: z.string(),
  /** Second line (lowerThird band, typewriter line 2); empty hides it */
  subText: z.string(),
  fontFamily: z.string(),
  fontSize: z.number().min(16).max(260),
  inkColor: zColor(),
  /** Overspray, ransom patches, tape, ember glow, label band, marker */
  accentColor: zColor(),
  /** "transparent" for an overlay */
  backgroundColor: zColor(),
  /** Edge roughness (SVG displacement); 0 = clean */
  roughness: z.number().min(0).max(20),
  /** Missing-ink wear, 0-1 */
  inkWear: z.number().min(0).max(1),
  delayFrames: z.number().min(0),
  randomSeed: z.string(),
});

export type GrungeTextSchemaType = z.infer<typeof grungeTextSchema>;

export const grungeTextDurationFrames = 150;

const base = {
  subText: "",
  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontSize: 140,
  inkColor: "#1f1d1b",
  accentColor: "#e0a83c",
  backgroundColor: "#e7e1d3",
  roughness: 4,
  inkWear: 0.3,
  delayFrames: 10,
  randomSeed: "grunge-text",
};

export const grungeTextPatterns = {
  /** Off-white stencil spray on concrete */
  stencilSpray: {
    ...base,
    style: "stencil" as const,
    text: "NO ENTRY",
    fontSize: 170,
    inkColor: "#ece6d8",
    accentColor: "#ece6d8",
    backgroundColor: "#55544f",
    roughness: 3,
    inkWear: 0.35,
  },
  /** Japanese sample */
  stencilSprayJp: {
    ...base,
    style: "stencil" as const,
    text: "立入禁止",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 170,
    inkColor: "#e0a83c",
    accentColor: "#e0a83c",
    backgroundColor: "#3b3a36",
    roughness: 3,
    inkWear: 0.35,
    randomSeed: "grunge-text-jp",
  },
  /** Cut-out magazine letters on black */
  ransomNote: {
    ...base,
    style: "ransom" as const,
    text: "LISTEN UP",
    fontSize: 130,
    backgroundColor: "#1d1c1b",
    randomSeed: "grunge-ransom",
  },
  /** Typewritten memo on paper */
  typewriterMemo: {
    ...base,
    style: "typewriter" as const,
    text: "CASE FILE 0427",
    subText: "SUBJECT: UNKNOWN",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    fontSize: 72,
    backgroundColor: "#efe8d8",
    roughness: 1.5,
    inkWear: 0.35,
  },
  /** Masking tape label with marker writing, on a dark board */
  tapeLabel: {
    ...base,
    style: "tape" as const,
    text: "DEMO TAPE VOL.2",
    fontSize: 96,
    accentColor: "#e6d6b0",
    backgroundColor: "#3b3833",
    roughness: 3,
    inkWear: 0.1,
  },
  /** Branded into paper with glowing embers */
  burnTitle: {
    ...base,
    style: "burn" as const,
    text: "OUTLAW",
    fontSize: 220,
    inkColor: "#24160c",
    accentColor: "#ff8a2a",
    backgroundColor: "#e8dcc4",
    roughness: 6,
    inkWear: 0.25,
  },
  /** Rough mustard label band with a black sub band, no backdrop */
  grungeLowerThird: {
    ...base,
    style: "lowerThird" as const,
    text: "ASAMI TOKYO",
    subText: "SOUND DESIGNER",
    fontSize: 84,
    accentColor: "#e0a83c",
    backgroundColor: "transparent",
    roughness: 6,
    inkWear: 0.25,
  },
  /** Yellow marker circle and arrow with a note, no backdrop */
  markupCircle: {
    ...base,
    style: "markup" as const,
    text: "LOOK HERE",
    fontSize: 72,
    inkColor: "#ffcf33",
    accentColor: "#ffcf33",
    backgroundColor: "transparent",
    roughness: 3,
    inkWear: 0,
  },
};
