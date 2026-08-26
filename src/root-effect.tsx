import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplate } from "./Effects/Transition/GlitchSignal/GlitchTransitionBridge/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchema } from "./Effects/Transition/GlitchSignal/GlitchTransitionBridge/glitch-transition-bridge.schema";
import {
  defaultGlitchTransitionBridgeProps,
  glitchTransitionBridgeDurationFrames,
} from "./Effects/Transition/GlitchSignal/GlitchTransitionBridge/glitch-transition-bridge.schema";
import { InkRippleTransitionTemplate } from "./Effects/Transition/SpatialWarp/InkRippleTransition/InkRippleTransitionTemplate";
import { inkRippleTransitionSchema } from "./Effects/Transition/SpatialWarp/InkRippleTransition/ink-ripple-transition.schema";
import {
  defaultInkRippleTransitionProps,
  inkRippleTransitionDurationFrames,
} from "./Effects/Transition/SpatialWarp/InkRippleTransition/ink-ripple-transition.schema";
import { RackFocusBokehTransitionTemplate } from "./Effects/Transition/OpticalEnergy/RackFocusBokehTransition/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchema } from "./Effects/Transition/OpticalEnergy/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import {
  defaultRackFocusBokehTransitionProps,
  rackFocusBokehTransitionDurationFrames,
} from "./Effects/Transition/OpticalEnergy/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import { BurstTemplate } from "./Effects/Stylize/Burst/BurstTemplate";
import { burstSchema } from "./Effects/Stylize/Burst/burst.schema";
import {
  defaultBurstProps,
  burstDurationFrames,
} from "./Effects/Stylize/Burst/burst.schema";
import { ShatterCrackTransitionTemplate } from "./Effects/Transition/SpatialWarp/ShatterCrackTransition/ShatterCrackTransitionTemplate";
import { shatterCrackTransitionSchema } from "./Effects/Transition/SpatialWarp/ShatterCrackTransition/shatter-crack-transition.schema";
import {
  defaultShatterCrackTransitionProps,
  shatterCrackTransitionDurationFrames,
} from "./Effects/Transition/SpatialWarp/ShatterCrackTransition/shatter-crack-transition.schema";
import { ZoomBlurTransitionTemplate } from "./Effects/Transition/SpatialWarp/ZoomBlurTransition/ZoomBlurTransitionTemplate";
import { zoomBlurTransitionSchema } from "./Effects/Transition/SpatialWarp/ZoomBlurTransition/zoom-blur-transition.schema";
import {
  defaultZoomBlurTransitionProps,
  zoomBlurTransitionDurationFrames,
} from "./Effects/Transition/SpatialWarp/ZoomBlurTransition/zoom-blur-transition.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import { SignalSliceTransitionTemplate } from "./Effects/Transition/GlitchSignal/SignalSliceTransition/SignalSliceTransitionTemplate";
import { signalSliceTransitionDurationFrames, signalSliceTransitionPatterns, signalSliceTransitionSchema } from "./Effects/Transition/GlitchSignal/SignalSliceTransition/signal-slice-transition.schema";
import { HologramFragmentTransitionTemplate } from "./Effects/Transition/HologramParticle/HologramFragmentTransition/HologramFragmentTransitionTemplate";
import { hologramFragmentTransitionDurationFrames, hologramFragmentTransitionPatterns, hologramFragmentTransitionSchema } from "./Effects/Transition/HologramParticle/HologramFragmentTransition/hologram-fragment-transition.schema";
import {KaleidoscopeMirrorTemplate} from "./Effects/Stylize/Mirror/KaleidoscopeMirrorTemplate";
import {kaleidoscopeMirrorDurationFrames,kaleidoscopeMirrorPatterns,kaleidoscopeMirrorSchema} from "./Effects/Stylize/Mirror/kaleidoscope-mirror.schema";
import {DelayTrailTemplate} from "./Effects/Stylize/Trail/DelayTrailTemplate";
import {delayTrailDurationFrames,delayTrailPatterns,delayTrailSchema} from "./Effects/Stylize/Trail/delay-trail.schema";
import {BloomFlashTransitionTemplate} from "./Effects/Transition/OpticalEnergy/BloomFlashTransition/BloomFlashTransitionTemplate";
import {bloomFlashTransitionDurationFrames,bloomFlashTransitionPatterns,bloomFlashTransitionSchema} from "./Effects/Transition/OpticalEnergy/BloomFlashTransition/bloom-flash-transition.schema";
import {SciFiOverlayTemplate} from "./Effects/Overlay/SciFi/SciFiOverlayTemplate";
import {sciFiOverlayDurationFrames,sciFiOverlayPatterns,sciFiOverlaySchema} from "./Effects/Overlay/SciFi/sci-fi-overlay.schema";
import {TextlessSciFiOverlayTemplate} from "./Effects/Overlay/TextlessSciFi/TextlessSciFiOverlayTemplate";
import {textlessSciFiOverlayDurationFrames,textlessSciFiOverlayPatterns,textlessSciFiOverlaySchema} from "./Effects/Overlay/TextlessSciFi/textless-sci-fi-overlay.schema";
import {SciFiTransitionsTemplate} from "./Effects/Transition/SciFiTransitionsTemplate";
import {sciFiTransitionsDurationFrames,sciFiTransitionsSchema} from "./Effects/Transition/sci-fi-transitions.schema";
import {glitchSignalTransitionPatterns} from "./Effects/Transition/GlitchSignal/glitch-signal-transitions";
import {scanControlTransitionPatterns} from "./Effects/Transition/ScanControl/scan-control-transitions";
import {hologramParticleTransitionPatterns} from "./Effects/Transition/HologramParticle/hologram-particle-transitions";
import {opticalEnergyTransitionPatterns} from "./Effects/Transition/OpticalEnergy/optical-energy-transitions";
import {spatialWarpTransitionPatterns} from "./Effects/Transition/SpatialWarp/spatial-warp-transitions";
import {dataUiTransitionPatterns} from "./Effects/Transition/DataUI/data-ui-transitions";

