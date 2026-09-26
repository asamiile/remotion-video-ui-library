import React from "react";
import { AbsoluteFill, random } from "remotion";
import type { ScanEchoTransitionProps } from "./scan-echo-transition.schema";

export const ScanEchoCutCover: React.FC<{
  settings: ScanEchoTransitionProps;
  opacity: number;
  frame: number;
}> = ({ settings: p, opacity, frame }) => {
  const vertical = p.direction === "up" || p.direction === "down";
  const reverse = p.direction === "left" || p.direction === "up";
  const angle = vertical ? (reverse ? 0 : 180) : reverse ? 270 : 90;
  return (
    <AbsoluteFill style={{ backgroundColor: p.coverColor, opacity }}>
      {p.cutStyle === "chromatic" ? (
        <AbsoluteFill
          style={{
            backgroundImage: `linear-gradient(${angle}deg, ${p.primaryColor}, ${p.secondaryColor})`,
            opacity: 0.85,
          }}
        />
      ) : p.cutStyle === "prism" ? (
        <AbsoluteFill
          style={{
            backgroundImage: `conic-gradient(from ${angle + 30}deg at 50% 50%, ${p.primaryColor}, ${p.secondaryColor}, ${p.accentColor}, ${p.primaryColor})`,
            opacity: 0.8,
          }}
        />
      ) : p.cutStyle === "iris" ? (
        <AbsoluteFill
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, ${p.primaryColor} 0%, ${p.secondaryColor} 35%, ${p.accentColor} 39%, ${p.secondaryColor} 44%, ${p.coverColor} 80%)`,
            opacity: 0.9,
          }}
        />
      ) : p.cutStyle === "slats" ? (
        <AbsoluteFill
          style={{
            backgroundImage: `repeating-linear-gradient(${angle + 25}deg, ${p.primaryColor} 0px, ${p.primaryColor} 18px, ${p.secondaryColor} 19px, ${p.secondaryColor} 42px, ${p.coverColor} 43px, ${p.coverColor} 50px)`,
            opacity: 0.8,
          }}
        />
      ) : p.cutStyle === "static" ? (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 96 }, (_, index) => {
            const col = index % 12,
              row = Math.floor(index / 12);
            const value = random(
              `${p.seed}-cover-${index}-${Math.floor(frame / 2)}`,
            );
            return (
              <rect
                key={index}
                x={(col * 100) / 12}
                y={(row * 100) / 8}
                width={100 / 12 + 0.1}
                height={100 / 8 + 0.1}
                fill={value > 0.5 ? p.primaryColor : p.secondaryColor}
                opacity={0.1 + value * 0.65}
              />
            );
          })}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
