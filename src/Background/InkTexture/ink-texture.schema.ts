import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const INK_TEXTURE_STYLES = ["splatter", "bleed", "brush", "flow"] as const;

/**
 * Transparent ink texture for compositing over footage in an editor
 * (Multiply for dark ink, Screen for light ink). Only the ink is opaque.
 * See .agents/design/grunge.md.
 */
export const inkTextureSchema = z.object({
  /**
   * splatter = ink thrown at the frame: splats slam in with an overshoot,
   * drops streak away in the throw direction, then dissolve; bleed = drops
   * soaking into wet paper with a feathered edge, darker rim and granulated
   * fill; brush = fast diagonal dry-brush slashes breaking into bristle
   * streaks toward the end; flow = smoky ink clouds curling through water
   */
  style: z.enum(INK_TEXTURE_STYLES),
  /** Ink color */
  color: zColor(),
  /** Secondary ink: bleed rim and core, thin parts of the flow clouds */
  color2: zColor(),
  /** Amount of ink, 0-1 */
  density: z.number().min(0).max(1),
  /** Mark size multiplier */
  size: z.number().min(0.25).max(3),
  /** Marks per slot per loop: higher = faster, punchier rhythm (integer keeps the loop seamless) */
  tempo: z.number().int().min(1).max(10),
  randomSeed: z.number().int().min(0).max(999),
  /** Loop length in seconds (default 20) */
  durationSeconds: z.number().int().min(5).max(60).optional(),
});

export type InkTextureSchemaType = z.infer<typeof inkTextureSchema>;

export const inkTextureDurationFrames = (props: { durationSeconds?: number }) =>
  (props.durationSeconds ?? 20) * 30;

const black = { color: "#141210", color2: "#000000", size: 1, randomSeed: 7 } as const;
const white = { ...black, color: "#ffffff", color2: "#ffffff" } as const;

export const inkTexturePatterns: Record<string, InkTextureSchemaType> = {
  /** Black ink thrown at the frame (Multiply) */
  blackSplatter: { ...black, style: "splatter", density: 0.55, tempo: 6 },
  /** White ink thrown at the frame (Screen) */
  whiteSplatter: { ...white, style: "splatter", density: 0.55, tempo: 6, randomSeed: 19 },
  /** Acid yellow and black splats (Normal) */
  acidSplatter: { ...black, style: "splatter", color: "#e4ff1a", color2: "#141210", density: 0.55, tempo: 6, randomSeed: 31 },
  /** Hot magenta splats (Normal) */
  magentaSplatter: { ...black, style: "splatter", color: "#ff2e9a", color2: "#ff2e9a", density: 0.5, tempo: 7, randomSeed: 37 },
  /** Black ink soaking into wet paper (Multiply) */
  blackBleed: { ...black, style: "bleed", color: "#2a2724", color2: "#0b0a09", density: 0.5, tempo: 3, randomSeed: 41 },
  /** Indigo ink with a deep navy rim (Multiply) */
  indigoBleed: { ...black, style: "bleed", color: "#3a4a6b", color2: "#141c33", density: 0.5, tempo: 3, randomSeed: 53 },
  /** Black dry-brush slashes (Multiply) */
  blackBrush: { ...black, style: "brush", density: 0.55, tempo: 5, randomSeed: 61 },
  /** White dry-brush slashes (Screen) */
  whiteBrush: { ...white, style: "brush", density: 0.55, tempo: 5, randomSeed: 67 },
  /** Electric blue and white dry-brush slashes (Normal) */
  electricBrush: { ...black, style: "brush", color: "#2f5bff", color2: "#ffffff", density: 0.55, tempo: 5, randomSeed: 89 },
  /** Black ink clouds in water (Multiply) */
  blackFlow: { ...black, style: "flow", color2: "#4a4642", density: 0.5, tempo: 2, randomSeed: 73 },
  /** Sepia ink clouds in water (Multiply) */
  sepiaFlow: { ...black, style: "flow", color: "#4a2c14", color2: "#a8805a", density: 0.5, tempo: 2, randomSeed: 79 },
};
