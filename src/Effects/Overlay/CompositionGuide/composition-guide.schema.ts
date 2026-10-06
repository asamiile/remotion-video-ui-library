import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const COMPOSITION_GUIDES = [
  "thirds",
  "halves",
  "grid",
  "diagonal",
  "goldenGrid",
  "goldenSpiral",
  "goldenTriangle",
  "silverGrid",
  "silverSpiral",
] as const;

/**
 * Transparent camera-style composition guide: only the guide lines are
 * drawn, like the grid on a viewfinder you frame a landscape through. Lines
 * draw in from their midpoints (spirals from the outside in), then hold.
 */
export const compositionGuideSchema = z.object({
  /**
   * thirds = rule-of-thirds grid; halves = center cross; grid = even
   * divisions x divisions grid; diagonal = corner diagonals plus 45-degree
   * lines from each corner; goldenGrid = phi grid (1 : 0.618 : 1);
   * goldenSpiral = whirling squares of a golden rectangle with the spiral;
   * goldenTriangle = one diagonal and the perpendiculars from the other two
   * corners; silverGrid = 1 : sqrt(2) divisions; silverSpiral = a
   * 1 : sqrt(2) rectangle halved again and again with the spiral through it
   */
  guide: z.enum(COMPOSITION_GUIDES),
  /** Cells per side for `grid` */
  divisions: z.number().int().min(2).max(12),
  /**
   * stretch = the ratio construction fills the whole frame (like camera
   * apps); true = keeps the exact ratio, centered at full height
   */
  fit: z.enum(["stretch", "true"]),
  /** Mirror the spiral / triangle horizontally */
  flipX: z.boolean(),
  /** Mirror the spiral / triangle vertically */
  flipY: z.boolean(),
  lineColor: zColor(),
  /** 0-1 */
  lineOpacity: z.number().min(0).max(1),
  /** Line width in 1080p pixels */
  lineWidth: z.number().min(0.5).max(8),
  /** Soft halo under the lines so they read on any footage, 0-1 */
  shadowOpacity: z.number().min(0).max(1),
  /** Halo color: dark under white lines, light under black lines */
  shadowColor: zColor(),
  /** Frames before the first line starts drawing */
  delayFrames: z.number().int().min(0).max(120),
  /** Frames each line takes to draw in */
  drawFrames: z.number().int().min(1).max(120),
  /** Frames between consecutive lines starting */
  staggerFrames: z.number().int().min(0).max(30),
  /** Fade-out at the end; 0 keeps the lines up to the last frame */
  outroFrames: z.number().int().min(0).max(60),
  /** Clip length in seconds */
  durationSeconds: z.number().int().min(5).max(60),
});

export type CompositionGuideSchemaType = z.infer<typeof compositionGuideSchema>;

export const compositionGuideDurationFrames = (props: {
  durationSeconds: number;
}) => props.durationSeconds * 30;

export const defaultCompositionGuideProps = {
  guide: "thirds",
  divisions: 4,
  fit: "stretch",
  flipX: false,
  flipY: false,
  lineColor: "#ffffff",
  lineOpacity: 0.85,
  lineWidth: 2,
  shadowOpacity: 0.35,
  shadowColor: "#000000",
  delayFrames: 6,
  drawFrames: 24,
  staggerFrames: 4,
  outroFrames: 0,
  durationSeconds: 10,
} as const satisfies CompositionGuideSchemaType;

const base = defaultCompositionGuideProps;

const goldenSpiral = { ...base, guide: "goldenSpiral", drawFrames: 30, staggerFrames: 3 } as const;
const silverSpiral = { ...base, guide: "silverSpiral", drawFrames: 30, staggerFrames: 3 } as const;

/** Black lines with a light halo, for bright footage or Multiply. */
const black = (props: CompositionGuideSchemaType): CompositionGuideSchemaType => ({
  ...props,
  lineColor: "#000000",
  lineOpacity: 0.8,
  shadowColor: "#ffffff",
  shadowOpacity: 0.3,
});

export const compositionGuidePatterns: Record<string, CompositionGuideSchemaType> = {
  /** Rule of thirds */
  thirds: { ...base },
  /** Center cross */
  halves: { ...base, guide: "halves" },
  /** 4 x 4 grid */
  grid4: { ...base, guide: "grid", divisions: 4, staggerFrames: 3 },
  /** Corner diagonals with 45-degree lines */
  diagonal: { ...base, guide: "diagonal" },
  /** Phi grid */
  goldenGrid: { ...base, guide: "goldenGrid" },
  /** Golden spiral winding in toward the right */
  goldenSpiral: { ...goldenSpiral },
  /** Golden spiral winding in toward the left */
  goldenSpiralFlip: { ...goldenSpiral, flipX: true },
  /** Golden triangles */
  goldenTriangle: { ...base, guide: "goldenTriangle" },
  /** Silver-ratio (1 : sqrt 2) grid */
  silverGrid: { ...base, guide: "silverGrid" },
  /** Silver spiral winding in toward the right */
  silverSpiral: { ...silverSpiral },
  /** Silver spiral winding in toward the left */
  silverSpiralFlip: { ...silverSpiral, flipX: true },
  thirdsBlack: black({ ...base }),
  halvesBlack: black({ ...base, guide: "halves" }),
  grid4Black: black({ ...base, guide: "grid", divisions: 4, staggerFrames: 3 }),
  diagonalBlack: black({ ...base, guide: "diagonal" }),
  goldenGridBlack: black({ ...base, guide: "goldenGrid" }),
  goldenSpiralBlack: black({ ...goldenSpiral }),
  goldenSpiralFlipBlack: black({ ...goldenSpiral, flipX: true }),
  goldenTriangleBlack: black({ ...base, guide: "goldenTriangle" }),
  silverGridBlack: black({ ...base, guide: "silverGrid" }),
  silverSpiralBlack: black({ ...silverSpiral }),
  silverSpiralFlipBlack: black({ ...silverSpiral, flipX: true }),
};
