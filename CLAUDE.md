# ZenMon プロジェクト情報

## 概要
禅マスターとの対話を通じて内なる智慧を探求するチャットアプリケーション

## 技術スタック
- Next.js 15.3.5
- React 19
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- OpenAI API (GPT-4)

## 開発環境
- **パッケージマネージャー**: bun を使用
- **開発サーバー**: `bun dev`
- **ビルド**: `bun run build`
- **リント**: `bun run lint`

## 主要機能
1. 禅マスタースタイルのAIチャット
2. 美しい日本語UI（ダークモード対応）
3. ストリーミングレスポンス
4. レスポンシブデザイン

## API設定
- OpenAI API キーが必要
- `/api/chat` エンドポイントでGPT-4を使用
- 禅マスターペルソナのシステムプロンプト設定済み

## 開発時の注意事項
- 必ずbunコマンドを使用すること
- 環境変数でOpenAI API キーを設定が必要