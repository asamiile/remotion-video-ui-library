/**
 * example / local のマージ（remotion studio・bundle・inject loader と共通）
 * remotion.config / loaders から require する。
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const LEGACY_LOCATION_V1_ID_TO_SAMPLE_ID = {
  TenjinBrickCross: "SampleLocationA",
  OneFukuoka: "SampleLocationB",
  InabaConstruction: "SampleLocationC",
  TenjinBusinessCenter: "SampleLocationD",
  HurricSquare: "SampleLocationE",
  DaimyoGardenCity: "SampleLocationF",
};

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function deepMergeComposition(base, patch) {
  if (!patch || Object.keys(patch).length === 0) {
    return base;
  }
  const out = { ...base };
  for (const key of Object.keys(patch)) {
    const pv = patch[key];
    const bv = out[key];
    if (
      pv &&
      typeof pv === "object" &&
      !Array.isArray(pv) &&
      bv &&
      typeof bv === "object" &&
      !Array.isArray(bv)
    ) {
      out[key] = deepMergeComposition(bv, pv);
    } else if (pv !== undefined) {
      out[key] = pv;
    }
  }
  return out;
}

function hydrateLegacyMapPointsFromSampleIds(text) {
  const loc = text.locationV1 ?? {};
  const mapIn = text.mapLocationPointsV1 ?? {};
  const mapOut = { ...mapIn };

  for (const [legacyId, sampleId] of Object.entries(
    LEGACY_LOCATION_V1_ID_TO_SAMPLE_ID,
  )) {
    if (!(legacyId in loc)) {
      continue;
    }
    const sampleRow = mapIn[sampleId];
    if (
      !sampleRow ||
      typeof sampleRow.latitude !== "number" ||
      typeof sampleRow.longitude !== "number"
    ) {
      continue;
    }
    const legacyRow = mapOut[legacyId];
    if (!legacyRow) {
      mapOut[legacyId] = {
        name: loc[legacyId]?.locationName ?? sampleRow.name,
        latitude: sampleRow.latitude,
        longitude: sampleRow.longitude,
        zoom: sampleRow.zoom,
        pitch: sampleRow.pitch,
        bearing: sampleRow.bearing,
      };
    } else if (
      typeof legacyRow.latitude !== "number" ||
      typeof legacyRow.longitude !== "number"
    ) {
      mapOut[legacyId] = {
        ...legacyRow,
        latitude: sampleRow.latitude,
        longitude: sampleRow.longitude,
        zoom: sampleRow.zoom ?? legacyRow.zoom,
        pitch: sampleRow.pitch ?? legacyRow.pitch,
        bearing: sampleRow.bearing ?? legacyRow.bearing,
      };
    }
  }

  return { ...text, mapLocationPointsV1: mapOut };
}

function getLocationV1CompositionKeysForBundle(example, localOnly) {
  if (localOnly) {
    if (localOnly.locationV1 !== undefined) {
      return Object.keys(localOnly.locationV1);
    }
    return Object.keys(example.locationV1 ?? {});
  }
  return Object.keys(example.locationV1 ?? {});
}

/**
 * @param {string} root リポジトリルート（絶対パス）
 */
function readCompositionTextForBundleFromRoot(root) {
  const examplePath = path.join(
    root,
    "config/local/composition-text.example.json",
  );
  const localPath = path.join(root, "config/local/composition-text.local.json");
  const example = readJsonIfExists(examplePath) ?? {};
  const localOnly = readJsonIfExists(localPath);
  const merged = localOnly
    ? hydrateLegacyMapPointsFromSampleIds(
        deepMergeComposition(example, localOnly),
      )
    : example;
  return {
    merged,
    locationV1CompositionKeys: getLocationV1CompositionKeysForBundle(
      example,
      localOnly,
    ),
    examplePath,
    localPath,
  };
}

function readCompositionTextForBundle() {
  return readCompositionTextForBundleFromRoot(process.cwd());
}

module.exports = {
  readCompositionTextForBundle,
  readCompositionTextForBundleFromRoot,
  getLocationV1CompositionKeysForBundle,
  readJsonIfExists,
  deepMergeComposition,
};
