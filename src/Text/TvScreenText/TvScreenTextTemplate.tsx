import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { mulberry32, StaticNoise } from "../../helpers/static-noise";
import type { TvScreenTextSchemaType } from "./tv-screen-text.schema";

type Look = {
  /** RGB fringe offset (px) */
  fringe: number;
  /** Phosphor glow radius (px) */
  glow: number;
  /** Softening blur (px) */
  blur: number;
  /** Edge darkening, 0-1 */
  vignette: number;
  /** Diagonal glass reflection */
  sheen: boolean;
  power: "line" | "fade" | "backlight";
  breakup: "tear" | "tracking" | "blocks";
  end: "snow" | "blocks";
  /** Snow color, 0-1 RGB */
  tint: readonly [number, number, number];
};

const LOOKS: Record<TvScreenTextSchemaType["style"], Look> = {
  crt: { fringe: 2.5, glow: 22, blur: 0, vignette: 0.6, sheen: true, power: "line", breakup: "tear", end: "snow", tint: [1, 1, 1] },
  vhs: { fringe: 7, glow: 6, blur: 0.9, vignette: 0.4, sheen: false, power: "fade", breakup: "tracking", end: "snow", tint: [1, 1, 1] },
  digital: { fringe: 0, glow: 0, blur: 0, vignette: 0, sheen: false, power: "backlight", breakup: "blocks", end: "blocks", tint: [1, 1, 1] },
  mono: { fringe: 0, glow: 30, blur: 0, vignette: 0.65, sheen: true, power: "line", breakup: "tear", end: "snow", tint: [0.36, 1, 0.54] },
};

const TEAR_SLICES = 9;
const VHS_STRIPS = 8;
const BLOCK_COLS = 16;
const BLOCK_ROWS = 9;
const BLOCK_NOISE_FRAMES = 14;
const CORRUPT_COLORS = ["#1f8a3a", "#b43ca8", "#7f8a96", "#2b3fbf"];

/** Chunky colored block noise, the digital equivalent of snow. */
const BlockNoise: React.FC<{ seed: number; frame: number }> = ({ seed, frame }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    const rand = mulberry32(seed * 3571 + frame * 6151);
    const img = ctx.createImageData(48, 27);
    for (let i = 0; i < 48 * 27; i++) {
      const v = rand();
      const hue = rand();
      img.data[i * 4] = v * (hue < 0.33 ? 255 : 90);
      img.data[i * 4 + 1] = v * (hue >= 0.33 && hue < 0.66 ? 255 : 90);
      img.data[i * 4 + 2] = v * (hue >= 0.66 ? 255 : 90);
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }, [seed, frame]);
  return (
    <canvas
      ref={ref}
      width={48}
      height={27}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", imageRendering: "pixelated" }}
    />
  );
};

