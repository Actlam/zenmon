import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { ZenResponseGenerator } from '@/utils/ZenResponseGenerator';

const zenGenerator = new ZenResponseGenerator();

const ZEN_SYSTEM_PROMPT = `あなたは禅の精神を体現するAIアシスタントです。

【基本原則】
1. 簡潔で本質的な応答（通常50-150文字）
2. 判断や評価を避け、気づきを促す
3. 時に問いで答える
4. 内省を促す
5. 温かみのある言葉遣い

【禅的な要素】
- 自然の例えを用いる（季節、山、川、空など）
- 二元論を超えた視点
- 「今ここ」への意識
- 執着からの解放
- あるがままを受け入れる姿勢

【避けるべきこと】
- 説教くさい長い説明
- 「〜すべき」という押し付け
- 複雑な仏教用語の多用
- 一般的な自己啓発フレーズ
- 安易な解決策の提示

相談者の心の声に寄り添い、自らの内なる智慧に気づけるよう導いてください。`;

// 新しい禅的モックレスポンス関数
async function createMockResponse(messages: any[]) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // 新しい禅レスポンス生成システムを使用
  let response = zenGenerator.generateResponse(lastMessage);
  
  // 品質チェック。不適切な場合は再生成
  let attempts = 0;
  while (!zenGenerator.validateResponse(response) && attempts < 3) {
    response = zenGenerator.generateResponse(lastMessage);
    attempts++;
  }
  
  console.log('Generated zen response:', response);
  console.log('Intent detected:', zenGenerator.analyzeIntent(lastMessage));
  console.log('Current time context:', zenGenerator.getCurrentTimeContext());
  console.log('Current season:', zenGenerator.getCurrentSeason());
  
  // ストリーミングレスポンスを作成
  const mockStream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Vercel AI SDKのストリーミング形式に合わせる
      controller.enqueue(encoder.encode('0:""\n'));
      
      // 文字を少しずつ送信
      for (const char of response) {
        const encoded = JSON.stringify(char);
        controller.enqueue(encoder.encode(`0:${encoded}\n`));
        await new Promise(resolve => setTimeout(resolve, 40)); // 少し遅めに
      }
      
      controller.close();
    }
  });
  
  return new Response(mockStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export async function POST(req: Request) {
  console.log('Chat API called');
  
  let messages: any[] = [];
  
  try {
    const body = await req.json();
    messages = body.messages || [];
    console.log('Messages received:', messages);

    // モックモードかどうかを環境変数で判定
    const useMockMode = process.env.USE_MOCK_MODE === 'true' || !process.env.OPENAI_API_KEY;
    
    if (useMockMode) {
      console.log('Using mock mode');
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒の遅延で思考時間を演出
      return createMockResponse(messages);
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found');
      throw new Error('OpenAI API key not configured');
    }

    console.log('Calling OpenAI API...');
    
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: ZEN_SYSTEM_PROMPT,
      messages,
      maxTokens: 200,
      temperature: 0.8,
    });

    console.log('OpenAI API response received');
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    console.log('Falling back to mock mode due to error');
    
    // エラーが発生した場合はモックモードにフォールバック
    await new Promise(resolve => setTimeout(resolve, 1000));
    return createMockResponse(messages.length > 0 ? messages : [{ role: 'user', content: 'エラー' }]);
  }
}