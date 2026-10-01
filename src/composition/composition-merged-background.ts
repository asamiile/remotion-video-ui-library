import { halftoneDotsPatterns } from "../Background/HalftoneDots/halftone-dots.schema";
import { randomLinesPatterns } from "../Background/RandomLinesBackground/random-lines.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedHalftoneDotsPatterns = shallowMergePatternRecord(
  halftoneDotsPatterns,
  local.halftoneDotsPatterns,
) as typeof halftoneDotsPatterns;

export const mergedRandomLinesPatterns = shallowMergePatternRecord(
  randomLinesPatterns,
  local.randomLinesBackgroundPatterns,
) as typeof randomLinesPatterns;

