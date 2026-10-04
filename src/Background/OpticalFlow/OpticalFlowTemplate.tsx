import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { cssColorToVec3 } from "../../helpers/shader/color";
import { PERSON_LOOP, STREET_LOOP } from "../../helpers/shader/glsl/street-scene";
import { ShaderCanvas } from "../../helpers/shader/ShaderCanvas";
import { opticalFlowGlsl } from "./optical-flow.glsl";
import type { OpticalFlowSchemaType } from "./optical-flow.schema";

const BACKGROUND_MODES = { wheel: 0, dark: 1, camera: 2 } as const;

export const OpticalFlowTemplate: React.FC<OpticalFlowSchemaType> = ({
  background,
  showArrows,
  arrowSpacing,
  arrowScale,
  arrowColor,
  maxFlow,
  hudColor,
  showHud,
  loopTravels,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const phase = frame / durationInFrames;
  const seconds = durationInFrames / fps;

  const text: React.CSSProperties = {
    position: "absolute",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    color: hudColor,
    letterSpacing: 2,
    whiteSpace: "pre",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ShaderCanvas
        fragmentShader={opticalFlowGlsl}
        uniforms={{
          uTravel: phase * STREET_LOOP * loopTravels,
          uWalk: phase * PERSON_LOOP,
          uTravelRate: (STREET_LOOP * loopTravels) / seconds,
          uWalkRate: PERSON_LOOP / seconds,
          uFps: fps,
          uBackgroundMode: BACKGROUND_MODES[background],
          uShowArrows: showArrows,
          uArrowSpacing: arrowSpacing,
          uArrowScale: arrowScale,
          uArrowFixed: arrowColor.trim() !== "",
          uArrowColor: cssColorToVec3(arrowColor.trim() || "#ffffff"),
          uMaxFlow: maxFlow,
        }}
      />
      {showHud ? (
        <>
          <div style={{ ...text, left: 64, top: 56, fontSize: 22, fontWeight: 700 }}>
            OPTICAL FLOW // DENSE
          </div>
          <div style={{ ...text, left: 64, top: 92, fontSize: 15, opacity: 0.8 }}>
            {`FRAME ${String(frame).padStart(4, "0")}   SCALE ${maxFlow} px/frame`}
          </div>
          <div
            style={{
              position: "absolute",
              right: 72,
              bottom: 72,
              width: 120,
              height: 120,
              borderRadius: "50%",
              // Matches the shader: hue = direction (angle + 180deg), saturation = speed.
              background:
                background === "wheel"
                  ? "radial-gradient(circle, #fff 0%, rgba(255,255,255,0) 70%), conic-gradient(from 90deg, #00ffff, #00ff00, #ffff00, #ff0000, #ff00ff, #0000ff, #00ffff)"
                  : "radial-gradient(circle, #000 0%, rgba(0,0,0,0) 70%), conic-gradient(from 90deg, #00ffff, #00ff00, #ffff00, #ff0000, #ff00ff, #0000ff, #00ffff)",
              border: `1px solid ${hudColor}`,
            }}
          />
          <div style={{ ...text, right: 72, bottom: 204, fontSize: 13, opacity: 0.8 }}>DIRECTION</div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
