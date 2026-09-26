import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const codecCorruptTransitionAnimationDurationFrames = 48;
export const codecCorruptTransitionDurationFrames = () =>
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 150
    : codecCorruptTransitionAnimationDurationFrames;

/** Macroblock corruption spreads in clumps until the frame is covered, then drops out block by block. */
export const codecCorruptTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the effect */
  backgroundColor: zColor(),
  colorA: zColor(),
  colorB: zColor(),
  colorC: zColor(),
  /** Macroblock size in pixels */
  blockSize: z.number().int().min(4).max(64),
  randomSeed: z.number().int().min(0).max(999),
});
export type CodecCorruptTransitionSchemaType = z.infer<
  typeof codecCorruptTransitionSchema
>;

/** Broken digital broadcast: green and magenta blocks */
const greenMagenta: CodecCorruptTransitionSchemaType = {
  backgroundColor: "#101014",
  colorA: "#00ff6a",
  colorB: "#ff1fd2",
  colorC: "#7d7d86",
  blockSize: 16,
  randomSeed: 7,
};

/** Monochrome luma blocks, smaller and denser */
const lumaGray: CodecCorruptTransitionSchemaType = {
  backgroundColor: "#101014",
  colorA: "#f2f2f2",
  colorB: "#2a2a2e",
  colorC: "#8c8c92",
  blockSize: 12,
  randomSeed: 23,
};

/** Same look with no backdrop, for layering over footage. */
const transparent = (
  pattern: CodecCorruptTransitionSchemaType,
): CodecCorruptTransitionSchemaType => ({
  ...pattern,
  backgroundColor: "transparent",
});

export const codecCorruptTransitionPatterns: Record<
  string,
  CodecCorruptTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  greenMagenta: greenMagenta,
  lumaGray: lumaGray,
  greenMagentaTransparent: transparent(greenMagenta),
  lumaGrayTransparent: transparent(lumaGray),
};
