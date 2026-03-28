/** config/local/composition-text.local.json の形（キーはすべて省略可） */
export type CompositionTextLocal = {
  intro?: {
    authorName?: string;
    introTitle?: string;
    introDescription?: string;
  };
  ledTextV1Patterns?: Record<string, Record<string, unknown>>;
  neonTextV1Patterns?: Record<string, Record<string, unknown>>;
  slideInCaptionV1Patterns?: Record<string, Record<string, unknown>>;
  loadingIconV1Patterns?: Record<string, Record<string, unknown>>;
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
