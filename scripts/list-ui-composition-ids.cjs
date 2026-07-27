// UI composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each *-config.ts, the same approach as list-text-v1-composition-ids.cjs.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const families = [
  {
    idPrefix: "BattleCalloutBannerV1",
    file: "src/UI/BattleCalloutBanner/BattleCalloutBanner-v1/battle-callout-banner-config.ts",
    exportName: "battleCalloutBannerV1Patterns",
  },
  {
    idPrefix: "AsymmetricStatusPanelV1",
    file: "src/UI/AsymmetricStatusPanel/AsymmetricStatusPanel-v1/asymmetric-status-panel-config.ts",
    exportName: "asymmetricStatusPanelV1Patterns",
  },
];

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  for (const patternId of keys) {
    process.stdout.write(`${fam.idPrefix}-${capPattern(patternId)}\n`);
  }
}
