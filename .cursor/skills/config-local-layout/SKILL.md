---
name: config-local-layout
description: >-
  Uses config/local/composition-text.example.json (committed) and
  composition-text.local.json (gitignored) to override composition copy at
  bundle time via webpack DefinePlugin. Source TS configs keep sample strings
  only. Use when adding render copy, local JSON, or restructuring config/local.
---

# config/local（composition 文言）

## 方針

- **リポジトリ内の config**（`*-config.ts` / schema の default）は**サンプル文言のみ**。
- **本番・個人用の文言**は **`config/local/composition-text.local.json`**（gitignore）。`composition-text.example.json` をコピーして作る。
- **`remotion.config.ts`** がビルド開始時に `composition-text.local.json` を読み、`__COMPOSITION_TEXT_LOCAL__` として webpack に注入する。ファイルが無いときは `{}`。
- マージは **`src/composition/composition-merged.ts`** → `Root.tsx` / `MiniMapTemplate` が参照。

## JSON のキー（省略可）

| キー | 内容 |
|------|------|
| `intro` | `authorName`, `introTitle`, `introDescription` |
| `ledTextV1Patterns` | パターン ID → 部分 props（例: `text`） |
| `neonTextV1Patterns` | 同上 |
| `loadingIconV1Patterns` | 同上 |
| `locationV1` | `地点ID` → `{ "locationName" }` |
| `mapLocationPointsV1` | `地点ID` → `{ "name" }` |

## エージェント向け

1. 新しい composition の「差し替え文言」を足すときは **`composition-text.example.json`** にキーを追加し、型 **`src/composition/composition-text-local.ts`** を更新。必要なら **`src/composition/composition-merged.ts`** でマージ処理を足す。
2. `.gitignore` に `config/local/*.local.json` があること。

## CLI で 1 コンポジションだけ上書きする場合

統合 JSON とは別に、`--props` でその composition の props だけ渡す方法も可（Remotion ドキュメント参照）。
