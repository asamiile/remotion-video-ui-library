/**
 * Prints to stdout only the locations in composition-text's mapLocationPointsV1 that have
 * both latitude and longitude set. Same filtering condition as
 * buildMapLocationPointsFromCompositionKeys in merge-composition-local.ts (evaluated against
 * the value after composition-text-for-bundle.cjs's hydrateLegacyMapPointsFromSampleIds runs).
 *
 * A location can exist in locationV1 without a MiniMapV1-<id> composition being registered
 * in Root.tsx if lat/lng aren't set. This targets a different set than
 * list-location-v1-composition-ids.cjs (all of locationV1, for Location) — don't reuse one for the other.
 */
const path = require("node:path");
const bundle = require("./composition-text-for-bundle.cjs");

const root = path.join(__dirname, "..");
const { merged, locationV1CompositionKeys } =
  bundle.readCompositionTextForBundleFromRoot(root);

const mapBlock = merged.mapLocationPointsV1 ?? {};

for (const id of locationV1CompositionKeys) {
  const row = mapBlock[id];
  if (!row || typeof row.latitude !== "number" || typeof row.longitude !== "number") {
    continue;
  }
  process.stdout.write(`${id}\n`);
}
