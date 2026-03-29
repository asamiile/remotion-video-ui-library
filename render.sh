#!/bin/bash

# Remotion コンポジション レンダリングスクリプト
#
# 列挙の正: パターン系は各 src/**/-*-config.ts（scripts list-*.cjs が TypeScript AST でキーを取得）。
# 地点は config/local/composition-text.local.json（無ければ example）の locationV1 キー。
# composition-text.local.json の *Patterns は Runtime で defaultProps を上書きするだけで、
# 新しいコンポジション ID を増やすには *-config.ts と Root.tsx の登録が必要（JSON だけでは増えない）。
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
#   ./render.sh TextEffects      # LED / ネオン / グリッチ等のテキスト系パターンを一括書き出し
#   ./render.sh TextEffectsJp    # 日本語サンプル代表 9 本だけ（下記 TEXT_EFFECTS_JP_SAMPLE_IDS）
#   ./render.sh --transparent-bg NeonTextV1-…  # 各コンポの全画面下敷きを透明（アルファ書き出し向け）
#   ./render.sh --with-canvas-bg AudioSpectrum  # プレビュー用キャンバス背景付き（環境変数と同効果）
#   ./render.sh NeonTextV1-LchikaOrangeJp   # コンポジション ID を直接（複数可）
#   ./render.sh all              # すべてのコンポジションを書き出し

set -e  # エラー時に停止

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/out"

# 設定
CONCURRENCY_LOADINGICON=4
CONCURRENCY_LOCATION=4
CONCURRENCY_MINIMAP=2
CONCURRENCY_TEXT_EFFECTS=4
NETWORK_TIMEOUT=60000
CODEC="prores"
PRORES_PROFILE="4444"

# 出力ディレクトリ作成
mkdir -p "$OUTPUT_DIR"

# プレビュー用キャンバス背景（composition-canvas-preview.ts）は既定でレンダーに焼き込まない。
# シェルに REMOTION_CANVAS_BACKGROUND=1 が残っていても、ここでいったん 0 にそろえる。
# 載せたいときだけ --with-canvas-bg を付ける。
export REMOTION_CANVAS_BACKGROUND=0

# コンポの全画面下敷きを透明化（remotion.config DefinePlugin → テンプレが参照）
export REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=0

# --with-canvas-bg / --transparent-bg は npx に渡さない
FILTERED_ARGS=()
for arg in "$@"; do
  if [ "$arg" = "--with-canvas-bg" ]; then
    export REMOTION_CANVAS_BACKGROUND=1
  elif [ "$arg" = "--transparent-bg" ]; then
    export REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1
  else
    FILTERED_ARGS+=("$arg")
  fi
done
set -- "${FILTERED_ARGS[@]}"

# ロケーション一覧（composition-text.example.json / composition-text.local.json の locationV1 と同期）
LOCATIONS=()
while IFS= read -r line || [ -n "$line" ]; do
  if [ -n "$line" ]; then
    LOCATIONS+=("$line")
  fi
done < <(node "$SCRIPT_DIR/scripts/list-location-v1-composition-ids.cjs")

# AudioSpectrum オーディオ格納先（存在警告用・実際のコンポジション一覧は audio-spectrum-config.ts）
AUDIOSPECTRUM_AUDIO_DIR="$SCRIPT_DIR/public/audio/AudioSpectrum"

# TextEffectsJp: 各ファミリーの *Jp 代表サンプル（増減するときはこの配列だけ更新）
TEXT_EFFECTS_JP_SAMPLE_IDS=(
  "NeonTextV1-LchikaOrangeJp"
  "SlideInCaptionV1-RefWhiteJp"
  "GlitchTextV1-HarshSignalJp"
  "WireTextV1-TraceJp"
  "NeonTextV1-RainbowRoundedTubeJp"
  "LightSweepTextV1-RapidJp"
  "TypewriterTextV1-JpComment"
  "ShakeTextV1-TrialJp"
  "ConfettiPopTextV1-RichPopJp"
)

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

# LoadingIcon コンポジションを書き出し（ID は scripts/list-loading-icon-composition-ids.cjs が loading-icon-config.ts から列挙）
render_loadingicon() {
  echo -e "${YELLOW}⏳ Rendering LoadingIcon compositions...${NC}"

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    npx remotion render src/index.ts "$comp_id" \
      "$OUTPUT_DIR/${comp_id}.mov" \
      --concurrency="$CONCURRENCY_LOADINGICON" \
      --network-timeout="$NETWORK_TIMEOUT" \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
        return 1
      }

    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-loading-icon-composition-ids.cjs")

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

# AudioSpectrum コンポジションを書き出し（プリセット ID は scripts/list-audiospectrum-pattern-composition-ids.cjs）
render_audiospectrum() {
  echo -e "${YELLOW}🎵 Rendering AudioSpectrum compositions...${NC}"
  echo -e "${YELLOW}⚠️  Note: Ensure audio files are present in remotion/public/audio/${NC}"
  echo ""

  local comp_id suffix
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    suffix="${comp_id#AudioSpectrumV1-}"
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    npx remotion render src/index.ts "$comp_id" \
      "$OUTPUT_DIR/audio-spectrum-${suffix}.mov" \
      --concurrency=2 \
      --network-timeout="$NETWORK_TIMEOUT" \
      --mute-audio \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
        return 1
      }

    echo -e "${GREEN}✓ audio-spectrum-${suffix}.mov rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-audiospectrum-pattern-composition-ids.cjs")

  echo ""
  echo -e "${GREEN}✅ All AudioSpectrum compositions rendered successfully!${NC}"
}

