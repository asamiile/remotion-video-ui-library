import { minimumCompositionFrames } from "./composition/composition-duration";
import { Composition, Folder } from "remotion";
import { LoadingIconTemplate } from "./Loading/LoadingIcon/LoadingIconTemplate";
import { loadingIconSchema } from "./Loading/LoadingIcon/loading-icon.schema";
import { DotsLoaderTemplate } from "./Loading/DotsLoader/DotsLoaderTemplate";
import { dotsLoaderDurationFrames, dotsLoaderSchema } from "./Loading/DotsLoader/dots-loader.schema";
import { ProgressBarTemplate } from "./Loading/ProgressBar/ProgressBarTemplate";
import { progressBarDurationFrames, progressBarSchema } from "./Loading/ProgressBar/progress-bar.schema";
import { PulseCircleTemplate } from "./Loading/PulseCircle/PulseCircleTemplate";
import { pulseCircleDurationFrames, pulseCircleSchema } from "./Loading/PulseCircle/pulse-circle.schema";
import { SkeletonScreenTemplate } from "./Loading/SkeletonScreen/SkeletonScreenTemplate";
import { skeletonScreenDurationFrames, skeletonScreenSchema } from "./Loading/SkeletonScreen/skeleton-screen.schema";
import { RadialSpinnerTemplate } from "./Loading/RadialSpinner/RadialSpinnerTemplate";
import { radialSpinnerDurationFrames, radialSpinnerSchema } from "./Loading/RadialSpinner/radial-spinner.schema";
import { RadialGlowSpinnerTemplate } from "./Loading/RadialGlowSpinner/RadialGlowSpinnerTemplate";
import { radialGlowSpinnerDurationFrames, radialGlowSpinnerSchema } from "./Loading/RadialGlowSpinner/radial-glow-spinner.schema";
import { MiniMapTemplate } from "./Map/Map/MiniMapTemplate";
import { miniMapSchema } from "./Map/Map/mini-map.schema";
import { defaultMiniMapProps } from "./Map/Map/mini-map.schema";
import { AudioSpectrumTemplate } from "./Audio/AudioSpectrum/AudioSpectrumTemplate";
import { audioSpectrumSchema } from "./Audio/AudioSpectrum/audio-spectrum.schema";
import {
  audioSpectrumPatterns,
  defaultAudioSpectrumProps,
} from "./Audio/AudioSpectrum/audio-spectrum.schema";
import { IntroTemplate } from "./Intro/Intro/IntroTemplate";
import { introSchema } from "./Intro/Intro/intro.schema";
import { PlaceholderImage } from "./Placeholder/PlaceholderImage/PlaceholderImage";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import {
  mergedLoadingIconPatterns,
  mergedDotsLoaderPatterns,
  mergedProgressBarPatterns,
  mergedPulseCirclePatterns,
  mergedSkeletonScreenPatterns,
  mergedRadialSpinnerPatterns,
  mergedRadialGlowSpinnerPatterns,
  mergedDefaultIntroProps,
} from "./composition/composition-merged-other";
import {
  mergedMapLocationPoints,
} from "./composition/composition-merged-text";

const FPS = 30;

export function OtherFolder() {
  return (
    <>
      <Folder name="Loading">
        {renderPatternFamily({
          patterns: mergedLoadingIconPatterns,
          idPrefix: "LoadingIcon-",
          Template: LoadingIconTemplate,
          schema: loadingIconSchema,
          durationInFrames: 300,
        })}

        <Folder name="DotsLoader">
          {renderPatternFamily({
            patterns: mergedDotsLoaderPatterns,
            idPrefix: "DotsLoader-",
            Template: DotsLoaderTemplate,
            schema: dotsLoaderSchema,
            durationInFrames: dotsLoaderDurationFrames,
          })}
        </Folder>

        <Folder name="ProgressBar">
          {renderPatternFamily({
            patterns: mergedProgressBarPatterns,
            idPrefix: "ProgressBar-",
            Template: ProgressBarTemplate,
            schema: progressBarSchema,
            durationInFrames: progressBarDurationFrames,
          })}
        </Folder>

        <Folder name="PulseCircle">
          {renderPatternFamily({
            patterns: mergedPulseCirclePatterns,
            idPrefix: "PulseCircle-",
            Template: PulseCircleTemplate,
            schema: pulseCircleSchema,
            durationInFrames: pulseCircleDurationFrames,
          })}
        </Folder>

        <Folder name="SkeletonScreen">
          {renderPatternFamily({
            patterns: mergedSkeletonScreenPatterns,
            idPrefix: "SkeletonScreen-",
            Template: SkeletonScreenTemplate,
            schema: skeletonScreenSchema,
            durationInFrames: skeletonScreenDurationFrames,
          })}
        </Folder>

        <Folder name="RadialSpinner">
          {renderPatternFamily({
            patterns: mergedRadialSpinnerPatterns,
            idPrefix: "RadialSpinner-",
            Template: RadialSpinnerTemplate,
            schema: radialSpinnerSchema,
            durationInFrames: radialSpinnerDurationFrames,
          })}
        </Folder>

        <Folder name="RadialGlowSpinner">
          {renderPatternFamily({
            patterns: mergedRadialGlowSpinnerPatterns,
            idPrefix: "RadialGlowSpinner-",
            Template: RadialGlowSpinnerTemplate,
            schema: radialGlowSpinnerSchema,
            durationInFrames: radialGlowSpinnerDurationFrames,
          })}
        </Folder>
      </Folder>

      <Folder name="Map">
        {mergedMapLocationPoints.map((locationPoint) => (
          <Composition
            key={locationPoint.id}
            id={`MiniMap-${locationPoint.id}`}
            component={withCanvasPreview(
              `MiniMap-${locationPoint.id}`,
              MiniMapTemplate,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={minimumCompositionFrames(1800, FPS)}
            schema={miniMapSchema}
            defaultProps={{
              ...defaultMiniMapProps,
              mapLocationId: locationPoint.id,
            }}
          />
        ))}
      </Folder>

      <Folder name="Audio">
        <Folder name="AudioSpectrum">
          <Folder name="Presets">
            {Object.entries(audioSpectrumPatterns).map(([patternName, props]) => (
              <Composition
                key={`AudioSpectrum-${patternName}`}
                id={`AudioSpectrum-${patternName}`}
                component={withCanvasPreview(
                  `AudioSpectrum-${patternName}`,
                  AudioSpectrumTemplate,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={minimumCompositionFrames(1800, FPS)}
                schema={audioSpectrumSchema}
                defaultProps={{
                  ...defaultAudioSpectrumProps,
                  ...props,
                }}
              />
            ))}
          </Folder>
        </Folder>
      </Folder>

      <Folder name="Intro">
        <Composition
          id="Intro"
          component={IntroTemplate}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={minimumCompositionFrames(3600, FPS)}
          schema={introSchema}
          defaultProps={mergedDefaultIntroProps}
        />
      </Folder>

      <Folder name="Placeholder">
        <Composition
          id="PlaceholderImage"
          component={PlaceholderImage}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={minimumCompositionFrames(1, FPS)}
        />
      </Folder>

    </>
  );
}
