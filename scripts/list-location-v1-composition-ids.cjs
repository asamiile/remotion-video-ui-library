/**
 * Prints the list of location IDs to stdout, using the same rules as composition-text's locationV1.
 * Same source as getLocationV1CompositionKeysForBundle (composition-text-for-bundle.cjs).
 */
const path = require("node:path");
const bundle = require("./composition-text-for-bundle.cjs");

const root = path.join(__dirname, "..");
const { locationV1CompositionKeys } =
  bundle.readCompositionTextForBundleFromRoot(root);

for (const id of locationV1CompositionKeys) {
  process.stdout.write(`${id}\n`);
}
