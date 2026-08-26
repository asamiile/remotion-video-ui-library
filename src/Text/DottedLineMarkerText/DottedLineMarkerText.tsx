import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { DottedLineMarkerTextSchemaType } from "./dotted-line-marker-text.schema";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

export const DottedLineRow: React.FC<{
  leftText: string;
  rightText: string;
  fontSize: number;
  textColor: string;
  /** Overrides the rendered left-text node (e.g. a glitch effect) while keeping `leftText` for width estimation. */
  leftContent?: React.ReactNode;
  /** Overrides the rendered right-text node (e.g. a glitch effect) while keeping `rightText` for layout. */
  rightContent?: React.ReactNode;
}> = ({
  leftText,
  rightText,
  fontSize,
  textColor,
  leftContent,
  rightContent,
}) => {
  const frame = useCurrentFrame();

  const containerWidth = 1610;
  // 各要素の幅を計算
  const marginPx = 40; // 左右余白
  const rightTextWidth = 60; // 右テキスト（数字）の固定幅
  const leftTextWidthEstimate = leftText.length * (fontSize * 0.5); // 左テキストの概算幅

  // 破線アニメーション - 1秒で1文字分左に移動＋点滅
  // 1秒 = 30フレーム（30fps）
  const charWidth = fontSize * 0.5; // 1文字分の幅
  const dotScrollDurationFrames = 30; // 1秒で1文字分移動

  // スクロール移動
  const dotScrollOffset = interpolate(
    frame % dotScrollDurationFrames,
    [0, dotScrollDurationFrames],
    [0, -charWidth],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 点滅（0.3秒周期）
  const blinkDuration = 9; // 0.3秒 = 9フレーム（30fps）
  const blinkPhase = frame % blinkDuration;
  const dotOpacity = interpolate(
    blinkPhase,
    [0, blinkDuration / 2, blinkDuration],
    [1, 1, 0.15],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // 破線の動的な長さ
  const availableWidth = containerWidth - marginPx * 2 - leftTextWidthEstimate - rightTextWidth - 40; // 40px は左右テキスト間の余白

  // 破線文字列を生成（幅に応じて）
  const dotsCount = Math.max(
    Math.floor(availableWidth / (fontSize * 0.5)),
    10
  );
  const dotPattern = "·".repeat(dotsCount);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        fontFamily: JETBRAINS_MONO_FONT_FAMILY,
        fontSize: `${fontSize}px`,
        fontWeight: 400,
        color: textColor,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* 左マージン */}
      <div style={{ width: `${marginPx}px`, flexShrink: 0 }} />

      {/* 左テキスト */}
      <div
        style={{
          flexShrink: 0,
        }}
      >
        {leftContent ?? leftText}
      </div>

      {/* 左テキストと破線の間の余白 */}
      <div style={{ width: "20px", flexShrink: 0 }} />

      {/* 破線部分 - 点滅＋スクロールアニメーション */}
      <div
        style={{
          flex: "1 1 auto",
          overflow: "hidden",
          fontSize: `${fontSize}px`,
          lineHeight: "1",
          textAlign: "center",
          minWidth: "100px",
        }}
      >
        <div
          style={{
            opacity: dotOpacity,
            transform: `translateX(${dotScrollOffset}px)`,
          }}
        >
          {dotPattern}
        </div>
      </div>

      {/* 破線と右テキストの間の余白 */}
      <div style={{ width: "20px", flexShrink: 0 }} />

      {/* 右テキスト - 固定幅 */}
      <div
        style={{
          flexShrink: 0,
          width: "60px",
          textAlign: "right",
        }}
      >
        {rightContent ?? rightText}
      </div>

      {/* 右マージン */}
      <div style={{ width: `${marginPx}px`, flexShrink: 0 }} />
    </div>
  );
};

export const DottedLineMarkerText: React.FC<DottedLineMarkerTextSchemaType> =
  ({
    fontSize,
    textColor,
    backgroundColor,
    items,
  }) => {

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
          {/* 設定したアイテムのみ表示 */}
          {items.map((item, itemIndex) => (
            <DottedLineRow
              key={`item-${itemIndex}`}
              leftText={item.leftText}
              rightText={item.rightText}
              fontSize={fontSize}
              textColor={textColor}
            />
          ))}
        </div>
      </AbsoluteFill>
    );
  };
