# セキュリティ監査・対策記録 — 0.5.3 / 0.5.4

監査日: 2026-10-05 / 対象: ru13ii/portfolio、GitHub Pages。依頼: 公開を継続する前提で脆弱性を広く点検し、発見した問題を対策する。既存デザイン、作品データ、無料運用、VS Codeと編集ページからの更新を維持する。

## 対象と方法

- 全ソース、JSONの入出力、ブラウザーDOM操作、外部リンク・埋め込み・問い合わせ・編集用認証。
- npmの直接・間接依存関係、lockfile、CIのトークン権限・Actionsの参照・公開対象。
- Git全到達可能履歴22コミット、作業ツリーのGit管理対象・非無視ファイル、生成済みdistの秘密情報スキャン。
- GitHub設定画面によるPagesのHTTPS、公開可能ブランチ、依存・秘密情報・コード解析設定の確認。
- Nodeの回帰テスト、実際の不正JSONによるビルド停止テスト、ビルド済みHTML検査、ブラウザーでの正常操作と防御動作。
- 外部サービスへの侵入・負荷試験、メールの追加送信、実アクセストークンを使ったテスト保存は実施していない。

## 発見事項と対策

|項目|評価・前提|対策|
|---|---|---|
|http-cache-semantics 4.2.0|npm auditでHigh 1件。GHSA-ch52-4w7c-c8xp。共有キャッシュでの情報漏えいに関するもの。本サイトは静的で認証付き共有キャッシュを運用していないため、公開ページでの再現を確認したという意味ではない。|lockfileを4.3.0へ更新。再監査の既知の脆弱性は0件。|
|直接編集したJSONのURLがビルド時に未検証|悪意のある、または誤ったJSONが取り込まれた場合に危険なリンク等を公開できる。一般訪問者がJSONを書き換えられる脆弱性は確認していない。|ビルドと編集画面で共通の形式・URL検証。javascript/data/http、ユーザー情報付きURL、不正なポート・制御文字・紛らわしいホストを拒否。|
|メディアURLのホスト判定が緩い|YouTubeの単純な後方一致、SoundCloudの任意HTTPS入力。既存コードでもiframeの最終ホスト自体は固定されていた。|プロバイダーのホストを列挙、YouTube ID形式を確認。埋め込み直前にも再検証。|
|フォーム送信先の変更制限がない|JSONから任意HTTPS送信先を設定可能。|承認済みFormspree URLを定数で固定。CSPのform-action/connect-src、ビルド・実行時チェックを一致させる。入力長の制限は操作補助であり、サーバーのスパム対策の代替とは扱わない。|
|ブラウザーの実行元制限がない|XSSに対する防御層がない。ソース内のraw HTML挿入やevalは見つからず、AstroのエスケープとtextContentを維持。|Astroのハッシュ付きCSPを全ページに生成。unsafe-inline/eval禁止、object/base禁止、通信先とiframeを制限。編集ページでは画像を同一オリジン、通信を固定GitHub APIに限定し、form/iframeを禁止。|
|編集用トークンの残留・保存先変更・埋め込み|保存失敗時に入力欄に残り、リポジトリ指定は変更可能。HTTPヘッダーによるフレーム拒否がない。|保存開始・失敗・離脱時に消去。固定リポジトリ/main、資格情報省略・リダイレクト拒否・キャッシュ禁止・referrer非送信。公式/ループバックURLを直接開いた場合だけ入力可。認可の本体はGitHubのPAT検証。|
|保存中に編集すると未保存変更まで保存済み扱いになる|データ整合性の不備。|保存用スナップショットと編集中データを分離。リモート内容・SHA競合チェック、リモート検証不能時も書き込み拒否。|
|CIの過剰な公開権限・可変タグ参照|ビルドジョブにもPages/OIDC権限。サードパーティーの複合Actionを利用。|ビルドはcontents:readのみ、公開ジョブだけpages/id-token:write。公式Actionsを完全SHA固定、checkoutの認証保持なし、mainのみ公開。|
|継続検査が未整備|新しい脆弱性・秘密情報混入を見落とすリスク。|公開前/PR/毎週の依存監査・回帰テスト・成果物検査。Dependabot npm/Actions更新PR。GitHub側のアラート・Secret Protection・Push protectionを有効化。自動マージなし。|

## 検証結果

