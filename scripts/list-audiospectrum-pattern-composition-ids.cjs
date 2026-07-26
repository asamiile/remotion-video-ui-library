/**
 * Prints the IDs of AudioSpectrum's preset patterns (AudioSpectrumV1-Simple, etc.) to stdout.
 */
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/Audio/AudioSpectrum-v1/audio-spectrum-config.ts",
);

const keys = requirePatternKeys(configPath, "audioSpectrumV1Patterns");
for (const patternId of keys) {
  process.stdout.write(`AudioSpectrumV1-${capPattern(patternId)}\n`);
}
