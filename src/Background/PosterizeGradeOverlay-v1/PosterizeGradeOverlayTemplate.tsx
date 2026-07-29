import React from "react";
import { AbsoluteFill } from "remotion";
import { PosterizeGradeOverlaySchemaV1Type } from "./posterize-grade-overlay.schema";

export const PosterizeGradeOverlayTemplateV1: React.FC<
  PosterizeGradeOverlaySchemaV1Type
> = ({
  washColor,
  washOpacity,
  desaturateFirst,
  desaturateOpacity,
  vignetteColor,
  vignetteOpacity,
}) => {
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {desaturateFirst ? (
        <AbsoluteFill
          style={{
            backgroundColor: "#808080",
            opacity: desaturateOpacity,
            mixBlendMode: "luminosity",
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          backgroundColor: washColor,
          opacity: washOpacity,
          mixBlendMode: "color",
        }}
      />
      {vignetteOpacity > 0 ? (
        <AbsoluteFill
          style={{
            opacity: vignetteOpacity,
            background: `radial-gradient(ellipse at center, transparent 45%, ${vignetteColor} 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
