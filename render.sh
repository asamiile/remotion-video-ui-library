#!/bin/bash

# Remotion composition rendering script
#
# Source of truth for enumeration: pattern-based compositions come from each
# src/**/*.schema.ts (scripts list-*.cjs reads the keys via TypeScript AST).
# Locations come from the location key in config/local/composition-text.local.json
# (falls back to example if absent). The *Patterns in composition-text.local.json only
# override defaultProps at runtime — adding a new composition ID still requires
# registering it in .schema.ts and Root.tsx (JSON alone won't add one).
#
# Usage: chmod +x render.sh, then see ./render.sh help
# (the subcommand list there is authoritative — not duplicated here).
#
# Common examples:
#   ./render.sh                                # render everything (default)
#   ./render.sh OneTake                        # render OneTake onboarding compositions
#   ./render.sh NeonText-LchikaOrangeJp      # render specific composition ID(s) directly
#   ./render.sh --png-sequence CodeStreamVertical # render a PNG image sequence instead of MP4

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
OUTPUT_FORMAT="mp4"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# The preview-only canvas background (composition-canvas-preview.ts) is not baked into
# renders by default. Force it back to 0 here even if REMOTION_CANVAS_BACKGROUND=1
# happens to be set in the shell already. Pass --with-canvas-bg to include it.
export REMOTION_CANVAS_BACKGROUND=0

# Make the composition's full-screen backdrop transparent (read via remotion.config's DefinePlugin by the templates)
export REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=0
export REMOTION_STANDARD_EXPORT=1
export REMOTION_ADOBE_STOCK_EXPORT=0

# Don't forward render.sh-only options to npx.
FILTERED_ARGS=()
for arg in "$@"; do
  if [ "$arg" = "--with-canvas-bg" ]; then
    export REMOTION_CANVAS_BACKGROUND=1
  elif [ "$arg" = "--transparent-bg" ]; then
    export REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1
  elif [ "$arg" = "--png-sequence" ]; then
    OUTPUT_FORMAT="png"
  elif [ "$arg" = "--adobe-stock-alpha" ]; then
    OUTPUT_FORMAT="stock-alpha"
    export REMOTION_TRANSPARENT_COMPOSITION_BACKDROP=1
    export REMOTION_ADOBE_STOCK_EXPORT=1
  elif [ "$arg" = "--adobe-stock" ]; then
    OUTPUT_FORMAT="stock"
    export REMOTION_ADOBE_STOCK_EXPORT=1
  else
    FILTERED_ARGS+=("$arg")
  fi
done
set -- "${FILTERED_ARGS[@]}"

# List of locations (kept in sync with location in composition-text.example.json / composition-text.local.json)
LOCATIONS=()
while IFS= read -r line || [ -n "$line" ]; do
  if [ -n "$line" ]; then
    LOCATIONS+=("$line")
  fi
done < <(node "$SCRIPT_DIR/scripts/list-location-composition-ids.cjs")

TEXT_EFFECTS_JP_SAMPLE_IDS=(
  "NeonText-LchikaOrangeJp"
  "SlideInCaption-RefWhiteJp"
  "GlitchText-HarshSignalJp"
  "WireText-TraceJp"
  "NeonText-RainbowRoundedTubeJp"
  "LightSweepText-RapidJp"
  "TypewriterText-JpComment"
  "ShakeText-TrialJp"
  "ConfettiPopText-RichPopJp"
)

GLITCH_TRANSITION_BRIDGE_COMPOSITION_IDS=(
  "GlitchTransitionBridge"
)

DOTTED_LINE_MARKER_TEXT_TRANSITION_COMPOSITION_IDS=(
  "DottedLineMarkerText-GlitchHandover"
)

FLICKER_TITLE_COMPOSITION_IDS=(
  "FlickerTitle"
)

INK_RIPPLE_TRANSITION_COMPOSITION_IDS=(
  "InkRippleTransition"
)

RACK_FOCUS_BOKEH_TRANSITION_COMPOSITION_IDS=(
  "RackFocusBokehTransition"
)

