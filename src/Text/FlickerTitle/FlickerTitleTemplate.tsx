import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { FlickerTitleSchemaType } from "./flicker-title.schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import { NEON_FLICKER_CYCLE_MS, neonFlickerAt } from "../../helpers/effect-neon-flicker";

const EYEBROW_LETTER_SPACING_PX = 1.5;

/**
 * Two-line title card: eyebrow + title, with a flicker-in effect
 * (`helpers/effect-neon-flicker.ts`) applied to the eyebrow. The default
 * pattern stays neutral (no glow, muted colors); looks such as a glowing
 * eyebrow or a repeating flicker are patterns in `flickerTitlePatterns`, and
 * per-project copy belongs in `composition-text.local.json`.
 *
 * The flicker-in effect fires exactly once at `flickerTriggerFrame`, after
 * which it settles into a steady "lit" state. Because the pre-trigger state
 * (`frame < flickerTriggerFrame`) and the long-settled post-trigger state
 * both render as the same steady "lit" look, looping the last frame back to
 * the first frame doesn't produce a visible seam.
 */
export const FlickerTitleTemplate: React.FC<FlickerTitleSchemaType> = ({
  eyebrowText,
  titleText,
  eyebrowFontSize,
  titleFontSize,
  gapPx,
  eyebrowFontFamily,
  titleFontFamily,
  eyebrowColor,
  titleColor,
  backgroundColor,
  eyebrowGlowColor,
  eyebrowGlowBlurPx,
  flickerTriggerFrame,
  flickerRepeatFrames,
}) => {
  const currentFrame = useCurrentFrame();
  const frame =
    flickerRepeatFrames > 0 ? currentFrame % flickerRepeatFrames : currentFrame;
  const { fps } = useVideoConfig();

  const elapsedSinceFlickerMs =
    frame < flickerTriggerFrame
      ? -1
      : Math.min(
          ((frame - flickerTriggerFrame) / fps) * 1000,
          NEON_FLICKER_CYCLE_MS,
        );
  const flicker = neonFlickerAt(elapsedSinceFlickerMs);

  const backdropColor = resolveCompositionBackdropColor(backgroundColor);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backdropColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: gapPx,
        }}
      >
        <div
          style={{
            fontFamily: eyebrowFontFamily,
            fontSize: eyebrowFontSize,
            fontWeight: 700,
            letterSpacing: EYEBROW_LETTER_SPACING_PX,
            textTransform: "uppercase",
            color: eyebrowColor,
            textShadow:
              eyebrowGlowBlurPx > 0
                ? `0 0 ${eyebrowGlowBlurPx}px ${eyebrowGlowColor}`
                : undefined,
            opacity: flicker.opacity,
            filter: `brightness(${flicker.brightness})`,
          }}
        >
          {eyebrowText}
        </div>
        <div
          style={{
            fontFamily: titleFontFamily,
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.25,
            color: titleColor,
          }}
        >
          {titleText}
        </div>
      </div>
    </AbsoluteFill>
  );
};
