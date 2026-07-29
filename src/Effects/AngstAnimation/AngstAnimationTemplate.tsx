import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";

interface AngstAnimationProps {}

interface StrokeSegment {
  id: number;
  baseX1: number;
  baseY1: number;
  baseX2: number;
  baseY2: number;
  opacity: number;
  z: number;
  animationSpeed: number;
  phaseX: number;
  phaseY: number;
  amplitudeX: number;
  amplitudeY: number;
  rotationSpeed: number;
  rotationPhase: number;
}

function generateStrokeSegments(seed: number): StrokeSegment[] {
  const segments: StrokeSegment[] = [];
  const centerX = 1920 / 2;
  const centerY = 1080 / 2;

  // 4層のレイヤー構造
  const layers = [
    { radius: 60, count: 30, minLength: 20, maxLength: 50 },
    { radius: 120, count: 50, minLength: 40, maxLength: 90 },
    { radius: 180, count: 60, minLength: 80, maxLength: 140 },
    { radius: 240, count: 40, minLength: 120, maxLength: 180 },
  ];

  let segmentId = 0;

  for (const layer of layers) {
    for (let i = 0; i < layer.count; i++) {
      const rng = (seed + segmentId * 7919) % 100000;
      const offset1 = (rng * 7919) % 100000;
      const offset2 = (offset1 * 7919) % 100000;
      const offset3 = (offset2 * 7919) % 100000;
      const offset4 = (offset3 * 7919) % 100000;
      const offset5 = (offset4 * 7919) % 100000;
      const offset6 = (offset5 * 7919) % 100000;
      const offset7 = (offset6 * 7919) % 100000;
      const offset8 = (offset7 * 7919) % 100000;
      const offset9 = (offset8 * 7919) % 100000;
      const offset10 = (offset9 * 7919) % 100000;

      // 球面上の開始点
      const phi = (offset1 / 100000) * Math.PI * 2;
      const theta = (offset2 / 100000) * Math.PI;

      const x0 = Math.sin(theta) * Math.cos(phi) * layer.radius;
      const y0 = Math.sin(theta) * Math.sin(phi) * layer.radius;
      const z = Math.cos(theta) * layer.radius;

      // ランダムな方向に短い線
      const linePhi = (offset3 / 100000) * Math.PI * 2;
      const lineTheta = (offset4 / 100000) * Math.PI;
      const lineLength = (offset5 / 100000) * (layer.maxLength - layer.minLength) + layer.minLength;

      const x1 = x0 + Math.sin(lineTheta) * Math.cos(linePhi) * lineLength;
      const y1 = y0 + Math.sin(lineTheta) * Math.sin(linePhi) * lineLength;

      // Z深度に基づいて不透明度を調整
      const opacityBase = (offset6 / 100000) * 0.4 + 0.5;
      const depthFactor = Math.max(0, (z + layer.radius) / (2 * layer.radius));
      const opacity = opacityBase * depthFactor;

      // アニメーションパラメータ
      const animationSpeed = (offset7 / 100000) * 3 + 1;
      const phaseX = (offset8 / 100000) * Math.PI * 2;
      const phaseY = (offset9 / 100000) * Math.PI * 2;
      const amplitudeX = (offset7 / 100000) * 40 + 20;
      const amplitudeY = (offset8 / 100000) * 40 + 20;
      const rotationSpeed = ((offset9 / 100000) - 0.5) * 4;
      const rotationPhase = (offset10 / 100000) * Math.PI * 2;

      segments.push({
        id: segmentId,
        baseX1: centerX + x0,
        baseY1: centerY + y0,
        baseX2: centerX + x1,
        baseY2: centerY + y1,
        opacity: Math.max(0.2, opacity),
        z,
        animationSpeed,
        phaseX,
        phaseY,
        amplitudeX,
        amplitudeY,
        rotationSpeed,
        rotationPhase,
      });

      segmentId++;
    }
  }

  // Z深度でソート
  segments.sort((a, b) => a.z - b.z);

  return segments;
}

export function AngstAnimationTemplate(
  props: AngstAnimationProps
): React.ReactElement {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const time = frame / fps;

  const segments = useMemo(() => generateStrokeSegments(12345), []);

  const centerX = 1920 / 2;
  const centerY = 1080 / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#060810" }}>
      <svg
        width="1920"
        height="1080"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          filter: "drop-shadow(0 0 30px rgba(238, 241, 252, 0.35))",
        }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {segments.map((segment) => {
          // 各線の独立したアニメーション
          const offsetX = Math.sin(time * segment.animationSpeed + segment.phaseX) * segment.amplitudeX;
          const offsetY = Math.cos(time * segment.animationSpeed + segment.phaseY) * segment.amplitudeY;

          // 回転アニメーション（線の角度が変わる）
          const rotation = time * segment.rotationSpeed + segment.rotationPhase;
          const cos = Math.cos(rotation);
          const sin = Math.sin(rotation);

          // 線の中点
          const midX = (segment.baseX1 + segment.baseX2) / 2;
          const midY = (segment.baseY1 + segment.baseY2) / 2;

          // 中点を基準に回転
          const dx1 = segment.baseX1 - midX;
          const dy1 = segment.baseY1 - midY;
          const x1Rotated = dx1 * cos - dy1 * sin;
          const y1Rotated = dx1 * sin + dy1 * cos;

          const dx2 = segment.baseX2 - midX;
          const dy2 = segment.baseY2 - midY;
          const x2Rotated = dx2 * cos - dy2 * sin;
          const y2Rotated = dx2 * sin + dy2 * cos;

          // 透明度の変化（脈動）
          const pulseFactor = Math.sin(time * segment.animationSpeed * 0.5 + segment.phaseX) * 0.3 + 0.7;
          const animatedOpacity = segment.opacity * pulseFactor;

          return (
            <line
              key={segment.id}
              x1={midX + x1Rotated + offsetX}
              y1={midY + y1Rotated + offsetY}
              x2={midX + x2Rotated + offsetX}
              y2={midY + y2Rotated + offsetY}
              stroke="#EEF1FC"
              strokeWidth="5"
              strokeLinecap="round"
              opacity={animatedOpacity}
              filter="url(#glow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}
