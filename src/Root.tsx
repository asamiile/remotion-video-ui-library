import "./index.css";
import { Composition, Folder, staticFile } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { LocationTemplateV1 } from "./Text/Location/Location-v1/LocationTemplate";
import { locationSchemaV1 } from "./Text/Location/Location-v1/location-schema";
import { defaultLocationV1Props } from "./Text/Location/Location-v1/location-config";
import { PlaceholderImageV1 } from "./Placeholder/PlaceholderImage-v1/PlaceholderImage";
import { MiniMapTemplateV1 } from "./Map/Map-v1/MiniMapTemplate";
import { miniMapSchemaV1 } from "./Map/Map-v1/mini-map-schema";
import { defaultMiniMapV1Props } from "./Map/Map-v1/mini-map-config";
import { LoadingIconTemplateV1 } from "./Loading/LoadingIcon-v1/LoadingIconTemplate";
import { loadingIconSchemaV1 } from "./Loading/LoadingIcon-v1/loading-icon-schema";
import { AmbientBlurOrbsTemplateV1 } from "./Background/AmbientBlurOrbs-v1/AmbientBlurOrbsTemplate";
import { ambientBlurOrbsSchemaV1 } from "./Background/AmbientBlurOrbs-v1/ambient-blur-orbs-schema";
import {
  defaultAmbientBlurOrbsV1Props,
  AMBIENT_BLUR_ORBS_V1_DURATION_FRAMES,
} from "./Background/AmbientBlurOrbs-v1/ambient-blur-orbs-config";
import { ScanLineTemplateV1 } from "./Background/ScanLine-v1/ScanLineTemplate";
import { scanLineSchemaV1 } from "./Background/ScanLine-v1/scan-line-schema";
import { scanLineV1Patterns } from "./Background/ScanLine-v1/scan-line-config";
import { AudioSpectrumTemplateV1 } from "./Audio/AudioSpectrum-v1/AudioSpectrumTemplate";
import { audioSpectrumSchemaV1 } from "./Audio/AudioSpectrum-v1/audio-spectrum-schema";
import {
  audioSpectrumV1Patterns,
  audioSpectrumAudioFilesV1,
  defaultAudioSpectrumV1Props,
} from "./Audio/AudioSpectrum-v1/audio-spectrum-config";
import { IntroTemplateV1 } from "./Intro/Intro-v1/IntroTemplate";
import { introSchemaV1 } from "./Intro/Intro-v1/intro-schema";
import { introSceneTimingV1 } from "./Intro/Intro-v1/intro-config";
import { LedTextTemplateV1 } from "./Text/LedText/LedText-v1/LedTextTemplate";
import { ledTextSchemaV1 } from "./Text/LedText/LedText-v1/led-text-schema";
import { NeonTextTemplateV1 } from "./Text/NeonText/NeonText-v1/NeonTextTemplate";
import { neonTextSchemaV1 } from "./Text/NeonText/NeonText-v1/neon-text-schema";
import { SlideInCaptionTemplateV1 } from "./Text/SlideInCaption/SlideInCaption-v1/SlideInCaptionTemplate";
import { slideInCaptionSchemaV1 } from "./Text/SlideInCaption/SlideInCaption-v1/slide-in-caption-schema";
import { slideInCaptionV1DurationFrames } from "./Text/SlideInCaption/SlideInCaption-v1/slide-in-caption-config";
import { GlitchTextTemplateV1 } from "./Text/GlitchText/GlitchText-v1/GlitchTextTemplate";
import { glitchTextSchemaV1 } from "./Text/GlitchText/GlitchText-v1/glitch-text-schema";
import { glitchTextV1DurationFrames } from "./Text/GlitchText/GlitchText-v1/glitch-text-config";
import { WireTextTemplateV1 } from "./Text/WireText/WireText-v1/WireTextTemplate";
import { wireTextSchemaV1 } from "./Text/WireText/WireText-v1/wire-text-schema";
import { wireTextV1DurationFrames } from "./Text/WireText/WireText-v1/wire-text-config";
import { NeonTextRainbowTemplateV1 } from "./Text/NeonTextRainbow/NeonTextRainbow-v1/NeonTextRainbowTemplate";
import { neonTextRainbowSchemaV1 } from "./Text/NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-schema";
import { neonTextRainbowV1DurationFrames } from "./Text/NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-config";
import { LightSweepTextTemplateV1 } from "./Text/LightSweepText/LightSweepText-v1/LightSweepTextTemplate";
import { lightSweepTextSchemaV1 } from "./Text/LightSweepText/LightSweepText-v1/light-sweep-text-schema";
import { lightSweepTextV1DurationFrames } from "./Text/LightSweepText/LightSweepText-v1/light-sweep-text-config";
import { TypewriterTextTemplateV1 } from "./Text/TypewriterText/TypewriterText-v1/TypewriterTextTemplate";
import { typewriterTextSchemaV1 } from "./Text/TypewriterText/TypewriterText-v1/typewriter-text-schema";
import { typewriterTextV1DurationFrames } from "./Text/TypewriterText/TypewriterText-v1/typewriter-text-config";
import { ShakeTextTemplateV1 } from "./Text/ShakeText/ShakeText-v1/ShakeTextTemplate";
import { shakeTextSchemaV1 } from "./Text/ShakeText/ShakeText-v1/shake-text-schema";
import { shakeTextV1DurationFrames } from "./Text/ShakeText/ShakeText-v1/shake-text-config";
import { ConfettiPopTextTemplateV1 } from "./Text/ConfettiPopText/ConfettiPopText-v1/ConfettiPopTextTemplate";
import { confettiPopTextSchemaV1 } from "./Text/ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-schema";
import { confettiPopTextV1DurationFrames } from "./Text/ConfettiPopText/ConfettiPopText-v1/confetti-pop-text-config";
import { FlickerTitleTemplateV1 } from "./Text/FlickerTitle-v1/FlickerTitleTemplate";
import { flickerTitleSchemaV1 } from "./Text/FlickerTitle-v1/flicker-title-schema";
import {
  defaultFlickerTitleV1Props,
  FLICKER_TITLE_V1_DURATION_FRAMES,
} from "./Text/FlickerTitle-v1/flicker-title-config";
import { OnboardingConnectTemplateV1 } from "./OneTake/Onboarding/OnboardingConnect-v1/OnboardingConnectTemplate";
import { onboardingConnectSchemaV1 } from "./OneTake/Onboarding/OnboardingConnect-v1/onboarding-connect-schema";
import {
  defaultOnboardingConnectV1Props,
  ONBOARDING_CONNECT_V1_DURATION_FRAMES,
} from "./OneTake/Onboarding/OnboardingConnect-v1/onboarding-connect-config";
import { OnboardingOperateTemplateV1 } from "./OneTake/Onboarding/OnboardingOperate-v1/OnboardingOperateTemplate";
import { onboardingOperateSchemaV1 } from "./OneTake/Onboarding/OnboardingOperate-v1/onboarding-operate-schema";
import {
  defaultOnboardingOperateV1Props,
  ONBOARDING_OPERATE_V1_DURATION_FRAMES,
} from "./OneTake/Onboarding/OnboardingOperate-v1/onboarding-operate-config";
import { OneTakeLogoTemplateV1 } from "./OneTake/Logo/OneTakeLogo-v1/OneTakeLogoTemplate";
import { oneTakeLogoSchemaV1 } from "./OneTake/Logo/OneTakeLogo-v1/onetake-logo-schema";
import { oneTakeLogoV1Patterns } from "./OneTake/Logo/OneTakeLogo-v1/onetake-logo-config";
import { OneTakeLogoTextTemplateV1 } from "./OneTake/Logo/OneTakeLogoText-v1/OneTakeLogoTextTemplate";
import { oneTakeLogoTextSchemaV1 } from "./OneTake/Logo/OneTakeLogoText-v1/onetake-logo-text-schema";
import {
  defaultOneTakeLogoTextV1Props,
  ONETAKE_LOGO_TEXT_V1_DURATION_FRAMES,
} from "./OneTake/Logo/OneTakeLogoText-v1/onetake-logo-text-config";
import { StackedRevealTextTemplateV1 } from "./Text/StackedRevealText/StackedRevealText-v1/StackedRevealTextTemplate";
import { stackedRevealTextSchemaV1 } from "./Text/StackedRevealText/StackedRevealText-v1/stacked-reveal-text-schema";
import { stackedRevealTextV1DurationFrames } from "./Text/StackedRevealText/StackedRevealText-v1/stacked-reveal-text-config";
import { TornNoteCaptionTemplateV1 } from "./Text/TornNoteCaption/TornNoteCaption-v1/TornNoteCaptionTemplate";
import { tornNoteCaptionSchemaV1 } from "./Text/TornNoteCaption/TornNoteCaption-v1/torn-note-caption-schema";
import { tornNoteCaptionV1DurationFrames } from "./Text/TornNoteCaption/TornNoteCaption-v1/torn-note-caption-config";
import { FilmGrainOverlayTemplateV1 } from "./Background/FilmGrainOverlay-v1/FilmGrainOverlayTemplate";
import { filmGrainOverlaySchemaV1 } from "./Background/FilmGrainOverlay-v1/film-grain-overlay-schema";
import { filmGrainOverlayV1Patterns } from "./Background/FilmGrainOverlay-v1/film-grain-overlay-config";
import { DuotoneGradeOverlayTemplateV1 } from "./Background/DuotoneGradeOverlay-v1/DuotoneGradeOverlayTemplate";
import { duotoneGradeOverlaySchemaV1 } from "./Background/DuotoneGradeOverlay-v1/duotone-grade-overlay-schema";
import { duotoneGradeOverlayV1Patterns } from "./Background/DuotoneGradeOverlay-v1/duotone-grade-overlay-config";
import { GlitchTransitionBridgeTemplateV1 } from "./Effect/GlitchTransitionBridge/GlitchTransitionBridge-v1/GlitchTransitionBridgeTemplate";
import { glitchTransitionBridgeSchemaV1 } from "./Effect/GlitchTransitionBridge/GlitchTransitionBridge-v1/glitch-transition-bridge-schema";
import {
  defaultGlitchTransitionBridgeV1Props,
  glitchTransitionBridgeV1DurationFrames,
} from "./Effect/GlitchTransitionBridge/GlitchTransitionBridge-v1/glitch-transition-bridge-config";
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
  mergedStackedRevealTextV1Patterns,
  mergedTornNoteCaptionV1Patterns,
} from "./composition/composition-merged";
import { FPS } from "./helpers/ms-to-frame";
import { withCanvasPreview } from "./composition/with-canvas-preview";
import type { z } from "zod";

