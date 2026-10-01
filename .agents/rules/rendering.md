---
description: Duration, output location, export, and verification rules for videos, transparent MOVs, and PNG sequences
alwaysApply: false
---

# Rendering

Apply this rule when changing a Composition's duration or exporting MP4, MOV, or PNG sequences.

## Duration and Composition selection

- Register and name base-duration and 5-second versions according to [Repository Structure](./repository.md#composition-duration-and-folder-limits). When the animation is shorter than 5 seconds, keep the base duration and add a separate `-5s` 5-second version.
- For assets with duration variants, the unsuffixed ID is the base-duration version and `-5s` is the exactly-5-second version (150 frames at 30fps). Keep the duration of the requested ID; never extend the base duration just by changing the export format.
- Distinguish animation duration from output duration. The 5-second version of a short transition keeps the original animation speed and may be extended by centering it with transparent editing margins before and after.
- Make sure the animation does not unintentionally repeat or freeze midway during the extended section.

### Implementing the shortest version

- The shortest version keeps only the transparent frames needed for the animation to start and end, and removes extra idle time. Share animation speed, colors, and trails with the 5-second version. For BloomFlash, also remove the margin before the flash.
- When props change the animation duration, recalculate the shortest version's duration as well.
- Currently implemented for: DistressTransition, ScanEchoTransition, the 18 SF transitions, HologramFragmentTransition, ZoomBlurTransition, VolumetricSmokeTransition, InkBleedTransition, CodecCorruptTransition, PixelSortTransition, CrtPowerOffTransition, SuminagashiTransition, DryBrushTransition, TornPaperTransition, GrungeTransition, WaterRippleTransition, PlasmaVeilShaderTransition, QuantumDustTunnelShaderTransition, BloomFlashTransition, RackFocusBokehTransition. See `src/composition/duration-variants.json` for details. This list reflects implementation status and does not limit which new Compositions it applies to.

## Export and output location

- Use `render.sh` for exports. See `./render.sh help` for the latest formats, options, and batch export usage.
- For base-duration transparent MOVs meant for overlaying, use `./render.sh --alpha <CompositionId...>`. It outputs ProRes 4444 with PNG intermediate frames, an alpha-capable pixel format, and no audio.
- For batch export of overlay assets, use `./render.sh --alpha overlays`. Include both base-duration and `-5s` versions, and confirm that frames with drawn content contain transparent areas. Exclude assets that are fully opaque or whose drawn content cannot be confirmed, and record the reason. Do not move existing MP4s; add `-alpha.mov` to the same Composition folder.
- If `<CompositionId>-alpha.mov` already exists in the same Composition folder, do not export that Composition's mp4 because it would be a duplicate (`render_one` in `render.sh` and `render-all.cjs` skip it automatically). Compositions whose transparency cannot be confirmed and have no `-alpha.mov`, and non-overlay Compositions such as Intro/Placeholder/Motion, still export mp4 as before.
- To make a Composition's own background transparent, use `--transparent-bg`. Keep it distinct from `--with-canvas-bg`, which includes the preview background.
- When a PNG sequence is requested, export with `--png-sequence`. Also pass `--transparent-bg` for transparent assets.
- Match the output location to the Studio Folder hierarchy and group outputs into one folder per Composition ID. Do not put videos directly in category folders.
- Padded `-5s` variants do not get their own folder; they go into the base Composition's folder next to the base-duration files (e.g. `CodecCorruptTransition-GreenMagenta/CodecCorruptTransition-GreenMagenta-5s.mp4`). Their PNG sequence goes to `png-5s/`.
  ```text
  out/<Studio Folder>/<BaseId>/<BaseId>.mp4
  out/<Studio Folder>/<BaseId>/<BaseId>-alpha.mov
  out/<Studio Folder>/<BaseId>/<BaseId>-5s.mp4
  out/<Studio Folder>/<BaseId>/<BaseId>-5s-alpha.mov
  out/<Studio Folder>/<BaseId>/png/*.png
  out/<Studio Folder>/<BaseId>/png-5s/*.png
  ```
- The output folder can be changed with the `REMOTION_OUTPUT_DIR` environment variable (defaults to the repository's `out/` when unset; resolution is shared by `scripts/lib/output-dir.cjs` and `render.sh`). `out/` below refers to the output folder.
- Exported videos are automatically moved to the Google Drive folder specified by `REMOTION_UPLOAD_REMOTE` (same hierarchy as `out/`). No upload happens when it is unset. Do not hardcode the path in code or docs (`scripts/lib/drive-upload.cjs`, rclone). Only outputs that fail verification or upload remain in `out/`. Outputs already on Drive are treated as existing and are not re-exported. Disable with `REMOTION_UPLOAD=0`; move existing `out/` contents in bulk with `./render.sh upload`. See the README for setup.
- Run `ffprobe` verification after export, before the upload removes files from `out/` (export with `REMOTION_UPLOAD=0`, or fetch the file from Drive with `rclone copy` and verify it).
- Keep the registration hierarchy in sync with `resolve_output_subdir()` in `render.sh`, and save videos and PNG sequences under the same Composition folder.
- Series-level exports and `all` include both base-duration and 5-second versions.

```sh
./render.sh --transparent-bg ScanEchoTransition-CyanSweep
./render.sh --alpha ScanEchoTransition-CyanSweep-5s
```

## Checks before and after running

- Run full renders only after the user has explicitly requested or approved the export.
- Before rendering videos, pass `npm run lint`, `npm run build`, `./render.sh check`, and `git diff --check`.
- After rendering, use `ffprobe` on each target video to confirm that duration, resolution, fps, codec, and pixel format match the specification. 5-second versions must be `5.000000` seconds.
- Confirm that transparent MOVs are `prores` / `4444` / `yuva*`.
- Confirm that the number of target Compositions matches the number of output files. For PNG sequences, also confirm that all frames in the specified range are present.
- Do not ignore warnings during rendering; judge whether they affect the target Composition's image or processing, and report the result.

### Verifying duration variants

After building the normal bundle, verify registered IDs, durations, and props changes, and check pixel equality of corresponding stills between both versions. The following verification scripts do not export full videos.

```sh
node scripts/check-composition-layout.cjs
node scripts/verify-duration-variants.cjs
```

## Submitting to Adobe Stock

- Submit the normal export to Stock as-is (MP4 for works with a background, the `--alpha` transparent MOV for transparent works). There is no Stock-specific export option and no mechanism that changes duration only for Stock submission.
- Meet Stock's minimum duration (5 seconds) in the work itself. Register new Compositions with a duration of 5 seconds or longer. For short transitions whose animation is under 5 seconds, submit the `-5s` version.
- Adobe Stock **cannot upload files larger than 3.9GB (3900MB)**. Check the file size of MOVs for submission after export.
- File size is roughly proportional to duration, so exceeding 3.9GB does not immediately mean "cannot submit". Calculate `longest duration that fits = 3.9GB ÷ size per second`; if it is 5 seconds or longer, adjust the Composition's duration within that range and re-export (e.g. transparent TvStatic is about 320MB/s, so 20 seconds is about 6.4GB, while 10 seconds is about 3.2GB and can be submitted). Only when the longest duration that fits is under 5 seconds (over about 780MB/s) mark it as not submittable and record the reason.
- Shortening a loop asset also shortens its loop period and makes motion faster. If the speed must be preserved, decide only after confirming that trimming breaks the loop.
- When asked about submission requirements, check Adobe's latest official Technical Requirements.

## Implementation locations

- Export flags, codecs, output location: `render.sh`
- Bundle injection of environment variables: `remotion.config.ts`
- Duration variants: `src/composition/duration-variants.json`, `src/composition/duration-variants.ts`
- Composition registration: `src/root-*.tsx`, `src/helpers/duration-variant-compositions.tsx`
