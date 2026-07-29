import React, { useId, useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FilmGrainOverlaySchemaType } from "./film-grain-overlay.schema";

export const FilmGrainOverlayTemplateV1: React.FC<
  FilmGrainOverlaySchemaType
> = ({
  grainScale,
  grainOpacity,
  grainUpdateEveryFrames,
  grainTintColor,
  scratchCount,
  scratchOpacity,
  scratchFlickerEveryFrames,
  randomSeed,
}) => {
  const frame = useCurrentFrame();
  const filterId = useId().replace(/:/g, "");

  const grainBucket = Math.floor(frame / Math.max(1, grainUpdateEveryFrames));
  const seed = Math.floor(random(`${randomSeed}-grain-${grainBucket}`) * 1000);

  const scratches = useMemo(() => {
    if (scratchCount <= 0) {
      return [];
    }
    const bucket = Math.floor(frame / Math.max(1, scratchFlickerEveryFrames));
    return Array.from({ length: scratchCount }).map((_, i) => {
      const visible =
        random(`${randomSeed}-scratch-vis-${bucket}-${i}`) < 0.55;
      const leftPercent =
        random(`${randomSeed}-scratch-x-${bucket}-${i}`) * 100;
      const heightPercent =
        20 + random(`${randomSeed}-scratch-h-${bucket}-${i}`) * 60;
      const topPercent =
        random(`${randomSeed}-scratch-y-${bucket}-${i}`) * (100 - heightPercent);
      const widthPx =
        1 + random(`${randomSeed}-scratch-w-${bucket}-${i}`) * 1.5;
      return { visible, leftPercent, topPercent, heightPercent, widthPx };
    });
  }, [frame, randomSeed, scratchCount, scratchFlickerEveryFrames]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, opacity: grainOpacity }}
      >
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={grainScale / 40}
              numOctaves={2}
              seed={seed}
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
            <feComponentTransfer in="mono" result="alphaShaped">
              <feFuncA type="linear" slope={1.6} intercept={-0.15} />
            </feComponentTransfer>
            <feFlood floodColor={grainTintColor} result="tint" />
            <feComposite in="tint" in2="alphaShaped" operator="in" />
          </filter>
        </defs>
        <rect x={0} y={0} width="100%" height="100%" fill="white" filter={`url(#${filterId})`} />
      </svg>

      {scratches.map((s, i) =>
        s.visible ? (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${s.leftPercent}%`,
              top: `${s.topPercent}%`,
              height: `${s.heightPercent}%`,
              width: s.widthPx,
              backgroundColor: "#ffffff",
              opacity: scratchOpacity,
            }}
          />
        ) : null,
      )}
    </AbsoluteFill>
  );
};