function capPattern(patternId: string) {
  return patternId.charAt(0).toUpperCase() + patternId.slice(1);
}

/**
 * Registers one `<Composition>` per entry of a `*Patterns` record, matching
 * the `<IdPrefix><CappedPatternId>` naming Root.tsx uses everywhere else.
 * Covers the common case shared by most families; AudioSpectrum (which also
 * needs `calculateMetadata`) and the location/map families (which map over
 * arrays keyed by id, not pattern records) are still registered inline.
 */
function renderPatternFamily<Props extends Record<string, unknown>>({
  patterns,
  idPrefix,
  Template,
  schema,
  width = 1920,
  height = 1080,
  durationInFrames,
}: {
  patterns: Record<string, Props>;
  idPrefix: string;
  Template: React.FC<Props>;
  schema: z.ZodType<Props>;
  width?: number;
  height?: number;
  durationInFrames: number | ((patternProps: Props) => number);
}) {
  return Object.entries(patterns).map(([patternId, patternProps]) => {
    const id = `${idPrefix}${capPattern(patternId)}`;
    return (
      <Composition
        key={patternId}
        id={id}
        component={withCanvasPreview(id, Template)}
        width={width}
        height={height}
        fps={FPS}
        durationInFrames={
          typeof durationInFrames === "function"
            ? durationInFrames(patternProps)
            : durationInFrames
        }
        schema={schema}
        defaultProps={patternProps}
      />
    );
  });
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Placeholder image */}
      <Folder name="Placeholder">
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


      {/* LoadingIcon compositions. A single feature with no siblings yet,
          so it sits directly under Loading rather than getting its own
          sub-Folder (same reasoning as Background/AmbientBlurOrbs-v1). */}
      <Folder name="Loading">
        {renderPatternFamily({
          patterns: mergedLoadingIconV1Patterns,
          idPrefix: "LoadingIconV1-",
          Template: LoadingIconTemplateV1,
          schema: loadingIconSchemaV1,
          durationInFrames: 1800,
        })}
      </Folder>

      {/* AudioSpectrum compositions (by pattern, and by audio file) */}
      <Folder name="Audio">
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

      {/* Mini Map compositions */}
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

      {/* Title compositions (text effects + location names). Same family
          structure as render.sh TextEffects / scripts/list-text-v1-composition-ids.cjs,
          plus Location */}
      <Folder name="Text">
        {/* Location name compositions */}
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

        {/* LED text compositions */}
        <Folder name="LedText">
          {renderPatternFamily({
            patterns: mergedLedTextV1Patterns,
            idPrefix: "LedTextV1-",
            Template: LedTextTemplateV1,
            schema: ledTextSchemaV1,
            durationInFrames: 540,
          })}
        </Folder>

        {/* Neon sign text compositions */}
        <Folder name="NeonText">
          {renderPatternFamily({
            patterns: mergedNeonTextV1Patterns,
            idPrefix: "NeonTextV1-",
            Template: NeonTextTemplateV1,
            schema: neonTextSchemaV1,
            durationInFrames: 480,
          })}
        </Folder>

        {/* Slide-in + mask (bottom-left caption) */}
        <Folder name="SlideInCaption">
          {renderPatternFamily({
            patterns: mergedSlideInCaptionV1Patterns,
            idPrefix: "SlideInCaptionV1-",
            Template: SlideInCaptionTemplateV1,
            schema: slideInCaptionSchemaV1,
            durationInFrames: slideInCaptionV1DurationFrames,
          })}
        </Folder>

        {/* Glitch text (tester / signal imagery) */}
        <Folder name="GlitchText">
          {renderPatternFamily({
            patterns: mergedGlitchTextV1Patterns,
            idPrefix: "GlitchTextV1-",
            Template: GlitchTextTemplateV1,
            schema: glitchTextSchemaV1,
            durationInFrames: glitchTextV1DurationFrames,
          })}
        </Folder>

        {/* Wire outline trace (path + trim) */}
        <Folder name="WireText">
          {renderPatternFamily({
            patterns: mergedWireTextV1Patterns,
            idPrefix: "WireTextV1-",
            Template: WireTextTemplateV1,
            schema: wireTextSchemaV1,
            durationInFrames: wireTextV1DurationFrames,
          })}
        </Folder>

        {/* Rainbow gradient cycling neon (tube) */}
        <Folder name="NeonTextRainbow">
          {renderPatternFamily({
            patterns: mergedNeonTextRainbowV1Patterns,
            idPrefix: "NeonTextV1-Rainbow",
            Template: NeonTextRainbowTemplateV1,
            schema: neonTextRainbowSchemaV1,
            durationInFrames: neonTextRainbowV1DurationFrames,
          })}
        </Folder>

        {/* Light sweep (completion / speed feel) */}
        <Folder name="LightSweepText">
          {renderPatternFamily({
            patterns: mergedLightSweepTextV1Patterns,
            idPrefix: "LightSweepTextV1-",
            Template: LightSweepTextTemplateV1,
            schema: lightSweepTextSchemaV1,
            durationInFrames: lightSweepTextV1DurationFrames,
          })}
        </Folder>

        {/* Typewriter (single line, code-style) */}
        <Folder name="TypewriterText">
          {renderPatternFamily({
            patterns: mergedTypewriterTextV1Patterns,
            idPrefix: "TypewriterTextV1-",
            Template: TypewriterTextTemplateV1,
            schema: typewriterTextSchemaV1,
            durationInFrames: typewriterTextV1DurationFrames,
          })}
        </Folder>

        {/* Shake (trial-and-error / jitter) */}
        <Folder name="ShakeText">
          {renderPatternFamily({
            patterns: mergedShakeTextV1Patterns,
            idPrefix: "ShakeTextV1-",
            Template: ShakeTextTemplateV1,
            schema: shakeTextSchemaV1,
            durationInFrames: shakeTextV1DurationFrames,
          })}
        </Folder>

        {/* Party popper / completion (confetti + ring) */}
        <Folder name="ConfettiPopText">
          {renderPatternFamily({
            patterns: mergedConfettiPopTextV1Patterns,
            idPrefix: "ConfettiPopTextV1-",
            Template: ConfettiPopTextTemplateV1,
            schema: confettiPopTextSchemaV1,
            durationInFrames: confettiPopTextV1DurationFrames,
          })}
        </Folder>

        {/* eyebrow + title two-line heading. The eyebrow flickers on once,
            neon-tube-ignition style (generic version of OneTake-LogoTextV1).
            A single composition with no pattern family, so it sits directly
            under Text like Background-AmbientBlurOrbsV1 does under Background,
            rather than getting its own sub-Folder. */}
        <Composition
          id="FlickerTitleV1"
          component={withCanvasPreview(
            "FlickerTitleV1",
            FlickerTitleTemplateV1,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={FLICKER_TITLE_V1_DURATION_FRAMES}
          schema={flickerTitleSchemaV1}
          defaultProps={{ ...defaultFlickerTitleV1Props }}
        />

        {/* Stacked reveal (add one line at a time, hard cut / from an analysis
            of HUNTER×HUNTER PV techniques) */}
        <Folder name="StackedRevealText">
          {renderPatternFamily({
            patterns: mergedStackedRevealTextV1Patterns,
            idPrefix: "StackedRevealTextV1-",
            Template: StackedRevealTextTemplateV1,
            schema: stackedRevealTextSchemaV1,
            durationInFrames: stackedRevealTextV1DurationFrames,
          })}
        </Folder>

        {/* Torn-paper / polaroid-style dialogue caption (from an analysis of
            HUNTER×HUNTER PV techniques) */}
        <Folder name="TornNoteCaption">
          {renderPatternFamily({
            patterns: mergedTornNoteCaptionV1Patterns,
            idPrefix: "TornNoteCaptionV1-",
            Template: TornNoteCaptionTemplateV1,
            schema: tornNoteCaptionSchemaV1,
            durationInFrames: tornNoteCaptionV1DurationFrames,
          })}
        </Folder>
      </Folder>

      {/* Intro compositions */}
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

      {/* Motion graphics for OneTake (phone + PC companion app) */}
      <Folder name="OneTake">
        {/* For onboarding */}
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

        {/* Logo bar-wave animation */}
        <Folder name="Logo">
          {renderPatternFamily({
            patterns: oneTakeLogoV1Patterns,
            idPrefix: "OneTake-LogoV1-",
            Template: OneTakeLogoTemplateV1,
            schema: oneTakeLogoSchemaV1,
            width: 1024,
            height: 1024,
            // Assumes a seamless loop, so the duration must match each
            // pattern's wavePeriodFrames*motionCyclesBeforeHold+holdFrames
            durationInFrames: (patternProps) =>
              patternProps.wavePeriodFrames *
                patternProps.motionCyclesBeforeHold +
              patternProps.holdFrames,
          })}
          <Composition
            id="OneTake-LogoTextV1"
            component={withCanvasPreview(
              "OneTake-LogoTextV1",
              OneTakeLogoTextTemplateV1,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={ONETAKE_LOGO_TEXT_V1_DURATION_FRAMES}
            schema={oneTakeLogoTextSchemaV1}
            defaultProps={{ ...defaultOneTakeLogoTextV1Props }}
          />
        </Folder>
      </Folder>

      {/* Ambient decoration parts layered over video backgrounds (always transparent backdrop) */}
      <Folder name="Background">
        <Composition
          id="Background-AmbientBlurOrbsV1"
          component={withCanvasPreview(
            "Background-AmbientBlurOrbsV1",
            AmbientBlurOrbsTemplateV1,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={AMBIENT_BLUR_ORBS_V1_DURATION_FRAMES}
          schema={ambientBlurOrbsSchemaV1}
          defaultProps={{ ...defaultAmbientBlurOrbsV1Props }}
        />
        {renderPatternFamily({
          patterns: scanLineV1Patterns,
          idPrefix: "Background-ScanLineV1-",
          Template: ScanLineTemplateV1,
          schema: scanLineSchemaV1,
          durationInFrames: (patternProps) => patternProps.scanPeriodFrames,
        })}

        {/* Constant duotone chromatic-aberration grading (from an analysis of
            HUNTER×HUNTER vol. 38 PV techniques) */}
        {renderPatternFamily({
          patterns: duotoneGradeOverlayV1Patterns,
          idPrefix: "Background-DuotoneGradeOverlayV1-",
          Template: DuotoneGradeOverlayTemplateV1,
          schema: duotoneGradeOverlaySchemaV1,
          durationInFrames: 150,
        })}

        {/* Climax/flashback particles and film scratches (from an analysis of
            HUNTER×HUNTER PV techniques) */}
        {renderPatternFamily({
          patterns: filmGrainOverlayV1Patterns,
          idPrefix: "Background-FilmGrainOverlayV1-",
          Template: FilmGrainOverlayTemplateV1,
          schema: filmGrainOverlaySchemaV1,
          durationInFrames: 150,
        })}
      </Folder>

      {/* Scene-transition effects (a category expected to grow) */}
      <Folder name="Effect">
        {/* RGB glitch + vertical light-streak transition bridge (from an
            analysis of HUNTER×HUNTER vol. 37 PV techniques) */}
        <Folder name="GlitchTransitionBridge">
          <Composition
            id="GlitchTransitionBridgeV1"
            component={withCanvasPreview(
              "GlitchTransitionBridgeV1",
              GlitchTransitionBridgeTemplateV1,
            )}
            width={1920}
            height={1080}
            fps={FPS}
            durationInFrames={glitchTransitionBridgeV1DurationFrames}
            schema={glitchTransitionBridgeSchemaV1}
            defaultProps={{ ...defaultGlitchTransitionBridgeV1Props }}
          />
        </Folder>
      </Folder>
    </>
  );
};
