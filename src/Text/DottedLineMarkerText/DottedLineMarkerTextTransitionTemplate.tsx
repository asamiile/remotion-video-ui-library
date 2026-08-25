import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { DottedLineMarkerTextTransitionSchemaType } from "./dotted-line-marker-text-transition.schema";
import { DottedLineRow } from "./DottedLineMarkerText";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import { garbleChars } from "../../helpers/effect-glitch-garble";

const GlitchTextCell: React.FC<{
  text: string;
  textColor: string;
  channelRColor: string;
  channelBColor: string;
  offR: number;
  offB: number;
  jitterX: number;
  jitterY: number;
}> = ({ text, textColor, channelRColor, channelBColor, offR, offB, jitterX, jitterY }) => (
  <div
    style={{
      position: "relative",
      display: "inline-block",
      transform: `translate(${jitterX}px, ${jitterY}px)`,
      fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    }}
  >
    <span
      style={{
        position: "absolute",
        left: offR,
        top: 0,
        color: channelRColor,
        opacity: 0.85,
      }}
    >
      {text}
    </span>
    <span
      style={{
        position: "absolute",
        left: offB,
        top: 0,
        color: channelBColor,
        opacity: 0.85,
      }}
    >
      {text}
    </span>
    <span style={{ position: "relative", color: textColor }}>{text}</span>
  </div>
);

const FlickerText: React.FC<{
  children: React.ReactNode;
  frame: number;
  seed: string;
  probability: number;
  segmentFrames: number;
  minimumOpacity: number;
}> = ({ children, frame, seed, probability, segmentFrames, minimumOpacity }) => {
  const segment = Math.floor(frame / segmentFrames);
  const flickering = random(`${seed}-active-${segment}`) < probability;
  const opacity = flickering
    ? minimumOpacity +
      random(`${seed}-opacity-${segment}`) * (1 - minimumOpacity)
    : 1;
  const brightness = flickering
    ? 0.72 + random(`${seed}-brightness-${segment}`) * 0.58
    : 1;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        filter: `brightness(${brightness})`,
      }}
    >
      {children}
    </span>
  );
};

export const DottedLineMarkerTextTransitionTemplate: React.FC<
  DottedLineMarkerTextTransitionSchemaType
> = ({
  fontSize,
  textColor,
  backgroundColor,
  itemsA,
  itemsB,
  transitionStartFrame,
  transitionDurationFrames,
  rowGlitchDurationFrames,
  rgbOffsetMax,
  strongGlitchProbability,
  glitchSegmentFrames,
  garbleRate,
  jitterPx,
  channelRColor,
  channelBColor,
  flickerProbability,
  flickerSegmentFrames,
  flickerMinimumOpacity,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const rowCount = Math.max(itemsA.length, itemsB.length);
  const perRowStaggerFrames =
    rowCount > 1
      ? Math.max(transitionDurationFrames - rowGlitchDurationFrames, 0) /
        (rowCount - 1)
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "1610px",
          height: "950px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {Array.from({ length: rowCount }).map((_, rowIndex) => {
          const fromItem = itemsA[rowIndex] ?? itemsA[itemsA.length - 1];
          const toItem = itemsB[rowIndex] ?? itemsB[itemsB.length - 1] ?? fromItem;

          if (!fromItem && !toItem) {
            return null;
          }
          const from = fromItem ?? toItem;
          const to = toItem ?? fromItem;

          const localStart = transitionStartFrame + rowIndex * perRowStaggerFrames;
          const localMid = localStart + rowGlitchDurationFrames / 2;
          const localEnd = localStart + rowGlitchDurationFrames;

          let leftText = from.leftText;
          let rightText = from.rightText;
          let leftContent: React.ReactNode = undefined;
          let rightContent: React.ReactNode = undefined;

          if (frame >= localEnd) {
            leftText = to.leftText;
            rightText = to.rightText;
          } else if (frame >= localStart) {
            const pastMid = frame >= localMid;
            const sourceLeftText = pastMid ? to.leftText : from.leftText;
            const sourceRightText = pastMid ? to.rightText : from.rightText;

            const seed = `${randomSeed}-row-${rowIndex}`;
            const activeFrame = frame - localStart;
            const seg = Math.floor(activeFrame / glitchSegmentFrames);
            const burst = random(`${seed}-burst-${seg}`) < strongGlitchProbability;
            const boost = burst ? 1.55 : 1;
            const displayLeftText = burst
              ? garbleChars(sourceLeftText, `${seed}-g-${seg}`, garbleRate)
              : sourceLeftText;
            const displayRightText = burst
              ? garbleChars(sourceRightText, `${seed}-rg-${seg}`, garbleRate)
              : sourceRightText;

            const offR = Math.round(
              (random(`${seed}-rx-${seg}`) - 0.5) * 2 * rgbOffsetMax * boost,
            );
            const offB = Math.round(
              (random(`${seed}-bx-${seg}`) - 0.5) * 2 * rgbOffsetMax * boost,
            );
            const jitterX =
              jitterPx > 0
                ? Math.round((random(`${seed}-jx-${frame}`) - 0.5) * 2 * jitterPx)
                : 0;
            const jitterY =
              jitterPx > 0
                ? Math.round((random(`${seed}-jy-${frame}`) - 0.5) * 2 * jitterPx)
                : 0;

            leftText = displayLeftText;
            rightText = displayRightText;
            leftContent = (
              <GlitchTextCell
                text={displayLeftText}
                textColor={textColor}
                channelRColor={channelRColor}
                channelBColor={channelBColor}
                offR={offR}
                offB={offB}
                jitterX={jitterX}
                jitterY={jitterY}
              />
            );
            rightContent = (
              <GlitchTextCell
                text={displayRightText}
                textColor={textColor}
                channelRColor={channelRColor}
                channelBColor={channelBColor}
                offR={offR}
                offB={offB}
                jitterX={jitterX}
                jitterY={jitterY}
              />
            );
          }

          return (
            <DottedLineRow
              key={`row-${rowIndex}`}
              leftText={leftText}
              leftContent={
                <FlickerText
                  frame={frame}
                  seed={`${randomSeed}-left-flicker-${rowIndex}`}
                  probability={flickerProbability}
                  segmentFrames={flickerSegmentFrames}
                  minimumOpacity={flickerMinimumOpacity}
                >
                  {leftContent ?? leftText}
                </FlickerText>
              }
              rightText={rightText}
              rightContent={
                <FlickerText
                  frame={frame}
                  seed={`${randomSeed}-right-flicker-${rowIndex}`}
                  probability={flickerProbability}
                  segmentFrames={flickerSegmentFrames}
                  minimumOpacity={flickerMinimumOpacity}
                >
                  {rightContent ?? rightText}
                </FlickerText>
              }
              fontSize={fontSize}
              textColor={textColor}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
