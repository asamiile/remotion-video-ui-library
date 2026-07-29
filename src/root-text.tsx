import { Composition, Folder } from "remotion";
import { CodeStreamTemplateV1 } from "./Text/CodeStream/CodeStreamTemplate";
import { codeStreamSchema } from "./Text/CodeStream/code-stream.schema";
import {
  mergedCodeStreamPatterns,
  defaultCodeStreamHorizontalProps,
  defaultCodeStreamVerticalProps,
} from "./Text/CodeStream/code-stream.schema";
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
import { glitchTextRandomSchema } from "./Text/GlitchText/glitch-text-random.schema";
import { glitchTextRandomDurationFrames } from "./Text/GlitchText/glitch-text-random.schema";
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
  mergedLocationConfigs,
  mergedLedTextPatterns,
  mergedNeonTextPatterns,
  mergedSlideInCaptionPatterns,
  mergedGlitchTextPatterns,
  mergedGlitchTextV1RandomPatterns,
  mergedWireTextPatterns,
  mergedNeonTextRainbowPatterns,
  mergedLightSweepTextPatterns,
  mergedDottedLineMarkerPatterns,
  mergedTypewriterTextPatterns,
  mergedShakeTextPatterns,
  mergedConfettiPopTextPatterns,
  mergedCodeStreamPatterns,
  mergedStackedRevealTextPatterns,
  mergedTornNoteCaptionPatterns,
  mergedDistressedTitleCardPatterns,
  mergedSprayPaintTextPatterns,
  mergedOneTakeLogoTextProps,
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
          schema={codeStreamSchema}
          defaultProps={mergedCodeStreamPatterns.horizontal ?? defaultCodeStreamHorizontalProps}
        />

        <Composition
          id="CodeStreamVerticalV1"
          component={withCanvasPreview("CodeStreamVerticalV1", CodeStreamTemplateV1)}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={3200}
          schema={codeStreamSchema}
          defaultProps={mergedCodeStreamPatterns.vertical ?? defaultCodeStreamVerticalProps}
        />
      </Folder>

      <Folder name="Location">
        {mergedLocationConfigs.map((config) => (
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
          patterns: mergedLedTextPatterns,
          idPrefix: "LedTextV1-",
          Template: LedTextTemplateV1,
          schema: ledTextSchemaV1,
          durationInFrames: 540,
        })}
      </Folder>

      <Folder name="NeonText">
        {renderPatternFamily({
          patterns: mergedNeonTextPatterns,
          idPrefix: "NeonTextV1-",
          Template: NeonTextTemplateV1,
          schema: neonTextSchemaV1,
          durationInFrames: 480,
        })}
      </Folder>

      <Folder name="SlideInCaption">
        {renderPatternFamily({
          patterns: mergedSlideInCaptionPatterns,
          idPrefix: "SlideInCaptionV1-",
          Template: SlideInCaptionTemplateV1,
          schema: slideInCaptionSchemaV1,
          durationInFrames: slideInCaptionV1DurationFrames,
        })}
      </Folder>

      <Folder name="GlitchText">
        {renderPatternFamily({
          patterns: mergedGlitchTextPatterns,
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
              durationInFrames={glitchTextRandomDurationFrames}
              schema={glitchTextRandomSchema}
              defaultProps={props}
            />
          )
        )}
      </Folder>

      <Folder name="WireText">
        {renderPatternFamily({
          patterns: mergedWireTextPatterns,
          idPrefix: "WireTextV1-",
          Template: WireTextTemplateV1,
          schema: wireTextSchemaV1,
          durationInFrames: wireTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="NeonTextRainbow">
        {renderPatternFamily({
          patterns: mergedNeonTextRainbowPatterns,
          idPrefix: "NeonTextV1-Rainbow",
          Template: NeonTextRainbowTemplateV1,
          schema: neonTextRainbowSchemaV1,
          durationInFrames: neonTextRainbowV1DurationFrames,
        })}
      </Folder>

      <Folder name="LightSweepText">
        {renderPatternFamily({
          patterns: mergedLightSweepTextPatterns,
          idPrefix: "LightSweepTextV1-",
          Template: LightSweepTextTemplateV1,
          schema: lightSweepTextSchemaV1,
          durationInFrames: lightSweepTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="DottedLineMarkerText">
        {Object.entries(mergedDottedLineMarkerPatterns).map(
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
          patterns: mergedTypewriterTextPatterns,
          idPrefix: "TypewriterTextV1-",
          Template: TypewriterTextTemplateV1,
          schema: typewriterTextSchemaV1,
          durationInFrames: typewriterTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="ShakeText">
        {renderPatternFamily({
          patterns: mergedShakeTextPatterns,
          idPrefix: "ShakeTextV1-",
          Template: ShakeTextTemplateV1,
          schema: shakeTextSchemaV1,
          durationInFrames: shakeTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="ConfettiPopText">
        {renderPatternFamily({
          patterns: mergedConfettiPopTextPatterns,
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
          defaultProps={{ ...mergedOneTakeLogoTextProps }}
        />
      </Folder>

      <Folder name="StackedRevealText">
        {renderPatternFamily({
          patterns: mergedStackedRevealTextPatterns,
          idPrefix: "StackedRevealTextV1-",
          Template: StackedRevealTextTemplateV1,
          schema: stackedRevealTextSchemaV1,
          durationInFrames: stackedRevealTextV1DurationFrames,
        })}
      </Folder>

      <Folder name="TornNoteCaption">
        {renderPatternFamily({
          patterns: mergedTornNoteCaptionPatterns,
          idPrefix: "TornNoteCaptionV1-",
          Template: TornNoteCaptionTemplateV1,
          schema: tornNoteCaptionSchemaV1,
          durationInFrames: tornNoteCaptionV1DurationFrames,
        })}
      </Folder>

      <Folder name="DistressedTitleCard">
        {renderPatternFamily({
          patterns: mergedDistressedTitleCardPatterns,
          idPrefix: "DistressedTitleCardV1-",
          Template: DistressedTitleCardTemplateV1,
          schema: distressedTitleCardSchemaV1,
          durationInFrames: distressedTitleCardV1DurationFrames,
        })}
      </Folder>

      <Folder name="SprayPaintText">
        {renderPatternFamily({
          patterns: mergedSprayPaintTextPatterns,
          idPrefix: "SprayPaintTextV1-",
          Template: SprayPaintTextTemplateV1,
          schema: sprayPaintTextSchemaV1,
          durationInFrames: sprayPaintTextV1DurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
