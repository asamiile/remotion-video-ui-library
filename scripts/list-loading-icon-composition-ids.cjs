/**
 * Root.tsx と同じ LoadingIconV1-* のコンポジション ID を stdout に出す。
 */
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/LoadingIcon/LoadingIcon-v1/loading-icon-config.ts",
);

const keys = requirePatternKeys(configPath, "loadingIconV1Patterns");
for (const patternId of keys) {
  process.stdout.write(`LoadingIconV1-${capPattern(patternId)}\n`);
}
