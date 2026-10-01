import { z } from "zod";
import {
  shaderBackgroundBase,
  shaderBackgroundDurationFrames,
  shaderBackgroundSchema,
} from "../../helpers/shader/background/shader-background.schema";

export const GRUNGE_SURFACE_STYLES = ["wall", "collage", "rust", "cardboard"] as const;

/**
 * Full-frame grunge surfaces. Color roles per style:
 * - wall: colorA concrete, colorB spray paint, colorC tape
 * - collage: colorA backing board, colorB / colorC scrap and tape colors
 * - rust: colorA paint, colorB dark rust, colorC light rust
 * - cardboard: colorA kraft, colorB corrugation shadow, colorC packing tape
 * See .agents/design/grunge.md.
 */
export const grungeSurfaceSchema = shaderBackgroundSchema.extend({
  style: z.enum(GRUNGE_SURFACE_STYLES),
});

export type GrungeSurfaceSchemaType = z.infer<typeof grungeSurfaceSchema>;

export const grungeSurfaceDurationFrames = shaderBackgroundDurationFrames;

const base = { ...shaderBackgroundBase, backgroundColor: "#000000" } as const;

export const grungeSurfacePatterns: Record<string, GrungeSurfaceSchemaType> = {
  /** Grey concrete, teal spray patch with drips, masking tape, roaming light */
  concreteWall: {
    ...base,
    style: "wall",
    colorA: "#8d8c87",
    colorB: "#2fa39a",
    colorC: "#e9dcc0",
    randomSeed: 12,
  },
  /** Dark concrete with acid-green spray */
  graffitiWall: {
    ...base,
    style: "wall",
    colorA: "#55544f",
    colorB: "#b8e62e",
    colorC: "#e9dcc0",
    randomSeed: 27,
  },
  /** Torn paper scraps, halftone prints and tape on a dark board, swapping in and out */
  paperCollage: {
    ...base,
    style: "collage",
    colorA: "#3b3833",
    colorB: "#c9714c",
    colorC: "#efe3c4",
    randomSeed: 5,
  },
  /** Newsprint collage on black with a mustard accent */
  newsCollage: {
    ...base,
    style: "collage",
    colorA: "#1d1c1b",
    colorB: "#e0a83c",
    colorC: "#efe3c4",
    randomSeed: 33,
  },
  /** Teal-painted steel slowly eaten by rust */
  rustedSteel: {
    ...base,
    style: "rust",
    colorA: "#3f7f7a",
    colorB: "#6e2f17",
    colorC: "#c06a2b",
    randomSeed: 8,
  },
  /** Navy-painted steel with rust */
  rustedNavy: {
    ...base,
    style: "rust",
    colorA: "#1f2a5a",
    colorB: "#6a2c14",
    colorC: "#b9652c",
    randomSeed: 21,
  },
  /** Kraft cardboard with a torn top layer and packing tape */
  cardboardBox: {
    ...base,
    style: "cardboard",
    colorA: "#b88a5a",
    colorB: "#6f4c2c",
    colorC: "#c9a26b",
    randomSeed: 14,
  },
};
