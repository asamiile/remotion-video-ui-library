export const defaultScanLineV1Props = {
  scanColor: "#37E9FF",
  bandHeight: 160,

  scanStyle: "clean" as const,

  scanPeriodFrames: 150,
};

/**
 * Presets for the different scanStyle values. Each composition's duration must
 * match its own `scanPeriodFrames` (assumes a seamless loop; passed directly
 * to durationInFrames in Root.tsx).
 */
export const scanLineV1Patterns = {
  // A plain scan line: just a single-color glow band sweeping across.
  clean: {
    ...defaultScanLineV1Props,
    scanStyle: "clean" as const,
  },

  // CRT-TV-style scan: raster lines across the whole screen plus an electron-beam band.
  // Color matches OneTake's body text color (--color-onetake-text).
  crt: {
    ...defaultScanLineV1Props,
    scanStyle: "crt" as const,
    scanColor: "#EEF1FC",
    bandHeight: 60,
  },
};
