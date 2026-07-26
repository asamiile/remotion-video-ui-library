// OneTake composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each *-config.ts, the same approach as list-text-v1-composition-ids.cjs.
// Onboarding and LogoText have no pattern family (single fixed compositions),
// so they're printed directly instead of read via AST.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const fixedIds = [
  "OneTake-OnboardingConnectV1",
  "OneTake-OnboardingOperateV1",
];

const families = [
  {
    idPrefix: "OneTake-LogoV1",
    file: "src/OneTake/Logo/OneTakeLogo-v1/onetake-logo-config.ts",
    exportName: "oneTakeLogoV1Patterns",
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

// OneTake-LogoTextV1 has no pattern family; print after Logo's enumerated IDs to
// match the order Root.tsx registers them in (Logo patterns, then LogoText).
process.stdout.write("OneTake-LogoTextV1\n");
