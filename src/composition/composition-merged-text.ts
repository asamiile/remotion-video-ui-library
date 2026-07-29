import { ledTextPatterns } from "../Text/LedText/led-text.schema";
import { neonTextPatterns } from "../Text/NeonText/neon-text.schema";
import { slideInCaptionPatterns } from "../Text/SlideInCaption/slide-in-caption.schema";
import { glitchTextPatterns } from "../Text/GlitchText/glitch-text.schema";
import { glitchTextRandomPatterns } from "../Text/GlitchText/glitch-text-random.schema";
import { wireTextPatterns } from "../Text/WireText/wire-text.schema";
import { neonTextRainbowPatterns } from "../Text/NeonTextRainbow/neon-text-rainbow.schema";
import { lightSweepTextPatterns } from "../Text/LightSweepText/light-sweep-text.schema";
import { dottedLineMarkerPatterns } from "../Text/DottedLineMarkerText/dotted-line-marker-text.schema";
import { typewriterTextPatterns } from "../Text/TypewriterText/typewriter-text.schema";
import { shakeTextPatterns } from "../Text/ShakeText/shake-text.schema";
import { confettiPopTextPatterns } from "../Text/ConfettiPopText/confetti-pop-text.schema";
import { codeStreamPatterns } from "../Text/CodeStream/code-stream.schema";
import { stackedRevealTextPatterns } from "../Text/StackedRevealText/stacked-reveal-text.schema";
import { tornNoteCaptionPatterns } from "../Text/TornNoteCaption/torn-note-caption.schema";
import { distressedTitleCardPatterns } from "../Text/DistressedTitleCard/distressed-title-card.schema";
import { sprayPaintTextPatterns } from "../Text/SprayPaintText/spray-paint-text.schema";
import { oneTakeLogoTextVariantProps } from "../Text/FlickerTitle/flicker-title.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
  buildLocationConfigsFromCompositionKeys,
  buildMapLocationPointsFromCompositionKeys,
  getLocationCompositionKeys,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();
const locationCompositionKeys = getLocationCompositionKeys();

export const mergedLedTextPatterns = shallowMergePatternRecord(
  ledTextPatterns,
  local.ledTextPatterns,
) as typeof ledTextPatterns;

export const mergedNeonTextPatterns = shallowMergePatternRecord(
  neonTextPatterns,
  local.neonTextPatterns,
) as typeof neonTextPatterns;

export const mergedSlideInCaptionPatterns = shallowMergePatternRecord(
  slideInCaptionPatterns,
  local.slideInCaptionPatterns,
) as typeof slideInCaptionPatterns;

export const mergedGlitchTextPatterns = shallowMergePatternRecord(
  glitchTextPatterns,
  local.glitchTextPatterns,
) as typeof glitchTextPatterns;

export const mergedGlitchTextRandomPatterns = shallowMergePatternRecord(
  glitchTextRandomPatterns,
  local.glitchTextRandomPatterns,
) as typeof glitchTextRandomPatterns;

export const mergedWireTextPatterns = shallowMergePatternRecord(
  wireTextPatterns,
  local.wireTextPatterns,
) as typeof wireTextPatterns;

export const mergedNeonTextRainbowPatterns = shallowMergePatternRecord(
  neonTextRainbowPatterns,
  local.neonTextRainbowPatterns,
) as typeof neonTextRainbowPatterns;

export const mergedLightSweepTextPatterns = shallowMergePatternRecord(
  lightSweepTextPatterns,
  local.lightSweepTextPatterns,
) as typeof lightSweepTextPatterns;

export const mergedDottedLineMarkerPatterns = shallowMergePatternRecord(
  dottedLineMarkerPatterns,
  local.dottedLineMarkerTextPatterns,
) as typeof dottedLineMarkerPatterns;

export const mergedTypewriterTextPatterns = shallowMergePatternRecord(
  typewriterTextPatterns,
  local.typewriterTextPatterns,
) as typeof typewriterTextPatterns;

export const mergedShakeTextPatterns = shallowMergePatternRecord(
  shakeTextPatterns,
  local.shakeTextPatterns,
) as typeof shakeTextPatterns;

export const mergedConfettiPopTextPatterns = shallowMergePatternRecord(
  confettiPopTextPatterns,
  local.confettiPopTextPatterns,
) as typeof confettiPopTextPatterns;

export const mergedCodeStreamPatterns = shallowMergePatternRecord(
  codeStreamPatterns,
  local.codeStreamPatterns,
) as typeof codeStreamPatterns;

export const mergedStackedRevealTextPatterns = shallowMergePatternRecord(
  stackedRevealTextPatterns,
  local.stackedRevealTextPatterns,
) as typeof stackedRevealTextPatterns;

export const mergedTornNoteCaptionPatterns = shallowMergePatternRecord(
  tornNoteCaptionPatterns,
  local.tornNoteCaptionPatterns,
) as typeof tornNoteCaptionPatterns;

export const mergedDistressedTitleCardPatterns = shallowMergePatternRecord(
  distressedTitleCardPatterns,
  local.distressedTitleCardPatterns,
) as typeof distressedTitleCardPatterns;

export const mergedSprayPaintTextPatterns = shallowMergePatternRecord(
  sprayPaintTextPatterns,
  local.sprayPaintTextPatterns,
) as typeof sprayPaintTextPatterns;

export const mergedOneTakeLogoTextProps = {
  ...oneTakeLogoTextVariantProps,
  ...(local.oneTakeLogoText || {}),
};

export const mergedLocationConfigs =
  buildLocationConfigsFromCompositionKeys(local, locationCompositionKeys);

export const mergedMapLocationPoints =
  buildMapLocationPointsFromCompositionKeys(local, locationCompositionKeys);

