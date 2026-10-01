import { minimumCompositionFrames } from "./composition/composition-duration";
import { Composition, Folder } from "remotion";
import { AmbientBlurOrbsTemplate } from "./Background/AmbientBlurOrbs/AmbientBlurOrbsTemplate";
import { ambientBlurOrbsSchema } from "./Background/AmbientBlurOrbs/ambient-blur-orbs.schema";
import {
  defaultAmbientBlurOrbsProps,
  ambientBlurOrbsDurationFrames,
} from "./Background/AmbientBlurOrbs/ambient-blur-orbs.schema";
import { ScanLineTemplate } from "./Background/ScanLine/ScanLineTemplate";
import { scanLineSchema } from "./Background/ScanLine/scan-line.schema";
import { scanLinePatterns } from "./Background/ScanLine/scan-line.schema";
import { DuotoneGradeOverlayTemplate } from "./Background/DuotoneGradeOverlay/DuotoneGradeOverlayTemplate";
import { duotoneGradeOverlaySchema } from "./Background/DuotoneGradeOverlay/duotone-grade-overlay.schema";
import { duotoneGradeOverlayPatterns } from "./Background/DuotoneGradeOverlay/duotone-grade-overlay.schema";
import { FilmGrainOverlayTemplate } from "./Background/FilmGrainOverlay/FilmGrainOverlayTemplate";
import { filmGrainOverlaySchema } from "./Background/FilmGrainOverlay/film-grain-overlay.schema";
import { filmGrainOverlayPatterns } from "./Background/FilmGrainOverlay/film-grain-overlay.schema";
import { LetterboxOverlayTemplate } from "./Background/LetterboxOverlay/LetterboxOverlayTemplate";
import { letterboxOverlaySchema } from "./Background/LetterboxOverlay/letterbox-overlay.schema";
import { letterboxOverlayPatterns } from "./Background/LetterboxOverlay/letterbox-overlay.schema";
import { PosterizeGradeOverlayTemplate } from "./Background/PosterizeGradeOverlay/PosterizeGradeOverlayTemplate";
import { posterizeGradeOverlaySchema } from "./Background/PosterizeGradeOverlay/posterize-grade-overlay.schema";
import { posterizeGradeOverlayPatterns } from "./Background/PosterizeGradeOverlay/posterize-grade-overlay.schema";
import { EmblemMontageBlurTemplate } from "./Background/EmblemMontageBlur/EmblemMontageBlurTemplate";
import { emblemMontageBlurSchema } from "./Background/EmblemMontageBlur/emblem-montage-blur.schema";
import { emblemMontageBlurPatterns } from "./Background/EmblemMontageBlur/emblem-montage-blur.schema";
import { SunsetLensFlareOverlayTemplate } from "./Background/SunsetLensFlareOverlay/SunsetLensFlareOverlayTemplate";
import { sunsetLensFlareOverlaySchema } from "./Background/SunsetLensFlareOverlay/sunset-lens-flare-overlay.schema";
import { sunsetLensFlareOverlayPatterns } from "./Background/SunsetLensFlareOverlay/sunset-lens-flare-overlay.schema";
import { AgedParchmentOverlayTemplate } from "./Background/AgedParchmentOverlay/AgedParchmentOverlayTemplate";
import { agedParchmentOverlaySchema } from "./Background/AgedParchmentOverlay/aged-parchment-overlay.schema";
import { agedParchmentOverlayPatterns } from "./Background/AgedParchmentOverlay/aged-parchment-overlay.schema";
import { StarfieldPlanetSilhouetteTemplate } from "./Background/StarfieldPlanetSilhouette/StarfieldPlanetSilhouetteTemplate";
import { starfieldPlanetSilhouetteSchema } from "./Background/StarfieldPlanetSilhouette/starfield-planet-silhouette.schema";
import { starfieldPlanetSilhouettePatterns } from "./Background/StarfieldPlanetSilhouette/starfield-planet-silhouette.schema";
import { SilhouetteDreamBackdropTemplate } from "./Background/SilhouetteDreamBackdrop/SilhouetteDreamBackdropTemplate";
import { silhouetteDreamBackdropSchema } from "./Background/SilhouetteDreamBackdrop/silhouette-dream-backdrop.schema";
import { silhouetteDreamBackdropPatterns } from "./Background/SilhouetteDreamBackdrop/silhouette-dream-backdrop.schema";
import { CodeNoiseWallTemplate } from "./Background/CodeNoiseWall/CodeNoiseWallTemplate";
import { codeNoiseWallSchema } from "./Background/CodeNoiseWall/code-noise-wall.schema";
import { codeNoiseWallPatterns } from "./Background/CodeNoiseWall/code-noise-wall.schema";
import { ParticleTerrainMeshTemplate } from "./Background/ParticleTerrainMesh/ParticleTerrainMeshTemplate";
import { particleTerrainMeshSchema } from "./Background/ParticleTerrainMesh/particle-terrain-mesh.schema";
import { particleTerrainMeshPatterns } from "./Background/ParticleTerrainMesh/particle-terrain-mesh.schema";
import { InterlaceGlowBandTemplate } from "./Background/InterlaceGlowBand/InterlaceGlowBandTemplate";
import { interlaceGlowBandSchema } from "./Background/InterlaceGlowBand/interlace-glow-band.schema";
import { interlaceGlowBandPatterns } from "./Background/InterlaceGlowBand/interlace-glow-band.schema";
import { WaveInterferenceLinesTemplate } from "./Background/WaveInterferenceLines/WaveInterferenceLinesTemplate";
import { waveInterferenceLinesSchema } from "./Background/WaveInterferenceLines/wave-interference-lines.schema";
import { waveInterferenceLinesPatterns } from "./Background/WaveInterferenceLines/wave-interference-lines.schema";
import { StripeWaveFieldTemplate } from "./Background/StripeWaveField/StripeWaveFieldTemplate";
import { stripeWaveFieldSchema } from "./Background/StripeWaveField/stripe-wave-field.schema";
import { stripeWaveFieldPatterns } from "./Background/StripeWaveField/stripe-wave-field.schema";
import { HalftoneWaveformTemplate } from "./Background/HalftoneWaveform/HalftoneWaveformTemplate";
import { halftoneWaveformSchema } from "./Background/HalftoneWaveform/halftone-waveform.schema";
import { halftoneWaveformPatterns } from "./Background/HalftoneWaveform/halftone-waveform.schema";
import { HolographicDepthGridTemplate } from "./Background/HolographicDepthGrid/HolographicDepthGridTemplate";
import { holographicDepthGridDurationFrames, holographicDepthGridPatterns, holographicDepthGridSchema } from "./Background/HolographicDepthGrid/holographic-depth-grid.schema";
import { SignalInterferenceOverlayTemplate } from "./Background/SignalInterferenceOverlay/SignalInterferenceOverlayTemplate";
import { signalInterferenceOverlayDurationFrames, signalInterferenceOverlayPatterns, signalInterferenceOverlaySchema } from "./Background/SignalInterferenceOverlay/signal-interference-overlay.schema";
import {WireframeBuildTemplate} from "./Background/WireframeBuild/WireframeBuildTemplate";
import {wireframeBuildDurationFrames,wireframeBuildPatterns,wireframeBuildSchema} from "./Background/WireframeBuild/wireframe-build.schema";
import {DigitalFogTemplate} from "./Background/DigitalFog/DigitalFogTemplate";
import {TvStaticTemplate} from "./Background/TvStatic/TvStaticTemplate";
import {tvStaticDurationFrames,tvStaticPatterns,tvStaticSchema} from "./Background/TvStatic/tv-static.schema";
import {AuroraTemplate} from "./Background/Aurora/AuroraTemplate";
import {auroraDurationFrames,auroraPatterns,auroraSchema} from "./Background/Aurora/aurora.schema";
import {MarbleFlowTemplate} from "./Background/MarbleFlow/MarbleFlowTemplate";
import {marbleFlowDurationFrames,marbleFlowPatterns,marbleFlowSchema} from "./Background/MarbleFlow/marble-flow.schema";
import {FireFlamesTemplate} from "./Background/FireFlames/FireFlamesTemplate";
import {fireFlamesDurationFrames,fireFlamesPatterns,fireFlamesSchema} from "./Background/FireFlames/fire-flames.schema";
import {CausticsTemplate} from "./Background/Caustics/CausticsTemplate";
import {causticsDurationFrames,causticsPatterns,causticsSchema} from "./Background/Caustics/caustics.schema";
import {NebulaTemplate} from "./Background/Nebula/NebulaTemplate";
import {nebulaDurationFrames,nebulaPatterns,nebulaSchema} from "./Background/Nebula/nebula.schema";
import {GradientTemplate} from "./Background/Gradient/GradientTemplate";
import {GeometricTemplate} from "./Background/Geometric/GeometricTemplate";
import {geometricDurationFrames,geometricFloatPatterns,geometricFramePatterns,geometricGridPatterns,geometricMemphisPatterns,geometricOrbitPatterns,geometricSchema,geometricStripePatterns} from "./Background/Geometric/geometric.schema";
import {gradientDurationFrames,gradientLinearPatterns,gradientMarblePatterns,gradientMeshPatterns,gradientSchema,gradientScoopPatterns,gradientWavesPatterns} from "./Background/Gradient/gradient.schema";
import {RippleRingsTemplate} from "./Background/RippleRings/RippleRingsTemplate";
import {rippleRingsDurationFrames,rippleRingsPatterns,rippleRingsSchema} from "./Background/RippleRings/ripple-rings.schema";
import {SpeedLinesTemplate} from "./Background/SpeedLines/SpeedLinesTemplate";
import {speedLinesDurationFrames,speedLinesPatterns,speedLinesSchema} from "./Background/SpeedLines/speed-lines.schema";
import {SynthGridTemplate} from "./Background/SynthGrid/SynthGridTemplate";
import {synthGridDurationFrames,synthGridPatterns,synthGridSchema} from "./Background/SynthGrid/synth-grid.schema";
import {HalftoneDotsTemplate} from "./Background/HalftoneDots/HalftoneDotsTemplate";
import {halftoneDotsDurationFrames,halftoneDotsPatterns,halftoneDotsSchema} from "./Background/HalftoneDots/halftone-dots.schema";
import {StarfieldTemplate} from "./Background/Starfield/StarfieldTemplate";
import {starfieldDurationFrames,starfieldPatterns,starfieldSchema} from "./Background/Starfield/starfield.schema";
import {KaleidoscopeTemplate} from "./Background/Kaleidoscope/KaleidoscopeTemplate";
import {kaleidoscopeDurationFrames,kaleidoscopePatterns,kaleidoscopeSchema} from "./Background/Kaleidoscope/kaleidoscope.schema";
import {VoronoiCellsTemplate} from "./Background/VoronoiCells/VoronoiCellsTemplate";
import {voronoiCellsDurationFrames,voronoiCellsPatterns,voronoiCellsSchema} from "./Background/VoronoiCells/voronoi-cells.schema";
import {DigitalFogShaderTemplate} from "./Background/DigitalFogShader/DigitalFogShaderTemplate";
import {digitalFogShaderDurationFrames,digitalFogShaderPatterns,digitalFogShaderSchema} from "./Background/DigitalFogShader/digital-fog-shader.schema";
import {VolumetricSmokeTemplate} from "./Background/VolumetricSmoke/VolumetricSmokeTemplate";
import {volumetricSmokeDurationFrames,volumetricSmokePatterns,volumetricSmokeSchema} from "./Background/VolumetricSmoke/volumetric-smoke.schema";
import {digitalFogDurationFrames,digitalFogPatterns,digitalFogSchema} from "./Background/DigitalFog/digital-fog.schema";
import { RandomLinesBackground } from "./Background/RandomLinesBackground/RandomLinesBackground";
import { randomLinesSchema } from "./Background/RandomLinesBackground/random-lines.schema";
import { randomLinesDurationFrames } from "./Background/RandomLinesBackground/random-lines.schema";
import { AngstAnimationTemplate } from "./Background/AngstAnimation/AngstAnimationTemplate";
import { angstAnimationSchema, defaultAngstAnimationProps } from "./Background/AngstAnimation/angst-animation.schema";
import { AngstAnimationMultiShapeTemplate } from "./Background/AngstAnimation/AngstAnimationMultiShapeTemplate";
import { angstAnimationMultiShapeSchema, defaultAngstAnimationMultiShapeProps } from "./Background/AngstAnimation/angst-animation-multi-shape.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import { mergedRandomLinesPatterns } from "./composition/composition-merged-background";

