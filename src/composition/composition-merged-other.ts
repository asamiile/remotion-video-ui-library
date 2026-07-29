import { defaultIntroV1Props } from "../Intro/Intro/intro.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedDefaultIntroV1Props = {
  ...defaultIntroV1Props,
  ...local.intro,
};

