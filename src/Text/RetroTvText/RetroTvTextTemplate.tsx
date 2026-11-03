import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import type { RetroTvTextSchemaType } from "./retro-tv-text.schema";

const CABINET_W = 1240;
const CABINET_H = 634;
const FRAME = 34;
const PAD = 40;
const SCREEN_W = 864;
const SCREEN_H = 486;
const LEG_H = 150;

const NOISE_W = 320;
const NOISE_H = 180;
const GLITCH_SLICES = 9;

/** Small fast PRNG so a full static frame stays cheap; seeded per frame. */
const mulberry32 = (a: number) => () => {
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Low-res black-and-white snow with per-row brightness bands, redrawn every frame. */
const StaticNoise: React.FC<{ seed: number; frame: number }> = ({ seed, frame }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    const rand = mulberry32(seed * 7919 + frame * 104729);
    const img = ctx.createImageData(NOISE_W, NOISE_H);
    const bandY = rand() * NOISE_H;
    for (let y = 0; y < NOISE_H; y++) {
      const band = Math.abs(y - bandY) < 14 ? 1.25 : 1;
      const row = (0.7 + rand() * 0.3) * band;
      for (let x = 0; x < NOISE_W; x++) {
        const v = Math.min(255, rand() * 255 * row);
        const i = (y * NOISE_W + x) * 4;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }, [seed, frame]);
  return (
    <canvas
      ref={ref}
      width={NOISE_W}
      height={NOISE_H}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
};

/** The broadcast picture: title and sub line with phosphor glow and RGB fringe. */
const Picture: React.FC<RetroTvTextSchemaType & { flicker: number }> = (p) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, ${p.screenColor} 0%, #000 120%)`,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: p.fontSize * 0.25,
      opacity: p.flicker,
    }}
  >
    <div
      style={{
        fontFamily: p.fontFamily,
        fontSize: p.fontSize,
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: p.textColor,
        textShadow: `-2px 0 rgba(255,60,80,0.55), 2px 0 rgba(60,220,255,0.55), 0 0 18px ${p.textColor}`,
      }}
    >
      {p.text}
    </div>
    {p.subText ? (
      <div
        style={{
          fontFamily: p.fontFamily,
          fontSize: p.fontSize * 0.34,
          letterSpacing: "0.3em",
          color: p.textColor,
          opacity: 0.8,
          textShadow: `0 0 10px ${p.textColor}`,
        }}
      >
        {p.subText}
      </div>
    ) : null}
  </AbsoluteFill>
);

