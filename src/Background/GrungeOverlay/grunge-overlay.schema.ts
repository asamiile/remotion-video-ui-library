import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const GRUNGE_OVERLAY_STYLES = [
  "dust",
  "frame",
  "toner",
  "stain",
  "lightLeak",
  "filmEdge",
  "vhs",
  "misregister",
] as const;

/**
 * Transparent grunge texture for compositing over footage in an editor
 * (Multiply / Overlay for black, Screen for white). Only the marks are
 * opaque. See .agents/design/grunge.md.
 */
export const grungeOverlaySchema = z.object({
  /**
   * dust = old-film dust specks, hairs and vertical scratches that jump
   * every few frames; frame = blotchy grime eating in from the edges, clean
   * center; toner = coarse photocopy toner speckle and streaks; stain =
   * ink / coffee stains spreading with a darker rim; lightLeak = warm film
   * light leaks breathing in from the edges; filmEdge = sprocket strips,
   * edge codes and rounded gate corners; vhs = scanlines, tracking noise,
   * dropouts and chroma streaks; misregister = CMY halftone screens that
   * don't line up (fixed CMY inks)
   */
  style: z.enum(GRUNGE_OVERLAY_STYLES),
  /** Mark color: black for Multiply / Overlay, white for Screen */
  color: zColor(),
  /** Secondary color: stain rim, light-leak edge, film edge codes */
  color2: zColor(),
  /** Amount of marks, 0-1 */
  density: z.number().min(0).max(1),
  /** Mark size multiplier */
  size: z.number().min(0.25).max(3),
  /** Frames between re-rolls of the random marks (film-like jitter) */
  holdFrames: z.number().int().min(1).max(12),
  randomSeed: z.number().int().min(0).max(999),
  /** Loop length in seconds (default 20) */
  durationSeconds: z.number().int().min(5).max(60).optional(),
});

export type GrungeOverlaySchemaType = z.infer<typeof grungeOverlaySchema>;

export const grungeOverlayDurationFrames = (props: { durationSeconds?: number }) =>
  (props.durationSeconds ?? 20) * 30;

const black = { color: "#000000", color2: "#000000", size: 1, holdFrames: 2, randomSeed: 7 } as const;
const white = { ...black, color: "#ffffff", color2: "#ffffff" } as const;

export const grungeOverlayPatterns: Record<string, GrungeOverlaySchemaType> = {
  /** Black dust, hairs and scratches (Multiply) */
  blackDust: { ...black, style: "dust", density: 0.5 },
  /** White dust, hairs and scratches (Screen), like a dirty projector print */
  whiteDust: { ...white, style: "dust", density: 0.5, randomSeed: 19 },
  /** Black grime around the edges, clean center (Multiply) */
  blackFrame: { ...black, style: "frame", density: 0.55, holdFrames: 4 },
  /** White worn edges, like scraped paint (Screen) */
  whiteFrame: { ...white, style: "frame", density: 0.5, holdFrames: 4, randomSeed: 23 },
  /** Black photocopy toner speckle and streaks (Multiply) */
  blackToner: { ...black, style: "toner", density: 0.5, holdFrames: 3 },
  /** White toner speckle (Screen) */
  whiteToner: { ...white, style: "toner", density: 0.45, holdFrames: 3, randomSeed: 31 },
  /** Dark ink blots spreading with a darker rim (Multiply) */
  inkStain: { ...black, style: "stain", color: "#2a2623", color2: "#0d0b0a", density: 0.5, randomSeed: 41 },
  /** Coffee rings: pale brown fill, dark brown rim (Multiply) */
  coffeeStain: { ...black, style: "stain", color: "#b88a5a", color2: "#5a3518", density: 0.55, randomSeed: 53 },
  /** Orange-gold light leaks from the edges (Screen / Add) */
  warmLightLeak: { ...black, style: "lightLeak", color: "#ffb347", color2: "#c2401c", density: 0.6, holdFrames: 3 },
  /** Black film strips with sprocket holes and orange edge codes (Normal) */
  filmEdge: { ...black, style: "filmEdge", color: "#0b0a09", color2: "#d98a3a", density: 0.5, holdFrames: 2 },
  /** VHS artefacts: tracking noise, dropouts, chroma streaks, scanlines (Normal / Screen) */
  vhsTracking: { ...white, style: "vhs", density: 0.55, holdFrames: 2, randomSeed: 61 },
  /** Misregistered CMY halftone (Multiply) */
  cmykMisregister: { ...black, style: "misregister", density: 0.6, holdFrames: 4, randomSeed: 73 },
};
