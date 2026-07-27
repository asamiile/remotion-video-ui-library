import React, { useMemo } from "react";

interface SpectrumVisualizerProps {
  frequencyData: number[] | null;
  barCount: number;
  barColor: string;
  barWidth: number;
  barGap: number;
  containerHeight: number;
  sensitivity: number;
  smoothing: number;
}

export const SpectrumVisualizer: React.FC<SpectrumVisualizerProps> = ({
  frequencyData,
  barCount,
  barColor,
  barWidth,
  barGap,
  containerHeight,
  sensitivity,
  smoothing,
}) => {
  const normalizedFrequencies = useMemo(() => {
    if (!frequencyData || frequencyData.length === 0) {
      return new Array(barCount).fill(0);
    }

    // frequencyData values arrive already scaled to 0-255 by visualizeAudio
    const result: number[] = [];
    const step = Math.max(1, Math.floor(frequencyData.length / barCount));

    for (let i = 0; i < barCount; i++) {
      const idx = Math.min(i * step, frequencyData.length - 1);
      const normalized = (frequencyData[idx] / 255) * sensitivity;
      result.push(Math.min(1, normalized));
    }

    return result;
  }, [frequencyData, barCount, sensitivity]);

  const svgWidth = useMemo(
    () => barCount * (barWidth + barGap),
    [barCount, barWidth, barGap]
  );

  return (
    <svg
      width={svgWidth}
      height={containerHeight}
      viewBox={`0 0 ${svgWidth} ${containerHeight}`}
      style={{ position: "relative" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {normalizedFrequencies.map((frequency, index) => {
        const x = index * (barWidth + barGap);
        const barHeight = Math.min(containerHeight, frequency * containerHeight * 0.9);
        const y = containerHeight - barHeight;

        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={barColor}
              rx={2}
            />

            {barHeight > 0 && (
              <filter id={`shadow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="3"
                  floodOpacity="0.3"
                />
              </filter>
            )}
          </g>
        );
      })}
    </svg>
  );
};
