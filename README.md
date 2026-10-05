# RuBii Portfolio

ボカロP・作曲家 **RuBii（るびぃ）** のポートフォリオサイトです。

**[サイトを見る](https://ru13ii.github.io/portfolio/)** · [作品](https://ru13ii.github.io/portfolio/works/) · [編集ページ](https://ru13ii.github.io/portfolio/edit/)

## 掲載内容

- Home: グランドピアノの上面図と名義・代表曲、作品・プロフィール・活動情報、歌詞の開閉表示。
- Works: オリジナル楽曲の試聴、担当・起用先、ジャンル別の絞り込み、歌詞の開閉表示。
- About: プロフィール・自由文の経歴・活動リンク。
- Contact: Formspreeを使った楽曲制作・BGM制作の問い合わせ。
- 編集ページ: 文章・経歴・作品・お知らせをGitHubへ保存、JSON書き出し。

生成りの紙面と黒いグランドピアノ、五線・音符を組み合わせたデザインです。メニューには4つの白鍵と3つの黒鍵を配置しています。PCでは背景の音符がゆっくり漂い、スマホ・タッチ操作・OSの動き削減では演出を停止します。

[YouTube](https://www.youtube.com/@ru13ii) · [SoundCloud](https://soundcloud.com/rubii-684907841) · [X](https://x.com/ru13ii_)

## 開発

Astro / Tailwind CSS / JSON / GitHub Pages。Node.js 24を使用します。

```sh
npm ci
npm run dev
```

ターミナルに表示されたURLで確認します。通常は http://127.0.0.1:4321/ です。

```sh
npm test
npm audit --audit-level=low
npm run build
npm run check:dist
npm run preview
```

## 編集する場所

- src/data/content.json: 文章・経歴（site.careerText）・作品・お知らせ・リンク・フォーム送信先。
- public/rubii-icon.png: ヘッダー・About・タブで使う人物アイコン。
- src/components/GrandPiano.astro: ピアノの上面図と鍵盤。
- src/styles/global.css / piano-space.css: 共通レイアウト・鍵盤・ジャンル索引・演出。
- src/scripts/music-space.js: 画面外・非表示時の背景音符の停止。

公開サイトの編集ページでは、対象リポジトリにContentsの書き込み権限を持つアクセストークンを保存時に入力します。トークンはファイルやブラウザーの保存領域へ記録しません。詳細は [開発・運用ガイド](docs/operations.md) を参照してください。

経歴は編集ページの「経歴 → Aboutページの経歴文」で編集します。改行・空行を保って表示し、空欄にするとAboutの経歴欄全体を非表示にします。HTML・Markdownの装飾は使用せず、通常の文章として保存します。

歌詞は編集ページの「作品 → 各楽曲の歌詞（任意）」で入力します（0.7.0以降）。Homeの代表曲・掲載作品とWorksで「歌詞を表示」をクリックすると開き、「歌詞を閉じる」で閉じます。改行・空行を保持し、空欄ならボタンごと非表示です。最大20,000文字で、HTML・Markdownは解釈しません。ローカルで直接編集する場合は `src/data/content.json` の各作品に `lyrics` を追加します。歌詞本文は本人が後から入力するため、今回の更新では追加していません。

## 公開

mainへのプッシュで .github/workflows/deploy.yml がビルドし、GitHub Pagesへ公開します。GitHub Actions内のGITHUB_REPOSITORYから公開パス /portfolio/ を設定します。独自ドメインではSITE_URLとSITE_BASE、および編集ページの許可URLを見直してください。

VS Codeで編集するときは、編集前のプル、保存・コミット・プッシュ、Actionsの成功確認の順で進めます。

## セキュリティ

0.5.3で保護を追加し、0.5.4で公開HTMLの検査を強化しています。

JSONのURL・データ形式は編集時とビルド時に検証します。不正なデータや既知の依存関係の脆弱性を検出した場合、公開処理を停止します。毎週の自動監査とDependabotの更新PRも設定しています。

編集画面のGitHub保存先は `ru13ii/portfolio` の `main` に固定しています。トークン欄は保存開始時・ページ離脱時に消去し、公式URLまたはローカルの編集画面を直接開いた場合だけ入力できます。フォーム送信先の変更は `src/lib/content-policy.js` とJSONをあわせて更新してください。

詳細は [監査結果・残る制約](docs/security-audit-0.5.3.md) と [報告窓口](SECURITY.md) を参照してください。

## 設計資料

- [経歴欄の仕様と料金表の検討](docs/career-and-pricing-0.6.0.md)
- [歌詞の表示・編集仕様と検証](docs/lyrics-0.7.0.md)
- [現行のデザイン・操作仕様](docs/design.md)
- [ホスティングの検討とGitHub Pages継続の判断](docs/vercel-hosting.md)
- [設計・作業記録](docs/development.md)
- [開発・運用ガイド](docs/operations.md)
