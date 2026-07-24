#!/bin/bash

# Remotion コンポジション レンダリングスクリプト
#
# 列挙の正: パターン系は各 src/**/-*-config.ts（scripts list-*.cjs が TypeScript AST でキーを取得）。
# 地点は config/local/composition-text.local.json（無ければ example）の locationV1 キー。
# composition-text.local.json の *Patterns は Runtime で defaultProps を上書きするだけで、
# 新しいコンポジション ID を増やすには *-config.ts と Root.tsx の登録が必要（JSON だけでは増えない）。
#
# 使用方法: chmod +x render.sh のうえ ./render.sh help を参照
# （サブコマンド一覧はそこが正。ここで二重管理しない）。
#
# よく使う例:
#   ./render.sh                                # すべて書き出し（デフォルト）
#   ./render.sh OneTake                        # OneTakeのオンボーディング用コンポジションを書き出し
#   ./render.sh NeonTextV1-LchikaOrangeJp      # コンポジション ID を直接指定（複数可）
#   ./render.sh --transparent-bg NeonTextV1-…  # 全画面下敷きを透明化して書き出し（アルファ向け）

set -e  # エラー時に停止

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/out"

# 設定
CONCURRENCY_LOADINGICON=4
CONCURRENCY_LOCATION=4
CONCURRENCY_MINIMAP=2
CONCURRENCY_AUDIOSPECTRUM=2
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

# OneTake（スマホ+PC連携アプリ）のオンボーディング・ロゴ用モーショングラフィック
# （Background配下は BACKGROUND_COMPOSITION_IDS で別管理）。
# パターン展開はLogoのみのため、他のテキスト系のような AST 列挙スクリプトは持たず、
# Root.tsx の <Folder name="OneTake"> 配下と同じIDをここで直接管理する（増えたらここに追加）。
ONETAKE_COMPOSITION_IDS=(
  "OneTake-OnboardingConnectV1"
  "OneTake-OnboardingOperateV1"
  "OneTake-LogoV1-Wave"
  "OneTake-LogoTextV1"
)

# 動画の背景に重ねて使うアンビエントな装飾パーツ（常時透明背景、固定3本）。
# Root.tsx の <Folder name="OneTake"><Folder name="Background"> と同じIDをここで直接管理する（増えたらここに追加）。
BACKGROUND_COMPOSITION_IDS=(
  "Background-AmbientBlurOrbsV1"
  "Background-ScanLineV1-Clean"
  "Background-ScanLineV1-Crt"
)

# 色出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🎬 Remotion Composition Rendering Script${NC}"
echo "Output directory: $OUTPUT_DIR"
echo ""

# comp_id から、Root.tsx の <Folder> ネストと同じ相対パスを求める（out/ 配下の
# ディレクトリ階層を Studio のフォルダ階層と一致させるため）。一致しないIDは
# ""（=OUTPUT_DIR直下）にフォールバックする。NeonTextRainbowのIDは
# `NeonTextV1-Rainbow*`（`NeonTextV1-`と前方一致してしまう）ため、
# 先に判定する必要がある。新しいFolder/コンポジションを追加したらここにも追加する。
resolve_output_subdir() {
  local comp_id="$1"
  case "$comp_id" in
    NeonTextV1-Rainbow*) echo "Title/NeonTextRainbow" ;;
    LedTextV1-*) echo "Title/LedText" ;;
    NeonTextV1-*) echo "Title/NeonText" ;;
    SlideInCaptionV1-*) echo "Title/SlideInCaption" ;;
    GlitchTextV1-*) echo "Title/GlitchText" ;;
    WireTextV1-*) echo "Title/WireText" ;;
    LightSweepTextV1-*) echo "Title/LightSweepText" ;;
    TypewriterTextV1-*) echo "Title/TypewriterText" ;;
    ShakeTextV1-*) echo "Title/ShakeText" ;;
    ConfettiPopTextV1-*) echo "Title/ConfettiPopText" ;;
    LocationV1-*) echo "Title/Location" ;;
    MiniMapV1-*) echo "Map" ;;
    AudioSpectrumV1-*) echo "AudioSpectrum" ;;
    LoadingIconV1-*) echo "Loading/Icon" ;;
    OneTake-Onboarding*) echo "OneTake/Onboarding" ;;
    OneTake-Logo*) echo "OneTake/Logo" ;;
    Background-*) echo "OneTake/Background" ;;
    IntroV1) echo "Intro" ;;
    PlaceholderImageV1) echo "PlaceholderImage" ;;
    *) echo "" ;;
  esac
}

# comp_id（＋任意のファイル名。省略時は "${comp_id}.mov"）から出力先の
# フルパスを組み立てる。resolve_output_subdir が返すディレクトリは
# render_one_prores_mov が自動で作成する。
output_path_for() {
  local comp_id="$1"
  local filename="${2:-${comp_id}.mov}"
  local subdir
  subdir="$(resolve_output_subdir "$comp_id")"
  if [ -n "$subdir" ]; then
    echo "$OUTPUT_DIR/$subdir/$filename"
  else
    echo "$OUTPUT_DIR/$filename"
  fi
}

