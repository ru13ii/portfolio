# 現行のデザイン・操作仕様

更新日: 2026-10-05。B案の音楽空間デザインを正式採用済み。現行ソースはリポジトリのルートにあり、試作版の独立コピーや比較ページは運用していない。

## 方向性

洗練された余白と生成りの紙面を基調に、ピアノ・五線・音符の空間とポートフォリオを一体化する。参考サイトは [小川明夏さんのサイト](https://www.ogawasayaka.com/)。Homeは縦スクロールできる。参考サイトの素材やレイアウトをそのまま複製するものではない。

## グランドピアノ

Homeはグランドピアノの上面図に名義・紹介を配置し、曲線の外側から代表曲へ五線をつなぐ。低音側の長い直線、右上の丸い尾部、高音側のくびれ、左側の鍵盤を一続きの形として扱う。SVGのviewBoxは940×680で、縦横比を固定し、文章量に合わせて形を引き延ばさない。

ほぼ無彩色の黒（#030303〜#242426）に細い縁の反射、弱い斜めの反射、ヒンジ、赤褐色のフェルト、接地影を組み合わせる。左側は28白鍵・20黒鍵。白鍵7本ごとに黒鍵を2本・3本の規則で置き、E-F/B-C間を空ける。鍵盤は装飾で、音を鳴らす機能はない。本人はピアノとしての輪郭と黒色の質感を重視している。

形状検討時には [Vexelsの上面図](https://www.vexels.com/vectors/preview/74979/concert-grand-piano-top-view) と [Steinway Model B](https://www.steinway.com/pianos/steinway/grand/model-b/) を参照した。参考画像自体はダウンロード・転載せず、SVG/CSSを作成した。メーカーのロゴ・精密寸法を再現する目的ではない。

## メニュー・作品索引

上部メニューはHome・Works・About・Contactの4白鍵と、境界の25%・50%・75%へ置く3黒鍵。この均等配置は本人の指定で、ピアノ本体の音階配列とは区別する。黒鍵は独立した装飾レイヤーで白鍵より上に固定し、白鍵ホバーで欠けたりリンク操作を妨げたりしない。現在位置とホバーは表示し、クリック時だけの追加沈み込みは行わない。

Worksは曲名・担当・起用先を再生エリアと組み合わせる。ジャンル選択は鍵盤ではなく、譜面フォルダーの索引風の罫線・番号・選択下線。ポップス・バラード・エレクトロで即時に絞り込む。WorksとAbout下部にContactの誘導は置かず、Homeの導線と共通メニューを使う。

## 演出とスマホ

Homeの余白に6個の背景音符を置き、PCでは7〜10秒周期でゆっくり浮遊させる。画面外・非表示タブでは停止する。手動停止ボタン、操作から新しい音符を生成する演出、カーソル追従、音声の自動再生は使わない。試聴ボタンの音符と既存のホバー反応は維持する。

演出は1024px以上・hover対応・fineポインター・prefers-reduced-motionがno-preferenceの条件がすべて成立する場合に有効。スマホ・タッチ中心・OSの動き削減では、疑似要素を含めアニメーション・トランジションを停止する。音源・動画の任意再生は装飾演出と区別する。関連仕様は [MDN hover](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover) と [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)。

## 歌詞

Homeの代表曲・掲載作品とWorksの作品情報の末尾に歌詞を開閉する欄を配置する。既存の紙面・罫線・文字色に合わせ、初期状態は閉じる。標準のdetails/summaryを使い、マウス・タッチ・キーボードで操作できる。「歌詞を表示／歌詞を閉じる」と＋／−で状態を示す。開閉アニメーションは追加しない。歌詞は折り返して改行・空行を保ち、空欄時には欄自体を表示しない。詳細は [歌詞の仕様](lyrics-0.7.0.md)。

## About・Contact・編集

本人提供の `public/rubii-icon.png` をヘッダー・About・タブアイコンに使う。Aboutの日本語見出しは「私について」。プロフィールと経歴は同じ紙面に配置する。経歴は通常テキストの改行を保持し、PCで左右・スマホで縦一列。内容・空欄時の挙動は [経歴の仕様](career-and-pricing-0.6.0.md) を参照する。

ContactはFormspreeに実接続する。編集画面はJSON書き出しとGitHub保存に対応し、試作版の「送信・保存しない」という説明は適用しない。料金表は提案段階で、未実装。安全な接続・保存の詳細は [運用ガイド](operations.md) と [監査記録](security-audit-0.5.3.md)。

## 主な実装箇所

- `src/components/GrandPiano.astro`: ピアノ上面図・左鍵盤。
- `src/components/Header.astro`: 4白鍵・3黒鍵のナビゲーション。
- `src/components/MusicAir.astro` / `src/scripts/music-space.js`: 背景音符・表示状態による停止。
- `src/components/WorkRow.astro` / `MediaPreview.astro`: 作品情報・任意再生。
- `src/components/Lyrics.astro`: Home・Works共通の歌詞開閉・通常テキスト表示。
- `src/pages/about.astro` / `edit.astro`: 経歴の表示・編集。
- `src/styles/global.css` / `piano-space.css` / `editor.css`: レイアウト・質感・演出条件。