BURST_COMPOSITION_IDS=(
  "Burst"
)

SHATTER_CRACK_TRANSITION_COMPOSITION_IDS=(
  "ShatterCrackTransition"
)

ZOOM_BLUR_TRANSITION_COMPOSITION_IDS=(
  "ZoomBlurTransition"
)

SCI_FI_OVERLAY_COMPOSITION_IDS=(
  "TacticalScanOverlay"
  "SignalInterferenceOverlay"
  "DataAcquisitionLines"
  "HolographicNoiseOverlay"
  "ReticleTrackingOverlay"
  "CinematicDiagnosticFrame"
  "VolumetricGridOverlay"
  "DigitalDebrisOverlay"
  "BiometricScanOverlay"
  "QuantumParticleOverlay"
)

TEXTLESS_SCI_FI_OVERLAY_COMPOSITION_IDS=(
  "ScannerSweepOverlay"
  "ChromaticSignalTear"
  "CircuitTracePulse"
  "HologramDepthSlices"
  "TargetBracketSwarm"
  "PerspectiveGridPulse"
  "EnergyContourLines"
  "GlitchBlockDisplacement"
  "ParticleConnectionField"
  "LensSensorArtifacts"
  "VolumetricLightScan"
  "DigitalFragmentDrift"
  "PlasmaEdgeArc"
  "RadialInterfacePulse"
  "CompressionNoiseBurst"
  "SyntheticFilmGrain"
  "RefractiveWaveDistortion"
  "ApertureIrisOverlay"
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
# `NeonText-*` prefix, so its case must be checked first. Add new Folders/compositions here too.
resolve_output_subdir() {
  local comp_id="$1"
  case "$comp_id" in
    NeonText-Rainbow*) echo "Text/NeonTextRainbow" ;;
    LedText-*) echo "Text/LedText" ;;
    NeonText-*) echo "Text/NeonText" ;;
    SlideInCaption-*) echo "Text/SlideInCaption" ;;
    GlitchText-*) echo "Text/GlitchText" ;;
    WireText-*) echo "Text/WireText" ;;
    LightSweepText-*) echo "Text/LightSweepText" ;;
    TypewriterText-*) echo "Text/TypewriterText" ;;
    ShakeText-*) echo "Text/ShakeText" ;;
    ConfettiPopText-*) echo "Text/ConfettiPopText" ;;
    StackedRevealText-*) echo "Text/StackedRevealText" ;;
    TornNoteCaption-*) echo "Text/TornNoteCaption" ;;
    DistressedTitleCard-*) echo "Text/DistressedTitleCard" ;;
    SprayPaintText-*) echo "Text/SprayPaintText" ;;
    ChromaticLogoText-*) echo "Text/ChromaticLogoText" ;;
    RubyWordplayText-*) echo "Text/RubyWordplayText" ;;
    PedigreeCreditText-*) echo "Text/PedigreeCreditText" ;;
    ChapterTitleCard-*) echo "Text/ChapterTitleCard" ;;
    DiegeticMaterialCredit-*) echo "Text/DiegeticMaterialCredit" ;;
    CinematicPresentsCredit-*) echo "Text/CinematicPresentsCredit" ;;
    InterviewQuestionCaption-*) echo "Text/InterviewQuestionCaption" ;;
    AnnouncementEndCard-*) echo "Text/AnnouncementEndCard" ;;
    EmergingNoiseTitle-*) echo "Text/EmergingNoiseTitle" ;;
    DottedLineMarkerText-GlitchHandover) echo "Text/DottedLineMarkerText" ;;
    FlickerTitle*) echo "Text/FlickerTitle" ;;
    GlitchTransitionBridge) echo "Effect/Transition/GlitchSignal/GlitchTransitionBridge" ;;
    SignalSliceTransition-*) echo "Effect/Transition/GlitchSignal/SignalSliceTransition" ;;
    PhaseDesyncTransition|PacketLossCascadeTransition|SignalFoldTransition) echo "Effect/Transition/GlitchSignal" ;;
    LidarDepthGateTransition|VectorLockTransition|DiagnosticCurtainTransition) echo "Effect/Transition/ScanControl" ;;
    HologramFragmentTransition-*) echo "Effect/Transition/HologramParticle/HologramFragmentTransition" ;;
    VoxelMaterializeTransition|QuantumDustTunnelTransition|HolographicMembraneTransition) echo "Effect/Transition/HologramParticle" ;;
    BloomFlashTransition-*) echo "Effect/Transition/OpticalEnergy/BloomFlashTransition" ;;
    RackFocusBokehTransition) echo "Effect/Transition/OpticalEnergy/RackFocusBokehTransition" ;;
    PhotonShearTransition|PlasmaVeilTransition|NeutrinoFlashRingTransition) echo "Effect/Transition/OpticalEnergy" ;;
    InkRippleTransition) echo "Effect/Transition/SpatialWarp/InkRippleTransition" ;;
    ShatterCrackTransition) echo "Effect/Transition/SpatialWarp/ShatterCrackTransition" ;;
    ZoomBlurTransition) echo "Effect/Transition/SpatialWarp/ZoomBlurTransition" ;;
    GravityLensTransition|HyperplaneFlipTransition|SpatialSeamTransition) echo "Effect/Transition/SpatialWarp" ;;
    DataCellAuthorizationTransition|NeuralRouteTransition|CoordinateRemapTransition) echo "Effect/Transition/DataUI" ;;
    TacticalScanOverlay|SignalInterferenceOverlay|DataAcquisitionLines|HolographicNoiseOverlay|ReticleTrackingOverlay|CinematicDiagnosticFrame|VolumetricGridOverlay|DigitalDebrisOverlay|BiometricScanOverlay|QuantumParticleOverlay) echo "Effect/Overlay/SciFi" ;;
    ScannerSweepOverlay|ChromaticSignalTear|CircuitTracePulse|HologramDepthSlices|TargetBracketSwarm|PerspectiveGridPulse|EnergyContourLines|GlitchBlockDisplacement|ParticleConnectionField|LensSensorArtifacts|VolumetricLightScan|DigitalFragmentDrift|PlasmaEdgeArc|RadialInterfacePulse|CompressionNoiseBurst|SyntheticFilmGrain|RefractiveWaveDistortion|ApertureIrisOverlay) echo "Effect/Overlay/TextlessSciFi" ;;
    Burst) echo "Effect/Stylize/Burst" ;;
    DelayTrail-*) echo "Effect/Stylize/Trail" ;;
    KaleidoscopeMirror-*) echo "Effect/Stylize/Mirror" ;;
    BattleCalloutBanner-*) echo "UI/BattleCalloutBanner" ;;
    AsymmetricStatusPanel-*) echo "UI/AsymmetricStatusPanel" ;;
    FramedFootageWindow-*) echo "UI/FramedFootageWindow" ;;
    LowerThirdTopicLabel-*) echo "UI/LowerThirdTopicLabel" ;;
    CircularNeonLogoFrame-*) echo "UI/CircularNeonLogoFrame" ;;
    WaveAnnouncementBanner-*) echo "UI/WaveAnnouncementBanner" ;;
    RadialAnalysisHUD-*) echo "UI/RadialAnalysisHUD" ;;
    SplitScreenEcho-*) echo "UI/SplitScreenEcho" ;;
    ParallaxAnalysisStack-*) echo "UI/ParallaxAnalysisStack" ;;
    Location-*) echo "Text/Location" ;;
    MiniMap-*) echo "Map" ;;
    AudioSpectrum-*) echo "Audio/AudioSpectrum/Presets" ;;
    LoadingIcon-*) echo "Loading" ;;
    CodeStreamHorizontal|CodeStreamVertical) echo "Text/CodeStream" ;;
    OneTake-LogoText) echo "Text/FlickerTitle" ;;
    DottedLineMarkerText-*) echo "Text/DottedLineMarkerText" ;;
    GlitchTextRandom-*) echo "Text/GlitchText" ;;
    OneTake-Onboarding*) echo "Motion/OneTake/Onboarding" ;;
    OneTake-Logo*) echo "Logo/OneTake" ;;
    RandomLinesBackground-*) echo "Background/RandomLines" ;;
    Background-ScanLine-*) echo "Background/ScanLine" ;;
    Background-DuotoneGradeOverlay-*) echo "Background/DuotoneGradeOverlay" ;;
    Background-FilmGrainOverlay-*) echo "Background/FilmGrainOverlay" ;;
    Background-LetterboxOverlay-*) echo "Background/LetterboxOverlay" ;;
    Background-PosterizeGradeOverlay-*) echo "Background/PosterizeGradeOverlay" ;;
    Background-EmblemMontageBlur-*) echo "Background/EmblemMontageBlur" ;;
    Background-SunsetLensFlareOverlay-*) echo "Background/SunsetLensFlareOverlay" ;;
    Background-AgedParchmentOverlay-*) echo "Background/AgedParchmentOverlay" ;;
    Background-StarfieldPlanetSilhouette-*) echo "Background/StarfieldPlanetSilhouette" ;;
    Background-SilhouetteDreamBackdrop-*) echo "Background/SilhouetteDreamBackdrop" ;;
    Background-CodeNoiseWall-*) echo "Background/CodeNoiseWall" ;;
    Background-ParticleTerrainMesh-*) echo "Background/ParticleTerrainMesh" ;;
    Background-InterlaceGlowBand-*) echo "Background/InterlaceGlowBand" ;;
    Background-WaveInterferenceLines-*) echo "Background/WaveInterferenceLines" ;;
    Background-StripeWaveField-*) echo "Background/StripeWaveField" ;;
    Background-HalftoneWaveform-*) echo "Background/HalftoneWaveform" ;;
    Background-HolographicDepthGrid-*) echo "Background/HolographicDepthGrid" ;;
    Background-SignalInterferenceOverlay-*) echo "Background/SignalInterferenceOverlay" ;;
    Background-WireframeBuild-*) echo "Background/WireframeBuild" ;;
    Background-DigitalFog-*) echo "Background/DigitalFog" ;;
    AngstAnimation*) echo "Background/AngstAnimation" ;;
    Background-*) echo "Background" ;;
    Intro) echo "Intro" ;;
    PlaceholderImage) echo "Placeholder" ;;
    *) echo "" ;;
  esac
}

