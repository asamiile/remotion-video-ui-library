import { defaultIntroV1Props } from "../Intro/Intro/intro.schema";
import { loadingIconV1Patterns } from "../Loading/LoadingIcon/loading-icon.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedDefaultIntroV1Props = {
  ...defaultIntroV1Props,
  ...local.intro,
};

export const mergedLoadingIconV1Patterns = shallowMergePatternRecord(
  loadingIconV1Patterns,
  local.loadingIconV1Patterns,
) as typeof loadingIconV1Patterns;

