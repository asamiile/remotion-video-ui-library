import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { CodeNoiseWallSchemaType } from "./code-noise-wall.schema";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";

const CHAR_POOL =
  "01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ.-_<>[]{}()#$%^&*+=~";

function randomChar(seed: string): string {
  const idx = Math.floor(random(seed) * CHAR_POOL.length);
  return CHAR_POOL[idx];
}

export const CodeNoiseWallTemplate: React.FC<CodeNoiseWallSchemaType> = ({
  backgroundColor,
  charColor,
  glowPx,
  fontSize,
  columnsPerRow,
  rowCount,
  regenerateEveryFrames,
  perspectiveTiltDeg,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const generation = Math.floor(frame / regenerateEveryFrames);

  const rows = useMemo(() => {
    return new Array(rowCount).fill(0).map((_, r) => {
      let line = "";
      for (let c = 0; c < columnsPerRow; c++) {
        line += randomChar(`${randomSeed}-${generation}-${r}-${c}`);
      }
      return line;
    });
  }, [rowCount, columnsPerRow, generation, randomSeed]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(backgroundColor),
        overflow: "hidden",
        perspective: 900,
      }}
    >
      <pre
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) rotateY(${perspectiveTiltDeg}deg)`,
          margin: 0,
          fontFamily: JETBRAINS_MONO_FONT_FAMILY,
          fontSize,
          lineHeight: 1.5,
          letterSpacing: 2,
          color: charColor as string,
          textShadow:
            glowPx > 0
              ? `0 0 ${glowPx}px ${charColor}, 0 0 ${glowPx * 2}px ${charColor}`
              : "none",
          whiteSpace: "pre",
        }}
      >
        {rows.join("\n")}
      </pre>
    </AbsoluteFill>
  );
};