const Dial: React.FC<{ size: number; rotation: number }> = ({ size, rotation }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #4a4642 0%, #1c1a18 70%)",
      boxShadow: "0 6px 10px rgba(0,0,0,0.45), inset 0 2px 2px rgba(255,255,255,0.12)",
      position: "relative",
      transform: `rotate(${rotation}deg)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: size / 2 - 3,
        top: size * 0.1,
        width: 6,
        height: size * 0.3,
        borderRadius: 3,
        background: "#e7a73c",
      }}
    />
  </div>
);

/** Wooden TV that powers on, shows the title, breaks up, and ends on static. */
export const RetroTvTextTemplate: React.FC<RetroTvTextSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { powerOnFrame, glitchStartFrame, staticStartFrame, randomSeed } = props;
  const backdrop = resolveCompositionBackdropColor(props.backgroundColor);

  const scale = 1 + interpolate(frame, [0, durationInFrames], [0, props.pushIn]);

  // Power on: a bright line opens vertically into the picture.
  const powerOpen = interpolate(frame, [powerOnFrame, powerOnFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const powerFlash = interpolate(frame, [powerOnFrame, powerOnFrame + 4, powerOnFrame + 16], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isOn = frame >= powerOnFrame;

  // Signal loss: slices tear sideways harder toward the static cut.
  const glitch = interpolate(frame, [glitchStartFrame, staticStartFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isGlitching = frame >= glitchStartFrame && frame < staticStartFrame;
  const isStatic = frame >= staticStartFrame;
  const roll = isGlitching ? glitch * glitch * SCREEN_H * 0.4 * random(`${randomSeed}-roll-${frame}`) : 0;
  const flicker = 0.93 + random(`${randomSeed}-flicker-${frame}`) * 0.07 - (isGlitching ? glitch * 0.3 * random(`${randomSeed}-dim-${frame}`) : 0);
  const cutFlash = interpolate(frame, [staticStartFrame, staticStartFrame + 3, staticStartFrame + 8], [0, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // The channel dial gets turned during the break-up.
  const dialRotation = interpolate(frame, [glitchStartFrame - 6, staticStartFrame], [0, 62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const sliceH = 100 / GLITCH_SLICES;
  const picture = isGlitching ? (
    Array.from({ length: GLITCH_SLICES }, (_, i) => {
      const r = random(`${randomSeed}-slice-${i}-${Math.floor(frame / 2)}`);
      const shift = (r - 0.5) * 2 * glitch * 90 * (r > 0.45 ? 1 : 0.2);
      return (
        <AbsoluteFill
          key={i}
          style={{
            clipPath: `inset(${i * sliceH}% 0 ${100 - (i + 1) * sliceH}% 0)`,
            transform: `translate(${shift}px, ${-roll}px)`,
          }}
        >
          <Picture {...props} flicker={flicker} />
        </AbsoluteFill>
      );
    })
  ) : (
    <Picture {...props} flicker={flicker} />
  );

  const woodGrain = [
    "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.28) 100%)",
    "repeating-linear-gradient(178deg, rgba(0,0,0,0.13) 0 2px, transparent 2px 9px, rgba(255,230,200,0.05) 9px 11px, transparent 11px 23px)",
    "repeating-linear-gradient(181deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 37px)",
  ].join(", ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backdrop,
        backgroundImage:
          backdrop === "transparent"
            ? undefined
            : "radial-gradient(ellipse at 50% 40%, rgba(255,220,170,0.10) 0%, rgba(0,0,0,0.55) 85%)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", width: CABINET_W, height: CABINET_H + LEG_H, transform: `scale(${scale})` }}>
        {/* Floor shadow */}
        <div
          style={{
            position: "absolute",
            left: CABINET_W * 0.08,
            width: CABINET_W * 0.84,
            top: CABINET_H + LEG_H - 26,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        {/* Legs */}
        {[0.14, 0.86].map((x, i) => (
          <div
            key={x}
            style={{
              position: "absolute",
              left: CABINET_W * x - 14,
              top: CABINET_H - 10,
              width: 28,
              height: LEG_H,
              borderRadius: "4px 4px 10px 10px",
              background: "linear-gradient(90deg, #2a1a10, #4d3220 45%, #20140c)",
              transform: `rotate(${i === 0 ? 6 : -6}deg)`,
              transformOrigin: "50% 0%",
            }}
          />
        ))}
        {/* Cabinet */}
        <div
          style={{
            position: "absolute",
            inset: `0 0 ${LEG_H}px 0`,
            borderRadius: 14,
            backgroundColor: props.cabinetColor,
            backgroundImage: woodGrain,
            boxShadow: "0 24px 50px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.12), inset 0 -3px 0 rgba(0,0,0,0.3)",
          }}
        >
          {/* Front plate */}
          <div
            style={{
              position: "absolute",
              inset: FRAME,
              borderRadius: 6,
              backgroundColor: props.panelColor,
              backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(0,0,0,0.12))",
              boxShadow: "inset 0 3px 6px rgba(0,0,0,0.35)",
            }}
          >
            {/* Screen bezel */}
            <div
              style={{
                position: "absolute",
                left: PAD - 14,
                top: PAD - 14,
                width: SCREEN_W + 28,
                height: SCREEN_H + 28,
                borderRadius: 6,
                background: "#141414",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.4)",
              }}
            />
            {/* Screen */}
            <div
              style={{
                position: "absolute",
                left: PAD,
                top: PAD,
                width: SCREEN_W,
                height: SCREEN_H,
                overflow: "hidden",
                background: "#050606",
              }}
            >
              {isOn && !isStatic ? (
                <AbsoluteFill style={{ transform: `scaleY(${Math.max(0.004, powerOpen)})` }}>{picture}</AbsoluteFill>
              ) : null}
              {isStatic ? <StaticNoise seed={randomSeed} frame={frame} /> : null}
              {/* Power-on line and cut flash */}
              <AbsoluteFill
                style={{
                  background: "#f4f8ff",
                  opacity: Math.max(powerFlash * (1 - powerOpen * 0.7), cutFlash),
                  transform: `scaleY(${isStatic ? 1 : Math.max(0.004, powerOpen)})`,
                }}
              />
              {/* Scanlines */}
              <AbsoluteFill
                style={{
                  background: `repeating-linear-gradient(180deg, rgba(0,0,0,${props.scanlines}) 0 2px, transparent 2px 4px)`,
                }}
              />
              {/* Glass: edge falloff and a soft reflection */}
              <AbsoluteFill
                style={{
                  background: [
                    "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 28%, transparent 40%)",
                    "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)",
                  ].join(", "),
                }}
              />
            </div>
            {/* Control column: dials, power lamp, speaker grille */}
            <div
              style={{
                position: "absolute",
                left: PAD + SCREEN_W + PAD,
                right: PAD,
                top: PAD,
                height: SCREEN_H,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 26,
              }}
            >
              <Dial size={92} rotation={dialRotation} />
              <Dial size={64} rotation={-30} />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: isOn ? "#ff5a3c" : "#5a2a22",
                  boxShadow: isOn ? "0 0 10px #ff5a3c" : "none",
                }}
              />
              <div
                style={{
                  flex: 1,
                  width: "100%",
                  borderRadius: 4,
                  backgroundColor: "rgba(0,0,0,0.06)",
                  backgroundImage: "radial-gradient(circle, rgba(20,18,16,0.85) 2.6px, transparent 3.2px)",
                  backgroundSize: "12px 12px",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.25)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
