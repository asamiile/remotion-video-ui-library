import { zColor } from "@remotion/zod-types";
import { z } from "zod";

/**
 * - clean: a plain scan line, just a single-color glow band sweeping across
 * - crt: CRT-TV-style scan — thin horizontal raster lines across the whole
 *   screen, with an electron-beam band sweeping on top
 */
export const SCAN_STYLES = ["clean", "crt"] as const;

export const scanLineSchema = z.object({
  scanColor: zColor().default("#37E9FF"),
  /** Height of the scan light band (px) */
  bandHeight: z.number().min(10).default(160),

  scanStyle: z.enum(SCAN_STYLES).default("clean"),

  /** Frames for one full sweep (top to bottom). Assumes a seamless loop, so
   *  the composition's total duration must match this value. */
  scanPeriodFrames: z.number().min(10).default(150),
});

export type ScanLineSchemaType = z.infer<typeof scanLineSchema>;


export const defaultScanLineProps = {
  scanColor: "#37E9FF",
  bandHeight: 160,

  scanStyle: "clean" as const,

  scanPeriodFrames: 150,
};
export const scanLinePatterns = {
  // A plain scan line: just a single-color glow band sweeping across.
  clean: {
    ...defaultScanLineProps,
    scanStyle: "clean" as const,
  },

  // CRT-TV-style scan: raster lines across the whole screen plus an electron-beam band.
  // Color matches OneTake's body text color (--color-onetake-text).
  crt: {
    ...defaultScanLineProps,
    scanStyle: "crt" as const,
    scanColor: "#EEF1FC",
    bandHeight: 60,
  },
};
