import { z } from "zod";
import {
  shaderBasicsDurationFrames,
  shaderBasicsSchema,
} from "../../helpers/shader/basics/shader-basics.schema";

/** Shared basic props plus analog artifacts; each artifact is off at 0. */
export const tvStaticSchema = shaderBasicsSchema.extend({
  /** CRT tube: barrel distortion, rounded corners, vignette */
  curvature: z.number().min(0).max(1),
  /** RGB phosphor stripes */
  phosphorMask: z.number().min(0).max(1),
  /** Darkness between scanlines */
  scanlines: z.number().min(0).max(1),
  /** VHS tracking band with displaced, streaky lines */
  trackingBand: z.number().min(0).max(1),
  /** How often bursts of heavy static with tearing occur */
  signalBursts: z.number().min(0).max(1),
  /** Picture rolls upward past a dark sync bar */
  verticalRoll: z.number().min(0).max(1),
});

export type TvStaticSchemaType = z.infer<typeof tvStaticSchema>;

export const tvStaticDurationFrames = shaderBasicsDurationFrames;

const noArtifacts = {
  curvature: 0,
  phosphorMask: 0,
  scanlines: 0.36,
  trackingBand: 0,
  signalBursts: 0,
  verticalRoll: 0,
};

export const tvStaticPatterns: Record<string, TvStaticSchemaType> = {
  /** Classic black-and-white static on black */
  mono: {
    ...noArtifacts,
    backgroundColor: "#000000",
    colorA: "#050505",
    colorB: "#f2f2f2",
    colorC: "#000000",
    scale: 1,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 3,
  },
  /** Coarser chroma static with no backdrop, for glitch overlays */
  colorTransparent: {
    ...noArtifacts,
    backgroundColor: "transparent",
    colorA: "#101010",
    colorB: "#ffffff",
    colorC: "#ffffff",
    scale: 2,
    intensity: 0.55,
    loopCycles: 1,
    randomSeed: 8,
  },
  /** Static on a curved CRT tube with visible RGB phosphors */
  crtTube: {
    ...noArtifacts,
    backgroundColor: "#000000",
    colorA: "#04060a",
    colorB: "#dfe8f2",
    colorC: "#3a3a3a",
    scale: 1.5,
    intensity: 1,
    loopCycles: 1,
    randomSeed: 21,
    curvature: 1,
    phosphorMask: 0.7,
    scanlines: 0.55,
  },
  /** Green monochrome terminal tube */
  greenPhosphor: {
    ...noArtifacts,
    backgroundColor: "#000000",
    colorA: "#010a03",
    colorB: "#6dff8a",
    colorC: "#000000",
    scale: 1.5,
    intensity: 0.95,
    loopCycles: 1,
    randomSeed: 34,
    curvature: 0.8,
    scanlines: 0.7,
  },
  /** Faint static with a VHS tracking band near the bottom, no backdrop */
  vhsTrackingTransparent: {
    ...noArtifacts,
    backgroundColor: "transparent",
    colorA: "#000000",
    colorB: "#ffffff",
    colorC: "#9a9a9a",
    scale: 1,
    intensity: 0.12,
    loopCycles: 2,
    randomSeed: 47,
    scanlines: 0.3,
    trackingBand: 1,
  },
  /** Barely-there static broken by sudden bursts and tearing, no backdrop */
  weakSignalTransparent: {
    ...noArtifacts,
    backgroundColor: "transparent",
    colorA: "#000000",
    colorB: "#ffffff",
    colorC: "#5a5a5a",
    scale: 1.5,
    intensity: 0.18,
    loopCycles: 1,
    randomSeed: 52,
    scanlines: 0.4,
    signalBursts: 0.5,
  },
  /** Static rolling upward past a black sync bar, with occasional bursts */
  verticalHold: {
    ...noArtifacts,
    backgroundColor: "#000000",
    colorA: "#050505",
    colorB: "#eeeeee",
    colorC: "#202020",
    scale: 1,
    intensity: 0.9,
    loopCycles: 1,
    randomSeed: 66,
    scanlines: 0.45,
    signalBursts: 0.3,
    verticalRoll: 1,
  },
};
