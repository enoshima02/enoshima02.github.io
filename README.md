# enoshima02.github.io

1990年代風の個人ホームページ。GitHub Pagesで公開。

## ブラウザから更新する

1. https://app.pagescms.org/ を開き、GitHubでログイン。
2. GitHub Appを `enoshima02/enoshima02.github.io` にインストールする（リポジトリへの権限付与は本人の操作が必要）。
3. `main` ブランチを選ぶ。
4. 「音楽」「Webアプリ」「ゲーム」「お知らせ」「プロフィール」を編集して保存する。
5. GitHub Pagesへのデプロイ完了後、公開サイトを確認する。

管理フォームはルートの `.pages.yml` で定義している。

## データの場所

- `data/music.json`：楽曲名・SoundCloud URL・トラックID
- `data/webapps.json`：Webアプリ
- `data/games.json`：ゲーム
- `data/news.json`：トップのお知らせ
- `data/profile.json`：プロフィール
- `assets/content.js`：上記JSONを読み込んで表示する共通処理

編集データは公開されるため、非公開情報を入力しないこと。各作品の `published` を false にするとサイトには表示されないが、公開GitHubリポジトリ内のJSONからは閲覧可能。

## 開発方針

表示用HTMLとコンテンツを分離。フレーム構造とレトロな見た目を維持する。外部リンクのURLはJavaScriptで検証し、ユーザー入力はtextContentで挿入する。

JavaScriptが無効の場合は作品一覧が描画されない。GitHub Pagesは静的配信のみを担当する。
