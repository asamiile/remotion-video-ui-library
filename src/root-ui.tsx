import { Composition, Folder } from "remotion";
import { BattleCalloutBannerTemplateV1 } from "./UI/BattleCalloutBanner/BattleCalloutBannerTemplate";
import { battleCalloutBannerSchema } from "./UI/BattleCalloutBanner/battle-callout-banner.schema";
import { battleCalloutBannerV1DurationFrames } from "./UI/BattleCalloutBanner/battle-callout-banner.schema";
import { AsymmetricStatusPanelTemplateV1 } from "./UI/AsymmetricStatusPanel/AsymmetricStatusPanelTemplate";
import { asymmetricStatusPanelSchema } from "./UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import { asymmetricStatusPanelV1DurationFrames } from "./UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import {
  mergedBattleCalloutBannerPatterns,
  mergedAsymmetricStatusPanelPatterns,
} from "./composition/composition-merged-ui";

const FPS = 30;

export function UIFolder() {
  return (
    <Folder name="UI">
      <Folder name="BattleCalloutBanner">
        {renderPatternFamily({
          patterns: mergedBattleCalloutBannerPatterns,
          idPrefix: "BattleCalloutBannerV1-",
          Template: BattleCalloutBannerTemplateV1,
          schema: battleCalloutBannerSchema,
          durationInFrames: battleCalloutBannerV1DurationFrames,
        })}
      </Folder>

      <Folder name="AsymmetricStatusPanel">
        {renderPatternFamily({
          patterns: mergedAsymmetricStatusPanelPatterns,
          idPrefix: "AsymmetricStatusPanelV1-",
          Template: AsymmetricStatusPanelTemplateV1,
          schema: asymmetricStatusPanelSchema,
          durationInFrames: asymmetricStatusPanelV1DurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