# Build the full output path from comp_id. Every export lives in a
# composition-specific directory below the folder matching Studio's Folder nesting:
#   out/<Studio folders>/<CompositionId>/<CompositionId>.mp4|mov
#   out/<Studio folders>/<CompositionId>/png/*.png
output_path_for() {
  local comp_id="$1"
  local subdir
  local composition_dir
  subdir="$(resolve_output_subdir "$comp_id")"
  if [ -z "$subdir" ]; then
    echo -e "${RED}✗ No output directory mapping for: ${comp_id}${NC}" >&2
    return 1
  fi
  if [ "${subdir##*/}" = "$comp_id" ]; then
    composition_dir="$OUTPUT_DIR/$subdir"
  else
    composition_dir="$OUTPUT_DIR/$subdir/$comp_id"
  fi
  if [ "$OUTPUT_FORMAT" = "png" ]; then
    echo "$composition_dir/png"
  elif [ "$OUTPUT_FORMAT" = "stock-alpha" ]; then
    echo "$composition_dir/${comp_id}-alpha.mov"
  elif [ "$OUTPUT_FORMAT" = "stock" ]; then
    echo "$composition_dir/${comp_id}-60s.mov"
  else
    echo "$composition_dir/$comp_id.mp4"
  fi
}

# Render a single MP4 or PNG sequence export.
# Args: comp_id, output_path, [concurrency=$CONCURRENCY_TEXT_EFFECTS], [network_timeout=$NETWORK_TIMEOUT], [extra flags...]
# render_minimap (--gl=angle, longer timeout) and render_audiospectrum (--mute-audio)
# pass their extra flags through here.
render_one() {
  local comp_id="$1"
  local output_path="$2"
  local cc="${3:-$CONCURRENCY_TEXT_EFFECTS}"
  local timeout="${4:-$NETWORK_TIMEOUT}"
  local shift_n=4
  [ "$#" -lt "$shift_n" ] && shift_n="$#"
  shift "$shift_n"
  if [ "$OUTPUT_FORMAT" = "mp4" ] && [ -f "$output_path" ]; then
    echo -e "${GREEN}↷ ${comp_id} already exists; skipping${NC}"
    return 0
  fi
  mkdir -p "$(dirname "$output_path")"
  local codec_args=(--codec=h264)
  if [ "$OUTPUT_FORMAT" = "png" ]; then
    codec_args=(--sequence --image-format=png)
    mkdir -p "$output_path"
  elif [ "$OUTPUT_FORMAT" = "stock-alpha" ]; then
    codec_args=(--codec=prores --prores-profile=4444 --image-format=png --pixel-format=yuva444p10le --muted)
  elif [ "$OUTPUT_FORMAT" = "stock" ]; then
    codec_args=(--codec=prores --prores-profile=hq --pixel-format=yuv422p10le --muted)
  fi
  npx remotion render src/index.ts "$comp_id" "$output_path" \
    --concurrency="$cc" \
    --network-timeout="$timeout" \
    "${codec_args[@]}" \
    "$@" \
    || {
      echo -e "${RED}✗ Failed to render ${comp_id}${NC}"
      return 1
    }
}

