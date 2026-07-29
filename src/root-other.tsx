import { Composition, Folder } from "remotion";
import { LoadingIconTemplateV1 } from "./Loading/LoadingIcon/LoadingIconTemplate";
import { loadingIconSchemaV1 } from "./Loading/LoadingIcon/loading-icon.schema";
import { MiniMapTemplateV1 } from "./Map/Map/MiniMapTemplate";
import { miniMapSchemaV1 } from "./Map/Map/mini-map.schema";
import { defaultMiniMapV1Props } from "./Map/Map/mini-map.schema";
import { AudioSpectrumTemplateV1 } from "./Audio/AudioSpectrum/AudioSpectrumTemplate";
import { audioSpectrumSchemaV1 } from "./Audio/AudioSpectrum/audio-spectrum.schema";
import {
  audioSpectrumV1Patterns,
  defaultAudioSpectrumV1Props,
} from "./Audio/AudioSpectrum/audio-spectrum.schema";
import { IntroTemplateV1 } from "./Intro/Intro/IntroTemplate";
import { introSchemaV1 } from "./Intro/Intro/intro.schema";
import { introSceneTimingV1 } from "./Intro/Intro/intro.schema";
import { PlaceholderImageV1 } from "./Placeholder/PlaceholderImage/PlaceholderImage";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import {
  mergedLoadingIconV1Patterns,
  mergedMapLocationPointsV1,
  mergedDefaultIntroV1Props,
} from "./composition/composition-merged-other";

const FPS = 30;

export function OtherFolder() {
  return (
    <>
      <Folder name="Loading">
        {renderPatternFamily({
          patterns: mergedLoadingIconV1Patterns,
          idPrefix: "LoadingIconV1-",
          Template: LoadingIconTemplateV1,
          schema: loadingIconSchemaV1,
          durationInFrames: 300,
        })}
      </Folder>

      <Folder name="Map">
        {mergedMapLocationPointsV1.map((locationPoint) => (
          <Composition
            key={locationPoint.id}
            id={`MiniMapV1-${locationPoint.id}`}
            component={withCanvasPreview(
              `MiniMapV1-${locationPoint.id}`,
              MiniMapTemplateV1,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={1800}
            schema={miniMapSchemaV1}
            defaultProps={{
              ...defaultMiniMapV1Props,
              locationPoint,
            }}
          />
        ))}
      </Folder>

      <Folder name="Audio">
        <Folder name="AudioSpectrum">
          <Folder name="Presets">
            {Object.entries(audioSpectrumV1Patterns).map(([patternName, props]) => (
              <Composition
                key={`AudioSpectrumV1-${patternName}`}
                id={`AudioSpectrumV1-${patternName}`}
                component={withCanvasPreview(
                  `AudioSpectrumV1-${patternName}`,
                  AudioSpectrumTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={1800}
                schema={audioSpectrumSchemaV1}
                defaultProps={{
                  ...defaultAudioSpectrumV1Props,
                  ...props,
                  audioFileName: "sample.wav",
                }}
              />
            ))}
          </Folder>
        </Folder>
      </Folder>

      <Folder name="Intro">
        <Composition
          id="IntroV1"
          component={IntroTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={3600}
          schema={introSchemaV1}
          defaultProps={mergedDefaultIntroV1Props}
        />
      </Folder>

      <Folder name="Placeholder">
        <Composition
          id="PlaceholderImageV1"
          component={PlaceholderImageV1}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1}
        />
      </Folder>
    </>
  );
}
