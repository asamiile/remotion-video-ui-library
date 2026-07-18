# リポジトリ構成

## ディレクトリ構成

```
/src
  Root.tsx                         … 全コンポジションの登録（Composition ID・schema・defaultProps）
  <Feature>/                         … 機能ごとのフォルダ（NeonText, GlitchText, LoadingIcon, AudioSpectrum, Location, Map等）
    <Feature>-v1/
      <Feature>Template.tsx            … Remotionコンポーネント本体
      <feature>-config.ts                … `*Patterns`（デフォルト文言・見た目の正）
      <feature>-schema.ts                  … zodによるprops型定義
  composition/
    Composition.tsx                  … コンポジション共通のラッパー
    composition-merged.ts              … config/localとのマージ処理（`shallowMergePatternRecord`）
    composition-text-local.ts            … config/local JSONの型定義
    merge-composition-local.ts             … マージ処理の実体
    with-canvas-preview.tsx                  … プレビュー用キャンバス背景を被せるHOC
  config/
    composition-canvas-preview.ts      … プレビュー用キャンバス背景の設定
  helpers/                          … フォント読み込み・ms→frame変換等の共通ユーティリティ
/config
  local/
    composition-text.example.json    … コミット対象のサンプル文言
    composition-text.local.json        … 個人用の本番文言（gitignore。エージェントは読み取り以外の操作をしない）
/scripts
  list-*-composition-ids.cjs         … render.sh向けのコンポジションID列挙（*-config.tsをASTで読む）
  composition-text-for-bundle.cjs      … config/localのJSONをバンドル向けに整形
/loaders
  inject-composition-text.cjs        … webpack向けローダー（config/localの内容を注入）
/public                            … 音声・画像等の静的アセット（audio/, images/）
render.sh                         … レンダリング用バッチスクリプト（サブコマンド・オプションはREADME.md参照）
remotion.config.ts                  … ビルド設定（config/localの注入含む）
.cursor/
  rules/                            … Cursorのプロジェクトルール（`.mdc`）。Cursorがリポジトリルート起点で自動読み込みするため、このディレクトリは移動しない
  skills/                           … Cursorのスキル定義
```

## 開発上の注意点

- **`config/local/*.local.json`はユーザー個人用・非コミット想定の設定**。エージェントは読み取り以外の操作（変更・新規作成・削除・キーの付け替え）をしない。サンプル文言は`config/local/composition-text.example.json`、型・マージ処理は`src/composition/`配下のコミット対象ファイルを編集する。例外はユーザーがチャットで対象パスと変更内容を明示して依頼したときのみ。詳細は[.cursor/rules/composition-text-local.mdc](../.cursor/rules/composition-text-local.mdc)。
- **新しいコンポジション・パターンを追加する手順**（既存ファミリーへの追加 / 新規ファミリーの追加 / 地点・LoadingIcon・AudioSpectrumの列挙まわり）は[.cursor/rules/composition-update-runbook.mdc](../.cursor/rules/composition-update-runbook.mdc)のランブックに従う。
- **`config/local`のレイアウト・ビルド時注入の仕組み**（`remotion.config.ts`が`composition-text.local.json`を読み`__COMPOSITION_TEXT_LOCAL__`として注入）は[.cursor/skills/config-local-layout/SKILL.md](../.cursor/skills/config-local-layout/SKILL.md)を参照。
