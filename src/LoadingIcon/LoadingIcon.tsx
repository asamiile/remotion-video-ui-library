import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface LoadingIconProps {
  size?: number;
  lightColor?: string;
  darkColor?: string;
  strokeWidth?: number;
}

export const LoadingIcon: React.FC<LoadingIconProps> = ({
  size = 100,
  lightColor = "#DFE2D7",
  darkColor = "#6B685C",
  strokeWidth = 4,
}) => {
  const frame = useCurrentFrame();
  
  // 360度回転（60フレームで1回転）
  const rotation = interpolate(frame, [0, 60], [0, 360], {
    extrapolateLeft: "loop",
    extrapolateRight: "loop",
  });

  const center = size / 2;
  const radius1 = size / 6; // 内側の円
  const radius2 = size / 3.5; // 中間の円
  const radius3 = size / 2.2; // 外側の円

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* 中心の小さい円 */}
        <circle
          cx={center}
          cy={center}
          r={radius1}
          fill="none"
          stroke={darkColor}
          strokeWidth={strokeWidth}
        />

        {/* 中間の円 - 60度区間を3つ */}
        <g>
          {/* セグメント1 */}
          <path
            d={`M ${center} ${center - radius2} A ${radius2} ${radius2} 0 0 1 ${
              center + radius2 * Math.sin((Math.PI / 3) / 2)
            } ${center - radius2 * Math.cos((Math.PI / 3) / 2)}`}
            fill="none"
            stroke={lightColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* セグメント2 */}
          <path
            d={`M ${center + radius2 * Math.sin((Math.PI / 3) * (3 / 2))
              } ${center - radius2 * Math.cos((Math.PI / 3) * (3 / 2))} A ${radius2} ${radius2} 0 0 1 ${
              center + radius2 * Math.sin((Math.PI / 3) * (5 / 2))
            } ${center - radius2 * Math.cos((Math.PI / 3) * (5 / 2))}`}
            fill="none"
            stroke={lightColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* セグメント3 */}
          <path
            d={`M ${center + radius2 * Math.sin((Math.PI / 3) * (5 / 2))
              } ${center - radius2 * Math.cos((Math.PI / 3) * (5 / 2))} A ${radius2} ${radius2} 0 0 1 ${
              center + radius2 * Math.sin((Math.PI / 3) * (7 / 2))
            } ${center - radius2 * Math.cos((Math.PI / 3) * (7 / 2))}`}
            fill="none"
            stroke={darkColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </g>

        {/* 外側の円 - ドーナッツ状 */}
        <circle
          cx={center}
          cy={center}
          r={radius3}
          fill="none"
          stroke={lightColor}
          strokeWidth={strokeWidth}
          opacity={0.6}
        />

        {/* 外側の円 - セグメント */}
        <path
          d={`M ${center} ${center - radius3} A ${radius3} ${radius3} 0 0 1 ${
            center + radius3 * Math.sin(Math.PI / 4)
          } ${center - radius3 * Math.cos(Math.PI / 4)}`}
          fill="none"
          stroke={darkColor}
          strokeWidth={strokeWidth * 1.5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
