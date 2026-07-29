/**
 * Prints the list of location IDs to stdout, using the same rules as composition-text's location.
 * Same source as getLocationCompositionKeysForBundle (composition-text-for-bundle.cjs).
 */
const path = require("node:path");
const bundle = require("./composition-text-for-bundle.cjs");

const root = path.join(__dirname, "..");
const { locationCompositionKeys } =
  bundle.readCompositionTextForBundleFromRoot(root);

for (const id of locationCompositionKeys) {
  process.stdout.write(`${id}\n`);
}
