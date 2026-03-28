import { defaultIntroV1Props } from "../Intro/Intro-v1/intro-config";
import { ledTextV1Patterns } from "../LedText/LedText-v1/led-text-config";
import { neonTextV1Patterns } from "../NeonText/NeonText-v1/neon-text-config";
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

export const mergedLoadingIconV1Patterns = shallowMergePatternRecord(
  loadingIconV1Patterns,
  local.loadingIconV1Patterns,
) as typeof loadingIconV1Patterns;

export const mergedLocationConfigsV1 =
  buildLocationConfigsFromCompositionKeys(local, locationV1CompositionKeys);

export const mergedMapLocationPointsV1 =
  buildMapLocationPointsFromCompositionKeys(local, locationV1CompositionKeys);
