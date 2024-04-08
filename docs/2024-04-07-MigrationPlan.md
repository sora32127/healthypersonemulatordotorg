# 目的
- 既存のWordpressサイトを新基盤にスムーズに移行すること

# 移行対象
- 既存のWordpressサイト
- Twitter更新通知Bot
- データ分析基盤については今回の移行対象外とする

# やること

## ユーザー向け通知
- 通知することは以下の通り
  - 既存サイトを一時的に閉鎖すること
  - 記事リンクはそのまま活きること
  - 技術的な理由から認証情報を移行できず、編集を行うには再登録が必要になること
- 閉鎖期間としては最長24時間を予定している
  - 場合によっては延長する必要があるかもしれない

## 既存Wordpressサイトの閉鎖
- 投稿フォームの閉鎖も同時に行う
- 実際の動作は以下の通り
  - LightSailのコンソールからインスタンスを停止する
  - CloudflareのコンソールからPagesを削除する

## ドメインのVercelへの移行
- Vercelのコンソールからドメインを追加する
- CloudflareのコンソールからDNSの設定を変更する
- [参考](https://zenn.dev/keitakn/articles/add-cloudflare-domain-to-vercel)

## データ移行
- プレ移行 04/08
  - 移行のチュートリアルが目的
  - 既存WordpressサイトのデータをSupabaseに移管する
  - 既存Supabaseのデータを一度すべてTruncateする
  - 既存WordpressサイトのデータをSupabaseに移行する
    - wp_**テーブルからINSERT文でデータを移行する
    - likebtnデータのみCSV形式で移行する
    - この際に利用したINSERT文を残しておく
- 本移行 04/09
  - サイトを閉鎖したうえでの実行

## Twitter更新通知Botの取得元変更
- プレ移行段階でプルリクエストまで作っておく
  - 本番移行時でマージする