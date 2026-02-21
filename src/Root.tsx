import "./index.css";
import { Composition, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { MyComposition } from "./Composition";
import { LocationTemplate } from "./Location/LocationTemplate";
import { locationSchema } from "./Location/location-schema";
import { locationConfigs, defaultLocationProps } from "./Location/location-config";
import { PlaceholderImage } from "./PlaceholderImage";
import { MiniMapTemplate } from "./Map/MiniMapTemplate";
import { miniMapSchema } from "./Map/mini-map-schema";
import { defaultMiniMapProps, mapLocationPoints } from "./Map/mini-map-config";
import { LoadingIconTemplate } from "./LoadingIcon/LoadingIconTemplate";
import { loadingIconSchema } from "./LoadingIcon/loading-icon-schema";
import { loadingIconPatterns } from "./LoadingIcon/loading-icon-config";
import { AudioSpectrumTemplate } from "./AudioSpectrum/AudioSpectrumTemplate";
import { audioSpectrumSchema } from "./AudioSpectrum/audio-spectrum-schema";
import { audioSpectrumPatterns, audioSpectrumAudioFiles, defaultAudioSpectrumProps } from "./AudioSpectrum/audio-spectrum-config";
import { IntroTemplate } from "./Intro/IntroTemplate";
import { introSchema } from "./Intro/intro-schema";
import { defaultIntroProps, introScenes } from "./Intro/intro-config";
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
        id="PlaceholderImage"
        component={PlaceholderImage}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={1800}
      />

      {/* LoadingIcon コンポジション */}
      {Object.entries(loadingIconPatterns).map(([patternId, patternProps]) => (
        <Composition
          key={patternId}
          id={`LoadingIcon-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
          component={LoadingIconTemplate}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={loadingIconSchema}
          defaultProps={patternProps}
        />
      ))}

      {/* AudioSpectrum パターン コンポジション */}
      {Object.entries(audioSpectrumPatterns).map(([patternId, patternProps]) => (
        <Composition
          key={patternId}
          id={`AudioSpectrum-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
          component={AudioSpectrumTemplate}
          width={1920}
          height={1080}
          fps={FPS}
          schema={audioSpectrumSchema}
          defaultProps={{
            ...patternProps,
            audioFile: `audio/AudioSpectrum/${audioSpectrumAudioFiles[0].filename}`,
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
      {audioSpectrumAudioFiles.map((audioFile) => (
        <Composition
          key={audioFile.id}
          id={`AudioSpectrum-${audioFile.id}`}
          component={AudioSpectrumTemplate}
          width={1920}
          height={1080}
          fps={FPS}
          schema={audioSpectrumSchema}
          defaultProps={{
            ...defaultAudioSpectrumProps,
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
      {mapLocationPoints.map((location) => (
        <Composition
          key={location.id}
          id={`MiniMap-${location.id}`}
          component={MiniMapTemplate}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={miniMapSchema}
          defaultProps={{
            ...defaultMiniMapProps,
            mapLocationId: location.id,
          }}
        />
      ))}
      
      {/* 地名コンポジション */}
      {locationConfigs.map((config) => (
        <Composition
          key={config.id}
          id={`Location-${config.id}`}
          component={LocationTemplate}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={locationSchema}
          defaultProps={{
            ...defaultLocationProps,
            locationName: config.locationName,
          }}
        />
      ))}

      {/* Intro コンポジション */}
      <Composition
        id="Intro"
        component={IntroTemplate}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={introScenes.reduce((total, scene) => total + scene.duration, 0)}
        schema={introSchema}
        defaultProps={{
          ...defaultIntroProps,
        }}
      />
    </>
  );
};
