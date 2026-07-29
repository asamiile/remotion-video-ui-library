/**
 * Merges example / local composition text (shared by remotion studio, bundle, and the inject loader).
 * Required from remotion.config / loaders.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");


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


function getLocationCompositionKeysForBundle(example, localOnly) {
  if (localOnly) {
    if (localOnly.location !== undefined) {
      return Object.keys(localOnly.location);
    }
    return Object.keys(example.location ?? {});
  }
  return Object.keys(example.location ?? {});
}

/**
 * @param {string} root repository root (absolute path)
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
    ? deepMergeComposition(example, localOnly)
    : example;
  return {
    merged,
    locationCompositionKeys: getLocationCompositionKeysForBundle(
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
  getLocationCompositionKeysForBundle,
  readJsonIfExists,
  deepMergeComposition,
};
