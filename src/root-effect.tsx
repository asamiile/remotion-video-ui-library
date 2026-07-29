import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplateV1 } from "./Effect/GlitchTransitionBridge/GlitchTransitionBridge-v1/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchemaV1 } from "./Effect/GlitchTransitionBridge/GlitchTransitionBridge-v1/glitch-transition-bridge-schema";
import {
  defaultGlitchTransitionBridgeV1Props,
  glitchTransitionBridgeV1DurationFrames,
} from "./Effect/GlitchTransitionBridge/GlitchTransitionBridge-v1/glitch-transition-bridge-config";
import { InkRippleTransitionTemplateV1 } from "./Effect/InkRippleTransition/InkRippleTransition-v1/InkRippleTransitionTemplate";
import { inkRippleTransitionSchemaV1 } from "./Effect/InkRippleTransition/InkRippleTransition-v1/ink-ripple-transition-schema";
import {
  defaultInkRippleTransitionV1Props,
  inkRippleTransitionV1DurationFrames,
} from "./Effect/InkRippleTransition/InkRippleTransition-v1/ink-ripple-transition-config";
import { RackFocusBokehTransitionTemplateV1 } from "./Effect/RackFocusBokehTransition/RackFocusBokehTransition-v1/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchemaV1 } from "./Effect/RackFocusBokehTransition/RackFocusBokehTransition-v1/rack-focus-bokeh-transition-schema";
import {
  defaultRackFocusBokehTransitionV1Props,
  rackFocusBokehTransitionV1DurationFrames,
} from "./Effect/RackFocusBokehTransition/RackFocusBokehTransition-v1/rack-focus-bokeh-transition-config";
import { BurstTemplateV1 } from "./Effect/Burst/Burst-v1/BurstTemplate";
import { burstSchemaV1 } from "./Effect/Burst/Burst-v1/burst-schema";
import {
  defaultBurstV1Props,
  burstV1DurationFrames,
} from "./Effect/Burst/Burst-v1/burst-config";
import { withCanvasPreview } from "./helpers/composition-helpers";

const FPS = 30;

export function EffectFolder() {
  return (
    <Folder name="Effect">
      <Folder name="GlitchTransitionBridge">
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
      </Folder>

      <Folder name="InkRippleTransition">
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
      </Folder>

      <Folder name="RackFocusBokehTransition">
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
      </Folder>

      <Folder name="Burst">
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
    </Folder>
  );
}
