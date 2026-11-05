import { zColor } from "@remotion/zod-types";
import { z } from "zod";

/**
 * An IBM 80-column punch card being keypunched one column at a time, left to
 * right, with the punched character printed along the top edge. Each line in
 * `lines` is one card; finished cards feed out and the next one feeds in.
 */
export const punchCardSchema = z.object({
  /** One card per line; uppercase letters, digits, spaces, and IBM 029 symbols */
  lines: z.array(z.string()),
  /** Punch an 8-digit sequence number (00000010, 00000020, ...) into columns 73-80 */
  sequenceNumbers: z.boolean().default(true),

  /** Card width (px); the height follows the real 7 3/8 x 3 1/4 inch ratio */
  cardWidthPx: z.number().min(400).max(1900).default(1680),
  cardColor: zColor().default("#FFFFFF"),
  /** Pre-printed digits, column numbers, and the column 72/73 guide line */
  printColor: zColor().default("#3A8FB7"),
  /** Characters printed along the top edge as columns are punched */
  interpretColor: zColor().default("#1A1F2B"),
  /** Moving band over the column being punched, and the glow around fresh holes */
  punchHeadColor: zColor().default("#61CCF9"),
  /** Shows through the holes; made transparent by --transparent-bg */
  backgroundColor: zColor().default("#060810"),

  /** Frame at which the first card starts feeding in */
  startFrame: z.number().int().min(0).default(10),
  /** Frames for a card to feed in (and for the previous one to feed out) */
  feedFrames: z.number().int().min(1).default(18),
  /** Frames per punched column */
  framesPerColumn: z.number().min(0.25).max(30).default(2),
  /** Frames per blank column; blanks are skipped quickly like the 029's space bar */
  framesPerBlankColumn: z.number().min(0).max(30).default(0.5),
  /** Frames a finished card stays before the next feeds in */
  holdFrames: z.number().int().min(0).default(24),
  /** Frames after the last card finishes before the clip ends */
  endHoldFrames: z.number().int().min(0).default(60),
  /** Frames the glow around a fresh hole takes to fade */
  holeGlowFrames: z.number().int().min(0).default(10),
});

export type PunchCardSchemaType = z.infer<typeof punchCardSchema>;

export const PUNCH_CARD_COLUMNS = 80;
export const PUNCH_CARD_SEQUENCE_START_COLUMN = 73;

/** Line padded to 80 columns, with the sequence number in columns 73-80 when enabled. */
export const punchCardColumns = (
  line: string,
  cardIndex: number,
  sequenceNumbers: boolean,
): string => {
  const upper = line.toUpperCase();
  if (!sequenceNumbers) {
    return upper.padEnd(PUNCH_CARD_COLUMNS).slice(0, PUNCH_CARD_COLUMNS);
  }
  const body = upper
    .padEnd(PUNCH_CARD_SEQUENCE_START_COLUMN - 1)
    .slice(0, PUNCH_CARD_SEQUENCE_START_COLUMN - 1);
  const sequence = String((cardIndex + 1) * 10).padStart(8, "0");
  return body + sequence;
};

/** Frames from the start of punching column 1 to the end of column 80. */
export const punchCardPunchFrames = (
  columns: string,
  framesPerColumn: number,
  framesPerBlankColumn: number,
): number => {
  let total = 0;
  for (const char of columns) {
    total += char === " " ? framesPerBlankColumn : framesPerColumn;
  }
  return total;
};

/** Each card's feed-in start and punch start/end, in composition frames. */
export const punchCardTimeline = (props: PunchCardSchemaType) => {
  const cards: { columns: string; feedStart: number; punchStart: number; punchEnd: number }[] = [];
  let cursor = props.startFrame;
  props.lines.forEach((line, index) => {
    const columns = punchCardColumns(line, index, props.sequenceNumbers);
    const punchStart = cursor + props.feedFrames;
    const punchEnd =
      punchStart +
      punchCardPunchFrames(columns, props.framesPerColumn, props.framesPerBlankColumn);
    cards.push({ columns, feedStart: cursor, punchStart, punchEnd });
    cursor = punchEnd + props.holdFrames;
  });
  return cards;
};

export const punchCardDurationFrames = (props: PunchCardSchemaType): number => {
  const cards = punchCardTimeline(props);
  const last = cards[cards.length - 1];
  return Math.ceil((last ? last.punchEnd : props.startFrame) + props.endHoldFrames);
};

/** A short FORTRAN program in fixed form: statements start in column 7, labels in 1-5. */
const sampleFortranLines = [
  "      PROGRAM HELLO",
  "      DO 10 I = 1, 5",
  "      PRINT *, 'HELLO, WORLD', I",
  "   10 CONTINUE",
  "      END",
];

export const defaultPunchCardProps = {
  lines: sampleFortranLines,
  sequenceNumbers: true,

  cardWidthPx: 1680,
  cardColor: "#FFFFFF",
  printColor: "#3A8FB7",
  interpretColor: "#1A1F2B",
  punchHeadColor: "#61CCF9",
  backgroundColor: "#060810",

  startFrame: 10,
  feedFrames: 18,
  framesPerColumn: 2,
  framesPerBlankColumn: 0.5,
  holdFrames: 24,
  endHoldFrames: 60,
  holeGlowFrames: 10,
} satisfies PunchCardSchemaType;

export const punchCardPatterns = {
  /** White card with blue pre-printing */
  white: defaultPunchCardProps,

  /** #61CCF9 card with deep-blue pre-printing */
  blue: {
    ...defaultPunchCardProps,
    cardColor: "#61CCF9",
    printColor: "#0E4A66",
    interpretColor: "#08202E",
    punchHeadColor: "#FFFFFF",
  },
} satisfies Record<string, PunchCardSchemaType>;
