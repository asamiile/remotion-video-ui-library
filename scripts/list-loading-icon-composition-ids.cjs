/**
 * Prints the LoadingIcon-* composition IDs, matching what's registered in Root.tsx, to stdout.
 */
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/Loading/LoadingIcon/loading-icon.schema.ts",
);

const keys = requirePatternKeys(configPath, "loadingIconPatterns");
for (const patternId of keys) {
  process.stdout.write(`LoadingIcon-${capPattern(patternId)}\n`);
}
