import { Composition, Folder } from "remotion";
import { GlitchTransitionBridgeTemplate } from "./Effect/GlitchTransitionBridge/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchema } from "./Effect/GlitchTransitionBridge/glitch-transition-bridge.schema";
import {
  defaultGlitchTransitionBridgeProps,
  glitchTransitionBridgeDurationFrames,
} from "./Effect/GlitchTransitionBridge/glitch-transition-bridge.schema";
import { InkRippleTransitionTemplate } from "./Effect/InkRippleTransition/InkRippleTransitionTemplate";
import { inkRippleTransitionSchema } from "./Effect/InkRippleTransition/ink-ripple-transition.schema";
import {
  defaultInkRippleTransitionProps,
  inkRippleTransitionDurationFrames,
} from "./Effect/InkRippleTransition/ink-ripple-transition.schema";
import { RackFocusBokehTransitionTemplate } from "./Effect/RackFocusBokehTransition/RackFocusBokehTransitionTemplate";
import { rackFocusBokehTransitionSchema } from "./Effect/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import {
  defaultRackFocusBokehTransitionProps,
  rackFocusBokehTransitionDurationFrames,
} from "./Effect/RackFocusBokehTransition/rack-focus-bokeh-transition.schema";
import { BurstTemplate } from "./Effect/Burst/BurstTemplate";
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
        durationInFrames={inkRippleTransitionDurationFrames}
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
    </Folder>
  );
}
