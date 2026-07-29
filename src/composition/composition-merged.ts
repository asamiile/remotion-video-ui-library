import { defaultIntroV1Props } from "../Intro/Intro-v1/intro.schema";
import { ledTextV1Patterns } from "../Text/LedText-v1/led-text.schema";
import { neonTextV1Patterns } from "../Text/NeonText-v1/neon-text.schema";
import { slideInCaptionV1Patterns } from "../Text/SlideInCaption-v1/slide-in-caption.schema";
import { glitchTextV1Patterns } from "../Text/GlitchText-v1/glitch-text.schema";
import { glitchTextV1RandomPatterns } from "../Text/GlitchText-v1/glitch-text-random.schema";
import { wireTextV1Patterns } from "../Text/WireText-v1/wire-text.schema";
import { neonTextRainbowV1Patterns } from "../Text/NeonTextRainbow-v1/neon-text-rainbow.schema";
import { lightSweepTextV1Patterns } from "../Text/LightSweepText-v1/light-sweep-text.schema";
import { randomLinesV1Patterns } from "../Background/RandomLines/RandomLinesBackground-v1/random-lines.schema";
import { dottedLineMarkerV1Patterns } from "../Text/DottedLineMarkerText-v1/dotted-line-marker-text.schema";
import { typewriterTextV1Patterns } from "../Text/TypewriterText-v1/typewriter-text.schema";
import { shakeTextV1Patterns } from "../Text/ShakeText-v1/shake-text.schema";
import { confettiPopTextV1Patterns } from "../Text/ConfettiPopText-v1/confetti-pop-text.schema";
import { loadingIconV1Patterns } from "../Loading/LoadingIcon-v1/loading-icon.schema";
import { codeStreamV1Patterns } from "../Text/CodeStream-v1/code-stream.schema";
import { stackedRevealTextV1Patterns } from "../Text/StackedRevealText-v1/stacked-reveal-text.schema";
import { tornNoteCaptionV1Patterns } from "../Text/TornNoteCaption-v1/torn-note-caption.schema";
import { distressedTitleCardV1Patterns } from "../Text/DistressedTitleCard-v1/distressed-title-card.schema";
import { sprayPaintTextV1Patterns } from "../Text/SprayPaintText-v1/spray-paint-text.schema";
import { battleCalloutBannerV1Patterns } from "../UI/BattleCalloutBanner-v1/battle-callout-banner.schema";
import { asymmetricStatusPanelV1Patterns } from "../UI/AsymmetricStatusPanel-v1/asymmetric-status-panel.schema";
import { oneTakeLogoTextVariantProps } from "../Text/FlickerTitle-v1/flicker-title.schema";
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

export const mergedGlitchTextV1RandomPatterns = shallowMergePatternRecord(
  glitchTextV1RandomPatterns,
  local.glitchTextV1RandomPatterns,
) as typeof glitchTextV1RandomPatterns;

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

export const mergedRandomLinesV1Patterns = shallowMergePatternRecord(
  randomLinesV1Patterns,
  local.randomLinesBackgroundV1Patterns,
) as typeof randomLinesV1Patterns;

export const mergedDottedLineMarkerV1Patterns = shallowMergePatternRecord(
  dottedLineMarkerV1Patterns,
  local.dottedLineMarkerTextV1Patterns,
) as typeof dottedLineMarkerV1Patterns;

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

export const mergedCodeStreamV1Patterns = shallowMergePatternRecord(
  codeStreamV1Patterns,
  local.codeStreamV1Patterns,
) as typeof codeStreamV1Patterns;

export const mergedStackedRevealTextV1Patterns = shallowMergePatternRecord(
  stackedRevealTextV1Patterns,
  local.stackedRevealTextV1Patterns,
) as typeof stackedRevealTextV1Patterns;

export const mergedTornNoteCaptionV1Patterns = shallowMergePatternRecord(
  tornNoteCaptionV1Patterns,
  local.tornNoteCaptionV1Patterns,
) as typeof tornNoteCaptionV1Patterns;

export const mergedDistressedTitleCardV1Patterns = shallowMergePatternRecord(
  distressedTitleCardV1Patterns,
  local.distressedTitleCardV1Patterns,
) as typeof distressedTitleCardV1Patterns;

export const mergedSprayPaintTextV1Patterns = shallowMergePatternRecord(
  sprayPaintTextV1Patterns,
  local.sprayPaintTextV1Patterns,
) as typeof sprayPaintTextV1Patterns;

export const mergedBattleCalloutBannerV1Patterns = shallowMergePatternRecord(
  battleCalloutBannerV1Patterns,
  local.battleCalloutBannerV1Patterns,
) as typeof battleCalloutBannerV1Patterns;

export const mergedAsymmetricStatusPanelV1Patterns = shallowMergePatternRecord(
  asymmetricStatusPanelV1Patterns,
  local.asymmetricStatusPanelV1Patterns,
) as typeof asymmetricStatusPanelV1Patterns;

export const mergedOneTakeLogoTextV1Props = {
  ...oneTakeLogoTextVariantProps,
  ...(local.oneTakeLogoTextV1 || {}),
};

export const mergedLocationConfigsV1 =
  buildLocationConfigsFromCompositionKeys(local, locationV1CompositionKeys);

export const mergedMapLocationPointsV1 =
  buildMapLocationPointsFromCompositionKeys(local, locationV1CompositionKeys);
