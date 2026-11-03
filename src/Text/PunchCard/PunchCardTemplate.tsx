import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import {
  PUNCH_CARD_COLUMNS,
  PUNCH_CARD_SEQUENCE_START_COLUMN,
  punchCardTimeline,
  type PunchCardSchemaType,
} from "./punch-card.schema";

// IBM 5081 card geometry, in inches.
const CARD_WIDTH_IN = 7.375;
const CARD_HEIGHT_IN = 3.25;
const FIRST_COLUMN_X_IN = 0.2515;
const COLUMN_PITCH_IN = 0.087;
const FIRST_ROW_Y_IN = 0.25;
const ROW_PITCH_IN = 0.25;
const HOLE_WIDTH_IN = 0.055;
const HOLE_HEIGHT_IN = 0.125;
const CORNER_RADIUS_IN = 0.08;
const CORNER_CUT_X_IN = 0.22;
const CORNER_CUT_Y_IN = 0.38;

/** Rows top to bottom: 12 and 11 (zone rows), then 0-9. Index into this for y position. */
const ROW_LABELS = ["12", "11", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
type RowLabel = (typeof ROW_LABELS)[number];

/** IBM 029 keypunch code for the characters it can punch. */
const HOLLERITH: Record<string, readonly RowLabel[]> = (() => {
  const code: Record<string, readonly RowLabel[]> = {
    " ": [],
    "&": ["12"],
    "-": ["11"],
    "/": ["0", "1"],
    ".": ["12", "3", "8"],
    "<": ["12", "4", "8"],
    "(": ["12", "5", "8"],
    "+": ["12", "6", "8"],
    "|": ["12", "7", "8"],
    "!": ["11", "2", "8"],
    $: ["11", "3", "8"],
    "*": ["11", "4", "8"],
    ")": ["11", "5", "8"],
    ";": ["11", "6", "8"],
    ",": ["0", "3", "8"],
    "%": ["0", "4", "8"],
    _: ["0", "5", "8"],
    ">": ["0", "6", "8"],
    "?": ["0", "7", "8"],
    ":": ["2", "8"],
    "#": ["3", "8"],
    "@": ["4", "8"],
    "'": ["5", "8"],
    "=": ["6", "8"],
    '"': ["7", "8"],
  };
  for (let d = 0; d <= 9; d++) {
    code[String(d)] = [String(d) as RowLabel];
  }
  const digitRow = (n: number) => String(n) as RowLabel;
  "ABCDEFGHI".split("").forEach((c, i) => (code[c] = ["12", digitRow(i + 1)]));
  "JKLMNOPQR".split("").forEach((c, i) => (code[c] = ["11", digitRow(i + 1)]));
  "STUVWXYZ".split("").forEach((c, i) => (code[c] = ["0", digitRow(i + 2)]));
  return code;
})();

const rowY = (row: RowLabel) => FIRST_ROW_Y_IN + ROW_LABELS.indexOf(row) * ROW_PITCH_IN;
const columnX = (column: number) => FIRST_COLUMN_X_IN + column * COLUMN_PITCH_IN;

/** Card outline: rounded corners with the diagonal cut at the top left. */
const CARD_PATH = (() => {
  const r = CORNER_RADIUS_IN;
  const w = CARD_WIDTH_IN;
  const h = CARD_HEIGHT_IN;
  return [
    `M ${CORNER_CUT_X_IN} 0`,
    `L ${w - r} 0`,
    `Q ${w} 0 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `Q ${w} ${h} ${w - r} ${h}`,
    `L ${r} ${h}`,
    `Q 0 ${h} 0 ${h - r}`,
    `L 0 ${CORNER_CUT_Y_IN}`,
    "Z",
  ].join(" ");
})();

type CardProps = {
  cardIndex: number;
  columns: string;
  /** Frame offset (from punchStart) at which each column is punched */
  columnStarts: number[];
  punchFrame: number;
  punchDuration: number;
  props: PunchCardSchemaType;
};

/** One card, in inch units; the parent <svg> viewBox does the scaling. */
const Card: React.FC<CardProps> = ({
  cardIndex,
  columns,
  columnStarts,
  punchFrame,
  punchDuration,
  props,
}) => {
  const maskId = `punch-card-mask-${cardIndex}`;
  const punchedCount = columnStarts.filter((start) => punchFrame >= start).length;
  const punching = punchFrame >= 0 && punchFrame < punchDuration;
  const headColumn = Math.max(punchedCount - 1, 0);
  const headOpacity = punching
    ? 1
    : interpolate(punchFrame - punchDuration, [0, 8], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const holes: { column: number; row: RowLabel; age: number }[] = [];
  for (let column = 0; column < punchedCount; column++) {
    const rows = HOLLERITH[columns[column]] ?? [];
    for (const row of rows) {
      holes.push({ column, row, age: punchFrame - columnStarts[column] });
    }
  }

  const holeRect = (column: number, row: RowLabel, grow = 0) => ({
    x: columnX(column) - HOLE_WIDTH_IN / 2 - grow,
    y: rowY(row) - HOLE_HEIGHT_IN / 2 - grow,
    width: HOLE_WIDTH_IN + grow * 2,
    height: HOLE_HEIGHT_IN + grow * 2,
  });

  return (
    <g>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <path d={CARD_PATH} fill="#fff" />
          {holes.map(({ column, row }) => (
            <rect key={`${column}-${row}`} {...holeRect(column, row)} fill="#000" />
          ))}
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        <path d={CARD_PATH} fill={props.cardColor} />

        {/* Pre-printed digits 0-9 in every column */}
        <g
          fill={props.printColor}
          fontFamily={JETBRAINS_MONO_FONT_FAMILY}
          fontSize={0.068}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {ROW_LABELS.slice(2).map((row) =>
            Array.from({ length: PUNCH_CARD_COLUMNS }, (_, column) => (
              <text key={`${row}-${column}`} x={columnX(column)} y={rowY(row)}>
                {row}
              </text>
            )),
          )}
        </g>

        {/* Column numbers under row 0 and along the bottom edge */}
        <g
          fill={props.printColor}
          fontFamily={JETBRAINS_MONO_FONT_FAMILY}
          fontSize={0.036}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {Array.from({ length: PUNCH_CARD_COLUMNS }, (_, column) => (
            <React.Fragment key={column}>
              <text x={columnX(column)} y={rowY("0") + ROW_PITCH_IN / 2}>
                {column + 1}
              </text>
              <text x={columnX(column)} y={rowY("9") + ROW_PITCH_IN * 0.62}>
                {column + 1}
              </text>
            </React.Fragment>
          ))}
        </g>

        {/* Statement / sequence-number divider between columns 72 and 73 */}
        <line
          x1={columnX(PUNCH_CARD_SEQUENCE_START_COLUMN - 1) - COLUMN_PITCH_IN / 2}
          x2={columnX(PUNCH_CARD_SEQUENCE_START_COLUMN - 1) - COLUMN_PITCH_IN / 2}
          y1={rowY("0") - ROW_PITCH_IN / 2}
          y2={CARD_HEIGHT_IN - 0.06}
          stroke={props.printColor}
          strokeWidth={0.006}
        />

        {/* Characters printed along the top edge as each column is punched */}
        <g
          fill={props.interpretColor}
          fontFamily={JETBRAINS_MONO_FONT_FAMILY}
          fontSize={0.11}
          fontWeight={500}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {Array.from({ length: punchedCount }, (_, column) =>
            columns[column] === " " ? null : (
              <text key={column} x={columnX(column)} y={0.1}>
                {columns[column]}
              </text>
            ),
          )}
        </g>

        {/* Punch head over the current column */}
        {headOpacity > 0 && punchFrame >= 0 && (
          <rect
            x={columnX(headColumn) - COLUMN_PITCH_IN / 2}
            y={0}
            width={COLUMN_PITCH_IN}
            height={CARD_HEIGHT_IN}
            fill={props.punchHeadColor}
            opacity={0.28 * headOpacity}
          />
        )}
      </g>

      {/* Glow around freshly punched holes */}
      {props.holeGlowFrames > 0 &&
        holes
          .filter(({ age }) => age < props.holeGlowFrames)
          .map(({ column, row, age }) => (
            <rect
              key={`glow-${column}-${row}`}
              {...holeRect(column, row, 0.008)}
              fill="none"
              stroke={props.punchHeadColor}
              strokeWidth={0.012}
              opacity={1 - age / props.holeGlowFrames}
            />
          ))}
    </g>
  );
};

export const PunchCardTemplate: React.FC<PunchCardSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const cards = useMemo(() => punchCardTimeline(props), [props]);

  const columnStarts = useMemo(
    () =>
      cards.map(({ columns }) => {
        let t = 0;
        return Array.from(columns, (char) => {
          const start = t;
          t += char === " " ? props.framesPerBlankColumn : props.framesPerColumn;
          return start;
        });
      }),
    [cards, props.framesPerColumn, props.framesPerBlankColumn],
  );

  const cardWidthPx = props.cardWidthPx;
  const cardHeightPx = (cardWidthPx * CARD_HEIGHT_IN) / CARD_WIDTH_IN;
  // Far enough that a card fully clears the frame while feeding.
  const travel = (width + cardWidthPx) / 2 + 40;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(props.backgroundColor),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {cards.map((card, index) => {
        const next = cards[index + 1];
        const enter = interpolate(frame, [card.feedStart, card.punchStart], [travel, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const exit = next
          ? interpolate(frame, [next.feedStart, next.punchStart], [0, -travel], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.in(Easing.cubic),
            })
          : 0;
        const offscreen =
          frame < card.feedStart || (next !== undefined && frame >= next.punchStart);
        if (offscreen) {
          return null;
        }
        return (
          <svg
            key={index}
            width={cardWidthPx}
            height={cardHeightPx}
            viewBox={`0 0 ${CARD_WIDTH_IN} ${CARD_HEIGHT_IN}`}
            style={{
              position: "absolute",
              overflow: "visible",
              transform: `translateX(${enter + exit}px)`,
              filter: "drop-shadow(0 18px 36px rgba(0, 0, 0, 0.45))",
            }}
          >
            <Card
              cardIndex={index}
              columns={card.columns}
              columnStarts={columnStarts[index]}
              punchFrame={frame - card.punchStart}
              punchDuration={card.punchEnd - card.punchStart}
              props={props}
            />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};
