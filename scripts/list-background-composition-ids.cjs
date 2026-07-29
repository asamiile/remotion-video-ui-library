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
    file: "src/Background/ScanLine/scan-line.schema.ts",
    exportName: "scanLinePatterns",
  },
  {
    idPrefix: "Background-DuotoneGradeOverlayV1",
    file: "src/Background/DuotoneGradeOverlay/duotone-grade-overlay.schema.ts",
    exportName: "duotoneGradeOverlayPatterns",
  },
  {
    idPrefix: "Background-FilmGrainOverlayV1",
    file: "src/Background/FilmGrainOverlay/film-grain-overlay.schema.ts",
    exportName: "filmGrainOverlayPatterns",
  },
  {
    idPrefix: "Background-LetterboxOverlayV1",
    file: "src/Background/LetterboxOverlay/letterbox-overlay.schema.ts",
    exportName: "letterboxOverlayPatterns",
  },
  {
    idPrefix: "Background-PosterizeGradeOverlayV1",
    file: "src/Background/PosterizeGradeOverlay/posterize-grade-overlay.schema.ts",
    exportName: "posterizeGradeOverlayPatterns",
  },
  {
    idPrefix: "Background-EmblemMontageBlurV1",
    file: "src/Background/EmblemMontageBlur/emblem-montage-blur.schema.ts",
    exportName: "emblemMontageBlurPatterns",
  },
  {
    idPrefix: "Background-SunsetLensFlareOverlayV1",
    file: "src/Background/SunsetLensFlareOverlay/sunset-lens-flare-overlay.schema.ts",
    exportName: "sunsetLensFlareOverlayPatterns",
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
