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
  glitchTextRandomPatterns?: Record<string, Record<string, unknown>>;
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
  chromaticLogoTextPatterns?: Record<string, Record<string, unknown>>;
  rubyWordplayTextPatterns?: Record<string, Record<string, unknown>>;
  pedigreeCreditTextPatterns?: Record<string, Record<string, unknown>>;
  chapterTitleCardPatterns?: Record<string, Record<string, unknown>>;
  diegeticMaterialCreditPatterns?: Record<string, Record<string, unknown>>;
  cinematicPresentsCreditPatterns?: Record<string, Record<string, unknown>>;
  interviewQuestionCaptionPatterns?: Record<string, Record<string, unknown>>;
  announcementEndCardPatterns?: Record<string, Record<string, unknown>>;
  battleCalloutBannerPatterns?: Record<string, Record<string, unknown>>;
  asymmetricStatusPanelPatterns?: Record<string, Record<string, unknown>>;
  framedFootageWindowPatterns?: Record<string, Record<string, unknown>>;
  lowerThirdTopicLabelPatterns?: Record<string, Record<string, unknown>>;
  circularNeonLogoFramePatterns?: Record<string, Record<string, unknown>>;
  waveAnnouncementBannerPatterns?: Record<string, Record<string, unknown>>;
  oneTakeLogoText?: Record<string, unknown>;
  location?: Record<string, { locationName?: string }>;
  mapLocationPoints?: Record<
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
