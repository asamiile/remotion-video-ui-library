/**
 * composition-text の locationV1 と同じルールで地点 ID 一覧を stdout に出す。
 * remotion.config.ts の getLocationV1CompositionKeysForBundle と揃える。
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const examplePath = path.join(
  root,
  "config/local/composition-text.example.json",
);
const localPath = path.join(root, "config/local/composition-text.local.json");

const example = readJsonIfExists(examplePath) ?? {};
const localOnly = readJsonIfExists(localPath);

let keys;
if (localOnly) {
  if (localOnly.locationV1 !== undefined) {
    keys = Object.keys(localOnly.locationV1);
  } else {
    keys = Object.keys(example.locationV1 ?? {});
  }
} else {
  keys = Object.keys(example.locationV1 ?? {});
}

for (const id of keys) {
  process.stdout.write(`${id}\n`);
}
