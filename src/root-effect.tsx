import { ObjectDetectionOverlayTemplate } from "./Effects/Overlay/ObjectDetectionOverlay/ObjectDetectionOverlayTemplate";
import { objectDetectionOverlayDurationFrames, objectDetectionOverlayPatterns, objectDetectionOverlaySchema } from "./Effects/Overlay/ObjectDetectionOverlay/object-detection-overlay.schema";
import { CompositionGuideTemplate } from "./Effects/Overlay/CompositionGuide/CompositionGuideTemplate";
import { compositionGuideDurationFrames, compositionGuidePatterns, compositionGuideSchema } from "./Effects/Overlay/CompositionGuide/composition-guide.schema";
import { FootagePassTemplate } from "./Effects/Stylize/FootagePass/FootagePassTemplate";
import { footagePassDurationFrames, footagePassPatterns, footagePassSchema } from "./Effects/Stylize/FootagePass/footage-pass.schema";
import { DistressTransitionTemplate } from "./Effects/Transition/DistressTransition/DistressTransitionTemplate";
import { distressTransitionSchema } from "./Effects/Transition/DistressTransition/distress-transition.schema";
import { mergedDistressTransitionPatterns } from "./composition/composition-merged-other";
import { renderDurationVariantCompositions } from "./helpers/duration-variant-compositions";
import { minimumCompositionFrames } from "./composition/composition-duration";
import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplate } from "./Effects/Transition/GlitchTransitionBridge/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchema } from "./Effects/Transition/GlitchTransitionBridge/glitch-transition-bridge.schema";
import {
  defaultGlitchTransitionBridgeProps,
  glitchTransitionBridgeDurationFrames,
} from "./Effects/Transition/GlitchTransitionBridge/glitch-transition-bridge.schema";
import { InkRippleTransitionTemplate } from "./Effects/Transition/InkRippleTransition/InkRippleTransitionTemplate";
import { inkRippleTransitionSchema } from "./Effects/Transition/InkRippleTransition/ink-ripple-transition.schema";
import {
  defaultInkRippleTransitionProps,
  inkRippleTransitionDurationFrames,
} from "./Effects/Transition/InkRippleTransition/ink-ripple-transition.schema";
import { RackFocusBokehTransitionTemplate } from "./Effects/Transition/RackFocusBokehTransition/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchema } from "./Effects/Transition/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import {
  defaultRackFocusBokehTransitionProps,
  rackFocusBokehTransitionDurationFrames,
} from "./Effects/Transition/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import { BurstTemplate } from "./Effects/Stylize/Burst/BurstTemplate";
import { burstSchema } from "./Effects/Stylize/Burst/burst.schema";
import {
  defaultBurstProps,
  burstDurationFrames,
} from "./Effects/Stylize/Burst/burst.schema";
import { ShatterCrackTransitionTemplate } from "./Effects/Transition/ShatterCrackTransition/ShatterCrackTransitionTemplate";
import { shatterCrackTransitionSchema } from "./Effects/Transition/ShatterCrackTransition/shatter-crack-transition.schema";
import {
  defaultShatterCrackTransitionProps,
  shatterCrackTransitionDurationFrames,
} from "./Effects/Transition/ShatterCrackTransition/shatter-crack-transition.schema";
import { ZoomBlurTransitionTemplate } from "./Effects/Transition/ZoomBlurTransition/ZoomBlurTransitionTemplate";
import { zoomBlurTransitionSchema } from "./Effects/Transition/ZoomBlurTransition/zoom-blur-transition.schema";
import { ShaderEnergyTransitionTemplate } from "./Effects/Transition/ShaderEnergy/ShaderEnergyTransitionTemplate";
import {
  shaderEnergyTransitionDurationFrames,
  shaderEnergyTransitionPatterns,
  shaderEnergyTransitionSchema,
} from "./Effects/Transition/ShaderEnergy/shader-energy-transition.schema";
import { ShaderSciFiOverlayTemplate } from "./Effects/Overlay/ShaderSciFi/ShaderSciFiOverlayTemplate";
import {
  shaderSciFiOverlayDurationFrames,
  shaderSciFiOverlayPatterns,
  shaderSciFiOverlaySchema,
} from "./Effects/Overlay/ShaderSciFi/shader-sci-fi-overlay.schema";
import { SuminagashiTransitionTemplate } from "./Effects/Transition/SuminagashiTransition/SuminagashiTransitionTemplate";
import {
  suminagashiTransitionAnimationDurationFrames,
  suminagashiTransitionPatterns,
  suminagashiTransitionSchema,
} from "./Effects/Transition/SuminagashiTransition/suminagashi-transition.schema";
import { DryBrushTransitionTemplate } from "./Effects/Transition/DryBrushTransition/DryBrushTransitionTemplate";
import { TornPaperTransitionTemplate } from "./Effects/Transition/TornPaperTransition/TornPaperTransitionTemplate";
import { GrungeTransitionTemplate } from "./Effects/Transition/GrungeTransition/GrungeTransitionTemplate";
import {
  grungeTransitionAnimationDurationFrames,
  grungeTransitionPatterns,
  grungeTransitionSchema,
} from "./Effects/Transition/GrungeTransition/grunge-transition.schema";
import {
  tornPaperTransitionAnimationDurationFrames,
  tornPaperTransitionPatterns,
  tornPaperTransitionSchema,
} from "./Effects/Transition/TornPaperTransition/torn-paper-transition.schema";
import {
  dryBrushTransitionAnimationDurationFrames,
  dryBrushTransitionPatterns,
  dryBrushTransitionSchema,
} from "./Effects/Transition/DryBrushTransition/dry-brush-transition.schema";
import { WaterRippleTransitionTemplate } from "./Effects/Transition/WaterRippleTransition/WaterRippleTransitionTemplate";
import {
  waterRippleTransitionAnimationDurationFrames,
  waterRippleTransitionPatterns,
  waterRippleTransitionSchema,
} from "./Effects/Transition/WaterRippleTransition/water-ripple-transition.schema";
import { CodecCorruptTransitionTemplate } from "./Effects/Transition/CodecCorruptTransition/CodecCorruptTransitionTemplate";
import {
  codecCorruptTransitionAnimationDurationFrames,
  codecCorruptTransitionPatterns,
  codecCorruptTransitionSchema,
} from "./Effects/Transition/CodecCorruptTransition/codec-corrupt-transition.schema";
import { PixelSortTransitionTemplate } from "./Effects/Transition/PixelSortTransition/PixelSortTransitionTemplate";
import {
  pixelSortTransitionAnimationDurationFrames,
  pixelSortTransitionPatterns,
  pixelSortTransitionSchema,
} from "./Effects/Transition/PixelSortTransition/pixel-sort-transition.schema";
import { CrtPowerOffTransitionTemplate } from "./Effects/Transition/CrtPowerOffTransition/CrtPowerOffTransitionTemplate";
import {
  crtPowerOffTransitionAnimationDurationFrames,
  crtPowerOffTransitionPatterns,
  crtPowerOffTransitionSchema,
} from "./Effects/Transition/CrtPowerOffTransition/crt-power-off-transition.schema";
import { InkBleedTransitionTemplate } from "./Effects/Transition/InkBleedTransition/InkBleedTransitionTemplate";
import {
  inkBleedTransitionAnimationDurationFrames,
  inkBleedTransitionPatterns,
  inkBleedTransitionSchema,
} from "./Effects/Transition/InkBleedTransition/ink-bleed-transition.schema";
import { VolumetricSmokeTransitionTemplate } from "./Effects/Transition/VolumetricSmokeTransition/VolumetricSmokeTransitionTemplate";
import {
  volumetricSmokeTransitionAnimationDurationFrames,
  volumetricSmokeTransitionPatterns,
  volumetricSmokeTransitionSchema,
} from "./Effects/Transition/VolumetricSmokeTransition/volumetric-smoke-transition.schema";
import {
  defaultZoomBlurTransitionProps,
  zoomBlurTransitionAnimationDurationFrames,
} from "./Effects/Transition/ZoomBlurTransition/zoom-blur-transition.schema";
import {
  renderPatternFamily,
  withCanvasPreview,
} from "./helpers/composition-helpers";
import { SignalSliceTransitionTemplate } from "./Effects/Transition/SignalSliceTransition/SignalSliceTransitionTemplate";
import {
  signalSliceTransitionDurationFrames,
  signalSliceTransitionPatterns,
  signalSliceTransitionSchema,
} from "./Effects/Transition/SignalSliceTransition/signal-slice-transition.schema";
import { HologramFragmentTransitionTemplate } from "./Effects/Transition/HologramFragmentTransition/HologramFragmentTransitionTemplate";
import {
  hologramFragmentTransitionAnimationDurationFrames,
  hologramFragmentTransitionPatterns,
  hologramFragmentTransitionSchema,
} from "./Effects/Transition/HologramFragmentTransition/hologram-fragment-transition.schema";
import { KaleidoscopeMirrorTemplate } from "./Effects/Stylize/Mirror/KaleidoscopeMirrorTemplate";
import {
  kaleidoscopeMirrorDurationFrames,
  kaleidoscopeMirrorPatterns,
  kaleidoscopeMirrorSchema,
} from "./Effects/Stylize/Mirror/kaleidoscope-mirror.schema";
import { DelayTrailTemplate } from "./Effects/Stylize/Trail/DelayTrailTemplate";
import {
  delayTrailDurationFrames,
  delayTrailPatterns,
  delayTrailSchema,
} from "./Effects/Stylize/Trail/delay-trail.schema";
import { BloomFlashTransitionTemplate } from "./Effects/Transition/BloomFlashTransition/BloomFlashTransitionTemplate";
import {
  bloomFlashTransitionDurationFrames,
  bloomFlashTransitionPatterns,
  bloomFlashTransitionSchema,
} from "./Effects/Transition/BloomFlashTransition/bloom-flash-transition.schema";
import { SciFiOverlayTemplate } from "./Effects/Overlay/SciFi/SciFiOverlayTemplate";
import {
  sciFiOverlayDurationFrames,
  sciFiOverlayPatterns,
  sciFiOverlaySchema,
} from "./Effects/Overlay/SciFi/sci-fi-overlay.schema";
import { TextlessSciFiOverlayTemplate } from "./Effects/Overlay/TextlessSciFi/TextlessSciFiOverlayTemplate";
import {
  textlessSciFiOverlayDurationFrames,
  textlessSciFiOverlayPatterns,
  textlessSciFiOverlaySchema,
} from "./Effects/Overlay/TextlessSciFi/textless-sci-fi-overlay.schema";
import { SciFiTransitionsTemplate } from "./Effects/Transition/SciFiTransitionsTemplate";
import {
  sciFiTransitionsDurationFrames,
  sciFiTransitionsSchema,
} from "./Effects/Transition/sci-fi-transitions.schema";
import { glitchSignalTransitionPatterns } from "./Effects/Transition/GlitchSignal/glitch-signal-transitions";
import { scanControlTransitionPatterns } from "./Effects/Transition/ScanControl/scan-control-transitions";
import { hologramParticleTransitionPatterns } from "./Effects/Transition/HologramParticle/hologram-particle-transitions";
import { opticalEnergyTransitionPatterns } from "./Effects/Transition/OpticalEnergy/optical-energy-transitions";
import { spatialWarpTransitionPatterns } from "./Effects/Transition/SpatialWarp/spatial-warp-transitions";
import { dataUiTransitionPatterns } from "./Effects/Transition/DataUI/data-ui-transitions";

