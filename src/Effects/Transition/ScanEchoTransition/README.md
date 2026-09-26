# ScanEchoTransition

映像のカット位置へ重ねる、文字なし・背景透過のトランジション素材。
Studio: `Effect / Transition / ScanControl / ScanEchoTransition`。

66種類の動き、5種類の残像、6種類の中央マスク、566プリセット。

## 動きと残像

| mode | 動き |
| --- | --- |
| `sweep` | 直線走査 |
| `raster` | ラスタ走査 |
| `shutter` | 交互シャッター |
| `tear` | 信号断片 |
| `diagonal` | 斜め走査 |
| `split` | 中央展開／収束 |
| `ring` | 同心円 |
| `cross` | 十字走査 |
| `chevron` | 山形走査 |
| `cells` | データセル |
| `wave` | 波形走査 |
| `diamond` | 菱形 |
| `spiral` | 螺旋 |
| `stair` | 階段状走査 |
| `hexagon` | 六角形 |
| `iris` | 回転する絞り |
| `arc` | 円弧 |
| `barcode` | バーコード |
| `venetian` | 帯状シャッター |
| `pixelStorm` | ピクセル飛散 |
| `fracture` | 亀裂状残像 |
| `moire` | 干渉波走査 |
| `tunnel` | 矩形トンネル |
| `perspectiveGrid` | 遠近グリッド |
| `orbitSlice` | 傾いた軌道 |
| `prism` | プリズム |
| `contourTerrain` | 地形等高線 |
| `binaryCurtain` | データ落下 |
| `brokenLens` | 分割レンズ |
| `interlace` | 交差走査 |
| `tileSkew` | 傾くタイル |
| `checkerFold` | 市松折り返し |
| `diamondGrid` | 菱形セル |
| `hexCells` | 六角形セル |
| `microchip` | 回路走査 |
| `ribbonLattice` | 編み目走査 |
| `sonarFan` | 扇形走査 |
| `plasmaStrand` | プラズマ走査 |
| `herringbone` | ヘリンボーン走査 |
| `zipper` | ジッパー境界 |
| `circuitMaze` | 回路迷路 |
| `radialBars` | 放射バー |
| `eclipse` | 三日月走査 |
| `sineGate` | 波形ゲート |
| `glitchColumns` | 断片帯走査 |
| `pulseRails` | パルスレール |
| `wireframeCube` | ワイヤーフレーム立方体 |
| `rotatingBlades` | 回転ブレード |
| `chromaticHatch` | 交差ハッチ |
| `dataHelix` | 二重らせん |
| `oscillograph` | パルス波形 |
| `vortexSpokes` | 渦巻きスポーク |
| `sliceFan` | 扇形スライス |
| `particleRibbon` | 粒子リボン |
| `radarSweep` | レーダー走査 |
| `polarGrid` | 極座標グリッド |
| `segmentedIris` | 分割絞り |
| `cometArc` | 彗星アーク |
| `starGate` | 星形ゲート |
| `lensSlits` | レンズスリット |
| `rasterComb` | 走査櫛 |
| `voltageFork` | 分岐パルス |
| `diamondShards` | 菱形の断片 |
| `orbitalNodes` | 軌道ノード |
| `spectrumBars` | スペクトルバー |
| `phasePanels` | 位相パネル |

残像は `parallel`（平行）、`broken`（断続）、`alternating`（交互）、`dotted`（点状）、`diffuse`（拡散）。

## 尺バリエーション

各プリセットは末尾なしのIDが最短版、`-10s` が10秒版です。同じフォルダ内で選択できます。例えば `ScanEchoTransition-CyanSweep` と `ScanEchoTransition-CyanSweep-10s`。最短版はStockフラグでも延長しません。10秒版は中央に演出を配置し、前後に透明余白を設けます。

## 編集

- 1920×1080、30fps、10秒版の出力は10秒（300フレーム）。中央の演出はプリセットに応じて32〜72フレーム。各プリセットの演出尺は一覧表に記載。
- 素材の中央フレームを映像A/Bのカットへ合わせる。10秒素材は150フレーム位置。
- 最初と最後は透明。中央の2フレーム以上で全面を覆い、カットを隠す。
- Studioのpropsで動き、4方向、3色、カットを覆う色、残像数・間隔、glitch強度、seed、尺を編集できる。
- `cutStyle` で中央の遮蔽を `solid`（単色）、`chromatic`（2色）、`prism`（プリズム）、`static`（デジタルノイズ）、`slats`（スリット）、`iris`（虹彩）から選べる。
- 演出尺は24〜120フレームで変更可能。10秒版の出力尺は300フレームを維持し、前後を透明な編集余白にする。
- `coverColor` は不透明色を指定するとカットを完全に隠せる。透明色なら下の映像が透ける。
- 左／上は逆方向。円形・菱形など中央を基準にする動きでは収束方向になる。右／下は展開方向。
- 映像自体を変形するものではなく、走査光・信号断片を重ねる素材。残像はエフェクト自身の残像。
- glitch強度は断片・粒子・揺らぎの量に反映する。一部の幾何学パターンでは使用しない。
- seedとフレームから生成するため、再生順に依存しない。
- 10秒版は通常・Adobe Stockとも300フレーム（10秒）に延長し、演出を中央に配置する。

## 書き出し

```sh
# シリーズ全体（566プリセット × 最短・10秒の2版）
./render.sh ScanEchoTransition

# 1プリセットの透過PNG連番
./render.sh --png-sequence --transparent-bg ScanEchoTransition-CyanRadar

# 1プリセットのStock向け透過MOV
./render.sh --adobe-stock-alpha ScanEchoTransition-RgbTear
```

全プリセットは `all` の対象。フル書き出しは必要なときに実行する。

## プリセット一覧

完全なIDは `ScanEchoTransition-` に以下の末尾を付ける。

