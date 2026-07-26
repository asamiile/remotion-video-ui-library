import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../../helpers/line-seed-jp";

export const tornNoteCaptionSchemaV1 = z.object({
  text: z.string().default("I WILL NOT GIVE IN"),

  fontFamily: z.string().default(LINE_SEED_JP_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(16).max(120).default(40),
  letterSpacing: z.string().default("0.02em"),
  lineHeight: z.number().min(1).max(2).default(1.3),

  paperColor: zColor().default("#eef1fc"),
  textColor: zColor().default("#060810"),
  backgroundColor: zColor().default("#060810"),

  /** Tilt of the paper (degrees) */
  rotationDeg: z.number().min(-45).max(45).default(-4),
  /** Inner padding of the paper (px) */
  paddingPx: z.number().min(0).default(36),
  /** How much of the top-right/bottom-left corners are notched off to read as "torn paper" (px) */
  tornCornerPx: z.number().min(0).max(80).default(22),

  /** Frames for the pop-in entrance (scale 0.9 -> 1). 0 makes it a hard cut */
  popInFrames: z.number().min(0).default(10),
  delayFrames: z.number().min(0).default(0),
});

export type TornNoteCaptionSchemaV1Type = z.infer<
  typeof tornNoteCaptionSchemaV1
>;
