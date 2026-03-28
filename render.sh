#!/bin/bash

# Remotion コンポジション レンダリングスクリプト
# 
# 使用方法:
#   chmod +x render.sh
#   ./render.sh                  # すべてのコンポジションを書き出し（デフォルト）
#   ./render.sh Intro            # Intro コンポジションを書き出し
#   ./render.sh LoadingIcon      # LoadingIcon コンポジションを書き出し
#   ./render.sh Location         # Location コンポジションを書き出し
#   ./render.sh MiniMap          # MiniMap コンポジションを書き出し（WebGL required）
#   ./render.sh AudioSpectrum    # AudioSpectrum パターンを書き出し
#   ./render.sh AudioSpectrumFi  # AudioSpectrum（オーディオファイル別）を書き出し
#   ./render.sh all              # すべてのコンポジションを書き出し

set -e  # エラー時に停止

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/out"

# 設定
CONCURRENCY_LOADINGICON=4
CONCURRENCY_LOCATION=4
CONCURRENCY_MINIMAP=2
NETWORK_TIMEOUT=60000
CODEC="prores"
PRORES_PROFILE="4444"

# 出力ディレクトリ作成
mkdir -p "$OUTPUT_DIR"

# ロケーション一覧（composition-text.example.json / composition-text.local.json の locationV1 と同期）
LOCATIONS=()
while IFS= read -r line || [ -n "$line" ]; do
  if [ -n "$line" ]; then
    LOCATIONS+=("$line")
  fi
done < <(node "$SCRIPT_DIR/scripts/list-location-v1-composition-ids.cjs")

# LoadingIcon パターン一覧
LOADINGICON_PATTERNS=(
  "Default"
  "Large"
  "Custom"
  "DefaultWithText"
  "LargeWithText"
  "CustomWithText"
)

# AudioSpectrum パターン一覧
AUDIOSPECTRUM_PATTERNS=(
  "Simple"
  "Detailed"
)

# AudioSpectrum オーディオディレクトリ
AUDIOSPECTRUM_AUDIO_DIR="$SCRIPT_DIR/public/audio/AudioSpectrum"

# 色出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🎬 Remotion Composition Rendering Script${NC}"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Intro コンポジションを書き出し
render_intro() {
  echo -e "${YELLOW}🎬 Rendering Intro composition...${NC}"
  echo ""
  echo -e "${YELLOW}→ Intro${NC}"
  
  npx remotion render src/index.ts "IntroV1" \
    "$OUTPUT_DIR/Intro.mov" \
    --concurrency=4 \
    --network-timeout="$NETWORK_TIMEOUT" \
    --codec="$CODEC" \
    --prores-profile="$PRORES_PROFILE" \
    || {
      echo -e "${RED}✗ Failed to render Intro${NC}"
      return 1
    }
  
  echo -e "${GREEN}✓ Intro rendered${NC}"
  echo ""
  echo -e "${GREEN}✅ Intro composition rendered successfully!${NC}"
}

# LoadingIcon コンポジションを書き出し
render_loadingicon() {
  echo -e "${YELLOW}⏳ Rendering LoadingIcon compositions...${NC}"
  
  for pattern in "${LOADINGICON_PATTERNS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ LoadingIcon-${pattern}${NC}"
    
    npx remotion render src/index.ts "LoadingIcon-${pattern}" \
      "$OUTPUT_DIR/LoadingIcon-${pattern}.mov" \
      --concurrency="$CONCURRENCY_LOADINGICON" \
      --network-timeout="$NETWORK_TIMEOUT" \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render LoadingIcon-${pattern}${NC}"
        return 1
      }
    
    echo -e "${GREEN}✓ LoadingIcon-${pattern} rendered${NC}"
  done
  
  echo ""
  echo -e "${GREEN}✅ All LoadingIcon compositions rendered successfully!${NC}"
}

# Location コンポジションを書き出し
render_location() {
  echo -e "${YELLOW}📍 Rendering Location compositions...${NC}"
  
  for location in "${LOCATIONS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ Location-${location}${NC}"
    
    npx remotion render src/index.ts "LocationV1-${location}" \
      "$OUTPUT_DIR/LocationV1-${location}.mov" \
      --concurrency="$CONCURRENCY_LOCATION" \
      --network-timeout="$NETWORK_TIMEOUT" \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render Location-${location}${NC}"
        return 1
      }
    
    echo -e "${GREEN}✓ Location-${location} rendered${NC}"
  done
  
  echo ""
  echo -e "${GREEN}✅ All Location compositions rendered successfully!${NC}"
}

