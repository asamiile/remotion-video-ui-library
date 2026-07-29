import { Composition, Folder } from "remotion";
import { OnboardingConnectTemplateV1 } from "./Motion/OneTake/Onboarding/OnboardingConnect-v1/OnboardingConnectTemplate";
import { onboardingConnectSchemaV1 } from "./Motion/OneTake/Onboarding/OnboardingConnect-v1/onboarding-connect.schema";
import {
  defaultOnboardingConnectV1Props,
  onboardingConnectV1DurationFrames,
} from "./Motion/OneTake/Onboarding/OnboardingConnect-v1/onboarding-connect.schema";
import { OnboardingOperateTemplateV1 } from "./Motion/OneTake/Onboarding/OnboardingOperate-v1/OnboardingOperateTemplate";
import { onboardingOperateSchemaV1 } from "./Motion/OneTake/Onboarding/OnboardingOperate-v1/onboarding-operate.schema";
import {
  defaultOnboardingOperateV1Props,
  onboardingOperateV1DurationFrames,
} from "./Motion/OneTake/Onboarding/OnboardingOperate-v1/onboarding-operate.schema";
import { OneTakeLogoTemplateV1 } from "./Logo/OneTake/OneTakeLogo-v1/OneTakeLogoTemplate";
import { oneTakeLogoSchemaV1 } from "./Logo/OneTake/OneTakeLogo-v1/onetake-logo.schema";
import { oneTakeLogoV1Patterns } from "./Logo/OneTake/OneTakeLogo-v1/onetake-logo.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";

const FPS = 30;

export function OneTakeFolder() {
  return (
    <>
      <Folder name="Motion">
        <Folder name="OneTake">
          <Folder name="Onboarding">
            <Composition
              id="OneTake-OnboardingConnectV1"
              component={withCanvasPreview(
                "OneTake-OnboardingConnectV1",
                OnboardingConnectTemplateV1,
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={onboardingConnectV1DurationFrames}
              schema={onboardingConnectSchemaV1}
              defaultProps={{ ...defaultOnboardingConnectV1Props }}
            />

            <Composition
              id="OneTake-OnboardingOperateV1"
              component={withCanvasPreview(
                "OneTake-OnboardingOperateV1",
                OnboardingOperateTemplateV1,
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={onboardingOperateV1DurationFrames}
              schema={onboardingOperateSchemaV1}
              defaultProps={{ ...defaultOnboardingOperateV1Props }}
            />
          </Folder>
        </Folder>
      </Folder>

      <Folder name="Logo">
        <Folder name="OneTake">
          {renderPatternFamily({
            patterns: oneTakeLogoV1Patterns,
            idPrefix: "OneTake-Logo",
            Template: OneTakeLogoTemplateV1,
            schema: oneTakeLogoSchemaV1,
            durationInFrames: 3600,
          })}
        </Folder>
      </Folder>
    </>
  );
}
