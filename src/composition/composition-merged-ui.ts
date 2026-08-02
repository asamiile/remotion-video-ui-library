import { battleCalloutBannerPatterns } from "../UI/BattleCalloutBanner/battle-callout-banner.schema";
import { asymmetricStatusPanelPatterns } from "../UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import { framedFootageWindowPatterns } from "../UI/FramedFootageWindow/framed-footage-window.schema";
import { lowerThirdTopicLabelPatterns } from "../UI/LowerThirdTopicLabel/lower-third-topic-label.schema";
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

export const mergedFramedFootageWindowPatterns = shallowMergePatternRecord(
  framedFootageWindowPatterns,
  local.framedFootageWindowPatterns,
) as typeof framedFootageWindowPatterns;

export const mergedLowerThirdTopicLabelPatterns = shallowMergePatternRecord(
  lowerThirdTopicLabelPatterns,
  local.lowerThirdTopicLabelPatterns,
) as typeof lowerThirdTopicLabelPatterns;

