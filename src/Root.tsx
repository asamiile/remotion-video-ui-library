import "./index.css";
import { Composition, Folder, staticFile } from "remotion";
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
import {
  audioSpectrumV1Patterns,
  audioSpectrumAudioFilesV1,
  defaultAudioSpectrumV1Props,
} from "./AudioSpectrum/AudioSpectrum-v1/audio-spectrum-config";
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
import { NeonTextRainbowTemplateV1 } from "./NeonTextRainbow/NeonTextRainbow-v1/NeonTextRainbowTemplate";
import { neonTextRainbowSchemaV1 } from "./NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-schema";
import { neonTextRainbowV1DurationFrames } from "./NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-config";
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
import { OnboardingConnectTemplateV1 } from "./OneTake/OnboardingConnect-v1/OnboardingConnectTemplate";
import { onboardingConnectSchemaV1 } from "./OneTake/OnboardingConnect-v1/onboarding-connect-schema";
import {
  defaultOnboardingConnectV1Props,
  ONBOARDING_CONNECT_V1_DURATION_FRAMES,
} from "./OneTake/OnboardingConnect-v1/onboarding-connect-config";
import { OnboardingOperateTemplateV1 } from "./OneTake/OnboardingOperate-v1/OnboardingOperateTemplate";
import { onboardingOperateSchemaV1 } from "./OneTake/OnboardingOperate-v1/onboarding-operate-schema";
import {
  defaultOnboardingOperateV1Props,
  ONBOARDING_OPERATE_V1_DURATION_FRAMES,
} from "./OneTake/OnboardingOperate-v1/onboarding-operate-config";
import {
  mergedDefaultIntroV1Props,
  mergedGlitchTextV1Patterns,
  mergedLightSweepTextV1Patterns,
  mergedLedTextV1Patterns,
  mergedLoadingIconV1Patterns,
  mergedLocationConfigsV1,
  mergedMapLocationPointsV1,
  mergedNeonTextV1Patterns,
  mergedNeonTextRainbowV1Patterns,
  mergedConfettiPopTextV1Patterns,
  mergedShakeTextV1Patterns,
  mergedSlideInCaptionV1Patterns,
  mergedTypewriterTextV1Patterns,
  mergedWireTextV1Patterns,
} from "./composition/composition-merged";
import { FPS } from "./helpers/ms-to-frame";
import { withCanvasPreview } from "./composition/with-canvas-preview";

