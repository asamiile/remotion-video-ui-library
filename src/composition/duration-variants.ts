import {hologramFragmentTransitionAnimationDurationFrames} from "../Effects/Transition/HologramFragmentTransition/hologram-fragment-transition.schema";
import {zoomBlurTransitionAnimationDurationFrames} from "../Effects/Transition/ZoomBlurTransition/zoom-blur-transition.schema";
import policies from "./duration-variants.json";

export function getDurationVariantWindow(
  id: string,
  props: Record<string, unknown>,
) {
  const policy = policies.find((p) =>
    p.prefix ? id.startsWith(p.prefix) : p.ids?.includes(id),
  );
  if (!policy) return null;
  const number = (key: string) => Number(props[key]);
  switch (policy.timing) {
    case "scan":
    case "sciFi":
      return { frames: number("durationFrames"), sourceStart: 0 };
    case "hologram":
      return { frames: hologramFragmentTransitionAnimationDurationFrames, sourceStart: 0 };
    case "zoom":
      return { frames: zoomBlurTransitionAnimationDurationFrames, sourceStart: 0 };
    case "bokeh":
      return {
        frames: Math.ceil(number("rampFrames") * 2 + number("holdFrames")) + 1,
        sourceStart: 0,
      };
    case "bloom": {
      const sourceStart = Math.max(
        0,
        number("peakFrame") - number("flashFrames"),
      );
      return {
        frames: number("peakFrame") + number("flashFrames") + 1 - sourceStart,
        sourceStart,
      };
    }
    default:
      return null;
  }
}
