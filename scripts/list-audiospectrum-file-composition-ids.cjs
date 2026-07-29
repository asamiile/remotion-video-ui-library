/**
 * Prints a composition ID for each id in audioSpectrumAudioFiles (audio-spectrum.schema.ts).
 * (Matches Root's AudioSpectrum-${audioFile.id})
 */
const path = require("node:path");
const { requireArrayStringIds } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/Audio/AudioSpectrum/audio-spectrum.schema.ts",
);

const ids = requireArrayStringIds(configPath, "audioSpectrumAudioFiles");
for (const id of ids) {
  process.stdout.write(`AudioSpectrum-${id}\n`);
}
