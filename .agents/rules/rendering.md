---
description: 動画・透過MOV・PNG連番の尺、出力先、書き出し、検証ルール
alwaysApply: false
---

# Rendering

Compositionの尺を変更する、またはMP4・MOV・PNG連番を書き出すときは、このルールを適用する。

## 尺とCompositionの選択

- 通常尺と10秒版の登録・命名は [Repository Structure](./repository.md#composition-duration-and-folder-limits) に従う。通常尺が10秒以下の場合は通常尺を維持し、別途 `-10s` の10秒版を用意する。
- 尺バリエーションがある素材の末尾なしIDは通常尺版、`-10s` は正確に10秒の版（30fpsなら300フレーム）。指定されたIDの尺を維持し、書き出し形式の変更だけで通常尺を延長しない。
- 演出尺と出力尺を区別する。短いトランジションの10秒版は、本来の演出速度を保ち、中央配置と前後の透明な編集余白で延長できる。
- 延長区間でアニメーションが意図せず繰り返されたり、停止途中になったりしないようにする。

### 最短版の実装

- 最短版は演出開始・終了に必要な透明フレームを残し、余分な待機時間を除く。10秒版と演出速度・色・残像を共通にする。BloomFlashでは発光前の余白も除く。
- propsで演出尺を変更した場合は、最短版の尺も再計算する。
- 現在の実装対象はScanEchoTransition、SFトランジション18種、HologramFragmentTransition、ZoomBlurTransition、BloomFlashTransition、RackFocusBokehTransition。対象の詳細は `src/composition/duration-variants.json` を参照する。この一覧は実装状況であり、新規Compositionへの適用範囲を制限するものではない。

## 書き出しと出力先

- 書き出しには `render.sh` を使用する。形式・オプション・一括出力の最新の使い方は `./render.sh help` を参照する。
- Composition自身の背景を透過させる場合は `--transparent-bg` を使用する。プレビュー用の背景を含める `--with-canvas-bg` とは区別する。
- PNG連番を依頼されている場合は `--png-sequence` で書き出す。透過素材には `--transparent-bg` も指定する。
- 出力先はStudioのFolder階層に合わせ、Composition IDごとのフォルダにまとめる。動画をカテゴリフォルダへ直接置かない。
  ```text
  out/<Studio Folder>/<CompositionId>/<CompositionId>.mp4
  out/<Studio Folder>/<CompositionId>/<CompositionId>-alpha.mov
  out/<Studio Folder>/<CompositionId>/png/*.png
  ```
- 登録階層と `render.sh` の `resolve_output_subdir()` を同期し、動画とPNG連番を同じCompositionフォルダの下に保存する。
- シリーズ単位の書き出しと `all` は通常尺版・10秒版の両方を含める。

```sh
./render.sh --transparent-bg ScanEchoTransition-CyanSweep
./render.sh --adobe-stock-alpha ScanEchoTransition-CyanSweep-10s
```

## 実行前後の確認

- フルレンダーは、ユーザーが明示的に書き出しを依頼または承認した後だけ実行する。
- 動画の実行前に `npm run lint`、`npm run build`、`./render.sh check`、`git diff --check` を通す。
- 実行後は対象動画ごとに `ffprobe` で尺・解像度・fps・コーデック・ピクセル形式が指定どおりであることを確認する。10秒版の尺は `10.000000` 秒とする。
- 透過MOVは `prores` / `4444` / `yuva*` であることを確認する。
- 対象Compositionの本数と出力ファイルの本数が一致することを確認する。PNG連番は指定範囲のフレームが揃っていることも確認する。
- レンダー中の警告は無視せず、対象Compositionの画や処理に影響するかを判断して結果を報告する。

### 尺バリエーションの検証

通常バンドルを作成した後、登録ID・尺・props変更と、両版の対応する静止画の画素一致を確認する。以下の検証スクリプトはフル動画を書き出さない。Stock用バンドルは通常バンドルと別の場所に作成する。

```sh
node scripts/check-composition-layout.cjs
node scripts/verify-duration-variants.cjs
REMOTION_ADOBE_STOCK_EXPORT=1 npx remotion bundle --out-dir=/tmp/duration-variants-stock
node scripts/verify-duration-variants.cjs /tmp/duration-variants-stock
```

## Adobe Stock向けの追加設定

- 本リポジトリのStock提出用動画は **10秒以上60秒以下** とする。通常尺が短い素材の提出には `-10s` を選択する。末尾なしの通常尺版はStockフラグでも延長しない。
- ループ可能なオーバーレイや背景は既存のStock向け尺を維持する。現在の基準はオーバーレイ20秒（600フレーム）、選択された背景60秒（1800フレーム）。
- 10秒版とは別のStock向け尺変更は `REMOTION_ADOBE_STOCK_EXPORT=1` の場合だけ適用する。通常プレビュー・通常MOV・MP4・PNG連番の尺を副作用で変更しない。
- 背景透過素材は `./render.sh --adobe-stock-alpha <CompositionId...>` を使用する。透明背景、音声なし、MOV、Apple ProRes 4444、PNG中間フレーム、アルファ対応ピクセル形式を使用する。`--transparent-bg` の追加は不要。
- 背景を含む非透過素材は `./render.sh --adobe-stock <CompositionId...>` を使用する。
- Stock向けMOVと別途PNG連番も依頼された場合は、PNG連番を指定されたCompositionの尺で書き出す。Stock向けMOVの尺をPNG連番へ自動適用しない。
- 提出条件について質問された場合は、Adobe公式の最新Technical Requirementsを確認する。

## 実装箇所

- 書き出しフラグ・コーデック・出力先: `render.sh`
- 環境変数のバンドル注入: `remotion.config.ts`
- 尺バリエーション: `src/composition/duration-variants.json`、`src/composition/duration-variants.ts`
- Composition登録: `src/root-*.tsx`、`src/helpers/duration-variant-compositions.tsx`