# AudioSpectrum コンポジション（audioSpectrumAudioFilesV1 に登録した id 別）— Root と同じソース（scripts/list-audiospectrum-file-composition-ids.cjs）
render_audiospectrum_files() {
  echo -e "${YELLOW}🎵 Rendering AudioSpectrum compositions (audio files)...${NC}"

  if [ ! -d "$AUDIOSPECTRUM_AUDIO_DIR" ]; then
    echo -e "${YELLOW}⚠️  Audio directory not found: $AUDIOSPECTRUM_AUDIO_DIR${NC}"
    echo -e "${YELLOW}   Rendering may fail if assets are missing${NC}"
  fi

  local comp_id suffix file_count=0
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    suffix="${comp_id#AudioSpectrumV1-}"
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    npx remotion render src/index.ts "$comp_id" \
      "$OUTPUT_DIR/audio-spectrum-${suffix}.mov" \
      --concurrency=2 \
      --network-timeout="$NETWORK_TIMEOUT" \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
        return 1
      }

    echo -e "${GREEN}✓ audio-spectrum-${suffix}.mov rendered${NC}"
    file_count=$((file_count + 1))
  done < <(node "$SCRIPT_DIR/scripts/list-audiospectrum-file-composition-ids.cjs")

  if [ "$file_count" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No entries in audioSpectrumAudioFilesV1 (audio-spectrum-config.ts)${NC}"
    return 0
  fi

  echo ""
  echo -e "${GREEN}✅ All AudioSpectrum file compositions rendered successfully! ($file_count files)${NC}"
}

# LED / Neon / Glitch / Wire などテキスト系（Root.tsx に登録されたパターンと scripts/list-text-v1-composition-ids.cjs を同期）
render_text_effects() {
  echo -e "${YELLOW}✨ Rendering text-effect compositions (Led / Neon / Glitch / …)…${NC}"

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    npx remotion render src/index.ts "$comp_id" \
      "$OUTPUT_DIR/${comp_id}.mov" \
      --concurrency="$CONCURRENCY_TEXT_EFFECTS" \
      --network-timeout="$NETWORK_TIMEOUT" \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
        return 1
      }

    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-text-v1-composition-ids.cjs")

  echo ""
  echo -e "${GREEN}✅ All text-effect compositions rendered successfully!${NC}"
}

# 日本語サンプル代表のみ（TEXT_EFFECTS_JP_SAMPLE_IDS）
render_text_effects_jp_samples() {
  echo -e "${YELLOW}🇯🇵 Rendering JP text-effect sample compositions (${#TEXT_EFFECTS_JP_SAMPLE_IDS[@]} items)…${NC}"

  local comp_id
  for comp_id in "${TEXT_EFFECTS_JP_SAMPLE_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    npx remotion render src/index.ts "$comp_id" \
      "$OUTPUT_DIR/${comp_id}.mov" \
      --concurrency="$CONCURRENCY_TEXT_EFFECTS" \
      --network-timeout="$NETWORK_TIMEOUT" \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
        return 1
      }

    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done

  echo ""
  echo -e "${GREEN}✅ All JP text-effect samples rendered successfully!${NC}"
}

# Remotion のコンポジション ID をそのまま指定（サブコマンド以外の第 1 引数はここにフォールバック）
render_explicit_compositions() {
  echo -e "${YELLOW}🎬 Rendering explicit composition ID(s) ($# file(s))…${NC}"

  local comp_id
  for comp_id in "$@"; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    npx remotion render src/index.ts "$comp_id" \
      "$OUTPUT_DIR/${comp_id}.mov" \
      --concurrency="$CONCURRENCY_TEXT_EFFECTS" \
      --network-timeout="$NETWORK_TIMEOUT" \
      --codec="$CODEC" \
      --prores-profile="$PRORES_PROFILE" \
      || {
        echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
        return 1
      }

    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done

  echo ""
  echo -e "${GREEN}✅ Explicit composition(s) rendered successfully!${NC}"
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
    TextEffects|texteffects|text-effects)
      render_text_effects
      ;;
    TextEffectsJp|texteffectsjp|jp-text-effects|text-effects-jp)
      render_text_effects_jp_samples
      ;;
    all)
      render_intro
      render_loadingicon
      render_location
      render_minimap
      render_audiospectrum
      render_audiospectrum_files
      render_text_effects
      ;;
    help|-h|--help)
      echo "Usage: $0 [--with-canvas-bg] [--transparent-bg] [Intro|…|all|<CompositionId>…]"
      echo ""
      echo "  --transparent-bg   全画面下敷き＆ビネットを透明化（Neon 等の *-config の色は焼き込まない）"
      echo "  --with-canvas-bg   プレビュー用背景層を載せる（省略時は常にオフ）"
      echo "  Intro              Render Intro composition"
      echo "  LoadingIcon        Render all LoadingIcon compositions"
      echo "  Location           Render all Location compositions"
      echo "  MiniMap            Render all MiniMap compositions (WebGL required)"
      echo "  AudioSpectrum      Render all AudioSpectrum pattern compositions"
      echo "  AudioSpectrumFiles Render all AudioSpectrum compositions (audio files)"
      echo "  TextEffects        Render Led/Neon/Glitch/Wire/… pattern compositions"
      echo "  TextEffectsJp      Render fixed JP sample set (see TEXT_EFFECTS_JP_SAMPLE_IDS)"
      echo "  all                Render all compositions (default)"
      echo "  <CompositionId>    e.g. NeonTextV1-LchikaOrangeJp (複数並べ可; Studio の ID と一致)"
      exit 0
      ;;
    *)
      render_explicit_compositions "$@"
      ;;
  esac
}

main "$@"
