import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { OneTakeLogoTextSchemaV1Type } from "./onetake-logo-text-schema";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import { CTA_FLICKER_CYCLE_MS, ctaFlickerAt } from "../../Motion/OneTake/onetake-flicker";
import "../../helpers/jetbrains-mono";
import "../../helpers/space-grotesk";

/** Same letter spacing/decoration as asami.tokyo's `Eyebrow` (`app/(onetake)/ui.tsx`) */
const EYEBROW_LETTER_SPACING_PX = 1.5;
/** Same text shadow as asami.tokyo's `--onetake-text-glow-cyan` */
const EYEBROW_TEXT_SHADOW = "0 0 12px rgba(55, 233, 255, .5)";

/**
 * OneTake's logo text (eyebrow + title), ported from the asami.tokyo LP's hero
 * heading (`<Eyebrow>{dict.lp.eyebrow}</Eyebrow>` + `<h1>` in `OneTakeLP.tsx`).
 *
 * The eyebrow reuses that LP's "Join the waitlist" button hover animation
 * (`cta-flicker`, a neon-tube-turning-on effect). Since video has no hover
 * state, it fires once at `flickerTriggerFrame` and then settles into a
 * steady "always lit" state. Because the state before the trigger
 * (`frame < flickerTriggerFrame`) and the state well after it both look like
 * "always lit", looping the last frame back to the first frame doesn't break
 * anything (same reasoning as OnboardingConnectV1).
 */
export const OneTakeLogoTextTemplateV1: React.FC<
  OneTakeLogoTextSchemaV1Type
> = ({
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
  flickerTriggerFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsedSinceFlickerMs =
    frame < flickerTriggerFrame
      ? -1
      : Math.min(
          ((frame - flickerTriggerFrame) / fps) * 1000,
          CTA_FLICKER_CYCLE_MS,
        );
  const flicker = ctaFlickerAt(elapsedSinceFlickerMs);

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
            textShadow: EYEBROW_TEXT_SHADOW,
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
