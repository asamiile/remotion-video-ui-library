import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";

interface AngstAnimationProps {}

interface CurveSegment {
  id: number;
  points: Array<{ x: number; y: number }>;
  opacity: number;
  animationSpeed: number;
  phaseX: number;
  phaseY: number;
  amplitudeX: number;
  amplitudeY: number;
  rotationSpeed: number;
  rotationPhase: number;
}

function pseudoNoise(x: number, y: number, z: number = 0): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 43.614) * 43758.5453;
  return n - Math.floor(n);
}

function generateSpiralsWithNoise(seed: number): CurveSegment[] {
  const curves: CurveSegment[] = [];
  const centerX = 1920 / 2;
  const centerY = 1080 / 2;
  const spiralCount = 16; // 増加させてより複雑に
  const basePointsPerSpiral = 32;

  for (let s = 0; s < spiralCount; s++) {
    const rng = (seed + s * 7919) % 100000;
    const offset1 = (rng * 7919) % 100000;
    const offset2 = (offset1 * 7919) % 100000;
    const offset3 = (offset2 * 7919) % 100000;
    const offset0 = (offset3 * 7919) % 100000;

    // より大きなバリエーション
    const phaseOffset = (offset1 / 100000) * Math.PI * 2;
    const freqA = (offset2 / 100000) * 11 + 1; // 1-12（より広い範囲）
    const freqB = (offset3 / 100000) * 11 + 1;
    const freqVariation = (offset0 / 100000) * 3 - 1.5; // -1.5 to 1.5の変動
    const radiusBase = (offset1 / 100000) * 180 + 100; // 100-280（より変動）
    const zScale = (offset2 / 100000) * 0.8 + 0.2; // 0.2-1.0（より変動）

    // ウェイポイント数をランダムに変更
    const pointsPerSpiral = Math.floor((offset3 / 100000) * 30 + basePointsPerSpiral);

    const points: Array<{ x: number; y: number }> = [];

    for (let p = 0; p < pointsPerSpiral; p++) {
      const t = p / pointsPerSpiral;
      const tNoise = pseudoNoise(t * 10 + offset1 / 100000, s * 3, offset2 / 100000);

      // より複雑な角度計算
      const angle =
        t * Math.PI * 4 +
        freqVariation * Math.sin(t * Math.PI * 2) +
        tNoise * Math.PI * 0.5;

      const x3d = Math.cos(freqA * angle + phaseOffset) * radiusBase;
      const y3d = Math.sin(freqB * angle + phaseOffset) * radiusBase;
      const z3d = (t * 2 - 1) * radiusBase * zScale;

      // ノイズを大幅に増加（40 → 80）
      const noiseScale = 20;
      const noiseFactor = (pseudoNoise(x3d / noiseScale, y3d / noiseScale, z3d / noiseScale) - 0.5) * 2;
      const noiseX = noiseFactor * 80;
      const noiseY =
        (pseudoNoise(y3d / noiseScale, z3d / noiseScale, x3d / noiseScale) - 0.5) * 2 * 80;

      // 非線形な変形を追加
      const distortionX = Math.sin(t * Math.PI * 3 + offset1 / 100000) * 30;
      const distortionY = Math.cos(t * Math.PI * 2.5 + offset2 / 100000) * 30;

      // 楕円形の制約（横長）
      const ellipseX = x3d * 1.4; // X軸を1.4倍（横長に）
      const ellipseY = y3d * 0.8; // Y軸を0.8倍（縦を短く）
      const distFromCenter = Math.sqrt(ellipseX * ellipseX + ellipseY * ellipseY);
      const maxRadius = 420; // サイズを大きく
      const constraintFactor = distFromCenter > maxRadius ? maxRadius / distFromCenter : 1;

      const x = ellipseX * constraintFactor + noiseX + distortionX;
      const y = ellipseY * constraintFactor + noiseY + distortionY;

      points.push({
        x: centerX + x,
        y: centerY + y,
      });
    }

    // アニメーションパラメータ
    const offset4 = (offset0 * 7919) % 100000;
    const offset5 = (offset4 * 7919) % 100000;
    const offset6 = (offset5 * 7919) % 100000;
    const offset7 = (offset6 * 7919) % 100000;
    const offset8 = (offset7 * 7919) % 100000;
    const offset9 = (offset8 * 7919) % 100000;

    const opacityBase = (offset4 / 100000) * 0.35 + 0.35;
    const animationSpeed = (offset5 / 100000) * 2 + 0.3;
    const phaseX = (offset6 / 100000) * Math.PI * 2;
    const phaseY = (offset7 / 100000) * Math.PI * 2;
    const amplitudeX = (offset8 / 100000) * 35 + 8;
    const amplitudeY = (offset9 / 100000) * 35 + 8;

    const offset10 = (offset9 * 7919) % 100000;
    const offset11 = (offset10 * 7919) % 100000;

    const rotationSpeed = ((offset10 / 100000) - 0.5) * 2;
    const rotationPhase = (offset11 / 100000) * Math.PI * 2;

    curves.push({
      id: s,
      points,
      opacity: opacityBase,
      animationSpeed,
      phaseX,
      phaseY,
      amplitudeX,
      amplitudeY,
      rotationSpeed,
      rotationPhase,
    });
  }

  return curves;
}

function generateBezierPathData(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return "";

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const nextPoint = i + 1 < points.length ? points[i + 1] : currentPoint;

    const cpx = (currentPoint.x + nextPoint.x) / 2;
    const cpy = (currentPoint.y + nextPoint.y) / 2;

    path += ` Q ${currentPoint.x.toFixed(1)} ${currentPoint.y.toFixed(1)} ${cpx.toFixed(1)} ${cpy.toFixed(1)}`;
  }

  if (points.length >= 2) {
    const lastPoint = points[points.length - 1];
    path += ` L ${lastPoint.x.toFixed(1)} ${lastPoint.y.toFixed(1)}`;
  }

  return path;
}

export function AngstAnimationTemplate(
  props: AngstAnimationProps
): React.ReactElement {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const time = frame / fps;

  const curves = useMemo(() => generateSpiralsWithNoise(12345), []);

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

        {curves.map((curve) => {
          const offsetX = Math.sin(time * curve.animationSpeed + curve.phaseX) * curve.amplitudeX;
          const offsetY = Math.cos(time * curve.animationSpeed + curve.phaseY) * curve.amplitudeY;

          const animatedPoints = curve.points.map((point) => {
            return {
              x: point.x + offsetX,
              y: point.y + offsetY,
            };
          });

          const pulseFactor =
            Math.sin(time * curve.animationSpeed * 0.5 + curve.phaseX) * 0.3 + 0.7;
          const animatedOpacity = curve.opacity * pulseFactor;

          return (
            <path
              key={curve.id}
              d={generateBezierPathData(animatedPoints)}
              stroke="#EEF1FC"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={animatedOpacity}
              filter="url(#glow)"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}
