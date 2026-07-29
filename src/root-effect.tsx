import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplateV1 } from "./Effect/GlitchTransitionBridge/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchemaV1 } from "./Effect/GlitchTransitionBridge/glitch-transition-bridge.schema";
import {
  defaultGlitchTransitionBridgeV1Props,
  glitchTransitionBridgeV1DurationFrames,
} from "./Effect/GlitchTransitionBridge/glitch-transition-bridge.schema";
import { InkRippleTransitionTemplateV1 } from "./Effect/InkRippleTransition/InkRippleTransitionTemplate";
import { inkRippleTransitionSchemaV1 } from "./Effect/InkRippleTransition/ink-ripple-transition.schema";
import {
  defaultInkRippleTransitionV1Props,
  inkRippleTransitionV1DurationFrames,
} from "./Effect/InkRippleTransition/ink-ripple-transition.schema";
import { RackFocusBokehTransitionTemplateV1 } from "./Effect/RackFocusBokehTransition/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchemaV1 } from "./Effect/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import {
  defaultRackFocusBokehTransitionV1Props,
  rackFocusBokehTransitionV1DurationFrames,
} from "./Effect/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import { BurstTemplateV1 } from "./Effect/Burst/BurstTemplate";
import { burstSchemaV1 } from "./Effect/Burst/burst.schema";
import {
  defaultBurstV1Props,
  burstV1DurationFrames,
} from "./Effect/Burst/burst.schema";
import { withCanvasPreview } from "./helpers/composition-helpers";

const FPS = 30;

export function EffectFolder() {
  return (
    <Folder name="Effect">
      <Composition
        id="GlitchTransitionBridge"
        component={withCanvasPreview(
          "GlitchTransitionBridge",
          GlitchTransitionBridgeTemplateV1,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={glitchTransitionBridgeV1DurationFrames}
        schema={glitchTransitionBridgeSchemaV1}
        defaultProps={{ ...defaultGlitchTransitionBridgeV1Props }}
      />

      <Composition
        id="InkRippleTransition"
        component={withCanvasPreview(
          "InkRippleTransition",
          InkRippleTransitionTemplateV1,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={inkRippleTransitionV1DurationFrames}
        schema={inkRippleTransitionSchemaV1}
        defaultProps={{ ...defaultInkRippleTransitionV1Props }}
      />

      <Composition
        id="RackFocusBokehTransition"
        component={withCanvasPreview(
          "RackFocusBokehTransition",
          RackFocusBokehTransitionTemplateV1,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={rackFocusBokehTransitionV1DurationFrames}
        schema={rackFocusBokehTransitionSchemaV1}
        defaultProps={{ ...defaultRackFocusBokehTransitionV1Props }}
      />

      <Composition
        id="Burst"
        component={withCanvasPreview(
          "Burst",
          BurstTemplateV1,
        )}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={burstV1DurationFrames}
        schema={burstSchemaV1}
        defaultProps={{ ...defaultBurstV1Props }}
      />
    </Folder>
  );
}
