import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplate } from "./Effects/GlitchTransitionBridge/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchema } from "./Effects/GlitchTransitionBridge/glitch-transition-bridge.schema";
import {
  defaultGlitchTransitionBridgeProps,
  glitchTransitionBridgeDurationFrames,
} from "./Effects/GlitchTransitionBridge/glitch-transition-bridge.schema";
import { InkRippleTransitionTemplate } from "./Effects/InkRippleTransition/InkRippleTransitionTemplate";
import { inkRippleTransitionSchema } from "./Effects/InkRippleTransition/ink-ripple-transition.schema";
import {
  defaultInkRippleTransitionProps,
  inkRippleTransitionDurationFrames,
} from "./Effects/InkRippleTransition/ink-ripple-transition.schema";
import { RackFocusBokehTransitionTemplate } from "./Effects/RackFocusBokehTransition/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchema } from "./Effects/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import {
  defaultRackFocusBokehTransitionProps,
  rackFocusBokehTransitionDurationFrames,
} from "./Effects/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import { BurstTemplate } from "./Effects/Burst/BurstTemplate";
import { burstSchema } from "./Effects/Burst/burst.schema";
import {
  defaultBurstProps,
  burstDurationFrames,
} from "./Effects/Burst/burst.schema";
import { ShatterCrackTransitionTemplate } from "./Effects/ShatterCrackTransition/ShatterCrackTransitionTemplate";
import { shatterCrackTransitionSchema } from "./Effects/ShatterCrackTransition/shatter-crack-transition.schema";
import {
  defaultShatterCrackTransitionProps,
  shatterCrackTransitionDurationFrames,
} from "./Effects/ShatterCrackTransition/shatter-crack-transition.schema";
import { ZoomBlurTransitionTemplate } from "./Effects/ZoomBlurTransition/ZoomBlurTransitionTemplate";
import { zoomBlurTransitionSchema } from "./Effects/ZoomBlurTransition/zoom-blur-transition.schema";
import {
  defaultZoomBlurTransitionProps,
  zoomBlurTransitionDurationFrames,
} from "./Effects/ZoomBlurTransition/zoom-blur-transition.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import { SignalSliceTransitionTemplate } from "./Effects/SignalSliceTransition/SignalSliceTransitionTemplate";
import { signalSliceTransitionDurationFrames, signalSliceTransitionPatterns, signalSliceTransitionSchema } from "./Effects/SignalSliceTransition/signal-slice-transition.schema";
import { HologramFragmentTransitionTemplate } from "./Effects/HologramFragmentTransition/HologramFragmentTransitionTemplate";
import { hologramFragmentTransitionDurationFrames, hologramFragmentTransitionPatterns, hologramFragmentTransitionSchema } from "./Effects/HologramFragmentTransition/hologram-fragment-transition.schema";
import {KaleidoscopeMirrorTemplate} from "./Effects/KaleidoscopeMirror/KaleidoscopeMirrorTemplate";
import {kaleidoscopeMirrorDurationFrames,kaleidoscopeMirrorPatterns,kaleidoscopeMirrorSchema} from "./Effects/KaleidoscopeMirror/kaleidoscope-mirror.schema";
import {DelayTrailTemplate} from "./Effects/DelayTrail/DelayTrailTemplate";
import {delayTrailDurationFrames,delayTrailPatterns,delayTrailSchema} from "./Effects/DelayTrail/delay-trail.schema";
import {BloomFlashTransitionTemplate} from "./Effects/BloomFlashTransition/BloomFlashTransitionTemplate";
import {bloomFlashTransitionDurationFrames,bloomFlashTransitionPatterns,bloomFlashTransitionSchema} from "./Effects/BloomFlashTransition/bloom-flash-transition.schema";

const FPS = 30;
const inkRippleDurationFrames =
  process.env.REMOTION_ADOBE_STOCK_EXPORT === "1"
    ? 600
    : inkRippleTransitionDurationFrames;

export function EffectFolder() {
  return (
    <Folder name="Effect">
      <Composition
        id="GlitchTransitionBridge"
        component={withCanvasPreview(
          "GlitchTransitionBridge",
          GlitchTransitionBridgeTemplate,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={glitchTransitionBridgeDurationFrames}
        schema={glitchTransitionBridgeSchema}
        defaultProps={{ ...defaultGlitchTransitionBridgeProps }}
      />

      <Composition
        id="InkRippleTransition"
        component={withCanvasPreview(
          "InkRippleTransition",
          InkRippleTransitionTemplate,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={inkRippleDurationFrames}
        schema={inkRippleTransitionSchema}
        defaultProps={{ ...defaultInkRippleTransitionProps }}
      />

      <Composition
        id="RackFocusBokehTransition"
        component={withCanvasPreview(
          "RackFocusBokehTransition",
          RackFocusBokehTransitionTemplate,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={rackFocusBokehTransitionDurationFrames}
        schema={rackFocusBokehTransitionSchema}
        defaultProps={{ ...defaultRackFocusBokehTransitionProps }}
      />

      <Composition
        id="Burst"
        component={withCanvasPreview(
          "Burst",
          BurstTemplate,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={burstDurationFrames}
        schema={burstSchema}
        defaultProps={{ ...defaultBurstProps }}
      />

      <Composition
        id="ShatterCrackTransition"
        component={withCanvasPreview(
          "ShatterCrackTransition",
          ShatterCrackTransitionTemplate,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={shatterCrackTransitionDurationFrames}
        schema={shatterCrackTransitionSchema}
        defaultProps={{ ...defaultShatterCrackTransitionProps }}
      />

      <Composition
        id="ZoomBlurTransition"
        component={withCanvasPreview(
          "ZoomBlurTransition",
          ZoomBlurTransitionTemplate,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={zoomBlurTransitionDurationFrames}
        schema={zoomBlurTransitionSchema}
        defaultProps={{ ...defaultZoomBlurTransitionProps }}
      />
      <Folder name="SignalSliceTransition">
        {renderPatternFamily({patterns: signalSliceTransitionPatterns, idPrefix: "SignalSliceTransition-", Template: SignalSliceTransitionTemplate, schema: signalSliceTransitionSchema, durationInFrames: signalSliceTransitionDurationFrames})}
      </Folder>
      <Folder name="HologramFragmentTransition">
        {renderPatternFamily({patterns: hologramFragmentTransitionPatterns, idPrefix: "HologramFragmentTransition-", Template: HologramFragmentTransitionTemplate, schema: hologramFragmentTransitionSchema, durationInFrames: hologramFragmentTransitionDurationFrames})}
      </Folder>
      <Folder name="KaleidoscopeMirror">{renderPatternFamily({patterns:kaleidoscopeMirrorPatterns,idPrefix:"KaleidoscopeMirror-",Template:KaleidoscopeMirrorTemplate,schema:kaleidoscopeMirrorSchema,durationInFrames:kaleidoscopeMirrorDurationFrames})}</Folder>
      <Folder name="DelayTrail">{renderPatternFamily({patterns:delayTrailPatterns,idPrefix:"DelayTrail-",Template:DelayTrailTemplate,schema:delayTrailSchema,durationInFrames:delayTrailDurationFrames})}</Folder>
      <Folder name="BloomFlashTransition">{renderPatternFamily({patterns:bloomFlashTransitionPatterns,idPrefix:"BloomFlashTransition-",Template:BloomFlashTransitionTemplate,schema:bloomFlashTransitionSchema,durationInFrames:bloomFlashTransitionDurationFrames})}</Folder>
    </Folder>
  );
}
