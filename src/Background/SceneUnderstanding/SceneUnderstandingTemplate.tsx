import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { cssColorToVec3 } from "../../helpers/shader/color";
import { PERSON_LOOP, STREET_LOOP } from "../../helpers/shader/glsl/street-scene";
import { ShaderCanvas } from "../../helpers/shader/ShaderCanvas";
import { sceneUnderstandingGlsl } from "./scene-understanding.glsl";
import {
  sceneUnderstandingModes,
  type SceneUnderstandingSchemaType,
} from "./scene-understanding.schema";

/** Fraction of each mode's time spent wiping it in. */
const WIPE = 0.3;

type Mode = SceneUnderstandingSchemaType["modes"][number];

const MODE_LABELS: Record<Mode, { title: string; detail: string }> = {
  camera: { title: "CAMERA INPUT", detail: "RGB // 1920x1080" },
  detection: { title: "3D OBJECT DETECTION", detail: "CLASS CAR // CONF > 0.90" },
  segmentation: { title: "SEMANTIC SEGMENTATION", detail: "8 CLASSES // PER PIXEL" },
  depth: { title: "DEPTH ESTIMATION", detail: "MONOCULAR // 0-90 m" },
  normals: { title: "SURFACE NORMALS", detail: "XYZ -> RGB" },
  edges: { title: "EDGE MAP", detail: "DEPTH + NORMAL + CLASS" },
};

const SEGMENT_LEGEND: [string, string][] = [
  ["ROAD", "rgb(128,64,128)"],
  ["SIDEWALK", "rgb(244,35,232)"],
  ["BUILDING", "rgb(70,70,70)"],
  ["POLE", "rgb(153,153,153)"],
  ["VEGETATION", "rgb(107,142,35)"],
  ["CAR", "rgb(0,0,142)"],
  ["PERSON", "rgb(220,20,60)"],
  ["SKY", "rgb(70,130,180)"],
];

const ModeLabel: React.FC<{
  mode: Mode;
  index: number;
  align: "left" | "right";
  labelColor: string;
}> = ({ mode, index, align, labelColor }) => {
  const label = MODE_LABELS[mode];
  const text: React.CSSProperties = {
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    color: labelColor,
    letterSpacing: 2,
    textShadow: "0 0 10px rgba(0,0,0,0.85)",
    whiteSpace: "nowrap",
  };
  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        [align]: 64,
        textAlign: align,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "left" ? "flex-start" : "flex-end",
        gap: 10,
      }}
    >
      {mode === "segmentation" ? (
        <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
          {SEGMENT_LEGEND.map(([name, color]) => (
            <div key={name} style={{ ...text, display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <div style={{ width: 14, height: 14, background: color, border: "1px solid rgba(255,255,255,0.6)" }} />
              {name}
            </div>
          ))}
        </div>
      ) : null}
      {mode === "depth" ? (
        <div style={{ ...text, display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 8 }}>
          NEAR
          <div
            style={{
              width: 260,
              height: 12,
              background: "linear-gradient(90deg, #fdeead, #de4a4a, #52126e, #000005)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          />
          FAR
        </div>
      ) : null}
      <div style={{ ...text, fontSize: 15, opacity: 0.75 }}>
        {`${String(index + 1).padStart(2, "0")} // ${label.detail}`}
      </div>
      <div style={{ ...text, fontSize: 34, fontWeight: 700 }}>{label.title}</div>
    </div>
  );
};

export const SceneUnderstandingTemplate: React.FC<SceneUnderstandingSchemaType> = ({
  modes,
  lineColor,
  labelColor,
  showLabels,
  loopTravels,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const count = modes.length;
  const framesPerMode = durationInFrames / count;
  const index = Math.min(count - 1, Math.floor(frame / framesPerMode));
  const local = (frame - index * framesPerMode) / framesPerMode;
  const previous = (index - 1 + count) % count;
  const split =
    count === 1
      ? 1
      : interpolate(local, [0, WIPE], [0, 1], {
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        });
  const modeIndex = (mode: Mode) => sceneUnderstandingModes.indexOf(mode);
  const splitPx = split * width;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ShaderCanvas
        fragmentShader={sceneUnderstandingGlsl}
        uniforms={{
          uModeA: modeIndex(modes[index]),
          uModeB: modeIndex(modes[previous]),
          uSplit: split,
          uLine: cssColorToVec3(lineColor),
          uTravel: (frame / durationInFrames) * STREET_LOOP * loopTravels,
          uWalk: (frame / durationInFrames) * PERSON_LOOP,
        }}
      />
      {showLabels ? (
        <>
          <AbsoluteFill style={{ clipPath: `inset(0 ${width - splitPx}px 0 0)` }}>
            <ModeLabel mode={modes[index]} index={index} align="left" labelColor={labelColor} />
          </AbsoluteFill>
          {split < 1 ? (
            <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${splitPx}px)` }}>
              <ModeLabel mode={modes[previous]} index={previous} align="right" labelColor={labelColor} />
            </AbsoluteFill>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
