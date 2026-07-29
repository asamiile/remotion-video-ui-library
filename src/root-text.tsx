import { Composition, Folder } from "remotion";
import { CodeStreamTemplateV1 } from "./Text/CodeStream/CodeStreamTemplate";
import { codeStreamSchemaV1 } from "./Text/CodeStream/code-stream.schema";
import {
  mergedCodeStreamV1Patterns,
  defaultCodeStreamHorizontalV1Props,
  defaultCodeStreamVerticalV1Props,
} from "./composition/composition-merged-text";
import { LocationTemplateV1 } from "./Text/Location/LocationTemplate";
import { locationSchemaV1 } from "./Text/Location/location.schema";
import { defaultLocationV1Props } from "./Text/Location/location.schema";
import { LedTextTemplateV1 } from "./Text/LedText/LedTextTemplate";
import { ledTextSchemaV1 } from "./Text/LedText/led-text.schema";
import { NeonTextTemplateV1 } from "./Text/NeonText/NeonTextTemplate";
import { neonTextSchemaV1 } from "./Text/NeonText/neon-text.schema";
import { SlideInCaptionTemplateV1 } from "./Text/SlideInCaption/SlideInCaptionTemplate";
import { slideInCaptionSchemaV1 } from "./Text/SlideInCaption/slide-in-caption.schema";
import { slideInCaptionV1DurationFrames } from "./Text/SlideInCaption/slide-in-caption.schema";
import { GlitchTextTemplateV1 } from "./Text/GlitchText/GlitchTextTemplate";
import { glitchTextSchemaV1 } from "./Text/GlitchText/glitch-text.schema";
import { glitchTextV1DurationFrames } from "./Text/GlitchText/glitch-text.schema";
import { GlitchTextRandomTemplateV1 } from "./Text/GlitchText/GlitchTextRandomTemplate";
import { glitchTextRandomSchemaV1 } from "./Text/GlitchText/glitch-text-random.schema";
import { glitchTextV1RandomDurationFrames } from "./Text/GlitchText/glitch-text-random.schema";
import { WireTextTemplateV1 } from "./Text/WireText/WireTextTemplate";
import { wireTextSchemaV1 } from "./Text/WireText/wire-text.schema";
import { wireTextV1DurationFrames } from "./Text/WireText/wire-text.schema";
import { NeonTextRainbowTemplateV1 } from "./Text/NeonTextRainbow/NeonTextRainbowTemplate";
import { neonTextRainbowSchemaV1 } from "./Text/NeonTextRainbow/neon-text-rainbow.schema";
import { neonTextRainbowV1DurationFrames } from "./Text/NeonTextRainbow/neon-text-rainbow.schema";
import { LightSweepTextTemplateV1 } from "./Text/LightSweepText/LightSweepTextTemplate";
import { lightSweepTextSchemaV1 } from "./Text/LightSweepText/light-sweep-text.schema";
import { lightSweepTextV1DurationFrames } from "./Text/LightSweepText/light-sweep-text.schema";
import { DottedLineMarkerTextV1 } from "./Text/DottedLineMarkerText/DottedLineMarkerText";
import { dottedLineMarkerTextSchemaV1, dottedLineMarkerTextV1DurationFrames } from "./Text/DottedLineMarkerText/dotted-line-marker-text.schema";
import { TypewriterTextTemplateV1 } from "./Text/TypewriterText/TypewriterTextTemplate";
import { typewriterTextSchemaV1, typewriterTextV1DurationFrames } from "./Text/TypewriterText/typewriter-text.schema";
import { ShakeTextTemplateV1 } from "./Text/ShakeText/ShakeTextTemplate";
import { shakeTextSchemaV1 } from "./Text/ShakeText/shake-text.schema";
import { shakeTextV1DurationFrames } from "./Text/ShakeText/shake-text.schema";
import { ConfettiPopTextTemplateV1 } from "./Text/ConfettiPopText/ConfettiPopTextTemplate";
import { confettiPopTextSchemaV1 } from "./Text/ConfettiPopText/confetti-pop-text.schema";
import { confettiPopTextV1DurationFrames } from "./Text/ConfettiPopText/confetti-pop-text.schema";
import { FlickerTitleTemplateV1 } from "./Text/FlickerTitle/FlickerTitleTemplate";
import { flickerTitleSchemaV1 } from "./Text/FlickerTitle/flicker-title.schema";
import { defaultFlickerTitleV1Props, flickerTitleV1DurationFrames } from "./Text/FlickerTitle/flicker-title.schema";
import { OneTakeLogoTextTemplateV1 } from "./Text/FlickerTitle/OneTakeLogoTextTemplate";
import { StackedRevealTextTemplateV1 } from "./Text/StackedRevealText/StackedRevealTextTemplate";
import { stackedRevealTextSchemaV1 } from "./Text/StackedRevealText/stacked-reveal-text.schema";
import { stackedRevealTextV1DurationFrames } from "./Text/StackedRevealText/stacked-reveal-text.schema";
import { TornNoteCaptionTemplateV1 } from "./Text/TornNoteCaption/TornNoteCaptionTemplate";
import { tornNoteCaptionSchemaV1 } from "./Text/TornNoteCaption/torn-note-caption.schema";
import { tornNoteCaptionV1DurationFrames } from "./Text/TornNoteCaption/torn-note-caption.schema";
import { DistressedTitleCardTemplateV1 } from "./Text/DistressedTitleCard/DistressedTitleCardTemplate";
import { distressedTitleCardSchemaV1 } from "./Text/DistressedTitleCard/distressed-title-card.schema";
import { distressedTitleCardV1DurationFrames } from "./Text/DistressedTitleCard/distressed-title-card.schema";
import { SprayPaintTextTemplateV1 } from "./Text/SprayPaintText/SprayPaintTextTemplate";
import { sprayPaintTextSchemaV1 } from "./Text/SprayPaintText/spray-paint-text.schema";
import { sprayPaintTextV1DurationFrames } from "./Text/SprayPaintText/spray-paint-text.schema";
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
} from "./composition/composition-merged-text";
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
          durationInFrames={flickerTitleV1DurationFrames}
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
          durationInFrames={flickerTitleV1DurationFrames}
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
