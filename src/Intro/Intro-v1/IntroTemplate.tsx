import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { IntroSchemaV1Type } from "./intro-schema";
import { IntroScene, introSceneTimingV1 } from "./intro-config";

export const IntroTemplateV1: React.FC<IntroSchemaV1Type> = ({
  authorName,
  introTitle,
  introDescription,
  backgroundColor,
  textColor,
  titleFontSize,
  titleFontWeight,
  titleLineHeight,
  descriptionFontSize,
  descriptionFontWeight,
  descriptionLineHeight,
  bottomRightFontSize,
  bottomRightBottom,
  bottomRightRight,
  fontFamily,
  fadeInDuration,
  fadeOutDuration,
}) => {
  const frame = useCurrentFrame();

  const introScenesV1: IntroScene[] = useMemo(
    () => [
      {
        ...introSceneTimingV1[0],
        centerText: introTitle,
        bottomRightText: authorName,
      },
      {
        ...introSceneTimingV1[1],
        centerText: introDescription,
      },
    ],
    [authorName, introTitle, introDescription],
  );

  const renderScene = (sceneIndex: number) => {
    const scene = introScenesV1[sceneIndex];
    const sceneStartFrame = introScenesV1
      .slice(0, sceneIndex)
      .reduce((acc, s) => acc + s.duration, 0);

    const sceneProgress = Math.max(0, frame - sceneStartFrame) / scene.duration;

    let opacity = 1;
    if (sceneProgress < fadeInDuration / scene.duration) {
      opacity = interpolate(
        sceneProgress,
        [0, fadeInDuration / scene.duration],
        [0, 1],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.ease),
        },
      );
    } else {
      // Fade-out start timing, given in seconds
      const fadeOutStartSeconds = scene.fadeOutStartSeconds ?? 8.5;
      const fadeOutStartProgress = (fadeOutStartSeconds * 30) / scene.duration;

      if (sceneProgress > fadeOutStartProgress) {
        opacity = interpolate(
          sceneProgress,
          [fadeOutStartProgress, 1],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.ease),
          },
        );
      }
    }

    const isVisible = frame >= sceneStartFrame && frame < sceneStartFrame + scene.duration;

    if (!isVisible) {
      return null;
    }

    return (
      <AbsoluteFill
        key={`scene-${sceneIndex}`}
        style={{
          backgroundColor,
          opacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {scene.centerText && (
          <div
            style={{
              position: "absolute",
              textAlign: "center",
              color: textColor,
              fontSize: scene.centerFontSize || (sceneIndex === 0 ? titleFontSize : descriptionFontSize),
              fontFamily,
              fontWeight: scene.centerFontWeight || (sceneIndex === 0 ? titleFontWeight : descriptionFontWeight),
              lineHeight: scene.centerLineHeight || (sceneIndex === 0 ? titleLineHeight : descriptionLineHeight),
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
            }}
          >
            {scene.centerText}
          </div>
        )}

        {scene.bottomRightText && (
          <div
            style={{
              position: "absolute",
              bottom: scene.bottomRightBottom ?? bottomRightBottom,
              right: scene.bottomRightRight ?? bottomRightRight,
              color: textColor,
              fontSize: scene.bottomRightFontSize || bottomRightFontSize,
              fontFamily,
              fontWeight: "400",
            }}
          >
            {scene.bottomRightText}
          </div>
        )}
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {introScenesV1.map((_, index) => renderScene(index))}
    </AbsoluteFill>
  );
};