const FPS = 30;
const inkRippleDurationFrames =
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 600
    : inkRippleTransitionDurationFrames;

export function EffectFolder() {
  return (
    <Folder name="Effect">
      <Folder name="Transition">
        <Folder name="GlitchSignal">
          <Folder name="GlitchTransitionBridge">
            <Composition id="GlitchTransitionBridge" component={withCanvasPreview("GlitchTransitionBridge", GlitchTransitionBridgeTemplate)} width={1920} height={1080} fps={FPS} durationInFrames={glitchTransitionBridgeDurationFrames} schema={glitchTransitionBridgeSchema} defaultProps={{...defaultGlitchTransitionBridgeProps}} />
          </Folder>
          <Folder name="SignalSliceTransition">
            {renderPatternFamily({patterns: signalSliceTransitionPatterns, idPrefix: "SignalSliceTransition-", Template: SignalSliceTransitionTemplate, schema: signalSliceTransitionSchema, durationInFrames: signalSliceTransitionDurationFrames})}
          </Folder>
          {renderPatternFamily({patterns: glitchSignalTransitionPatterns, idPrefix: "", Template: SciFiTransitionsTemplate, schema: sciFiTransitionsSchema, durationInFrames: sciFiTransitionsDurationFrames})}
        </Folder>
        <Folder name="ScanControl">
          {renderPatternFamily({patterns: scanControlTransitionPatterns, idPrefix: "", Template: SciFiTransitionsTemplate, schema: sciFiTransitionsSchema, durationInFrames: sciFiTransitionsDurationFrames})}
        </Folder>
        <Folder name="HologramParticle">
          <Folder name="HologramFragmentTransition">
            {renderPatternFamily({patterns: hologramFragmentTransitionPatterns, idPrefix: "HologramFragmentTransition-", Template: HologramFragmentTransitionTemplate, schema: hologramFragmentTransitionSchema, durationInFrames: hologramFragmentTransitionDurationFrames})}
          </Folder>
          {renderPatternFamily({patterns: hologramParticleTransitionPatterns, idPrefix: "", Template: SciFiTransitionsTemplate, schema: sciFiTransitionsSchema, durationInFrames: sciFiTransitionsDurationFrames})}
        </Folder>
        <Folder name="OpticalEnergy">
          <Folder name="BloomFlashTransition">{renderPatternFamily({patterns: bloomFlashTransitionPatterns, idPrefix: "BloomFlashTransition-", Template: BloomFlashTransitionTemplate, schema: bloomFlashTransitionSchema, durationInFrames: bloomFlashTransitionDurationFrames})}</Folder>
          <Folder name="RackFocusBokehTransition">
            <Composition id="RackFocusBokehTransition" component={withCanvasPreview("RackFocusBokehTransition", RackFocusBokehTransitionTemplate)} width={1920} height={1080} fps={FPS} durationInFrames={rackFocusBokehTransitionDurationFrames} schema={rackFocusBokehTransitionSchema} defaultProps={{...defaultRackFocusBokehTransitionProps, bokehColors: [...defaultRackFocusBokehTransitionProps.bokehColors]}} />
          </Folder>
          {renderPatternFamily({patterns: opticalEnergyTransitionPatterns, idPrefix: "", Template: SciFiTransitionsTemplate, schema: sciFiTransitionsSchema, durationInFrames: sciFiTransitionsDurationFrames})}
        </Folder>
        <Folder name="SpatialWarp">
          <Folder name="InkRippleTransition">
            <Composition id="InkRippleTransition" component={withCanvasPreview("InkRippleTransition", InkRippleTransitionTemplate)} width={1920} height={1080} fps={FPS} durationInFrames={inkRippleDurationFrames} schema={inkRippleTransitionSchema} defaultProps={{...defaultInkRippleTransitionProps}} />
          </Folder>
          <Folder name="ShatterCrackTransition">
            <Composition id="ShatterCrackTransition" component={withCanvasPreview("ShatterCrackTransition", ShatterCrackTransitionTemplate)} width={1920} height={1080} fps={FPS} durationInFrames={shatterCrackTransitionDurationFrames} schema={shatterCrackTransitionSchema} defaultProps={{...defaultShatterCrackTransitionProps}} />
          </Folder>
          <Folder name="ZoomBlurTransition">
            <Composition id="ZoomBlurTransition" component={withCanvasPreview("ZoomBlurTransition", ZoomBlurTransitionTemplate)} width={1920} height={1080} fps={FPS} durationInFrames={zoomBlurTransitionDurationFrames()} schema={zoomBlurTransitionSchema} defaultProps={{...defaultZoomBlurTransitionProps}} />
          </Folder>
          {renderPatternFamily({patterns: spatialWarpTransitionPatterns, idPrefix: "", Template: SciFiTransitionsTemplate, schema: sciFiTransitionsSchema, durationInFrames: sciFiTransitionsDurationFrames})}
        </Folder>
        <Folder name="DataUI">
          {renderPatternFamily({patterns: dataUiTransitionPatterns, idPrefix: "", Template: SciFiTransitionsTemplate, schema: sciFiTransitionsSchema, durationInFrames: sciFiTransitionsDurationFrames})}
        </Folder>
      </Folder>
      <Folder name="Overlay">
        <Folder name="SciFi">{renderPatternFamily({patterns: sciFiOverlayPatterns, idPrefix: "", Template: SciFiOverlayTemplate, schema: sciFiOverlaySchema, durationInFrames: sciFiOverlayDurationFrames})}</Folder>
        <Folder name="TextlessSciFi">{renderPatternFamily({patterns: textlessSciFiOverlayPatterns, idPrefix: "", Template: TextlessSciFiOverlayTemplate, schema: textlessSciFiOverlaySchema, durationInFrames: textlessSciFiOverlayDurationFrames})}</Folder>
      </Folder>
      <Folder name="Stylize">
        <Folder name="Burst">
          <Composition id="Burst" component={withCanvasPreview("Burst", BurstTemplate)} width={1920} height={1080} fps={FPS} durationInFrames={burstDurationFrames} schema={burstSchema} defaultProps={{...defaultBurstProps}} />
        </Folder>
        <Folder name="Trail">{renderPatternFamily({patterns: delayTrailPatterns, idPrefix: "DelayTrail-", Template: DelayTrailTemplate, schema: delayTrailSchema, durationInFrames: delayTrailDurationFrames})}</Folder>
        <Folder name="Mirror">{renderPatternFamily({patterns: kaleidoscopeMirrorPatterns, idPrefix: "KaleidoscopeMirror-", Template: KaleidoscopeMirrorTemplate, schema: kaleidoscopeMirrorSchema, durationInFrames: kaleidoscopeMirrorDurationFrames})}</Folder>
      </Folder>
    </Folder>
  );
}
