import { Composition, Folder } from "remotion";
import { CodeStreamTemplate } from "./Text/CodeStream/CodeStreamTemplate";
import { codeStreamSchema } from "./Text/CodeStream/code-stream.schema";
import {
  defaultCodeStreamHorizontalProps,
  defaultCodeStreamVerticalProps,
} from "./Text/CodeStream/code-stream.schema";
import { LocationTemplate } from "./Text/Location/LocationTemplate";
import { locationSchema } from "./Text/Location/location.schema";
import { defaultLocationProps } from "./Text/Location/location.schema";
import { LedTextTemplate } from "./Text/LedText/LedTextTemplate";
import { ledTextSchema } from "./Text/LedText/led-text.schema";
import { NeonTextTemplate } from "./Text/NeonText/NeonTextTemplate";
import { neonTextSchema } from "./Text/NeonText/neon-text.schema";
import { SlideInCaptionTemplate } from "./Text/SlideInCaption/SlideInCaptionTemplate";
import { slideInCaptionSchema } from "./Text/SlideInCaption/slide-in-caption.schema";
import { slideInCaptionDurationFrames } from "./Text/SlideInCaption/slide-in-caption.schema";
import { GlitchTextTemplate } from "./Text/GlitchText/GlitchTextTemplate";
import { glitchTextSchema } from "./Text/GlitchText/glitch-text.schema";
import { glitchTextDurationFrames } from "./Text/GlitchText/glitch-text.schema";
import { GlitchTextRandomTemplate } from "./Text/GlitchText/GlitchTextRandomTemplate";
import { glitchTextRandomSchema } from "./Text/GlitchText/glitch-text-random.schema";
import { glitchTextRandomDurationFrames } from "./Text/GlitchText/glitch-text-random.schema";
import { WireTextTemplate } from "./Text/WireText/WireTextTemplate";
import { wireTextSchema } from "./Text/WireText/wire-text.schema";
import { wireTextDurationFrames } from "./Text/WireText/wire-text.schema";
import { NeonTextRainbowTemplate } from "./Text/NeonTextRainbow/NeonTextRainbowTemplate";
import { neonTextRainbowSchema } from "./Text/NeonTextRainbow/neon-text-rainbow.schema";
import { neonTextRainbowDurationFrames } from "./Text/NeonTextRainbow/neon-text-rainbow.schema";
import { LightSweepTextTemplate } from "./Text/LightSweepText/LightSweepTextTemplate";
import { lightSweepTextSchema } from "./Text/LightSweepText/light-sweep-text.schema";
import { lightSweepTextDurationFrames } from "./Text/LightSweepText/light-sweep-text.schema";
import { DottedLineMarkerText } from "./Text/DottedLineMarkerText/DottedLineMarkerText";
import { dottedLineMarkerTextSchema, dottedLineMarkerTextDurationFrames } from "./Text/DottedLineMarkerText/dotted-line-marker-text.schema";
import { DottedLineMarkerTextTransitionTemplate } from "./Text/DottedLineMarkerText/DottedLineMarkerTextTransitionTemplate";
import {
  dottedLineMarkerTextTransitionSchema,
  dottedLineMarkerTextTransitionDurationFrames,
  defaultDottedLineMarkerTextTransitionProps,
} from "./Text/DottedLineMarkerText/dotted-line-marker-text-transition.schema";
import { TypewriterTextTemplate } from "./Text/TypewriterText/TypewriterTextTemplate";
import { typewriterTextSchema, typewriterTextDurationFrames } from "./Text/TypewriterText/typewriter-text.schema";
import { ShakeTextTemplate } from "./Text/ShakeText/ShakeTextTemplate";
import { shakeTextSchema } from "./Text/ShakeText/shake-text.schema";
import { shakeTextDurationFrames } from "./Text/ShakeText/shake-text.schema";
import { ConfettiPopTextTemplate } from "./Text/ConfettiPopText/ConfettiPopTextTemplate";
import { confettiPopTextSchema } from "./Text/ConfettiPopText/confetti-pop-text.schema";
import { confettiPopTextDurationFrames } from "./Text/ConfettiPopText/confetti-pop-text.schema";
import { FlickerTitleTemplate } from "./Text/FlickerTitle/FlickerTitleTemplate";
import { flickerTitleSchema } from "./Text/FlickerTitle/flicker-title.schema";
import {
  defaultFlickerTitleProps,
  flickerTitleDurationFrames,
  oneTakeLogoTextDurationFrames,
} from "./Text/FlickerTitle/flicker-title.schema";
import { OneTakeLogoTextTemplate } from "./Text/FlickerTitle/OneTakeLogoTextTemplate";
import { StackedRevealTextTemplate } from "./Text/StackedRevealText/StackedRevealTextTemplate";
import { stackedRevealTextSchema } from "./Text/StackedRevealText/stacked-reveal-text.schema";
import { stackedRevealTextDurationFrames } from "./Text/StackedRevealText/stacked-reveal-text.schema";
import { TornNoteCaptionTemplate } from "./Text/TornNoteCaption/TornNoteCaptionTemplate";
import { tornNoteCaptionSchema } from "./Text/TornNoteCaption/torn-note-caption.schema";
import { tornNoteCaptionDurationFrames } from "./Text/TornNoteCaption/torn-note-caption.schema";
import { DistressedTitleCardTemplate } from "./Text/DistressedTitleCard/DistressedTitleCardTemplate";
import { distressedTitleCardSchema } from "./Text/DistressedTitleCard/distressed-title-card.schema";
import { distressedTitleCardDurationFrames } from "./Text/DistressedTitleCard/distressed-title-card.schema";
import { SprayPaintTextTemplate } from "./Text/SprayPaintText/SprayPaintTextTemplate";
import { sprayPaintTextSchema } from "./Text/SprayPaintText/spray-paint-text.schema";
import { sprayPaintTextDurationFrames } from "./Text/SprayPaintText/spray-paint-text.schema";
import { ChromaticLogoTextTemplate } from "./Text/ChromaticLogoText/ChromaticLogoTextTemplate";
import { chromaticLogoTextSchema } from "./Text/ChromaticLogoText/chromatic-logo-text.schema";
import { chromaticLogoTextDurationFrames } from "./Text/ChromaticLogoText/chromatic-logo-text.schema";
import { RubyWordplayTextTemplate } from "./Text/RubyWordplayText/RubyWordplayTextTemplate";
import { rubyWordplayTextSchema } from "./Text/RubyWordplayText/ruby-wordplay-text.schema";
import { rubyWordplayTextDurationFrames } from "./Text/RubyWordplayText/ruby-wordplay-text.schema";
import { PedigreeCreditTextTemplate } from "./Text/PedigreeCreditText/PedigreeCreditTextTemplate";
import { pedigreeCreditTextSchema } from "./Text/PedigreeCreditText/pedigree-credit-text.schema";
import { pedigreeCreditTextDurationFrames } from "./Text/PedigreeCreditText/pedigree-credit-text.schema";
import { ChapterTitleCardTemplate } from "./Text/ChapterTitleCard/ChapterTitleCardTemplate";
import { chapterTitleCardSchema } from "./Text/ChapterTitleCard/chapter-title-card.schema";
import { chapterTitleCardDurationFrames } from "./Text/ChapterTitleCard/chapter-title-card.schema";
import { DiegeticMaterialCreditTemplate } from "./Text/DiegeticMaterialCredit/DiegeticMaterialCreditTemplate";
import { diegeticMaterialCreditSchema } from "./Text/DiegeticMaterialCredit/diegetic-material-credit.schema";
import { diegeticMaterialCreditDurationFrames } from "./Text/DiegeticMaterialCredit/diegetic-material-credit.schema";
import { CinematicPresentsCreditTemplate } from "./Text/CinematicPresentsCredit/CinematicPresentsCreditTemplate";
import { cinematicPresentsCreditSchema } from "./Text/CinematicPresentsCredit/cinematic-presents-credit.schema";
import { InterviewQuestionCaptionTemplate } from "./Text/InterviewQuestionCaption/InterviewQuestionCaptionTemplate";
import { interviewQuestionCaptionSchema } from "./Text/InterviewQuestionCaption/interview-question-caption.schema";
import { interviewQuestionCaptionDurationFrames } from "./Text/InterviewQuestionCaption/interview-question-caption.schema";
import { AnnouncementEndCardTemplate } from "./Text/AnnouncementEndCard/AnnouncementEndCardTemplate";
import { announcementEndCardSchema } from "./Text/AnnouncementEndCard/announcement-end-card.schema";
import { announcementEndCardDurationFrames } from "./Text/AnnouncementEndCard/announcement-end-card.schema";
import { EmergingNoiseTitleTemplate } from "./Text/EmergingNoiseTitle/EmergingNoiseTitleTemplate";
import { emergingNoiseTitleSchema } from "./Text/EmergingNoiseTitle/emerging-noise-title.schema";
import { emergingNoiseTitleDurationFrames } from "./Text/EmergingNoiseTitle/emerging-noise-title.schema";
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
  mergedChromaticLogoTextPatterns,
  mergedRubyWordplayTextPatterns,
  mergedPedigreeCreditTextPatterns,
  mergedChapterTitleCardPatterns,
  mergedDiegeticMaterialCreditPatterns,
  mergedCinematicPresentsCreditPatterns,
  mergedInterviewQuestionCaptionPatterns,
  mergedAnnouncementEndCardPatterns,
  mergedEmergingNoiseTitlePatterns,
  mergedOneTakeLogoTextProps,
} from "./composition/composition-merged-text";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";

