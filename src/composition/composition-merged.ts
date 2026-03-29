import { defaultIntroV1Props } from "../Intro/Intro-v1/intro-config";
import { ledTextV1Patterns } from "../LedText/LedText-v1/led-text-config";
import { neonTextV1Patterns } from "../NeonText/NeonText-v1/neon-text-config";
import { slideInCaptionV1Patterns } from "../SlideInCaption/SlideInCaption-v1/slide-in-caption-config";
import { glitchTextV1Patterns } from "../GlitchText/GlitchText-v1/glitch-text-config";
import { wireTextV1Patterns } from "../WireText/WireText-v1/wire-text-config";
import { neonTextRainbowV1Patterns } from "../NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-config";
import { lightSweepTextV1Patterns } from "../LightSweepText/LightSweepText-v1/light-sweep-text-config";
import { typewriterTextV1Patterns } from "../TypewriterText/TypewriterText-v1/typewriter-text-config";
import { shakeTextV1Patterns } from "../ShakeText/ShakeText-v1/shake-text-config";
import { confettiPopTextV1Patterns } from "../ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-config";
import { loadingIconV1Patterns } from "../LoadingIcon/LoadingIcon-v1/loading-icon-config";
import {
  buildLocationConfigsFromCompositionKeys,
  buildMapLocationPointsFromCompositionKeys,
  getEffectiveCompositionText,
  getLocationV1CompositionKeys,
  shallowMergePatternRecord,
} from "./merge-composition-local";

const local = getEffectiveCompositionText();
const locationV1CompositionKeys = getLocationV1CompositionKeys();

export const mergedDefaultIntroV1Props = {
  ...defaultIntroV1Props,
  ...local.intro,
};

export const mergedLedTextV1Patterns = shallowMergePatternRecord(
  ledTextV1Patterns,
  local.ledTextV1Patterns,
) as typeof ledTextV1Patterns;

export const mergedNeonTextV1Patterns = shallowMergePatternRecord(
  neonTextV1Patterns,
  local.neonTextV1Patterns,
) as typeof neonTextV1Patterns;

export const mergedSlideInCaptionV1Patterns = shallowMergePatternRecord(
  slideInCaptionV1Patterns,
  local.slideInCaptionV1Patterns,
) as typeof slideInCaptionV1Patterns;

export const mergedGlitchTextV1Patterns = shallowMergePatternRecord(
  glitchTextV1Patterns,
  local.glitchTextV1Patterns,
) as typeof glitchTextV1Patterns;

export const mergedWireTextV1Patterns = shallowMergePatternRecord(
  wireTextV1Patterns,
  local.wireTextV1Patterns,
) as typeof wireTextV1Patterns;

export const mergedNeonTextRainbowV1Patterns = shallowMergePatternRecord(
  neonTextRainbowV1Patterns,
  local.neonTextRainbowV1Patterns,
) as typeof neonTextRainbowV1Patterns;

export const mergedLightSweepTextV1Patterns = shallowMergePatternRecord(
  lightSweepTextV1Patterns,
  local.lightSweepTextV1Patterns,
) as typeof lightSweepTextV1Patterns;

export const mergedTypewriterTextV1Patterns = shallowMergePatternRecord(
  typewriterTextV1Patterns,
  local.typewriterTextV1Patterns,
) as typeof typewriterTextV1Patterns;

export const mergedShakeTextV1Patterns = shallowMergePatternRecord(
  shakeTextV1Patterns,
  local.shakeTextV1Patterns,
) as typeof shakeTextV1Patterns;

export const mergedConfettiPopTextV1Patterns = shallowMergePatternRecord(
  confettiPopTextV1Patterns,
  local.confettiPopTextV1Patterns,
) as typeof confettiPopTextV1Patterns;

export const mergedLoadingIconV1Patterns = shallowMergePatternRecord(
  loadingIconV1Patterns,
  local.loadingIconV1Patterns,
) as typeof loadingIconV1Patterns;

export const mergedLocationConfigsV1 =
  buildLocationConfigsFromCompositionKeys(local, locationV1CompositionKeys);

export const mergedMapLocationPointsV1 =
  buildMapLocationPointsFromCompositionKeys(local, locationV1CompositionKeys);
