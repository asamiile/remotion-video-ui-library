import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../../helpers/font-jetbrains-mono";
import { cssColorToVec3 } from "../../../helpers/shader/color";
import { PERSON_LOOP, STREET_LOOP } from "../../../helpers/shader/glsl/street-scene";
import { useMediaTexture } from "../../../helpers/shader/media";
import { ShaderCanvas } from "../../../helpers/shader/ShaderCanvas";
import { footagePassGlsl } from "./footage-pass.glsl";
import { footagePassModes, type FootagePassSchemaType } from "./footage-pass.schema";

const MODE_LABELS: Record<FootagePassSchemaType["mode"], string> = {
  edges: "EDGE DETECTION",
  thermal: "THERMAL // LUMINANCE",
  segment: "SEGMENTATION // CLASSES",
  attention: "ATTENTION MAP",
  mosaic: "FEATURE MAPS",
};

const MOSAIC_LABELS = [
  "RGB INPUT",
  "GRAYSCALE",
  "GRADIENT MAGNITUDE",
  "GRADIENT X",
  "GRADIENT Y",
  "THRESHOLD",
  "POSTERIZE",
  "THERMAL",
  "CLASSES",
];

export const FootagePassTemplate: React.FC<FootagePassSchemaType> = ({
  src,
  startSeconds,
  mode,
  reveal,
  lineColor,
  gain,
  showLabels,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const phase = frame / durationInFrames;
  const media = useMediaTexture({ src, startSeconds });

  const text: React.CSSProperties = {
    position: "absolute",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    color: lineColor,
    letterSpacing: 2,
    whiteSpace: "nowrap",
    textShadow: "0 0 6px rgba(0,0,0,0.9)",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {media.element}
      <ShaderCanvas
        fragmentShader={footagePassGlsl}
        textures={{ uSource: media.texture }}
        uniforms={{
          uMode: footagePassModes.indexOf(mode),
          uPhase: phase,
          uReveal: reveal,
          uLine: cssColorToVec3(lineColor),
          uGain: gain,
          uTravel: phase * STREET_LOOP,
          uWalk: phase * PERSON_LOOP,
        }}
      />
      {showLabels && mode === "mosaic"
        ? MOSAIC_LABELS.map((label, i) => (
            <div
              key={label}
              style={{
                ...text,
                left: (i % 3) * (width / 3) + 18,
                top: Math.floor(i / 3) * (height / 3) + 14,
                fontSize: 14,
              }}
            >
              {`${String(i).padStart(2, "0")} ${label}`}
            </div>
          ))
        : null}
      {showLabels && mode !== "mosaic" ? (
        <>
          <div style={{ ...text, left: 64, top: 56, fontSize: 22, fontWeight: 700 }}>{MODE_LABELS[mode]}</div>
          <div style={{ ...text, left: 64, top: 92, fontSize: 15, opacity: 0.8 }}>
            {`SOURCE ${src ? src.split("/").pop()?.toUpperCase() : "DEMO STREET"}   FRAME ${String(frame).padStart(4, "0")}`}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
