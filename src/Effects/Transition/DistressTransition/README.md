# DistressTransition

## アイデア

| 動き | 切り替わりの見せ方 |
| --- | --- |
| Dry Brush | 乾いた刷毛の掠れが横切り、細い擦り跡を残す |
| Toner Scrape | 剥がれたトナーの斑点と帯が画面を覆う |
| CRT Snow | 白黒の砂嵐が密集してカットを覆い、消える |
| Tracking Roll | 縦に流れる砂嵐の帯に走査線と画面の乱れを重ねる |
| Signal Tear | 横方向に裂けたノイズ帯がずれながら切り替わる |
| Dust Burn | 細かな粒子が中央から広がり、焼けた輪郭を残す |

各案にMono（白黒）、Cyan（シアン／紫）、Amber（アンバー／赤）の3配色を用意する。中央2フレームでカットを全面遮蔽し、最初と最後は透明にする。ノイズは演出内のフレームとseedから生成し、通常版と10秒版で同じ模様・動きを保つ。

## 使い方

Studio: `Effect / Transition / DistressTransition`。18パターン × 通常尺・10秒版で36 Composition。

- 通常版: `DistressTransition-DryBrushMono`（末尾なし）。演出は30〜54フレーム。
- 10秒版: `DistressTransition-DryBrushMono-10s`。300フレームの中央に同じ演出を配置。
- 映像A/Bのカットを素材の中央フレームへ合わせる。先頭・末尾は透明で、中央2フレームは不透明。
- `mode`、配色、左右方向、粒子サイズ、密度、掠れの強さ、ノイズの更新間隔、seed、演出尺を編集できる。
- `coverColor` は中央の遮蔽を保証するため不透明な6桁HEXを指定する。
- 演出尺は24〜120フレーム。通常版はpropsに追従し、10秒版は300フレームを維持する。
- 映像の上に重ねる透過素材。元映像のピクセルを変形する処理や音声は含まない。

```sh
./render.sh --transparent-bg DistressTransition-DryBrushMono
./render.sh --adobe-stock-alpha DistressTransition-CrtSnowMono-10s
./render.sh DistressTransition
```

## 検証

```sh
node scripts/check-distress-presets.cjs
npm run lint
npm run build
./render.sh check
node scripts/verify-distress-transition.cjs
```

検証は各プリセットの静止画、通常版と10秒版の対応フレーム、端点の透明度・中央の遮蔽・描画順に依存しない画素一致を確認する。フル動画は書き出さない。