# MiniMap コンポジションを書き出し
render_minimap() {
  echo -e "${YELLOW}🗺️  Rendering MiniMap compositions (WebGL required - local only)...${NC}"
  echo -e "${YELLOW}⚠️  Note: WebGL may not work in all environments${NC}"
  echo ""
  
  for location in "${LOCATIONS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ MiniMap-${location}${NC}"
    
    npx remotion render src/index.ts "MiniMapV1-${location}" \
      "$OUTPUT_DIR/MiniMapV1-${location}.mov" \
      --concurrency="$CONCURRENCY_MINIMAP" \
      --network-timeout=120000 \
      --gl=angle \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render MiniMap-${location}${NC}"
        echo -e "${YELLOW}💡 This is expected if WebGL is not available${NC}"
        return 1
      }
    
    echo -e "${GREEN}✓ MiniMap-${location} rendered${NC}"
  done
  
  echo ""
  echo -e "${GREEN}✅ All MiniMap compositions rendered successfully!${NC}"
}

# AudioSpectrum コンポジションを書き出し
render_audiospectrum() {
  echo -e "${YELLOW}🎵 Rendering AudioSpectrum compositions...${NC}"
  echo -e "${YELLOW}⚠️  Note: Ensure audio files are present in remotion/public/audio/${NC}"
  echo ""
  
  for pattern in "${AUDIOSPECTRUM_PATTERNS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ AudioSpectrum-${pattern}${NC}"
    
    npx remotion render src/index.ts "AudioSpectrum-${pattern}" \
      "$OUTPUT_DIR/audio-spectrum-${pattern}.mov" \
      --concurrency=2 \
      --network-timeout="$NETWORK_TIMEOUT" \
      --mute-audio \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render AudioSpectrum-${pattern}${NC}"
        return 1
      }
    
    echo -e "${GREEN}✓ audio-spectrum-${pattern}.mov rendered${NC}"
  done
  
  echo ""
  echo -e "${GREEN}✅ All AudioSpectrum compositions rendered successfully!${NC}"
}

# AudioSpectrum コンポジション（オーディオファイル別）を書き出し
render_audiospectrum_files() {
  echo -e "${YELLOW}🎵 Rendering AudioSpectrum compositions (audio files)...${NC}"
  
  if [ ! -d "$AUDIOSPECTRUM_AUDIO_DIR" ]; then
    echo -e "${YELLOW}⚠️  Audio directory not found: $AUDIOSPECTRUM_AUDIO_DIR${NC}"
    echo -e "${YELLOW}   Skipping audio file rendering${NC}"
    return 0
  fi
  
  # オーディオファイルをループ処理
  local file_count=0
  for audio_file in "$AUDIOSPECTRUM_AUDIO_DIR"/*; do
    if [ -f "$audio_file" ]; then
      # ファイル名から拡張子を除外
      filename=$(basename "$audio_file")
      filename_without_ext="${filename%.*}"
      
      echo ""
      echo -e "${YELLOW}→ AudioSpectrum-${filename_without_ext}${NC}"
      
      npx remotion render src/index.ts "AudioSpectrum-${filename_without_ext}" \
        "$OUTPUT_DIR/audio-spectrum-${filename_without_ext}.mov" \
        --concurrency=2 \
        --network-timeout="$NETWORK_TIMEOUT" \
        --codec="$CODEC" \
        --prores-profile="$PRORES_PROFILE" \
        || {
          echo -e "${RED}✗ Failed to render AudioSpectrum-${filename_without_ext}${NC}"
          return 1
        }
      
      echo -e "${GREEN}✓ audio-spectrum-${filename_without_ext}.mov rendered${NC}"
      ((file_count++))
    fi
  done
  
  if [ $file_count -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No audio files found in: $AUDIOSPECTRUM_AUDIO_DIR${NC}"
    return 0
  fi
  
  echo ""
  echo -e "${GREEN}✅ All AudioSpectrum file compositions rendered successfully! ($file_count files)${NC}"
}

# メイン処理
main() {
  case "${1:-all}" in
    Intro|intro)
      render_intro
      ;;
    LoadingIcon|loadingicon)
      render_loadingicon
      ;;
    Location|location)
      render_location
      ;;
    MiniMap|minimap)
      render_minimap
      ;;
    AudioSpectrum|audiospectrum)
      render_audiospectrum
      ;;
    AudioSpectrumFiles|audiospectrum-files|audiospectrum_files)
      render_audiospectrum_files
      ;;
    all)
      render_intro
      render_loadingicon
      render_location
      render_minimap
      render_audiospectrum
      render_audiospectrum_files
      ;;
    *)
      echo "Usage: $0 [Intro|LoadingIcon|Location|MiniMap|AudioSpectrum|AudioSpectrumFiles|all]"
      echo ""
      echo "  Intro              Render Intro composition"
      echo "  LoadingIcon        Render all LoadingIcon compositions"
      echo "  Location           Render all Location compositions"
      echo "  MiniMap            Render all MiniMap compositions (WebGL required)"
      echo "  AudioSpectrum      Render all AudioSpectrum pattern compositions"
      echo "  AudioSpectrumFiles Render all AudioSpectrum compositions (audio files)"
      echo "  all                Render all compositions (default)"
      exit 1
      ;;
  esac
}

main "$@"
