export const defaultSunsetLensFlareOverlayV1Props = {
  flareColor: "#ffcf8a",
  flareXPercent: 78,
  flareYPercent: 22,
  flareRadiusPx: 260,

  streakColor: "#fff3d6",
  streakCount: 5,
  streakLengthPx: 900,
  streakThicknessPx: 3,

  warmWashColor: "#ff8a3d",
  warmWashOpacity: 0.18,
};

export const sunsetLensFlareOverlayV1Patterns = {
  /** Orange sunset (default) */
  sunset: {
    ...defaultSunsetLensFlareOverlayV1Props,
    flareColor: "#ffcf8a",
    warmWashColor: "#ff8a3d",
  },

  /** Pink/magenta golden-hour variant */
  goldenPink: {
    ...defaultSunsetLensFlareOverlayV1Props,
    flareColor: "#ffd9e8",
    warmWashColor: "#ff3d9e",
    warmWashOpacity: 0.14,
  },
};
