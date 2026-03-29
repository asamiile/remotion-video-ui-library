/**
 * audio-spectrum-config.ts の audioSpectrumAudioFilesV1 にある id ごとのコンポジション ID を出す。
 * （Root の AudioSpectrumV1-${audioFile.id} と一致）
 */
const path = require("node:path");
const { requireArrayStringIds } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");
const configPath = path.join(
  root,
  "src/AudioSpectrum/AudioSpectrum-v1/audio-spectrum-config.ts",
);

const ids = requireArrayStringIds(configPath, "audioSpectrumAudioFilesV1");
for (const id of ids) {
  process.stdout.write(`AudioSpectrumV1-${id}\n`);
}
