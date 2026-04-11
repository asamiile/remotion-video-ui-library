/**
 * Studio プレビュー・または REMOTION_CANVAS_BACKGROUND=1 のレンダー時にだけ
 * CanvasPreviewShell が参照する、コンポジション別の背景。
 *
 * - exact: Composition の id と完全一致
 * - prefix: id がその文字列で始まる場合（例: AudioSpectrum の全バリエーション）
 * - 画像: public/ 以下のパスを staticFile に渡す形式（例: canvas-preview/bg.jpg）
 */

export type CanvasPreviewLayer =
  | { kind: "color"; color: string }
  | {
      kind: "image";
      /** `public/` からの相対（先頭スラッシュなし） */
      src: string;
      objectFit?: "cover" | "contain" | "fill";
    };

const exactLayers: Partial<Record<string, CanvasPreviewLayer>> = {
  MyComp: { kind: "color", color: "#111111" },
  PlaceholderImageV1: { kind: "color", color: "#1e1e1e" },
  /*
  画像の例（ファイルを public/canvas-preview/bg.jpg に置いた場合）:
  AudioSpectrumV1-Detailed: {
    kind: "image",
    src: "canvas-preview/bg.jpg",
    objectFit: "cover",
  },
  */
};

const prefixLayers: { prefix: string; layer: CanvasPreviewLayer }[] = [
  /** スペクトラム周りが透けやすいため、系統のあるダークトーン */
  {
    prefix: "AudioSpectrumV1-",
    layer: { kind: "color", color: "#3a3630" },
  },
  /** NeonText 系（虹チューブ） */
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
