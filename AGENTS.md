# AGENTS.md

このリポジトリで作業するAIエージェント向けのガイドです。

- リポジトリ構成・開発ルール: [.agents/repository.md](.agents/repository.md)

## 概要

Remotionベースの動画UIライブラリ。テキストエフェクト（Neon / Glitch / LED等）・ローディングアイコン・オーディオスペクトラム・地図アニメーション等のコンポジションをRemotion Studioでプレビューし、`render.sh`でMP4・透明背景ProRes等に書き出す。個人用の動画制作ツールキットであり、npmパッケージとして公開しているものではない。

## コマンド

具体的なコマンド（プレビュー起動・レンダリング・Remotionアップグレード）は[README.md](README.md)を参照。

## Cursor向けの設定

- プロジェクトルール: [.cursor/rules/](.cursor/rules/)（`.mdc`）
- スキル: [.cursor/skills/](.cursor/skills/)
- Cursorがリポジトリルート起点で自動検出する規約のパスのため、**`.agents/`配下には移動しない**。
