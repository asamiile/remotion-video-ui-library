import { Composition, Folder } from "remotion";
import { BattleCalloutBannerTemplate } from "./UI/BattleCalloutBanner/BattleCalloutBannerTemplate";
import { battleCalloutBannerSchema } from "./UI/BattleCalloutBanner/battle-callout-banner.schema";
import { battleCalloutBannerDurationFrames } from "./UI/BattleCalloutBanner/battle-callout-banner.schema";
import { AsymmetricStatusPanelTemplate } from "./UI/AsymmetricStatusPanel/AsymmetricStatusPanelTemplate";
import { asymmetricStatusPanelSchema } from "./UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import { asymmetricStatusPanelDurationFrames } from "./UI/AsymmetricStatusPanel/asymmetric-status-panel.schema";
import { FramedFootageWindowTemplate } from "./UI/FramedFootageWindow/FramedFootageWindowTemplate";
import { framedFootageWindowSchema } from "./UI/FramedFootageWindow/framed-footage-window.schema";
import { framedFootageWindowDurationFrames } from "./UI/FramedFootageWindow/framed-footage-window.schema";
import { LowerThirdTopicLabelTemplate } from "./UI/LowerThirdTopicLabel/LowerThirdTopicLabelTemplate";
import { lowerThirdTopicLabelSchema } from "./UI/LowerThirdTopicLabel/lower-third-topic-label.schema";
import { lowerThirdTopicLabelDurationFrames } from "./UI/LowerThirdTopicLabel/lower-third-topic-label.schema";
import { CircularNeonLogoFrameTemplate } from "./UI/CircularNeonLogoFrame/CircularNeonLogoFrameTemplate";
import { circularNeonLogoFrameSchema } from "./UI/CircularNeonLogoFrame/circular-neon-logo-frame.schema";
import { circularNeonLogoFrameDurationFrames } from "./UI/CircularNeonLogoFrame/circular-neon-logo-frame.schema";
import { WaveAnnouncementBannerTemplate } from "./UI/WaveAnnouncementBanner/WaveAnnouncementBannerTemplate";
import { waveAnnouncementBannerSchema } from "./UI/WaveAnnouncementBanner/wave-announcement-banner.schema";
import { waveAnnouncementBannerDurationFrames } from "./UI/WaveAnnouncementBanner/wave-announcement-banner.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import {
  mergedBattleCalloutBannerPatterns,
  mergedAsymmetricStatusPanelPatterns,
  mergedFramedFootageWindowPatterns,
  mergedLowerThirdTopicLabelPatterns,
  mergedCircularNeonLogoFramePatterns,
  mergedWaveAnnouncementBannerPatterns,
} from "./composition/composition-merged-ui";

const FPS = 30;

export function UIFolder() {
  return (
    <Folder name="UI">
      <Folder name="BattleCalloutBanner">
        {renderPatternFamily({
          patterns: mergedBattleCalloutBannerPatterns,
          idPrefix: "BattleCalloutBanner-",
          Template: BattleCalloutBannerTemplate,
          schema: battleCalloutBannerSchema,
          durationInFrames: battleCalloutBannerDurationFrames,
        })}
      </Folder>

      <Folder name="AsymmetricStatusPanel">
        {renderPatternFamily({
          patterns: mergedAsymmetricStatusPanelPatterns,
          idPrefix: "AsymmetricStatusPanel-",
          Template: AsymmetricStatusPanelTemplate,
          schema: asymmetricStatusPanelSchema,
          durationInFrames: asymmetricStatusPanelDurationFrames,
        })}
      </Folder>

      <Folder name="FramedFootageWindow">
        {renderPatternFamily({
          patterns: mergedFramedFootageWindowPatterns,
          idPrefix: "FramedFootageWindow-",
          Template: FramedFootageWindowTemplate,
          schema: framedFootageWindowSchema,
          durationInFrames: framedFootageWindowDurationFrames,
        })}
      </Folder>

      <Folder name="LowerThirdTopicLabel">
        {renderPatternFamily({
          patterns: mergedLowerThirdTopicLabelPatterns,
          idPrefix: "LowerThirdTopicLabel-",
          Template: LowerThirdTopicLabelTemplate,
          schema: lowerThirdTopicLabelSchema,
          durationInFrames: lowerThirdTopicLabelDurationFrames,
        })}
      </Folder>

      <Folder name="CircularNeonLogoFrame">
        {renderPatternFamily({
          patterns: mergedCircularNeonLogoFramePatterns,
          idPrefix: "CircularNeonLogoFrame-",
          Template: CircularNeonLogoFrameTemplate,
          schema: circularNeonLogoFrameSchema,
          durationInFrames: circularNeonLogoFrameDurationFrames,
        })}
      </Folder>

      <Folder name="WaveAnnouncementBanner">
        {renderPatternFamily({
          patterns: mergedWaveAnnouncementBannerPatterns,
          idPrefix: "WaveAnnouncementBanner-",
          Template: WaveAnnouncementBannerTemplate,
          schema: waveAnnouncementBannerSchema,
          durationInFrames: waveAnnouncementBannerDurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
