/**
 * `render.sh --transparent-bg`（またはビルド時の DefinePlugin で
 * REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1）のとき、全画面の下敷き色を透明にし、
 * 放射ビネットも不透明度 0 にしてアルファが通りやすくする。
 *
 * composition-canvas-preview（Studio 用プレビュー底）とは別レイヤー。
 */

export function resolveCompositionBackdropColor(cssColor: string): string {
  if (process.env.REMOTION_TRANSPARENT_COMPOSITION_BACKDROP === "1") {
    return "transparent";
  }
  return cssColor;
}

export function resolveCompositionVignetteOpacity(opacity: number): number {
  if (process.env.REMOTION_TRANSPARENT_COMPOSITION_BACKDROP === "1") {
    return 0;
  }
  return opacity;
}

/** Neon / Rainbow / LightSweep のように下敷き＋放射ビネットを併用するテンプレ向け */
export function resolvedBackdropPair(
  backgroundColor: string,
  vignetteOpacity: number,
): { backdropColor: string; vignette: number } {
  return {
    backdropColor: resolveCompositionBackdropColor(backgroundColor),
    vignette: resolveCompositionVignetteOpacity(vignetteOpacity),
  };
}
