import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplateV1 } from "./Effect/GlitchTransitionBridge-v1/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchemaV1 } from "./Effect/GlitchTransitionBridge-v1/glitch-transition-bridge.schema";
import {
  defaultGlitchTransitionBridgeV1Props,
  glitchTransitionBridgeV1DurationFrames,
} from "./Effect/GlitchTransitionBridge-v1/glitch-transition-bridge.schema";
import { InkRippleTransitionTemplateV1 } from "./Effect/InkRippleTransition-v1/InkRippleTransitionTemplate";
import { inkRippleTransitionSchemaV1 } from "./Effect/InkRippleTransition-v1/ink-ripple-transition.schema";
import {
  defaultInkRippleTransitionV1Props,
  inkRippleTransitionV1DurationFrames,
} from "./Effect/InkRippleTransition-v1/ink-ripple-transition.schema";
import { RackFocusBokehTransitionTemplateV1 } from "./Effect/RackFocusBokehTransition-v1/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchemaV1 } from "./Effect/RackFocusBokehTransition-v1/rack-focus-bokeh-transition.schema";
import {
  defaultRackFocusBokehTransitionV1Props,
  rackFocusBokehTransitionV1DurationFrames,
} from "./Effect/RackFocusBokehTransition-v1/rack-focus-bokeh-transition.schema";
import { BurstTemplateV1 } from "./Effect/Burst-v1/BurstTemplate";
import { burstSchemaV1 } from "./Effect/Burst-v1/burst.schema";
import {
  defaultBurstV1Props,
  burstV1DurationFrames,
} from "./Effect/Burst-v1/burst.schema";
import { withCanvasPreview } from "./helpers/composition-helpers";

const FPS = 30;

export function EffectFolder() {
  return (
    <Folder name="Effect">
      <Composition
        id="GlitchTransitionBridgeV1"
        component={withCanvasPreview(
          "GlitchTransitionBridgeV1",
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
        id="InkRippleTransitionV1"
        component={withCanvasPreview(
          "InkRippleTransitionV1",
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
        id="RackFocusBokehTransitionV1"
        component={withCanvasPreview(
          "RackFocusBokehTransitionV1",
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
        id="BurstV1"
        component={withCanvasPreview(
          "BurstV1",
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
