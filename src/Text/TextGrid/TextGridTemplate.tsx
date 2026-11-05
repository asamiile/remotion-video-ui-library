import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { GARBLE_POOL_ALPHANUMERIC, garbleChars } from "../../helpers/effect-glitch-garble";
import { NEON_FLICKER_CYCLE_MS, neonFlickerAt } from "../../helpers/effect-neon-flicker";
import "../../helpers/font-line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import type { TextGridSchemaType } from "./text-grid.schema";

/**
 * Position in the effect sequence for each block (0 = first). Shuffled order
 * is a seeded Fisher-Yates shuffle, so it is the same on every render.
 */
const effectSlots = (
  count: number,
  order: TextGridSchemaType["effectOrder"],
  seed: string,
): number[] => {
  const slots = Array.from({ length: count }, (_, i) => i);
  if (order !== "shuffled") {
    return slots;
  }
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(random(`${seed}-${i}`) * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  return slots;
};

type GlitchState = {
  text: string;
  offR: number;
  offB: number;
  jitterX: number;
  jitterY: number;
  burst: boolean;
};

/** Harsh-signal glitch for one block at `glitchFrame` frames into its glitch. */
const glitchAt = (
  text: string,
  seed: string,
  glitchFrame: number,
  props: Pick<
    TextGridSchemaType,
    "glitchSegmentFrames" | "strongGlitchProbability" | "garbleRate" | "rgbOffsetMax" | "jitterPx"
  >,
): GlitchState => {
  const segment = Math.floor(glitchFrame / props.glitchSegmentFrames);
  const burst = random(`${seed}-burst-${segment}`) < props.strongGlitchProbability;
  const boost = burst ? 1.55 : 1;
  const offset = (key: string) =>
    Math.round((random(`${seed}-${key}-${segment}`) - 0.5) * 2 * props.rgbOffsetMax * boost);
  const jitter = (key: string) =>
    Math.round((random(`${seed}-${key}-${glitchFrame}`) - 0.5) * 2 * props.jitterPx);

  return {
    text: burst
      ? garbleChars(text, `${seed}-b-${segment}`, props.garbleRate, GARBLE_POOL_ALPHANUMERIC)
      : text,
    offR: offset("rx"),
    offB: offset("bx"),
    jitterX: jitter("jx"),
    jitterY: jitter("jy") + (burst ? Math.round((random(`${seed}-by-${segment}`) - 0.5) * 4) : 0),
    burst,
  };
};

/**
 * A columns x rows grid of blocks with one text centered in each. Each
 * block's text can play a flicker or glitch effect once, at its own time.
 * Blocks show clean, lit text before and after their effect, so the loop
 * has no seam.
 */
export const TextGridTemplate: React.FC<TextGridSchemaType> = ({
  texts,
  columns,
  rows,
  gapPx,
  paddingPx,
  blockColor,
  blockRadiusPx,
  fontFamily,
  fontSize,
  fontWeight,
  textColor,
  backgroundColor,
  effect,
  effectOrder,
  effectStartFrame,
  effectStaggerFrames,
  effectSeed,
  glitchDurationFrames,
  rgbOffsetMax,
  strongGlitchProbability,
  glitchSegmentFrames,
  garbleRate,
  jitterPx,
  channelRColor,
  channelBColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blockCount = columns * rows;

  const slots = useMemo(
    () => effectSlots(blockCount, effectOrder, effectSeed),
    [blockCount, effectOrder, effectSeed],
  );

  const textStyle: React.CSSProperties = {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight: 1.2,
    textAlign: "center",
    // Break only at "\n" in the text, never automatically
    whiteSpace: "pre",
    margin: 0,
  };

  const effectFrameFor = (blockIndex: number) =>
    frame - (effectStartFrame + slots[blockIndex] * effectStaggerFrames);

  /** Flicker dims and brightens the whole block, fill included. */
  const blockFlickerStyle = (blockIndex: number): React.CSSProperties => {
    if (effect !== "flicker") {
      return {};
    }
    const effectFrame = effectFrameFor(blockIndex);
    const elapsedMs =
      effectFrame < 0 ? -1 : Math.min((effectFrame / fps) * 1000, NEON_FLICKER_CYCLE_MS);
    const flicker = neonFlickerAt(elapsedMs);
    return { opacity: flicker.opacity, filter: `brightness(${flicker.brightness})` };
  };

  const renderText = (blockIndex: number) => {
    const text = texts[blockIndex] ?? "";
    const effectFrame = effectFrameFor(blockIndex);

    if (effect === "glitch" && effectFrame >= 0 && effectFrame < glitchDurationFrames) {
      const glitch = glitchAt(text, `${effectSeed}-block-${blockIndex}`, effectFrame, {
        glitchSegmentFrames,
        strongGlitchProbability,
        garbleRate,
        rgbOffsetMax,
        jitterPx,
      });
      return (
        <div
          style={{
            position: "relative",
            transform: `translate(${glitch.jitterX}px, ${glitch.jitterY}px)`,
          }}
        >
          <div style={{ ...textStyle, position: "absolute", left: glitch.offR, top: 0, color: channelRColor, opacity: 0.85 }}>
            {glitch.text}
          </div>
          <div style={{ ...textStyle, position: "absolute", left: glitch.offB, top: 0, color: channelBColor, opacity: 0.85 }}>
            {glitch.text}
          </div>
          <div
            style={{
              ...textStyle,
              position: "relative",
              color: textColor,
              textShadow: glitch.burst ? `0 0 12px ${textColor}44, 0 0 2px rgba(0,0,0,0.8)` : "none",
            }}
          >
            {glitch.text}
          </div>
        </div>
      );
    }

    return <div style={{ ...textStyle, color: textColor }}>{text}</div>;
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        padding: paddingPx,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: gapPx,
          width: "100%",
          height: "100%",
        }}
      >
        {Array.from({ length: blockCount }, (_, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: blockColor,
              borderRadius: blockRadiusPx,
              overflow: "hidden",
              ...blockFlickerStyle(i),
            }}
          >
            {renderText(i)}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
