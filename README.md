# RuBii ポートフォリオ

Astro + Tailwind CSS + JSONで作った作曲家ポートフォリオです。現在はローカルで確認できます。GitHubの保存先は `ru13ii` アカウントです。問い合わせフォームの送信先は、後から接続します。

## VS Codeで確認する

1. VS Codeの「ファイル → フォルダーを開く」で、このプロジェクトのフォルダーを開きます。
2. 「ターミナル → 新しいターミナル」を選びます。
3. 下記のコマンドを順に実行します。初回はNode.js 24が必要です。

Node.js 24を使用します。

```sh
npm install
npm run dev
```

ターミナルに表示されたURL（通常は `http://127.0.0.1:4321/`）をブラウザで開きます。別のサーバーが動いているとポート番号が変わるため、表示されたURLを使ってください。編集画面は同じURLの末尾に `/edit/` を付けて開きます。

VS Codeでコードを保存すると、開いているサイトに変更が反映されます。確認中は開発サーバーを動かしておきます。サイトはAstroで生成するため、HTMLファイルの直接表示やLive Server拡張ではなく、`npm run dev` を使用してください。

プレビューが開けないときは `npm run dev` を実行し直してください。Node.jsのインストール直後に `npm` が見つからない場合はVS Codeを再起動します。公開用ファイルの確認は `npm run build` です。

## ページ

- `/` — トップとお知らせ
- `/works/` — 作品一覧とジャンル別絞り込み
- `/about/` — プロフィール
- `/contact/` — 連絡先とフォーム画面
- `/edit/` — サイト内容の編集

文章、作品、お知らせは [`src/data/content.json`](src/data/content.json) に入っています。作品には曲名、担当、作品種別・起用先、ジャンル、制作年、説明、再生URL、SoundCloudの曲URL、画像URLを設定できます。音声の新規登録はSoundCloudを初期値とし、YouTube動画も指定できます。

## GitHub Pagesで公開するとき

保存先アカウントは `ru13ii`、リポジトリは `portfolio` です。公開URLは `https://ru13ii.github.io/portfolio/` です。アップロード・公開の状況は `docs/development.md` に記録します。

1. GitHubアカウントと、このサイト用のリポジトリを作る。GitHub FreeでGitHub Pagesを使う場合は公開リポジトリを選ぶ。
2. このフォルダのファイルをリポジトリに置く。
3. リポジトリの **Settings → Pages → Build and deployment** で **GitHub Actions** を選ぶ。
4. `main` または `master` へ反映すると、[ワークフロー](.github/workflows/deploy.yml)がビルドと公開を行う。

Astroの公開URLとサブパスは、GitHub Actions上のリポジトリ名から自動設定します。独自ドメインに変更する場合は `SITE_URL` と `SITE_BASE` を設定できます。

## 編集ページから保存するとき

公開後の `/edit/` で内容を変更し、GitHubユーザー名、リポジトリ名、Fine-grained personal access tokenを入力して保存します。トークンは**対象リポジトリのみ**に `Contents: Read and write` 権限を付けてください。保存時にGitHubの [`src/data/content.json`](src/data/content.json) を更新し、GitHub Actionsがサイトを再公開します。

トークンはサイトのファイル、ブラウザのlocalStorage、Cookieに保存しません。編集ページのURLは誰でも開けますが、書き込み権限がなければ保存できません。作業途中の控えとして、JSONのダウンロードもできます。

## 問い合わせフォーム

現在は画面だけを用意しており、送信ボタンは無効です。フォームサービスの送信先URLを取得したら、編集ページの「フォーム送信先 URL」に設定します。たとえば[Formspree](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax)の `https://formspree.io/f/...` 形式のURLに対応します。受信先メールアドレスは公開コードへ書き込まず、フォームサービス側で設定してください。

## 未確定の内容

- プロフィール文は仮文です。
- 「おもかげ」のジャンルと担当表記は公開情報を元に置いた仮設定です。
- SoundCloud上の各曲のURLは、確認でき次第、編集ページから登録します。
- フォームの送信先は未設定です。GitHubへの保存先は `ru13ii/portfolio` です。

## ドキュメントとバージョン

現在のバージョンは `0.1.3` です。要件は [docs/requirements.md](docs/requirements.md)、設計・作業記録は [docs/development.md](docs/development.md) を参照してください。更新時はセマンティックバージョニングに沿って `package.json` とロックファイルのバージョンを更新します。