function capPattern(patternId: string) {
  return patternId.charAt(0).toUpperCase() + patternId.slice(1);
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={withCanvasPreview("MyComp", MyComposition)}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />

      {/* 仮置き画像 */}
      <Folder name="PlaceholderImage">
        <Composition
          id="PlaceholderImageV1"
          component={withCanvasPreview(
            "PlaceholderImageV1",
            PlaceholderImageV1,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
        />
      </Folder>

      {/* LoadingIcon コンポジション */}
      <Folder name="Loading">
        <Folder name="Icon">
          {Object.entries(mergedLoadingIconV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`LoadingIconV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `LoadingIconV1-${capPattern(patternId)}`,
                  LoadingIconTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={1800}
                schema={loadingIconSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>
      </Folder>

      {/* AudioSpectrum コンポジション（パターン別・オーディオファイル別） */}
      <Folder name="AudioSpectrum">
        {Object.entries(audioSpectrumV1Patterns).map(
          ([patternId, patternProps]) => (
            <Composition
              key={patternId}
              id={`AudioSpectrumV1-${capPattern(patternId)}`}
              component={withCanvasPreview(
                `AudioSpectrumV1-${capPattern(patternId)}`,
                AudioSpectrumTemplateV1,
              )}
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
          ),
        )}

        {audioSpectrumAudioFilesV1.map((audioFile) => (
          <Composition
            key={audioFile.id}
            id={`AudioSpectrumV1-${audioFile.id}`}
            component={withCanvasPreview(
              `AudioSpectrumV1-${audioFile.id}`,
              AudioSpectrumTemplateV1,
            )}
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
      </Folder>

      {/* Mini Map コンポジション */}
      <Folder name="Map">
        {mergedMapLocationPointsV1.map((location) => (
          <Composition
            key={location.id}
            id={`MiniMapV1-${location.id}`}
            component={withCanvasPreview(
              `MiniMapV1-${location.id}`,
              MiniMapTemplateV1,
            )}
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
      </Folder>

      {/* タイトル系（テキストエフェクト＋地名）コンポジション。render.sh TextEffects /
          scripts/list-text-v1-composition-ids.cjs と同じファミリー構成＋Location */}
      <Folder name="Title">
        {/* 地名コンポジション */}
        <Folder name="Location">
          {mergedLocationConfigsV1.map((config) => (
            <Composition
              key={config.id}
              id={`LocationV1-${config.id}`}
              component={withCanvasPreview(
                `LocationV1-${config.id}`,
                LocationTemplateV1,
              )}
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
        </Folder>

        {/* LED テキスト コンポジション */}
        <Folder name="LedText">
          {Object.entries(mergedLedTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`LedTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `LedTextV1-${capPattern(patternId)}`,
                  LedTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={540}
                schema={ledTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* ネオンサインテキスト コンポジション */}
        <Folder name="NeonText">
          {Object.entries(mergedNeonTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`NeonTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `NeonTextV1-${capPattern(patternId)}`,
                  NeonTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={480}
                schema={neonTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* スライドイン＋マスク（左下キャプション） */}
        <Folder name="SlideInCaption">
          {Object.entries(mergedSlideInCaptionV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`SlideInCaptionV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `SlideInCaptionV1-${capPattern(patternId)}`,
                  SlideInCaptionTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={slideInCaptionV1DurationFrames}
                schema={slideInCaptionSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* グリッチテキスト（テスター / 信号イメージ） */}
        <Folder name="GlitchText">
          {Object.entries(mergedGlitchTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`GlitchTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `GlitchTextV1-${capPattern(patternId)}`,
                  GlitchTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={glitchTextV1DurationFrames}
                schema={glitchTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* ワイヤー輪郭トレース（パス・トリミング） */}
        <Folder name="WireText">
          {Object.entries(mergedWireTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`WireTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `WireTextV1-${capPattern(patternId)}`,
                  WireTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={wireTextV1DurationFrames}
                schema={wireTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* 虹色グラデ循環ネオン（チューブ） */}
        <Folder name="NeonTextRainbow">
          {Object.entries(mergedNeonTextRainbowV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`NeonTextV1-Rainbow${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `NeonTextV1-Rainbow${capPattern(patternId)}`,
                  NeonTextRainbowTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={neonTextRainbowV1DurationFrames}
                schema={neonTextRainbowSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* ライトスイープ（完了・疾走感） */}
        <Folder name="LightSweepText">
          {Object.entries(mergedLightSweepTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`LightSweepTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `LightSweepTextV1-${capPattern(patternId)}`,
                  LightSweepTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={lightSweepTextV1DurationFrames}
                schema={lightSweepTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* タイプライター（1 行・コード風） */}
        <Folder name="TypewriterText">
          {Object.entries(mergedTypewriterTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`TypewriterTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `TypewriterTextV1-${capPattern(patternId)}`,
                  TypewriterTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={typewriterTextV1DurationFrames}
                schema={typewriterTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* シェイク（試行錯誤・ジッター） */}
        <Folder name="ShakeText">
          {Object.entries(mergedShakeTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`ShakeTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `ShakeTextV1-${capPattern(patternId)}`,
                  ShakeTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={shakeTextV1DurationFrames}
                schema={shakeTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>

        {/* クラッカー／完成（紙吹雪・リング） */}
        <Folder name="ConfettiPopText">
          {Object.entries(mergedConfettiPopTextV1Patterns).map(
            ([patternId, patternProps]) => (
              <Composition
                key={patternId}
                id={`ConfettiPopTextV1-${capPattern(patternId)}`}
                component={withCanvasPreview(
                  `ConfettiPopTextV1-${capPattern(patternId)}`,
                  ConfettiPopTextTemplateV1,
                )}
                width={1920}
                height={1080}
                fps={FPS}
                durationInFrames={confettiPopTextV1DurationFrames}
                schema={confettiPopTextSchemaV1}
                defaultProps={patternProps}
              />
            ),
          )}
        </Folder>
      </Folder>

      {/* Intro コンポジション */}
      <Folder name="Intro">
        <Composition
          id="IntroV1"
          component={withCanvasPreview("IntroV1", IntroTemplateV1)}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={introSceneTimingV1.reduce(
            (total, scene) => total + scene.duration,
            0,
          )}
          schema={introSchemaV1}
          defaultProps={{
            ...mergedDefaultIntroV1Props,
          }}
        />
      </Folder>

      {/* OneTake（スマホ+PC連携アプリ）のオンボーディング用モーショングラフィック */}
      <Folder name="OneTake">
        <Composition
          id="OneTake-OnboardingConnectV1"
          component={withCanvasPreview(
            "OneTake-OnboardingConnectV1",
            OnboardingConnectTemplateV1,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={ONBOARDING_CONNECT_V1_DURATION_FRAMES}
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
          durationInFrames={ONBOARDING_OPERATE_V1_DURATION_FRAMES}
          schema={onboardingOperateSchemaV1}
          defaultProps={{ ...defaultOnboardingOperateV1Props }}
        />
      </Folder>
    </>
  );
};
