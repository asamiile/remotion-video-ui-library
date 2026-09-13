// Check the canonical presets and documented overrides without launching Chromium.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const { requirePatternKeys } = require("./lib/ts-config-ast.cjs");
const root = path.resolve(__dirname, "..");
const file = path.join(
  root,
  "src/Effects/Transition/ScanEchoTransition/scan-echo-transition.schema.ts",
);
const loaded = new Module(file, module);
loaded.filename = file;
loaded.paths = Module._nodeModulePaths(path.dirname(file));
loaded._compile(
  ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  file,
);
const {
  scanEchoTransitionSchema: schema,
  scanEchoTransitionPatterns: patterns,
  defaultScanEchoTransitionProps: defaults,
} = loaded.exports;
const samples = JSON.parse(
  fs.readFileSync(
    path.join(root, "config/local/composition-text.example.json"),
    "utf8",
  ),
).scanEchoTransitionPatterns;
assert.deepEqual(schema.parse({}), defaults, "Schema defaults have drifted");
assert.deepEqual(
  Object.keys(patterns).sort(),
  Object.keys(samples).sort(),
  "Example preset keys have drifted",
);
assert.deepEqual(
  requirePatternKeys(file, "scanEchoTransitionPatterns").sort(),
  Object.keys(patterns).sort(),
  "Render enumeration cannot read every preset",
);
const modes = new Set();
const trails = new Set();
const cutStyles = new Set();
for (const [id, props] of Object.entries(patterns)) {
  schema.parse(props);
  assert.deepEqual(
    { ...props, ...samples[id] },
    props,
    `Example does not match canonical preset: ${id}`,
  );
  modes.add(props.mode);
  trails.add(props.trailPattern);
  cutStyles.add(props.cutStyle);
}
assert.deepEqual(
  [...modes].sort(),
  [...schema.shape.mode.unwrap().options].sort(),
  "A mode has no preset",
);
assert.deepEqual(
  [...trails].sort(),
  [...schema.shape.trailPattern.unwrap().options].sort(),
  "A trail pattern has no preset",
);
assert.deepEqual(
  [...cutStyles].sort(),
  [...schema.shape.cutStyle.unwrap().options].sort(),
  "A cut style has no preset",
);
console.log(
  `Validated ${Object.keys(patterns).length} presets, ${modes.size} modes, ${trails.size} trail patterns, ${cutStyles.size} cut styles, and example overrides`,
);
