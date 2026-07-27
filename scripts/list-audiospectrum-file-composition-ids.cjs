/**
 * Prints a composition ID for each id in audioSpectrumAudioFilesV1 (audio-spectrum-config.ts).
 * (Matches Root's AudioSpectrumV1-${audioFile.id})
 */
const path = require("node:path");
const { requireArrayStringIds } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/Audio/AudioSpectrum-v1/audio-spectrum-config.ts",
);

const ids = requireArrayStringIds(configPath, "audioSpectrumAudioFilesV1");
for (const id of ids) {
  process.stdout.write(`AudioSpectrumV1-${id}\n`);
}
