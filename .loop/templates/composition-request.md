# Remotion Composition追加プロンプト

以下のRemotion Compositionを追加してください。

## 基本情報

- Composition名:
- Composition ID:
- 配置フォルダ:
- 用途:
- 参考にする既存Composition:

## 映像仕様

- 幅: 1920px
- 高さ: 1080px
- FPS: 30
- 秒数: 10秒
- アスペクト比:
- 背景透過: はい / いいえ
- シームレスループ: はい / いいえ
- 音声: あり / なし

## 表現

- 見た目:
- アニメーション:
- 色:
- 文字要素:
- 画面外へのはみ出し対策:
- ランダム性:
- 調整可能にするprops:

## Studio・書き出し

- Remotion Studio上の配置:
- `render.sh`の出力先:
- 必要な書き出し形式: PNG連番 / MP4 / 透過MOV / その他
- フルレンダー: 実行前に承認を求める

## 完了条件

- 指定フォルダに実装され、Studioへ登録されている
- アニメーションがフレーム駆動かつ決定的に再現される
- schema、defaultProps、型がリポジトリ規約に従っている
- `npm run lint`が成功する
- `./render.sh check`が成功する
- `git diff --check`が成功する
- 変更内容と検証結果が報告される

## 制約

- `config/local/*.local.json`を変更しない
- 既存の無関係な変更を保持する
- 削除、commit、push、merge、publishは行わない

この内容をLoop Engineeringのgoalとして設定し、完了条件を満たすまで自律的に進めてください。フルレンダーや人間の判断が必要になった場合は、理由を示して停止してください。
