---
description: 動画・透過MOV・PNG連番の尺、出力先、書き出し、検証ルール
alwaysApply: false
---

# Rendering

Compositionの尺を変更する、またはMP4・MOV・PNG連番を書き出すときは、このルールを適用する。

## 尺とCompositionの選択

- 通常尺と5秒版の登録・命名は [Repository Structure](./repository.md#composition-duration-and-folder-limits) に従う。演出尺が5秒未満の場合は通常尺を維持し、別途 `-5s` の5秒版を用意する。
- 尺バリエーションがある素材の末尾なしIDは通常尺版、`-5s` は正確に5秒の版（30fpsなら150フレーム）。指定されたIDの尺を維持し、書き出し形式の変更だけで通常尺を延長しない。
- 演出尺と出力尺を区別する。短いトランジションの5秒版は、本来の演出速度を保ち、中央配置と前後の透明な編集余白で延長できる。
- 延長区間でアニメーションが意図せず繰り返されたり、停止途中になったりしないようにする。

### 最短版の実装

- 最短版は演出開始・終了に必要な透明フレームを残し、余分な待機時間を除く。5秒版と演出速度・色・残像を共通にする。BloomFlashでは発光前の余白も除く。
- propsで演出尺を変更した場合は、最短版の尺も再計算する。
- 現在の実装対象はDistressTransition、ScanEchoTransition、SFトランジション18種、HologramFragmentTransition、ZoomBlurTransition、VolumetricSmokeTransition、InkBleedTransition、CodecCorruptTransition、PixelSortTransition、CrtPowerOffTransition、SuminagashiTransition、DryBrushTransition、WaterRippleTransition、PlasmaVeilShaderTransition、QuantumDustTunnelShaderTransition、BloomFlashTransition、RackFocusBokehTransition。対象の詳細は `src/composition/duration-variants.json` を参照する。この一覧は実装状況であり、新規Compositionへの適用範囲を制限するものではない。

## 書き出しと出力先

- 書き出しには `render.sh` を使用する。形式・オプション・一括出力の最新の使い方は `./render.sh help` を参照する。
- 重ね使い用の通常尺の透過MOVは `./render.sh --alpha <CompositionId...>` を使用する。ProRes 4444・PNG中間フレーム・アルファ対応ピクセル形式・音声なしで出力する。
- 重ね使い用素材の一括出力は `./render.sh --alpha overlays` を使用する。通常尺と `-5s` 版を含め、描画内容のあるフレームに透明部分が存在することを確認する。全面不透明または描画内容を確認できない素材は理由を記録して対象外とする。既存MP4を移動せず、同じCompositionフォルダに `-alpha.mov` を追加する。
- 同じCompositionフォルダーに `<CompositionId>-alpha.mov` がすでにある場合、そのCompositionのmp4は重複のため書き出さない（`render.sh` の `render_one` と `render-all.cjs` が自動でスキップする）。透過が確認できず `-alpha.mov` が存在しないCompositionや、Intro/Placeholder/Motion系などオーバーレイ対象外のCompositionは従来どおりmp4を書き出す。
- Composition自身の背景を透過させる場合は `--transparent-bg` を使用する。プレビュー用の背景を含める `--with-canvas-bg` とは区別する。
- PNG連番を依頼されている場合は `--png-sequence` で書き出す。透過素材には `--transparent-bg` も指定する。
- 出力先はStudioのFolder階層に合わせ、Composition IDごとのフォルダにまとめる。動画をカテゴリフォルダへ直接置かない。
  ```text
  out/<Studio Folder>/<CompositionId>/<CompositionId>.mp4
  out/<Studio Folder>/<CompositionId>/<CompositionId>-alpha.mov
  out/<Studio Folder>/<CompositionId>/png/*.png
  ```
- 出力フォルダーは環境変数`REMOTION_OUTPUT_DIR`で変更できる（未設定時はリポジトリの`out/`。解決処理は`scripts/lib/output-dir.cjs`と`render.sh`で共通）。以下の`out/`は出力フォルダーを指す。
- 書き出し後の動画は`REMOTION_UPLOAD_REMOTE`で指定したGoogle Driveのフォルダー（`out/`と同じ階層）へ自動で移動する。未設定ならアップロードしない。パスをコードやドキュメントにハードコードしない（`scripts/lib/drive-upload.cjs`、rclone）。検証・アップロードに失敗したものだけ`out/`に残る。Driveにある出力は既存として扱い、再書き出ししない。無効化は`REMOTION_UPLOAD=0`、既存の`out/`の一括移動は`./render.sh upload`。セットアップはREADMEを参照する。
- 書き出し後の`ffprobe`検証は、アップロードで`out/`から消える前に行う（`REMOTION_UPLOAD=0`で書き出すか、Drive上のファイルを`rclone copy`で取得して検証する）。
- 登録階層と `render.sh` の `resolve_output_subdir()` を同期し、動画とPNG連番を同じCompositionフォルダの下に保存する。
- シリーズ単位の書き出しと `all` は通常尺版・5秒版の両方を含める。

```sh
./render.sh --transparent-bg ScanEchoTransition-CyanSweep
./render.sh --alpha ScanEchoTransition-CyanSweep-5s
```

## 実行前後の確認

- フルレンダーは、ユーザーが明示的に書き出しを依頼または承認した後だけ実行する。
- 動画の実行前に `npm run lint`、`npm run build`、`./render.sh check`、`git diff --check` を通す。
- 実行後は対象動画ごとに `ffprobe` で尺・解像度・fps・コーデック・ピクセル形式が指定どおりであることを確認する。5秒版の尺は `5.000000` 秒とする。
- 透過MOVは `prores` / `4444` / `yuva*` であることを確認する。
- 対象Compositionの本数と出力ファイルの本数が一致することを確認する。PNG連番は指定範囲のフレームが揃っていることも確認する。
- レンダー中の警告は無視せず、対象Compositionの画や処理に影響するかを判断して結果を報告する。

### 尺バリエーションの検証

通常バンドルを作成した後、登録ID・尺・props変更と、両版の対応する静止画の画素一致を確認する。以下の検証スクリプトはフル動画を書き出さない。

```sh
node scripts/check-composition-layout.cjs
node scripts/verify-duration-variants.cjs
```

## Adobe Stockへの提出

- Stockには通常の書き出し（背景のある作品はMP4、透過の作品は `--alpha` の透過MOV）をそのまま提出する。Stock専用の書き出しオプションや、Stock提出時だけ尺を変える仕組みはない。
- Stockの最低尺（5秒）は作品側で満たす。新しいCompositionは5秒以上の尺で登録する。演出が5秒未満の短いトランジションは `-5s` 版を提出する。
- Adobe Stockは **1ファイル3.9GB（3900MB）を超えるとアップロードできない**。提出用のMOVは書き出し後に容量を確認する。
- 容量は尺にほぼ比例するため、3.9GBを超えても即「提出不可」とはしない。`収まる最長尺 = 3.9GB ÷ 1秒あたりの容量` を計算し、5秒以上ならその範囲にCompositionの尺を調整して書き出し直す（例：透過TvStaticは約320MB/秒のため20秒で約6.4GB、10秒なら約3.2GBで提出可）。収まる最長尺が5秒未満（約780MB/秒超）の場合だけ提出不可とし、理由を記録する。
- ループ素材の尺を縮めるとループ周期も縮み動きが速くなる。速度を保つ必要がある場合は、切り出しでループが途切れることを確認したうえで判断する。
- 提出条件について質問された場合は、Adobe公式の最新Technical Requirementsを確認する。

## 実装箇所

- 書き出しフラグ・コーデック・出力先: `render.sh`
- 環境変数のバンドル注入: `remotion.config.ts`
- 尺バリエーション: `src/composition/duration-variants.json`、`src/composition/duration-variants.ts`
- Composition登録: `src/root-*.tsx`、`src/helpers/duration-variant-compositions.tsx`