# Render a fixed composition ID (pattern: fixed ID array, single render per ID)
# Args: label (emoji + text), array_name (e.g., GLITCH_TRANSITION_BRIDGE_COMPOSITION_IDS)
render_fixed_id_family() {
  local label="$1"
  local array_name="$2"
  # Get array values via indirect expansion
  local array=("${!array_name}")

  echo -e "${YELLOW}${label}...${NC}"

  local comp_id
  for comp_id in "${array[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"
    render_one "$comp_id" "$(output_path_for "$comp_id")" || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done

  echo ""
  echo -e "${GREEN}✅ ${label%\.\.\.*} rendered successfully!${NC}"
}

# Render compositions from a Node enumeration script
# Args: label (emoji + text), script_path (relative to SCRIPT_DIR)
render_from_list_script() {
  local label="$1"
  local script="$2"

  echo -e "${YELLOW}${label}...${NC}"

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"
    render_one "$comp_id" "$(output_path_for "$comp_id")" || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done < <(node "$SCRIPT_DIR/$script")

  echo ""
  echo -e "${GREEN}✅ ${label%\.\.\.*} rendered successfully!${NC}"
}

# Render the Intro composition
render_intro() {
  echo -e "${YELLOW}🎬 Rendering Intro composition...${NC}"
  echo ""
  echo -e "${YELLOW}→ Intro${NC}"

  render_one "Intro" "$(output_path_for Intro)" 4 || return 1
  echo -e "${GREEN}✓ Intro rendered${NC}"
  echo ""
  echo -e "${GREEN}✅ Intro composition rendered successfully!${NC}"
}

