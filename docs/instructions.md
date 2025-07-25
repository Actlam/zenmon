# 禅チャットボット開発依頼書

## プロジェクト概要
禅の思想を学習させ、ユーザーからの相談に対して抽象度の高い学びや気づきを提供するAIチャットボットの開発

## 機能要件

### 基本機能
- ユーザーとのリアルタイムチャット対話
- 禅的な応答（直接的な答えではなく、問いかけや比喩での返答）
- 会話履歴の表示
- ストリーミングレスポンス対応

### 禅の特徴
- 答えを与えるのではなく、内省を促す対話スタイル
- 時には戦略的な沈黙や短い返答
- 公案や禅語録からの引用機能（オプション）

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui（UIコンポーネント）
- Vercel AI SDK（チャットUI）

### バックエンド
- Next.js API Routes
- OpenAI API

### インフラ
- Vercel（ホスティング）

## 開発スコープ（MVP）

### 1. チャット画面の実装
- メッセージの送受信
- リアルタイムストリーミング表示
- シンプルで落ち着いたデザイン

### 2. AI応答の実装
- OpenAI APIとの連携
- 禅マスター用のシステムプロンプト設定
- エラーハンドリング

### 3. 基本的なUI/UX
- レスポンシブデザイン
- 最小限のアニメーション
- 禅的なミニマルデザイン

## 今後の拡張予定
- ベクターDBによる禅文献の検索機能
- 会話履歴の永続化
- 複数のAIモデル対応
- ユーザー認証機能

## 参考情報
- デザインイメージ：ミニマル、余白を活かした和風モダン
- トーン：穏やか、思慮深い、非説教的

## プロダクト名候補
1. **EnsoChat** - 円相（禅の象徴）とチャットの組み合わせ
2. **ZenMon（禅問）** - 禅問答から着想

## リポジトリ名
- `zenmon`