const FPS = 30;

export function BackgroundFolder() {
  return (
    <Folder name="Background">
      <Composition
        id="Background-AmbientBlurOrbs"
        component={withCanvasPreview(
          "Background-AmbientBlurOrbs",
          AmbientBlurOrbsTemplate,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={minimumCompositionFrames(ambientBlurOrbsDurationFrames, FPS)}
        schema={ambientBlurOrbsSchema}
        defaultProps={{ ...defaultAmbientBlurOrbsProps }}
      />

      <Folder name="RandomLines">
        {Object.entries(mergedRandomLinesPatterns).map(
          ([patternName, props]) => (
            <Composition
              key={`RandomLinesBackground-${patternName}`}
              id={`RandomLinesBackground-${patternName}`}
              component={withCanvasPreview(
                `RandomLinesBackground-${patternName}`,
                RandomLinesBackground
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={minimumCompositionFrames(randomLinesDurationFrames, FPS)}
              schema={randomLinesSchema}
              defaultProps={props}
            />
          )
        )}
      </Folder>

      <Folder name="ScanLine">
        {renderPatternFamily({
          patterns: scanLinePatterns,
          idPrefix: "Background-ScanLine-",
          Template: ScanLineTemplate,
          schema: scanLineSchema,
          durationInFrames: (patternProps) => patternProps.scanPeriodFrames,
        })}
      </Folder>

      <Folder name="DuotoneGradeOverlay">
        {renderPatternFamily({
          patterns: duotoneGradeOverlayPatterns,
          idPrefix: "Background-DuotoneGradeOverlay-",
          Template: DuotoneGradeOverlayTemplate,
          schema: duotoneGradeOverlaySchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="FilmGrainOverlay">
        {renderPatternFamily({
          patterns: filmGrainOverlayPatterns,
          idPrefix: "Background-FilmGrainOverlay-",
          Template: FilmGrainOverlayTemplate,
          schema: filmGrainOverlaySchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="LetterboxOverlay">
        {renderPatternFamily({
          patterns: letterboxOverlayPatterns,
          idPrefix: "Background-LetterboxOverlay-",
          Template: LetterboxOverlayTemplate,
          schema: letterboxOverlaySchema,
          durationInFrames: 90,
        })}
      </Folder>

      <Folder name="PosterizeGradeOverlay">
        {renderPatternFamily({
          patterns: posterizeGradeOverlayPatterns,
          idPrefix: "Background-PosterizeGradeOverlay-",
          Template: PosterizeGradeOverlayTemplate,
          schema: posterizeGradeOverlaySchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="EmblemMontageBlur">
        {renderPatternFamily({
          patterns: emblemMontageBlurPatterns,
          idPrefix: "Background-EmblemMontageBlur-",
          Template: EmblemMontageBlurTemplate,
          schema: emblemMontageBlurSchema,
          durationInFrames: 60,
        })}
      </Folder>

      <Folder name="SunsetLensFlareOverlay">
        {renderPatternFamily({
          patterns: sunsetLensFlareOverlayPatterns,
          idPrefix: "Background-SunsetLensFlareOverlay-",
          Template: SunsetLensFlareOverlayTemplate,
          schema: sunsetLensFlareOverlaySchema,
          durationInFrames: 60,
        })}
      </Folder>

      <Folder name="AgedParchmentOverlay">
        {renderPatternFamily({
          patterns: agedParchmentOverlayPatterns,
          idPrefix: "Background-AgedParchmentOverlay-",
          Template: AgedParchmentOverlayTemplate,
          schema: agedParchmentOverlaySchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="StarfieldPlanetSilhouette">
        {renderPatternFamily({
          patterns: starfieldPlanetSilhouettePatterns,
          idPrefix: "Background-StarfieldPlanetSilhouette-",
          Template: StarfieldPlanetSilhouetteTemplate,
          schema: starfieldPlanetSilhouetteSchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="SilhouetteDreamBackdrop">
        {renderPatternFamily({
          patterns: silhouetteDreamBackdropPatterns,
          idPrefix: "Background-SilhouetteDreamBackdrop-",
          Template: SilhouetteDreamBackdropTemplate,
          schema: silhouetteDreamBackdropSchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="CodeNoiseWall">
        {renderPatternFamily({
          patterns: codeNoiseWallPatterns,
          idPrefix: "Background-CodeNoiseWall-",
          Template: CodeNoiseWallTemplate,
          schema: codeNoiseWallSchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="ParticleTerrainMesh">
        {renderPatternFamily({
          patterns: particleTerrainMeshPatterns,
          idPrefix: "Background-ParticleTerrainMesh-",
          Template: ParticleTerrainMeshTemplate,
          schema: particleTerrainMeshSchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="InterlaceGlowBand">
        {renderPatternFamily({
          patterns: interlaceGlowBandPatterns,
          idPrefix: "Background-InterlaceGlowBand-",
          Template: InterlaceGlowBandTemplate,
          schema: interlaceGlowBandSchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="WaveInterferenceLines">
        {renderPatternFamily({
          patterns: waveInterferenceLinesPatterns,
          idPrefix: "Background-WaveInterferenceLines-",
          Template: WaveInterferenceLinesTemplate,
          schema: waveInterferenceLinesSchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="StripeWaveField">
        {renderPatternFamily({
          patterns: stripeWaveFieldPatterns,
          idPrefix: "Background-StripeWaveField-",
          Template: StripeWaveFieldTemplate,
          schema: stripeWaveFieldSchema,
          durationInFrames: 200,
        })}
      </Folder>

      <Folder name="HalftoneWaveform">
        {renderPatternFamily({
          patterns: halftoneWaveformPatterns,
          idPrefix: "Background-HalftoneWaveform-",
          Template: HalftoneWaveformTemplate,
          schema: halftoneWaveformSchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="HolographicDepthGrid">
        {renderPatternFamily({patterns: holographicDepthGridPatterns, idPrefix: "Background-HolographicDepthGrid-", Template: HolographicDepthGridTemplate, schema: holographicDepthGridSchema, durationInFrames: holographicDepthGridDurationFrames})}
      </Folder>

      <Folder name="SignalInterferenceOverlay">
        {renderPatternFamily({patterns: signalInterferenceOverlayPatterns, idPrefix: "Background-SignalInterferenceOverlay-", Template: SignalInterferenceOverlayTemplate, schema: signalInterferenceOverlaySchema, durationInFrames: signalInterferenceOverlayDurationFrames})}
      </Folder>
      <Folder name="WireframeBuild">{renderPatternFamily({patterns:wireframeBuildPatterns,idPrefix:"Background-WireframeBuild-",Template:WireframeBuildTemplate,schema:wireframeBuildSchema,durationInFrames:wireframeBuildDurationFrames})}</Folder>
      <Folder name="DigitalFog">{renderPatternFamily({patterns:digitalFogPatterns,idPrefix:"Background-DigitalFog-",Template:DigitalFogTemplate,schema:digitalFogSchema,durationInFrames:digitalFogDurationFrames})}</Folder>
      <Folder name="TvStatic">{renderPatternFamily({patterns:tvStaticPatterns,idPrefix:"Background-TvStatic-",Template:TvStaticTemplate,schema:tvStaticSchema,durationInFrames:tvStaticDurationFrames})}</Folder>
      <Folder name="Aurora">{renderPatternFamily({patterns:auroraPatterns,idPrefix:"Background-Aurora-",Template:AuroraTemplate,schema:auroraSchema,durationInFrames:auroraDurationFrames})}</Folder>
      <Folder name="MarbleFlow">{renderPatternFamily({patterns:marbleFlowPatterns,idPrefix:"Background-MarbleFlow-",Template:MarbleFlowTemplate,schema:marbleFlowSchema,durationInFrames:marbleFlowDurationFrames})}</Folder>
      <Folder name="FireFlames">{renderPatternFamily({patterns:fireFlamesPatterns,idPrefix:"Background-FireFlames-",Template:FireFlamesTemplate,schema:fireFlamesSchema,durationInFrames:fireFlamesDurationFrames})}</Folder>
      <Folder name="Caustics">{renderPatternFamily({patterns:causticsPatterns,idPrefix:"Background-Caustics-",Template:CausticsTemplate,schema:causticsSchema,durationInFrames:causticsDurationFrames})}</Folder>
      <Folder name="Nebula">{renderPatternFamily({patterns:nebulaPatterns,idPrefix:"Background-Nebula-",Template:NebulaTemplate,schema:nebulaSchema,durationInFrames:nebulaDurationFrames})}</Folder>
      <Folder name="Geometric">
        <Folder name="Frame">{renderPatternFamily({patterns:geometricFramePatterns,idPrefix:"Background-Geometric-",Template:GeometricTemplate,schema:geometricSchema,durationInFrames:geometricDurationFrames})}</Folder>
        <Folder name="Orbit">{renderPatternFamily({patterns:geometricOrbitPatterns,idPrefix:"Background-Geometric-",Template:GeometricTemplate,schema:geometricSchema,durationInFrames:geometricDurationFrames})}</Folder>
        <Folder name="Grid">{renderPatternFamily({patterns:geometricGridPatterns,idPrefix:"Background-Geometric-",Template:GeometricTemplate,schema:geometricSchema,durationInFrames:geometricDurationFrames})}</Folder>
        <Folder name="Float">{renderPatternFamily({patterns:geometricFloatPatterns,idPrefix:"Background-Geometric-",Template:GeometricTemplate,schema:geometricSchema,durationInFrames:geometricDurationFrames})}</Folder>
        <Folder name="Stripe">{renderPatternFamily({patterns:geometricStripePatterns,idPrefix:"Background-Geometric-",Template:GeometricTemplate,schema:geometricSchema,durationInFrames:geometricDurationFrames})}</Folder>
        <Folder name="Memphis">{renderPatternFamily({patterns:geometricMemphisPatterns,idPrefix:"Background-Geometric-",Template:GeometricTemplate,schema:geometricSchema,durationInFrames:geometricDurationFrames})}</Folder>
      </Folder>
      <Folder name="Gradient">
        <Folder name="Waves">{renderPatternFamily({patterns:gradientWavesPatterns,idPrefix:"Background-Gradient-",Template:GradientTemplate,schema:gradientSchema,durationInFrames:gradientDurationFrames})}</Folder>
        <Folder name="Mesh">{renderPatternFamily({patterns:gradientMeshPatterns,idPrefix:"Background-Gradient-",Template:GradientTemplate,schema:gradientSchema,durationInFrames:gradientDurationFrames})}</Folder>
        <Folder name="Linear">{renderPatternFamily({patterns:gradientLinearPatterns,idPrefix:"Background-Gradient-",Template:GradientTemplate,schema:gradientSchema,durationInFrames:gradientDurationFrames})}</Folder>
        <Folder name="Marble">{renderPatternFamily({patterns:gradientMarblePatterns,idPrefix:"Background-Gradient-",Template:GradientTemplate,schema:gradientSchema,durationInFrames:gradientDurationFrames})}</Folder>
        <Folder name="Scoop">{renderPatternFamily({patterns:gradientScoopPatterns,idPrefix:"Background-Gradient-",Template:GradientTemplate,schema:gradientSchema,durationInFrames:gradientDurationFrames})}</Folder>
      </Folder>
      <Folder name="RippleRings">{renderPatternFamily({patterns:rippleRingsPatterns,idPrefix:"Background-RippleRings-",Template:RippleRingsTemplate,schema:rippleRingsSchema,durationInFrames:rippleRingsDurationFrames})}</Folder>
      <Folder name="SpeedLines">{renderPatternFamily({patterns:speedLinesPatterns,idPrefix:"Background-SpeedLines-",Template:SpeedLinesTemplate,schema:speedLinesSchema,durationInFrames:speedLinesDurationFrames})}</Folder>
      <Folder name="SynthGrid">{renderPatternFamily({patterns:synthGridPatterns,idPrefix:"Background-SynthGrid-",Template:SynthGridTemplate,schema:synthGridSchema,durationInFrames:synthGridDurationFrames})}</Folder>
      <Folder name="HalftoneDots">{renderPatternFamily({patterns:halftoneDotsPatterns,idPrefix:"Background-HalftoneDots-",Template:HalftoneDotsTemplate,schema:halftoneDotsSchema,durationInFrames:halftoneDotsDurationFrames})}</Folder>
      <Folder name="Starfield">{renderPatternFamily({patterns:starfieldPatterns,idPrefix:"Background-Starfield-",Template:StarfieldTemplate,schema:starfieldSchema,durationInFrames:starfieldDurationFrames})}</Folder>
      <Folder name="Kaleidoscope">{renderPatternFamily({patterns:kaleidoscopePatterns,idPrefix:"Background-Kaleidoscope-",Template:KaleidoscopeTemplate,schema:kaleidoscopeSchema,durationInFrames:kaleidoscopeDurationFrames})}</Folder>
      <Folder name="VoronoiCells">{renderPatternFamily({patterns:voronoiCellsPatterns,idPrefix:"Background-VoronoiCells-",Template:VoronoiCellsTemplate,schema:voronoiCellsSchema,durationInFrames:voronoiCellsDurationFrames})}</Folder>
      <Folder name="DigitalFogShader">{renderPatternFamily({patterns:digitalFogShaderPatterns,idPrefix:"Background-DigitalFogShader-",Template:DigitalFogShaderTemplate,schema:digitalFogShaderSchema,durationInFrames:digitalFogShaderDurationFrames})}</Folder>
      <Folder name="VolumetricSmoke">{renderPatternFamily({patterns:volumetricSmokePatterns,idPrefix:"Background-VolumetricSmoke-",Template:VolumetricSmokeTemplate,schema:volumetricSmokeSchema,durationInFrames:volumetricSmokeDurationFrames})}</Folder>

      <Folder name="AngstAnimation">
        <Composition
          id="AngstAnimation"
          component={withCanvasPreview(
            "AngstAnimation",
            AngstAnimationTemplate,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={minimumCompositionFrames(900, FPS)}
          schema={angstAnimationSchema}
          defaultProps={defaultAngstAnimationProps}
        />
        <Composition
          id="AngstAnimationMultiShape"
          component={withCanvasPreview(
            "AngstAnimationMultiShape",
            AngstAnimationMultiShapeTemplate,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={minimumCompositionFrames(900, FPS)}
          schema={angstAnimationMultiShapeSchema}
          defaultProps={defaultAngstAnimationMultiShapeProps}
        />
      </Folder>
    </Folder>
  );
}
