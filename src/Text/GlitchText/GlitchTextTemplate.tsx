import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { GlitchTextSchemaType } from "./glitch-text.schema";
import "../../helpers/line-seed-jp";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const GARBLE_POOL = "0123456789.-▯∞";

function garbleChars(text: string, seed: string, rate: number): string {
  return Array.from(text)
    .map((ch, i) => {
      if (/\s/.test(ch)) {
        return ch;
      }
      if (random(`${seed}-gr-${i}`) < rate) {
        return GARBLE_POOL[
          Math.floor(random(`${seed}-gp-${i}`) * GARBLE_POOL.length)
        ];
      }
      return ch;
    })
    .join("");
}

export const GlitchTextTemplate: React.FC<GlitchTextSchemaType> = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  textColor,
  channelRColor,
  channelBColor,
  rgbOffsetMax,
  strongGlitchProbability,
  glitchSegmentFrames,
  garbleRate,
  jitterPx,
  scanlineOpacity,
  backgroundColor,
  paddingLeftPercent,
  paddingBottomPercent,
  randomSeed,
  fadeInDuration,
  delayFrames,
}) => {
  const frame = useCurrentFrame();
  const activeFrame = frame - delayFrames;

  const fade = useMemo(() => {
    if (activeFrame <= 0) {
      return 0;
    }
    if (fadeInDuration <= 0) {
      return 1;
    }
    return interpolate(activeFrame, [0, fadeInDuration], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  }, [activeFrame, fadeInDuration]);

  const {
    displayText,
    offR,
    offB,
    rgbBoost,
    burstY,
  } = useMemo(() => {
    const seg =
      activeFrame >= 0
        ? Math.floor(activeFrame / glitchSegmentFrames)
        : 0;
    const burst =
      activeFrame >= 0 &&
      random(`${randomSeed}-burst-${seg}`) < strongGlitchProbability;
    const boost = burst ? 1.55 : 1;
    const disp =
      burst && activeFrame >= 0
        ? garbleChars(text, `${randomSeed}-b-${seg}`, garbleRate)
        : text;

    const offRx = Math.round(
      (random(`${randomSeed}-rx-${seg}`) - 0.5) * 2 * rgbOffsetMax * boost,
    );
    const offBx = Math.round(
      (random(`${randomSeed}-bx-${seg}`) - 0.5) * 2 * rgbOffsetMax * boost,
    );
    const by = burst
      ? Math.round((random(`${randomSeed}-by-${seg}`) - 0.5) * 4)
      : 0;

    return {
      displayText: disp,
      offR: offRx,
      offB: offBx,
      rgbBoost: boost,
      burstY: by,
    };
  }, [
    activeFrame,
    text,
    randomSeed,
    rgbOffsetMax,
    strongGlitchProbability,
    glitchSegmentFrames,
    garbleRate,
  ]);

  const jitterX = useMemo(() => {
    if (activeFrame < 0 || jitterPx <= 0) {
      return 0;
    }
    return Math.round(
      (random(`${randomSeed}-jx-${frame}`) - 0.5) * 2 * jitterPx,
    );
  }, [activeFrame, frame, jitterPx, randomSeed]);

  const jitterY = useMemo(() => {
    if (activeFrame < 0 || jitterPx <= 0) {
      return 0;
    }
    return Math.round(
      (random(`${randomSeed}-jy-${frame}`) - 0.5) * 2 * jitterPx,
    );
  }, [activeFrame, frame, jitterPx, randomSeed]);

  const textBlockStyle: React.CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily,
    fontWeight: fontWeight as string,
    fontSize,
    letterSpacing,
    lineHeight,
    whiteSpace: "nowrap",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}>
      <div
        style={{
          position: "absolute",
          left: `${paddingLeftPercent}%`,
          bottom: `${paddingBottomPercent}%`,
          maxWidth: `${100 - paddingLeftPercent - 2}%`,
          opacity: fade,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            transform: `translate(${jitterX}px, ${jitterY + burstY}px)`,
          }}
        >
          <p
            style={{
              ...textBlockStyle,
              position: "absolute",
              left: offR,
              top: 0,
              color: channelRColor as string,
              opacity: 0.85,
              zIndex: 0,
            }}
          >
            {displayText}
          </p>
          <p
            style={{
              ...textBlockStyle,
              position: "absolute",
              left: offB,
              top: 0,
              color: channelBColor as string,
              opacity: 0.85,
              zIndex: 0,
            }}
          >
            {displayText}
          </p>
          <p
            style={{
              ...textBlockStyle,
              position: "relative",
              color: textColor,
              zIndex: 1,
              textShadow:
                rgbBoost > 1.2
                  ? `0 0 12px ${textColor}44, 0 0 2px rgba(0,0,0,0.8)`
                  : "none",
            }}
          >
            {displayText}
          </p>
        </div>
      </div>

      {scanlineOpacity > 0.01 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: scanlineOpacity * fade,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 3px)",
            mixBlendMode: "overlay",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
