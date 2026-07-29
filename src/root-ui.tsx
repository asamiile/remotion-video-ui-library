import { Composition, Folder } from "remotion";
import { BattleCalloutBannerTemplate } from "./UI/BattleCalloutBanner/BattleCalloutBannerTemplate";
import { battleCalloutBannerSchema } from "./UI/BattleCalloutBanner/battle-callout-banner.schema";
import { battleCalloutBannerDurationFrames } from "./UI/BattleCalloutBanner/battle-callout-banner.schema";
import { AsymmetricStatusPanelTemplate } from "./UI/AsymmetricStatusPanel/AsymmetricStatusPanelTemplate";
import { asymmetricStatusPanelSchema } from "./UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import { asymmetricStatusPanelDurationFrames } from "./UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
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
          Template: BattleCalloutBannerTemplate,
          schema: battleCalloutBannerSchema,
          durationInFrames: battleCalloutBannerDurationFrames,
        })}
      </Folder>

      <Folder name="AsymmetricStatusPanel">
        {renderPatternFamily({
          patterns: mergedAsymmetricStatusPanelPatterns,
          idPrefix: "AsymmetricStatusPanelV1-",
          Template: AsymmetricStatusPanelTemplate,
          schema: asymmetricStatusPanelSchema,
          durationInFrames: asymmetricStatusPanelDurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
