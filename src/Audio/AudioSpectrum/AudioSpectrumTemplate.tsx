import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, staticFile, Sequence } from "remotion";
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { AudioSpectrumSchemaType } from "./audio-spectrum.schema";
import { SpectrumVisualizer } from "./SpectrumVisualizer";
import { PlaceholderImage } from "../../Placeholder/PlaceholderImage/PlaceholderImage";

export const AudioSpectrumTemplate: React.FC<AudioSpectrumSchemaType> = ({
  audioFile,
  audioOffsetInSeconds = 0,
  barCount,
  barColor,
  barWidth,
  barGap,
  sensitivity,
  smoothing,
  positionX,
  positionY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);

  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile(audioFile),
    fps,
    frame,
    windowInSeconds: 10,
  });

  const frequencyData = useMemo(() => {
    if (!audioData) return null;

    return visualizeAudio({
      fps,
      frame,
      audioData,
      numberOfSamples: barCount,
      optimizeFor: "speed",
      dataOffsetInSeconds,
    });
  }, [audioData, barCount, fps, frame, dataOffsetInSeconds]);

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      left: `${positionX}%`,
      top: `${positionY}%`,
      transform: "translate(-50%, -50%)",
      width: "auto",
      height: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
    }),
    [positionX, positionY]
  );

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

      {/* Audio element kept commented out for verifying playback sync during development */}
      {/* <Sequence from={-audioOffsetInFrames}>
        <Audio src={staticFile(audioFile)} />
      </Sequence> */}

      <div style={containerStyle}>
        <SpectrumVisualizer
          frequencyData={frequencyData}
          barCount={barCount}
          barColor={barColor}
          barWidth={barWidth}
          barGap={barGap}
          containerHeight={140}
          sensitivity={sensitivity}
          smoothing={smoothing}
        />
      </div>
    </AbsoluteFill>
  );
};
