import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Html5Video,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
import { NoReactInternals } from "remotion/no-react";
import * as THREE from "three";
import type { ShaderTexture } from "./ShaderCanvas";

export type MediaSource = {
  /** Path under public/ (e.g. "clips/a.mp4"), an absolute URL, or "" for none */
  src: string;
  /** Where playback starts inside a video source */
  startSeconds: number;
};

const VIDEO_EXTENSION = /\.(mp4|webm|mov|m4v|mkv)(\?|#|$)/i;

const resolveSrc = (src: string) =>
  /^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src);

/**
 * Loads an image URL as a texture. The delayRender handle opened while
 * loading is handed to ShaderCanvas via `release`, which continues it only
 * after the canvas has drawn with the new texture.
 */
const useLoadedTexture = (url: string | null): ShaderTexture | null => {
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [loaded, setLoaded] = useState<{
    url: string;
    entry: ShaderTexture;
  } | null>(null);

  useLayoutEffect(() => {
    if (!url) return;
    const handle = delayRender(`Loading shader texture ${url}`);
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      continueRender(handle);
    };
    let cancelled = false;
    new THREE.TextureLoader()
      .loadAsync(url)
      .then((texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        const image = texture.image as HTMLImageElement;
        setLoaded((previous) => {
          previous?.entry.texture.dispose();
          return {
            url,
            entry: {
              texture,
              width: image.naturalWidth || image.width,
              height: image.naturalHeight || image.height,
              release,
            },
          };
        });
      })
      .catch((error) => cancelRender(error));
    return () => {
      cancelled = true;
      release();
    };
  }, [url, delayRender, continueRender, cancelRender]);

  useEffect(() => () => loaded?.entry.texture.dispose(), [loaded]);

  // Keep showing the previous texture while the next frame loads (preview).
  return url ? (loaded?.entry ?? null) : null;
};

/**
 * Image or video as a shader texture, for transitions that blend two clips.
 *
 * - Images load once.
 * - Videos, while rendering, fetch the exact frame as an image (like
 *   <OffthreadVideo>); in the Studio preview they play through a hidden
 *   <video> element instead. Render the returned `element` somewhere in the
 *   tree so that preview video exists.
 */
export const useMediaTexture = ({
  src,
  startSeconds,
}: MediaSource): {
  texture: ShaderTexture | null;
  element: React.ReactNode;
} => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isRendering } = useRemotionEnvironment();
  const resolved = src ? resolveSrc(src) : null;
  const isVideo = resolved !== null && VIDEO_EXTENSION.test(src);

  const imageUrl = !resolved
    ? null
    : !isVideo
      ? resolved
      : isRendering
        ? NoReactInternals.getOffthreadVideoSource({
            src: resolved,
            currentTime: startSeconds + frame / fps,
            transparent: false,
            toneMapped: true,
          })
        : null;
  const imageTexture = useLoadedTexture(imageUrl);

  // Preview only: a hidden, synced <video> feeding a VideoTexture.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTexture, setVideoTexture] = useState<ShaderTexture | null>(null);
  const usePreviewVideo = isVideo && !isRendering;
  useEffect(() => {
    const video = videoRef.current;
    if (!usePreviewVideo || !video) return;
    let texture: THREE.VideoTexture | null = null;
    const onReady = () => {
      texture = new THREE.VideoTexture(video);
      setVideoTexture({
        texture,
        width: video.videoWidth,
        height: video.videoHeight,
        release: () => {},
      });
    };
    if (video.readyState >= 2) onReady();
    else video.addEventListener("loadeddata", onReady, { once: true });
    return () => {
      video.removeEventListener("loadeddata", onReady);
      texture?.dispose();
      setVideoTexture(null);
    };
  }, [usePreviewVideo, resolved]);

  const element =
    usePreviewVideo && resolved ? (
      <Html5Video
        ref={videoRef}
        src={resolved}
        trimBefore={Math.round(startSeconds * fps)}
        muted
        style={{ position: "absolute", width: 2, height: 2, opacity: 0 }}
      />
    ) : null;

  return {
    texture: usePreviewVideo ? videoTexture : imageTexture,
    element,
  };
};