# Render OneTake compositions (IDs enumerated by scripts/list-onetake-composition-ids.cjs)
render_onetake() {
  render_from_list_script "📱 Rendering OneTake compositions" "scripts/list-onetake-composition-ids.cjs"
}

# Render Background compositions (IDs enumerated by scripts/list-background-composition-ids.cjs).
# These parts are always transparent already, so --transparent-bg isn't needed.
render_background() {
  render_from_list_script "✨ Rendering Background compositions" "scripts/list-background-composition-ids.cjs"
}

# Render GlitchTransitionBridge compositions
render_glitch_transition_bridge() {
  render_fixed_id_family "✨ Rendering GlitchTransitionBridge compositions" GLITCH_TRANSITION_BRIDGE_COMPOSITION_IDS
}

# Render the DottedLineMarkerText 01→02 glitch-handover composition
render_dotted_line_marker_text_transition() {
  render_fixed_id_family "✨ Rendering DottedLineMarkerText transition composition" DOTTED_LINE_MARKER_TEXT_TRANSITION_COMPOSITION_IDS
}

# Render InkRippleTransition compositions
render_ink_ripple_transition() {
  render_fixed_id_family "✨ Rendering InkRippleTransition compositions" INK_RIPPLE_TRANSITION_COMPOSITION_IDS
}

