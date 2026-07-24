import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ScanLineSchemaV1Type } from "./scan-line-schema";

/** crt用: ラスター線の間隔（px）とその太さ（px） */
const CRT_RASTER_GAP_PX = 3;
const CRT_RASTER_LINE_PX = 1;
/**
 * crt用: リフレッシュフリッカーの明滅速度（1周期＝scanPeriodFramesの整数分の1）。
 * 整数サイクルにしておくことで、scanPeriodFramesがどんな値でもシームレスにループする。
 */
const CRT_FLICKER_CYCLES_PER_PERIOD = 23;

function ScanBand({
  y,
  bandHeight,
  color,
}: {
  y: number;
  bandHeight: number;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        height: bandHeight,
        background: `linear-gradient(to bottom, transparent 0%, ${color}55 45%, ${color} 50%, ${color}55 55%, transparent 100%)`,
      }}
    />
  );
}

/**
 * スライド背景の「捜査線」を再現するアンビエント背景パーツ。
 * 常時透明背景（他のコンポジションに重ねて使う前提）。上端の外側から下端の外側まで
 * 一定速度でスイープするだけ（frameの線形関数）。ループの継ぎ目（尺の最終フレーム→
 * 先頭フレーム）は帯が画面外（上下ともbandHeightぶん余白）にいる瞬間になるため、
 * 見た目上の跳躍なくシームレスにループする。
 *
 * `scanStyle: "crt"`では、画面全体に薄い水平ラスター線（CSSの`repeating-linear-gradient`）
 * を敷いた上に、電子ビームに相当する走査帯を重ねる。全体にごく僅かな明滅（リフレッシュ
 * フリッカー）を掛けているが、周期をscanPeriodFramesの整数分の1にしているため
 * シームレスループを崩さない。
 */
export const ScanLineTemplateV1: React.FC<ScanLineSchemaV1Type> = ({
  scanColor,
  bandHeight,
  scanStyle,
  scanPeriodFrames,
}) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  const t = (frame % scanPeriodFrames) / scanPeriodFrames;
  const baseY = t * (height + 2 * bandHeight) - bandHeight;

  if (scanStyle === "crt") {
    const flickerAngle =
      (frame / scanPeriodFrames) * CRT_FLICKER_CYCLES_PER_PERIOD * Math.PI * 2;
    const flicker = 1 - 0.03 * (0.5 + 0.5 * Math.sin(flickerAngle));

    return (
      <AbsoluteFill style={{ overflow: "hidden", opacity: flicker }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `repeating-linear-gradient(to bottom, ${scanColor}18 0px, ${scanColor}18 ${CRT_RASTER_LINE_PX}px, transparent ${CRT_RASTER_LINE_PX}px, transparent ${CRT_RASTER_GAP_PX}px)`,
          }}
        />
        <ScanBand y={baseY} bandHeight={bandHeight} color={scanColor} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <ScanBand y={baseY} bandHeight={bandHeight} color={scanColor} />
    </AbsoluteFill>
  );
};
