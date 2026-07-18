import React from "react";

/**
 * OneTakeアプリの実際のデザイントークン（OneTakeリポジトリの
 * `app/src/theme/tokens.ts`）をミラーした値。別リポジトリのためimportはできず、
 * 値を直接複製している。トークン側を変更したときはここも追従させる。
 */
export const APP_SURFACE = "#10131F";
export const APP_SURFACE_ELEVATED = "#171B2D";
export const APP_BORDER = "#242A42";

export const PHONE_WIDTH = 320;
export const PHONE_HEIGHT = 640;
export const LAPTOP_SCREEN_WIDTH = 640;
export const LAPTOP_SCREEN_HEIGHT = 400;
const NEON_BORDER_WIDTH = 8;

/**
 * `NeonTextTemplate`の`buildNeonTextShadow`と同じ「コア＋複数ハロー」の考え方を
 * 枠線（box-shadow）向けに移植したもの。単一のdrop-shadowより発光が厚くなる。
 */
export function neonBoxShadow(color: string, strength = 1): string {
  const s = strength;
  return [
    `0 0 ${4 * s}px ${color}`,
    `0 0 ${12 * s}px ${color}`,
    `inset 0 0 ${10 * s}px ${color}55`,
    `0 0 ${28 * s}px ${color}cc`,
    `0 0 ${56 * s}px ${color}90`,
    `0 0 ${92 * s}px ${color}50`,
  ].join(", ");
}

export function PhoneFrame({
  color,
  glowStrength = 1,
  children,
}: {
  color: string;
  glowStrength?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: PHONE_WIDTH,
        height: PHONE_HEIGHT,
        borderRadius: 40,
        border: `${NEON_BORDER_WIDTH}px solid ${color}`,
        background: APP_SURFACE,
        boxShadow: neonBoxShadow(color, glowStrength),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 32,
          transform: "translateX(-50%)",
          width: 64,
          height: 8,
          borderRadius: 4,
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {children}
    </div>
  );
}

export function LaptopFrame({
  color,
  glowStrength = 1,
  children,
}: {
  color: string;
  glowStrength?: number;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          position: "relative",
          width: LAPTOP_SCREEN_WIDTH,
          height: LAPTOP_SCREEN_HEIGHT,
          borderRadius: "22px 22px 6px 6px",
          border: `${NEON_BORDER_WIDTH}px solid ${color}`,
          background: APP_SURFACE_ELEVATED,
          boxShadow: neonBoxShadow(color, glowStrength),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* ウィンドウ然としたUIに見せるための最小限のシャドウバー装飾 */}
        <div style={{ position: "absolute", left: 26, top: 22, display: "flex", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 13,
                height: 13,
                borderRadius: 7,
                background: APP_BORDER,
              }}
            />
          ))}
        </div>
        {children}
      </div>
      <div
        style={{
          width: LAPTOP_SCREEN_WIDTH + 60,
          height: 20,
          marginLeft: -30,
          marginTop: 6,
          borderRadius: 10,
          border: `${Math.round(NEON_BORDER_WIDTH * 0.7)}px solid ${color}`,
          background: APP_SURFACE,
          boxShadow: neonBoxShadow(color, glowStrength * 0.6),
        }}
      />
    </div>
  );
}
