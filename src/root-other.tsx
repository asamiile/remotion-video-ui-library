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
            id={`MiniMapV1-${locationPoint.id}`}
            component={withCanvasPreview(
              `MiniMapV1-${locationPoint.id}`,
              MiniMapTemplate,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={1800}
            schema={miniMapSchema}
            defaultProps={{
              ...defaultMiniMapProps,
              locationPoint,
            }}
          />
        ))}
      </Folder>

      <Folder name="Audio">
        <Folder name="AudioSpectrum">
          <Folder name="Presets">
            {Object.entries(audioSpectrumPatterns).map(([patternName, props]) => (
              <Composition
                key={`AudioSpectrumV1-${patternName}`}
                id={`AudioSpectrumV1-${patternName}`}
                component={withCanvasPreview(
                  `AudioSpectrumV1-${patternName}`,
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
                  audioFile: "sample.wav",
                }}
              />
            ))}
          </Folder>
        </Folder>
      </Folder>

      <Folder name="Intro">
        <Composition
          id="IntroV1"
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
    </>
  );
}
