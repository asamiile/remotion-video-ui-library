---
name: machine-vision
description: >-
  Computer-vision look: the world as a machine perceives it (detection boxes,
  LiDAR point clouds, perception passes). Read before building or restyling a
  machine-vision composition.
alwaysApply: false
---

# Machine Vision

The subject is **what the computer is looking at**, shown the way the machine represents it, not the machine's eye itself. Clean line work and glow, false-color passes, monospace readouts, mechanical motion.

There is no dedicated category; each piece sits in the category that matches its role:

- Full-frame loops: `src/Background/LidarPointCloud/`, `SceneUnderstanding/`, `OpticalFlow/`, `ThermalDrone/`, `PoseEstimation/` (Studio `Background/*`, IDs `Background-<Name>-<Pattern>`).
- Transparent overlay: `src/Effects/Overlay/ObjectDetectionOverlay/` (Studio `Effect/Overlay`).
- Filter over footage: `src/Effects/Stylize/FootagePass/` (Studio `Effect/Stylize`).

The 3D compositions share a procedural street scene in `src/helpers/shader/glsl/street-scene.ts` (road, sidewalks, buildings, poles, trees, traffic, pedestrians, the ego car, chase camera, camera-like shading and the segmentation palette).

| Composition | Role | Rendering |
|---|---|---|
| `ObjectDetectionOverlay` | Transparent overlay for footage: tracked bounding boxes with labels and confidence, one target lock, grid, scan line, stats. Seamless loop. | SVG |
| `LidarPointCloud` | A spinning LiDAR's view of a city street from a car: laser rings, real occlusion shadows, range/height coloring, 3D detection boxes, range grid. Seamless loop. | WebGL raymarch (`--gl=angle`) |
| `SceneUnderstanding` | The same street wiped through perception passes: camera, 3D detection, semantic segmentation, depth, surface normals, edge map. Seamless loop. | WebGL raymarch (`--gl=angle`) |
| `OpticalFlow` | Dense optical flow of the street, computed exactly (velocity minus camera motion, re-projected) and shown with the standard flow color wheel and/or an arrow grid. Seamless loop. | WebGL raymarch (`--gl=angle`) |
| `ThermalDrone` | Overhead drone thermal view of the street: hot people and running engines, sun-warmed asphalt, white-hot / black-hot / ironbow palettes, auto-tracking brackets, flight HUD. Seamless loop. | WebGL raymarch (`--gl=angle`) |
| `PoseEstimation` | Mannequin figures (walk, wave, jump, squat, dance) with COCO 17-keypoint skeletons, boxes and motion trails; a skeleton-only transparent overlay too. Seamless loop. | SVG |
| `FootagePass` | Passes over the user's own image or video (`src` under `public/`), or the street as a demo: edges, thermal, color-class segmentation, attention heatmap, 3x3 feature-map mosaic, with a wipe in and out. | WebGL (`--gl=angle`) |

## Rejected

- **Machine eyes** (a camera-like eye, an iris biometric scan): rejected in review. The piece should show the target of the machine's gaze, not the eye.

## Color roles

- **Primary** (boxes, lines, HUD): one saturated hue per pattern. Approved: green `#39ff88`, cyan `#4fd8ff`, amber `#ffb02e`, pink `#ff4fd8`, plain white `#f2f2f2` for a minimal look.
- **Lock / emphasis**: a contrasting hue for the single thing that matters (target lock). Red or amber against green/cyan.
- **Data colormaps**: turbo for LiDAR range, a magma-like ramp for depth (near = bright), the standard street-scene segmentation palette (road purple, sidewalk magenta, building gray, vegetation olive, car navy, person crimson, sky steel blue) so it reads as real model output, the flow color wheel (hue = direction, saturation = speed), ironbow / white-hot for thermal, jet for attention.
- **Pose skeletons**: a rainbow per limb (head magenta → arms orange/green → legs blue/violet), white keypoint dots.
- **Background**: `transparent` for overlays, near-black (`#020305`) for point clouds.

## Motion

- Mechanical: flicker on acquisition, constant-rate scans and sweeps, eased wipes that hold.
- Loops use whole cycles of the loop phase. The street repeats every 72 units (`STREET_LOOP`) and every repeated element picks its variation from `mod(cell, count)`, so travelling a whole number of street lengths per loop is seamless; moving traffic lanes shift by whole multiples too. Pedestrians repeat every 18 units (`PERSON_LOOP`) so they can walk at a believable speed, with a whole number of strides per loop. Both constants are exported from `street-scene.ts` for the templates.
- Text uses JetBrains Mono, uppercase, letter-spaced.

## Avoid

- Real faces or identifiable people. Do not make a real photo the default `src` of FootagePass; the default is the procedural street.
- Presenting procedural data as analysis of the footage: FootagePass `attention` drifts procedurally (plus image edges); it does not detect objects.
- Repeated SDF elements evaluated in their own cell only: empty cells let the ray overshoot and leave sawtooth artifacts. Evaluate neighbors and cap the step (see `street-scene.ts`).
- Filling the frame edge to edge with HUD in overlays; leave the footage readable.

## Ideas not built yet

- SLAM: feature points and a growing map/trajectory as the camera moves.
- Face-free crowd counting: density map over the street pedestrians.
- Depth or segmentation passes driven by a real model's output video (import precomputed masks as a second `src`).
