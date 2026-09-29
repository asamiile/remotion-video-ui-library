import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const crtPowerOffTransitionAnimationDurationFrames = 36;

/** The picture collapses to a line and a dot like a CRT switching off (black at the midpoint), then switches back on. */
export const crtPowerOffTransitionSchema = z.object({
  /** Preview backdrop; "transparent" draws only the effect */
  backgroundColor: zColor(),
  /** Glow of the collapsing line and dot */
  colorA: zColor(),
  /** Dark glass of the switched-off tube */
  colorB: zColor(),
  /** Scanline darkness on the collapsing picture */
  scanlines: z.number().min(0).max(1),
});
export type CrtPowerOffTransitionSchemaType = z.infer<
  typeof crtPowerOffTransitionSchema
>;

/** Blue-white glow on a black tube */
const classic: CrtPowerOffTransitionSchemaType = {
  backgroundColor: "#3a6ea5",
  colorA: "#eaf4ff",
  colorB: "#000000",
  scanlines: 0.35,
};

/** Amber glow on a warm dark tube */
const amberTerminal: CrtPowerOffTransitionSchemaType = {
  backgroundColor: "#3a6ea5",
  colorA: "#ffb347",
  colorB: "#070401",
  scanlines: 0.5,
};

/** Same look with no backdrop, for layering over footage. */
const transparent = (
  pattern: CrtPowerOffTransitionSchemaType,
): CrtPowerOffTransitionSchemaType => ({
  ...pattern,
  backgroundColor: "transparent",
});

export const crtPowerOffTransitionPatterns: Record<
  string,
  CrtPowerOffTransitionSchemaType
> = {
  // Explicit `key: value` pairs: scripts/lib/ts-config-ast.cjs only reads
  // property assignments, not shorthand properties.
  classic: classic,
  amberTerminal: amberTerminal,
  classicTransparent: transparent(classic),
  amberTerminalTransparent: transparent(amberTerminal),
};
