/**
 * composition-text の mapLocationPointsV1 のうち、緯度経度が揃っている地点だけを
 * stdout に出す。merge-composition-local.ts の buildMapLocationPointsFromCompositionKeys
 * と同じ絞り込み条件（composition-text-for-bundle.cjs の
 * hydrateLegacyMapPointsFromSampleIds 適用後の値に対して判定）。
 *
 * locationV1 に地点があっても、緯度経度が未設定の地点は Root.tsx に
 * MiniMapV1-<id> コンポジションが登録されない。list-location-v1-composition-ids.cjs
 * （Location用、locationV1の全件）とは対象が異なるため使い回さないこと。
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
