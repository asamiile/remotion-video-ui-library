/**
 * composition-text の locationV1 と同じルールで地点 ID 一覧を stdout に出す。
 * getLocationV1CompositionKeysForBundle と同一ソース（composition-text-for-bundle.cjs）。
 */
const path = require("node:path");
const bundle = require("./composition-text-for-bundle.cjs");

const root = path.join(__dirname, "..");
const { locationV1CompositionKeys } =
  bundle.readCompositionTextForBundleFromRoot(root);

for (const id of locationV1CompositionKeys) {
  process.stdout.write(`${id}\n`);
}