import { ScanEchoTransitionTemplate } from "./Effects/Transition/ScanEchoTransition/ScanEchoTransitionTemplate";
import { scanEchoTransitionSchema } from "./Effects/Transition/ScanEchoTransition/scan-echo-transition.schema";
import { mergedScanEchoTransitionPatterns } from "./composition/composition-merged-other";

const FPS = 30;

export function EffectFolder() {
  return (
    <Folder name="Effect">
      <Folder name="Transition">
        <Folder name="DistressTransition">
          {renderPatternFamily({
            patterns: mergedDistressTransitionPatterns,
            idPrefix: "DistressTransition-",
            Template: DistressTransitionTemplate,
            schema: distressTransitionSchema,
            durationInFrames: (props) => props.durationFrames,
          })}
        </Folder>
        <Folder name="ScanEchoTransition">
          {Object.entries(mergedScanEchoTransitionPatterns).map(
            ([key, props]) => {
              const id = `ScanEchoTransition-${key.charAt(0).toUpperCase()}${key.slice(1)}`;
              return renderDurationVariantCompositions({
                id: id,
                Template: ScanEchoTransitionTemplate,
                schema: scanEchoTransitionSchema,
                props: props,
                durationInFrames: (input) => input.durationFrames,
              });
            },
          )}
        </Folder>

        <Folder name="GlitchTransitionBridge">
          <Composition
            id="GlitchTransitionBridge"
            component={withCanvasPreview(
              "GlitchTransitionBridge",
              GlitchTransitionBridgeTemplate,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={minimumCompositionFrames(
              glitchTransitionBridgeDurationFrames,
              FPS,
            )}
            schema={glitchTransitionBridgeSchema}
            defaultProps={{ ...defaultGlitchTransitionBridgeProps }}
          />
        </Folder>
        <Folder name="SignalSliceTransition">
          {renderPatternFamily({
            patterns: signalSliceTransitionPatterns,
            idPrefix: "SignalSliceTransition-",
            Template: SignalSliceTransitionTemplate,
            schema: signalSliceTransitionSchema,
            durationInFrames: signalSliceTransitionDurationFrames,
          })}
        </Folder>
        <Folder name="GlitchSignal">
          {renderPatternFamily({
            patterns: glitchSignalTransitionPatterns,
            idPrefix: "",
            Template: SciFiTransitionsTemplate,
            schema: sciFiTransitionsSchema,
            durationInFrames: sciFiTransitionsDurationFrames,
          })}
        </Folder>
        <Folder name="ScanControl">
          {renderPatternFamily({
            patterns: scanControlTransitionPatterns,
            idPrefix: "",
            Template: SciFiTransitionsTemplate,
            schema: sciFiTransitionsSchema,
            durationInFrames: sciFiTransitionsDurationFrames,
          })}
        </Folder>
        <Folder name="HologramFragmentTransition">
          {renderPatternFamily({
            patterns: hologramFragmentTransitionPatterns,
            idPrefix: "HologramFragmentTransition-",
            Template: HologramFragmentTransitionTemplate,
            schema: hologramFragmentTransitionSchema,
            durationInFrames: hologramFragmentTransitionAnimationDurationFrames,
          })}
        </Folder>
        <Folder name="HologramParticle">
          {renderPatternFamily({
            patterns: hologramParticleTransitionPatterns,
            idPrefix: "",
            Template: SciFiTransitionsTemplate,
            schema: sciFiTransitionsSchema,
            durationInFrames: sciFiTransitionsDurationFrames,
          })}
        </Folder>
        <Folder name="BloomFlashTransition">
          {renderPatternFamily({
            patterns: bloomFlashTransitionPatterns,
            idPrefix: "BloomFlashTransition-",
            Template: BloomFlashTransitionTemplate,
            schema: bloomFlashTransitionSchema,
            durationInFrames: bloomFlashTransitionDurationFrames,
          })}
        </Folder>
        <Folder name="RackFocusBokehTransition">
          {renderDurationVariantCompositions({
            id: "RackFocusBokehTransition",
            Template: RackFocusBokehTransitionTemplate,
            schema: rackFocusBokehTransitionSchema,
            props: {
              ...defaultRackFocusBokehTransitionProps,
              bokehColors: [
                ...defaultRackFocusBokehTransitionProps.bokehColors,
              ],
            },
            durationInFrames: minimumCompositionFrames(
              rackFocusBokehTransitionDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="OpticalEnergy">
          {renderPatternFamily({
            patterns: opticalEnergyTransitionPatterns,
            idPrefix: "",
            Template: SciFiTransitionsTemplate,
            schema: sciFiTransitionsSchema,
            durationInFrames: sciFiTransitionsDurationFrames,
          })}
        </Folder>
        <Folder name="InkRippleTransition">
          <Composition
            id="InkRippleTransition"
            component={withCanvasPreview(
              "InkRippleTransition",
              InkRippleTransitionTemplate,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={minimumCompositionFrames(
              inkRippleTransitionDurationFrames,
              FPS,
            )}
            schema={inkRippleTransitionSchema}
            defaultProps={{ ...defaultInkRippleTransitionProps }}
          />
        </Folder>
        <Folder name="ShatterCrackTransition">
          <Composition
            id="ShatterCrackTransition"
            component={withCanvasPreview(
              "ShatterCrackTransition",
              ShatterCrackTransitionTemplate,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={minimumCompositionFrames(
              shatterCrackTransitionDurationFrames,
              FPS,
            )}
            schema={shatterCrackTransitionSchema}
            defaultProps={{ ...defaultShatterCrackTransitionProps }}
          />
        </Folder>
        <Folder name="ZoomBlurTransition">
          {renderDurationVariantCompositions({
            id: "ZoomBlurTransition",
            Template: ZoomBlurTransitionTemplate,
            schema: zoomBlurTransitionSchema,
            props: { ...defaultZoomBlurTransitionProps },
            durationInFrames: minimumCompositionFrames(
              zoomBlurTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="ShaderEnergy">
          {renderPatternFamily({
            patterns: shaderEnergyTransitionPatterns,
            idPrefix: "",
            Template: ShaderEnergyTransitionTemplate,
            schema: shaderEnergyTransitionSchema,
            durationInFrames: shaderEnergyTransitionDurationFrames,
          })}
        </Folder>
        <Folder name="SuminagashiTransition">
          {renderPatternFamily({
            patterns: suminagashiTransitionPatterns,
            idPrefix: "SuminagashiTransition-",
            Template: SuminagashiTransitionTemplate,
            schema: suminagashiTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              suminagashiTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="DryBrushTransition">
          {renderPatternFamily({
            patterns: dryBrushTransitionPatterns,
            idPrefix: "DryBrushTransition-",
            Template: DryBrushTransitionTemplate,
            schema: dryBrushTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              dryBrushTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="TornPaperTransition">
          {renderPatternFamily({
            patterns: tornPaperTransitionPatterns,
            idPrefix: "TornPaperTransition-",
            Template: TornPaperTransitionTemplate,
            schema: tornPaperTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              tornPaperTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="GrungeTransition">
          {renderPatternFamily({
            patterns: grungeTransitionPatterns,
            idPrefix: "GrungeTransition-",
            Template: GrungeTransitionTemplate,
            schema: grungeTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              grungeTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="WaterRippleTransition">
          {renderPatternFamily({
            patterns: waterRippleTransitionPatterns,
            idPrefix: "WaterRippleTransition-",
            Template: WaterRippleTransitionTemplate,
            schema: waterRippleTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              waterRippleTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="CodecCorruptTransition">
          {renderPatternFamily({
            patterns: codecCorruptTransitionPatterns,
            idPrefix: "CodecCorruptTransition-",
            Template: CodecCorruptTransitionTemplate,
            schema: codecCorruptTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              codecCorruptTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="PixelSortTransition">
          {renderPatternFamily({
            patterns: pixelSortTransitionPatterns,
            idPrefix: "PixelSortTransition-",
            Template: PixelSortTransitionTemplate,
            schema: pixelSortTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              pixelSortTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="CrtPowerOffTransition">
          {renderPatternFamily({
            patterns: crtPowerOffTransitionPatterns,
            idPrefix: "CrtPowerOffTransition-",
            Template: CrtPowerOffTransitionTemplate,
            schema: crtPowerOffTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              crtPowerOffTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="InkBleedTransition">
          {renderPatternFamily({
            patterns: inkBleedTransitionPatterns,
            idPrefix: "InkBleedTransition-",
            Template: InkBleedTransitionTemplate,
            schema: inkBleedTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              inkBleedTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="VolumetricSmokeTransition">
          {renderPatternFamily({
            patterns: volumetricSmokeTransitionPatterns,
            idPrefix: "VolumetricSmokeTransition-",
            Template: VolumetricSmokeTransitionTemplate,
            schema: volumetricSmokeTransitionSchema,
            durationInFrames: minimumCompositionFrames(
              volumetricSmokeTransitionAnimationDurationFrames,
              FPS,
            ),
          })}
        </Folder>
        <Folder name="SpatialWarp">
          {renderPatternFamily({
            patterns: spatialWarpTransitionPatterns,
            idPrefix: "",
            Template: SciFiTransitionsTemplate,
            schema: sciFiTransitionsSchema,
            durationInFrames: sciFiTransitionsDurationFrames,
          })}
        </Folder>
        <Folder name="DataUI">
          {renderPatternFamily({
            patterns: dataUiTransitionPatterns,
            idPrefix: "",
            Template: SciFiTransitionsTemplate,
            schema: sciFiTransitionsSchema,
            durationInFrames: sciFiTransitionsDurationFrames,
          })}
        </Folder>
      </Folder>
      <Folder name="Overlay">
        <Folder name="SciFi">
          {renderPatternFamily({
            patterns: sciFiOverlayPatterns,
            idPrefix: "",
            Template: SciFiOverlayTemplate,
            schema: sciFiOverlaySchema,
            durationInFrames: sciFiOverlayDurationFrames,
          })}
        </Folder>
        <Folder name="TextlessSciFi">
          {renderPatternFamily({
            patterns: textlessSciFiOverlayPatterns,
            idPrefix: "",
            Template: TextlessSciFiOverlayTemplate,
            schema: textlessSciFiOverlaySchema,
            durationInFrames: textlessSciFiOverlayDurationFrames,
          })}
        </Folder>
        <Folder name="ShaderSciFi">
          {renderPatternFamily({
            patterns: shaderSciFiOverlayPatterns,
            idPrefix: "",
            Template: ShaderSciFiOverlayTemplate,
            schema: shaderSciFiOverlaySchema,
            durationInFrames: shaderSciFiOverlayDurationFrames,
          })}
        </Folder>
        <Folder name="ObjectDetectionOverlay">
          {renderPatternFamily({
            patterns: objectDetectionOverlayPatterns,
            idPrefix: "ObjectDetectionOverlay-",
            Template: ObjectDetectionOverlayTemplate,
            schema: objectDetectionOverlaySchema,
            durationInFrames: objectDetectionOverlayDurationFrames,
          })}
        </Folder>
        <Folder name="CompositionGuide">
          {renderPatternFamily({
            patterns: compositionGuidePatterns,
            idPrefix: "CompositionGuide-",
            Template: CompositionGuideTemplate,
            schema: compositionGuideSchema,
            durationInFrames: compositionGuideDurationFrames,
          })}
        </Folder>
      </Folder>
      <Folder name="Stylize">
        <Folder name="Burst">
          <Composition
            id="Burst"
            component={withCanvasPreview("Burst", BurstTemplate)}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={minimumCompositionFrames(
              burstDurationFrames,
              FPS,
            )}
            schema={burstSchema}
            defaultProps={{ ...defaultBurstProps }}
          />
        </Folder>
        <Folder name="Trail">
          {renderPatternFamily({
            patterns: delayTrailPatterns,
            idPrefix: "DelayTrail-",
            Template: DelayTrailTemplate,
            schema: delayTrailSchema,
            durationInFrames: delayTrailDurationFrames,
          })}
        </Folder>
        <Folder name="Mirror">
          {renderPatternFamily({
            patterns: kaleidoscopeMirrorPatterns,
            idPrefix: "KaleidoscopeMirror-",
            Template: KaleidoscopeMirrorTemplate,
            schema: kaleidoscopeMirrorSchema,
            durationInFrames: kaleidoscopeMirrorDurationFrames,
          })}
        </Folder>
        <Folder name="FootagePass">
          {renderPatternFamily({
            patterns: footagePassPatterns,
            idPrefix: "FootagePass-",
            Template: FootagePassTemplate,
            schema: footagePassSchema,
            durationInFrames: footagePassDurationFrames,
          })}
        </Folder>
      </Folder>
    </Folder>
  );
}
