# 開発・運用ガイド

## VS Codeで確認する

1. 「ファイル → フォルダーを開く」でプロジェクトを開く。
2. 「ターミナル → 新しいターミナル」を選ぶ。
3. 初回は `npm ci`、続けて `npm run dev` を実行する。
4. ターミナルに表示されたURLをブラウザで開く。

Node.js 24を使用する。通常のURLは `http://127.0.0.1:4321/`。ポート番号が変わる場合があるので、ターミナルの表示を使う。開発サーバーを動かしている間、保存したコードがサイトに反映される。Astroのページは `npm run dev` で確認する。

## VS CodeからGitHubへ反映する

GitHubの編集ページで保存すると、GitHub側に新しいコミットが作られる。PC側は自動更新されないため、VS Codeでも編集する場合は次の手順で同期する。

1. 編集前にソース管理の「… → プル」でGitHub側の最新変更を取得する。未コミットの編集がある場合は、先にコミットしてからプルする。
2. ファイルを編集・保存する。更新内容に応じてバージョンを更新する。小さな修正は `npm version patch --no-git-tag-version` を実行する。
3. 差分を確認し、反映するファイルをステージしてコミットする。
4. 「… → プッシュ」でGitHubへ送る。GitHub側に別の更新があり拒否された場合は、プルして変更を統合する。競合が出たらVS Codeのマージエディターで両方の差分を確認し、解消したファイルをステージしてコミットした後、再度プッシュする。
5. [GitHub Actions](https://github.com/ru13ii/portfolio/actions)の最新公開処理が成功した後に、公開サイトを再読み込みする。

`git status --short --branch` に `ahead 2, behind 1` と表示される場合、PCだけに2件、GitHubだけに1件のコミットがあり、履歴の統合が必要。問い合わせフォームの接続を維持するため、`site.formEndpoint` は設定済みの値を保つ。

`Permission to ru13ii/portfolio.git denied to 別のアカウント名` が表示された場合は、コミットの署名ではなくGitHubへの認証アカウントが異なる。このプロジェクトではローカルGit設定の `credential.https://github.com.username` を `ru13ii`、`credential.https://github.com.useHttpPath` を `true` に設定し、他のリポジトリの認証と区別する。VS CodeでGitHubの認証を求められたらru13iiでログインする。認証情報やトークンを公開ファイルに記載しない。

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

GitHub Pagesは静的サイトなので、受信・メール通知はFormspreeを使う。Formspreeに「RuBii Portfolio Contact」を作成し、`https://formspree.io/f/meaoyqdr` を接続済み。受信先は本人が提供したメールアドレスをサービス側で指定している。迷惑送信のフィルターは既定のFormshieldを利用する。本人の承認を受け、公開サイトからテストを1件送信済み。画面の送信成功とFormspreeの受信一覧への記録を確認した。本人からメールの到着も確認済み。

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

## 公開先の決定

2026-10-04にVercelを検討したが、無料運用を優先するユーザーの選択によりGitHub Pagesを継続する。Vercelでのサイト公開は行っていない。検討の詳細は [公開先の検討記録](vercel-hosting.md) を参照。

## 内容の確認事項

プロフィールは仮文。「おもかげ」のジャンル・担当表記は本人による確認待ち。各作品の情報・SoundCloud曲URLは編集ページから更新できる。