# Render RackFocusBokehTransition compositions
render_rack_focus_bokeh_transition() {
  render_fixed_id_family "✨ Rendering RackFocusBokehTransition compositions" RACK_FOCUS_BOKEH_TRANSITION_COMPOSITION_IDS
}

# Render Burst compositions
render_burst() {
  render_fixed_id_family "✨ Rendering Burst compositions" BURST_COMPOSITION_IDS
}

# Render ShatterCrackTransition compositions
render_shatter_crack_transition() {
  render_fixed_id_family "✨ Rendering ShatterCrackTransition compositions" SHATTER_CRACK_TRANSITION_COMPOSITION_IDS
}

# Render ZoomBlurTransition compositions
render_zoom_blur_transition() {
  render_fixed_id_family "✨ Rendering ZoomBlurTransition compositions" ZOOM_BLUR_TRANSITION_COMPOSITION_IDS
}

render_new_effects() {
  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    case "$comp_id" in SignalSliceTransition-*|HologramFragmentTransition-*|KaleidoscopeMirror-*|DelayTrail-*|BloomFlashTransition-*|PhaseDesyncTransition|PacketLossCascadeTransition|SignalFoldTransition|LidarDepthGateTransition|VectorLockTransition|DiagnosticCurtainTransition|VoxelMaterializeTransition|QuantumDustTunnelTransition|HolographicMembraneTransition|PhotonShearTransition|PlasmaVeilTransition|NeutrinoFlashRingTransition|GravityLensTransition|HyperplaneFlipTransition|SpatialSeamTransition|DataCellAuthorizationTransition|NeuralRouteTransition|CoordinateRemapTransition) render_one "$comp_id" "$(output_path_for "$comp_id")" || return 1 ;; esac
  done < <(node "$SCRIPT_DIR/scripts/list-effect-composition-ids.cjs")
}

render_sci_fi_overlays() {
  echo -e "${YELLOW}✨ Rendering transparent sci-fi overlays...${NC}"
  local comp_id
  for comp_id in "${SCI_FI_OVERLAY_COMPOSITION_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"
    render_one "$comp_id" "$(output_path_for "$comp_id")" || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done
  echo ""
  echo -e "${GREEN}✅ Transparent sci-fi overlays rendered successfully!${NC}"
}

render_textless_sci_fi_overlays() {
  echo -e "${YELLOW}✨ Rendering textless sci-fi overlays...${NC}"
  local comp_id
  for comp_id in "${TEXTLESS_SCI_FI_OVERLAY_COMPOSITION_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"
    render_one "$comp_id" "$(output_path_for "$comp_id")" || return 1
    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done
  echo ""
  echo -e "${GREEN}✅ Textless sci-fi overlays rendered successfully!${NC}"
}

# Render UI compositions (IDs enumerated by scripts/list-ui-composition-ids.cjs)
render_ui() {
  render_from_list_script "✨ Rendering UI compositions" "scripts/list-ui-composition-ids.cjs"
}

# Render FlickerTitle compositions
render_flicker_title() {
  render_fixed_id_family "✨ Rendering FlickerTitle compositions" FLICKER_TITLE_COMPOSITION_IDS
}

