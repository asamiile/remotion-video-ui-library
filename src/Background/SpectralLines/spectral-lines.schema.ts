import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { ambientElectronicPalette as P } from "../../helpers/palette-ambient-electronic";
import { defaultTempo, tempoFields, tempoLoopFrames } from "../../helpers/tempo";

export const SPECTRAL_LINES_STYLES = ["stack", "mirror", "radial", "columns"] as const;

/**
 * Hairlines driven by a frequency spectrum: low bands in the accent color,
 * high bands in the cool color, the rest white. Without an audio file the
 * spectrum is synthesized from the tempo (kick on the beat, hats on the
 * off-beat, slow pads), so it loops; with one it follows the track.
 * Transparent. See .agents/design/ambient-electronic.md.
 */
export const spectralLinesSchema = z.object({
  /**
   * stack = horizontal lines stacked low (bottom) to high (top), each rising
   * in a drifting ridge with its band; mirror = the stack folded around a
   * center line, low bands in the middle bulging outward; radial = rays
   * around a hairline circle, low bands at the top; columns = vertical lines
   * across the frame, low bands on the left
   */
  style: z.enum(SPECTRAL_LINES_STYLES),
  /** Mid bands */
  colorA: zColor(),
  /** High bands */
  colorB: zColor(),
  /** Low bands */
  colorC: zColor(),
  lineCount: z.number().int().min(2).max(64),
  /** Stroke width in pixels */
  lineWidth: z.number().min(0.5).max(6),
  /** Ridge height in pixels (radial: ray length) */
  amplitude: z.number().min(0).max(400),
  /** Size of the stack in pixels (radial: circle diameter; columns: width) */
  extent: z.number().min(100).max(1800),
  /** Horizontal center, % of the frame width (radial / columns) */
  centerX: z.number().min(0).max(100),
  /** Vertical center, % of the frame height */
  centerY: z.number().min(0).max(100),
  /** Line opacity */
  opacity: z.number().min(0).max(1),
  /** Soft glow behind the lines */
  glow: z.number().min(0).max(1),
  /** Path under public/; empty = spectrum synthesized from the tempo */
  audioFile: z.string(),
  /** Start reading the audio file this many seconds in */
  audioOffsetInSeconds: z.number().min(0),
  /** Audio gain (audio file only) */
  sensitivity: z.number().min(0.1).max(10),
  ...tempoFields,
  randomSeed: z.number().int().min(0).max(999),
  /** "transparent" for overlays */
  backgroundColor: zColor(),
});

export type SpectralLinesSchemaType = z.infer<typeof spectralLinesSchema>;

export const spectralLinesDurationFrames = tempoLoopFrames;

const base = {
  colorA: P.white,
  colorB: P.sky,
  colorC: P.coral,
  lineCount: 28,
  lineWidth: 1.4,
  amplitude: 110,
  extent: 420,
  centerX: 50,
  centerY: 55,
  opacity: 0.85,
  glow: 0.4,
  audioFile: "",
  audioOffsetInSeconds: 0,
  sensitivity: 1,
  ...defaultTempo,
  randomSeed: 9,
  backgroundColor: "transparent",
} as const;

export const spectralLinesPatterns: Record<string, SpectralLinesSchemaType> = {
  /** 28 lines across the lower middle of the frame */
  stack: { ...base, style: "stack" },
  /** 48 finer, tighter lines */
  stackDense: { ...base, style: "stack", lineCount: 48, lineWidth: 1, amplitude: 80, extent: 360, randomSeed: 21 },
  /** White only */
  stackMono: { ...base, style: "stack", colorB: P.white, colorC: P.white, randomSeed: 33 },
  /** Stack in the upper part of the frame */
  stackTop: { ...base, style: "stack", centerY: 25, randomSeed: 41 },
  /** Stack filling the frame as a texture */
  stackFull: { ...base, style: "stack", lineCount: 56, lineWidth: 1, extent: 900, amplitude: 70, centerY: 50, opacity: 0.6, randomSeed: 47 },
  /** Eight heavier lines */
  stackSparse: { ...base, style: "stack", lineCount: 8, lineWidth: 2.2, extent: 300, randomSeed: 53 },
  /** White and sky only */
  stackCool: { ...base, style: "stack", colorC: P.white, randomSeed: 59 },
  /** Folded around the center line */
  mirror: { ...base, style: "mirror", lineCount: 16, extent: 360, amplitude: 70, centerY: 50, randomSeed: 61 },
  /** Folded, 28 finer lines per side */
  mirrorDense: { ...base, style: "mirror", lineCount: 28, lineWidth: 1, extent: 480, amplitude: 60, centerY: 50, randomSeed: 67 },
  /** Rays around a circle in the center */
  radial: { ...base, style: "radial", lineCount: 32, lineWidth: 2, extent: 360, amplitude: 140, centerY: 50, randomSeed: 71 },
  /** White rays */
  radialMono: { ...base, style: "radial", lineCount: 48, lineWidth: 1.4, extent: 420, amplitude: 120, centerY: 50, colorB: P.white, colorC: P.white, randomSeed: 73 },
  /** Vertical lines across the center */
  columns: { ...base, style: "columns", lineCount: 24, extent: 600, amplitude: 90, randomSeed: 79 },
  /** Vertical lines at the right edge */
  columnsSide: { ...base, style: "columns", lineCount: 16, extent: 260, amplitude: 80, centerX: 85, randomSeed: 83 },
  /** Section set, intro: low, faint ridges */
  sectionIntro: { ...base, style: "stack", amplitude: 50, opacity: 0.5, glow: 0.2, randomSeed: 89 },
  /** Section set, build: more lines, regular ridges */
  sectionBuild: { ...base, style: "stack", lineCount: 36, randomSeed: 97 },
  /** Section set, drop: tall ridges with strong glow */
  sectionDrop: { ...base, style: "stack", amplitude: 250, glow: 0.7, randomSeed: 101 },
  /** Section set, breakdown: eight calm lines */
  sectionBreakdown: { ...base, style: "stack", lineCount: 8, amplitude: 60, opacity: 0.6, randomSeed: 103 },
};

/** 1080x1920 versions (IDs: Background-SpectralLines-Vertical*). */
export const spectralLinesVerticalPatterns: Record<string, SpectralLinesSchemaType> = {
  verticalStack: { ...base, style: "stack", extent: 600, centerY: 60 },
  verticalMirror: { ...base, style: "mirror", lineCount: 16, extent: 500, amplitude: 70, centerY: 50, randomSeed: 61 },
  verticalRadial: { ...base, style: "radial", lineCount: 32, lineWidth: 2, extent: 400, amplitude: 160, centerY: 50, randomSeed: 71 },
  verticalColumns: { ...base, style: "columns", lineCount: 20, extent: 700, amplitude: 70, randomSeed: 79 },
};
