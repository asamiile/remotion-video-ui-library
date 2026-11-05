import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import {
  halftoneDotsDurationFrames,
  halftoneDotsPatterns,
} from "../../Background/HalftoneDots/halftone-dots.schema";
import { centeredTextFields, defaultCenteredTextProps } from "../../helpers/centered-text-layer";

const backgroundPatternIds = Object.keys(halftoneDotsPatterns) as [string, ...string[]];

/**
 * Large foreground text held still over a HalftoneDots background; only the
 * dots move.
 */
export const halftoneDotsTextSchema = z.object({
  ...centeredTextFields,

  /** HalftoneDots pattern drawn behind the text */
  backgroundPattern: z.enum(backgroundPatternIds).default("coral"),
  /** Fill behind the dots; overrides the pattern's own color. Made transparent by --transparent-bg */
  backgroundColor: zColor().default("#060810"),
});

export type HalftoneDotsTextSchemaType = z.infer<typeof halftoneDotsTextSchema>;

/** One loop of the chosen background, so the composition loops seamlessly. */
export const halftoneDotsTextDurationFrames = ({
  backgroundPattern,
}: Pick<HalftoneDotsTextSchemaType, "backgroundPattern">) =>
  halftoneDotsDurationFrames(halftoneDotsPatterns[backgroundPattern] ?? halftoneDotsPatterns.coral);

export const defaultHalftoneDotsTextProps = {
  ...defaultCenteredTextProps,
  textOpacity: 0.5,
  backgroundPattern: "coral",
  backgroundColor: "#060810",
} as const satisfies HalftoneDotsTextSchemaType;

export const halftoneDotsTextPatterns = {
  /** "Sample Text" held still over coral dots */
  coral: {
    ...defaultHalftoneDotsTextProps,
  },

  /** Over sky dots */
  sky: {
    ...defaultHalftoneDotsTextProps,
    backgroundPattern: "sky",
  },

  /** Over white dots */
  white: {
    ...defaultHalftoneDotsTextProps,
    backgroundPattern: "white",
  },
} satisfies Record<string, HalftoneDotsTextSchemaType>;
