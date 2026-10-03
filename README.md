# RuBii Portfolio

ボカロP・作曲家 **RuBii（るびぃ）** のポートフォリオサイトです。オリジナル楽曲や活動情報、プロフィール、制作のご相談窓口を掲載しています。

**[サイトを見る](https://ru13ii.github.io/portfolio/)**

## 掲載内容

- **Works** — 楽曲の試聴、担当・起用先の紹介、ジャンル別の絞り込み
- **About** — プロフィールと活動リンク
- **Contact** — 楽曲制作・BGM制作のご相談
- **News** — 新作や活動のお知らせ

[YouTube](https://www.youtube.com/@ru13ii) · [SoundCloud](https://soundcloud.com/rubii-684907841) · [X](https://x.com/ru13ii_)

## 技術構成

Astro / Tailwind CSS / JSON / GitHub Pages

サイトの文章・作品・お知らせを `src/data/content.json` で管理し、静的ページとして生成します。

## 開発

Node.js 24を使用します。

```sh
npm ci
npm run dev
```

ターミナルに表示されたローカルURLをブラウザで開いてください。

```sh
npm run build    # 公開用ファイルをdist/に生成
npm run preview  # ビルドしたサイトを手元で確認
```

## デプロイ

`main` の更新時にGitHub Actionsがビルドし、GitHub Pagesへ自動公開します。公開URLとサブパスは、GitHubのリポジトリ名から設定します。

## ドキュメント

- [要件・仕様](docs/requirements.md)
- [開発・編集・フォーム設定の手順](docs/operations.md)
- [設計・変更履歴](docs/development.md)

現在のバージョン: **0.2.1**
