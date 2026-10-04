# ホスティングの検討とGitHub Pages継続（0.5.2）

決定日: 2026-10-04

## 決定

ユーザーは「無料で運用したい」と希望し、代替案の確認後に「GitHub Pagesを継続する」と選択した。公開先は https://ru13ii.github.io/portfolio/ 、ソース管理はGitHubのru13ii/portfolioを継続する。

Vercelでのプロジェクト作成・公開、有料プランの契約、Netlifyへの移行はいずれも実施していない。Vercel用に準備したvercel.jsonとAstroのVercel環境分岐は0.5.2で取り下げた。Node.js 24.x、静的出力、編集ページの汎用的な保存結果の案内文は維持する。

## 検討の経緯

1. ユーザーがVercelでのホストを希望した。
2. 0.5.1で静的配信用のVercel設定を準備し、GitHubへ反映。Vercelのルート配信とGitHub Pagesのサブパス配信で、全5ページのビルド・リンク・画像を確認した。問い合わせのFormspree接続先も維持した。
3. Codex内ブラウザーでru13iiのVercelログインを確認した。
4. 制作サービスを宣伝して依頼を獲得する用途では、Vercelの無料Hobbyは対象外であることを公式資料で確認。Proは月20米ドルから（税・追加使用料別、2026-10-04確認）。利用プランをユーザーへ確認した。
5. ユーザーは無料運用を希望した。制作依頼の受付は当初の要件なので、無料運用の回答だけでは削除せず、GitHub Pagesの継続とNetlify Freeへの移行を提示した。
6. ユーザーはGitHub Pagesの継続を選択した。

## 比較時に確認した内容

Vercel Hobbyは非商用の個人利用限定。サービスの販売・宣伝を含む商用利用にはPro以上が必要。

Netlify Freeは商用プロジェクトにも対応し、月300クレジットの上限がある。上限到達時は公開サイトが停止する。新規の無料サイトではPowered by Netlifyバッジが初期表示されるが、所有者がプロジェクト設定で無効にできる。

## 今後の運用

VS Codeでは編集前にpullし、編集・コミット・pushする。mainへのpush後、GitHub Actionsの公開処理が成功したら公開サイトを再読み込みする。公開サイトの編集ページからGitHubへ保存した場合も同じワークフローが実行される。具体的な手順はREADMEとoperations.mdを参照。

## 検証

0.5.1のGitHub Pages公開処理は成功した。0.5.2ではVercel専用設定の取り下げ後にGitHub Pages用の全5ページのビルドが成功し、リンクとアイコンが /portfolio/ 以下を参照することを確認した。GitHubへの反映後に公開処理と本番サイトを確認する。

## 参照

- [Vercelの商用利用条件](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)
- [Vercelの料金](https://vercel.com/pricing)
- [Netlify Freeの商用利用](https://www.netlify.com/blog/introducing-netlify-free-plan/)
- [Netlifyの現在の料金と上限](https://www.netlify.com/pricing/)
- [Netlifyバッジの設定](https://docs.netlify.com/manage/projects/powered-by-netlify-badge/)
