import "./index.css";
import { Composition, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { MyComposition } from "./composition/Composition";
import { LocationTemplateV1 } from "./Location/Location-v1/LocationTemplate";
import { locationSchemaV1 } from "./Location/Location-v1/location-schema";
import { defaultLocationV1Props } from "./Location/Location-v1/location-config";
import { PlaceholderImageV1 } from "./PlaceholderImage/PlaceholderImage-v1/PlaceholderImage";
import { MiniMapTemplateV1 } from "./Map/Map-v1/MiniMapTemplate";
import { miniMapSchemaV1 } from "./Map/Map-v1/mini-map-schema";
import { defaultMiniMapV1Props } from "./Map/Map-v1/mini-map-config";
import { LoadingIconTemplateV1 } from "./LoadingIcon/LoadingIcon-v1/LoadingIconTemplate";
import { loadingIconSchemaV1 } from "./LoadingIcon/LoadingIcon-v1/loading-icon-schema";
import { AudioSpectrumTemplateV1 } from "./AudioSpectrum/AudioSpectrum-v1/AudioSpectrumTemplate";
import { audioSpectrumSchemaV1 } from "./AudioSpectrum/AudioSpectrum-v1/audio-spectrum-schema";
import { audioSpectrumV1Patterns, audioSpectrumAudioFilesV1, defaultAudioSpectrumV1Props } from "./AudioSpectrum/AudioSpectrum-v1/audio-spectrum-config";
import { IntroTemplateV1 } from "./Intro/Intro-v1/IntroTemplate";
import { introSchemaV1 } from "./Intro/Intro-v1/intro-schema";
import { introSceneTimingV1 } from "./Intro/Intro-v1/intro-config";
import { LedTextTemplateV1 } from "./LedText/LedText-v1/LedTextTemplate";
import { ledTextSchemaV1 } from "./LedText/LedText-v1/led-text-schema";
import { NeonTextTemplateV1 } from "./NeonText/NeonText-v1/NeonTextTemplate";
import { neonTextSchemaV1 } from "./NeonText/NeonText-v1/neon-text-schema";
import { SlideInCaptionTemplateV1 } from "./SlideInCaption/SlideInCaption-v1/SlideInCaptionTemplate";
import { slideInCaptionSchemaV1 } from "./SlideInCaption/SlideInCaption-v1/slide-in-caption-schema";
import { slideInCaptionV1DurationFrames } from "./SlideInCaption/SlideInCaption-v1/slide-in-caption-config";
import { GlitchTextTemplateV1 } from "./GlitchText/GlitchText-v1/GlitchTextTemplate";
import { glitchTextSchemaV1 } from "./GlitchText/GlitchText-v1/glitch-text-schema";
import { glitchTextV1DurationFrames } from "./GlitchText/GlitchText-v1/glitch-text-config";
import { WireTextTemplateV1 } from "./WireText/WireText-v1/WireTextTemplate";
import { wireTextSchemaV1 } from "./WireText/WireText-v1/wire-text-schema";
import { wireTextV1DurationFrames } from "./WireText/WireText-v1/wire-text-config";
import { RainbowNeonTextTemplateV1 } from "./RainbowNeonText/RainbowNeonText-v1/RainbowNeonTextTemplate";
import { rainbowNeonTextSchemaV1 } from "./RainbowNeonText/RainbowNeonText-v1/rainbow-neon-text-schema";
import { rainbowNeonTextV1DurationFrames } from "./RainbowNeonText/RainbowNeonText-v1/rainbow-neon-text-config";
import { LightSweepTextTemplateV1 } from "./LightSweepText/LightSweepText-v1/LightSweepTextTemplate";
import { lightSweepTextSchemaV1 } from "./LightSweepText/LightSweepText-v1/light-sweep-text-schema";
import { lightSweepTextV1DurationFrames } from "./LightSweepText/LightSweepText-v1/light-sweep-text-config";
import { TypewriterTextTemplateV1 } from "./TypewriterText/TypewriterText-v1/TypewriterTextTemplate";
import { typewriterTextSchemaV1 } from "./TypewriterText/TypewriterText-v1/typewriter-text-schema";
import { typewriterTextV1DurationFrames } from "./TypewriterText/TypewriterText-v1/typewriter-text-config";
import { ShakeTextTemplateV1 } from "./ShakeText/ShakeText-v1/ShakeTextTemplate";
import { shakeTextSchemaV1 } from "./ShakeText/ShakeText-v1/shake-text-schema";
import { shakeTextV1DurationFrames } from "./ShakeText/ShakeText-v1/shake-text-config";
import { ConfettiPopTextTemplateV1 } from "./ConfettiPopText/ConfettiPopText-v1/ConfettiPopTextTemplate";
import { confettiPopTextSchemaV1 } from "./ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-schema";
import { confettiPopTextV1DurationFrames } from "./ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-config";
import {
  mergedDefaultIntroV1Props,
  mergedGlitchTextV1Patterns,
  mergedLightSweepTextV1Patterns,
  mergedLedTextV1Patterns,
  mergedLoadingIconV1Patterns,
  mergedLocationConfigsV1,
  mergedMapLocationPointsV1,
  mergedNeonTextV1Patterns,
  mergedRainbowNeonTextV1Patterns,
  mergedConfettiPopTextV1Patterns,
  mergedShakeTextV1Patterns,
  mergedSlideInCaptionV1Patterns,
  mergedTypewriterTextV1Patterns,
  mergedWireTextV1Patterns,
} from "./composition/composition-merged";
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
      {Object.entries(mergedLoadingIconV1Patterns).map(([patternId, patternProps]) => (
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
      {mergedMapLocationPointsV1.map((location) => (
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
      {mergedLocationConfigsV1.map((config) => (
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

      {/* LED テキスト コンポジション */}
      {Object.entries(mergedLedTextV1Patterns).map(([patternId, patternProps]) => (
        <Composition
          key={patternId}
          id={`LedTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
          component={LedTextTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={540}
          schema={ledTextSchemaV1}
          defaultProps={patternProps}
        />
      ))}

      {/* ネオンサインテキスト コンポジション */}
      {Object.entries(mergedNeonTextV1Patterns).map(([patternId, patternProps]) => (
        <Composition
          key={patternId}
          id={`NeonTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
          component={NeonTextTemplateV1}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={480}
          schema={neonTextSchemaV1}
          defaultProps={patternProps}
        />
      ))}

      {/* スライドイン＋マスク（左下キャプション） */}
      {Object.entries(mergedSlideInCaptionV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`SlideInCaptionV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={SlideInCaptionTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={slideInCaptionV1DurationFrames}
            schema={slideInCaptionSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* グリッチテキスト（テスター / 信号イメージ） */}
      {Object.entries(mergedGlitchTextV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`GlitchTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={GlitchTextTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={glitchTextV1DurationFrames}
            schema={glitchTextSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* ワイヤー輪郭トレース（パス・トリミング） */}
      {Object.entries(mergedWireTextV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`WireTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={WireTextTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={wireTextV1DurationFrames}
            schema={wireTextSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* 虹色グラデ循環ネオン（チューブ） */}
      {Object.entries(mergedRainbowNeonTextV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`RainbowNeonTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={RainbowNeonTextTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={rainbowNeonTextV1DurationFrames}
            schema={rainbowNeonTextSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* ライトスイープ（完了・疾走感） */}
      {Object.entries(mergedLightSweepTextV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`LightSweepTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={LightSweepTextTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={lightSweepTextV1DurationFrames}
            schema={lightSweepTextSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* タイプライター（1 行・コード風） */}
      {Object.entries(mergedTypewriterTextV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`TypewriterTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={TypewriterTextTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={typewriterTextV1DurationFrames}
            schema={typewriterTextSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* シェイク（試行錯誤・ジッター） */}
      {Object.entries(mergedShakeTextV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`ShakeTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={ShakeTextTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={shakeTextV1DurationFrames}
            schema={shakeTextSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* クラッカー／完成（紙吹雪・リング） */}
      {Object.entries(mergedConfettiPopTextV1Patterns).map(
        ([patternId, patternProps]) => (
          <Composition
            key={patternId}
            id={`ConfettiPopTextV1-${patternId.charAt(0).toUpperCase() + patternId.slice(1)}`}
            component={ConfettiPopTextTemplateV1}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={confettiPopTextV1DurationFrames}
            schema={confettiPopTextSchemaV1}
            defaultProps={patternProps}
          />
        ),
      )}

      {/* Intro コンポジション */}
      <Composition
        id="IntroV1"
        component={IntroTemplateV1}
        width={1920}
        height={1080}
        fps={FPS}
        durationInFrames={introSceneTimingV1.reduce((total, scene) => total + scene.duration, 0)}
        schema={introSchemaV1}
        defaultProps={{
          ...mergedDefaultIntroV1Props,
        }}
      />
    </>
  );
};
