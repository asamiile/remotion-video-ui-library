#!/bin/bash

# Remotion composition rendering script
#
# Source of truth for enumeration: pattern-based compositions come from each
# src/**/-*-config.ts (scripts list-*.cjs reads the keys via TypeScript AST).
# Locations come from the locationV1 key in config/local/composition-text.local.json
# (falls back to example if absent). The *Patterns in composition-text.local.json only
# override defaultProps at runtime — adding a new composition ID still requires
# registering it in *-config.ts and Root.tsx (JSON alone won't add one).
#
# Usage: chmod +x render.sh, then see ./render.sh help
# (the subcommand list there is authoritative — not duplicated here).
#
# Common examples:
#   ./render.sh                                # render everything (default)
#   ./render.sh OneTake                        # render OneTake onboarding compositions
#   ./render.sh NeonTextV1-LchikaOrangeJp      # render specific composition ID(s) directly
#   ./render.sh --transparent-bg NeonTextV1-…  # render with the full-screen backdrop made transparent (for alpha)

set -e  # stop on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/out"

# Settings
CONCURRENCY_LOADINGICON=4
CONCURRENCY_LOCATION=4
CONCURRENCY_MINIMAP=2
CONCURRENCY_AUDIOSPECTRUM=2
CONCURRENCY_TEXT_EFFECTS=4
NETWORK_TIMEOUT=60000
CODEC="prores"
PRORES_PROFILE="4444"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# The preview-only canvas background (composition-canvas-preview.ts) is not baked into
# renders by default. Force it back to 0 here even if REMOTION_CANVAS_BACKGROUND=1
# happens to be set in the shell already. Pass --with-canvas-bg to include it.
export REMOTION_CANVAS_BACKGROUND=0

# Make the composition's full-screen backdrop transparent (read via remotion.config's DefinePlugin by the templates)
export REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=0

# Don't forward --with-canvas-bg / --transparent-bg to npx
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

# List of locations (kept in sync with locationV1 in composition-text.example.json / composition-text.local.json)
LOCATIONS=()
while IFS= read -r line || [ -n "$line" ]; do
  if [ -n "$line" ]; then
    LOCATIONS+=("$line")
  fi
done < <(node "$SCRIPT_DIR/scripts/list-location-v1-composition-ids.cjs")

# AudioSpectrum audio file location (used only for the missing-directory warning; the actual
# composition list comes from audio-spectrum-config.ts)
AUDIOSPECTRUM_AUDIO_DIR="$SCRIPT_DIR/public/audio/AudioSpectrum"

# TextEffectsJp: representative *Jp sample per family (update only this array when adding/removing)
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

# RGB-glitch + vertical light-streak scene-transition bumper (technique modeled on the
# HUNTER x HUNTER vol. 37 PV analysis). Fixed single composition with no pattern
# variants, so it's managed here directly instead of via an AST enumeration script.
GLITCH_TRANSITION_BRIDGE_COMPOSITION_IDS=(
  "GlitchTransitionBridgeV1"
)

# Two-line eyebrow+title heading with a light-up flicker reveal. Fixed single
# composition with no pattern variants, so it's managed here directly instead of
# via an AST enumeration script.
FLICKER_TITLE_COMPOSITION_IDS=(
  "FlickerTitleV1"
)

# For colored output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🎬 Remotion Composition Rendering Script${NC}"
echo "Output directory: $OUTPUT_DIR"
echo ""

# Derive the relative path matching Root.tsx's <Folder> nesting from comp_id, so the
# out/ directory layout mirrors the Studio folder hierarchy. IDs that match nothing
# fall back to "" (directly under OUTPUT_DIR). NeonTextRainbow's ID also matches the
# `NeonTextV1-*` prefix, so its case must be checked first. Add new Folders/compositions here too.
resolve_output_subdir() {
  local comp_id="$1"
  case "$comp_id" in
    NeonTextV1-Rainbow*) echo "Text/NeonTextRainbow" ;;
    LedTextV1-*) echo "Text/LedText" ;;
    NeonTextV1-*) echo "Text/NeonText" ;;
    SlideInCaptionV1-*) echo "Text/SlideInCaption" ;;
    GlitchTextV1-*) echo "Text/GlitchText" ;;
    WireTextV1-*) echo "Text/WireText" ;;
    LightSweepTextV1-*) echo "Text/LightSweepText" ;;
    TypewriterTextV1-*) echo "Text/TypewriterText" ;;
    ShakeTextV1-*) echo "Text/ShakeText" ;;
    ConfettiPopTextV1-*) echo "Text/ConfettiPopText" ;;
    StackedRevealTextV1-*) echo "Text/StackedRevealText" ;;
    TornNoteCaptionV1-*) echo "Text/TornNoteCaption" ;;
    FlickerTitleV1*) echo "Text/FlickerTitle" ;;
    GlitchTransitionBridgeV1*) echo "Effect/GlitchTransitionBridge" ;;
    LocationV1-*) echo "Text/Location" ;;
    MiniMapV1-*) echo "Map" ;;
    AudioSpectrumV1-*) echo "Audio" ;;
    LoadingIconV1-*) echo "Loading" ;;
    OneTake-Onboarding*) echo "OneTake/Onboarding" ;;
    OneTake-Logo*) echo "OneTake/Logo" ;;
    Background-*) echo "Background" ;;
    IntroV1) echo "Intro" ;;
    PlaceholderImageV1) echo "Placeholder" ;;
    *) echo "" ;;
  esac
}

