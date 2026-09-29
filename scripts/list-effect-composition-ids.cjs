const path = require("node:path");
const {capPattern, requirePatternKeys} = require("./lib/ts-config-ast.cjs");
const root = path.join(__dirname, "..");
const fixedIds = ["GlitchTransitionBridge", "InkRippleTransition", "RackFocusBokehTransition", "Burst", "ShatterCrackTransition", "ZoomBlurTransition"];
const families = [
  {idPrefix:"DistressTransition",file:"src/Effects/Transition/DistressTransition/distress-transition.schema.ts",exportName:"distressTransitionPatterns"},
  {idPrefix: "ScanEchoTransition", file: "src/Effects/Transition/ScanEchoTransition/scan-echo-transition.schema.ts", exportName: "scanEchoTransitionPatterns"},
  {idPrefix: "SignalSliceTransition", file: "src/Effects/Transition/SignalSliceTransition/signal-slice-transition.schema.ts", exportName: "signalSliceTransitionPatterns"},
  {idPrefix: "HologramFragmentTransition", file: "src/Effects/Transition/HologramFragmentTransition/hologram-fragment-transition.schema.ts", exportName: "hologramFragmentTransitionPatterns"},
  {idPrefix:"KaleidoscopeMirror",file:"src/Effects/Stylize/Mirror/kaleidoscope-mirror.schema.ts",exportName:"kaleidoscopeMirrorPatterns"},
  {idPrefix:"DelayTrail",file:"src/Effects/Stylize/Trail/delay-trail.schema.ts",exportName:"delayTrailPatterns"},
  {idPrefix:"",file:"src/Effects/Transition/ShaderEnergy/shader-energy-transition.schema.ts",exportName:"shaderEnergyTransitionPatterns",join:""},
  {idPrefix:"",file:"src/Effects/Overlay/ShaderSciFi/shader-sci-fi-overlay.schema.ts",exportName:"shaderSciFiOverlayPatterns",join:""},
  {idPrefix:"SuminagashiTransition",file:"src/Effects/Transition/SuminagashiTransition/suminagashi-transition.schema.ts",exportName:"suminagashiTransitionPatterns"},
  {idPrefix:"DryBrushTransition",file:"src/Effects/Transition/DryBrushTransition/dry-brush-transition.schema.ts",exportName:"dryBrushTransitionPatterns"},
  {idPrefix:"WaterRippleTransition",file:"src/Effects/Transition/WaterRippleTransition/water-ripple-transition.schema.ts",exportName:"waterRippleTransitionPatterns"},
  {idPrefix:"CodecCorruptTransition",file:"src/Effects/Transition/CodecCorruptTransition/codec-corrupt-transition.schema.ts",exportName:"codecCorruptTransitionPatterns"},
  {idPrefix:"PixelSortTransition",file:"src/Effects/Transition/PixelSortTransition/pixel-sort-transition.schema.ts",exportName:"pixelSortTransitionPatterns"},
  {idPrefix:"CrtPowerOffTransition",file:"src/Effects/Transition/CrtPowerOffTransition/crt-power-off-transition.schema.ts",exportName:"crtPowerOffTransitionPatterns"},
  {idPrefix:"InkBleedTransition",file:"src/Effects/Transition/InkBleedTransition/ink-bleed-transition.schema.ts",exportName:"inkBleedTransitionPatterns"},
  {idPrefix:"VolumetricSmokeTransition",file:"src/Effects/Transition/VolumetricSmokeTransition/volumetric-smoke-transition.schema.ts",exportName:"volumetricSmokeTransitionPatterns"},
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
const { paddedSuffix } = require("../src/composition/duration-variant-config.json");
function emit(id) {
  process.stdout.write(`${id}\n`);
  if (policies.some((p) => p.prefix ? id.startsWith(p.prefix) : p.ids.includes(id))) {
    process.stdout.write(`${id}${paddedSuffix}\n`);
  }
}
for (const id of fixedIds) emit(id);
for (const family of families) for (const key of requirePatternKeys(path.join(root, family.file), family.exportName)) emit(`${family.idPrefix}${family.join ?? "-"}${capPattern(key)}`);
