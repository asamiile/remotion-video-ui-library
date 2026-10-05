import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import type { PoseEstimationSchemaType } from "./pose-estimation.schema";
import {
  ACTION_RATE,
  KEYPOINTS,
  type KeypointName,
  type Point,
  type Pose,
  SKELETON,
  poseAt,
} from "./pose-kinematics";

const TAU = Math.PI * 2;
const TRAIL_FRAMES = 12;
const TRAIL_POINTS: KeypointName[] = ["leftWrist", "rightWrist", "leftAnkle", "rightAnkle"];
/** Off-screen margin walkers wrap through, in pixels. */
const WRAP_MARGIN = 320;

type Figure = PoseEstimationSchemaType["figures"][number];

export const PoseEstimationTemplate: React.FC<PoseEstimationSchemaType> = ({
  backgroundColor,
  figureColor,
  boxColor,
  figures,
  showSilhouette,
  showBoxes,
  showTrails,
  showHud,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const seconds = durationInFrames / fps;

  /** Screen-space keypoints for one figure at a given frame. */
  const screenPose = (figure: Figure, index: number, atFrame: number): Pose => {
    const phase = (((atFrame / durationInFrames) % 1) + 1) % 1;
    const cycles = Math.max(1, Math.round(seconds * ACTION_RATE[figure.action]));
    const c = TAU * cycles * phase + index * 1.7;
    const pose = poseAt(figure.action, c, figure.direction);
    const size = figure.scale * height;
    const groundY = height * (0.5 + figure.scale * 0.48);
    const span = width + WRAP_MARGIN * 2;
    const travel = figure.action === "walk" ? figure.direction * phase : 0;
    const cx = ((((figure.x + travel) % 1) + 1) % 1) * span - WRAP_MARGIN;
    const out = {} as Pose;
    for (const name of KEYPOINTS) {
      const p = pose[name];
      out[name] = { x: cx + p.x * size, y: groundY - p.y * size };
    }
    return out;
  };

  // Draw far (small) figures first.
  const order = figures
    .map((figure, index) => ({ figure, index }))
    .sort((a, b) => a.figure.scale - b.figure.scale);

  const text: React.CSSProperties = { fontFamily: JETBRAINS_MONO_FONT_FAMILY, letterSpacing: 1.5 };

  return (
    <AbsoluteFill style={{ backgroundColor: resolveCompositionBackdropColor(backgroundColor) }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {order.map(({ figure, index }) => {
          const pose = screenPose(figure, index, frame);
          const size = figure.scale * height;
          // Estimated keypoints wobble a little, like real detector output.
          const jitter = (name: string, axis: string) =>
            (random(`pose-${index}-${name}-${axis}-${frame}`) - 0.5) * size * 0.008;
          const est = Object.fromEntries(
            KEYPOINTS.map((name) => [name, { x: pose[name].x + jitter(name, "x"), y: pose[name].y + jitter(name, "y") }]),
          ) as Pose;
          const confidence = (name: string) => 0.72 + 0.27 * random(`conf-${index}-${name}-${Math.floor(frame / 4)}`);

          const xs = KEYPOINTS.map((n) => est[n].x);
          const ys = KEYPOINTS.map((n) => est[n].y);
          const pad = size * 0.06;
          const box = {
            x: Math.min(...xs) - pad,
            y: Math.min(...ys) - pad * 1.6,
            w: Math.max(...xs) - Math.min(...xs) + pad * 2,
            h: Math.max(...ys) - Math.min(...ys) + pad * 2.6,
          };
          const score = 0.9 + 0.08 * random(`score-${index}-${Math.floor(frame / 6)}`);
          const limbWidth = size * 0.07;
          const seg = (a: Point, b: Point) => `M${a.x} ${a.y}L${b.x} ${b.y}`;
          const neck = {
            x: (pose.leftShoulder.x + pose.rightShoulder.x) / 2,
            y: (pose.leftShoulder.y + pose.rightShoulder.y) / 2,
          };
          const hips = {
            x: (pose.leftHip.x + pose.rightHip.x) / 2,
            y: (pose.leftHip.y + pose.rightHip.y) / 2,
          };
          const headCenter = {
            x: (pose.leftEar.x + pose.rightEar.x) / 2,
            y: (pose.leftEar.y + pose.rightEar.y) / 2,
          };

          return (
            <g key={index}>
              {showSilhouette ? (
                <g stroke={figureColor} strokeLinecap="round" fill="none">
                  {(
                    [
                      ["rightShoulder", "rightElbow"],
                      ["rightElbow", "rightWrist"],
                      ["rightHip", "rightKnee"],
                      ["rightKnee", "rightAnkle"],
                    ] as const
                  ).map(([a, b]) => (
                    <path key={`${a}${b}`} d={seg(pose[a], pose[b])} strokeWidth={limbWidth} opacity={0.75} />
                  ))}
                  <path d={seg(neck, hips)} strokeWidth={size * 0.15} />
                  <path d={seg(pose.leftShoulder, pose.rightShoulder)} strokeWidth={limbWidth * 1.1} />
                  {(
                    [
                      ["leftShoulder", "leftElbow"],
                      ["leftElbow", "leftWrist"],
                      ["leftHip", "leftKnee"],
                      ["leftKnee", "leftAnkle"],
                    ] as const
                  ).map(([a, b]) => (
                    <path key={`${a}${b}`} d={seg(pose[a], pose[b])} strokeWidth={limbWidth} />
                  ))}
                  <circle cx={headCenter.x} cy={headCenter.y} r={size * 0.065} fill={figureColor} stroke="none" />
                </g>
              ) : null}

              {showTrails
                ? TRAIL_POINTS.map((name) => {
                    const points = Array.from({ length: TRAIL_FRAMES }, (_, i) => screenPose(figure, index, frame - i)[name]);
                    return points.slice(1).map((p, i) => (
                      <path
                        key={`${name}-${i}`}
                        d={seg(points[i], p)}
                        stroke={boxColor}
                        strokeWidth={3}
                        strokeLinecap="round"
                        opacity={(1 - i / TRAIL_FRAMES) * 0.6}
                      />
                    ));
                  })
                : null}

              <g strokeLinecap="round">
                {SKELETON.map(([a, b, color]) => (
                  <path key={`${a}-${b}`} d={seg(est[a], est[b])} stroke={color} strokeWidth={Math.max(3, size * 0.012)} opacity={0.95} />
                ))}
              </g>
              {KEYPOINTS.map((name) => (
                <circle
                  key={name}
                  cx={est[name].x}
                  cy={est[name].y}
                  r={Math.max(3.5, size * 0.011)}
                  fill="#ffffff"
                  stroke="#000"
                  strokeWidth={1}
                  opacity={confidence(name)}
                />
              ))}

              {showBoxes ? (
                <g>
                  <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="none" stroke={boxColor} strokeWidth={2} opacity={0.8} />
                  <rect x={box.x - 1} y={box.y - 26} width={150} height={26} fill={boxColor} />
                  <text x={box.x + 7} y={box.y - 8} fontSize={15} fill="#05080c" style={{ ...text, fontWeight: 700 }}>
                    {`PERSON ${score.toFixed(2)}`}
                  </text>
                  <text x={box.x + box.w} y={box.y + box.h + 20} fontSize={13} fill={boxColor} textAnchor="end" style={text}>
                    {`ID ${String(index + 1).padStart(2, "0")} // ${figure.action.toUpperCase()}`}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {showHud ? (
          <g fill={boxColor} style={text}>
            <text x={64} y={78} fontSize={22} style={{ ...text, fontWeight: 700 }}>
              POSE ESTIMATION // 17 KEYPOINTS
            </text>
            <text x={64} y={108} fontSize={15} opacity={0.8}>
              {`PERSONS ${String(figures.length).padStart(2, "0")}   FRAME ${String(frame).padStart(4, "0")}   MODEL TOP-DOWN`}
            </text>
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
