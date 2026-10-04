# RuBii Portfolio

ボカロP・作曲家 **RuBii（るびぃ）** のポートフォリオサイトです。

**[サイトを見る](https://ru13ii.github.io/portfolio/)** · [作品](https://ru13ii.github.io/portfolio/works/) · [編集ページ](https://ru13ii.github.io/portfolio/edit/)

## 掲載内容

- Home: グランドピアノの上面図と名義・代表曲、作品・プロフィール・活動情報。
- Works: オリジナル楽曲の試聴、担当・起用先、ジャンル別の絞り込み。
- About: プロフィールと活動リンク。
- Contact: Formspreeを使った楽曲制作・BGM制作の問い合わせ。
- 編集ページ: 文章・作品・お知らせをGitHubへ保存、JSON書き出し。

生成りの紙面と黒いグランドピアノ、五線・音符を組み合わせたデザインです。メニューには4つの白鍵と3つの黒鍵を配置しています。PCでは背景の音符がゆっくり漂い、スマホ・タッチ操作・OSの動き削減では演出を停止します。

[YouTube](https://www.youtube.com/@ru13ii) · [SoundCloud](https://soundcloud.com/rubii-684907841) · [X](https://x.com/ru13ii_)

## 開発

Astro / Tailwind CSS / JSON。VercelとGitHub Pagesの静的配信に対応しています。Node.js 24を使用します。

```sh
npm ci
npm run dev
```

ターミナルに表示されたURLで確認します。通常は http://127.0.0.1:4321/ です。

```sh
npm run build
npm run preview
```

## 編集する場所

- src/data/content.json: 文章・作品・お知らせ・リンク・フォーム送信先。
- public/rubii-icon.png: ヘッダー・About・タブで使う人物アイコン。
- src/components/GrandPiano.astro: ピアノの上面図と鍵盤。
- src/styles/global.css / piano-space.css: 共通レイアウト・鍵盤・ジャンル索引・演出。
- src/scripts/music-space.js: 画面外・非表示時の背景音符の停止。

公開サイトの編集ページでは、対象リポジトリにContentsの書き込み権限を持つアクセストークンを保存時に入力します。トークンはファイルやブラウザーの保存領域へ記録しません。詳細は [開発・運用ガイド](docs/operations.md) を参照してください。

## 公開

### Vercel

[Vercelの新規プロジェクト画面](https://vercel.com/new)から `ru13ii/portfolio` をImportします。FrameworkはAstro、Root Directoryはリポジトリのルート、Production Branchはmain、Node.jsは24.x。ビルドと出力先はvercel.jsonで指定しています。Vercelではドメイン直下で公開するため、SITE_BASEは未設定か `/` にします。

GitHubへのmainのプッシュと編集ページからの保存で、Vercelが自動ビルドします。VercelのDeploymentsがReadyになったら新しいサイトを確認します。Vercelの公開URLはプロジェクト作成後に確定します。

楽曲制作の依頼獲得を目的としたサービスの宣伝は、Vercelの利用条件では商用利用に該当します。無料Hobbyは非商用限定のため、Pro以上のプランで運用してください。プランと契約は本人が選択します。[Vercelの商用利用条件](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)

詳しい設定・確認手順は [Vercelへの移行](docs/vercel-hosting.md) を参照してください。

### GitHub Pages

mainへのプッシュで .github/workflows/deploy.yml がビルドし、GitHub Pagesへ公開します。GitHub Actions内のGITHUB_REPOSITORYから公開パス /portfolio/ を設定します。独自ドメインではSITE_URLとSITE_BASEを設定してください。

VS Codeで編集するときは、編集前のプル、保存・コミット・プッシュ、Actionsの成功確認の順で進めます。

## 設計資料

- [現行の仕様と正式版への移行](docs/production-adoption-0.5.0.md)
- [Vercelの公開設定](docs/vercel-hosting.md)
- [鍵盤・索引・UIの調整](docs/ui-refinement-0.4.1.md)
- [ピアノ形状の考察](docs/piano-refinement-0.4.0.md)
- [設計・作業記録](docs/development.md)
- [開発・運用ガイド](docs/operations.md)
