import { randomLinesV1Patterns } from "../Background/RandomLinesBackground/random-lines.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedRandomLinesV1Patterns = shallowMergePatternRecord(
  randomLinesV1Patterns,
  local.randomLinesBackgroundV1Patterns,
) as typeof randomLinesV1Patterns;

