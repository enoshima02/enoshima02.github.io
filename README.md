# enoshima02のホームページ

1990年代風の個人ホームページ。阿部寛さんの有名なホームページの「軽量なフレームサイト」という特徴を参考にした非公式オマージュであり、公式サイトとは無関係です。既存サイトの写真・文章・画像は転載していません。

## 公開
GitHub Pages: https://enoshima02.github.io/

GitHub → Settings → Pages → Deploy from a branch → main → /(root) を選択する。

## 編集方法
- トップページ・最新情報：`top.html`
- 左メニュー：`menu.html`
- 制作物一覧：`works.html`
- 制作中：`making.html`
- 自己紹介：`about.html`
- イラスト：`assets/portrait.svg`
- 背景：`assets/pattern.svg`
- 共通CSS：`assets/style.css`

昔の雰囲気を再現するため `frameset` を使っている。HTML5では廃止された要素なので、アクセシビリティ等を重視する場合はCSS Gridへの移行を検討する。