import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const sprayPaintTextV1DurationFrames = 90;

export const defaultSprayPaintTextV1Props = {
  text: "SOUND DESIGN",
  fontFamily: LINE_SEED_JP_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 56,
  letterSpacing: "0.02em",

  textColor: "#eef1fc",
  backgroundColor: "#060810",

  roughness: 4,

  dripCount: 4,
  dripColor: undefined,
  dripMaxLengthPx: 60,
  dripGrowFrames: 8,

  revealFrames: 18,
  oversprayCount: 14,
  oversprayColor: undefined,

  delayFrames: 0,
  randomSeed: "spray-paint-v1",
};

/**
 * Spray-can/graffiti-style credit text with drip marks (modeled on an
 * analysis of the Persona 5 opening animation's staff-credit typography).
 * `wallGraffiti` is sized for placement over a background photo/illustration,
 * matching the source's technique of painting narration directly onto the
 * environment rather than as a floating subtitle.
 *
 * The left-to-right "spray pass" reveal (jagged wipe + trailing overspray
 * specks) is an artistic embellishment added on top of the source analysis:
 * in the actual PV the credit text is a hard cut to a fully-formed, static
 * graphic with no reveal animation of its own.
 */
export const sprayPaintTextV1Patterns = {
  /** Staff credit (English default) */
  credit: {
    ...defaultSprayPaintTextV1Props,
    text: "SOUND DESIGN",
    roughness: 4,
  },

  /** Staff credit (Japanese sample) */
  creditJp: {
    ...defaultSprayPaintTextV1Props,
    text: "サウンドデザイン",
    roughness: 4,
  },

  /** Environmental "painted on the wall" narration line (Japanese sample) */
  wallGraffitiJp: {
    ...defaultSprayPaintTextV1Props,
    text: "諦めない",
    fontSize: 88,
    roughness: 7,
    dripCount: 6,
    dripMaxLengthPx: 100,
    revealFrames: 24,
    oversprayCount: 20,
  },
};
