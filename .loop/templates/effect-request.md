# 映像Effect追加プロンプト

以下の映像Effectを追加してください。

## 基本情報

- Effect名:
- Composition ID:
- 配置: `src/Effects/<Effect名>/`
- 用途: 動画への重ね合わせ / トランジション / その他
- テーマ:
- 参考にする既存Effect:

## 映像仕様

- 幅: 1920px
- 高さ: 1080px
- FPS: 30
- 秒数: 10秒
- 背景透過: はい
- シームレスループ: はい / いいえ
- 文字要素: なし / あり

## 表現

- 主な視覚要素:
- 動き:
- 色:
- 合成方法の想定:
- ランダム性:
- 強度や速度など調整可能にするprops:

## 書き出し

- PNG連番: 必要 / 不要
- 透過MOV: 必要 / 不要
- MP4: 必要 / 不要
- 出力構造: `Effect/<Effect名>/png`、`Effect/<Effect名>/*.mov`など
- フルレンダー: 実行前に承認を求める

## 完了条件

- `Effect/<Effect名>`としてRemotion Studioに表示される
- 透過指定の場合、背景色が焼き込まれていない
- アニメーションがフレーム駆動かつ決定的に再現される
- `render.sh`から指定形式を書き出せる
- `npm run lint`が成功する
- `./render.sh check`が成功する
- `git diff --check`が成功する
- 変更内容と検証結果が報告される

## 制約

- `config/local/*.local.json`を変更しない
- 既存の無関係な変更を保持する
- 削除、commit、push、merge、publishは行わない

この内容をLoop Engineeringのgoalとして設定し、完了条件を満たすまで自律的に進めてください。フルレンダーや人間の判断が必要になった場合は、理由を示して停止してください。


