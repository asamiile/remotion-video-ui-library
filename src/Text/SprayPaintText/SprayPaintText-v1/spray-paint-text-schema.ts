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

  fadeInFrames: z.number().min(0).default(10),
  delayFrames: z.number().min(0).default(0),
  randomSeed: z.string().default("spray-paint-v1"),
});

export type SprayPaintTextSchemaV1Type = z.infer<
  typeof sprayPaintTextSchemaV1
>;