const FPS = 30;

export function TextFolder() {
  return (
    <Folder name="Text">
      <Folder name="CodeStream">
        <Composition
          id="CodeStreamHorizontal"
          component={withCanvasPreview("CodeStreamHorizontal", CodeStreamTemplate)}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={1800}
          schema={codeStreamSchema}
          defaultProps={mergedCodeStreamPatterns.horizontal ?? defaultCodeStreamHorizontalProps}
        />

        <Composition
          id="CodeStreamVertical"
          component={withCanvasPreview("CodeStreamVertical", CodeStreamTemplate)}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={2100}
          schema={codeStreamSchema}
          defaultProps={mergedCodeStreamPatterns.vertical ?? defaultCodeStreamVerticalProps}
        />
      </Folder>

      <Folder name="Location">
        {mergedLocationConfigs.map((config) => (
          <Composition
            key={config.id}
            id={`Location-${config.id}`}
            component={withCanvasPreview(
              `Location-${config.id}`,
              LocationTemplate,
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
          idPrefix: "LedText-",
          Template: LedTextTemplate,
          schema: ledTextSchema,
          durationInFrames: 540,
        })}
      </Folder>

      <Folder name="NeonText">
        {renderPatternFamily({
          patterns: mergedNeonTextPatterns,
          idPrefix: "NeonText-",
          Template: NeonTextTemplate,
          schema: neonTextSchema,
          durationInFrames: 480,
        })}
      </Folder>

      <Folder name="SlideInCaption">
        {renderPatternFamily({
          patterns: mergedSlideInCaptionPatterns,
          idPrefix: "SlideInCaption-",
          Template: SlideInCaptionTemplate,
          schema: slideInCaptionSchema,
          durationInFrames: slideInCaptionDurationFrames,
        })}
      </Folder>

      <Folder name="GlitchText">
        {renderPatternFamily({
          patterns: mergedGlitchTextPatterns,
          idPrefix: "GlitchText-",
          Template: GlitchTextTemplate,
          schema: glitchTextSchema,
          durationInFrames: glitchTextDurationFrames,
        })}
        {Object.entries(mergedGlitchTextRandomPatterns).map(
          ([patternName, props]) => (
            <Composition
              key={`GlitchTextRandom-${patternName}`}
              id={`GlitchTextRandom-${patternName}`}
              component={withCanvasPreview(
                `GlitchTextRandom-${patternName}`,
                GlitchTextRandomTemplate
              )}
              width={1080}
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
          idPrefix: "WireText-",
          Template: WireTextTemplate,
          schema: wireTextSchema,
          durationInFrames: wireTextDurationFrames,
        })}
      </Folder>

      <Folder name="NeonTextRainbow">
        {renderPatternFamily({
          patterns: mergedNeonTextRainbowPatterns,
          idPrefix: "NeonText-Rainbow",
          Template: NeonTextRainbowTemplate,
          schema: neonTextRainbowSchema,
          durationInFrames: neonTextRainbowDurationFrames,
        })}
      </Folder>

      <Folder name="LightSweepText">
        {renderPatternFamily({
          patterns: mergedLightSweepTextPatterns,
          idPrefix: "LightSweepText-",
          Template: LightSweepTextTemplate,
          schema: lightSweepTextSchema,
          durationInFrames: lightSweepTextDurationFrames,
        })}
      </Folder>

      <Folder name="DottedLineMarkerText">
        {Object.entries(mergedDottedLineMarkerPatterns).map(
          ([patternName, props]) => (
            <Composition
              key={patternName}
              id={`DottedLineMarkerText-${patternName}`}
              component={DottedLineMarkerText}
              durationInFrames={dottedLineMarkerTextDurationFrames}
              width={1920}
              height={1080}
              fps={30}
              schema={dottedLineMarkerTextSchema}
              defaultProps={props}
            />
          )
        )}

        <Composition
          id="DottedLineMarkerText-GlitchHandover"
          component={DottedLineMarkerTextTransitionTemplate}
          durationInFrames={dottedLineMarkerTextTransitionDurationFrames}
          width={1920}
          height={1080}
          fps={30}
          schema={dottedLineMarkerTextTransitionSchema}
          defaultProps={{
            ...defaultDottedLineMarkerTextTransitionProps,
            fontSize: mergedDottedLineMarkerPatterns["01"].fontSize,
            textColor: mergedDottedLineMarkerPatterns["01"].textColor,
            backgroundColor: mergedDottedLineMarkerPatterns["01"].backgroundColor,
            itemsA: mergedDottedLineMarkerPatterns["01"].items,
            itemsB: mergedDottedLineMarkerPatterns["02"].items,
          }}
        />
      </Folder>

      <Folder name="TypewriterText">
        {renderPatternFamily({
          patterns: mergedTypewriterTextPatterns,
          idPrefix: "TypewriterText-",
          Template: TypewriterTextTemplate,
          schema: typewriterTextSchema,
          durationInFrames: typewriterTextDurationFrames,
        })}
      </Folder>

      <Folder name="ShakeText">
        {renderPatternFamily({
          patterns: mergedShakeTextPatterns,
          idPrefix: "ShakeText-",
          Template: ShakeTextTemplate,
          schema: shakeTextSchema,
          durationInFrames: shakeTextDurationFrames,
        })}
      </Folder>

      <Folder name="ConfettiPopText">
        {renderPatternFamily({
          patterns: mergedConfettiPopTextPatterns,
          idPrefix: "ConfettiPopText-",
          Template: ConfettiPopTextTemplate,
          schema: confettiPopTextSchema,
          durationInFrames: confettiPopTextDurationFrames,
        })}
      </Folder>

      <Folder name="FlickerTitle">
        <Composition
          id="FlickerTitle"
          component={withCanvasPreview(
            "FlickerTitle",
            FlickerTitleTemplate,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={flickerTitleDurationFrames}
          schema={flickerTitleSchema}
          defaultProps={{ ...defaultFlickerTitleProps }}
        />

        <Composition
          id="OneTake-LogoText"
          component={withCanvasPreview(
            "OneTake-LogoText",
            OneTakeLogoTextTemplate,
          )}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={oneTakeLogoTextDurationFrames}
          schema={flickerTitleSchema}
          defaultProps={{ ...mergedOneTakeLogoTextProps }}
        />
      </Folder>

      <Folder name="StackedRevealText">
        {renderPatternFamily({
          patterns: mergedStackedRevealTextPatterns,
          idPrefix: "StackedRevealText-",
          Template: StackedRevealTextTemplate,
          schema: stackedRevealTextSchema,
          durationInFrames: stackedRevealTextDurationFrames,
        })}
      </Folder>

      <Folder name="TornNoteCaption">
        {renderPatternFamily({
          patterns: mergedTornNoteCaptionPatterns,
          idPrefix: "TornNoteCaption-",
          Template: TornNoteCaptionTemplate,
          schema: tornNoteCaptionSchema,
          durationInFrames: tornNoteCaptionDurationFrames,
        })}
      </Folder>

      <Folder name="DistressedTitleCard">
        {renderPatternFamily({
          patterns: mergedDistressedTitleCardPatterns,
          idPrefix: "DistressedTitleCard-",
          Template: DistressedTitleCardTemplate,
          schema: distressedTitleCardSchema,
          durationInFrames: distressedTitleCardDurationFrames,
        })}
      </Folder>

      <Folder name="SprayPaintText">
        {renderPatternFamily({
          patterns: mergedSprayPaintTextPatterns,
          idPrefix: "SprayPaintText-",
          Template: SprayPaintTextTemplate,
          schema: sprayPaintTextSchema,
          durationInFrames: sprayPaintTextDurationFrames,
        })}
      </Folder>

      <Folder name="ChromaticLogoText">
        {renderPatternFamily({
          patterns: mergedChromaticLogoTextPatterns,
          idPrefix: "ChromaticLogoText-",
          Template: ChromaticLogoTextTemplate,
          schema: chromaticLogoTextSchema,
          durationInFrames: chromaticLogoTextDurationFrames,
        })}
      </Folder>

      <Folder name="RubyWordplayText">
        {renderPatternFamily({
          patterns: mergedRubyWordplayTextPatterns,
          idPrefix: "RubyWordplayText-",
          Template: RubyWordplayTextTemplate,
          schema: rubyWordplayTextSchema,
          durationInFrames: rubyWordplayTextDurationFrames,
        })}
      </Folder>

      <Folder name="PedigreeCreditText">
        {renderPatternFamily({
          patterns: mergedPedigreeCreditTextPatterns,
          idPrefix: "PedigreeCreditText-",
          Template: PedigreeCreditTextTemplate,
          schema: pedigreeCreditTextSchema,
          durationInFrames: pedigreeCreditTextDurationFrames,
        })}
      </Folder>

      <Folder name="ChapterTitleCard">
        {renderPatternFamily({
          patterns: mergedChapterTitleCardPatterns,
          idPrefix: "ChapterTitleCard-",
          Template: ChapterTitleCardTemplate,
          schema: chapterTitleCardSchema,
          durationInFrames: chapterTitleCardDurationFrames,
        })}
      </Folder>

      <Folder name="DiegeticMaterialCredit">
        {renderPatternFamily({
          patterns: mergedDiegeticMaterialCreditPatterns,
          idPrefix: "DiegeticMaterialCredit-",
          Template: DiegeticMaterialCreditTemplate,
          schema: diegeticMaterialCreditSchema,
          durationInFrames: diegeticMaterialCreditDurationFrames,
        })}
      </Folder>

      <Folder name="CinematicPresentsCredit">
        {renderPatternFamily({
          patterns: mergedCinematicPresentsCreditPatterns,
          idPrefix: "CinematicPresentsCredit-",
          Template: CinematicPresentsCreditTemplate,
          schema: cinematicPresentsCreditSchema,
          durationInFrames: (patternProps) =>
            patternProps.lines.length * patternProps.perLineHoldFrames,
        })}
      </Folder>

      <Folder name="InterviewQuestionCaption">
        {renderPatternFamily({
          patterns: mergedInterviewQuestionCaptionPatterns,
          idPrefix: "InterviewQuestionCaption-",
          Template: InterviewQuestionCaptionTemplate,
          schema: interviewQuestionCaptionSchema,
          durationInFrames: interviewQuestionCaptionDurationFrames,
        })}
      </Folder>

      <Folder name="AnnouncementEndCard">
        {renderPatternFamily({
          patterns: mergedAnnouncementEndCardPatterns,
          idPrefix: "AnnouncementEndCard-",
          Template: AnnouncementEndCardTemplate,
          schema: announcementEndCardSchema,
          durationInFrames: announcementEndCardDurationFrames,
        })}
      </Folder>

      <Folder name="EmergingNoiseTitle">
        {renderPatternFamily({
          patterns: mergedEmergingNoiseTitlePatterns,
          idPrefix: "EmergingNoiseTitle-",
          Template: EmergingNoiseTitleTemplate,
          schema: emergingNoiseTitleSchema,
          durationInFrames: emergingNoiseTitleDurationFrames,
        })}
      </Folder>
    </Folder>
  );
}
