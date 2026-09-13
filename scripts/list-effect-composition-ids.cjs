const path = require("node:path");
const {capPattern, requirePatternKeys} = require("./lib/ts-config-ast.cjs");
const root = path.join(__dirname, "..");
const fixedIds = ["GlitchTransitionBridge", "InkRippleTransition", "RackFocusBokehTransition", "Burst", "ShatterCrackTransition", "ZoomBlurTransition"];
const families = [
  {idPrefix: "ScanEchoTransition", file: "src/Effects/Transition/ScanEchoTransition/scan-echo-transition.schema.ts", exportName: "scanEchoTransitionPatterns"},
  {idPrefix: "SignalSliceTransition", file: "src/Effects/Transition/SignalSliceTransition/signal-slice-transition.schema.ts", exportName: "signalSliceTransitionPatterns"},
  {idPrefix: "HologramFragmentTransition", file: "src/Effects/Transition/HologramFragmentTransition/hologram-fragment-transition.schema.ts", exportName: "hologramFragmentTransitionPatterns"},
  {idPrefix:"KaleidoscopeMirror",file:"src/Effects/Stylize/Mirror/kaleidoscope-mirror.schema.ts",exportName:"kaleidoscopeMirrorPatterns"},
  {idPrefix:"DelayTrail",file:"src/Effects/Stylize/Trail/delay-trail.schema.ts",exportName:"delayTrailPatterns"},
  {idPrefix:"BloomFlashTransition",file:"src/Effects/Transition/BloomFlashTransition/bloom-flash-transition.schema.ts",exportName:"bloomFlashTransitionPatterns"},
  {idPrefix:"",file:"src/Effects/Overlay/SciFi/sci-fi-overlay.schema.ts",exportName:"sciFiOverlayPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Overlay/TextlessSciFi/textless-sci-fi-overlay.schema.ts",exportName:"textlessSciFiOverlayPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Transition/GlitchSignal/glitch-signal-transitions.ts",exportName:"glitchSignalTransitionPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Transition/ScanControl/scan-control-transitions.ts",exportName:"scanControlTransitionPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Transition/HologramParticle/hologram-particle-transitions.ts",exportName:"hologramParticleTransitionPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Transition/OpticalEnergy/optical-energy-transitions.ts",exportName:"opticalEnergyTransitionPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Transition/SpatialWarp/spatial-warp-transitions.ts",exportName:"spatialWarpTransitionPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Transition/DataUI/data-ui-transitions.ts",exportName:"dataUiTransitionPatterns",join:""},
];
const policies = require("../src/composition/duration-variants.json");
function emit(id) {
  process.stdout.write(`${id}\n`);
  if (policies.some((p) => p.prefix ? id.startsWith(p.prefix) : p.ids.includes(id))) {
    process.stdout.write(`${id}-10s\n`);
  }
}
for (const id of fixedIds) emit(id);
for (const family of families) for (const key of requirePatternKeys(path.join(root, family.file), family.exportName)) emit(`${family.idPrefix}${family.join ?? "-"}${capPattern(key)}`);
