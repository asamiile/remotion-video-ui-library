import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { OneTakeLogoTextSchemaV1Type } from "./onetake-logo-text-schema";
import { resolveCompositionBackdropColor } from "../../../helpers/transparent-composition-backdrop";
import { CTA_FLICKER_CYCLE_MS, ctaFlickerAt } from "../../onetake-flicker";
import "../../../helpers/jetbrains-mono";
import "../../../helpers/space-grotesk";

/** asami.tokyoの`Eyebrow`（`app/(onetake)/ui.tsx`）と同じ字間・装飾 */
const EYEBROW_LETTER_SPACING_PX = 1.5;
/** asami.tokyoの`--onetake-text-glow-cyan`と同じテキストシャドウ */
const EYEBROW_TEXT_SHADOW = "0 0 12px rgba(55, 233, 255, .5)";

/**
 * OneTakeのロゴ文字（eyebrow + title）。asami.tokyo LPのヒーロー見出し
 * （`OneTakeLP.tsx`の`<Eyebrow>{dict.lp.eyebrow}</Eyebrow>` + `<h1>`）を移植したもの。
 *
 * eyebrowには、同LPの「Join the waitlist」ボタンのhoverアニメーション
 * （`cta-flicker`、ネオン管が点灯する演出）を移植して適用している。動画にhover状態は
 * 無いため、`flickerTriggerFrame`で一度だけ発火させ、その後は常時点灯の状態で
 * 落ち着く。発火前（`frame < flickerTriggerFrame`）と発火後十分経過した状態は
 * どちらも「常時点灯」で同じ見た目になるため、尺の最終フレーム→先頭フレームを
 * ループさせても破綻しない（OnboardingConnectV1と同じ考え方）。
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
