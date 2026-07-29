import { battleCalloutBannerPatterns } from "../UI/BattleCalloutBanner/battle-callout-banner.schema";
import { asymmetricStatusPanelPatterns } from "../UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedBattleCalloutBannerPatterns = shallowMergePatternRecord(
  battleCalloutBannerPatterns,
  local.battleCalloutBannerPatterns,
) as typeof battleCalloutBannerPatterns;

export const mergedAsymmetricStatusPanelPatterns = shallowMergePatternRecord(
  asymmetricStatusPanelPatterns,
  local.asymmetricStatusPanelPatterns,
) as typeof asymmetricStatusPanelPatterns;

