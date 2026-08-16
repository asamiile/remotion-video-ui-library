// OneTake composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each schema.ts, the same approach as list-text-composition-ids.cjs.
// Onboarding and LogoText have no pattern family (single fixed compositions),
// so they're printed directly instead of read via AST.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const fixedIds = [
  "OneTake-OnboardingConnect",
  "OneTake-OnboardingOperate",
  "OneTake-OnboardingTest",
];

const families = [
  {
    idPrefix: "OneTake-Logo",
    file: "src/Logo/OneTake/OneTakeLogo/onetake-logo.schema.ts",
    exportName: "oneTakeLogoPatterns",
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

// OneTake-LogoText has no pattern family; print after Logo's enumerated IDs to
// match the order Root.tsx registers them in (Logo patterns, then LogoText).
process.stdout.write("OneTake-LogoText\n");
