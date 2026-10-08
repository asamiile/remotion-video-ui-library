// Background composition IDs (uses the same capPattern as Root.tsx). Enumerated
// from each *.schema.ts, the same approach as list-text-composition-ids.cjs.
// AmbientBlurOrbs has no pattern family (single fixed composition), so it's
// printed directly instead of read via AST.
const path = require("node:path");
const { capPattern, requirePatternKeys } = require("./lib/ts-config-ast.cjs");

const root = path.join(__dirname, "..");

const fixedIds = [
  "Background-AmbientBlurOrbs",
  "AngstAnimation",
  "AngstAnimationMultiShape",
];

const families = [
  {
    idPrefix: "RandomLinesBackground",
    file: "src/Background/RandomLinesBackground/random-lines.schema.ts",
    exportName: "randomLinesPatterns",
    preservePatternCase: true,
  },
  {
    idPrefix: "Background-ScanLine",
    file: "src/Background/ScanLine/scan-line.schema.ts",
    exportName: "scanLinePatterns",
  },
  {
    idPrefix: "Background-DuotoneGradeOverlay",
    file: "src/Background/DuotoneGradeOverlay/duotone-grade-overlay.schema.ts",
    exportName: "duotoneGradeOverlayPatterns",
  },
  {
    idPrefix: "Background-FilmGrainOverlay",
    file: "src/Background/FilmGrainOverlay/film-grain-overlay.schema.ts",
    exportName: "filmGrainOverlayPatterns",
  },
  {
    idPrefix: "Background-LetterboxOverlay",
    file: "src/Background/LetterboxOverlay/letterbox-overlay.schema.ts",
    exportName: "letterboxOverlayPatterns",
  },
  {
    idPrefix: "Background-PosterizeGradeOverlay",
    file: "src/Background/PosterizeGradeOverlay/posterize-grade-overlay.schema.ts",
    exportName: "posterizeGradeOverlayPatterns",
  },
  {
    idPrefix: "Background-EmblemMontageBlur",
    file: "src/Background/EmblemMontageBlur/emblem-montage-blur.schema.ts",
    exportName: "emblemMontageBlurPatterns",
  },
  {
    idPrefix: "Background-SunsetLensFlareOverlay",
    file: "src/Background/SunsetLensFlareOverlay/sunset-lens-flare-overlay.schema.ts",
    exportName: "sunsetLensFlareOverlayPatterns",
  },
  {
    idPrefix: "Background-AgedParchmentOverlay",
    file: "src/Background/AgedParchmentOverlay/aged-parchment-overlay.schema.ts",
    exportName: "agedParchmentOverlayPatterns",
  },
  {
    idPrefix: "Background-StarfieldPlanetSilhouette",
    file: "src/Background/StarfieldPlanetSilhouette/starfield-planet-silhouette.schema.ts",
    exportName: "starfieldPlanetSilhouettePatterns",
  },
  {
    idPrefix: "Background-SilhouetteDreamBackdrop",
    file: "src/Background/SilhouetteDreamBackdrop/silhouette-dream-backdrop.schema.ts",
    exportName: "silhouetteDreamBackdropPatterns",
  },
  {
    idPrefix: "Background-CodeNoiseWall",
    file: "src/Background/CodeNoiseWall/code-noise-wall.schema.ts",
    exportName: "codeNoiseWallPatterns",
  },
  {
    idPrefix: "Background-ParticleTerrainMesh",
    file: "src/Background/ParticleTerrainMesh/particle-terrain-mesh.schema.ts",
    exportName: "particleTerrainMeshPatterns",
  },
  {
    idPrefix: "Background-InterlaceGlowBand",
    file: "src/Background/InterlaceGlowBand/interlace-glow-band.schema.ts",
    exportName: "interlaceGlowBandPatterns",
  },
  {
    idPrefix: "Background-WaveInterferenceLines",
    file: "src/Background/WaveInterferenceLines/wave-interference-lines.schema.ts",
    exportName: "waveInterferenceLinesPatterns",
  },
  {
    idPrefix: "Background-StripeWaveField",
    file: "src/Background/StripeWaveField/stripe-wave-field.schema.ts",
    exportName: "stripeWaveFieldPatterns",
  },
  {
    idPrefix: "Background-HalftoneWaveform",
    file: "src/Background/HalftoneWaveform/halftone-waveform.schema.ts",
    exportName: "halftoneWaveformPatterns",
  },
  {idPrefix: "Background-HolographicDepthGrid", file: "src/Background/HolographicDepthGrid/holographic-depth-grid.schema.ts", exportName: "holographicDepthGridPatterns"},
  {idPrefix: "Background-SignalInterferenceOverlay", file: "src/Background/SignalInterferenceOverlay/signal-interference-overlay.schema.ts", exportName: "signalInterferenceOverlayPatterns"},
  {idPrefix:"Background-WireframeBuild",file:"src/Background/WireframeBuild/wireframe-build.schema.ts",exportName:"wireframeBuildPatterns"},
  {idPrefix:"Background-DigitalFog",file:"src/Background/DigitalFog/digital-fog.schema.ts",exportName:"digitalFogPatterns"},
  {idPrefix:"Background-TvStatic",file:"src/Background/TvStatic/tv-static.schema.ts",exportName:"tvStaticPatterns"},
  {idPrefix:"Background-Aurora",file:"src/Background/Aurora/aurora.schema.ts",exportName:"auroraPatterns"},
  {idPrefix:"Background-MarbleFlow",file:"src/Background/MarbleFlow/marble-flow.schema.ts",exportName:"marbleFlowPatterns"},
  {idPrefix:"Background-FireFlames",file:"src/Background/FireFlames/fire-flames.schema.ts",exportName:"fireFlamesPatterns"},
  {idPrefix:"Background-Caustics",file:"src/Background/Caustics/caustics.schema.ts",exportName:"causticsPatterns"},
  {idPrefix:"Background-Nebula",file:"src/Background/Nebula/nebula.schema.ts",exportName:"nebulaPatterns"},
  {idPrefix:"Background-Gradient",file:"src/Background/Gradient/gradient.schema.ts",exportName:"gradientWavesPatterns"},
  {idPrefix:"Background-Geometric",file:"src/Background/Geometric/geometric.schema.ts",exportName:"geometricFramePatterns"},
  {idPrefix:"Background-Geometric",file:"src/Background/Geometric/geometric.schema.ts",exportName:"geometricOrbitPatterns"},
  {idPrefix:"Background-Geometric",file:"src/Background/Geometric/geometric.schema.ts",exportName:"geometricGridPatterns"},
  {idPrefix:"Background-Geometric",file:"src/Background/Geometric/geometric.schema.ts",exportName:"geometricFloatPatterns"},
  {idPrefix:"Background-Geometric",file:"src/Background/Geometric/geometric.schema.ts",exportName:"geometricStripePatterns"},
  {idPrefix:"Background-Geometric",file:"src/Background/Geometric/geometric.schema.ts",exportName:"geometricMemphisPatterns"},
  {idPrefix:"Background-Gradient",file:"src/Background/Gradient/gradient.schema.ts",exportName:"gradientMeshPatterns"},
  {idPrefix:"Background-Gradient",file:"src/Background/Gradient/gradient.schema.ts",exportName:"gradientLinearPatterns"},
  {idPrefix:"Background-Gradient",file:"src/Background/Gradient/gradient.schema.ts",exportName:"gradientMarblePatterns"},
  {idPrefix:"Background-Gradient",file:"src/Background/Gradient/gradient.schema.ts",exportName:"gradientScoopPatterns"},
  {idPrefix:"Background-RippleRings",file:"src/Background/RippleRings/ripple-rings.schema.ts",exportName:"rippleRingsPatterns"},
  {idPrefix:"Background-SpeedLines",file:"src/Background/SpeedLines/speed-lines.schema.ts",exportName:"speedLinesPatterns"},
  {idPrefix:"Background-SynthGrid",file:"src/Background/SynthGrid/synth-grid.schema.ts",exportName:"synthGridPatterns"},
  {idPrefix:"Background-HalftoneDots",file:"src/Background/HalftoneDots/halftone-dots.schema.ts",exportName:"halftoneDotsPatterns"},
  {idPrefix:"Background-HalftoneOverlay",file:"src/Background/HalftoneOverlay/halftone-overlay.schema.ts",exportName:"halftoneOverlayPatterns"},
  {idPrefix:"Background-GrungeOverlay",file:"src/Background/GrungeOverlay/grunge-overlay.schema.ts",exportName:"grungeOverlayPatterns"},
  {idPrefix:"Background-GrungeSurface",file:"src/Background/GrungeSurface/grunge-surface.schema.ts",exportName:"grungeSurfacePatterns"},
  {idPrefix:"Background-SprayTexture",file:"src/Background/SprayTexture/spray-texture.schema.ts",exportName:"sprayTexturePatterns"},
  {idPrefix:"Background-InkTexture",file:"src/Background/InkTexture/ink-texture.schema.ts",exportName:"inkTexturePatterns"},
  {idPrefix:"Background-HazeBloomLeak",file:"src/Background/HazeBloomLeak/haze-bloom-leak.schema.ts",exportName:"hazeBloomLeakPatterns"},
  {idPrefix:"Background-HazeBloomLeak",file:"src/Background/HazeBloomLeak/haze-bloom-leak.schema.ts",exportName:"hazeBloomLeakVerticalPatterns"},
  {idPrefix:"Background-DubEchoTrails",file:"src/Background/DubEchoTrails/dub-echo-trails.schema.ts",exportName:"dubEchoTrailsPatterns"},
  {idPrefix:"Background-DubEchoTrails",file:"src/Background/DubEchoTrails/dub-echo-trails.schema.ts",exportName:"dubEchoTrailsVerticalPatterns"},
  {idPrefix:"Background-SpectralLines",file:"src/Background/SpectralLines/spectral-lines.schema.ts",exportName:"spectralLinesPatterns"},
  {idPrefix:"Background-SpectralLines",file:"src/Background/SpectralLines/spectral-lines.schema.ts",exportName:"spectralLinesVerticalPatterns"},
  {idPrefix:"Background-LaserBeams",file:"src/Background/LaserBeams/laser-beams.schema.ts",exportName:"laserBeamsPatterns"},
  {idPrefix:"Background-LaserBeams",file:"src/Background/LaserBeams/laser-beams.schema.ts",exportName:"laserBeamsVerticalPatterns"},
  {idPrefix:"Background-Starfield",file:"src/Background/Starfield/starfield.schema.ts",exportName:"starfieldPatterns"},
  {idPrefix:"Background-Kaleidoscope",file:"src/Background/Kaleidoscope/kaleidoscope.schema.ts",exportName:"kaleidoscopePatterns"},
  {idPrefix:"Background-VoronoiCells",file:"src/Background/VoronoiCells/voronoi-cells.schema.ts",exportName:"voronoiCellsPatterns"},
  {idPrefix:"Background-DigitalFogShader",file:"src/Background/DigitalFogShader/digital-fog-shader.schema.ts",exportName:"digitalFogShaderPatterns"},
  {idPrefix:"Background-VolumetricSmoke",file:"src/Background/VolumetricSmoke/volumetric-smoke.schema.ts",exportName:"volumetricSmokePatterns"},
  {
    idPrefix: "Background-LidarPointCloud",
    file: "src/Background/LidarPointCloud/lidar-point-cloud.schema.ts",
    exportName: "lidarPointCloudPatterns",
  },
  {
    idPrefix: "Background-SceneUnderstanding",
    file: "src/Background/SceneUnderstanding/scene-understanding.schema.ts",
    exportName: "sceneUnderstandingPatterns",
  },
  {
    idPrefix: "Background-OpticalFlow",
    file: "src/Background/OpticalFlow/optical-flow.schema.ts",
    exportName: "opticalFlowPatterns",
  },
  {
    idPrefix: "Background-ThermalDrone",
    file: "src/Background/ThermalDrone/thermal-drone.schema.ts",
    exportName: "thermalDronePatterns",
  },
  {
    idPrefix: "Background-PoseEstimation",
    file: "src/Background/PoseEstimation/pose-estimation.schema.ts",
    exportName: "poseEstimationPatterns",
  },
];

for (const id of fixedIds) {
  process.stdout.write(`${id}\n`);
}

for (const fam of families) {
  const full = path.join(root, fam.file);
  const keys = requirePatternKeys(full, fam.exportName);
  for (const patternId of keys) {
    const id = fam.preservePatternCase ? patternId : capPattern(patternId);
    process.stdout.write(`${fam.idPrefix}-${id}\n`);
  }
}
