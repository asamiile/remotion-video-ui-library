import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { ambientElectronicPalette as P } from "../../helpers/palette-ambient-electronic";
import { defaultTempo, tempoFields, tempoLoopFrames, tempoPresets } from "../../helpers/tempo";

export const DUB_ECHO_TRAILS_STYLES = ["ring", "line", "column", "square", "arc", "cross", "dot"] as const;

/**
 * A dub delay drawn as marks: each hit lands on the beat grid, then repeats
 * every `delayBeats` with decaying feedback, stepping away, softening and
 * fading from the dry color toward the echo color. Transparent; only the
 * marks are opaque. See .agents/design/ambient-electronic.md.
 */
export const dubEchoTrailsSchema = z.object({
  /**
   * ring = circles on the rule-of-thirds points / center, repeats widening
   * concentrically; line = hairlines flush to the side margins, repeats
   * stepping toward the vertical center and shortening; column = vertical
   * hairlines standing on a baseline, repeats stepping toward the center
   * and shortening; square = concentric frames on the thirds points;
   * arc = partial circles rotating a step with each repeat; cross = plus
   * marks stepping from a thirds point toward the center; dot = dots on a
   * faint 16x9 grid, repeats lighting the next dots toward the center
   */
  style: z.enum(DUB_ECHO_TRAILS_STYLES),
  /** Dry hit */
  colorA: zColor(),
  /** Echo tail: later repeats fade toward this */
  colorB: zColor(),
  /** Accent hit (see accentEvery) */
  colorC: zColor(),
  /** Beats between hits (rounded so a whole number of hits fits the loop) */
  hitEveryBeats: z.number().int().min(1).max(16),
  /** Delay time in beats: 0.75 = dotted eighth, 0.5 = eighth, 1 = quarter */
  delayBeats: z.number().min(0.25).max(2),
  /** Level kept by each repeat */
  feedback: z.number().min(0).max(0.95),
  /** Repeats after the dry hit */
  echoes: z.number().int().min(1).max(8),
  /** Step per repeat in 1080p pixels (ring / square: size growth; unused by dot) */
  spread: z.number().min(0).max(200),
  /** Dry stroke width in 1080p pixels */
  lineWidth: z.number().min(0.5).max(12),
  /** Mark size multiplier */
  size: z.number().min(0.25).max(3),
  /** Every Nth hit uses the accent color, 0 = never */
  accentEvery: z.number().int().min(0).max(16),
  ...tempoFields,
  randomSeed: z.number().int().min(0).max(999),
  /** "transparent" for overlays */
  backgroundColor: zColor(),
});

export type DubEchoTrailsSchemaType = z.infer<typeof dubEchoTrailsSchema>;

export const dubEchoTrailsDurationFrames = tempoLoopFrames;

const base = {
  colorA: P.white,
  colorB: P.sky,
  colorC: P.coral,
  hitEveryBeats: 4,
  delayBeats: 0.75,
  feedback: 0.68,
  echoes: 5,
  spread: 28,
  lineWidth: 1.5,
  size: 1,
  accentEvery: 4,
  ...defaultTempo,
  randomSeed: 5,
  backgroundColor: "transparent",
} as const;

