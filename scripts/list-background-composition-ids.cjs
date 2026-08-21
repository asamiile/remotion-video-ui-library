// Background composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each *.schema.ts, the same approach as list-text-composition-ids.cjs.
// AmbientBlurOrbs has no pattern family (single fixed composition), so it's
// printed directly instead of read via AST.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const fixedIds = [
  "Background-AmbientBlurOrbs",
  "AngstAnimation",
  "AngstAnimationMultiShape",
];

const families = [
  {
    idPrefix: "RandomLinesBackground",
    file: "src/Background/RandomLinesBackground/random-lines.schema.ts",
    exportName: "randomLinesPatterns",
    preservePatternCase: true,
  },
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
  {
    idPrefix: "Background-StarfieldPlanetSilhouette",
    file: "src/Background/StarfieldPlanetSilhouette/starfield-planet-silhouette.schema.ts",
    exportName: "starfieldPlanetSilhouettePatterns",
  },
  {
    idPrefix: "Background-SilhouetteDreamBackdrop",
    file: "src/Background/SilhouetteDreamBackdrop/silhouette-dream-backdrop.schema.ts",
    exportName: "silhouetteDreamBackdropPatterns",
  },
  {
    idPrefix: "Background-CodeNoiseWall",
    file: "src/Background/CodeNoiseWall/code-noise-wall.schema.ts",
    exportName: "codeNoiseWallPatterns",
  },
  {
    idPrefix: "Background-ParticleTerrainMesh",
    file: "src/Background/ParticleTerrainMesh/particle-terrain-mesh.schema.ts",
    exportName: "particleTerrainMeshPatterns",
  },
  {
    idPrefix: "Background-InterlaceGlowBand",
    file: "src/Background/InterlaceGlowBand/interlace-glow-band.schema.ts",
    exportName: "interlaceGlowBandPatterns",
  },
  {
    idPrefix: "Background-WaveInterferenceLines",
    file: "src/Background/WaveInterferenceLines/wave-interference-lines.schema.ts",
    exportName: "waveInterferenceLinesPatterns",
  },
  {
    idPrefix: "Background-StripeWaveField",
    file: "src/Background/StripeWaveField/stripe-wave-field.schema.ts",
    exportName: "stripeWaveFieldPatterns",
  },
  {
    idPrefix: "Background-HalftoneWaveform",
    file: "src/Background/HalftoneWaveform/halftone-waveform.schema.ts",
    exportName: "halftoneWaveformPatterns",
  },
];

for (const id of fixedIds) {
  process.stdout.write(`${id}\n`);
}

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  for (const patternId of keys) {
    const id = fam.preservePatternCase ? patternId : capPattern(patternId);
    process.stdout.write(`${fam.idPrefix}-${id}\n`);
  }
}
