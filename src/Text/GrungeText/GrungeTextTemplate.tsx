import React, { useId, useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { JETBRAINS_MONO_FONT_FAMILY } from "../../helpers/font-jetbrains-mono";
import { LINE_SEED_JP_FONT_FAMILY } from "../../helpers/font-line-seed-jp";
import { SPACE_GROTESK_FONT_FAMILY } from "../../helpers/font-space-grotesk";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import type { GrungeTextSchemaType } from "./grunge-text.schema";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type StyleProps = GrungeTextSchemaType & { f: number; filterId: string };

/**
 * Rough edges (displacement) + worn ink (thresholded turbulence as an alpha
 * mask). `threshold` near 1 keeps all ink; lower values open more holes.
 */
const RoughFilter: React.FC<{
  id: string;
  roughness: number;
  wear: number;
  seed: number;
}> = ({ id, roughness, wear, seed }) => {
  const threshold = 0.82 - 0.36 * wear;
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={0.045} numOctaves={2} seed={seed} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={roughness} xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency={0.11} numOctaves={4} seed={seed + 7} result="wear" />
          <feColorMatrix in="wear" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -14 0 0 0 ${14 * threshold}`} result="wearMask" />
          <feComposite in="rough" in2="wearMask" operator="in" />
        </filter>
      </defs>
    </svg>
  );
};

const chars = (text: string) => Array.from(text);

/** Sprayed stencil: letters with bridges fade in sharp from a blurry mist. */
const Stencil: React.FC<StyleProps> = (p) => {
  const list = chars(p.text);
  const bridge = "linear-gradient(to bottom, #000 0 46%, transparent 46% 54%, #000 54%)";
  return (
    <div style={{ display: "flex", fontFamily: p.fontFamily, fontWeight: 700, fontSize: p.fontSize, letterSpacing: "0.04em" }}>
      {list.map((c, i) => {
        const t = interpolate(p.f, [i * 3, i * 3 + 14], [0, 1], clamp);
        return (
          <span key={i} style={{ position: "relative", whiteSpace: "pre" }}>
            {/* Overspray halo */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                color: p.accentColor,
                filter: `blur(${10 - 4 * t}px)`,
                opacity: 0.32 * t,
                transform: "scale(1.06)",
              }}
            >
              {c}
            </span>
            <span
              style={{
                position: "relative",
                color: p.inkColor,
                filter: `url(#${p.filterId}) blur(${(1 - t) * 8}px)`,
                opacity: t,
                WebkitMaskImage: bridge,
                maskImage: bridge,
              }}
            >
              {c}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const RANSOM_FONTS = [
  SPACE_GROTESK_FONT_FAMILY,
  LINE_SEED_JP_FONT_FAMILY,
  JETBRAINS_MONO_FONT_FAMILY,
  "Georgia, 'Times New Roman', serif",
  "'Courier New', monospace",
];

/** Cut-out letters pasted one by one, each on its own scrap. */
const Ransom: React.FC<StyleProps> = (p) => {
  const items = useMemo(() => {
    const patches = ["#f4efe3", "#ffffff", p.accentColor, "#2a2826", "#d9d4c7", "#e8dfcd"];
    return chars(p.text).map((c, i) => {
        const r = (k: string) => random(`${p.randomSeed}-${k}-${i}`);
        const patch = patches[Math.floor(r("bg") * patches.length)];
        const pts = Array.from({ length: 8 }, (_, k) => {
          const a = (k / 8) * Math.PI * 2 + Math.PI / 8;
          const jx = 50 + Math.cos(a) * (60 + r(`px${k}`) * 10);
          const jy = 50 + Math.sin(a) * (60 + r(`py${k}`) * 10);
          return `${Math.max(0, Math.min(100, jx))}% ${Math.max(0, Math.min(100, jy))}%`;
        });
        return {
          c: r("case") < 0.5 ? c.toUpperCase() : c.toLowerCase(),
          font: RANSOM_FONTS[Math.floor(r("font") * RANSOM_FONTS.length)],
          patch,
          color: patch === "#2a2826" ? "#f4efe3" : p.inkColor,
          rot: (r("rot") - 0.5) * 20,
          scale: 0.82 + r("scale") * 0.4,
          dy: (r("dy") - 0.5) * p.fontSize * 0.25,
          clip: `polygon(${pts.join(", ")})`,
        };
      });
  }, [p.text, p.randomSeed, p.accentColor, p.inkColor, p.fontSize]);
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "center", maxWidth: 1700 }}>
      {items.map((it, i) => {
        if (it.c === " ") return <span key={i} style={{ width: p.fontSize * 0.4 }} />;
        const t = interpolate(p.f, [i * 4, i * 4 + 6], [0, 1], clamp);
        const s = interpolate(t, [0, 1], [1.5, 1], { easing: Easing.out(Easing.back(2)) });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: `0 ${p.fontSize * 0.04}px`,
              transform: `translateY(${it.dy}px) rotate(${it.rot}deg) scale(${it.scale * s})`,
              opacity: t,
              filter: "drop-shadow(4px 6px 3px rgba(0,0,0,0.45))",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: `${p.fontSize * 0.08}px ${p.fontSize * 0.14}px`,
                background: it.patch,
                color: it.color,
                fontFamily: it.font,
                fontWeight: 700,
                fontSize: p.fontSize,
                lineHeight: 1,
                clipPath: it.clip,
              }}
            >
              {it.c}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** Hard-struck keys: uneven ink, baseline jitter, a jolt per strike, block caret. */
const Typewriter: React.FC<StyleProps> = (p) => {
  const lines = [p.text, p.subText].filter((l) => l.length > 0);
  const perChar = 3;
  let index = 0;
  const total = lines.reduce((n, l) => n + l.length, 0);
  const typed = Math.floor(p.f / perChar);
  const sinceStrike = p.f - typed * perChar;
  const jolt = typed < total && p.f >= 0 ? Math.max(0, 2 - sinceStrike) : 0;
  return (
    <div style={{ fontFamily: p.fontFamily, fontSize: p.fontSize, color: p.inkColor, lineHeight: 1.5, transform: `translateX(${jolt}px)` }}>
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "pre", display: "flex" }}>
          {chars(line).map((c, ci) => {
            const k = index++;
            const shown = k < typed;
            const r = (s: string) => random(`${p.randomSeed}-${s}-${k}`);
            return (
              <span
                key={ci}
                style={{
                  display: "inline-block",
                  width: "0.6em",
                  opacity: shown ? 0.62 + r("ink") * 0.38 : 0,
                  transform: `translateY(${(r("y") - 0.5) * 3}px) rotate(${(r("r") - 0.5) * 3}deg)`,
                  filter: `url(#${p.filterId})`,
                }}
              >
                {c}
              </span>
            );
          })}
          {li === lines.length - 1 ? (
            <span
              style={{
                display: "inline-block",
                width: "0.55em",
                height: "1em",
                marginTop: "0.25em",
                background: p.inkColor,
                opacity: Math.floor(p.f / 15) % 2 === 0 ? 0.85 : 0,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

/** Masking tape slaps down, then marker writing appears left to right. */
const Tape: React.FC<StyleProps> = (p) => {
  const slap = interpolate(p.f, [0, 7], [0, 1], clamp);
  const s = interpolate(slap, [0, 1], [1.2, 1], { easing: Easing.out(Easing.cubic) });
  const write = interpolate(p.f, [12, 12 + p.text.length * 2.5], [0, 105], clamp);
  const wipe = `linear-gradient(to right, #000 ${write - 5}%, transparent ${write}%)`;
  const torn = "polygon(0% 8%, 2% 0%, 98% 4%, 100% 12%, 98.5% 30%, 100% 50%, 98% 70%, 100% 92%, 97% 100%, 3% 96%, 0% 88%, 1.5% 66%, 0% 45%, 1.8% 25%)";
  return (
    <div style={{ transform: `rotate(-3deg) scale(${s})`, opacity: slap }}>
      <div
        style={{
          padding: `${p.fontSize * 0.28}px ${p.fontSize * 0.6}px`,
          background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0 2px, transparent 2px 7px), ${p.accentColor}`,
          clipPath: torn,
          opacity: 0.94,
          filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.35))",
        }}
      >
        <div
          style={{
            fontFamily: p.fontFamily,
            fontWeight: 700,
            fontSize: p.fontSize,
            color: p.inkColor,
            whiteSpace: "pre",
            transform: "skewX(-6deg)",
            filter: `url(#${p.filterId})`,
            WebkitMaskImage: wipe,
            maskImage: wipe,
          }}
        >
          {p.text}
        </div>
      </div>
    </div>
  );
};

/** Burnt in: the char spreads in patches with an ember glow, sparks rise. */
const Burn: React.FC<StyleProps> = (p) => {
  const burnId = `${p.filterId}burn`;
  const spread = interpolate(p.f, [0, 36], [0.05, 1.05], clamp);
  const glow = interpolate(p.f, [0, 30, 90], [1, 0.9, 0.25], clamp);
  const seed = Math.floor(random(`${p.randomSeed}-burn`) * 1000);
  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: random(`${p.randomSeed}-sx-${i}`) * 100,
        start: random(`${p.randomSeed}-st-${i}`) * 50,
        speed: 1.5 + random(`${p.randomSeed}-sp-${i}`) * 2.5,
        size: 2 + random(`${p.randomSeed}-sz-${i}`) * 4,
      })),
    [p.randomSeed],
  );
  return (
    <div style={{ position: "relative" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={burnId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency={0.03} numOctaves={3} seed={seed} result="n" />
            <feColorMatrix in="n" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  14 0 0 0 ${14 * (spread - 0.5) - 0.0}`} result="m" />
            <feComposite in="SourceGraphic" in2="m" operator="in" />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: `url(#${burnId})` }}>
        <div
          style={{
            fontFamily: p.fontFamily,
            fontWeight: 700,
            fontSize: p.fontSize,
            color: p.inkColor,
            whiteSpace: "pre",
            letterSpacing: "0.04em",
            filter: `url(#${p.filterId}) drop-shadow(0 0 ${6 + 18 * glow}px ${p.accentColor}) drop-shadow(0 0 ${2 + 4 * glow}px ${p.accentColor})`,
          }}
        >
          {p.text}
        </div>
      </div>
      {sparks.map((s, i) => {
        const age = p.f - s.start;
        if (age < 0 || age > 40) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${60 - age * s.speed}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: p.accentColor,
              boxShadow: `0 0 8px ${p.accentColor}`,
              opacity: 1 - age / 40,
            }}
          />
        );
      })}
    </div>
  );
};

/** Rough painted band sliding in at the lower left, with a sub band. */
const LowerThird: React.FC<StyleProps> = (p) => {
  const grow = interpolate(p.f, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const text = interpolate(p.f, [8, 18], [0, 1], clamp);
  const sub = interpolate(p.f, [14, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: "0 0 150px 120px" }}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            background: p.accentColor,
            padding: `${p.fontSize * 0.2}px ${p.fontSize * 0.45}px`,
            transform: `scaleX(${grow})`,
            transformOrigin: "left center",
            filter: `url(#${p.filterId})`,
          }}
        >
          <div
            style={{
              fontFamily: p.fontFamily,
              fontWeight: 700,
              fontSize: p.fontSize,
              color: p.inkColor,
              whiteSpace: "pre",
              opacity: text,
              transform: `translateX(${(1 - text) * -30}px)`,
            }}
          >
            {p.text}
          </div>
        </div>
        {p.subText ? (
          <div
            style={{
              display: "inline-block",
              marginTop: 10,
              marginLeft: p.fontSize * 0.25,
              background: "#151413",
              padding: `${p.fontSize * 0.1}px ${p.fontSize * 0.3}px`,
              transform: `scaleX(${sub})`,
              transformOrigin: "left center",
              filter: `url(#${p.filterId})`,
            }}
          >
            <div
              style={{
                fontFamily: p.fontFamily,
                fontWeight: 700,
                fontSize: p.fontSize * 0.42,
                letterSpacing: "0.18em",
                color: "#ece6d8",
                whiteSpace: "pre",
                opacity: sub,
              }}
            >
              {p.subText}
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Marker circle around a spot, an arrow from the note, then the note. */
const Markup: React.FC<StyleProps> = (p) => {
  const circle = interpolate(p.f, [0, 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const arrow = interpolate(p.f, [16, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const head = interpolate(p.f, [28, 34], [0, 1], clamp);
  const note = interpolate(p.f, [30, 40], [0, 1], clamp);
  // Hand-drawn ellipse: a little more than one turn, slightly off-round.
  const cx = 1180;
  const cy = 470;
  const ellipse = Array.from({ length: 73 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2 - 2.2;
    const wob = 1 + 0.04 * Math.sin(i * 0.7) + (i > 64 ? 0.06 : 0);
    return `${i === 0 ? "M" : "L"}${cx + Math.cos(a) * 260 * wob} ${cy + Math.sin(a) * 150 * wob}`;
  }).join(" ");
  const arrowPath = "M 620 820 C 720 700, 860 640, 960 590";
  const len = 2400;
  const arrowLen = 520;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ filter: `url(#${p.filterId})` }}>
        <path d={ellipse} fill="none" stroke={p.accentColor} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - circle)} />
        <path d={arrowPath} fill="none" stroke={p.accentColor} strokeWidth={12} strokeLinecap="round" strokeDasharray={arrowLen} strokeDashoffset={arrowLen * (1 - arrow)} />
        <path d="M 905 570 L 965 588 L 925 637" fill="none" stroke={p.accentColor} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={head} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 840,
          fontFamily: p.fontFamily,
          fontWeight: 700,
          fontSize: p.fontSize,
          color: p.inkColor,
          whiteSpace: "pre",
          transform: `rotate(-4deg) skewX(-8deg)`,
          opacity: note,
          filter: `url(#${p.filterId})`,
        }}
      >
        {p.text}
      </div>
    </AbsoluteFill>
  );
};

const STYLES: Record<GrungeTextSchemaType["style"], React.FC<StyleProps>> = {
  stencil: Stencil,
  ransom: Ransom,
  typewriter: Typewriter,
  tape: Tape,
  burn: Burn,
  lowerThird: LowerThird,
  markup: Markup,
};

/** Grunge title styles; each one animates in from delayFrames and holds. */
export const GrungeTextTemplate: React.FC<GrungeTextSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const filterId = `grunge${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const seed = Math.floor(random(`${props.randomSeed}-filter`) * 1000);
  const Style = STYLES[props.style];
  const f = frame - props.delayFrames;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: resolveCompositionBackdropColor(props.backgroundColor),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RoughFilter id={filterId} roughness={props.roughness} wear={props.inkWear} seed={seed} />
      {f < 0 ? null : <Style {...props} f={f} filterId={filterId} />}
    </AbsoluteFill>
  );
};
