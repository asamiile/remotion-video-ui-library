/**
 * Re-reads composition-text on every compile so HMR picks up local.json changes.
 * root is pinned to the repo root (the parent of loaders/) so it doesn't go missing
 * when process.cwd() differs.
 */
const path = require("node:path");
const bundle = require("../scripts/composition-text-for-bundle.cjs");

module.exports = function injectCompositionTextLoader() {
  const done = this.async();
  const root = path.join(__dirname, "..");
  const examplePath = path.join(root, "config/local/composition-text.example.json");
  const localPath = path.join(root, "config/local/composition-text.local.json");
  this.addDependency(examplePath);
  this.addDependency(localPath);

  try {
    const { merged, locationCompositionKeys } =
      bundle.readCompositionTextForBundleFromRoot(root);

    const code =
      `export const __COMPOSITION_TEXT_INLINED__ = ${JSON.stringify(merged)};\n` +
      `export const __LOCATION_KEYS_INLINED__ = ${JSON.stringify(
        locationCompositionKeys,
      )};\n`;
    done(null, code);
  } catch (err) {
    done(err);
  }
};
