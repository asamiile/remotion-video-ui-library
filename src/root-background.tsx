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
const adobeStockOverlayDurationFrames = 600;
const adobeStockDurationFrames =
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1" ? 1800 : 150;

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
        durationInFrames={ambientBlurOrbsDurationFrames}
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
              durationInFrames={randomLinesDurationFrames}
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
          durationInFrames: (patternProps) =>
            process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
              ? adobeStockOverlayDurationFrames
              : patternProps.scanPeriodFrames,
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
          durationInFrames: adobeStockDurationFrames,
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
          durationInFrames: adobeStockDurationFrames,
        })}
      </Folder>

      <Folder name="ParticleTerrainMesh">
        {renderPatternFamily({
          patterns: particleTerrainMeshPatterns,
          idPrefix: "Background-ParticleTerrainMesh-",
          Template: ParticleTerrainMeshTemplate,
          schema: particleTerrainMeshSchema,
          durationInFrames: adobeStockDurationFrames,
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
          durationInFrames={900}
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
          durationInFrames={900}
          schema={angstAnimationMultiShapeSchema}
          defaultProps={defaultAngstAnimationMultiShapeProps}
        />
      </Folder>
    </Folder>
  );
}
