import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { ambientElectronicPalette as P } from "../../helpers/palette-ambient-electronic";
import { defaultTempo, tempoFields, tempoLoopFrames, tempoPresets } from "../../helpers/tempo";

export const LASER_BEAMS_STYLES = ["fan", "cross", "sheet", "scan", "tunnel", "grid"] as const;

/**
 * Club lasers cutting through haze, synced to the tempo. Renders over black
 * for Screen / Add blending in an editor; `--transparent-bg` gives a
 * premultiplied alpha version instead. See .agents/design/ambient-electronic.md.
 */
export const laserBeamsSchema = z.object({
  /**
   * fan = beams fanning down from the top center, chasing on the beat and
   * sweeping; cross = beams rising from the bottom corners, sweeping in
   * opposite directions so they cross; sheet = a thin plane of light
   * rippling overhead; scan = near-horizontal beams from both side edges
   * tilting up and down; tunnel = a rotating cone of beams from the top
   * center; grid = fans from both top corners crossing into a lattice
   */
  style: z.enum(LASER_BEAMS_STYLES),
  /** Even beams / left side of the sheet */
  colorA: zColor(),
  /** Odd beams / right side of the sheet */
  colorB: zColor(),
  /** White-hot beam core */
  colorC: zColor(),
  /** Beams (sheet: scan lines across the plane) */
  beamCount: z.number().int().min(1).max(24),
  /** Fan width in degrees (tunnel: cone opening) */
  spread: z.number().min(0).max(160),
  /** Sweep amplitude in degrees */
  sweep: z.number().min(0).max(60),
  /** Bars per sweep cycle */
  sweepBars: z.number().int().min(1).max(16),
  /** Beat chase: alternate beams flash on the beat, 0 = steady */
  pulse: z.number().min(0).max(1),
  /** Core width in 1080p pixels */
  beamWidth: z.number().min(0.5).max(6),
  /** Smoke scattering the beams */
  haze: z.number().min(0).max(1),
  /** Sheet / scan height, % of the frame height from the top */
  centerY: z.number().min(0).max(100),
  intensity: z.number().min(0).max(2),
  ...tempoFields,
  randomSeed: z.number().int().min(0).max(999),
  /** Black for Screen blending; made transparent by --transparent-bg */
  backgroundColor: zColor(),
});

export type LaserBeamsSchemaType = z.infer<typeof laserBeamsSchema>;

export const laserBeamsDurationFrames = tempoLoopFrames;

const base = {
  colorA: P.coral,
  colorB: P.sky,
  colorC: P.white,
  beamCount: 9,
  spread: 70,
  sweep: 18,
  sweepBars: 4,
  pulse: 0.5,
  beamWidth: 1.4,
  haze: 0.7,
  centerY: 34,
  intensity: 1,
  ...defaultTempo,
  randomSeed: 7,
  backgroundColor: "#000000",
} as const;

