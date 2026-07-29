import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplateV1 } from "./Effect/GlitchTransitionBridge/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchema } from "./Effect/GlitchTransitionBridge/glitch-transition-bridge.schema";
import {
  defaultGlitchTransitionBridgeProps,
  glitchTransitionBridgeDurationFrames,
} from "./Effect/GlitchTransitionBridge/glitch-transition-bridge.schema";
import { InkRippleTransitionTemplateV1 } from "./Effect/InkRippleTransition/InkRippleTransitionTemplate";
import { inkRippleTransitionSchema } from "./Effect/InkRippleTransition/ink-ripple-transition.schema";
import {
  defaultInkRippleTransitionProps,
  inkRippleTransitionDurationFrames,
} from "./Effect/InkRippleTransition/ink-ripple-transition.schema";
import { RackFocusBokehTransitionTemplateV1 } from "./Effect/RackFocusBokehTransition/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchema } from "./Effect/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import {
  defaultRackFocusBokehTransitionProps,
  rackFocusBokehTransitionDurationFrames,
} from "./Effect/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import { BurstTemplateV1 } from "./Effect/Burst/BurstTemplate";
import { burstSchema } from "./Effect/Burst/burst.schema";
import {
  defaultBurstProps,
  burstDurationFrames,
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
        durationInFrames={glitchTransitionBridgeDurationFrames}
        schema={glitchTransitionBridgeSchema}
        defaultProps={{ ...defaultGlitchTransitionBridgeProps }}
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
        durationInFrames={inkRippleTransitionDurationFrames}
        schema={inkRippleTransitionSchema}
        defaultProps={{ ...defaultInkRippleTransitionProps }}
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
        durationInFrames={rackFocusBokehTransitionDurationFrames}
        schema={rackFocusBokehTransitionSchema}
        defaultProps={{ ...defaultRackFocusBokehTransitionProps }}
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
        durationInFrames={burstDurationFrames}
        schema={burstSchema}
        defaultProps={{ ...defaultBurstProps }}
      />
    </Folder>
  );
}
