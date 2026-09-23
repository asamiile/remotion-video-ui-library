import { defaultIntroProps } from "../Intro/Intro/intro.schema";
import { distressTransitionPatterns } from "../Effects/Transition/DistressTransition/distress-transition.schema";
import { scanEchoTransitionPatterns } from "../Effects/Transition/ScanEchoTransition/scan-echo-transition.schema";
import { loadingIconPatterns } from "../Loading/LoadingIcon/loading-icon.schema";
import { dotsLoaderPatterns } from "../Loading/DotsLoader/dots-loader.schema";
import { progressBarPatterns } from "../Loading/ProgressBar/progress-bar.schema";
import { pulseCirclePatterns } from "../Loading/PulseCircle/pulse-circle.schema";
import { skeletonScreenPatterns } from "../Loading/SkeletonScreen/skeleton-screen.schema";
import { radialSpinnerPatterns } from "../Loading/RadialSpinner/radial-spinner.schema";
import { radialGlowSpinnerPatterns } from "../Loading/RadialGlowSpinner/radial-glow-spinner.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedDefaultIntroProps = {
  ...defaultIntroProps,
  ...local.intro,
};

export const mergedDistressTransitionPatterns = shallowMergePatternRecord(
  distressTransitionPatterns,
  local.distressTransitionPatterns,
) as typeof distressTransitionPatterns;

export const mergedScanEchoTransitionPatterns = shallowMergePatternRecord(
  scanEchoTransitionPatterns,
  local.scanEchoTransitionPatterns,
) as typeof scanEchoTransitionPatterns;

export const mergedLoadingIconPatterns = shallowMergePatternRecord(
  loadingIconPatterns,
  local.loadingIconPatterns,
) as typeof loadingIconPatterns;

export const mergedDotsLoaderPatterns = shallowMergePatternRecord(
  dotsLoaderPatterns,
  local.dotsLoaderPatterns,
) as typeof dotsLoaderPatterns;

export const mergedProgressBarPatterns = shallowMergePatternRecord(
  progressBarPatterns,
  local.progressBarPatterns,
) as typeof progressBarPatterns;

export const mergedPulseCirclePatterns = shallowMergePatternRecord(
  pulseCirclePatterns,
  local.pulseCirclePatterns,
) as typeof pulseCirclePatterns;

export const mergedSkeletonScreenPatterns = shallowMergePatternRecord(
  skeletonScreenPatterns,
  local.skeletonScreenPatterns,
) as typeof skeletonScreenPatterns;

export const mergedRadialSpinnerPatterns = shallowMergePatternRecord(
  radialSpinnerPatterns,
  local.radialSpinnerPatterns,
) as typeof radialSpinnerPatterns;

export const mergedRadialGlowSpinnerPatterns = shallowMergePatternRecord(
  radialGlowSpinnerPatterns,
  local.radialGlowSpinnerPatterns,
) as typeof radialGlowSpinnerPatterns;

