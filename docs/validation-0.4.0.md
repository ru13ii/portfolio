# 0.4.0 確認記録

確認日: 2026-10-04

- npm run build成功。5ページ生成。
- PCのトップを目視: 黒い上面図、左の白鍵・黒鍵、文字の配置、Homeを含むメニュー、作品画像を確認。
- DOMで白鍵28・黒鍵20を確認。
- HomeページではHomeだけ、WorksページではWorksだけにaria-current=page。
- PCで6個の音符にair-phraseが適用。停止ボタンを押すと6個すべてnoneとなり、再開可能。
- メニューへのポインター移動で3個の音符が生成され、released-noteが適用されることを確認。
- Works: エレクトロで0件と案内文を表示。「すべて」に戻せる。
- スマホ390px: HomeとWorksの全要素でアニメーション・トランジションが0。横へのはみ出しなし。Homeはピアノと4メニューを目視確認。
- 320pxのHome: 横方向のはみ出しなし。
- ブラウザーのコンソールにエラーなし（確認時点）。
- OSの動き削減とタッチ専用環境はCSS/JSの条件を確認。実機のiPhone/Androidでは未検証。
- 原本と保存版の30ファイル、試作版のcontent.jsonはSHA-256で照合する。公開操作なし。

## 画面

- [PC](screenshots/piano-0.4.0.png)
- [スマホ](screenshots/piano-mobile-0.4.0.png)

[変更内容と調査資料](piano-refinement-0.4.0.md)