# Render LoadingIcon compositions (IDs enumerated by scripts/list-loading-icon-composition-ids.cjs from loading-icon-config.ts)
render_loadingicon() {
  echo -e "${YELLOW}⏳ Rendering LoadingIcon compositions...${NC}"

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one "$comp_id" "$(output_path_for "$comp_id")" "$CONCURRENCY_LOADINGICON" \
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
    
    render_one \
      "Location-${location}" \
      "$(output_path_for "Location-${location}")" \
      "$CONCURRENCY_LOCATION" \
      || return 1
    
    echo -e "${GREEN}✓ Location-${location} rendered${NC}"
  done
  
  echo ""
  echo -e "${GREEN}✅ All Location compositions rendered successfully!${NC}"
}

# Render MiniMap compositions. Target locations come from scripts/list-minimap-composition-ids.cjs
# (only locations with both lat/lng set, not all of location — locations missing
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

    if ! render_one \
      "MiniMap-${location}" \
      "$(output_path_for "MiniMap-${location}")" \
      "$CONCURRENCY_MINIMAP" \
      120000 \
      --gl=angle; then
      echo -e "${YELLOW}💡 This is expected if WebGL is not available${NC}"
      return 1
    fi

    echo -e "${GREEN}✓ MiniMap-${location} rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-minimap-composition-ids.cjs")

  if [ "$has_any" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No locations have latitude/longitude set in mapLocationPoints — nothing to render${NC}"
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

  local comp_id
  while IFS= read -r comp_id || [ -n "$comp_id" ]; do
    [ -z "$comp_id" ] && continue
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one "$comp_id" "$(output_path_for "$comp_id")" \
      "$CONCURRENCY_AUDIOSPECTRUM" "$NETWORK_TIMEOUT" --mute-audio \
      || return 1

    echo -e "${GREEN}✓ ${comp_id} rendered${NC}"
  done < <(node "$SCRIPT_DIR/scripts/list-audiospectrum-pattern-composition-ids.cjs")

  echo ""
  echo -e "${GREEN}✅ All AudioSpectrum compositions rendered successfully!${NC}"
}

# LED / Neon / Glitch / Wire and other text-effect families
render_text_effects() {
  render_from_list_script "✨ Rendering text-effect compositions (Led / Neon / Glitch / …)" "scripts/list-text-composition-ids.cjs"
}

