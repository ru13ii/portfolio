# 開発・運用ガイド

## VS Codeで確認する

1. 「ファイル → フォルダーを開く」でプロジェクトを開く。
2. 「ターミナル → 新しいターミナル」を選ぶ。
3. 初回は `npm ci`、続けて `npm run dev` を実行する。
4. ターミナルに表示されたURLをブラウザで開く。

Node.js 24を使用する。通常のURLは `http://127.0.0.1:4321/`。ポート番号が変わる場合があるので、ターミナルの表示を使う。開発サーバーを動かしている間、保存したコードがサイトに反映される。Astroのページは `npm run dev` で確認する。

## 編集ページとアクセストークン

[編集ページ](https://ru13ii.github.io/portfolio/edit/)から文章・作品・お知らせ・リンクを変更できる。保存先は `ru13ii/portfolio`。作品の追加・削除・並び替え、JSONのダウンロードにも対応している。

アクセストークンは、GitHubが発行する認証用の文字列。編集ページにこの鍵を入力すると、許可したリポジトリのファイルを本人として更新できる。サイトを閲覧したり、問い合わせフォームを送信したりする人には不要。

### トークンを用意する

1. [GitHubのFine-grainedトークン作成画面](https://github.com/settings/personal-access-tokens/new)を開く。
2. 名前を `RuBii portfolio editor` にし、有効期限を設定する（例: 30日）。
3. Resource ownerに `ru13ii` を選ぶ。
4. Repository accessは **Only select repositories** にし、**portfolio** のみ選ぶ。
5. Repository permissionsの **Contents** を **Read and write** にする。
6. 発行したトークンを編集ページの「アクセストークン」欄に入力し、「GitHubへ保存」を押す。

保存後、GitHub Actionsが公開サイトを更新する。トークンはリポジトリやブラウザの保存領域へ記録せず、保存成功後に入力欄から消す。トークンはパスワードと同様に扱い、公開ファイルやチャットに貼らない。期限切れになったら新しいトークンを用意する。

[GitHub公式: アクセストークンの管理](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

## 問い合わせフォーム

GitHub Pagesは静的サイトなので、受信・メール通知はFormspreeを使う。Formspreeに「RuBii Portfolio Contact」を作成し、`https://formspree.io/f/meaoyqdr` を接続済み。受信先は本人が提供したメールアドレスをサービス側で指定している。迷惑送信のフィルターは既定のFormshieldを利用する。実際の受信テストは本人の承認後に行う。

1. [Formspree](https://formspree.io/register)に登録・ログインし、受信に使うメールアドレスを確認する。
2. サイト用フォームを作成する。
3. 受信先メールアドレスをサービス側で設定する。
4. 発行された `https://formspree.io/f/フォームID` を `src/data/content.json` の `site.formEndpoint` に設定する。編集ページの「フォーム送信先 URL」からも設定できる。
5. サイトを再公開してから、テスト送信を行い、Formspreeの受信記録と受信先メールの到着を確認する。

受信先メールアドレスは公開コードに記載しない。フォームのURLは公開される受付先であり、GitHubのアクセストークンとは異なる。トークンをフォームURLに入力しない。

Formspreeの無料枠は月50件（2026-10-03確認）。最新の条件は[料金ページ](https://formspree.io/plans/)を参照する。

## GitHub Pagesの設定

保存先は [ru13ii/portfolio](https://github.com/ru13ii/portfolio)、公開URLは `https://ru13ii.github.io/portfolio/`。

リポジトリの **Settings → Pages → Build and deployment → Source** は **GitHub Actions** に設定済み。`.github/workflows/deploy.yml` がビルド・公開を担当する。独自ドメインの利用時は `SITE_URL` と `SITE_BASE` を見直す。

## 内容の確認事項

プロフィールは仮文。「おもかげ」のジャンル・担当表記は本人による確認待ち。各作品の情報・SoundCloud曲URLは編集ページから更新できる。
