// Background composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each *.schema.ts, the same approach as list-text-composition-ids.cjs.
// AmbientBlurOrbs has no pattern family (single fixed composition), so it's
// printed directly instead of read via AST.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const fixedIds = ["Background-AmbientBlurOrbs"];

const families = [
  {
    idPrefix: "Background-ScanLine",
    file: "src/Background/ScanLine/scan-line.schema.ts",
    exportName: "scanLinePatterns",
  },
  {
    idPrefix: "Background-DuotoneGradeOverlay",
    file: "src/Background/DuotoneGradeOverlay/duotone-grade-overlay.schema.ts",
    exportName: "duotoneGradeOverlayPatterns",
  },
  {
    idPrefix: "Background-FilmGrainOverlay",
    file: "src/Background/FilmGrainOverlay/film-grain-overlay.schema.ts",
    exportName: "filmGrainOverlayPatterns",
  },
  {
    idPrefix: "Background-LetterboxOverlay",
    file: "src/Background/LetterboxOverlay/letterbox-overlay.schema.ts",
    exportName: "letterboxOverlayPatterns",
  },
  {
    idPrefix: "Background-PosterizeGradeOverlay",
    file: "src/Background/PosterizeGradeOverlay/posterize-grade-overlay.schema.ts",
    exportName: "posterizeGradeOverlayPatterns",
  },
  {
    idPrefix: "Background-EmblemMontageBlur",
    file: "src/Background/EmblemMontageBlur/emblem-montage-blur.schema.ts",
    exportName: "emblemMontageBlurPatterns",
  },
  {
    idPrefix: "Background-SunsetLensFlareOverlay",
    file: "src/Background/SunsetLensFlareOverlay/sunset-lens-flare-overlay.schema.ts",
    exportName: "sunsetLensFlareOverlayPatterns",
  },
  {
    idPrefix: "Background-AgedParchmentOverlay",
    file: "src/Background/AgedParchmentOverlay/aged-parchment-overlay.schema.ts",
    exportName: "agedParchmentOverlayPatterns",
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