export const laserBeamsPatterns: Record<string, LaserBeamsSchemaType> = {
  /** Coral and sky beams fanning from the top, chasing on the beat */
  fanDuo: { ...base, style: "fan" },
  /** White fan, slow and steady */
  fanWhite: { ...base, style: "fan", colorA: P.white, colorB: P.white, beamCount: 13, spread: 90, sweep: 10, pulse: 0.2, randomSeed: 11 },
  /** Coral from the left corner, sky from the right, crossing */
  crossDuo: { ...base, style: "cross", beamCount: 8, spread: 30, sweep: 22, sweepBars: 2, randomSeed: 17 },
  /** Sky from both corners */
  crossCool: { ...base, style: "cross", colorA: P.sky, beamCount: 6, spread: 24, sweep: 26, sweepBars: 4, pulse: 0.3, randomSeed: 23 },
  /** Coral-to-sky light sheet rippling overhead */
  sheetDuo: { ...base, style: "sheet", beamCount: 16, sweep: 6, sweepBars: 8, pulse: 0.15, randomSeed: 29 },
  /** White light sheet */
  sheetWhite: { ...base, style: "sheet", colorA: P.white, colorB: P.white, beamCount: 16, sweep: 6, sweepBars: 8, pulse: 0.15, randomSeed: 31 },
  /** Three tight beams, like a spotlight */
  fanNarrow: { ...base, style: "fan", colorA: P.white, beamCount: 3, spread: 8, sweep: 24, pulse: 0.2, randomSeed: 37 },
  /** 24 beams over 150 degrees, house tempo */
  fanWide: { ...base, ...tempoPresets.melodicHouse, style: "fan", beamCount: 24, spread: 150, sweep: 8, randomSeed: 41 },
  /** Coral from both corners */
  crossWarm: { ...base, style: "cross", colorB: P.coral, beamCount: 8, spread: 30, sweep: 22, sweepBars: 2, randomSeed: 43 },
  /** White from both corners */
  crossWhite: { ...base, style: "cross", colorA: P.white, colorB: P.white, beamCount: 8, spread: 30, sweep: 22, sweepBars: 2, randomSeed: 47 },
  /** Classic green laser fan (outside the palette) */
  classicGreen: { ...base, style: "fan", colorA: "#39ff6a", colorB: "#39ff6a", beamCount: 11, spread: 90, randomSeed: 53 },
  /** Classic red lasers crossing (outside the palette) */
  classicRed: { ...base, style: "cross", colorA: "#ff2a2a", colorB: "#ff2a2a", beamCount: 8, spread: 30, sweep: 22, sweepBars: 2, randomSeed: 59 },
  /** Coral from the left edge, sky from the right, tilting in opposition */
  scanDuo: { ...base, style: "scan", beamCount: 8, spread: 12, sweep: 14, sweepBars: 2, centerY: 45, randomSeed: 61 },
  /** White scan */
  scanWhite: { ...base, style: "scan", colorA: P.white, colorB: P.white, beamCount: 6, spread: 10, sweep: 12, sweepBars: 4, centerY: 45, randomSeed: 67 },
  /** Rotating cone, coral and sky beams */
  tunnelDuo: { ...base, style: "tunnel", beamCount: 16, spread: 50, sweep: 8, sweepBars: 4, pulse: 0.3, randomSeed: 71 },
  /** White rotating cone */
  tunnelWhite: { ...base, style: "tunnel", colorA: P.white, colorB: P.white, beamCount: 20, spread: 44, sweep: 6, sweepBars: 8, pulse: 0.2, randomSeed: 73 },
  /** Lattice from the top corners */
  gridDuo: { ...base, style: "grid", beamCount: 16, spread: 50, sweep: 4, sweepBars: 8, pulse: 0.3, randomSeed: 79 },
  /** Sky lattice */
  gridCool: { ...base, style: "grid", colorA: P.sky, beamCount: 20, spread: 56, sweep: 3, sweepBars: 8, pulse: 0.2, randomSeed: 83 },
  /** Light sheet low over the crowd */
  sheetLow: { ...base, style: "sheet", beamCount: 16, sweep: 6, sweepBars: 8, pulse: 0.15, centerY: 62, randomSeed: 89 },
  /** Section set, intro: three steady white beams */
  sectionIntro: { ...base, style: "fan", colorA: P.white, colorB: P.white, beamCount: 3, spread: 20, sweep: 10, sweepBars: 8, pulse: 0, intensity: 0.7, randomSeed: 97 },
  /** Section set, build: fan sweeping every 2 bars */
  sectionBuild: { ...base, style: "fan", sweepBars: 2, randomSeed: 101 },
  /** Section set, drop: 12 beams crossing every bar, full chase */
  sectionDrop: { ...base, style: "cross", beamCount: 12, spread: 34, sweep: 26, sweepBars: 1, pulse: 1, intensity: 1.3, randomSeed: 103 },
  /** Section set, breakdown: still white sheet */
  sectionBreakdown: { ...base, style: "sheet", colorA: P.white, colorB: P.white, beamCount: 16, sweep: 4, sweepBars: 8, pulse: 0, randomSeed: 107 },
};

/** 1080x1920 versions (IDs: Background-LaserBeams-Vertical*). */
export const laserBeamsVerticalPatterns: Record<string, LaserBeamsSchemaType> = {
  verticalFanDuo: { ...base, style: "fan", spread: 50 },
  verticalTunnelDuo: { ...base, style: "tunnel", beamCount: 16, spread: 40, sweep: 6, sweepBars: 4, pulse: 0.3, randomSeed: 71 },
  verticalScanDuo: { ...base, style: "scan", beamCount: 8, spread: 16, sweep: 18, sweepBars: 2, centerY: 40, randomSeed: 61 },
  verticalSheetDuo: { ...base, style: "sheet", beamCount: 8, sweep: 6, sweepBars: 8, pulse: 0.15, centerY: 30, randomSeed: 29 },
};
