export const defaultPosterizeGradeOverlayV1Props = {
  washColor: "#b91c2c",
  washOpacity: 0.55,

  desaturateFirst: true,
  desaturateOpacity: 0.6,

  vignetteColor: "#000000",
  vignetteOpacity: 0,
};

export const posterizeGradeOverlayV1Patterns = {
  redFlat: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#c81e2c",
    washOpacity: 0.6,
    desaturateFirst: true,
    desaturateOpacity: 0.7,
  },

  beige: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#c9a876",
    washOpacity: 0.35,
    desaturateFirst: true,
    desaturateOpacity: 0.3,
  },

  navyRed: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#1c2a4a",
    washOpacity: 0.55,
    desaturateFirst: true,
    desaturateOpacity: 0.4,
    vignetteColor: "#8a1420",
    vignetteOpacity: 0.35,
  },

  teal: {
    ...defaultPosterizeGradeOverlayV1Props,
    washColor: "#1f6f6a",
    washOpacity: 0.5,
    desaturateFirst: true,
    desaturateOpacity: 0.4,
  },
};