- `npm audit`: 修正前High 1件 → 修正後全レベル0件。取得時点のnpmデータベースに対する結果であり、未知の脆弱性を否定しない。
- `npm test`: 24件成功。100作品、危険なURL・偽装ホスト・不正データ、編集元/フレーム制限、401・409・リモート競合・検証不能時の書き込み拒否、固定送信先とmainを確認。
- 実際に一時的な不正 `coverUrl` を与えた `npm run build`: 失敗を確認。元のJSONを復元し再ビルド成功。作品データは変更していない。
- `GITHUB_REPOSITORY=ru13ii/portfolio npm run build` と `npm run check:dist`: 全5ページ成功。CSP、インラインスクリプトのハッシュ、インラインイベント/スタイル属性の不在、秘密ファイル・ソースマップ等の混入防止。
- Gitleaks 8.30.1（公式配布物のSHA256検証済み）: Git履歴22コミット、現在のソース、distで検出0件。ログはredactを有効にし、リポジトリ外へ保存。検出ルールにない秘密を保証するものではない。
- ブラウザー: 編集欄の初期表示・空トークン保存の拒否、Works絞り込み（2件→0件→2件）、YouTube再生、About、Contactの未入力送信拒否を確認。通常ページで新しいconsoleエラーなし。
- 隔離したローカル検証用HTML: CSPにハッシュのないインラインコードが実行されず、任意iframeも拒否されることを確認。
- 別オリジンのページに埋め込んだ編集画面: トークン入力・保存が無効、案内表示を確認。直接開いた編集画面は有効。

## GitHub側の設定

- Pages: GitHub Actionsによる公開、Enforce HTTPS有効、独自ドメインなし。
- github-pages environment: 許可ブランチはmainのみ、タグ0、環境secretなし。
- Dependency graph、Dependabot alerts、Malware alerts、Dependabot security updatesを有効化。
- Secret Protection、Push protection、非公開の脆弱性報告を有効化。
- Actionsの既定トークンはread-only、ActionsによるPR作成/承認は無効を確認。利用ActionはGitHub作成または所有者配下に限定。外部コントリビューターのPR実行は全員承認必須へ変更。
- Formspree設定画面: Formshield有効、CAPTCHA無効、HTTP API無効、リダイレクト未設定を確認。フォーム受信の履歴・個人データは監査で読み取らない。
- CodeQL: JavaScript/TypeScriptとGitHub Actionsのdefault setupを有効化。スキャンをmainへのpush・PR・毎週に実行。

## 残る制約と運用

1. GitHub Pagesでは任意のレスポンスヘッダーを付けられない。CSPのframe-ancestors、X-Frame-Options、Permissions-Policy等を完全には制御できない。metaのframe-ancestorsは無効なので採用しない。編集画面のフレーム内操作拒否は補助対策で、サイト全体のHTTPレベルのクリックジャッキング拒否と同等ではない。
2. ブラウザーのPATは入力・通信時にメモリーに存在する。拡張機能、端末感染、GitHubアカウント/同一オリジンの他サイトの侵害まで防げない。短命・対象リポジトリ限定・Contentsのみ、2要素認証/パスキーを使う。PATは単一ファイルだけへの書き込み権限に限定できない。実際のアカウント認証設定・各トークン権限は未検証。
3. Formspree受付URLは公開情報。サイト内の検証やCSPは、外部から受付URLへ直接送るスパムを止めない。Formspree側のフィルター・利用枠・受信状況を管理する。サービス内部や全送信経路の安全性は監査対象外。
4. YouTube/SoundCloudのiframe内部は各サービスの管理下にある。サイトのCSPでその内部コードまでは制限しない。サムネイルは編集の自由度のためHTTPS画像を許可し、外部画像先に通常のアクセス情報が渡り得る。編集ページには外部画像を許可しない。
5. ソース書き込み権限を持つ本人や侵害されたGitHubアカウントは、コード・ポリシー自体を変更できる。テストやCSPはその権限の代替ではない。本人の直接プッシュ/編集ページ運用を維持し、必須PR承認は導入しない。
6. 監査は2026-10-05時点の確認範囲に限る。「脆弱性が永久に0」という保証ではない。週次の検査失敗・Dependabot通知を確認し、修正PRをレビューして反映する。

## 一次資料

- [GitHub Advisory GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp) — advisoryとnpm監査の更新時差があるため、修正後の判定は当日のlockfileに対するnpm audit結果も併記。
- [Astro CSP設定](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)
- [GitHub Actionsの安全な利用](https://docs.github.com/en/actions/reference/security/secure-use)
- [MDN: frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)

## 公開確認と追加修正（0.5.4）

- 0.5.3はGitHub連携経由で反映し、公開ワークフロー [37228380172](https://github.com/ru13ii/portfolio/actions/runs/37228380172) のbuild/deploy成功を確認。公開5ページのHTTP 200とCSPを確認。ローカルも同一内容のGitHub履歴へ同期した。
- CodeQLは旧コードのYouTubeホスト判定の指摘を修正済みと判定。一方、新設した検査スクリプトの小文字scriptタグ用正規表現に `js/bad-tag-filter` の指摘が出た。訪問者側の実行コードではないが、検査の抜けを残さないため0.5.4でHTMLパーサーparse5へ置き換えた。大文字タグ・引用符内の `>`・イベント属性等5件の回帰テストを追加。
- parse5は開発用依存に限定し、公開ページの配信コードには含めない。参考: [parse5の公式API](https://parse5.js.org/functions/parse5.parse.html)。
- PCに保存されたGitトークンはworkflow更新権限がないため、workflowファイルを含む0.5.3だけ既存のGitHub連携で反映した。トークンの権限自体を拡張していない。通常のコンテンツ編集・プッシュは引き続き可能。
