import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const grungeTransitionAnimationDurationFrames = 60;

export const GRUNGE_TRANSITION_MODES = ["tape", "filmBurn", "photocopy"] as const;

/**
 * Overlay transitions that seal the frame at the midpoint and are
 * transparent before and after. Color roles per mode:
 * - tape: colorA tape, colorB sheen, colorC edge / shadow
 * - filmBurn: colorA glowing edge, colorB white-hot light, colorC char
 * - photocopy: colorA paper, colorB scan light, colorC toner
 * See .agents/design/grunge.md.
 */
export const grungeTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the effect */
  backgroundColor: zColor(),
  /**
   * tape = strips of tape slapped across until covered, then peeled off;
   * filmBurn = burn holes spread to a white-hot frame, then burn away;
   * photocopy = a scan light sweeps down leaving a toner copy, a second
   * pass lifts it off
   */
  mode: z.enum(GRUNGE_TRANSITION_MODES),
  colorA: zColor(),
  colorB: zColor(),
  colorC: zColor(),
  randomSeed: z.number().int().min(0).max(999),
});
export type GrungeTransitionSchemaType = z.infer<typeof grungeTransitionSchema>;

/** Beige masking tape */
const maskingTape: GrungeTransitionSchemaType = {
  backgroundColor: "transparent",
  mode: "tape",
  colorA: "#e6d6b0",
  colorB: "#fff6df",
  colorC: "#a8916a",
  randomSeed: 6,
};

/** Silver duct tape */
const ductTape: GrungeTransitionSchemaType = {
  ...maskingTape,
  colorA: "#9aa0a6",
  colorB: "#e6eaed",
  colorC: "#4d5156",
  randomSeed: 18,
};

/** Projector film melting: orange edges, white-hot light, charred rims */
const filmBurn: GrungeTransitionSchemaType = {
  backgroundColor: "transparent",
  mode: "filmBurn",
  colorA: "#ff8a2a",
  colorB: "#fff4d6",
  colorC: "#2a160b",
  randomSeed: 9,
};

/** Photocopier: grey paper, greenish scan light, black toner */
const photocopy: GrungeTransitionSchemaType = {
  backgroundColor: "transparent",
  mode: "photocopy",
  colorA: "#e8e6e1",
  colorB: "#eafff4",
  colorC: "#1a1a1a",
  randomSeed: 24,
};

export const grungeTransitionPatterns: Record<string, GrungeTransitionSchemaType> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  maskingTape: maskingTape,
  ductTape: ductTape,
  filmBurn: filmBurn,
  photocopy: photocopy,
};
