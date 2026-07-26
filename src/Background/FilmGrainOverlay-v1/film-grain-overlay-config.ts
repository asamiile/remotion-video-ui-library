export const defaultFilmGrainOverlayV1Props = {
  grainScale: 0.9,
  grainOpacity: 0.12,
  grainUpdateEveryFrames: 2,
  grainTintColor: "#7c86a8",

  scratchCount: 0,
  scratchOpacity: 0.35,
  scratchFlickerEveryFrames: 6,

  randomSeed: "film-grain-v1",
};

/**
 * Combines two techniques from the HUNTER×HUNTER volume 37/38 PV analysis
 * (video_analysis/) — "adding fine grain at a single climactic moment" (vol. 37)
 * and "layering film scratches / grain noise more heavily over flashback scenes"
 * (vol. 38) — into one template with two intensity presets.
 */
export const filmGrainOverlayV1Patterns = {
  /** Restrained grain for a single climactic moment (matches the vol. 37 PV) */
  subtle: {
    ...defaultFilmGrainOverlayV1Props,
    grainOpacity: 0.12,
    scratchCount: 0,
  },

  /** For flashback scenes: heavier grain plus film scratches (matches the vol. 38 PV) */
  heavyDegraded: {
    ...defaultFilmGrainOverlayV1Props,
    grainOpacity: 0.28,
    grainScale: 1.1,
    scratchCount: 6,
    scratchOpacity: 0.4,
  },
};
