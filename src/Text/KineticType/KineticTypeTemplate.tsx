import React, { useLayoutEffect, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import * as THREE from "three";
import { cssColorToVec3, cssColorToVec4 } from "../../helpers/shader/color";
import { ShaderCanvas, type ShaderTexture } from "../../helpers/shader/ShaderCanvas";
import { resolveCompositionBackdropColor } from "../../helpers/transparent-composition-backdrop";
import { kineticTypeGlsl } from "./kinetic-type.glsl";
import { KINETIC_TYPE_STYLES, type KineticTypeSchemaType } from "./kinetic-type.schema";

const TILE_FONT_PX = 180;
const TILE_ROW_HEIGHT = 1.3;
const TILE_SEPARATOR = "   ";

type KineticTypeStyle = KineticTypeSchemaType["style"];

/**
 * How each style colors its rows, whether rows scroll sideways, which RGB
 * split it uses, and how much of each row the ink fills (0 = the texture's
 * own spacing). See the mode list at the top of kinetic-type.glsl.ts.
 */
const STYLE_SETTINGS: Record<
  KineticTypeStyle,
  { rowMode: number; scroll: number; splitMode: number; rowFill: number }
> = {
  wave: { rowMode: 0, scroll: 1, splitMode: 0, rowFill: 0 },
  tunnel: { rowMode: 0, scroll: 1, splitMode: 0, rowFill: 0 },
  sphere: { rowMode: 0, scroll: 1, splitMode: 0, rowFill: 0 },
  stack: { rowMode: 0, scroll: 0, splitMode: 1, rowFill: 0 },
  fold: { rowMode: 1, scroll: 1, splitMode: 1, rowFill: 0.9 },
  ribbons: { rowMode: 2, scroll: 1, splitMode: 0, rowFill: 0.66 },
  liquid: { rowMode: 0, scroll: 0, splitMode: 1, rowFill: 0 },
  boxTunnel: { rowMode: 2, scroll: 0, splitMode: 1, rowFill: 0.72 },
  cloth: { rowMode: 3, scroll: 1, splitMode: 2, rowFill: 0.82 },
  textMask: { rowMode: 3, scroll: 1, splitMode: 1, rowFill: 0.8 },
  zoom: { rowMode: 0, scroll: 1, splitMode: 0, rowFill: 0.8 },
  vortex: { rowMode: 0, scroll: 1, splitMode: 0, rowFill: 0 },
  pillar: { rowMode: 0, scroll: 0, splitMode: 1, rowFill: 0.85 },
  ripple: { rowMode: 0, scroll: 1, splitMode: 0, rowFill: 0.75 },
};

type TextTexture = {
  entry: ShaderTexture;
  /** Tile widths in texture pixels (word + separator) for the main and sub word */
  tileWidths: [number, number];
  /** Word widths in texture pixels (without the separator) */
  wordWidths: [number, number];
  rowHeight: number;
  /** Ink height (cap top to descender) as a fraction of the row height */
  inkFraction: number;
};

/**
 * Draws the main word and the sub word as two texture rows (red = fill,
 * green = outline) after the font has loaded, with the ink centered in each
 * row; the render waits until the shader has drawn with it.
 */
const useTextTexture = (
  text: string,
  subText: string,
  fontFamily: string,
  fontWeight: string,
): TextTexture | null => {
  const { delayRender, continueRender } = useDelayRender();
  const [state, setState] = useState<TextTexture | null>(null);

  useLayoutEffect(() => {
    const handle = delayRender(`Kinetic type texture: ${text}`);
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      continueRender(handle);
    };
    let cancelled = false;
    let texture: THREE.CanvasTexture | null = null;
    const font = `${fontWeight} ${TILE_FONT_PX}px ${fontFamily}`;
    const words = [text.toUpperCase(), (subText || text).toUpperCase()];
    void document.fonts.load(font, words.join(" ")).then(() => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      ctx.font = font;
      const strokeWidth = TILE_FONT_PX * 0.03;
      const labels = words.map((word) => `${word}${TILE_SEPARATOR}`);
      const inks = words.map((word) => ctx.measureText(word));
      const tileWidths = labels.map((label) => Math.ceil(ctx.measureText(label).width + strokeWidth * 2));
      const ascent = Math.max(...inks.map((ink) => ink.actualBoundingBoxAscent));
      const descent = Math.max(...inks.map((ink) => ink.actualBoundingBoxDescent));
      const rowHeight = Math.ceil(TILE_FONT_PX * TILE_ROW_HEIGHT);
      canvas.width = Math.max(...tileWidths);
      canvas.height = rowHeight * 2;
      const baselines = [0, 1].map((row) => row * rowHeight + rowHeight / 2 + (ascent - descent) / 2);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = font;
      ctx.textBaseline = "alphabetic";
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = "#f00";
      labels.forEach((label, row) => ctx.fillText(label, strokeWidth, baselines[row]));
      // Outline = the outer half of a double-width stroke. Erasing the fill
      // also removes strokes along overlapping contours inside the glyphs.
      const outline = document.createElement("canvas");
      outline.width = canvas.width;
      outline.height = canvas.height;
      const octx = outline.getContext("2d")!;
      octx.font = font;
      octx.textBaseline = "alphabetic";
      octx.strokeStyle = "#0f0";
      octx.lineWidth = strokeWidth * 2;
      octx.lineJoin = "round";
      labels.forEach((label, row) => octx.strokeText(label, strokeWidth, baselines[row]));
      octx.globalCompositeOperation = "destination-out";
      labels.forEach((label, row) => octx.fillText(label, strokeWidth, baselines[row]));
      ctx.drawImage(outline, 0, 0);

      texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.anisotropy = 8;
      setState({
        entry: { texture, width: canvas.width, height: canvas.height, release },
        tileWidths: [tileWidths[0], tileWidths[1]],
        wordWidths: [inks[0].width + strokeWidth * 2, inks[1].width + strokeWidth * 2],
        rowHeight,
        inkFraction: (ascent + descent + strokeWidth * 2) / rowHeight,
      });
    });
    return () => {
      cancelled = true;
      texture?.dispose();
      release();
    };
  }, [text, subText, fontFamily, fontWeight, delayRender, continueRender]);

  return state;
};

