// Where renders are written, shared by render-all.cjs and drive-upload.cjs
// (render.sh resolves REMOTION_OUTPUT_DIR the same way).
//
// REMOTION_OUTPUT_DIR: absolute path, "~/..." or a path relative to the
// repository root. Unset: <repo>/out.
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");

function resolveOutputDir(value = process.env.REMOTION_OUTPUT_DIR) {
  if (!value) return path.join(root, "out");
  const expanded = value.replace(/^~(?=$|\/)/, os.homedir());
  return path.resolve(root, expanded);
}

module.exports = { root, outDir: resolveOutputDir(), resolveOutputDir };
