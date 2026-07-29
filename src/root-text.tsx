import { Composition, Folder } from "remotion";
import { CodeStreamTemplateV1 } from "./Text/CodeStream/CodeStreamTemplate";
import { codeStreamSchemaV1 } from "./Text/CodeStream/CodeStream-v1/code-stream-schema";
import {
  mergedCodeStreamV1Patterns,
  defaultCodeStreamHorizontalV1Props,
  defaultCodeStreamVerticalV1Props,
} from "./composition/composition-merged";
import { LocationTemplateV1 } from "./Text/Location/Location-v1/LocationTemplate";
import { locationSchemaV1 } from "./Text/Location/Location-v1/location-schema";
import { defaultLocationV1Props } from "./Text/Location/Location-v1/location-config";
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
import { GlitchTextRandomTemplateV1 } from "./Text/GlitchText/GlitchText-v1/GlitchTextRandomTemplate";
import { glitchTextRandomSchemaV1 } from "./Text/GlitchText/GlitchText-v1/glitch-text-random-schema";
import { glitchTextV1RandomDurationFrames } from "./Text/GlitchText/GlitchText-v1/glitch-text-random-config";
import { WireTextTemplateV1 } from "./Text/WireText/WireText-v1/WireTextTemplate";
import { wireTextSchemaV1 } from "./Text/WireText/WireText-v1/wire-text-schema";
import { wireTextV1DurationFrames } from "./Text/WireText/WireText-v1/wire-text-config";
import { NeonTextRainbowTemplateV1 } from "./Text/NeonTextRainbow/NeonTextRainbow-v1/NeonTextRainbowTemplate";
import { neonTextRainbowSchemaV1 } from "./Text/NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-schema";
import { neonTextRainbowV1DurationFrames } from "./Text/NeonTextRainbow/NeonTextRainbow-v1/neon-text-rainbow-config";
import { LightSweepTextTemplateV1 } from "./Text/LightSweepText/LightSweepText-v1/LightSweepTextTemplate";
import { lightSweepTextSchemaV1 } from "./Text/LightSweepText/LightSweepText-v1/light-sweep-text-schema";
import { lightSweepTextV1DurationFrames } from "./Text/LightSweepText/LightSweepText-v1/light-sweep-text-config";
import { DottedLineMarkerTextV1 } from "./Text/DottedLineMarkerText/DottedLineMarkerText-v1/DottedLineMarkerText";
import { dottedLineMarkerTextSchemaV1, dottedLineMarkerTextV1DurationFrames } from "./Text/DottedLineMarkerText/DottedLineMarkerText-v1/dotted-line-marker-text.composition";
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
import { defaultFlickerTitleV1Props, FLICKER_TITLE_V1_DURATION_FRAMES } from "./Text/FlickerTitle-v1/flicker-title-config";
import { OneTakeLogoTextTemplateV1 } from "./Text/FlickerTitle-v1/OneTakeLogoTextTemplate";
import { StackedRevealTextTemplateV1 } from "./Text/StackedRevealText/StackedRevealText-v1/StackedRevealTextTemplate";
import { stackedRevealTextSchemaV1 } from "./Text/StackedRevealText/StackedRevealText-v1/stacked-reveal-text-schema";
import { stackedRevealTextV1DurationFrames } from "./Text/StackedRevealText/StackedRevealText-v1/stacked-reveal-text-config";
import { TornNoteCaptionTemplateV1 } from "./Text/TornNoteCaption/TornNoteCaption-v1/TornNoteCaptionTemplate";
import { tornNoteCaptionSchemaV1 } from "./Text/TornNoteCaption/TornNoteCaption-v1/torn-note-caption-schema";
import { tornNoteCaptionV1DurationFrames } from "./Text/TornNoteCaption/TornNoteCaption-v1/torn-note-caption-config";
import { DistressedTitleCardTemplateV1 } from "./Text/DistressedTitleCard/DistressedTitleCard-v1/DistressedTitleCardTemplate";
import { distressedTitleCardSchemaV1 } from "./Text/DistressedTitleCard/DistressedTitleCard-v1/distressed-title-card-schema";
import { distressedTitleCardV1DurationFrames } from "./Text/DistressedTitleCard/DistressedTitleCard-v1/distressed-title-card-config";
import { SprayPaintTextTemplateV1 } from "./Text/SprayPaintText/SprayPaintText-v1/SprayPaintTextTemplate";
import { sprayPaintTextSchemaV1 } from "./Text/SprayPaintText/SprayPaintText-v1/spray-paint-text-schema";
import { sprayPaintTextV1DurationFrames } from "./Text/SprayPaintText/SprayPaintText-v1/spray-paint-text-config";
import {
  mergedLocationConfigsV1,
  mergedLedTextV1Patterns,
  mergedNeonTextV1Patterns,
  mergedSlideInCaptionV1Patterns,
  mergedGlitchTextV1Patterns,
  mergedGlitchTextV1RandomPatterns,
  mergedWireTextV1Patterns,
  mergedNeonTextRainbowV1Patterns,
  mergedLightSweepTextV1Patterns,
  mergedDottedLineMarkerV1Patterns,
  mergedTypewriterTextV1Patterns,
  mergedShakeTextV1Patterns,
  mergedConfettiPopTextV1Patterns,
  mergedStackedRevealTextV1Patterns,
  mergedTornNoteCaptionV1Patterns,
  mergedDistressedTitleCardV1Patterns,
  mergedSprayPaintTextV1Patterns,
  mergedOneTakeLogoTextV1Props,
} from "./composition/composition-merged";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";

