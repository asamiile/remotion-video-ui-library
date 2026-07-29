/** Shape of config/local/composition-text.local.json (all keys optional) */
export type CompositionTextLocal = {
  intro?: {
    authorName?: string;
    introTitle?: string;
    introDescription?: string;
  };
  ledTextPatterns?: Record<string, Record<string, unknown>>;
  neonTextPatterns?: Record<string, Record<string, unknown>>;
  slideInCaptionPatterns?: Record<string, Record<string, unknown>>;
  glitchTextPatterns?: Record<string, Record<string, unknown>>;
  glitchTextV1RandomPatterns?: Record<string, Record<string, unknown>>;
  wireTextPatterns?: Record<string, Record<string, unknown>>;
  neonTextRainbowPatterns?: Record<string, Record<string, unknown>>;
  lightSweepTextPatterns?: Record<string, Record<string, unknown>>;
  randomLinesBackgroundPatterns?: Record<string, Record<string, unknown>>;
  dottedLineMarkerTextPatterns?: Record<string, Record<string, unknown>>;
  typewriterTextPatterns?: Record<string, Record<string, unknown>>;
  shakeTextPatterns?: Record<string, Record<string, unknown>>;
  confettiPopTextPatterns?: Record<string, Record<string, unknown>>;
  loadingIconPatterns?: Record<string, Record<string, unknown>>;
  codeStreamPatterns?: Record<string, Record<string, unknown>>;
  stackedRevealTextPatterns?: Record<string, Record<string, unknown>>;
  tornNoteCaptionPatterns?: Record<string, Record<string, unknown>>;
  distressedTitleCardPatterns?: Record<string, Record<string, unknown>>;
  sprayPaintTextPatterns?: Record<string, Record<string, unknown>>;
  battleCalloutBannerPatterns?: Record<string, Record<string, unknown>>;
  asymmetricStatusPanelPatterns?: Record<string, Record<string, unknown>>;
  oneTakeLogoTextV1?: Record<string, unknown>;
  locationV1?: Record<string, { locationName?: string }>;
  mapLocationPointsV1?: Record<
    string,
    {
      name?: string;
      latitude?: number;
      longitude?: number;
      zoom?: number;
      pitch?: number;
      bearing?: number;
    }
  >;
};
