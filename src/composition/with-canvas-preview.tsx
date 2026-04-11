import React from "react";
import {
  AbsoluteFill,
  getRemotionEnvironment,
  Img,
  staticFile,
} from "remotion";
import {
  resolveCanvasPreviewLayer,
  type CanvasPreviewLayer,
} from "../config/composition-canvas-preview";

function shouldShowCanvasPreviewLayer(): boolean {
  return (
    getRemotionEnvironment().isStudio ||
    process.env.REMOTION_CANVAS_BACKGROUND === "1"
  );
}

function PreviewBackdrop({ layer }: { layer: CanvasPreviewLayer }) {
  if (layer.kind === "color") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: layer.color,
        }}
      />
    );
  }
  const fit = layer.objectFit ?? "cover";
  return (
    <Img
      src={staticFile(layer.src)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: fit,
        objectPosition: "50% 50%",
      }}
    />
  );
}

export const CanvasPreviewShell: React.FC<{
  compositionId: string;
  children: React.ReactNode;
}> = ({ compositionId, children }) => {
  const layer = resolveCanvasPreviewLayer(compositionId);
  const showBackdrop = shouldShowCanvasPreviewLayer() && layer !== undefined;

  if (!showBackdrop) {
    return <>{children}</>;
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 0, pointerEvents: "none" }}>
        <PreviewBackdrop layer={layer} />
      </AbsoluteFill>
      <AbsoluteFill style={{ zIndex: 1 }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export function withCanvasPreview<P extends object>(
  compositionId: string,
  Inner: React.FC<P>,
): React.FC<P> {
  const Wrapped: React.FC<P> = (props) => (
    <CanvasPreviewShell compositionId={compositionId}>
      <Inner {...props} />
    </CanvasPreviewShell>
  );
  Wrapped.displayName = `CanvasPreview(${compositionId})`;
  return Wrapped;
}
