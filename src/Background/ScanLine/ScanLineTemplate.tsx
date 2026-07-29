import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ScanLineSchemaType } from "./scan-line.schema";

/** For crt style: spacing between raster lines (px) and their thickness (px) */
const CRT_RASTER_GAP_PX = 3;
const CRT_RASTER_LINE_PX = 1;
/**
 * For crt style: refresh-flicker speed (one cycle = an integer fraction of
 * scanPeriodFrames). Keeping it an integer number of cycles means the loop
 * stays seamless regardless of what scanPeriodFrames is set to.
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
 * Ambient background piece reproducing the slide background's "scan line".
 * Always transparent background, meant to be composited over other
 * compositions. It just sweeps at a constant speed from above the top edge to
 * below the bottom edge (a linear function of frame). At the loop seam (last
 * frame → first frame), the band sits just off-screen (bandHeight of margin
 * above and below), so the loop is seamless with no visible jump.
 *
 * With `scanStyle: "crt"`, thin horizontal raster lines (CSS
 * `repeating-linear-gradient`) cover the whole screen, with an
 * electron-beam-like band swept on top. A very slight overall flicker
 * (refresh flicker) is applied, but since its period is an integer fraction
 * of scanPeriodFrames, it doesn't break the seamless loop.
 */
export const ScanLineTemplate: React.FC<ScanLineSchemaType> = ({
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
