import { Composition, Folder } from "remotion";
import { AmbientBlurOrbsTemplateV1 } from "./Background/AmbientBlurOrbs/AmbientBlurOrbsTemplate";
import { ambientBlurOrbsSchema } from "./Background/AmbientBlurOrbs/ambient-blur-orbs.schema";
import {
  defaultAmbientBlurOrbsProps,
  ambientBlurOrbsDurationFrames,
} from "./Background/AmbientBlurOrbs/ambient-blur-orbs.schema";
import { ScanLineTemplateV1 } from "./Background/ScanLine/ScanLineTemplate";
import { scanLineSchema } from "./Background/ScanLine/scan-line.schema";
import { scanLinePatterns } from "./Background/ScanLine/scan-line.schema";
import { DuotoneGradeOverlayTemplateV1 } from "./Background/DuotoneGradeOverlay/DuotoneGradeOverlayTemplate";
import { duotoneGradeOverlaySchema } from "./Background/DuotoneGradeOverlay/duotone-grade-overlay.schema";
import { duotoneGradeOverlayPatterns } from "./Background/DuotoneGradeOverlay/duotone-grade-overlay.schema";
import { FilmGrainOverlayTemplateV1 } from "./Background/FilmGrainOverlay/FilmGrainOverlayTemplate";
import { filmGrainOverlaySchema } from "./Background/FilmGrainOverlay/film-grain-overlay.schema";
import { filmGrainOverlayPatterns } from "./Background/FilmGrainOverlay/film-grain-overlay.schema";
import { LetterboxOverlayTemplateV1 } from "./Background/LetterboxOverlay/LetterboxOverlayTemplate";
import { letterboxOverlaySchema } from "./Background/LetterboxOverlay/letterbox-overlay.schema";
import { letterboxOverlayPatterns } from "./Background/LetterboxOverlay/letterbox-overlay.schema";
import { PosterizeGradeOverlayTemplateV1 } from "./Background/PosterizeGradeOverlay/PosterizeGradeOverlayTemplate";
import { posterizeGradeOverlaySchema } from "./Background/PosterizeGradeOverlay/posterize-grade-overlay.schema";
import { posterizeGradeOverlayPatterns } from "./Background/PosterizeGradeOverlay/posterize-grade-overlay.schema";
import { EmblemMontageBlurTemplateV1 } from "./Background/EmblemMontageBlur/EmblemMontageBlurTemplate";
import { emblemMontageBlurSchema } from "./Background/EmblemMontageBlur/emblem-montage-blur.schema";
import { emblemMontageBlurPatterns } from "./Background/EmblemMontageBlur/emblem-montage-blur.schema";
import { SunsetLensFlareOverlayTemplateV1 } from "./Background/SunsetLensFlareOverlay/SunsetLensFlareOverlayTemplate";
import { sunsetLensFlareOverlaySchema } from "./Background/SunsetLensFlareOverlay/sunset-lens-flare-overlay.schema";
import { sunsetLensFlareOverlayPatterns } from "./Background/SunsetLensFlareOverlay/sunset-lens-flare-overlay.schema";
import { RandomLinesBackgroundV1 } from "./Background/RandomLinesBackground/RandomLinesBackground";
import { randomLinesSchema } from "./Background/RandomLinesBackground/random-lines.schema";
import { randomLinesDurationFrames } from "./Background/RandomLinesBackground/random-lines.schema";
import { renderPatternFamily, withCanvasPreview } from "./helpers/composition-helpers";
import { mergedRandomLinesPatterns } from "./composition/composition-merged-background";

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
        durationInFrames={ambientBlurOrbsDurationFrames}
        schema={ambientBlurOrbsSchema}
        defaultProps={{ ...defaultAmbientBlurOrbsProps }}
      />

      <Folder name="RandomLines">
        {Object.entries(mergedRandomLinesPatterns).map(
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
              durationInFrames={randomLinesDurationFrames}
              schema={randomLinesSchema}
              defaultProps={props}
            />
          )
        )}
      </Folder>

      <Folder name="ScanLine">
        {renderPatternFamily({
          patterns: scanLinePatterns,
          idPrefix: "Background-ScanLineV1-",
          Template: ScanLineTemplateV1,
          schema: scanLineSchema,
          durationInFrames: (patternProps) => patternProps.scanPeriodFrames,
        })}
      </Folder>

      <Folder name="DuotoneGradeOverlay">
        {renderPatternFamily({
          patterns: duotoneGradeOverlayPatterns,
          idPrefix: "Background-DuotoneGradeOverlayV1-",
          Template: DuotoneGradeOverlayTemplateV1,
          schema: duotoneGradeOverlaySchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="FilmGrainOverlayV1">
        {renderPatternFamily({
          patterns: filmGrainOverlayPatterns,
          idPrefix: "Background-FilmGrainOverlayV1-",
          Template: FilmGrainOverlayTemplateV1,
          schema: filmGrainOverlaySchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="LetterboxOverlayV1">
        {renderPatternFamily({
          patterns: letterboxOverlayPatterns,
          idPrefix: "Background-LetterboxOverlayV1-",
          Template: LetterboxOverlayTemplateV1,
          schema: letterboxOverlaySchema,
          durationInFrames: 90,
        })}
      </Folder>

      <Folder name="PosterizeGradeOverlayV1">
        {renderPatternFamily({
          patterns: posterizeGradeOverlayPatterns,
          idPrefix: "Background-PosterizeGradeOverlayV1-",
          Template: PosterizeGradeOverlayTemplateV1,
          schema: posterizeGradeOverlaySchema,
          durationInFrames: 150,
        })}
      </Folder>

      <Folder name="EmblemMontageBlur">
        {renderPatternFamily({
          patterns: emblemMontageBlurPatterns,
          idPrefix: "Background-EmblemMontageBlurV1-",
          Template: EmblemMontageBlurTemplateV1,
          schema: emblemMontageBlurSchema,
          durationInFrames: 60,
        })}
      </Folder>

      <Folder name="SunsetLensFlareOverlay">
        {renderPatternFamily({
          patterns: sunsetLensFlareOverlayPatterns,
          idPrefix: "Background-SunsetLensFlareOverlayV1-",
          Template: SunsetLensFlareOverlayTemplateV1,
          schema: sunsetLensFlareOverlaySchema,
          durationInFrames: 60,
        })}
      </Folder>
    </Folder>
  );
}
