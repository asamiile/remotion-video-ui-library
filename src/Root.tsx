import "./index.css";
import { Composition, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { MyComposition } from "./Composition";
import { LocationTemplateV1 } from "./Location/Location-v1/LocationTemplate";
import { locationSchemaV1 } from "./Location/Location-v1/location-schema";
import { locationConfigsV1, defaultLocationV1Props } from "./Location/Location-v1/location-config";
import { PlaceholderImageV1 } from "./PlaceholderImage/PlaceholderImage-v1/PlaceholderImage";
import { MiniMapTemplateV1 } from "./Map/Map-v1/MiniMapTemplate";
import { miniMapSchemaV1 } from "./Map/Map-v1/mini-map-schema";
import { defaultMiniMapV1Props, mapLocationPointsV1 } from "./Map/Map-v1/mini-map-config";
import { LoadingIconTemplateV1 } from "./LoadingIcon/LoadingIcon-v1/LoadingIconTemplate";
import { loadingIconSchemaV1 } from "./LoadingIcon/LoadingIcon-v1/loading-icon-schema";
import { loadingIconV1Patterns } from "./LoadingIcon/LoadingIcon-v1/loading-icon-config";
import { AudioSpectrumTemplateV1 } from "./AudioSpectrum/AudioSpectrum-v1/AudioSpectrumTemplate";
import { audioSpectrumSchemaV1 } from "./AudioSpectrum/AudioSpectrum-v1/audio-spectrum-schema";
import { audioSpectrumV1Patterns, audioSpectrumAudioFilesV1, defaultAudioSpectrumV1Props } from "./AudioSpectrum/AudioSpectrum-v1/audio-spectrum-config";
import { IntroTemplateV1 } from "./Intro/Intro-v1/IntroTemplate";
import { introSchemaV1 } from "./Intro/Intro-v1/intro-schema";
import { defaultIntroV1Props, introScenesV1 } from "./Intro/Intro-v1/intro-config";
import { FPS } from "./helpers/ms-to-frame";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 仮置き画像 */}
      <Composition
        id="PlaceholderImageV1"
        component={PlaceholderImageV1}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={1800}
      />

      {/* LoadingIcon コンポジション */}
      {Object.entries(loadingIconV1Patterns).map(([patternId, patternProps]) => (
        <Composition
          key={patternId}
          id={`LoadingIconV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
          component={LoadingIconTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={loadingIconSchemaV1}
          defaultProps={patternProps}
        />
      ))}

      {/* AudioSpectrum パターン コンポジション */}
      {Object.entries(audioSpectrumV1Patterns).map(([patternId, patternProps]) => (
        <Composition
          key={patternId}
          id={`AudioSpectrumV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
          component={AudioSpectrumTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          schema={audioSpectrumSchemaV1}
          defaultProps={{
            ...patternProps,
            audioFile: `audio/AudioSpectrum/${audioSpectrumAudioFilesV1[0].filename}`,
          }}
          calculateMetadata={async ({ props }) => {
            const { slowDurationInSeconds } = await parseMedia({
              src: staticFile(props.audioFile),
              acknowledgeRemotionLicense: true,
              fields: {
                slowDurationInSeconds: true,
              },
            });

            return {
              durationInFrames: Math.floor(slowDurationInSeconds * FPS),
              fps: FPS,
            };
          }}
        />
      ))}

      {/* AudioSpectrum コンポジション（オーディオファイル別） */}
      {audioSpectrumAudioFilesV1.map((audioFile) => (
        <Composition
          key={audioFile.id}
          id={`AudioSpectrumV1-${audioFile.id}`}
          component={AudioSpectrumTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          schema={audioSpectrumSchemaV1}
          defaultProps={{
            ...defaultAudioSpectrumV1Props,
            audioFile: `audio/AudioSpectrum/${audioFile.filename}`,
          }}
          calculateMetadata={async ({ props }) => {
            const { slowDurationInSeconds } = await parseMedia({
              src: staticFile(props.audioFile),
              acknowledgeRemotionLicense: true,
              fields: {
                slowDurationInSeconds: true,
              },
            });

            return {
              durationInFrames: Math.floor(slowDurationInSeconds * FPS),
              fps: FPS,
            };
          }}
        />
      ))}

      {/* Mini Map コンポジション */}
      {mapLocationPointsV1.map((location) => (
        <Composition
          key={location.id}
          id={`MiniMapV1-${location.id}`}
          component={MiniMapTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={miniMapSchemaV1}
          defaultProps={{
            ...defaultMiniMapV1Props,
            mapLocationId: location.id,
          }}
        />
      ))}
      
      {/* 地名コンポジション */}
      {locationConfigsV1.map((config) => (
        <Composition
          key={config.id}
          id={`LocationV1-${config.id}`}
          component={LocationTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={locationSchemaV1}
          defaultProps={{
            ...defaultLocationV1Props,
            locationName: config.locationName,
          }}
        />
      ))}

      {/* Intro コンポジション */}
      <Composition
        id="IntroV1"
        component={IntroTemplateV1}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={introScenesV1.reduce((total, scene) => total + scene.duration, 0)}
        schema={introSchemaV1}
        defaultProps={{
          ...defaultIntroV1Props,
        }}
      />
    </>
  );
};