/** Seamless-loop kinetic typography; see KINETIC_TYPE_STYLES for the looks. */
export const KineticTypeTemplate: React.FC<KineticTypeSchemaType> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const textTexture = useTextTexture(props.text, props.subText, props.fontFamily, props.fontWeight);
  const settings = STYLE_SETTINGS[props.style];

  return (
    <AbsoluteFill>
      <ShaderCanvas
        fragmentShader={kineticTypeGlsl}
        textures={{ uText: textTexture?.entry ?? null }}
        uniforms={{
          uStyle: KINETIC_TYPE_STYLES.indexOf(props.style),
          uRowMode: settings.rowMode,
          uScroll: settings.scroll,
          uSplitMode: settings.splitMode,
          uRowFill: settings.rowFill,
          uPhase: frame / durationInFrames,
          uCycles: props.loopCycles,
          uRows: props.rows,
          uDistortion: props.distortion,
          uAberration: props.chromaticAberration,
          uGlitch: props.glitch,
          uGrain: props.grain,
          uTileWidths: textTexture?.tileWidths ?? [1, 1],
          uWordWidths: textTexture?.wordWidths ?? [1, 1],
          uRowHeight: textTexture?.rowHeight ?? 1,
          uInkFraction: textTexture?.inkFraction ?? 1,
          uSeed: props.randomSeed,
          uTextColor: cssColorToVec3(props.textColor),
          uAccentColor: cssColorToVec3(props.accentColor),
          uBg: cssColorToVec4(resolveCompositionBackdropColor(props.backgroundColor)),
        }}
      />
    </AbsoluteFill>
  );
};