# Japanese sample set only (TEXT_EFFECTS_JP_SAMPLE_IDS)
render_text_effects_jp_samples() {
  echo -e "${YELLOW}🇯🇵 Rendering JP text-effect sample compositions (${#TEXT_EFFECTS_JP_SAMPLE_IDS[@]} items)…${NC}"

  local comp_id
  for comp_id in "${TEXT_EFFECTS_JP_SAMPLE_IDS[@]}"; do
    echo ""
    echo -e "${YELLOW}→ ${comp_id}${NC}"

    render_one "$comp_id" "$(output_path_for "$comp_id")" \
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

    render_one "$comp_id" "$(output_path_for "$comp_id")" \
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

  # script:prefix pairs. list-location and list-minimap print bare location
  # IDs (not full composition IDs) — render_location/render_minimap prefix them with
  # "Location-"/"MiniMap-" themselves, so this check must do the same.
  local list_scripts=(
    "list-text-composition-ids.cjs:"
    "list-loading-icon-composition-ids.cjs:"
    "list-location-composition-ids.cjs:Location-"
    "list-minimap-composition-ids.cjs:MiniMap-"
    "list-audiospectrum-pattern-composition-ids.cjs:"
    "list-background-composition-ids.cjs:"
    "list-onetake-composition-ids.cjs:"
    "list-ui-composition-ids.cjs:"
    "list-effect-composition-ids.cjs:"
  )
  # Single fixed compositions with no pattern family, so no enumeration script exists.
  local fixed_ids=(
    "Intro"
    "PlaceholderImage"
    "GlitchTransitionBridge"
    "InkRippleTransition"
    "RackFocusBokehTransition"
    "Burst"
    "ShatterCrackTransition"
    "ZoomBlurTransition"
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
    DottedLineMarkerTextTransition|dottedlinemarkertexttransition)
      render_dotted_line_marker_text_transition
      ;;
    InkRippleTransition|inkrippletransition)
      render_ink_ripple_transition
      ;;
    RackFocusBokehTransition|rackfocusbokehtransition)
      render_rack_focus_bokeh_transition
      ;;
    Burst|burst)
      render_burst
      ;;
    ShatterCrackTransition|shattercracktransition)
      render_shatter_crack_transition
      ;;
    ZoomBlurTransition|zoomblurtransition)
      render_zoom_blur_transition
      ;;
    SciFiOverlay|scifioverlay)
      render_sci_fi_overlays
      ;;
    TextlessSciFiOverlay|textlessscifioverlay)
      render_textless_sci_fi_overlays
      ;;
    UI|ui)
      render_ui
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
      render_text_effects
      render_onetake
      render_background
      render_glitch_transition_bridge
      render_ink_ripple_transition
      render_rack_focus_bokeh_transition
      render_burst
      render_shatter_crack_transition
      render_zoom_blur_transition
      render_new_effects
      render_sci_fi_overlays
      render_textless_sci_fi_overlays
      render_ui
      render_explicit_compositions PlaceholderImage
      ;;
    check|Check)
      check_output_dirs
      ;;
    help|-h|--help)
      echo "Usage: $0 [--with-canvas-bg] [--transparent-bg] [--png-sequence|--adobe-stock-alpha|--adobe-stock] [Intro|…|all|<CompositionId>…]"
      echo ""
      echo "  --transparent-bg   Make the full-screen backdrop & vignette transparent (doesn't bake in *-config colors like Neon's)"
      echo "  --with-canvas-bg   Include the preview-only background layer (always off unless passed)"
      echo "  --png-sequence     Export PNG frames instead of the default H.264 MP4"
      echo "  --adobe-stock-alpha Export transparent ProRes 4444 MOV; applies Stock duration overrides"
      echo "  --adobe-stock      Export ProRes 422 HQ MOV without audio; selected backgrounds become 60 seconds"
      echo "  Intro              Render Intro composition"
      echo "  LoadingIcon        Render all LoadingIcon compositions"
      echo "  Location           Render all Location compositions"
      echo "  MiniMap            Render all MiniMap compositions (WebGL required)"
      echo "  AudioSpectrum      Render all AudioSpectrum pattern compositions"
      echo "  TextEffects        Render Led/Neon/Glitch/Wire/… pattern compositions"
      echo "  TextEffectsJp      Render fixed JP sample set (see TEXT_EFFECTS_JP_SAMPLE_IDS)"
      echo "  OneTake            Render OneTake onboarding motion-graphic compositions"
      echo "  Background         Render ambient background overlay compositions (always transparent)"
      echo "  GlitchTransitionBridge  Render the RGB-glitch scene-transition bumper"
      echo "  DottedLineMarkerTextTransition  Render the DottedLineMarkerText 01→02 glitch-handover composition"
      echo "  InkRippleTransition     Render the ink-brush ripple scene-transition bumper"
      echo "  RackFocusBokehTransition Render the rack-focus + bokeh scene-transition bumper"
      echo "  Burst              Render the special-move impact burst"
      echo "  ShatterCrackTransition  Render the radiating glass-crack scene-transition bumper"
      echo "  ZoomBlurTransition Render the zoom+motion-blur dissolve scene-transition bumper"
      echo "  SciFiOverlay       Render all transparent sci-fi video overlay effects"
      echo "  TextlessSciFiOverlay Render all transparent textless sci-fi overlay effects"
      echo "  UI                 Render game-style UI chrome mockups (callout banner, status panel, framed window, lower-third label)"
      echo "  FlickerTitle       Render the eyebrow+title flicker-reveal composition"
      echo "  all                Render all compositions (default)"
      echo "  check              Verify every enumerated composition ID has a resolve_output_subdir() mapping (no rendering)"
      echo "  <CompositionId>    e.g. NeonText-LchikaOrangeJp (multiple allowed; must match the ID shown in Studio)"
      exit 0
      ;;
    *)
      render_explicit_compositions "$@"
      ;;
  esac
}

main "$@"
