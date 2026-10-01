import { z } from "zod";
import {
  shaderBasicsDurationFrames,
  shaderBasicsSchema,
} from "../../helpers/shader/basics/shader-basics.schema";

export const MARBLE_FLOW_MODES = ["drift", "swirl", "wave", "pulse"] as const;

/** Shared basic props plus marble motion, translucency and water ripples. */
export const marbleFlowSchema = shaderBasicsSchema.extend({
  /**
   * How the marble sways: drift = slow churning in place, swirl = the whole
   * field turns with a twist near the center, wave = silky side-to-side
   * undulation, pulse = breathes in and out
   */
  flowMode: z.enum(MARBLE_FLOW_MODES),
  /** Domain-warp strength; low = soft bands, high = tight, turbulent swirls */
  warp: z.number().min(0).max(8),
  /** Number of glossy veins across the value range */
  veinDensity: z.number().min(0).max(20),
  /**
   * Translucency: lifts the dark bands into a milky, light-filled tint,
   * softens the vein lines and lets light glow through thin layers; 0 = the
   * original dense stone look
   */
  clarity: z.number().min(0).max(1),
  /** Water-surface ripple rings bending the marble; 0 = off */
  ripple: z.number().min(0).max(1),
  /** Ripple centers: 1 = screen center, more = scattered seeded points */
  rippleSources: z.number().int().min(1).max(4),
  /** Rings passing a point per loop; integers keep the loop seamless */
  rippleSpeed: z.number().int().min(1).max(8),
});

export type MarbleFlowSchemaType = z.infer<typeof marbleFlowSchema>;

export const marbleFlowDurationFrames = shaderBasicsDurationFrames;

/** Churning drift with a translucent finish and no ripples. */
const plainMarble = {
  flowMode: "drift",
  warp: 4,
  veinDensity: 7,
  clarity: 0.7,
  ripple: 0,
  rippleSources: 1,
  rippleSpeed: 3,
} as const;

export const marbleFlowPatterns: Record<string, MarbleFlowSchemaType> = {
  /** Deep sea blues with pearl swirls */
  ocean: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#06263d",
    colorB: "#2ec4d6",
    colorC: "#f4f1e8",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 2,
  },
  /** Plum, coral and gold */
  sunset: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#2b0a3d",
    colorB: "#ff7849",
    colorC: "#ffd166",
    scale: 1.2,
    intensity: 0.8,
    loopCycles: 1,
    randomSeed: 27,
  },

  // --- Color variations ---------------------------------------------------

  /** Banded malachite greens */
  malachite: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#022b1f",
    colorB: "#1fa971",
    colorC: "#b8f5d0",
    scale: 1.4,
    intensity: 1.1,
    loopCycles: 1,
    randomSeed: 41,
    warp: 5,
    veinDensity: 11,
  },
  /** Black stone with bright gold veins */
  obsidianGold: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#050505",
    colorB: "#2a2522",
    colorC: "#d4a93c",
    scale: 0.9,
    intensity: 1.8,
    loopCycles: 1,
    randomSeed: 63,
    veinDensity: 5,
    clarity: 0.45,
  },
  /** White Carrara stone with grey veins */
  carrara: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#55585e",
    colorB: "#f4f3ef",
    colorC: "#ffffff",
    scale: 0.8,
    intensity: 0.9,
    loopCycles: 1,
    randomSeed: 88,
    warp: 3,
    veinDensity: 4,
  },
  /** Pastel rose, lilac and cream */
  sakura: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#6b3a5b",
    colorB: "#ffb7c9",
    colorC: "#fff4e6",
    scale: 1,
    intensity: 0.7,
    loopCycles: 1,
    randomSeed: 14,
    warp: 3.2,
  },
  /** Molten reds with glowing orange seams */
  lava: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#1a0200",
    colorB: "#e0300f",
    colorC: "#ffcc4d",
    scale: 1.3,
    intensity: 1.4,
    loopCycles: 2,
    randomSeed: 9,
    warp: 6,
  },

  // --- Motion variations --------------------------------------------------

  /** Violet galaxy turning around a twisting core */
  amethystSwirl: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#140b2e",
    colorB: "#8b5cf6",
    colorC: "#f0abfc",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 33,
    flowMode: "swirl",
  },
  /** Teal silk swaying side to side */
  silkWave: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#032a33",
    colorB: "#2dd4bf",
    colorC: "#fef3c7",
    scale: 0.9,
    intensity: 0.9,
    loopCycles: 1,
    randomSeed: 52,
    flowMode: "wave",
    warp: 3,
  },
  /** Amber marble slowly breathing */
  amberPulse: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#2a1204",
    colorB: "#f59e0b",
    colorC: "#fff7ed",
    scale: 1.1,
    intensity: 1,
    loopCycles: 2,
    randomSeed: 71,
    flowMode: "pulse",
  },

  // --- Ripple variations --------------------------------------------------

  /** Rings spreading across a still pond from the center */
  pondRipple: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#041c32",
    colorB: "#3a86c8",
    colorC: "#e0f2fe",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 2,
    ripple: 0.7,
    rippleSources: 1,
    rippleSpeed: 3,
  },
  /** Several overlapping ripples, like rain on a lake */
  rainRipple: {
    ...plainMarble,
    backgroundColor: "#000000",
    colorA: "#0b1a14",
    colorB: "#4f8f7a",
    colorC: "#d9f99d",
    scale: 1.1,
    intensity: 0.9,
    loopCycles: 1,
    randomSeed: 19,
    ripple: 0.55,
    rippleSources: 4,
    rippleSpeed: 5,
  },
};
