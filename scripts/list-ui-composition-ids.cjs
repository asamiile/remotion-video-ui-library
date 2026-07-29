// UI composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each .schema.ts, the same approach as list-text-composition-ids.cjs.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const families = [
  {
    idPrefix: "BattleCalloutBanner",
    file: "src/UI/BattleCalloutBanner/battle-callout-banner.schema.ts",
    exportName: "battleCalloutBannerPatterns",
  },
  {
    idPrefix: "AsymmetricStatusPanel",
    file: "src/UI/AsymmetricStatusPanel/asymmetric-status-panel.schema.ts",
    exportName: "asymmetricStatusPanelPatterns",
  },
];

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  for (const patternId of keys) {
    process.stdout.write(`${fam.idPrefix}-${capPattern(patternId)}\n`);
  }
}
