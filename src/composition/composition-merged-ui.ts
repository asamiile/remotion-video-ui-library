import { battleCalloutBannerV1Patterns } from "../UI/BattleCalloutBanner/battle-callout-banner.schema";
import { asymmetricStatusPanelV1Patterns } from "../UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import {
  getEffectiveCompositionText,
  shallowMergePatternRecord,
} from "./merge-composition-local";
const local = getEffectiveCompositionText();

export const mergedBattleCalloutBannerV1Patterns = shallowMergePatternRecord(
  battleCalloutBannerV1Patterns,
  local.battleCalloutBannerV1Patterns,
) as typeof battleCalloutBannerV1Patterns;

export const mergedAsymmetricStatusPanelV1Patterns = shallowMergePatternRecord(
  asymmetricStatusPanelV1Patterns,
  local.asymmetricStatusPanelV1Patterns,
) as typeof asymmetricStatusPanelV1Patterns;

