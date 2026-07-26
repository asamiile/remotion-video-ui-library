import React, { useEffect, useRef, useMemo, useState } from "react";
import {
  AbsoluteFill,
  useDelayRender,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MiniMapSchemaV1Type } from "./mini-map-schema";
import {
  defaultMapCameraV1Config,
  mapboxMapV1Options,
  defaultMiniMapV1Props,
} from "./mini-map-config";
import { mergedMapLocationPointsV1 } from "../../composition/composition-merged";
// import { PlaceholderImage } from "../PlaceholderImage";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

export const MiniMapTemplateV1: React.FC<MiniMapSchemaV1Type> = ({
  mapLocationId,
  width,
  height,
  positionX,
  positionY,
  enableCameraAnimation,
  showMarker,
  markerColor,
  markerSize,
  fadeInDuration,
  fadeOutDuration,
  delayFrames,
  borderRadius,
  boxShadow,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { delayRender, continueRender } = useDelayRender();
  const [delayHandle] = useState(() =>
    delayRender("Mapbox tiles loading..."),
  );

  const locationPoint = useMemo(() => {
    return mergedMapLocationPointsV1.find((point) => point.id === mapLocationId);
  }, [mapLocationId]);

  const fadeProgress = useMemo(() => {
    if (frame < delayFrames) return 0;

    if (frame < delayFrames + fadeInDuration) {
      return interpolate(
        frame,
        [delayFrames, delayFrames + fadeInDuration],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.ease),
        }
      );
    }

    const fadeOutStartFrame = 8.5 * 30; // 8.5s = 255 frames (at 30fps)
    const fadeOutFrameDuration = 1.5 * 30; // 1.5s = 45 frames (at 30fps)


    if (frame >= fadeOutStartFrame) {
      return interpolate(
        frame,
        [fadeOutStartFrame, fadeOutStartFrame + fadeOutFrameDuration],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.ease),
        }
      );
    }

    return 1;
  }, [frame, delayFrames, fadeInDuration]);

  useEffect(() => {
    console.log("MiniMapTemplate useEffect called", { 
      mapContainerCurrent: !!mapContainer.current, 
      locationPoint 
    });
    
    if (!mapContainer.current || !locationPoint) {
      console.log("Early return - container or location missing");
      return;
    }

    try {
      console.log("Creating Mapbox map...");
      const _map = new Map({
        container: mapContainer.current,
        ...mapboxMapV1Options,
        center: [locationPoint.longitude, locationPoint.latitude],
        zoom: locationPoint.zoom || defaultMapCameraV1Config.initialZoom,
        pitch: locationPoint.pitch || defaultMapCameraV1Config.initialPitch,
        bearing: locationPoint.bearing || defaultMapCameraV1Config.initialBearing,
      });

      console.log("Map load event fired, rendering can begin");
      _map.on("load", () => {
        console.log("Map load event fired, rendering can begin");
        continueRender(delayHandle); // Notify Remotion that Mapbox has finished loading

        if (showMarker) {
          const canvas = document.createElement("canvas");
          canvas.width = defaultMiniMapV1Props.markerCanvasSize;
          canvas.height = defaultMiniMapV1Props.markerCanvasSize;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = markerColor;
            ctx.fillRect(0, 0, defaultMiniMapV1Props.markerCanvasSize, defaultMiniMapV1Props.markerCanvasSize);
            ctx.strokeStyle = defaultMiniMapV1Props.markerStrokeColor;
            ctx.lineWidth = defaultMiniMapV1Props.markerStrokeWidth;
            ctx.strokeRect(0, 0, defaultMiniMapV1Props.markerCanvasSize, defaultMiniMapV1Props.markerCanvasSize);
            const imageData = ctx.getImageData(
              0,
              0,
              defaultMiniMapV1Props.markerCanvasSize,
              defaultMiniMapV1Props.markerCanvasSize
            );
            _map.addImage("marker-square", imageData);
          }

          _map.addSource("marker", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [locationPoint.longitude, locationPoint.latitude],
              },
              properties: {},
            },
          });

          _map.addLayer({
            id: "marker-square",
            type: "symbol",
            source: "marker",
            layout: {
              "icon-image": "marker-square",
              "icon-size": markerSize / 10,
              "icon-rotate": defaultMiniMapV1Props.markerIconRotate,
              "icon-allow-overlap": true,
            },
            paint: {
              "icon-opacity": defaultMiniMapV1Props.markerIconOpacity,
            },
          });
        }

        map.current = _map;
      });
    } catch (error) {
      console.error("Error in MiniMapTemplate useEffect:", error);
      throw error;
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [locationPoint, showMarker, markerColor, markerSize, delayHandle, continueRender]);

  useEffect(() => {
    if (!map.current || !enableCameraAnimation || !locationPoint) return;

    const animationStartFrame = delayFrames + fadeInDuration;
    const animationEndFrame = animationStartFrame + defaultMapCameraV1Config.cameraAnimationDuration;

    if (frame >= animationStartFrame && frame < animationEndFrame) {
      const progress = interpolate(
        frame,
        [animationStartFrame, animationEndFrame],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.cubic),
        }
      );

      const currentZoom =
        (locationPoint.zoom || defaultMapCameraV1Config.initialZoom) +
        (defaultMapCameraV1Config.targetZoom - (locationPoint.zoom || defaultMapCameraV1Config.initialZoom)) * progress;
      const currentPitch =
        (locationPoint.pitch || defaultMapCameraV1Config.initialPitch) +
        (defaultMapCameraV1Config.targetPitch - (locationPoint.pitch || defaultMapCameraV1Config.initialPitch)) * progress;
      const currentBearing =
        (locationPoint.bearing || defaultMapCameraV1Config.initialBearing) +
        (defaultMapCameraV1Config.targetBearing - (locationPoint.bearing || defaultMapCameraV1Config.initialBearing)) * progress;

      map.current.flyTo({
        zoom: currentZoom,
        pitch: currentPitch,
        bearing: currentBearing,
        duration: 0,
      });
    }
  }, [
    frame,
    enableCameraAnimation,
    locationPoint,
    delayFrames,
    fadeInDuration,
  ]);

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      position: "relative",
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: `${borderRadius}px`,
      boxShadow: boxShadow,
      overflow: "hidden",
      opacity: fadeProgress,
    }),
    [width, height, borderRadius, boxShadow, fadeProgress]
  );

  const wrapperStyle: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      left: `${positionX}%`,
      top: `${positionY}%`,
      transform: "translate(-50%, -50%)",
      border: defaultMiniMapV1Props.border,
      padding: defaultMiniMapV1Props.padding,
      borderRadius: `${borderRadius}px`,
      opacity: fadeProgress,
    }),
    [positionX, positionY, borderRadius, fadeProgress]
  );

  if (!locationPoint) {
    return (
      <AbsoluteFill>
        <div style={wrapperStyle}>
          <div style={containerStyle}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
              }}
            >
              Map location "{mapLocationId}" not found
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <PlaceholderImage />
      </div> */}

      <div style={wrapperStyle}>
        <div style={containerStyle}>
          <div
            ref={mapContainer}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
