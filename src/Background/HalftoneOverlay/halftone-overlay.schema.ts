import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const HALFTONE_OVERLAY_SHAPES = ["dot", "line"] as const;

/**
 * Transparent halftone texture for compositing over footage in an editor
 * (Multiply / Overlay / Screen). It does not read the footage, so it adds a
 * print texture rather than converting the picture. See
 * .agents/design/halftone.md.
 */
export const halftoneOverlaySchema = z.object({
  /** Ink color; black for Multiply / Overlay, white for Screen */
  color: zColor(),
  /** dot = round screen, line = horizontal line screen */
  shape: z.enum(HALFTONE_OVERLAY_SHAPES),
  /** Screen pitch in output pixels (distance between dot centers) */
  cellPx: z.number().min(3).max(60),
  /** Screen angle in degrees; 45 is the classic print angle */
  angle: z.number().min(0).max(90),
  /** Ink coverage per cell, 0-1 (0.5 ≈ dots just touching diagonally) */
  coverage: z.number().min(0.02).max(1),
  /** Slow organic variation in dot size across the frame; 0 = perfectly even */
  variation: z.number().min(0).max(1),
  /** 0 = even everywhere; 1 = dots only toward the edges, like a halftone vignette */
  edgeFade: z.number().min(0).max(1),
  /** Whole cells the screen slides per loop; 0 = static grid */
  driftCells: z.number().int().min(0).max(4),
  randomSeed: z.number().int().min(0).max(999),
  /** Loop length in seconds (default 20) */
  durationSeconds: z.number().int().min(5).max(60).optional(),
});

export type HalftoneOverlaySchemaType = z.infer<typeof halftoneOverlaySchema>;

export const halftoneOverlayDurationFrames = (props: { durationSeconds?: number }) =>
  (props.durationSeconds ?? 20) * 30;

const base = {
  color: "#000000",
  shape: "dot",
  cellPx: 10,
  angle: 45,
  coverage: 0.4,
  variation: 0.2,
  edgeFade: 0,
  driftCells: 0,
  randomSeed: 7,
} as const;

const black = { ...base, color: "#000000" } as const;
const white = { ...base, color: "#ffffff" } as const;

export const halftoneOverlayPatterns: Record<string, HalftoneOverlaySchemaType> = {
  /** Fine black dots: subtle print texture (Multiply / Overlay) */
  blackFine: { ...black, cellPx: 7, coverage: 0.35 },
  /** Coarse black dots: bold comic / poster texture */
  blackCoarse: { ...black, cellPx: 16, coverage: 0.42 },
  /** Fine white dots (Screen / Add) */
  whiteFine: { ...white, cellPx: 7, coverage: 0.3 },
  /** Coarse white dots (Screen / Add) */
  whiteCoarse: { ...white, cellPx: 16, coverage: 0.38 },
  /** Black dots only toward the edges and corners: halftone vignette */
  blackEdge: { ...black, cellPx: 12, coverage: 0.85, variation: 0.1, edgeFade: 1 },
  /** Black horizontal line screen: scanline / print texture */
  blackLines: { ...black, shape: "line", cellPx: 6, angle: 0, coverage: 0.35, variation: 0.15 },
  /** Black dots that slowly breathe and slide: living print (seamless loop) */
  blackDrift: { ...black, cellPx: 12, coverage: 0.4, variation: 0.5, driftCells: 1 },
};
