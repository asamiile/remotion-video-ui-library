import { randomLinesPatterns } from "../Background/RandomLinesBackground/random-lines.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedRandomLinesPatterns = shallowMergePatternRecord(
  randomLinesPatterns,
  local.randomLinesBackgroundPatterns,
) as typeof randomLinesPatterns;