/** The broadcast picture: title and sub line, dressed for the display type. */
const Picture: React.FC<{ p: TvScreenTextSchemaType; look: Look; flicker: number }> = ({ p, look, flicker }) => {
  const fringe = look.fringe
    ? `-${look.fringe}px 0 rgba(255,60,80,0.55), ${look.fringe}px 0 rgba(60,200,255,0.55), `
    : "";
  const glow = look.glow ? `0 0 ${look.glow}px ${p.textColor}` : "0 0 0 transparent";
  return (
    <AbsoluteFill
      style={{
        background:
          look.end === "blocks"
            ? p.screenColor
            : `radial-gradient(ellipse at 50% 45%, ${p.screenColor} 0%, #000 125%)`,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: p.fontSize * 0.25,
        opacity: flicker,
        filter: look.blur ? `blur(${look.blur}px)` : undefined,
      }}
    >
      <div
        style={{
          fontFamily: p.fontFamily,
          fontSize: p.fontSize,
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: p.textColor,
          textShadow: `${fringe}${glow}`,
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
            textShadow: look.glow ? `0 0 ${look.glow * 0.5}px ${p.textColor}` : undefined,
          }}
        >
          {p.subText}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Full-frame TV picture: powers on, shows the title, breaks up, ends on dead air. */
export const TvScreenTextTemplate: React.FC<TvScreenTextSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { powerOnFrame, glitchStartFrame, staticStartFrame, randomSeed } = props;
  const look = LOOKS[props.style];
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  const isOn = frame >= powerOnFrame;
  const isGlitching = frame >= glitchStartFrame && frame < staticStartFrame;
  const isDead = frame >= staticStartFrame;
  const glitch = interpolate(frame, [glitchStartFrame, staticStartFrame], [0, 1], clamp);

  // Power on: a line opening (tube), a fade through noise (tape), or a
  // backlight bloom before the picture (LCD).
  const powerOpen = interpolate(frame, [powerOnFrame, powerOnFrame + 8], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const powerFlash = interpolate(frame, [powerOnFrame, powerOnFrame + 4, powerOnFrame + 16], [0, 1, 0], clamp);
  const fadeIn = interpolate(frame, [powerOnFrame, powerOnFrame + 20], [0, 1], clamp);
  const backlight = interpolate(frame, [powerOnFrame, powerOnFrame + 6, powerOnFrame + 14], [0, 0.22, 0.06], clamp);
  const pictureIn = interpolate(frame, [powerOnFrame + 8, powerOnFrame + 16], [0, 1], clamp);
  const pictureScaleY = look.power === "line" ? Math.max(0.004, powerOpen) : 1;
  const pictureOpacity = look.power === "fade" ? fadeIn : look.power === "backlight" ? pictureIn : 1;
  const bootSnow = look.power === "fade" ? interpolate(frame, [powerOnFrame, powerOnFrame + 22], [0.9, 0], clamp) : 0;

  const flickerAmount = look.end === "blocks" ? 0 : 0.07;
  const flicker =
    1 -
    flickerAmount * random(`${randomSeed}-flicker-${frame}`) -
    (isGlitching && look.breakup === "tear" ? glitch * 0.3 * random(`${randomSeed}-dim-${frame}`) : 0);
  const cutFlash =
    look.end === "snow"
      ? interpolate(frame, [staticStartFrame, staticStartFrame + 3, staticStartFrame + 8], [0, 0.9, 0], clamp)
      : 0;

  const picture = <Picture p={props} look={look} flicker={flicker} />;
  let content: React.ReactNode = picture;

  if (look.breakup === "tear" && isGlitching) {
    // Slices tear sideways harder toward the cut, while the picture rolls.
    const roll = glitch * glitch * height * 0.4 * random(`${randomSeed}-roll-${frame}`);
    const sliceH = 100 / TEAR_SLICES;
    content = Array.from({ length: TEAR_SLICES }, (_, i) => {
      const r = random(`${randomSeed}-slice-${i}-${Math.floor(frame / 2)}`);
      const shift = (r - 0.5) * 2 * glitch * 180 * (r > 0.45 ? 1 : 0.2);
      return (
        <AbsoluteFill
          key={i}
          style={{
            clipPath: `inset(${i * sliceH}% 0 ${100 - (i + 1) * sliceH}% 0)`,
            transform: `translate(${shift}px, ${-roll}px)`,
          }}
        >
          {picture}
        </AbsoluteFill>
      );
    });
  } else if (look.breakup === "tracking") {
    // Tape wobble: horizontal strips drift a little, much more as tracking fails.
    const stripH = 100 / VHS_STRIPS;
    const wobble = 2 + glitch * glitch * 60;
    content = Array.from({ length: VHS_STRIPS }, (_, i) => {
      const shift =
        Math.sin(frame * 0.35 + i * 1.3) * wobble * 0.5 +
        (random(`${randomSeed}-strip-${i}-${Math.floor(frame / 2)}`) - 0.5) * wobble;
      return (
        <AbsoluteFill
          key={i}
          style={{
            clipPath: `inset(${i * stripH}% 0 ${100 - (i + 1) * stripH}% 0)`,
            transform: `translateX(${shift}px)`,
          }}
        >
          {picture}
        </AbsoluteFill>
      );
    });
  } else if (look.breakup === "blocks" && isGlitching) {
    // Macroblocks: some blocks show a displaced copy of the picture, some go flat.
    const bw = width / BLOCK_COLS;
    const bh = height / BLOCK_ROWS;
    const tick = Math.floor(frame / 3);
    const blocks: React.ReactNode[] = [];
    for (let row = 0; row < BLOCK_ROWS; row++) {
      for (let col = 0; col < BLOCK_COLS; col++) {
        const key = `${row}-${col}`;
        const r = random(`${randomSeed}-block-${key}-${tick}`);
        if (r > glitch * 0.5) {
          continue;
        }
        const kind = random(`${randomSeed}-kind-${key}-${tick}`);
        const clip = `inset(${row * bh}px ${width - (col + 1) * bw}px ${height - (row + 1) * bh}px ${col * bw}px)`;
        if (kind < 0.6) {
          const dx = Math.round((random(`${randomSeed}-dx-${key}-${tick}`) - 0.5) * 4) * bw;
          const dy = Math.round((random(`${randomSeed}-dy-${key}-${tick}`) - 0.5) * 2) * bh;
          blocks.push(
            <AbsoluteFill key={key} style={{ clipPath: clip }}>
              <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px)` }}>{picture}</AbsoluteFill>
            </AbsoluteFill>,
          );
        } else {
          const color = CORRUPT_COLORS[Math.floor(kind * 97) % CORRUPT_COLORS.length];
          blocks.push(<AbsoluteFill key={key} style={{ clipPath: clip, background: color, opacity: 0.85 }} />);
        }
      }
    }
    content = (
      <>
        {picture}
        {blocks}
      </>
    );
  }

  // Tape tracking band: drifts down the frame, widening as the signal fails.
  const bandH = 40 + glitch * height * 0.6;
  const bandY = ((frame * 6) % (height + bandH)) - bandH;
  const showBand = look.breakup === "tracking" && isOn && !isDead;

  const showBlockNoise = look.end === "blocks" && isDead && frame < staticStartFrame + BLOCK_NOISE_FRAMES;
  const showNoSignal = look.end === "blocks" && frame >= staticStartFrame + BLOCK_NOISE_FRAMES;

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        overflow: "hidden",
        filter: props.style === "vhs" ? "saturate(0.85) contrast(1.05) sepia(0.12)" : undefined,
      }}
    >
      {look.power === "backlight" && isOn ? (
        <AbsoluteFill style={{ background: `rgba(120,130,150,${backlight})` }} />
      ) : null}
      {isOn && !isDead ? (
        <AbsoluteFill style={{ transform: `scaleY(${pictureScaleY})`, opacity: pictureOpacity }}>{content}</AbsoluteFill>
      ) : null}
      {bootSnow > 0 ? (
        <AbsoluteFill style={{ opacity: bootSnow }}>
          <StaticNoise seed={randomSeed + 1} frame={frame} tint={look.tint} />
        </AbsoluteFill>
      ) : null}
      {showBand ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: bandY,
            height: bandH,
            opacity: 0.35 + glitch * 0.5,
            mixBlendMode: "screen",
          }}
        >
          <StaticNoise seed={randomSeed + 2} frame={frame} tint={look.tint} />
        </div>
      ) : null}
      {isDead && look.end === "snow" ? <StaticNoise seed={randomSeed} frame={frame} tint={look.tint} /> : null}
      {showBlockNoise ? <BlockNoise seed={randomSeed} frame={frame} /> : null}
      {showNoSignal ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: JETBRAINS_MONO_FONT_FAMILY,
              fontSize: 44,
              letterSpacing: "0.3em",
              color: props.textColor,
              opacity: 0.85,
              padding: "18px 36px",
              border: `2px solid ${props.textColor}`,
            }}
          >
            NO SIGNAL
          </div>
        </AbsoluteFill>
      ) : null}
      {props.osdText && props.style === "vhs" && isOn && !isDead ? (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 70,
            fontFamily: JETBRAINS_MONO_FONT_FAMILY,
            fontSize: 56,
            fontWeight: 700,
            color: "#f2f2f2",
            textShadow: "3px 3px 0 rgba(0,0,0,0.55)",
            opacity: fadeIn,
          }}
        >
          {props.osdText}
        </div>
      ) : null}
      {/* Power-on line (tube looks) and the flash at the cut to snow */}
      {look.power === "line" ? (
        <AbsoluteFill
          style={{
            background: "#f4f8ff",
            opacity: Math.max(powerFlash * (1 - powerOpen * 0.7), cutFlash),
            transform: `scaleY(${isDead ? 1 : Math.max(0.004, powerOpen)})`,
          }}
        />
      ) : cutFlash > 0 ? (
        <AbsoluteFill style={{ background: "#f4f8ff", opacity: cutFlash }} />
      ) : null}
      {props.scanlines > 0 ? (
        <AbsoluteFill
          style={{
            background: `repeating-linear-gradient(180deg, rgba(0,0,0,${props.scanlines}) 0 2px, transparent 2px 4px)`,
          }}
        />
      ) : null}
      {props.style === "digital" ? (
        <AbsoluteFill
          style={{
            background: [
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 6px)",
              "repeating-linear-gradient(90deg, rgba(255,0,0,0.05) 0 2px, rgba(0,255,0,0.05) 2px 4px, rgba(0,0,255,0.05) 4px 6px)",
            ].join(", "),
          }}
        />
      ) : null}
      {look.sheen ? (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 28%, transparent 40%)",
          }}
        />
      ) : null}
      {look.vignette > 0 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,${look.vignette}) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
