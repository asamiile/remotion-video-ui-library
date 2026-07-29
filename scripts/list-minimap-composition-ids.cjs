/**
 * Prints to stdout only the locations in composition-text's mapLocationPoints that have
 * both latitude and longitude set. Same filtering condition as
 * buildMapLocationPointsFromCompositionKeys in merge-composition-local.ts.
 *
 * A location can exist in location without a MiniMap-<id> composition being registered
 * in Root.tsx if lat/lng aren't set. This targets a different set than
 * list-location-composition-ids.cjs (all of location, for Location) — don't reuse one for the other.
 */
const path = require("node:path");
const bundle = require("./composition-text-for-bundle.cjs");

const root = path.join(__dirname, "..");
const { merged, locationCompositionKeys } =
  bundle.readCompositionTextForBundleFromRoot(root);

const mapBlock = merged.mapLocationPoints ?? {};

for (const id of locationCompositionKeys) {
  const row = mapBlock[id];
  if (!row || typeof row.latitude !== "number" || typeof row.longitude !== "number") {
    continue;
  }
  process.stdout.write(`${id}\n`);
}
