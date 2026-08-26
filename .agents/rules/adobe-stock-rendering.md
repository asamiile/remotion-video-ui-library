---
description: Adobe Stock向けMOVの尺、透過形式、書き出し、検証ルール
alwaysApply: false
---

# Adobe Stock MOV Rendering

Adobe Stock向けのMOVを書き出す、またはStock向けCompositionの尺を変更するときは、このルールを適用する。

## 尺

- Adobe Stockへ提出する動画は **5秒以上60秒以下** にする。
- 30fpsでは最短尺を **150フレーム** とする。
- 短尺トランジションは、原則として5秒（150フレーム）で書き出す。本来の演出尺は変更せず、演出を中央に配置して前後を透明な編集余白にする。
- ループ可能なオーバーレイや背景は、既存のStock向け尺を維持する。現在の基準はオーバーレイ20秒（600フレーム）、選択された背景60秒（1800フレーム）。
- Stock向けの尺変更は `REMOTION_ADOBE_STOCK_EXPORT=1` の場合だけ適用する。Remotion Studioの通常プレビュー、通常MOV、MP4、PNG連番の尺を副作用で変更しない。
- 新しいCompositionにStock向け尺を追加する場合、通常尺とStock向け尺を明示的に分け、フレーム駆動のアニメーションが延長区間で意図せず繰り返されたり停止途中になったりしないようにする。

## 書き出し形式

- 背景透過素材は `./render.sh --adobe-stock-alpha <CompositionId...>` を使用する。
- `--adobe-stock-alpha` は透明背景、音声なし、MOV、Apple ProRes 4444、PNG中間フレーム、アルファ対応ピクセル形式を使用する。
- 背景を含む非透過素材は `./render.sh --adobe-stock <CompositionId...>` を使用する。
- `--transparent-bg` の追加は不要。`--adobe-stock-alpha` が透過Composition背景を有効にする。
- 出力先はCompositionのStudio階層と同じ `out/` 配下にComposition名のフォルダを作り、MOVとPNG連番を次の構造へ統一する。
  ```text
  out/<Studio Folder>/<CompositionId>/<CompositionId>-alpha.mov
  out/<Studio Folder>/<CompositionId>/png/*.png
  ```
- MOVをカテゴリフォルダへ直接置かない。MOVと`png/`は必ず同じComposition名フォルダの直下に置く。
- PNG連番も依頼されている場合は別途 `--png-sequence --transparent-bg` で書き出す。Stock向けMOVの尺をPNG連番へ自動適用しない。

## 実行前後の確認

- フルレンダーは、ユーザーが明示的に書き出しを依頼または承認した後だけ実行する。
- 実行前に `npm run lint`、`npm run build`、`./render.sh check`、`git diff --check` を通す。
- 実行後は `ffprobe` で対象MOVごとに次を確認する。
  - 尺が用途別の指定秒数であること（短尺トランジションは原則 `5.000000` 秒）
  - 解像度とfpsがCompositionの仕様どおりであること
  - 透過MOVが `prores` / `4444` / `yuva*` であること
  - 対象Compositionの本数と出力ファイルの本数が一致すること
- レンダー中の警告は無視せず、対象Compositionの画や処理に影響するかを判断して結果を報告する。

## 現在の実装箇所

- Stock書き出しフラグとコーデック: `render.sh`
- 環境変数のバンドル注入: `remotion.config.ts`
- SFトランジションの5秒化: `src/Effects/Transition/sci-fi-transitions.schema.ts`
- Stock向け尺を使うEffect登録: `src/root-effect.tsx`
- オーバーレイ・背景のStock向け尺: `src/root-background.tsx`

要件やAdobe Stockの仕様が変わる可能性があるため、提出条件について質問された場合はAdobe公式の最新Technical Requirementsを確認する。
