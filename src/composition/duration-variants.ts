import {hologramFragmentTransitionAnimationDurationFrames} from "../Effects/Transition/HologramFragmentTransition/hologram-fragment-transition.schema";
import {zoomBlurTransitionAnimationDurationFrames} from "../Effects/Transition/ZoomBlurTransition/zoom-blur-transition.schema";
import {volumetricSmokeTransitionAnimationDurationFrames} from "../Effects/Transition/VolumetricSmokeTransition/volumetric-smoke-transition.schema";
import {inkBleedTransitionAnimationDurationFrames} from "../Effects/Transition/InkBleedTransition/ink-bleed-transition.schema";
import {suminagashiTransitionAnimationDurationFrames} from "../Effects/Transition/SuminagashiTransition/suminagashi-transition.schema";
import {dryBrushTransitionAnimationDurationFrames} from "../Effects/Transition/DryBrushTransition/dry-brush-transition.schema";
import {waterRippleTransitionAnimationDurationFrames} from "../Effects/Transition/WaterRippleTransition/water-ripple-transition.schema";
import {codecCorruptTransitionAnimationDurationFrames} from "../Effects/Transition/CodecCorruptTransition/codec-corrupt-transition.schema";
import {pixelSortTransitionAnimationDurationFrames} from "../Effects/Transition/PixelSortTransition/pixel-sort-transition.schema";
import {crtPowerOffTransitionAnimationDurationFrames} from "../Effects/Transition/CrtPowerOffTransition/crt-power-off-transition.schema";
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
    case "distress":
    case "scan":
    case "sciFi":
      return { frames: number("durationFrames"), sourceStart: 0 };
    case "hologram":
      return { frames: hologramFragmentTransitionAnimationDurationFrames, sourceStart: 0 };
    case "zoom":
      return { frames: zoomBlurTransitionAnimationDurationFrames, sourceStart: 0 };
    case "codecCorrupt":
      return { frames: codecCorruptTransitionAnimationDurationFrames, sourceStart: 0 };
    case "pixelSort":
      return { frames: pixelSortTransitionAnimationDurationFrames, sourceStart: 0 };
    case "crtPowerOff":
      return { frames: crtPowerOffTransitionAnimationDurationFrames, sourceStart: 0 };
    case "suminagashi":
      return { frames: suminagashiTransitionAnimationDurationFrames, sourceStart: 0 };
    case "dryBrush":
      return { frames: dryBrushTransitionAnimationDurationFrames, sourceStart: 0 };
    case "waterRipple":
      return { frames: waterRippleTransitionAnimationDurationFrames, sourceStart: 0 };
    case "inkBleed":
      return { frames: inkBleedTransitionAnimationDurationFrames, sourceStart: 0 };
    case "smoke":
      return { frames: volumetricSmokeTransitionAnimationDurationFrames, sourceStart: 0 };
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
