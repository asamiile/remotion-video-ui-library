/**
 * 各コンパイルのたびに composition-text を読み直し、HMR で local.json 変更を反映する。
 */
const path = require("node:path");
const bundle = require("../scripts/composition-text-for-bundle.cjs");

module.exports = function injectCompositionTextLoader() {
  const done = this.async();
  const root = process.cwd();
  const examplePath = path.join(
    root,
    "config/local/composition-text.example.json",
  );
  const localPath = path.join(root, "config/local/composition-text.local.json");
  this.addDependency(examplePath);
  this.addDependency(localPath);

  try {
    const { merged, locationV1CompositionKeys } =
      bundle.readCompositionTextForBundle();
    const code =
      `export const __COMPOSITION_TEXT_INLINED__ = ${JSON.stringify(merged)};\n` +
      `export const __LOCATION_V1_KEYS_INLINED__ = ${JSON.stringify(
        locationV1CompositionKeys,
      )};\n`;
    done(null, code);
  } catch (err) {
    done(err);
  }
};
