import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/line-seed-jp";

export const sprayPaintTextSchema = z.object({
  text: z.string().default("SOUND DESIGN"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(16).max(160).default(56),
  letterSpacing: z.string().default("0.02em"),

  textColor: zColor().default("#eef1fc"),
  backgroundColor: zColor().default("#060810"),

  /** Roughens the text edges via an SVG turbulence displacement filter (spray-can texture) */
  roughness: z.number().min(0).max(20).default(4),

  /** Drip marks hanging from the bottom edge of the text. 0 hides them */
  dripCount: z.number().min(0).max(12).default(4),
  dripColor: zColor().optional(),
  dripMaxLengthPx: z.number().min(0).default(60),
  /** Frames for a drip to grow to full length once the spray pass reaches it */
  dripGrowFrames: z.number().min(1).default(8),

  /**
   * Left-to-right "spray pass" reveal: a jagged wipe (reusing the roughness
   * filter on its edge) sweeps across the text, with trailing overspray
   * specks. This is an artistic embellishment, not something present in the
   * source PV this component is modeled on (there, the credit text is a hard
   * cut to a fully-formed, static graphic).
   */
  revealFrames: z.number().min(1).default(18),
  oversprayCount: z.number().min(0).max(40).default(14),
  oversprayColor: zColor().optional(),

  delayFrames: z.number().min(0).default(0),
  randomSeed: z.string().default("spray-paint-v1"),
});

export type SprayPaintTextSchemaType = z.infer<
  typeof sprayPaintTextSchemaV1
>;

export const sprayPaintTextDurationFrames = 150;

export const defaultSprayPaintTextProps = {
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
export const sprayPaintTextPatterns = {
  /** Staff credit (English default) */
  credit: {
    ...defaultSprayPaintTextProps,
    text: "SOUND DESIGN",
    roughness: 4,
  },

  /** Staff credit (Japanese sample) */
  creditJp: {
    ...defaultSprayPaintTextProps,
    text: "サウンドデザイン",
    roughness: 4,
  },

  /** Environmental "painted on the wall" narration line (Japanese sample) */
  wallGraffitiJp: {
    ...defaultSprayPaintTextProps,
    text: "諦めない",
    fontSize: 88,
    roughness: 7,
    dripCount: 6,
    dripMaxLengthPx: 100,
    revealFrames: 24,
    oversprayCount: 20,
  },
};
