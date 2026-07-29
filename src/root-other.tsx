import { Composition, Folder } from "remotion";
import { LoadingIconTemplate } from "./Loading/LoadingIcon/LoadingIconTemplate";
import { loadingIconSchema } from "./Loading/LoadingIcon/loading-icon.schema";
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
import { introSceneTiming } from "./Intro/Intro/intro.schema";
import { AngstAnimationTemplate } from "./Background/AngstAnimation/AngstAnimationTemplate";
import { angstAnimationSchema, defaultAngstAnimationProps } from "./Background/AngstAnimation/angst-animation.schema";
import { AngstAnimationMultiShapeTemplate } from "./Background/AngstAnimation/AngstAnimationMultiShapeTemplate";
import { angstAnimationMultiShapeSchema, defaultAngstAnimationMultiShapeProps } from "./Background/AngstAnimation/angst-animation-multi-shape.schema";
import { PlaceholderImage } from "./Placeholder/PlaceholderImage/PlaceholderImage";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import {
  mergedLoadingIconPatterns,
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
            durationInFrames={1800}
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
                durationInFrames={1800}
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
          durationInFrames={3600}
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
          durationInFrames={1}
        />
      </Folder>

      <Folder name="Effects">
        <Composition
          id="AngstAnimation"
          component={withCanvasPreview(
            "AngstAnimation",
            AngstAnimationTemplate,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={900}
          schema={angstAnimationSchema}
          defaultProps={defaultAngstAnimationProps}
        />
        <Composition
          id="AngstAnimationMultiShape"
          component={withCanvasPreview(
            "AngstAnimationMultiShape",
            AngstAnimationMultiShapeTemplate,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={900}
          schema={angstAnimationMultiShapeSchema}
          defaultProps={defaultAngstAnimationMultiShapeProps}
        />
      </Folder>
    </>
  );
}
