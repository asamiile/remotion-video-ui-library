/**
 * Per-composition backgrounds that CanvasPreviewShell reads only in the Studio preview,
 * or during a render with REMOTION_CANVAS_BACKGROUND=1.
 *
 * - exact: matches the Composition's id exactly
 * - prefix: matches when id starts with this string (e.g. all AudioSpectrum variants)
 * - image: a path under public/ passed to staticFile (e.g. canvas-preview/bg.jpg)
 */

export type CanvasPreviewLayer =
  | { kind: "color"; color: string }
  | {
      kind: "image";
      /** Path relative to `public/` (no leading slash) */
      src: string;
      objectFit?: "cover" | "contain" | "fill";
    };

const exactLayers: Partial<Record<string, CanvasPreviewLayer>> = {
  PlaceholderImageV1: { kind: "color", color: "#1e1e1e" },
  /*
  Image example (when the file is placed at public/canvas-preview/bg.jpg):
  AudioSpectrumV1-Detailed: {
    kind: "image",
    src: "canvas-preview/bg.jpg",
    objectFit: "cover",
  },
  */
};

const prefixLayers: { prefix: string; layer: CanvasPreviewLayer }[] = [
  /** The spectrum area tends to show through, so use a coordinated dark tone */
  {
    prefix: "AudioSpectrumV1-",
    layer: { kind: "color", color: "#3a3630" },
  },
  /** Background compositions are always transparent, so preview against the OneTake navy they're actually composited over */
  {
    prefix: "Background-",
    layer: { kind: "color", color: "#060810" },
  },
  /** NeonText family (rainbow tube) */
  {
    prefix: "NeonTextV1-Rainbow",
    layer: { kind: "color", color: "#0a0a0f" },
  },
];

export function resolveCanvasPreviewLayer(
  compositionId: string,
): CanvasPreviewLayer | undefined {
  const exact = exactLayers[compositionId];
  if (exact) {
    return exact;
  }
  for (const { prefix, layer } of prefixLayers) {
    if (compositionId.startsWith(prefix)) {
      return layer;
    }
  }
  return undefined;
}
