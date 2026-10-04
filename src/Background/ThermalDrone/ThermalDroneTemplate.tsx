import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { cssColorToVec3 } from "../../helpers/shader/color";
import { PERSON_LOOP, STREET_LOOP } from "../../helpers/shader/glsl/street-scene";
import { ShaderCanvas } from "../../helpers/shader/ShaderCanvas";
import { thermalDroneGlsl } from "./thermal-drone.glsl";
import type { ThermalDroneSchemaType } from "./thermal-drone.schema";

const PALETTES = { whiteHot: 0, blackHot: 1, ironbow: 2 } as const;
const PALETTE_LABELS = { whiteHot: "WHT HOT", blackHot: "BLK HOT", ironbow: "IRONBOW" } as const;

export const ThermalDroneTemplate: React.FC<ThermalDroneSchemaType> = ({
  palette,
  hudColor,
  vehicleColor,
  trackPeople,
  trackVehicles,
  showHud,
  altitude,
  noise,
  loopTravels,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width, height } = useVideoConfig();
  const phase = frame / durationInFrames;
  const seconds = durationInFrames / fps;
  const speed = ((STREET_LOOP * loopTravels) / seconds) * 3.6;
  const heading = 2 + Math.sin(phase * Math.PI * 2) * 1.5;

  const text: React.CSSProperties = {
    position: "absolute",
    fontFamily: JETBRAINS_MONO_FONT_FAMILY,
    color: hudColor,
    fontSize: 16,
    letterSpacing: 2,
    whiteSpace: "pre",
    textShadow: "0 0 4px rgba(0,0,0,0.9)",
  };
  const cx = width / 2;
  const cy = height / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ShaderCanvas
        fragmentShader={thermalDroneGlsl}
        uniforms={{
          uTravel: phase * STREET_LOOP * loopTravels,
          uWalk: phase * PERSON_LOOP,
          uPhase: phase,
          uAltitude: altitude,
          uPalette: PALETTES[palette],
          uNoise: noise,
          uTrackPeople: trackPeople,
          uTrackVehicles: trackVehicles,
          uHud: cssColorToVec3(hudColor),
          uVehicle: cssColorToVec3(vehicleColor),
        }}
      />
      {showHud ? (
        <>
          <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
            <g stroke={hudColor} strokeWidth={2} fill="none" opacity={0.85}>
              <path d={`M${cx - 60} ${cy}H${cx - 18}M${cx + 18} ${cy}H${cx + 60}M${cx} ${cy - 60}V${cy - 18}M${cx} ${cy + 18}V${cy + 60}`} />
              <circle cx={cx} cy={cy} r={4} />
              <path d={`M90 140V90H140M${width - 140} 90H${width - 90}V140M${width - 90} ${height - 140}V${height - 90}H${width - 140}M140 ${height - 90}H90V${height - 140}`} strokeWidth={3} />
            </g>
            {/* Heading tape */}
            <g stroke={hudColor} fill={hudColor} opacity={0.8}>
              {Array.from({ length: 21 }, (_, i) => {
                const deg = Math.round(heading) - 10 + i;
                const x = cx + (deg - heading) * 22;
                const major = ((deg % 5) + 5) % 5 === 0;
                return (
                  <g key={i}>
                    <line x1={x} y1={70} x2={x} y2={major ? 86 : 78} strokeWidth={1.5} />
                    {major ? (
                      <text x={x} y={106} fontSize={13} textAnchor="middle" stroke="none" style={{ fontFamily: JETBRAINS_MONO_FONT_FAMILY }}>
                        {String((deg + 360) % 360).padStart(3, "0")}
                      </text>
                    ) : null}
                  </g>
                );
              })}
              <path d={`M${cx - 7} 60L${cx + 7} 60L${cx} 68Z`} stroke="none" />
            </g>
          </svg>
          <div style={{ ...text, left: 110, top: 160 }}>{`IR // ${PALETTE_LABELS[palette]}\nZOOM 2.0x\nNUC OK`}</div>
          <div style={{ ...text, right: 110, top: 160, textAlign: "right" }}>
            {`ALT ${Math.round(altitude * 3.3)} ft\nGS ${speed.toFixed(0)} km/h\nREC ${String(Math.floor(frame / fps)).padStart(2, "0")}:${String(frame % fps).padStart(2, "0")}`}
          </div>
          <div style={{ ...text, left: 110, bottom: 150 }}>{`TRK PERSON / VEHICLE\nAUTO-TRACK ON`}</div>
          <div style={{ ...text, right: 110, bottom: 150, textAlign: "right" }}>
            {`N 35.6${String(4100 + Math.round(phase * 90)).padStart(4, "0")}\nE 139.7${String(3120 + Math.round(phase * 40)).padStart(4, "0")}`}
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
