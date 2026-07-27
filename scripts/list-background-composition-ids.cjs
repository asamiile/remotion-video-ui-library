// Background composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each *-config.ts, the same approach as list-text-v1-composition-ids.cjs.
// AmbientBlurOrbsV1 has no pattern family (single fixed composition), so it's
// printed directly instead of read via AST.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const fixedIds = ["Background-AmbientBlurOrbsV1"];

const families = [
  {
    idPrefix: "Background-ScanLineV1",
    file: "src/Background/ScanLine-v1/scan-line-config.ts",
    exportName: "scanLineV1Patterns",
  },
  {
    idPrefix: "Background-DuotoneGradeOverlayV1",
    file: "src/Background/DuotoneGradeOverlay-v1/duotone-grade-overlay-config.ts",
    exportName: "duotoneGradeOverlayV1Patterns",
  },
  {
    idPrefix: "Background-FilmGrainOverlayV1",
    file: "src/Background/FilmGrainOverlay-v1/film-grain-overlay-config.ts",
    exportName: "filmGrainOverlayV1Patterns",
  },
  {
    idPrefix: "Background-LetterboxOverlayV1",
    file: "src/Background/LetterboxOverlay-v1/letterbox-overlay-config.ts",
    exportName: "letterboxOverlayV1Patterns",
  },
  {
    idPrefix: "Background-PosterizeGradeOverlayV1",
    file: "src/Background/PosterizeGradeOverlay-v1/posterize-grade-overlay-config.ts",
    exportName: "posterizeGradeOverlayV1Patterns",
  },
  {
    idPrefix: "Background-EmblemMontageBlurV1",
    file: "src/Background/EmblemMontageBlur-v1/emblem-montage-blur-config.ts",
    exportName: "emblemMontageBlurV1Patterns",
  },
  {
    idPrefix: "Background-SunsetLensFlareOverlayV1",
    file: "src/Background/SunsetLensFlareOverlay-v1/sunset-lens-flare-overlay-config.ts",
    exportName: "sunsetLensFlareOverlayV1Patterns",
  },
];

for (const id of fixedIds) {
  process.stdout.write(`${id}\n`);
}

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  for (const patternId of keys) {
    process.stdout.write(`${fam.idPrefix}-${capPattern(patternId)}\n`);
  }
}