# Build the full output path from comp_id (plus an optional filename, defaulting to
# "${comp_id}.mov"). The directory returned by resolve_output_subdir is created
# automatically by render_one_prores_mov.
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

# Render a single ProRes 4444 export.
# Args: comp_id, out_mov, [concurrency=$CONCURRENCY_TEXT_EFFECTS], [network_timeout=$NETWORK_TIMEOUT], [extra flags...]
# render_minimap (--gl=angle, longer timeout) and render_audiospectrum* (--mute-audio) just
# pass their extra flags through here, keeping the CODEC/PRORES_PROFILE export settings centralized.
# out_mov may be a nested path (e.g. out/Text/NeonText/NeonTextV1-...mov); the parent
# directory is created here if it doesn't exist.
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

# Render the Intro composition
render_intro() {
  echo -e "${YELLOW}🎬 Rendering Intro composition...${NC}"
  echo ""
  echo -e "${YELLOW}→ IntroV1${NC}"

  render_one_prores_mov "IntroV1" "$(output_path_for IntroV1 Intro.mov)" 4 || return 1
  echo -e "${GREEN}✓ Intro rendered${NC}"
  echo ""
  echo -e "${GREEN}✅ Intro composition rendered successfully!${NC}"
}

# Render OneTake compositions (IDs enumerated by scripts/list-onetake-composition-ids.cjs
# from onetake-logo-config.ts, plus the fixed Onboarding/LogoText IDs that have no pattern family)
render_onetake() {
  echo -e "${YELLOW}📱 Rendering OneTake compositions...${NC}"

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-onetake-composition-ids.cjs")

  echo ""
  echo -e "${GREEN}✅ All OneTake compositions rendered successfully!${NC}"
}

# Render Background compositions (IDs enumerated by scripts/list-background-composition-ids.cjs
# from each Background *-config.ts, plus the fixed AmbientBlurOrbs ID that has no pattern family).
# These parts are always transparent already, so --transparent-bg isn't needed.
render_background() {
  echo -e "${YELLOW}✨ Rendering Background compositions...${NC}"

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-background-composition-ids.cjs")

  echo ""
  echo -e "${GREEN}✅ All Background compositions rendered successfully!${NC}"
}

# Render GlitchTransitionBridge compositions (see GLITCH_TRANSITION_BRIDGE_COMPOSITION_IDS for the ID list)
render_glitch_transition_bridge() {
  echo -e "${YELLOW}✨ Rendering GlitchTransitionBridge compositions...${NC}"

  local comp_id
  for comp_id in "${GLITCH_TRANSITION_BRIDGE_COMPOSITION_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done

  echo ""
  echo -e "${GREEN}✅ All GlitchTransitionBridge compositions rendered successfully!${NC}"
}

# Render FlickerTitle compositions (see FLICKER_TITLE_COMPOSITION_IDS for the ID list)
render_flicker_title() {
  echo -e "${YELLOW}✨ Rendering FlickerTitle compositions...${NC}"

  local comp_id
  for comp_id in "${FLICKER_TITLE_COMPOSITION_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one_prores_mov "$comp_id" "$(output_path_for "$comp_id")" \
      || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done

  echo ""
  echo -e "${GREEN}✅ All FlickerTitle compositions rendered successfully!${NC}"
}

# Render LoadingIcon compositions (IDs enumerated by scripts/list-loading-icon-composition-ids.cjs from loading-icon-config.ts)
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

# Render Location compositions
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

# Render MiniMap compositions. Target locations come from scripts/list-minimap-v1-composition-ids.cjs
# (only locations with both lat/lng set, not all of locationV1 — locations missing
# either aren't registered as compositions in Root.tsx at all, so reusing $LOCATIONS
# as-is would try to render compositions that don't exist and fail)
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

# Render AudioSpectrum compositions (preset IDs from scripts/list-audiospectrum-pattern-composition-ids.cjs)
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

# AudioSpectrum compositions, one per id registered in audioSpectrumAudioFilesV1 — same source Root uses (scripts/list-audiospectrum-file-composition-ids.cjs)
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

# LED / Neon / Glitch / Wire and other text-effect families (kept in sync between the patterns registered in Root.tsx and scripts/list-text-v1-composition-ids.cjs)
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

