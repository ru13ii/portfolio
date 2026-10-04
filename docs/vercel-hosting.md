# Vercelへの公開設定（0.5.1）

2026-10-04、ユーザーがVercelでのホストを希望した。GitHubの `ru13ii/portfolio` を継続してソース管理に使用し、VercelのGit連携で配信する。

## 方針

- 既存のAstro静的出力を使用。SSRやVercelアダプターは不要。
- Vercelではドメイン直下 `/`、GitHub Pagesでは `/portfolio/`。AstroのBASE_URLを参照する既存リンク・画像をそのまま利用する。
- VERCEL=1の場合はGitHubのリポジトリ環境変数からサブパスを作らない。siteはVERCEL_PROJECT_PRODUCTION_URL、次にVERCEL_URLを参照する。SITE_URLとSITE_BASEは明示的な上書きとして優先する。
- Node.jsは24.x。vercel.jsonにAstro・npm ci・npm run build・distを指定する。
- .vercel/はGitから除外する。認証情報を公開設定へ書き込まない。
- Formspreeの既存受付先とGitHub Contents APIによるJSON編集は継続利用する。編集ページの保存結果は公開先に依存しない文言に変更。

## 接続する

1. Vercelにログインする。
2. 新規プロジェクトからGitHubのru13ii/portfolioをImportする。初回のGitHub連携の認可は本人が確認し、対象リポジトリをportfolioに限定する。
3. 利用目的に合うチームとプランを選択する。
4. Framework PresetはAstro、Root Directoryはルート、Production Branchはmain、Node.jsは24.x。
5. SITE_BASEが既に設定されている場合は `/` にするか削除する。SITE_URLは通常不要。独自ドメインを明示する場合のみhttpsのURLを設定する。
6. Deployし、DeploymentsがReadyになった後にHome・Works・About・Contact・edit、画像・スタイル・ナビゲーションを確認する。
7. READMEのサイト・作品・編集ページのリンクを確定した公開URLへ更新する。

## プランに関する確認

Vercelの無料Hobbyは非商用の個人利用に限定される。サイトは有償の楽曲制作・BGM制作の依頼獲得を目的としたサービスを宣伝しているため、公開運用にはPro以上が必要。Proは月20米ドルから（税・追加使用料は別、2026-10-04確認）。支払いや契約はユーザー本人が選択・承認する。

[商用利用の定義](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage) / [料金](https://vercel.com/pricing)

## 移行時の扱い

Vercelで公開が確認されるまでは既存のGitHub Pagesを維持する。ホスト切り替えの準備だけでは公開先が変更されたとは扱わない。GitHub Pagesの廃止や新URLへの転送は、Vercelの公開先が確定した後に判断する。

## 更新する

VS Codeで編集前にpullし、編集・コミット・pushする。VercelのProduction Branchがmainの場合、そのpushで本番が更新される。編集ページの「GitHubへ保存」も同じブランチのJSON更新を起点に自動公開する。反映されない場合はVercelのDeploymentsとビルドログを確認する。

## 検証記録

VERCEL=1と公開ドメインのサンプル値を指定したルート配信ビルドに成功。GitHubのリポジトリ環境変数が同時に存在しても、全5ページのリンクと画像がルートを参照することを確認した。Formspreeの既存受付先も維持。Vercelの環境変数を外したGitHub Pages用ビルドも成功し、全5ページが /portfolio/ のリンクと画像を参照することを確認した。

Gitのpushのdry-runで認証が通ることを確認。Vercelの実公開は未完了。ユーザーからログイン完了の連絡があったが、操作可能なブラウザーでは未認証だったため、Codex内ブラウザーでのログインと利用プランを確認中。実際のVercel公開URLとReady状態は接続後に確認する。

参考: [AstroのVercelガイド](https://docs.astro.build/en/guides/deploy/vercel/) / [Vercelの環境変数](https://vercel.com/docs/environment-variables/system-environment-variables)
