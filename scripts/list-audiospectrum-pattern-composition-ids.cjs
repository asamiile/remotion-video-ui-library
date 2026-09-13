/**
 * Prints the IDs of AudioSpectrum's preset patterns exactly as Root registers them.
 */
const path = require("node:path");
const { requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/Audio/AudioSpectrum/audio-spectrum.schema.ts",
);

const keys = requirePatternKeys(configPath, "audioSpectrumPatterns");
for (const patternId of keys) {
  process.stdout.write(`AudioSpectrum-${patternId}\n`);
}
