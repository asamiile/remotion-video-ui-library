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
import { MiniMapSchemaType, defaultMiniMapProps, defaultMapCameraConfig, mapboxMapOptions } from "./mini-map.schema";
import { mergedMapLocationPoints } from "../../composition/composition-merged-text";
// import { PlaceholderImage } from "../PlaceholderImage";

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;
console.log("Mapbox token loaded:", !!process.env.REMOTION_MAPBOX_TOKEN, "Token starts with:", process.env.REMOTION_MAPBOX_TOKEN?.substring(0, 10));

export const MiniMapTemplate: React.FC<MiniMapSchemaType> = ({
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
    return mergedMapLocationPoints.find((point) => point.id === mapLocationId);
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

    const fadeOutStartFrame = durationInFrames - fadeOutDuration;
    if (frame >= fadeOutStartFrame) {
      return interpolate(
        frame,
        [fadeOutStartFrame, durationInFrames],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.ease),
        }
      );
    }

    return 1;
  }, [frame, delayFrames, fadeInDuration, fadeOutDuration, durationInFrames]);

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
        ...mapboxMapOptions,
        center: [locationPoint.longitude, locationPoint.latitude],
        zoom: locationPoint.zoom || defaultMapCameraConfig.initialZoom,
        pitch: locationPoint.pitch || defaultMapCameraConfig.initialPitch,
        bearing: locationPoint.bearing || defaultMapCameraConfig.initialBearing,
      });

      console.log("Map load event fired, rendering can begin");
      _map.on("load", () => {
        console.log("Map load event fired, rendering can begin");
        continueRender(delayHandle); // Notify Remotion that Mapbox has finished loading

        if (showMarker) {
          const canvas = document.createElement("canvas");
          canvas.width = defaultMiniMapProps.markerCanvasSize;
          canvas.height = defaultMiniMapProps.markerCanvasSize;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = markerColor;
            ctx.fillRect(0, 0, defaultMiniMapProps.markerCanvasSize, defaultMiniMapProps.markerCanvasSize);
            ctx.strokeStyle = defaultMiniMapProps.markerStrokeColor;
            ctx.lineWidth = defaultMiniMapProps.markerStrokeWidth;
            ctx.strokeRect(0, 0, defaultMiniMapProps.markerCanvasSize, defaultMiniMapProps.markerCanvasSize);
            const imageData = ctx.getImageData(
              0,
              0,
              defaultMiniMapProps.markerCanvasSize,
              defaultMiniMapProps.markerCanvasSize
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
              "icon-rotate": defaultMiniMapProps.markerIconRotate,
              "icon-allow-overlap": true,
            },
            paint: {
              "icon-opacity": defaultMiniMapProps.markerIconOpacity,
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
    const animationEndFrame = animationStartFrame + defaultMapCameraConfig.cameraAnimationDuration;

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
        (locationPoint.zoom || defaultMapCameraConfig.initialZoom) +
        (defaultMapCameraConfig.targetZoom - (locationPoint.zoom || defaultMapCameraConfig.initialZoom)) * progress;
      const currentPitch =
        (locationPoint.pitch || defaultMapCameraConfig.initialPitch) +
        (defaultMapCameraConfig.targetPitch - (locationPoint.pitch || defaultMapCameraConfig.initialPitch)) * progress;
      const currentBearing =
        (locationPoint.bearing || defaultMapCameraConfig.initialBearing) +
        (defaultMapCameraConfig.targetBearing - (locationPoint.bearing || defaultMapCameraConfig.initialBearing)) * progress;

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
      border: defaultMiniMapProps.border,
      padding: defaultMiniMapProps.padding,
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