| ID末尾 | 動き | 残像 | フレーム |
| --- | --- | --- | ---: |
| CyanSweep | 直線走査 | parallel | 48 |
| VioletReverse | 直線走査 | parallel | 48 |
| AcidRaster | ラスタ走査 | broken | 48 |
| AmberRaster | ラスタ走査 | parallel | 48 |
| IceShutter | 交互シャッター | alternating | 48 |
| MagentaShutter | 交互シャッター | parallel | 48 |
| RgbTear | 信号断片 | broken | 48 |
| MintTear | 信号断片 | parallel | 48 |
| BlueEcho | 直線走査 | alternating | 48 |
| WhitePhosphor | ラスタ走査 | parallel | 48 |
| RedFault | 信号断片 | alternating | 48 |
| PurpleVertical | 直線走査 | broken | 48 |
| CyanDiagonal | 斜め走査 | parallel | 48 |
| HotPinkDiagonal | 斜め走査 | broken | 48 |
| SilverDiagonal | 斜め走査 | alternating | 48 |
| AcidDiagonal | 斜め走査 | broken | 48 |
| CyanSplit | 中央展開／収束 | parallel | 48 |
| RedConverge | 中央展開／収束 | alternating | 48 |
| MintVerticalSplit | 中央展開／収束 | broken | 48 |
| VioletVerticalConverge | 中央展開／収束 | parallel | 48 |
| CyanRadar | 同心円 | broken | 48 |
| VioletImplosion | 同心円 | parallel | 48 |
| AmberOrbit | 同心円 | alternating | 48 |
| WhiteSonar | 同心円 | broken | 48 |
| BlueCrossLock | 十字走査 | parallel | 48 |
| AcidCrossFault | 十字走査 | broken | 48 |
| RedCrossPulse | 十字走査 | alternating | 48 |
| IceCrossCollapse | 十字走査 | parallel | 48 |
| CyanChevron | 山形走査 | parallel | 48 |
| MagentaChevron | 山形走査 | broken | 48 |
| LimeChevron | 山形走査 | alternating | 48 |
| SilverChevron | 山形走査 | parallel | 48 |
| CyanDataCells | データセル | parallel | 48 |
| AmberDataLoss | データセル | broken | 48 |
| MintDataCascade | データセル | alternating | 48 |
| VioletDataReturn | データセル | broken | 48 |
| CyanWave | 波形走査 | parallel | 48 |
| MagentaWaveBreak | 波形走査 | broken | 48 |
| MintVerticalWave | 波形走査 | alternating | 48 |
| AmberWaveReturn | 波形走査 | parallel | 48 |
| IceDiamond | 菱形 | parallel | 48 |
| VioletDiamondCollapse | 菱形 | broken | 48 |
| AcidDiamondSplit | 菱形 | alternating | 48 |
| WhiteDiamondReturn | 菱形 | parallel | 48 |
| CyanSpiral | 螺旋 | parallel | 48 |
| RedSpiralFault | 螺旋 | broken | 48 |
| VioletDoubleSpiral | 螺旋 | alternating | 48 |
| MintSpiralReturn | 螺旋 | broken | 48 |
| BlueStair | 階段状走査 | parallel | 48 |
| AmberStairFault | 階段状走査 | broken | 48 |
| AcidVerticalStair | 階段状走査 | alternating | 48 |
| SilverStairReturn | 階段状走査 | parallel | 48 |
| SweepDotted | 直線走査 | dotted | 32 |
| SweepDiffuse | 直線走査 | diffuse | 72 |
| RasterDotted | ラスタ走査 | dotted | 32 |
| RasterDiffuse | ラスタ走査 | diffuse | 72 |
| ShutterDotted | 交互シャッター | dotted | 32 |
| ShutterDiffuse | 交互シャッター | diffuse | 72 |
| TearDotted | 信号断片 | dotted | 32 |
| TearDiffuse | 信号断片 | diffuse | 72 |
| DiagonalDotted | 斜め走査 | dotted | 32 |
| DiagonalDiffuse | 斜め走査 | diffuse | 72 |
| SplitDotted | 中央展開／収束 | dotted | 32 |
| SplitDiffuse | 中央展開／収束 | diffuse | 72 |
| RingDotted | 同心円 | dotted | 32 |
| RingDiffuse | 同心円 | diffuse | 72 |
| CrossDotted | 十字走査 | dotted | 32 |
| CrossDiffuse | 十字走査 | diffuse | 72 |
| ChevronDotted | 山形走査 | dotted | 32 |
| ChevronDiffuse | 山形走査 | diffuse | 72 |
| CellsDotted | データセル | dotted | 32 |
| CellsDiffuse | データセル | diffuse | 72 |
| WaveDotted | 波形走査 | dotted | 32 |
| WaveDiffuse | 波形走査 | diffuse | 72 |
| DiamondDotted | 菱形 | dotted | 32 |
| DiamondDiffuse | 菱形 | diffuse | 72 |
| SpiralDotted | 螺旋 | dotted | 32 |
| SpiralDiffuse | 螺旋 | diffuse | 72 |
| StairDotted | 階段状走査 | dotted | 32 |
| StairDiffuse | 階段状走査 | diffuse | 72 |
| HexagonCyan | 六角形 | parallel | 48 |
| HexagonMagentaBreak | 六角形 | broken | 48 |
| HexagonAcidAlternate | 六角形 | alternating | 48 |
| HexagonWhiteDots | 六角形 | dotted | 32 |
| HexagonVioletDiffuse | 六角形 | diffuse | 72 |
| IrisCyan | 回転する絞り | parallel | 48 |
| IrisMagentaBreak | 回転する絞り | broken | 48 |
| IrisAcidAlternate | 回転する絞り | alternating | 48 |
| IrisWhiteDots | 回転する絞り | dotted | 32 |
| IrisVioletDiffuse | 回転する絞り | diffuse | 72 |
| ArcCyan | 円弧 | parallel | 48 |
| ArcMagentaBreak | 円弧 | broken | 48 |
| ArcAcidAlternate | 円弧 | alternating | 48 |
| ArcWhiteDots | 円弧 | dotted | 32 |
| ArcVioletDiffuse | 円弧 | diffuse | 72 |
| BarcodeCyan | バーコード | parallel | 48 |
| BarcodeMagentaBreak | バーコード | broken | 48 |
| BarcodeAcidAlternate | バーコード | alternating | 48 |
| BarcodeWhiteDots | バーコード | dotted | 32 |
| BarcodeVioletDiffuse | バーコード | diffuse | 72 |
| VenetianCyan | 帯状シャッター | parallel | 48 |
| VenetianMagentaBreak | 帯状シャッター | broken | 48 |
| VenetianAcidAlternate | 帯状シャッター | alternating | 48 |
| VenetianWhiteDots | 帯状シャッター | dotted | 32 |
| VenetianVioletDiffuse | 帯状シャッター | diffuse | 72 |
| PixelStormCyan | ピクセル飛散 | parallel | 48 |
| PixelStormMagentaBreak | ピクセル飛散 | broken | 48 |
| PixelStormAcidAlternate | ピクセル飛散 | alternating | 48 |
| PixelStormWhiteDots | ピクセル飛散 | dotted | 32 |
| PixelStormVioletDiffuse | ピクセル飛散 | diffuse | 72 |
| FractureCyan | 亀裂状残像 | parallel | 48 |
| FractureMagentaBreak | 亀裂状残像 | broken | 48 |
| FractureAcidAlternate | 亀裂状残像 | alternating | 48 |
| FractureWhiteDots | 亀裂状残像 | dotted | 32 |
| FractureVioletDiffuse | 亀裂状残像 | diffuse | 72 |
| MoireCyan | 干渉波走査 | parallel | 48 |
| MoireMagentaBreak | 干渉波走査 | broken | 48 |
| MoireAcidAlternate | 干渉波走査 | alternating | 48 |
| MoireWhiteDots | 干渉波走査 | dotted | 32 |
| MoireVioletDiffuse | 干渉波走査 | diffuse | 72 |
| TunnelCyanDepth | 矩形トンネル | parallel | 48 |
| TunnelAmberBreak | 矩形トンネル | broken | 48 |
| TunnelAcidAlternate | 矩形トンネル | alternating | 48 |
| TunnelWhiteDots | 矩形トンネル | dotted | 32 |
| TunnelVioletDiffuse | 矩形トンネル | diffuse | 72 |
| PerspectiveGridCyanDepth | 遠近グリッド | parallel | 48 |
| PerspectiveGridAmberBreak | 遠近グリッド | broken | 48 |
| PerspectiveGridAcidAlternate | 遠近グリッド | alternating | 48 |
| PerspectiveGridWhiteDots | 遠近グリッド | dotted | 32 |
| PerspectiveGridVioletDiffuse | 遠近グリッド | diffuse | 72 |
| OrbitSliceCyanDepth | 傾いた軌道 | parallel | 48 |
| OrbitSliceAmberBreak | 傾いた軌道 | broken | 48 |
| OrbitSliceAcidAlternate | 傾いた軌道 | alternating | 48 |
| OrbitSliceWhiteDots | 傾いた軌道 | dotted | 32 |
| OrbitSliceVioletDiffuse | 傾いた軌道 | diffuse | 72 |
| PrismCyanDepth | プリズム | parallel | 48 |
| PrismAmberBreak | プリズム | broken | 48 |
| PrismAcidAlternate | プリズム | alternating | 48 |
| PrismWhiteDots | プリズム | dotted | 32 |
| PrismVioletDiffuse | プリズム | diffuse | 72 |
| ContourTerrainCyanDepth | 地形等高線 | parallel | 48 |
| ContourTerrainAmberBreak | 地形等高線 | broken | 48 |
| ContourTerrainAcidAlternate | 地形等高線 | alternating | 48 |
| ContourTerrainWhiteDots | 地形等高線 | dotted | 32 |
| ContourTerrainVioletDiffuse | 地形等高線 | diffuse | 72 |
| BinaryCurtainCyanDepth | データ落下 | parallel | 48 |
| BinaryCurtainAmberBreak | データ落下 | broken | 48 |
| BinaryCurtainAcidAlternate | データ落下 | alternating | 48 |
| BinaryCurtainWhiteDots | データ落下 | dotted | 32 |
| BinaryCurtainVioletDiffuse | データ落下 | diffuse | 72 |
| BrokenLensCyanDepth | 分割レンズ | parallel | 48 |
| BrokenLensAmberBreak | 分割レンズ | broken | 48 |
| BrokenLensAcidAlternate | 分割レンズ | alternating | 48 |
| BrokenLensWhiteDots | 分割レンズ | dotted | 32 |
| BrokenLensVioletDiffuse | 分割レンズ | diffuse | 72 |
| InterlaceCyanDepth | 交差走査 | parallel | 48 |
| InterlaceAmberBreak | 交差走査 | broken | 48 |
| InterlaceAcidAlternate | 交差走査 | alternating | 48 |
| InterlaceWhiteDots | 交差走査 | dotted | 32 |
| InterlaceVioletDiffuse | 交差走査 | diffuse | 72 |
| TileSkewCyanDepth | 傾くタイル | parallel | 48 |
| TileSkewAmberBreak | 傾くタイル | broken | 48 |
| TileSkewAcidAlternate | 傾くタイル | alternating | 48 |
| TileSkewWhiteDots | 傾くタイル | dotted | 32 |
| TileSkewVioletDiffuse | 傾くタイル | diffuse | 72 |
| CheckerFoldCyanDepth | 市松折り返し | parallel | 48 |
| CheckerFoldAmberBreak | 市松折り返し | broken | 48 |
| CheckerFoldAcidAlternate | 市松折り返し | alternating | 48 |
| CheckerFoldWhiteDots | 市松折り返し | dotted | 32 |
| CheckerFoldVioletDiffuse | 市松折り返し | diffuse | 72 |
| DiamondGridCyanDepth | 菱形セル | parallel | 48 |
| DiamondGridAmberBreak | 菱形セル | broken | 48 |
| DiamondGridAcidAlternate | 菱形セル | alternating | 48 |
| DiamondGridWhiteDots | 菱形セル | dotted | 32 |
| DiamondGridVioletDiffuse | 菱形セル | diffuse | 72 |
| HexCellsCyanDepth | 六角形セル | parallel | 48 |
| HexCellsAmberBreak | 六角形セル | broken | 48 |
| HexCellsAcidAlternate | 六角形セル | alternating | 48 |
| HexCellsWhiteDots | 六角形セル | dotted | 32 |
| HexCellsVioletDiffuse | 六角形セル | diffuse | 72 |
| MicrochipCyanDepth | 回路走査 | parallel | 48 |
| MicrochipAmberBreak | 回路走査 | broken | 48 |
| MicrochipAcidAlternate | 回路走査 | alternating | 48 |
| MicrochipWhiteDots | 回路走査 | dotted | 32 |
| MicrochipVioletDiffuse | 回路走査 | diffuse | 72 |
| RibbonLatticeCyanDepth | 編み目走査 | parallel | 48 |
| RibbonLatticeAmberBreak | 編み目走査 | broken | 48 |
| RibbonLatticeAcidAlternate | 編み目走査 | alternating | 48 |
| RibbonLatticeWhiteDots | 編み目走査 | dotted | 32 |
| RibbonLatticeVioletDiffuse | 編み目走査 | diffuse | 72 |
| SonarFanCyanDepth | 扇形走査 | parallel | 48 |
| SonarFanAmberBreak | 扇形走査 | broken | 48 |
| SonarFanAcidAlternate | 扇形走査 | alternating | 48 |
| SonarFanWhiteDots | 扇形走査 | dotted | 32 |
| SonarFanVioletDiffuse | 扇形走査 | diffuse | 72 |
| PlasmaStrandCyanDepth | プラズマ走査 | parallel | 48 |
| PlasmaStrandAmberBreak | プラズマ走査 | broken | 48 |
| PlasmaStrandAcidAlternate | プラズマ走査 | alternating | 48 |
| PlasmaStrandWhiteDots | プラズマ走査 | dotted | 32 |
| PlasmaStrandVioletDiffuse | プラズマ走査 | diffuse | 72 |
| SweepScarletIce | 直線走査 | broken | 36 |
| SweepPhosphorGold | 直線走査 | alternating | 60 |
| SweepGraphiteWhite | 直線走査 | parallel | 42 |
| RasterScarletIce | ラスタ走査 | broken | 36 |
| RasterPhosphorGold | ラスタ走査 | alternating | 60 |
| RasterGraphiteWhite | ラスタ走査 | parallel | 42 |
| ShutterScarletIce | 交互シャッター | broken | 36 |
| ShutterPhosphorGold | 交互シャッター | alternating | 60 |
| ShutterGraphiteWhite | 交互シャッター | parallel | 42 |
| TearScarletIce | 信号断片 | broken | 36 |
| TearPhosphorGold | 信号断片 | alternating | 60 |
| TearGraphiteWhite | 信号断片 | parallel | 42 |
| DiagonalScarletIce | 斜め走査 | broken | 36 |
| DiagonalPhosphorGold | 斜め走査 | alternating | 60 |
| DiagonalGraphiteWhite | 斜め走査 | parallel | 42 |
| SplitScarletIce | 中央展開／収束 | broken | 36 |
| SplitPhosphorGold | 中央展開／収束 | alternating | 60 |
| SplitGraphiteWhite | 中央展開／収束 | parallel | 42 |
| RingScarletIce | 同心円 | broken | 36 |
| RingPhosphorGold | 同心円 | alternating | 60 |
| RingGraphiteWhite | 同心円 | parallel | 42 |
| CrossScarletIce | 十字走査 | broken | 36 |
| CrossPhosphorGold | 十字走査 | alternating | 60 |
| CrossGraphiteWhite | 十字走査 | parallel | 42 |
| ChevronScarletIce | 山形走査 | broken | 36 |
| ChevronPhosphorGold | 山形走査 | alternating | 60 |
| ChevronGraphiteWhite | 山形走査 | parallel | 42 |
| CellsScarletIce | データセル | broken | 36 |
| CellsPhosphorGold | データセル | alternating | 60 |
| CellsGraphiteWhite | データセル | parallel | 42 |
| WaveScarletIce | 波形走査 | broken | 36 |
| WavePhosphorGold | 波形走査 | alternating | 60 |
| WaveGraphiteWhite | 波形走査 | parallel | 42 |
| DiamondScarletIce | 菱形 | broken | 36 |
| DiamondPhosphorGold | 菱形 | alternating | 60 |
| DiamondGraphiteWhite | 菱形 | parallel | 42 |
| SpiralScarletIce | 螺旋 | broken | 36 |
| SpiralPhosphorGold | 螺旋 | alternating | 60 |
| SpiralGraphiteWhite | 螺旋 | parallel | 42 |
| StairScarletIce | 階段状走査 | broken | 36 |
| StairPhosphorGold | 階段状走査 | alternating | 60 |
| StairGraphiteWhite | 階段状走査 | parallel | 42 |
| HexagonScarletIce | 六角形 | broken | 36 |
| HexagonPhosphorGold | 六角形 | alternating | 60 |
| HexagonGraphiteWhite | 六角形 | parallel | 42 |
| IrisScarletIce | 回転する絞り | broken | 36 |
| IrisPhosphorGold | 回転する絞り | alternating | 60 |
| IrisGraphiteWhite | 回転する絞り | parallel | 42 |
| ArcScarletIce | 円弧 | broken | 36 |
| ArcPhosphorGold | 円弧 | alternating | 60 |
| ArcGraphiteWhite | 円弧 | parallel | 42 |
| BarcodeScarletIce | バーコード | broken | 36 |
| BarcodePhosphorGold | バーコード | alternating | 60 |
| BarcodeGraphiteWhite | バーコード | parallel | 42 |
| VenetianScarletIce | 帯状シャッター | broken | 36 |
| VenetianPhosphorGold | 帯状シャッター | alternating | 60 |
| VenetianGraphiteWhite | 帯状シャッター | parallel | 42 |
| PixelStormScarletIce | ピクセル飛散 | broken | 36 |
| PixelStormPhosphorGold | ピクセル飛散 | alternating | 60 |
| PixelStormGraphiteWhite | ピクセル飛散 | parallel | 42 |
| FractureScarletIce | 亀裂状残像 | broken | 36 |
| FracturePhosphorGold | 亀裂状残像 | alternating | 60 |
| FractureGraphiteWhite | 亀裂状残像 | parallel | 42 |
| MoireScarletIce | 干渉波走査 | broken | 36 |
| MoirePhosphorGold | 干渉波走査 | alternating | 60 |
| MoireGraphiteWhite | 干渉波走査 | parallel | 42 |
| TunnelScarletIce | 矩形トンネル | broken | 36 |
| TunnelPhosphorGold | 矩形トンネル | alternating | 60 |
| TunnelGraphiteWhite | 矩形トンネル | parallel | 42 |
| PerspectiveGridScarletIce | 遠近グリッド | broken | 36 |
| PerspectiveGridPhosphorGold | 遠近グリッド | alternating | 60 |
| PerspectiveGridGraphiteWhite | 遠近グリッド | parallel | 42 |
| OrbitSliceScarletIce | 傾いた軌道 | broken | 36 |
| OrbitSlicePhosphorGold | 傾いた軌道 | alternating | 60 |
| OrbitSliceGraphiteWhite | 傾いた軌道 | parallel | 42 |
| PrismScarletIce | プリズム | broken | 36 |
| PrismPhosphorGold | プリズム | alternating | 60 |
| PrismGraphiteWhite | プリズム | parallel | 42 |
| ContourTerrainScarletIce | 地形等高線 | broken | 36 |
| ContourTerrainPhosphorGold | 地形等高線 | alternating | 60 |
| ContourTerrainGraphiteWhite | 地形等高線 | parallel | 42 |
| BinaryCurtainScarletIce | データ落下 | broken | 36 |
| BinaryCurtainPhosphorGold | データ落下 | alternating | 60 |
| BinaryCurtainGraphiteWhite | データ落下 | parallel | 42 |
| BrokenLensScarletIce | 分割レンズ | broken | 36 |
| BrokenLensPhosphorGold | 分割レンズ | alternating | 60 |
| BrokenLensGraphiteWhite | 分割レンズ | parallel | 42 |
| InterlaceScarletIce | 交差走査 | broken | 36 |
| InterlacePhosphorGold | 交差走査 | alternating | 60 |
| InterlaceGraphiteWhite | 交差走査 | parallel | 42 |
| TileSkewScarletIce | 傾くタイル | broken | 36 |
| TileSkewPhosphorGold | 傾くタイル | alternating | 60 |
| TileSkewGraphiteWhite | 傾くタイル | parallel | 42 |
| CheckerFoldScarletIce | 市松折り返し | broken | 36 |
| CheckerFoldPhosphorGold | 市松折り返し | alternating | 60 |
| CheckerFoldGraphiteWhite | 市松折り返し | parallel | 42 |
| DiamondGridScarletIce | 菱形セル | broken | 36 |
| DiamondGridPhosphorGold | 菱形セル | alternating | 60 |
| DiamondGridGraphiteWhite | 菱形セル | parallel | 42 |
| HexCellsScarletIce | 六角形セル | broken | 36 |
| HexCellsPhosphorGold | 六角形セル | alternating | 60 |
| HexCellsGraphiteWhite | 六角形セル | parallel | 42 |
| MicrochipScarletIce | 回路走査 | broken | 36 |
| MicrochipPhosphorGold | 回路走査 | alternating | 60 |
| MicrochipGraphiteWhite | 回路走査 | parallel | 42 |
| RibbonLatticeScarletIce | 編み目走査 | broken | 36 |
| RibbonLatticePhosphorGold | 編み目走査 | alternating | 60 |
| RibbonLatticeGraphiteWhite | 編み目走査 | parallel | 42 |
| SonarFanScarletIce | 扇形走査 | broken | 36 |
| SonarFanPhosphorGold | 扇形走査 | alternating | 60 |
| SonarFanGraphiteWhite | 扇形走査 | parallel | 42 |
| PlasmaStrandScarletIce | プラズマ走査 | broken | 36 |
| PlasmaStrandPhosphorGold | プラズマ走査 | alternating | 60 |
| PlasmaStrandGraphiteWhite | プラズマ走査 | parallel | 42 |
| HerringboneCyanDepth | ヘリンボーン走査 | parallel | 48 |
| HerringboneAmberBreak | ヘリンボーン走査 | broken | 48 |
| HerringboneAcidAlternate | ヘリンボーン走査 | alternating | 48 |
| HerringboneWhiteDots | ヘリンボーン走査 | dotted | 32 |
| HerringboneVioletDiffuse | ヘリンボーン走査 | diffuse | 72 |
| ZipperCyanDepth | ジッパー境界 | parallel | 48 |
| ZipperAmberBreak | ジッパー境界 | broken | 48 |
| ZipperAcidAlternate | ジッパー境界 | alternating | 48 |
| ZipperWhiteDots | ジッパー境界 | dotted | 32 |
| ZipperVioletDiffuse | ジッパー境界 | diffuse | 72 |
| CircuitMazeCyanDepth | 回路迷路 | parallel | 48 |
| CircuitMazeAmberBreak | 回路迷路 | broken | 48 |
| CircuitMazeAcidAlternate | 回路迷路 | alternating | 48 |
| CircuitMazeWhiteDots | 回路迷路 | dotted | 32 |
| CircuitMazeVioletDiffuse | 回路迷路 | diffuse | 72 |
| RadialBarsCyanDepth | 放射バー | parallel | 48 |
| RadialBarsAmberBreak | 放射バー | broken | 48 |
| RadialBarsAcidAlternate | 放射バー | alternating | 48 |
| RadialBarsWhiteDots | 放射バー | dotted | 32 |
| RadialBarsVioletDiffuse | 放射バー | diffuse | 72 |
| EclipseCyanDepth | 三日月走査 | parallel | 48 |
| EclipseAmberBreak | 三日月走査 | broken | 48 |
| EclipseAcidAlternate | 三日月走査 | alternating | 48 |
| EclipseWhiteDots | 三日月走査 | dotted | 32 |
| EclipseVioletDiffuse | 三日月走査 | diffuse | 72 |
| SineGateCyanDepth | 波形ゲート | parallel | 48 |
| SineGateAmberBreak | 波形ゲート | broken | 48 |
| SineGateAcidAlternate | 波形ゲート | alternating | 48 |
| SineGateWhiteDots | 波形ゲート | dotted | 32 |
| SineGateVioletDiffuse | 波形ゲート | diffuse | 72 |
| GlitchColumnsCyanDepth | 断片帯走査 | parallel | 48 |
| GlitchColumnsAmberBreak | 断片帯走査 | broken | 48 |
| GlitchColumnsAcidAlternate | 断片帯走査 | alternating | 48 |
| GlitchColumnsWhiteDots | 断片帯走査 | dotted | 32 |
| GlitchColumnsVioletDiffuse | 断片帯走査 | diffuse | 72 |
| PulseRailsCyanDepth | パルスレール | parallel | 48 |
| PulseRailsAmberBreak | パルスレール | broken | 48 |
| PulseRailsAcidAlternate | パルスレール | alternating | 48 |
| PulseRailsWhiteDots | パルスレール | dotted | 32 |
| PulseRailsVioletDiffuse | パルスレール | diffuse | 72 |
| SweepChromaticCut | 直線走査 | parallel | 48 |
| RasterPrismCut | ラスタ走査 | alternating | 48 |
| ShutterStaticCut | 交互シャッター | broken | 48 |
| TearChromaticCut | 信号断片 | parallel | 48 |
| DiagonalPrismCut | 斜め走査 | alternating | 48 |
| SplitStaticCut | 中央展開／収束 | broken | 48 |
| RingChromaticCut | 同心円 | parallel | 48 |
| CrossPrismCut | 十字走査 | alternating | 48 |
| ChevronStaticCut | 山形走査 | broken | 48 |
| CellsChromaticCut | データセル | parallel | 48 |
| WavePrismCut | 波形走査 | alternating | 48 |
| DiamondStaticCut | 菱形 | broken | 48 |
| SpiralChromaticCut | 螺旋 | parallel | 48 |
| StairPrismCut | 階段状走査 | alternating | 48 |
| HexagonStaticCut | 六角形 | broken | 48 |
| IrisChromaticCut | 回転する絞り | parallel | 48 |
| ArcPrismCut | 円弧 | alternating | 48 |
| BarcodeStaticCut | バーコード | broken | 48 |
| VenetianChromaticCut | 帯状シャッター | parallel | 48 |
| PixelStormPrismCut | ピクセル飛散 | alternating | 48 |
| FractureStaticCut | 亀裂状残像 | broken | 48 |
| MoireChromaticCut | 干渉波走査 | parallel | 48 |
| TunnelPrismCut | 矩形トンネル | alternating | 48 |
| PerspectiveGridStaticCut | 遠近グリッド | broken | 48 |
| OrbitSliceChromaticCut | 傾いた軌道 | parallel | 48 |
| PrismPrismCut | プリズム | alternating | 48 |
| ContourTerrainStaticCut | 地形等高線 | broken | 48 |
| BinaryCurtainChromaticCut | データ落下 | parallel | 48 |
| BrokenLensPrismCut | 分割レンズ | alternating | 48 |
| InterlaceStaticCut | 交差走査 | broken | 48 |
| TileSkewChromaticCut | 傾くタイル | parallel | 48 |
| CheckerFoldPrismCut | 市松折り返し | alternating | 48 |
| DiamondGridStaticCut | 菱形セル | broken | 48 |
| HexCellsChromaticCut | 六角形セル | parallel | 48 |
| MicrochipPrismCut | 回路走査 | alternating | 48 |
| RibbonLatticeStaticCut | 編み目走査 | broken | 48 |
| SonarFanChromaticCut | 扇形走査 | parallel | 48 |
| PlasmaStrandPrismCut | プラズマ走査 | alternating | 48 |
| HerringboneStaticCut | ヘリンボーン走査 | broken | 48 |
| ZipperChromaticCut | ジッパー境界 | parallel | 48 |
| CircuitMazePrismCut | 回路迷路 | alternating | 48 |
| RadialBarsStaticCut | 放射バー | broken | 48 |
| EclipseChromaticCut | 三日月走査 | parallel | 48 |
| SineGatePrismCut | 波形ゲート | alternating | 48 |
| GlitchColumnsStaticCut | 断片帯走査 | broken | 48 |
| PulseRailsChromaticCut | パルスレール | parallel | 48 |
| WireframeCubeCyanDepth | ワイヤーフレーム立方体 | parallel | 48 |
| WireframeCubeAmberBreak | ワイヤーフレーム立方体 | broken | 48 |
| WireframeCubeAcidAlternate | ワイヤーフレーム立方体 | alternating | 48 |
| WireframeCubeWhiteDots | ワイヤーフレーム立方体 | dotted | 32 |
| WireframeCubeVioletDiffuse | ワイヤーフレーム立方体 | diffuse | 72 |
| RotatingBladesCyanDepth | 回転ブレード | parallel | 48 |
| RotatingBladesAmberBreak | 回転ブレード | broken | 48 |
| RotatingBladesAcidAlternate | 回転ブレード | alternating | 48 |
| RotatingBladesWhiteDots | 回転ブレード | dotted | 32 |
| RotatingBladesVioletDiffuse | 回転ブレード | diffuse | 72 |
| ChromaticHatchCyanDepth | 交差ハッチ | parallel | 48 |
| ChromaticHatchAmberBreak | 交差ハッチ | broken | 48 |
| ChromaticHatchAcidAlternate | 交差ハッチ | alternating | 48 |
| ChromaticHatchWhiteDots | 交差ハッチ | dotted | 32 |
| ChromaticHatchVioletDiffuse | 交差ハッチ | diffuse | 72 |
| DataHelixCyanDepth | 二重らせん | parallel | 48 |
| DataHelixAmberBreak | 二重らせん | broken | 48 |
| DataHelixAcidAlternate | 二重らせん | alternating | 48 |
| DataHelixWhiteDots | 二重らせん | dotted | 32 |
| DataHelixVioletDiffuse | 二重らせん | diffuse | 72 |
| OscillographCyanDepth | パルス波形 | parallel | 48 |
| OscillographAmberBreak | パルス波形 | broken | 48 |
| OscillographAcidAlternate | パルス波形 | alternating | 48 |
| OscillographWhiteDots | パルス波形 | dotted | 32 |
| OscillographVioletDiffuse | パルス波形 | diffuse | 72 |
| VortexSpokesCyanDepth | 渦巻きスポーク | parallel | 48 |
| VortexSpokesAmberBreak | 渦巻きスポーク | broken | 48 |
| VortexSpokesAcidAlternate | 渦巻きスポーク | alternating | 48 |
| VortexSpokesWhiteDots | 渦巻きスポーク | dotted | 32 |
| VortexSpokesVioletDiffuse | 渦巻きスポーク | diffuse | 72 |
| SliceFanCyanDepth | 扇形スライス | parallel | 48 |
| SliceFanAmberBreak | 扇形スライス | broken | 48 |
| SliceFanAcidAlternate | 扇形スライス | alternating | 48 |
| SliceFanWhiteDots | 扇形スライス | dotted | 32 |
| SliceFanVioletDiffuse | 扇形スライス | diffuse | 72 |
| ParticleRibbonCyanDepth | 粒子リボン | parallel | 48 |
| ParticleRibbonAmberBreak | 粒子リボン | broken | 48 |
| ParticleRibbonAcidAlternate | 粒子リボン | alternating | 48 |
| ParticleRibbonWhiteDots | 粒子リボン | dotted | 32 |
| ParticleRibbonVioletDiffuse | 粒子リボン | diffuse | 72 |
| RadarSweepCyanDepth | レーダー走査 | parallel | 48 |
| RadarSweepAmberBreak | レーダー走査 | broken | 48 |
| RadarSweepAcidAlternate | レーダー走査 | alternating | 48 |
| RadarSweepWhiteDots | レーダー走査 | dotted | 32 |
| RadarSweepVioletDiffuse | レーダー走査 | diffuse | 72 |
| PolarGridCyanDepth | 極座標グリッド | parallel | 48 |
| PolarGridAmberBreak | 極座標グリッド | broken | 48 |
| PolarGridAcidAlternate | 極座標グリッド | alternating | 48 |
| PolarGridWhiteDots | 極座標グリッド | dotted | 32 |
| PolarGridVioletDiffuse | 極座標グリッド | diffuse | 72 |
| SegmentedIrisCyanDepth | 分割絞り | parallel | 48 |
| SegmentedIrisAmberBreak | 分割絞り | broken | 48 |
| SegmentedIrisAcidAlternate | 分割絞り | alternating | 48 |
| SegmentedIrisWhiteDots | 分割絞り | dotted | 32 |
| SegmentedIrisVioletDiffuse | 分割絞り | diffuse | 72 |
| CometArcCyanDepth | 彗星アーク | parallel | 48 |
| CometArcAmberBreak | 彗星アーク | broken | 48 |
| CometArcAcidAlternate | 彗星アーク | alternating | 48 |
| CometArcWhiteDots | 彗星アーク | dotted | 32 |
| CometArcVioletDiffuse | 彗星アーク | diffuse | 72 |
| StarGateCyanDepth | 星形ゲート | parallel | 48 |
| StarGateAmberBreak | 星形ゲート | broken | 48 |
| StarGateAcidAlternate | 星形ゲート | alternating | 48 |
| StarGateWhiteDots | 星形ゲート | dotted | 32 |
| StarGateVioletDiffuse | 星形ゲート | diffuse | 72 |
| LensSlitsCyanDepth | レンズスリット | parallel | 48 |
| LensSlitsAmberBreak | レンズスリット | broken | 48 |
| LensSlitsAcidAlternate | レンズスリット | alternating | 48 |
| LensSlitsWhiteDots | レンズスリット | dotted | 32 |
| LensSlitsVioletDiffuse | レンズスリット | diffuse | 72 |
| RasterCombCyanDepth | 走査櫛 | parallel | 48 |
| RasterCombAmberBreak | 走査櫛 | broken | 48 |
| RasterCombAcidAlternate | 走査櫛 | alternating | 48 |
| RasterCombWhiteDots | 走査櫛 | dotted | 32 |
| RasterCombVioletDiffuse | 走査櫛 | diffuse | 72 |
| VoltageForkCyanDepth | 分岐パルス | parallel | 48 |
| VoltageForkAmberBreak | 分岐パルス | broken | 48 |
| VoltageForkAcidAlternate | 分岐パルス | alternating | 48 |
| VoltageForkWhiteDots | 分岐パルス | dotted | 32 |
| VoltageForkVioletDiffuse | 分岐パルス | diffuse | 72 |
| DiamondShardsCyanDepth | 菱形の断片 | parallel | 48 |
| DiamondShardsAmberBreak | 菱形の断片 | broken | 48 |
| DiamondShardsAcidAlternate | 菱形の断片 | alternating | 48 |
| DiamondShardsWhiteDots | 菱形の断片 | dotted | 32 |
| DiamondShardsVioletDiffuse | 菱形の断片 | diffuse | 72 |
| OrbitalNodesCyanDepth | 軌道ノード | parallel | 48 |
| OrbitalNodesAmberBreak | 軌道ノード | broken | 48 |
| OrbitalNodesAcidAlternate | 軌道ノード | alternating | 48 |
| OrbitalNodesWhiteDots | 軌道ノード | dotted | 32 |
| OrbitalNodesVioletDiffuse | 軌道ノード | diffuse | 72 |
| SpectrumBarsCyanDepth | スペクトルバー | parallel | 48 |
| SpectrumBarsAmberBreak | スペクトルバー | broken | 48 |
| SpectrumBarsAcidAlternate | スペクトルバー | alternating | 48 |
| SpectrumBarsWhiteDots | スペクトルバー | dotted | 32 |
| SpectrumBarsVioletDiffuse | スペクトルバー | diffuse | 72 |
| PhasePanelsCyanDepth | 位相パネル | parallel | 48 |
| PhasePanelsAmberBreak | 位相パネル | broken | 48 |
| PhasePanelsAcidAlternate | 位相パネル | alternating | 48 |
| PhasePanelsWhiteDots | 位相パネル | dotted | 32 |
| PhasePanelsVioletDiffuse | 位相パネル | diffuse | 72 |
| SweepSlatsCut | 直線走査 | broken | 36 |
| RasterIrisCut | ラスタ走査 | diffuse | 60 |
| ShutterSlatsCut | 交互シャッター | broken | 36 |
| TearIrisCut | 信号断片 | diffuse | 60 |
| DiagonalSlatsCut | 斜め走査 | broken | 36 |
| SplitIrisCut | 中央展開／収束 | diffuse | 60 |
| RingSlatsCut | 同心円 | broken | 36 |
| CrossIrisCut | 十字走査 | diffuse | 60 |
| ChevronSlatsCut | 山形走査 | broken | 36 |
| CellsIrisCut | データセル | diffuse | 60 |
| WaveSlatsCut | 波形走査 | broken | 36 |
| DiamondIrisCut | 菱形 | diffuse | 60 |
| SpiralSlatsCut | 螺旋 | broken | 36 |
| StairIrisCut | 階段状走査 | diffuse | 60 |
| HexagonSlatsCut | 六角形 | broken | 36 |
| IrisIrisCut | 回転する絞り | diffuse | 60 |
| ArcSlatsCut | 円弧 | broken | 36 |
| BarcodeIrisCut | バーコード | diffuse | 60 |
| VenetianSlatsCut | 帯状シャッター | broken | 36 |
| PixelStormIrisCut | ピクセル飛散 | diffuse | 60 |
| FractureSlatsCut | 亀裂状残像 | broken | 36 |
| MoireIrisCut | 干渉波走査 | diffuse | 60 |
| TunnelSlatsCut | 矩形トンネル | broken | 36 |
| PerspectiveGridIrisCut | 遠近グリッド | diffuse | 60 |
| OrbitSliceSlatsCut | 傾いた軌道 | broken | 36 |
| PrismIrisCut | プリズム | diffuse | 60 |
| ContourTerrainSlatsCut | 地形等高線 | broken | 36 |
| BinaryCurtainIrisCut | データ落下 | diffuse | 60 |
| BrokenLensSlatsCut | 分割レンズ | broken | 36 |
| InterlaceIrisCut | 交差走査 | diffuse | 60 |
| TileSkewSlatsCut | 傾くタイル | broken | 36 |
| CheckerFoldIrisCut | 市松折り返し | diffuse | 60 |
| DiamondGridSlatsCut | 菱形セル | broken | 36 |
| HexCellsIrisCut | 六角形セル | diffuse | 60 |
| MicrochipSlatsCut | 回路走査 | broken | 36 |
| RibbonLatticeIrisCut | 編み目走査 | diffuse | 60 |
| SonarFanSlatsCut | 扇形走査 | broken | 36 |
| PlasmaStrandIrisCut | プラズマ走査 | diffuse | 60 |
| HerringboneSlatsCut | ヘリンボーン走査 | broken | 36 |
| ZipperIrisCut | ジッパー境界 | diffuse | 60 |
| CircuitMazeSlatsCut | 回路迷路 | broken | 36 |
| RadialBarsIrisCut | 放射バー | diffuse | 60 |
| EclipseSlatsCut | 三日月走査 | broken | 36 |
| SineGateIrisCut | 波形ゲート | diffuse | 60 |
| GlitchColumnsSlatsCut | 断片帯走査 | broken | 36 |
| PulseRailsIrisCut | パルスレール | diffuse | 60 |
| WireframeCubeSlatsCut | ワイヤーフレーム立方体 | broken | 36 |
| RotatingBladesIrisCut | 回転ブレード | diffuse | 60 |
| ChromaticHatchSlatsCut | 交差ハッチ | broken | 36 |
| DataHelixIrisCut | 二重らせん | diffuse | 60 |
| OscillographSlatsCut | パルス波形 | broken | 36 |
| VortexSpokesIrisCut | 渦巻きスポーク | diffuse | 60 |
| SliceFanSlatsCut | 扇形スライス | broken | 36 |
| ParticleRibbonIrisCut | 粒子リボン | diffuse | 60 |
| RadarSweepSlatsCut | レーダー走査 | broken | 36 |
| PolarGridIrisCut | 極座標グリッド | diffuse | 60 |
| SegmentedIrisSlatsCut | 分割絞り | broken | 36 |
| CometArcIrisCut | 彗星アーク | diffuse | 60 |
| StarGateSlatsCut | 星形ゲート | broken | 36 |
| LensSlitsIrisCut | レンズスリット | diffuse | 60 |
| RasterCombSlatsCut | 走査櫛 | broken | 36 |
| VoltageForkIrisCut | 分岐パルス | diffuse | 60 |
| DiamondShardsSlatsCut | 菱形の断片 | broken | 36 |
| OrbitalNodesIrisCut | 軌道ノード | diffuse | 60 |
| SpectrumBarsSlatsCut | スペクトルバー | broken | 36 |
| PhasePanelsIrisCut | 位相パネル | diffuse | 60 |

