import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const SPRAY_TEXTURE_STYLES = [
  "burst",
  "stroke",
  "drip",
  "mist",
  "frame",
] as const;

/**
 * Transparent spray-paint texture for compositing over footage in an editor
 * (Multiply for dark paint, Screen for light paint, Normal for color). Only
 * the paint is opaque. See .agents/design/grunge.md.
 */
export const sprayTextureSchema = z.object({
  /**
   * burst = spray shots that punch in from a solid core to a speckled edge,
   * then erode back into dots; stroke = fast diagonal slashes swiped across
   * the frame, heavy at the start and tapering out; drip = heavy patches with
   * paint running down in drips; mist = overspray clouds swirling past;
   * frame = spray-painted border pulsing around a clean center
   */
  style: z.enum(SPRAY_TEXTURE_STYLES),
  /** Paint color */
  color: zColor(),
  /** Second can: about half of the bursts / strokes / drips use it */
  color2: zColor(),
  /** Amount of paint, 0-1 */
  density: z.number().min(0).max(1),
  /** Spray size multiplier (dots and patches) */
  size: z.number().min(0.25).max(3),
  /** Marks per slot per loop: higher = faster, punchier rhythm (integer keeps the loop seamless) */
  tempo: z.number().int().min(1).max(10),
  randomSeed: z.number().int().min(0).max(999),
  /** Loop length in seconds (default 20) */
  durationSeconds: z.number().int().min(5).max(60).optional(),
});

export type SprayTextureSchemaType = z.infer<typeof sprayTextureSchema>;

export const sprayTextureDurationFrames = (props: { durationSeconds?: number }) =>
  (props.durationSeconds ?? 20) * 30;

const black = { color: "#000000", color2: "#000000", size: 1, randomSeed: 7 } as const;
const white = { ...black, color: "#ffffff", color2: "#ffffff" } as const;

export const sprayTexturePatterns: Record<string, SprayTextureSchemaType> = {
  /** Black spray shots (Multiply) */
  blackBurst: { ...black, style: "burst", density: 0.55, tempo: 6 },
  /** White spray shots (Screen) */
  whiteBurst: { ...white, style: "burst", density: 0.55, tempo: 6, randomSeed: 17 },
  /** Acid yellow and black shots (Normal) */
  acidBurst: { ...black, style: "burst", color: "#e4ff1a", color2: "#111111", density: 0.6, tempo: 6, randomSeed: 29 },
  /** Hot magenta and cyan shots (Normal / Screen) */
  neonBurst: { ...black, style: "burst", color: "#ff2e9a", color2: "#19e3ff", density: 0.6, tempo: 7, randomSeed: 31 },
  /** Black diagonal slashes (Multiply) */
  blackSlash: { ...black, style: "stroke", density: 0.55, tempo: 5, randomSeed: 11 },
  /** White diagonal slashes (Screen) */
  whiteSlash: { ...white, style: "stroke", density: 0.55, tempo: 5, randomSeed: 37 },
  /** Electric blue and acid yellow slashes (Normal) */
  electricSlash: { ...black, style: "stroke", color: "#2f5bff", color2: "#e4ff1a", density: 0.6, tempo: 5, randomSeed: 47 },
  /** Black patches with drips (Multiply) */
  blackDrip: { ...black, style: "drip", density: 0.5, tempo: 4, randomSeed: 43 },
  /** Hot magenta patches with drips (Normal) */
  neonDrip: { ...black, style: "drip", color: "#ff2e9a", color2: "#c4157a", density: 0.5, tempo: 4, randomSeed: 59 },
  /** Black overspray swirling past (Multiply) */
  blackMist: { ...black, style: "mist", density: 0.5, tempo: 3, randomSeed: 67 },
  /** White overspray swirling past (Screen) */
  whiteMist: { ...white, style: "mist", density: 0.5, tempo: 3, randomSeed: 71 },
  /** Black spray-painted border pulsing around a clean center (Multiply) */
  blackFrame: { ...black, style: "frame", density: 0.5, tempo: 4, randomSeed: 83 },
};
