/** Shape of config/local/composition-text.local.json (all keys optional) */
export type CompositionTextLocal = {
  intro?: {
    authorName?: string;
    introTitle?: string;
    introDescription?: string;
  };
  ledTextV1Patterns?: Record<string, Record<string, unknown>>;
  neonTextV1Patterns?: Record<string, Record<string, unknown>>;
  slideInCaptionV1Patterns?: Record<string, Record<string, unknown>>;
  glitchTextV1Patterns?: Record<string, Record<string, unknown>>;
  wireTextV1Patterns?: Record<string, Record<string, unknown>>;
  neonTextRainbowV1Patterns?: Record<string, Record<string, unknown>>;
  lightSweepTextV1Patterns?: Record<string, Record<string, unknown>>;
  typewriterTextV1Patterns?: Record<string, Record<string, unknown>>;
  shakeTextV1Patterns?: Record<string, Record<string, unknown>>;
  confettiPopTextV1Patterns?: Record<string, Record<string, unknown>>;
  loadingIconV1Patterns?: Record<string, Record<string, unknown>>;
  stackedRevealTextV1Patterns?: Record<string, Record<string, unknown>>;
  tornNoteCaptionV1Patterns?: Record<string, Record<string, unknown>>;
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
