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
  // 周波数データを正規化してスケール
  const normalizedFrequencies = useMemo(() => {
    if (!frequencyData || frequencyData.length === 0) {
      return new Array(barCount).fill(0);
    }

    // frequencyData は既に visualizeAudio により計算されている
    // 0-255 の範囲で各バーの値が入っている
    const result: number[] = [];
    const step = Math.max(1, Math.floor(frequencyData.length / barCount));

    for (let i = 0; i < barCount; i++) {
      const idx = Math.min(i * step, frequencyData.length - 1);
      // 正規化（0-1）して sensitivity をかける
      const normalized = (frequencyData[idx] / 255) * sensitivity;
      result.push(Math.min(1, normalized));
    }

    return result;
  }, [frequencyData, barCount, sensitivity]);

  // SVG の全幅を計算
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
      {/* スペクトラムバー */}
      {normalizedFrequencies.map((frequency, index) => {
        const x = index * (barWidth + barGap);
        const barHeight = Math.min(containerHeight, frequency * containerHeight * 0.9);
        const y = containerHeight - barHeight;

        return (
          <g key={index}>
            {/* バー */}
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={barColor}
              rx={2}
            />

            {/* バーシャドウ */}
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
