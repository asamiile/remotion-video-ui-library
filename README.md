# Remotion Video UI Library


Remotion ベースの動画 UI ライブラリです。

## コマンド

**Install Dependencies**

```console
pnpm i
```

**Start Preview**（Remotion Studio）

```console
pnpm run dev
```

**Render video** 

```console
sh render.sh [サブコマンド]
sh render.sh --with-canvas-bg AudioSpectrum   # 例: プレビュー背景を載せて書き出し
```

| サブコマンド（バッチ） | 内容 |
|--------------|------|
| `Intro` | `IntroV1` → `Intro.mov` |
| `LoadingIcon` | 全パターン（Default … CustomWithText など） |
| `Location` | 地点一覧は `composition-text` と `scripts/list-location-v1-composition-ids.cjs` に同期 |
| `MiniMap` | 各地点（**WebGL** 要・`--gl=angle`） |
| `AudioSpectrum` | Simple / Detailed（pattern、`--mute-audio`） |
| `AudioSpectrumFiles` | `public/audio/AudioSpectrum/` 内ファイルごと |
| `all` | 上記を順に実行（**既定**） |

| オプション | 説明 |
|------------|------|
| `--with-canvas-bg` | `REMOTION_CANVAS_BACKGROUND=1` 相当。[`composition-canvas-preview.ts`](./src/config/composition-canvas-preview.ts) の背景をレンダーにも反映。サブコマンドと併用可 |

詳細は `render.sh` 先頭コメント。

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Author

[Asami.K](https://asami.tokyo/)

## Licence

[MIT](https://opensource.org/licenses/MIT)