export const dubEchoTrailsPatterns: Record<string, DubEchoTrailsSchemaType> = {
  /** One ring per bar on the thirds grid, dotted-eighth echoes, coral every fourth bar */
  ringDotted: { ...base, style: "ring" },
  /** Rings every two beats with long, slow quarter-note echoes */
  ringQuarter: { ...base, style: "ring", hitEveryBeats: 2, delayBeats: 1, feedback: 0.65, echoes: 4, spread: 34, randomSeed: 13 },
  /** Margin-aligned hairlines stepping toward the center */
  lineDotted: { ...base, style: "line", spread: 22, randomSeed: 17 },
  /** Hairlines on every beat with tight eighth-note echoes */
  lineEighth: { ...base, style: "line", hitEveryBeats: 1, delayBeats: 0.5, feedback: 0.55, echoes: 3, spread: 16, accentEvery: 8, randomSeed: 41 },
  /** Baseline columns stepping toward the center */
  columnDotted: { ...base, style: "column", spread: 24, randomSeed: 23 },
  /** White only */
  ringMono: { ...base, style: "ring", colorB: P.white, colorC: P.white, accentEvery: 0, randomSeed: 37 },
  /** White margin lines */
  lineMono: { ...base, style: "line", spread: 22, colorB: P.white, colorC: P.white, accentEvery: 0, randomSeed: 43 },
  /** White baseline columns */
  columnMono: { ...base, style: "column", spread: 24, colorB: P.white, colorC: P.white, accentEvery: 0, randomSeed: 47 },
  /** Long dub tail: 8 close repeats with high feedback, dub-techno tempo */
  ringLongTail: { ...base, ...tempoPresets.dubTechno, style: "ring", hitEveryBeats: 8, feedback: 0.85, echoes: 8, spread: 14, randomSeed: 53 },
  /** Rings every beat with tight eighth-note echoes */
  ringEighth: { ...base, style: "ring", hitEveryBeats: 1, delayBeats: 0.5, feedback: 0.5, echoes: 2, spread: 18, accentEvery: 8, randomSeed: 59 },
  /** Columns every two beats with quarter-note echoes */
  columnQuarter: { ...base, style: "column", hitEveryBeats: 2, delayBeats: 1, feedback: 0.65, echoes: 4, spread: 30, randomSeed: 61 },
  /** Sky lines: cool from the dry hit on */
  lineCool: { ...base, style: "line", spread: 22, colorA: P.sky, colorC: P.white, randomSeed: 67 },
  /** Concentric frames on the thirds grid */
  squareDotted: { ...base, style: "square", randomSeed: 71 },
  /** White frames */
  squareMono: { ...base, style: "square", colorB: P.white, colorC: P.white, accentEvery: 0, randomSeed: 73 },
  /** Rotating arcs, dotted-eighth echoes */
  arcDotted: { ...base, style: "arc", spread: 20, echoes: 6, randomSeed: 79 },
  /** Rotating arcs every two beats, quarter-note echoes */
  arcQuarter: { ...base, style: "arc", hitEveryBeats: 2, delayBeats: 1, spread: 16, randomSeed: 83 },
  /** Plus marks stepping toward the center */
  crossDotted: { ...base, style: "cross", spread: 30, randomSeed: 89 },
  /** Dots on the grid, one per bar */
  dotGrid: { ...base, style: "dot", echoes: 6, randomSeed: 97 },
  /** Dots on every beat with eighth-note echoes */
  dotEighth: { ...base, style: "dot", hitEveryBeats: 1, delayBeats: 0.5, feedback: 0.6, echoes: 4, accentEvery: 8, randomSeed: 101 },
  /** Section set, intro: one ring every 2 bars, long white tail */
  sectionIntro: { ...base, style: "ring", hitEveryBeats: 8, feedback: 0.75, echoes: 6, colorB: P.white, accentEvery: 0, randomSeed: 103 },
  /** Section set, build: margin lines every 2 beats */
  sectionBuild: { ...base, style: "line", hitEveryBeats: 2, spread: 20, randomSeed: 107 },
  /** Section set, drop: rings on every beat, tight echoes, coral every bar */
  sectionDrop: { ...base, style: "ring", hitEveryBeats: 1, delayBeats: 0.5, feedback: 0.55, echoes: 3, spread: 20, accentEvery: 4, randomSeed: 109 },
  /** Section set, breakdown: one ring every 4 bars, slow long tail */
  sectionBreakdown: { ...base, style: "ring", hitEveryBeats: 16, delayBeats: 1.5, feedback: 0.82, echoes: 8, spread: 40, accentEvery: 0, randomSeed: 113 },
};

/** 1080x1920 versions (IDs: Background-DubEchoTrails-Vertical*). */
export const dubEchoTrailsVerticalPatterns: Record<string, DubEchoTrailsSchemaType> = {
  verticalRingDotted: { ...base, style: "ring", size: 0.6, spread: 18 },
  verticalSquareDotted: { ...base, style: "square", size: 0.6, spread: 18, randomSeed: 71 },
  verticalColumnDotted: { ...base, style: "column", spread: 18, size: 1.4, randomSeed: 23 },
  verticalDotGrid: { ...base, style: "dot", echoes: 6, randomSeed: 97 },
};
