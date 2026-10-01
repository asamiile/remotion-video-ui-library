import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";

export const STAMP_TEXT_BORDERS = ["none", "box", "double", "circle"] as const;

/**
 * Rubber-stamp title: the stamp drops in, lands with a jolt and leaves a worn,
 * uneven ink impression with rough edges and a few splatters. See
 * .agents/design/grunge.md.
 */
export const stampTextSchema = z.object({
  text: z.string().default("APPROVED"),
  /** Small second line (date, number); empty hides it */
  subText: z.string().default(""),

  fontFamily: z.string().default(SPACE_GROTESK_FONT_FAMILY),
  fontWeight: z.enum(["400", "700"]).default("700"),
  fontSize: z.number().min(16).max(240).default(150),
  letterSpacing: z.string().default("0.08em"),

  inkColor: zColor().default("#1f1d1b"),
  /** "transparent" for an overlay */
  backgroundColor: zColor().default("#c49a6c"),

  border: z.enum(STAMP_TEXT_BORDERS).default("box"),
  rotationDeg: z.number().min(-30).max(30).default(-7),

  /** Edge roughness from an SVG displacement filter (0 = clean edges) */
  roughness: z.number().min(0).max(20).default(5),
  /** Missing-ink wear, 0 (solid) – 1 (heavily worn) */
  inkWear: z.number().min(0).max(1).default(0.45),
  /** Ink dots thrown around the stamp on impact */
  splatterCount: z.number().min(0).max(30).default(12),

  /** Frames from appearing to landing */
  impactFrames: z.number().min(2).max(30).default(9),
  /** Impact jolt in px */
  shakePx: z.number().min(0).max(30).default(8),
  delayFrames: z.number().min(0).default(12),
  randomSeed: z.string().default("stamp"),
});

export type StampTextSchemaType = z.infer<typeof stampTextSchema>;

export const stampTextDurationFrames = 150;

export const defaultStampTextProps = {
  text: "APPROVED",
  subText: "",
  fontFamily: SPACE_GROTESK_FONT_FAMILY,
  fontWeight: "700" as const,
  fontSize: 150,
  letterSpacing: "0.08em",
  inkColor: "#1f1d1b",
  backgroundColor: "#c49a6c",
  border: "box" as const,
  rotationDeg: -7,
  roughness: 5,
  inkWear: 0.45,
  splatterCount: 12,
  impactFrames: 9,
  shakePx: 8,
  delayFrames: 12,
  randomSeed: "stamp",
};

export const stampTextPatterns = {
  /** Black ink in a box on kraft paper */
  approved: {
    ...defaultStampTextProps,
  },
  /** Muted rust ink, double border, date line, on newsprint */
  confidential: {
    ...defaultStampTextProps,
    text: "CONFIDENTIAL",
    subText: "FILE NO. 0427",
    fontSize: 120,
    inkColor: "#a3452f",
    backgroundColor: "#e7e1d3",
    border: "double" as const,
    rotationDeg: 6,
    inkWear: 0.5,
    randomSeed: "stamp-confidential",
  },
  /** Off-white ink in a circle on black */
  soldOut: {
    ...defaultStampTextProps,
    text: "SOLD OUT",
    fontSize: 120,
    inkColor: "#ece6d8",
    backgroundColor: "#151413",
    border: "circle" as const,
    rotationDeg: -12,
    inkWear: 0.4,
    randomSeed: "stamp-sold-out",
  },
  /** Black ink, no backdrop, for layering over footage */
  approvedTransparent: {
    ...defaultStampTextProps,
    backgroundColor: "transparent",
  },
  /** Japanese sample */
  approvedJp: {
    ...defaultStampTextProps,
    text: "検印済",
    fontFamily: LINE_SEED_JP_FONT_FAMILY,
    fontSize: 170,
    letterSpacing: "0.12em",
    inkColor: "#a3452f",
    backgroundColor: "#e7e1d3",
    randomSeed: "stamp-jp",
  },
};
