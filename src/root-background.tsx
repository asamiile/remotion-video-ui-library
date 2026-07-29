import { Composition, Folder } from "remotion";
import { AmbientBlurOrbsTemplateV1 } from "./Background/AmbientBlurOrbs-v1/AmbientBlurOrbsTemplate";
import { ambientBlurOrbsSchemaV1 } from "./Background/AmbientBlurOrbs-v1/ambient-blur-orbs.schema";
import {
  defaultAmbientBlurOrbsV1Props,
  ambientBlurOrbsV1DurationFrames,
} from "./Background/AmbientBlurOrbs-v1/ambient-blur-orbs.schema";
import { ScanLineTemplateV1 } from "./Background/ScanLine-v1/ScanLineTemplate";
import { scanLineSchemaV1 } from "./Background/ScanLine-v1/scan-line.schema";
import { scanLineV1Patterns } from "./Background/ScanLine-v1/scan-line.schema";
import { DuotoneGradeOverlayTemplateV1 } from "./Background/DuotoneGradeOverlay-v1/DuotoneGradeOverlayTemplate";
import { duotoneGradeOverlaySchemaV1 } from "./Background/DuotoneGradeOverlay-v1/duotone-grade-overlay.schema";
import { duotoneGradeOverlayV1Patterns } from "./Background/DuotoneGradeOverlay-v1/duotone-grade-overlay.schema";
import { FilmGrainOverlayTemplateV1 } from "./Background/FilmGrainOverlay-v1/FilmGrainOverlayTemplate";
import { filmGrainOverlaySchemaV1 } from "./Background/FilmGrainOverlay-v1/film-grain-overlay.schema";
import { filmGrainOverlayV1Patterns } from "./Background/FilmGrainOverlay-v1/film-grain-overlay.schema";
import { LetterboxOverlayTemplateV1 } from "./Background/LetterboxOverlay-v1/LetterboxOverlayTemplate";
import { letterboxOverlaySchemaV1 } from "./Background/LetterboxOverlay-v1/letterbox-overlay.schema";
import { letterboxOverlayV1Patterns } from "./Background/LetterboxOverlay-v1/letterbox-overlay.schema";
import { PosterizeGradeOverlayTemplateV1 } from "./Background/PosterizeGradeOverlay-v1/PosterizeGradeOverlayTemplate";
import { posterizeGradeOverlaySchemaV1 } from "./Background/PosterizeGradeOverlay-v1/posterize-grade-overlay.schema";
import { posterizeGradeOverlayV1Patterns } from "./Background/PosterizeGradeOverlay-v1/posterize-grade-overlay.schema";
import { EmblemMontageBlurTemplateV1 } from "./Background/EmblemMontageBlur-v1/EmblemMontageBlurTemplate";
import { emblemMontageBlurSchemaV1 } from "./Background/EmblemMontageBlur-v1/emblem-montage-blur.schema";
import { emblemMontageBlurV1Patterns } from "./Background/EmblemMontageBlur-v1/emblem-montage-blur.schema";
import { SunsetLensFlareOverlayTemplateV1 } from "./Background/SunsetLensFlareOverlay-v1/SunsetLensFlareOverlayTemplate";
import { sunsetLensFlareOverlaySchemaV1 } from "./Background/SunsetLensFlareOverlay-v1/sunset-lens-flare-overlay.schema";
import { sunsetLensFlareOverlayV1Patterns } from "./Background/SunsetLensFlareOverlay-v1/sunset-lens-flare-overlay.schema";
import { RandomLinesBackgroundV1 } from "./Background/RandomLines/RandomLinesBackground-v1/RandomLinesBackground";
import { randomLinesSchemaV1 } from "./Background/RandomLines/RandomLinesBackground-v1/random-lines.schema";
import { randomLinesV1DurationFrames } from "./Background/RandomLines/RandomLinesBackground-v1/random-lines.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import { mergedRandomLinesV1Patterns } from "./composition/composition-merged";

const FPS = 30;

export function BackgroundFolder() {
  return (
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
        durationInFrames={ambientBlurOrbsV1DurationFrames}
        schema={ambientBlurOrbsSchemaV1}
        defaultProps={{ ...defaultAmbientBlurOrbsV1Props }}
      />

      <Folder name="RandomLines">
        {Object.entries(mergedRandomLinesV1Patterns).map(
          ([patternName, props]) => (
            <Composition
              key={`RandomLinesBackground-${patternName}`}
              id={`RandomLinesBackground-${patternName}`}
              component={withCanvasPreview(
                `RandomLinesBackground-${patternName}`,
                RandomLinesBackgroundV1
              )}
              width={1920}
              height={1080}
              fps={FPS}
              durationInFrames={randomLinesV1DurationFrames}
              schema={randomLinesSchemaV1}
              defaultProps={props}
            />
          )
        )}
      </Folder>

      <Folder name="ScanLine">
        {renderPatternFamily({
          patterns: scanLineV1Patterns,
          idPrefix: "Background-ScanLineV1-",
          Template: ScanLineTemplateV1,
          schema: scanLineSchemaV1,
          durationInFrames: (patternProps) => patternProps.scanPeriodFrames,
        })}
      </Folder>

      <Folder name="DuotoneGradeOverlay">
        {renderPatternFamily({
          patterns: duotoneGradeOverlayV1Patterns,
          idPrefix: "Background-DuotoneGradeOverlayV1-",
          Template: DuotoneGradeOverlayTemplateV1,
          schema: duotoneGradeOverlaySchemaV1,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="FilmGrainOverlayV1">
        {renderPatternFamily({
          patterns: filmGrainOverlayV1Patterns,
          idPrefix: "Background-FilmGrainOverlayV1-",
          Template: FilmGrainOverlayTemplateV1,
          schema: filmGrainOverlaySchemaV1,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="LetterboxOverlayV1">
        {renderPatternFamily({
          patterns: letterboxOverlayV1Patterns,
          idPrefix: "Background-LetterboxOverlayV1-",
          Template: LetterboxOverlayTemplateV1,
          schema: letterboxOverlaySchemaV1,
          durationInFrames: 90,
        })}
      </Folder>

      <Folder name="PosterizeGradeOverlayV1">
        {renderPatternFamily({
          patterns: posterizeGradeOverlayV1Patterns,
          idPrefix: "Background-PosterizeGradeOverlayV1-",
          Template: PosterizeGradeOverlayTemplateV1,
          schema: posterizeGradeOverlaySchemaV1,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="EmblemMontageBlur">
        {renderPatternFamily({
          patterns: emblemMontageBlurV1Patterns,
          idPrefix: "Background-EmblemMontageBlurV1-",
          Template: EmblemMontageBlurTemplateV1,
          schema: emblemMontageBlurSchemaV1,
          durationInFrames: 60,
        })}
      </Folder>

      <Folder name="SunsetLensFlareOverlay">
        {renderPatternFamily({
          patterns: sunsetLensFlareOverlayV1Patterns,
          idPrefix: "Background-SunsetLensFlareOverlayV1-",
          Template: SunsetLensFlareOverlayTemplateV1,
          schema: sunsetLensFlareOverlaySchemaV1,
          durationInFrames: 60,
        })}
      </Folder>
    </Folder>
  );
}
