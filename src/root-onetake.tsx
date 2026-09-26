import { minimumCompositionFrames } from "./composition/composition-duration";
import { Composition, Folder } from "remotion";
import { OnboardingConnectTemplate } from "./Motion/OneTake/Onboarding/OnboardingConnect/OnboardingConnectTemplate";
import { onboardingConnectSchema } from "./Motion/OneTake/Onboarding/OnboardingConnect/onboarding-connect.schema";
import {
  defaultOnboardingConnectProps,
  onboardingConnectDurationFrames,
} from "./Motion/OneTake/Onboarding/OnboardingConnect/onboarding-connect.schema";
import { OnboardingOperateTemplate } from "./Motion/OneTake/Onboarding/OnboardingOperate/OnboardingOperateTemplate";
import { onboardingOperateSchema } from "./Motion/OneTake/Onboarding/OnboardingOperate/onboarding-operate.schema";
import {
  defaultOnboardingOperateProps,
  onboardingOperateDurationFrames,
} from "./Motion/OneTake/Onboarding/OnboardingOperate/onboarding-operate.schema";
import { OnboardingTestTemplate } from "./Motion/OneTake/Onboarding/OnboardingTest/OnboardingTestTemplate";
import {
  defaultOnboardingTestProps,
  onboardingTestDurationFrames,
  onboardingTestSchema,
} from "./Motion/OneTake/Onboarding/OnboardingTest/onboarding-test.schema";
import { OneTakeLogoTemplate } from "./Logo/OneTake/OneTakeLogo/OneTakeLogoTemplate";
import { oneTakeLogoSchema } from "./Logo/OneTake/OneTakeLogo/onetake-logo.schema";
import { oneTakeLogoPatterns } from "./Logo/OneTake/OneTakeLogo/onetake-logo.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";

const FPS = 30;

export function OneTakeFolder() {
  return (
    <>
      <Folder name="Motion">
        <Folder name="OneTake">
          <Folder name="Onboarding">
            <Composition
              id="OneTake-OnboardingConnect"
              component={withCanvasPreview(
                "OneTake-OnboardingConnect",
                OnboardingConnectTemplate,
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={minimumCompositionFrames(onboardingConnectDurationFrames, FPS)}
              schema={onboardingConnectSchema}
              defaultProps={{ ...defaultOnboardingConnectProps }}
            />

            <Composition
              id="OneTake-OnboardingOperate"
              component={withCanvasPreview(
                "OneTake-OnboardingOperate",
                OnboardingOperateTemplate,
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={minimumCompositionFrames(onboardingOperateDurationFrames, FPS)}
              schema={onboardingOperateSchema}
              defaultProps={{ ...defaultOnboardingOperateProps }}
            />

            <Composition
              id="OneTake-OnboardingTest"
              component={withCanvasPreview(
                "OneTake-OnboardingTest",
                OnboardingTestTemplate,
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={minimumCompositionFrames(onboardingTestDurationFrames, FPS)}
              schema={onboardingTestSchema}
              defaultProps={{ ...defaultOnboardingTestProps }}
            />
          </Folder>
        </Folder>
      </Folder>

      <Folder name="Logo">
        <Folder name="OneTake">
          {renderPatternFamily({
            patterns: oneTakeLogoPatterns,
            idPrefix: "OneTake-Logo",
            Template: OneTakeLogoTemplate,
            schema: oneTakeLogoSchema,
            durationInFrames: 3600,
          })}
        </Folder>
      </Folder>
    </>
  );
}
