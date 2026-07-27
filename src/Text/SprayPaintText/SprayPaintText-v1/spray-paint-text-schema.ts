import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const sprayPaintTextSchemaV1 = z.object({
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

export type SprayPaintTextSchemaV1Type = z.infer<
  typeof sprayPaintTextSchemaV1
>;
