/**
 * When `render.sh --transparent-bg` is used (or REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1
 * is set via the build-time DefinePlugin), makes the full-screen backdrop color transparent
 * and drops the radial vignette's opacity to 0 so alpha passes through cleanly.
 *
 * A separate layer from composition-canvas-preview (the Studio-only preview backdrop).
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

/** For templates like Neon / Rainbow / LightSweep that use both a backdrop and a radial vignette */
export function resolvedBackdropPair(
  backgroundColor: string,
  vignetteOpacity: number,
): { backdropColor: string; vignette: number } {
  return {
    backdropColor: resolveCompositionBackdropColor(backgroundColor),
    vignette: resolveCompositionVignetteOpacity(vignetteOpacity),
  };
}
