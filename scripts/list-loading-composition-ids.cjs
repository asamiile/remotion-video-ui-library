// Non-LoadingIcon Loading composition IDs (uses the same capPattern as Root.tsx).
// Enumerated from each .schema.ts, the same approach as list-ui-composition-ids.cjs.
// LoadingIcon itself is enumerated separately by list-loading-icon-composition-ids.cjs.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const families = [
  {
    idPrefix: "DotsLoader",
    file: "src/Loading/DotsLoader/dots-loader.schema.ts",
    exportName: "dotsLoaderPatterns",
  },
  {
    idPrefix: "ProgressBar",
    file: "src/Loading/ProgressBar/progress-bar.schema.ts",
    exportName: "progressBarPatterns",
  },
  {
    idPrefix: "PulseCircle",
    file: "src/Loading/PulseCircle/pulse-circle.schema.ts",
    exportName: "pulseCirclePatterns",
  },
  {
    idPrefix: "SkeletonScreen",
    file: "src/Loading/SkeletonScreen/skeleton-screen.schema.ts",
    exportName: "skeletonScreenPatterns",
  },
  {
    idPrefix: "RadialSpinner",
    file: "src/Loading/RadialSpinner/radial-spinner.schema.ts",
    exportName: "radialSpinnerPatterns",
  },
  {
    idPrefix: "RadialGlowSpinner",
    file: "src/Loading/RadialGlowSpinner/radial-glow-spinner.schema.ts",
    exportName: "radialGlowSpinnerPatterns",
  },
];

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  for (const patternId of keys) {
    process.stdout.write(`${fam.idPrefix}-${capPattern(patternId)}\n`);
  }
}
