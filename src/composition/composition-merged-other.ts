import { defaultIntroProps } from "../Intro/Intro/intro.schema";
import { loadingIconPatterns } from "../Loading/LoadingIcon/loading-icon.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedDefaultIntroProps = {
  ...defaultIntroProps,
  ...local.intro,
};

export const mergedLoadingIconPatterns = shallowMergePatternRecord(
  loadingIconPatterns,
  local.loadingIconPatterns,
) as typeof loadingIconPatterns;