# Japanese sample set only (TEXT_EFFECTS_JP_SAMPLE_IDS)
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

# Pass a Remotion composition ID directly (any first argument that isn't a subcommand falls back here)
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

# Dev-time sanity check: resolve_output_subdir() is a hand-maintained mapping
# (independent from Root.tsx and from the list-*.cjs scripts), so a newly added
# family/pattern can silently land loose in out/ (or the wrong folder) if nobody
# remembers to add a case for it. This walks every composition ID the list-*.cjs
# scripts enumerate (plus the handful of fixed single-composition IDs that have no
# enumeration script) and flags any ID resolve_output_subdir() doesn't map. Run this
# after adding a new family/pattern, or any time render output lands in an
# unexpected place.
check_output_dirs() {
  echo -e "${YELLOW}🔍 Checking resolve_output_subdir() coverage...${NC}"
  echo ""

  # script:prefix pairs. list-location-v1 and list-minimap-v1 print bare location
  # IDs (not full composition IDs) — render_location/render_minimap prefix them with
  # "LocationV1-"/"MiniMapV1-" themselves, so this check must do the same.
  local list_scripts=(
    "list-text-v1-composition-ids.cjs:"
    "list-loading-icon-composition-ids.cjs:"
    "list-location-v1-composition-ids.cjs:LocationV1-"
    "list-minimap-v1-composition-ids.cjs:MiniMapV1-"
    "list-audiospectrum-pattern-composition-ids.cjs:"
    "list-audiospectrum-file-composition-ids.cjs:"
    "list-background-composition-ids.cjs:"
    "list-onetake-composition-ids.cjs:"
  )
  # Single fixed compositions with no pattern family, so no enumeration script exists.
  local fixed_ids=(
    "IntroV1"
    "PlaceholderImageV1"
    "GlitchTransitionBridgeV1"
    "FlickerTitleV1"
  )

  local raw_id comp_id subdir missing=0 checked=0 entry script prefix

  for entry in "${list_scripts[@]}"; do
    script="${entry%%:*}"
    prefix="${entry#*:}"
    while IFS= read -r raw_id || [ -n "$raw_id" ]; do
      [ -z "$raw_id" ] && continue
      comp_id="${prefix}${raw_id}"
      checked=$((checked + 1))
      subdir="$(resolve_output_subdir "$comp_id")"
      if [ -z "$subdir" ]; then
        echo -e "${RED}✗ No resolve_output_subdir() mapping for: ${comp_id} (from ${script})${NC}"
        missing=$((missing + 1))
      fi
    done < <(node "$SCRIPT_DIR/scripts/$script")
  done

  for comp_id in "${fixed_ids[@]}"; do
    checked=$((checked + 1))
    subdir="$(resolve_output_subdir "$comp_id")"
    if [ -z "$subdir" ]; then
      echo -e "${RED}✗ No resolve_output_subdir() mapping for: ${comp_id} (fixed ID)${NC}"
      missing=$((missing + 1))
    fi
  done

  echo ""
  if [ "$missing" -eq 0 ]; then
    echo -e "${GREEN}✅ All ${checked} composition IDs have an output directory mapping.${NC}"
    return 0
  fi
  echo -e "${RED}✗ ${missing} of ${checked} composition IDs have no resolve_output_subdir() mapping — add a case in resolve_output_subdir().${NC}"
  return 1
}

# Main
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
    GlitchTransitionBridge|glitchtransitionbridge)
      render_glitch_transition_bridge
      ;;
    FlickerTitle|flickertitle)
      render_flicker_title
      ;;
    all)
      render_intro
      render_loadingicon
      render_location
      render_minimap
      render_audiospectrum
      render_audiospectrum_files
      render_text_effects
      render_flicker_title
      render_onetake
      render_background
      render_glitch_transition_bridge
      ;;
    check|Check)
      check_output_dirs
      ;;
    help|-h|--help)
      echo "Usage: $0 [--with-canvas-bg] [--transparent-bg] [Intro|…|all|<CompositionId>…]"
      echo ""
      echo "  --transparent-bg   Make the full-screen backdrop & vignette transparent (doesn't bake in *-config colors like Neon's)"
      echo "  --with-canvas-bg   Include the preview-only background layer (always off unless passed)"
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
      echo "  GlitchTransitionBridge  Render the RGB-glitch scene-transition bumper"
      echo "  FlickerTitle       Render the eyebrow+title flicker-reveal composition"
      echo "  all                Render all compositions (default)"
      echo "  check              Verify every enumerated composition ID has a resolve_output_subdir() mapping (no rendering)"
      echo "  <CompositionId>    e.g. NeonTextV1-LchikaOrangeJp (multiple allowed; must match the ID shown in Studio)"
      exit 0
      ;;
    *)
      render_explicit_compositions "$@"
      ;;
  esac
}

main "$@"