# 1 本だけ ProRes 4444 書き出し。
# 引数: comp_id, out_mov, [concurrency=$CONCURRENCY_TEXT_EFFECTS], [network_timeout=$NETWORK_TIMEOUT], [追加フラグ...]
# render_minimap（--gl=angle・長めのtimeout）や render_audiospectrum*（--mute-audio）は
# ここに追加フラグを渡すだけで済ませ、CODEC/PRORES_PROFILE の書き出し設定を一箇所に集約する。
# out_mov はネストしたパス（例: out/Title/NeonText/NeonTextV1-...mov）でもよく、
# 親ディレクトリが無ければここで作成する。
render_one_prores_mov() {
  local comp_id="$1"
  local out_mov="$2"
  local cc="${3:-$CONCURRENCY_TEXT_EFFECTS}"
  local timeout="${4:-$NETWORK_TIMEOUT}"
  local shift_n=4
  [ "$#" -lt "$shift_n" ] && shift_n="$#"
  shift "$shift_n"
  mkdir -p "$(dirname "$out_mov")"
  npx remotion render src/index.ts "$comp_id" "$out_mov" \
    --concurrency="$cc" \
    --network-timeout="$timeout" \
    --codec="$CODEC" \
    --prores-profile="$PRORES_PROFILE" \
    "$@" \
    || {
      echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
      return 1
    }
}

# Intro コンポジションを書き出し
render_intro() {
  echo -e "${YELLOW}🎬 Rendering Intro composition...${NC}"
  echo ""
  echo -e "${YELLOW}→ IntroV1${NC}"

  render_one_prores_mov "IntroV1" "$(output_path_for IntroV1 Intro.mov)" 4 || return 1
  echo -e "${GREEN}✓ Intro rendered${NC}"
  echo ""
  echo -e "${GREEN}✅ Intro composition rendered successfully!${NC}"
}

# OneTake コンポジションを書き出し（ID は ONETAKE_COMPOSITION_IDS 参照）
render_onetake() {
  echo -e "${YELLOW}📱 Rendering OneTake compositions...${NC}"

  local comp_id
  for comp_id in "${ONETAKE_COMPOSITION_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done

  echo ""
  echo -e "${GREEN}✅ All OneTake compositions rendered successfully!${NC}"
}

# Background コンポジションを書き出し（ID は BACKGROUND_COMPOSITION_IDS 参照）。
# 常時透明背景のパーツのため --transparent-bg は不要。
render_background() {
  echo -e "${YELLOW}✨ Rendering Background compositions...${NC}"

  local comp_id
  for comp_id in "${BACKGROUND_COMPOSITION_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done

  echo ""
  echo -e "${GREEN}✅ All Background compositions rendered successfully!${NC}"
}

# LoadingIcon コンポジションを書き出し（ID は scripts/list-loading-icon-composition-ids.cjs が loading-icon-config.ts から列挙）
render_loadingicon() {
  echo -e "${YELLOW}⏳ Rendering LoadingIcon compositions...${NC}"

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" "$CONCURRENCY_LOADINGICON" \
      || return 1
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
    
    render_one_prores_mov \
      "LocationV1-${location}" \
      "$(output_path_for "LocationV1-${location}")" \
      "$CONCURRENCY_LOCATION" \
      || return 1
    
    echo -e "${GREEN}✓ Location-${location} rendered${NC}"
  done
  
  echo ""
  echo -e "${GREEN}✅ All Location compositions rendered successfully!${NC}"
}

# MiniMap コンポジションを書き出し。対象地点は scripts/list-minimap-v1-composition-ids.cjs
# （locationV1 全件ではなく、緯度経度が揃っている地点だけ — 揃っていない地点は
# そもそも Root.tsx にコンポジションが登録されないため、$LOCATIONS をそのまま使うと
# 「存在しないコンポジションを render しようとして失敗する」ことがある）
render_minimap() {
  echo -e "${YELLOW}🗺️  Rendering MiniMap compositions (WebGL required - local only)...${NC}"
  echo -e "${YELLOW}⚠️  Note: WebGL may not work in all environments${NC}"
  echo ""

  local location has_any=0
  while IFS= read -r location || [ -n "$location" ]; do
    [ -z "$location" ] && continue
    has_any=1
    echo ""
    echo -e "${YELLOW}→ MiniMap-${location}${NC}"

    if ! render_one_prores_mov \
      "MiniMapV1-${location}" \
      "$(output_path_for "MiniMapV1-${location}")" \
      "$CONCURRENCY_MINIMAP" \
      120000 \
      --gl=angle; then
      echo -e "${YELLOW}💡 This is expected if WebGL is not available${NC}"
      return 1
    fi

    echo -e "${GREEN}✓ MiniMap-${location} rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-minimap-v1-composition-ids.cjs")

  if [ "$has_any" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No locations have latitude/longitude set in mapLocationPointsV1 — nothing to render${NC}"
    return 0
  fi

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

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id" "audio-spectrum-${suffix}.mov")" \
      "$CONCURRENCY_AUDIOSPECTRUM" "$NETWORK_TIMEOUT" --mute-audio \
      || return 1

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

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id" "audio-spectrum-${suffix}.mov")" \
      "$CONCURRENCY_AUDIOSPECTRUM" "$NETWORK_TIMEOUT" \
      || return 1

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

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
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

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
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

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
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
    OneTake|onetake)
      render_onetake
      ;;
    Background|background)
      render_background
      ;;
    all)
      render_intro
      render_loadingicon
      render_location
      render_minimap
      render_audiospectrum
      render_audiospectrum_files
      render_text_effects
      render_onetake
      render_background
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
      echo "  OneTake            Render OneTake onboarding motion-graphic compositions"
      echo "  Background         Render ambient background overlay compositions (always transparent)"
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
