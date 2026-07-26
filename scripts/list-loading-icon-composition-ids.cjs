/**
 * Prints the LoadingIconV1-* composition IDs, matching what's registered in Root.tsx, to stdout.
 */
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/Loading/LoadingIcon-v1/loading-icon-config.ts",
);

const keys = requirePatternKeys(configPath, "loadingIconV1Patterns");
for (const patternId of keys) {
  process.stdout.write(`LoadingIconV1-${capPattern(patternId)}\n`);
}