const FPS = 30;

export function TextFolder() {
  return (
    <Folder name="Text">
      <Folder name="CodeStream">
        <Composition
          id="CodeStreamHorizontalV1"
          component={withCanvasPreview("CodeStreamHorizontalV1", CodeStreamTemplateV1)}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={codeStreamSchemaV1}
          defaultProps={mergedCodeStreamV1Patterns.horizontal ?? defaultCodeStreamHorizontalV1Props}
        />

        <Composition
          id="CodeStreamVerticalV1"
          component={withCanvasPreview("CodeStreamVerticalV1", CodeStreamTemplateV1)}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={3200}
          schema={codeStreamSchemaV1}
          defaultProps={mergedCodeStreamV1Patterns.vertical ?? defaultCodeStreamVerticalV1Props}
        />
      </Folder>

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

      <Folder name="LedText">
        {renderPatternFamily({
          patterns: mergedLedTextV1Patterns,
          idPrefix: "LedTextV1-",
          Template: LedTextTemplateV1,
          schema: ledTextSchemaV1,
          durationInFrames: 540,
        })}
      </Folder>

      <Folder name="NeonText">
        {renderPatternFamily({
          patterns: mergedNeonTextV1Patterns,
          idPrefix: "NeonTextV1-",
          Template: NeonTextTemplateV1,
          schema: neonTextSchemaV1,
          durationInFrames: 480,
        })}
      </Folder>

      <Folder name="SlideInCaption">
        {renderPatternFamily({
          patterns: mergedSlideInCaptionV1Patterns,
          idPrefix: "SlideInCaptionV1-",
          Template: SlideInCaptionTemplateV1,
          schema: slideInCaptionSchemaV1,
          durationInFrames: slideInCaptionV1DurationFrames,
        })}
      </Folder>

      <Folder name="GlitchText">
        {renderPatternFamily({
          patterns: mergedGlitchTextV1Patterns,
          idPrefix: "GlitchTextV1-",
          Template: GlitchTextTemplateV1,
          schema: glitchTextSchemaV1,
          durationInFrames: glitchTextV1DurationFrames,
        })}
        {Object.entries(mergedGlitchTextV1RandomPatterns).map(
          ([patternName, props]) => (
            <Composition
              key={`GlitchTextV1-Random-${patternName}`}
              id={`GlitchTextV1-Random-${patternName}`}
              component={withCanvasPreview(
                `GlitchTextV1-Random-${patternName}`,
                GlitchTextRandomTemplateV1
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={glitchTextV1RandomDurationFrames}
              schema={glitchTextRandomSchemaV1}
              defaultProps={props}
            />
          )
        )}
      </Folder>

      <Folder name="WireText">
        {renderPatternFamily({
          patterns: mergedWireTextV1Patterns,
          idPrefix: "WireTextV1-",
          Template: WireTextTemplateV1,
          schema: wireTextSchemaV1,
          durationInFrames: wireTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="NeonTextRainbow">
        {renderPatternFamily({
          patterns: mergedNeonTextRainbowV1Patterns,
          idPrefix: "NeonTextV1-Rainbow",
          Template: NeonTextRainbowTemplateV1,
          schema: neonTextRainbowSchemaV1,
          durationInFrames: neonTextRainbowV1DurationFrames,
        })}
      </Folder>

      <Folder name="LightSweepText">
        {renderPatternFamily({
          patterns: mergedLightSweepTextV1Patterns,
          idPrefix: "LightSweepTextV1-",
          Template: LightSweepTextTemplateV1,
          schema: lightSweepTextSchemaV1,
          durationInFrames: lightSweepTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="DottedLineMarkerText">
        {Object.entries(mergedDottedLineMarkerV1Patterns).map(
          ([patternName, props]) => (
            <Composition
              key={patternName}
              id={`DottedLineMarkerTextV1-${patternName}`}
              component={DottedLineMarkerTextV1}
              durationInFrames={dottedLineMarkerTextV1DurationFrames}
              width={1920}
              height={1080}
              fps={30}
              schema={dottedLineMarkerTextSchemaV1}
              defaultProps={props}
            />
          )
        )}
      </Folder>

      <Folder name="TypewriterText">
        {renderPatternFamily({
          patterns: mergedTypewriterTextV1Patterns,
          idPrefix: "TypewriterTextV1-",
          Template: TypewriterTextTemplateV1,
          schema: typewriterTextSchemaV1,
          durationInFrames: typewriterTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="ShakeText">
        {renderPatternFamily({
          patterns: mergedShakeTextV1Patterns,
          idPrefix: "ShakeTextV1-",
          Template: ShakeTextTemplateV1,
          schema: shakeTextSchemaV1,
          durationInFrames: shakeTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="ConfettiPopText">
        {renderPatternFamily({
          patterns: mergedConfettiPopTextV1Patterns,
          idPrefix: "ConfettiPopTextV1-",
          Template: ConfettiPopTextTemplateV1,
          schema: confettiPopTextSchemaV1,
          durationInFrames: confettiPopTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="FlickerTitle">
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

        <Composition
          id="OneTake-LogoTextV1"
          component={withCanvasPreview(
            "OneTake-LogoTextV1",
            OneTakeLogoTextTemplateV1,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={FLICKER_TITLE_V1_DURATION_FRAMES}
          schema={flickerTitleSchemaV1}
          defaultProps={{ ...mergedOneTakeLogoTextV1Props }}
        />
      </Folder>

      <Folder name="StackedRevealText">
        {renderPatternFamily({
          patterns: mergedStackedRevealTextV1Patterns,
          idPrefix: "StackedRevealTextV1-",
          Template: StackedRevealTextTemplateV1,
          schema: stackedRevealTextSchemaV1,
          durationInFrames: stackedRevealTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="TornNoteCaption">
        {renderPatternFamily({
          patterns: mergedTornNoteCaptionV1Patterns,
          idPrefix: "TornNoteCaptionV1-",
          Template: TornNoteCaptionTemplateV1,
          schema: tornNoteCaptionSchemaV1,
          durationInFrames: tornNoteCaptionV1DurationFrames,
        })}
      </Folder>

      <Folder name="DistressedTitleCard">
        {renderPatternFamily({
          patterns: mergedDistressedTitleCardV1Patterns,
          idPrefix: "DistressedTitleCardV1-",
          Template: DistressedTitleCardTemplateV1,
          schema: distressedTitleCardSchemaV1,
          durationInFrames: distressedTitleCardV1DurationFrames,
        })}
      </Folder>

      <Folder name="SprayPaintText">
        {renderPatternFamily({
          patterns: mergedSprayPaintTextV1Patterns,
          idPrefix: "SprayPaintTextV1-",
          Template: SprayPaintTextTemplateV1,
          schema: sprayPaintTextSchemaV1,
          durationInFrames: sprayPaintTextV1DurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
