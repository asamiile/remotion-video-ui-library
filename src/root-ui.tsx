import { Composition, Folder } from "remotion";
import { BattleCalloutBannerTemplateV1 } from "./UI/BattleCalloutBanner/BattleCalloutBanner-v1/BattleCalloutBannerTemplate";
import { battleCalloutBannerSchemaV1 } from "./UI/BattleCalloutBanner/BattleCalloutBanner-v1/battle-callout-banner.schema";
import { battleCalloutBannerV1DurationFrames } from "./UI/BattleCalloutBanner/BattleCalloutBanner-v1/battle-callout-banner.schema";
import { AsymmetricStatusPanelTemplateV1 } from "./UI/AsymmetricStatusPanel/AsymmetricStatusPanel-v1/AsymmetricStatusPanelTemplate";
import { asymmetricStatusPanelSchemaV1 } from "./UI/AsymmetricStatusPanel/AsymmetricStatusPanel-v1/asymmetric-status-panel.schema";
import { asymmetricStatusPanelV1DurationFrames } from "./UI/AsymmetricStatusPanel/AsymmetricStatusPanel-v1/asymmetric-status-panel.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import {
  mergedBattleCalloutBannerV1Patterns,
  mergedAsymmetricStatusPanelV1Patterns,
} from "./composition/composition-merged";

const FPS = 30;

export function UIFolder() {
  return (
    <Folder name="UI">
      <Folder name="BattleCalloutBanner">
        {renderPatternFamily({
          patterns: mergedBattleCalloutBannerV1Patterns,
          idPrefix: "BattleCalloutBannerV1-",
          Template: BattleCalloutBannerTemplateV1,
          schema: battleCalloutBannerSchemaV1,
          durationInFrames: battleCalloutBannerV1DurationFrames,
        })}
      </Folder>

      <Folder name="AsymmetricStatusPanel">
        {renderPatternFamily({
          patterns: mergedAsymmetricStatusPanelV1Patterns,
          idPrefix: "AsymmetricStatusPanelV1-",
          Template: AsymmetricStatusPanelTemplateV1,
          schema: asymmetricStatusPanelSchemaV1,
          durationInFrames: asymmetricStatusPanelV1DurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
