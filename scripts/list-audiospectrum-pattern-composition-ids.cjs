/**
 * AudioSpectrum のプリセットパターン（AudioSpectrumV1-Simple 等）の ID を stdout に出す。
 */
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/AudioSpectrum/AudioSpectrum-v1/audio-spectrum-config.ts",
);

const keys = requirePatternKeys(configPath, "audioSpectrumV1Patterns");
for (const patternId of keys) {
  process.stdout.write(`AudioSpectrumV1-${capPattern(patternId)}\n`);
}