## 検証

```sh
node scripts/check-scan-echo-presets.cjs
node scripts/check-composition-layout.cjs
npm run lint
npm run build
./render.sh check
node scripts/verify-scan-echo.cjs
```

検証スクリプトはChromiumとffmpegを使用する。全プリセットを各1枚の静止画で確認し、登録IDと書き出し列挙を照合する。全Compositionの出力が10秒以上であることを確認する。演出尺24・25・48・49・119・120フレームについて、先頭／末尾の透明度と中央2フレームの不透明度、異なる順番で同じフレームを描画したときのピクセル一致も確認する。中央マスク全種類の透明度も確認する。画像は一時ディレクトリへ保存する。

Stock用は通常バンドルとは別の場所で確認できる。フル動画のレンダーは行わない。

```sh
REMOTION_ADOBE_STOCK_EXPORT=1 npx remotion bundle --out-dir=/tmp/scan-echo-stock-build
node scripts/verify-scan-echo.cjs --stock --bundle=/tmp/scan-echo-stock-build
```

特定の動きを修正した際は `node scripts/verify-scan-echo.cjs --modes=sweep,fracture,moire` のように静止画の対象を絞れる。登録照合と尺・透明度の検証は常に実行する。

中央マスクで絞る場合は `--cut-styles=slats,iris` を指定できる。
