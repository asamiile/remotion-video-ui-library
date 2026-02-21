import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Audio, staticFile, Sequence } from "remotion";
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import { AudioSpectrumSchemaType } from "./audio-spectrum-schema";
import { PlaceholderImage } from "../PlaceholderImage";

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

  // オーディオデータ取得
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: staticFile(audioFile),
    fps,
    frame,
    windowInSeconds: 10,
  });

  // 周波数データ計算
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

  // コンテナスタイル
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

  // バーコンテナスタイル
  const barsContainerStyle: React.CSSProperties = useMemo(
    () => ({
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: `${barGap}px`,
      height: "140px",
      width: "auto",
      padding: "16px",
      backgroundColor: "rgba(107, 99, 84, 0.25)",
    }),
    [barGap]
  );

  return (
    <AbsoluteFill>
      {/* 背景画像 */}
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

      {/* audio要素（音声確認用） */}
      {/* <Sequence from={-audioOffsetInFrames}>
        <Audio src={staticFile(audioFile)} />
      </Sequence> */}

      {/* オーディオスペクトラム コンテナ */}
      <div style={containerStyle}>
        {/* バーコンテナ */}
        <div style={barsContainerStyle}>
          {frequencyData && frequencyData.length > 0 ? (
            frequencyData.map((frequency, index) => {
              // 最大バー高を固定（280px）
              const maxBarHeight = 280;
              const barHeight = Math.max(1, frequency * maxBarHeight * sensitivity);
              
              return (
                <div
                  key={index}
                  style={{
                    width: `${barWidth}px`,
                    height: `${barHeight}px`,
                    backgroundColor: barColor,
                    boxShadow: "0px 4px 20px rgba(107, 99, 84, 0.25)",
                  }}
                />
              );
            })
          ) : (
            <div>Loading audio...</div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
