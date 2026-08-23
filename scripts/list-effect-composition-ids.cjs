const path = require("node:path");
const {capPattern, requirePatternKeys} = require("./lib/ts-config-ast.cjs");
const root = path.join(__dirname, "..");
const fixedIds = ["GlitchTransitionBridge", "InkRippleTransition", "RackFocusBokehTransition", "Burst", "ShatterCrackTransition", "ZoomBlurTransition"];
const families = [
  {idPrefix: "SignalSliceTransition", file: "src/Effects/SignalSliceTransition/signal-slice-transition.schema.ts", exportName: "signalSliceTransitionPatterns"},
  {idPrefix: "HologramFragmentTransition", file: "src/Effects/HologramFragmentTransition/hologram-fragment-transition.schema.ts", exportName: "hologramFragmentTransitionPatterns"},
  {idPrefix:"KaleidoscopeMirror",file:"src/Effects/KaleidoscopeMirror/kaleidoscope-mirror.schema.ts",exportName:"kaleidoscopeMirrorPatterns"},
  {idPrefix:"DelayTrail",file:"src/Effects/DelayTrail/delay-trail.schema.ts",exportName:"delayTrailPatterns"},
  {idPrefix:"BloomFlashTransition",file:"src/Effects/BloomFlashTransition/bloom-flash-transition.schema.ts",exportName:"bloomFlashTransitionPatterns"},
];
for (const id of fixedIds) process.stdout.write(`${id}\n`);
for (const family of families) for (const key of requirePatternKeys(path.join(root, family.file), family.exportName)) process.stdout.write(`${family.idPrefix}-${capPattern(key)}\n`);
