import { Composition, Folder } from "remotion";
import { CodeStreamTemplateV1 } from "./Text/CodeStream/CodeStreamTemplate";
import { codeStreamSchema } from "./Text/CodeStream/code-stream.schema";
import {
  mergedCodeStreamPatterns,
  defaultCodeStreamHorizontalProps,
  defaultCodeStreamVerticalProps,
} from "./Text/CodeStream/code-stream.schema";
import { LocationTemplateV1 } from "./Text/Location/LocationTemplate";
import { locationSchema } from "./Text/Location/location.schema";
import { defaultLocationProps } from "./Text/Location/location.schema";
import { LedTextTemplateV1 } from "./Text/LedText/LedTextTemplate";
import { ledTextSchema } from "./Text/LedText/led-text.schema";
import { NeonTextTemplateV1 } from "./Text/NeonText/NeonTextTemplate";
import { neonTextSchema } from "./Text/NeonText/neon-text.schema";
import { SlideInCaptionTemplateV1 } from "./Text/SlideInCaption/SlideInCaptionTemplate";
import { slideInCaptionSchema } from "./Text/SlideInCaption/slide-in-caption.schema";
import { slideInCaptionDurationFrames } from "./Text/SlideInCaption/slide-in-caption.schema";
import { GlitchTextTemplateV1 } from "./Text/GlitchText/GlitchTextTemplate";
import { glitchTextSchema } from "./Text/GlitchText/glitch-text.schema";
import { glitchTextDurationFrames } from "./Text/GlitchText/glitch-text.schema";
import { GlitchTextRandomTemplateV1 } from "./Text/GlitchText/GlitchTextRandomTemplate";
import { glitchTextRandomSchema } from "./Text/GlitchText/glitch-text-random.schema";
import { glitchTextRandomDurationFrames } from "./Text/GlitchText/glitch-text-random.schema";
import { WireTextTemplateV1 } from "./Text/WireText/WireTextTemplate";
import { wireTextSchema } from "./Text/WireText/wire-text.schema";
import { wireTextDurationFrames } from "./Text/WireText/wire-text.schema";
import { NeonTextRainbowTemplateV1 } from "./Text/NeonTextRainbow/NeonTextRainbowTemplate";
import { neonTextRainbowSchema } from "./Text/NeonTextRainbow/neon-text-rainbow.schema";
import { neonTextRainbowDurationFrames } from "./Text/NeonTextRainbow/neon-text-rainbow.schema";
import { LightSweepTextTemplateV1 } from "./Text/LightSweepText/LightSweepTextTemplate";
import { lightSweepTextSchema } from "./Text/LightSweepText/light-sweep-text.schema";
import { lightSweepTextDurationFrames } from "./Text/LightSweepText/light-sweep-text.schema";
import { DottedLineMarkerTextV1 } from "./Text/DottedLineMarkerText/DottedLineMarkerText";
import { dottedLineMarkerTextSchema, dottedLineMarkerTextDurationFrames } from "./Text/DottedLineMarkerText/dotted-line-marker-text.schema";
import { TypewriterTextTemplateV1 } from "./Text/TypewriterText/TypewriterTextTemplate";
import { typewriterTextSchema, typewriterTextDurationFrames } from "./Text/TypewriterText/typewriter-text.schema";
import { ShakeTextTemplateV1 } from "./Text/ShakeText/ShakeTextTemplate";
import { shakeTextSchema } from "./Text/ShakeText/shake-text.schema";
import { shakeTextDurationFrames } from "./Text/ShakeText/shake-text.schema";
import { ConfettiPopTextTemplateV1 } from "./Text/ConfettiPopText/ConfettiPopTextTemplate";
import { confettiPopTextSchema } from "./Text/ConfettiPopText/confetti-pop-text.schema";
import { confettiPopTextDurationFrames } from "./Text/ConfettiPopText/confetti-pop-text.schema";
import { FlickerTitleTemplateV1 } from "./Text/FlickerTitle/FlickerTitleTemplate";
import { flickerTitleSchema } from "./Text/FlickerTitle/flicker-title.schema";
import { defaultFlickerTitleProps, flickerTitleDurationFrames } from "./Text/FlickerTitle/flicker-title.schema";
import { OneTakeLogoTextTemplateV1 } from "./Text/FlickerTitle/OneTakeLogoTextTemplate";
import { StackedRevealTextTemplateV1 } from "./Text/StackedRevealText/StackedRevealTextTemplate";
import { stackedRevealTextSchema } from "./Text/StackedRevealText/stacked-reveal-text.schema";
import { stackedRevealTextDurationFrames } from "./Text/StackedRevealText/stacked-reveal-text.schema";
import { TornNoteCaptionTemplateV1 } from "./Text/TornNoteCaption/TornNoteCaptionTemplate";
import { tornNoteCaptionSchema } from "./Text/TornNoteCaption/torn-note-caption.schema";
import { tornNoteCaptionDurationFrames } from "./Text/TornNoteCaption/torn-note-caption.schema";
import { DistressedTitleCardTemplateV1 } from "./Text/DistressedTitleCard/DistressedTitleCardTemplate";
import { distressedTitleCardSchema } from "./Text/DistressedTitleCard/distressed-title-card.schema";
import { distressedTitleCardDurationFrames } from "./Text/DistressedTitleCard/distressed-title-card.schema";
import { SprayPaintTextTemplateV1 } from "./Text/SprayPaintText/SprayPaintTextTemplate";
import { sprayPaintTextSchema } from "./Text/SprayPaintText/spray-paint-text.schema";
import { sprayPaintTextDurationFrames } from "./Text/SprayPaintText/spray-paint-text.schema";
import {
  mergedLocationConfigs,
  mergedLedTextPatterns,
  mergedNeonTextPatterns,
  mergedSlideInCaptionPatterns,
  mergedGlitchTextPatterns,
  mergedGlitchTextRandomPatterns,
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
            schema={locationSchema}
            defaultProps={{
              ...defaultLocationProps,
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
          schema: ledTextSchema,
          durationInFrames: 540,
        })}
      </Folder>

      <Folder name="NeonText">
        {renderPatternFamily({
          patterns: mergedNeonTextPatterns,
          idPrefix: "NeonTextV1-",
          Template: NeonTextTemplateV1,
          schema: neonTextSchema,
          durationInFrames: 480,
        })}
      </Folder>

      <Folder name="SlideInCaption">
        {renderPatternFamily({
          patterns: mergedSlideInCaptionPatterns,
          idPrefix: "SlideInCaptionV1-",
          Template: SlideInCaptionTemplateV1,
          schema: slideInCaptionSchema,
          durationInFrames: slideInCaptionDurationFrames,
        })}
      </Folder>

      <Folder name="GlitchText">
        {renderPatternFamily({
          patterns: mergedGlitchTextPatterns,
          idPrefix: "GlitchTextV1-",
          Template: GlitchTextTemplateV1,
          schema: glitchTextSchema,
          durationInFrames: glitchTextDurationFrames,
        })}
        {Object.entries(mergedGlitchTextRandomPatterns).map(
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
          schema: wireTextSchema,
          durationInFrames: wireTextDurationFrames,
        })}
      </Folder>

      <Folder name="NeonTextRainbow">
        {renderPatternFamily({
          patterns: mergedNeonTextRainbowPatterns,
          idPrefix: "NeonTextV1-Rainbow",
          Template: NeonTextRainbowTemplateV1,
          schema: neonTextRainbowSchema,
          durationInFrames: neonTextRainbowDurationFrames,
        })}
      </Folder>

      <Folder name="LightSweepText">
        {renderPatternFamily({
          patterns: mergedLightSweepTextPatterns,
          idPrefix: "LightSweepTextV1-",
          Template: LightSweepTextTemplateV1,
          schema: lightSweepTextSchema,
          durationInFrames: lightSweepTextDurationFrames,
        })}
      </Folder>

      <Folder name="DottedLineMarkerText">
        {Object.entries(mergedDottedLineMarkerPatterns).map(
          ([patternName, props]) => (
            <Composition
              key={patternName}
              id={`DottedLineMarkerTextV1-${patternName}`}
              component={DottedLineMarkerTextV1}
              durationInFrames={dottedLineMarkerTextDurationFrames}
              width={1920}
              height={1080}
              fps={30}
              schema={dottedLineMarkerTextSchema}
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
          schema: typewriterTextSchema,
          durationInFrames: typewriterTextDurationFrames,
        })}
      </Folder>

      <Folder name="ShakeText">
        {renderPatternFamily({
          patterns: mergedShakeTextPatterns,
          idPrefix: "ShakeTextV1-",
          Template: ShakeTextTemplateV1,
          schema: shakeTextSchema,
          durationInFrames: shakeTextDurationFrames,
        })}
      </Folder>

      <Folder name="ConfettiPopText">
        {renderPatternFamily({
          patterns: mergedConfettiPopTextPatterns,
          idPrefix: "ConfettiPopTextV1-",
          Template: ConfettiPopTextTemplateV1,
          schema: confettiPopTextSchema,
          durationInFrames: confettiPopTextDurationFrames,
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
          durationInFrames={flickerTitleDurationFrames}
          schema={flickerTitleSchema}
          defaultProps={{ ...defaultFlickerTitleProps }}
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
          durationInFrames={flickerTitleDurationFrames}
          schema={flickerTitleSchema}
          defaultProps={{ ...mergedOneTakeLogoTextProps }}
        />
      </Folder>

      <Folder name="StackedRevealText">
        {renderPatternFamily({
          patterns: mergedStackedRevealTextPatterns,
          idPrefix: "StackedRevealTextV1-",
          Template: StackedRevealTextTemplateV1,
          schema: stackedRevealTextSchema,
          durationInFrames: stackedRevealTextDurationFrames,
        })}
      </Folder>

      <Folder name="TornNoteCaption">
        {renderPatternFamily({
          patterns: mergedTornNoteCaptionPatterns,
          idPrefix: "TornNoteCaptionV1-",
          Template: TornNoteCaptionTemplateV1,
          schema: tornNoteCaptionSchema,
          durationInFrames: tornNoteCaptionDurationFrames,
        })}
      </Folder>

      <Folder name="DistressedTitleCard">
        {renderPatternFamily({
          patterns: mergedDistressedTitleCardPatterns,
          idPrefix: "DistressedTitleCardV1-",
          Template: DistressedTitleCardTemplateV1,
          schema: distressedTitleCardSchema,
          durationInFrames: distressedTitleCardDurationFrames,
        })}
      </Folder>

      <Folder name="SprayPaintText">
        {renderPatternFamily({
          patterns: mergedSprayPaintTextPatterns,
          idPrefix: "SprayPaintTextV1-",
          Template: SprayPaintTextTemplateV1,
          schema: sprayPaintTextSchema,
          durationInFrames: sprayPaintTextDurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
