import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// 禅的応答生成システム
class ZenResponseGenerator {
  private intentPatterns = {
    greeting: ["こんにちは", "はじめまして", "よろしく", "おはよう", "こんばんは"],
    farewell: ["さようなら", "ありがとう", "また", "失礼", "おやすみ"],
    deep_question: ["人生とは", "死とは", "愛とは", "意味とは", "幸せとは", "生きる", "なぜ"],
    practical: ["やり方", "方法", "どうすれば", "教えて", "学び", "始め", "瞑想"],
    emotional: ["辛い", "悲しい", "不安", "怖い", "寂しい", "ストレス", "疲れ", "痛い", "苦しい"]
  };

  private responseTemplates = {
    greeting: {
      morning: ["朝の静けさに包まれて。\n\n今日という日に、何を見つけられるでしょうか？"],
      day: ["日中の光の中で。\n\n今この瞬間に、心はどこにありますか？"],
      evening: ["夕暮れの穏やかさとともに。\n\n一日を振り返って、何を感じますか？"],
      night: ["夜の静寂の中で。\n\nその静けさに、何が宿っているでしょうか？"]
    },
    farewell: [
      "歩む道に、心の平安がありますように。",
      "今日の気づきが、明日の智慧となりますように。",
      "この瞬間の静けさを、心に留めて。"
    ],
    deep_question: [
      "問いそのものが、既に答えを含んでいるかもしれません。\n\nその問いは、どこから生まれたのでしょうか？",
      "言葉で捉えようとするとき、本質は逃げていきます。\n\n言葉を超えたところに、何がありますか？",
      "川は流れることで川であり続けます。\n\nあなたは何であり続けているのでしょうか？",
      "月は指差す指ではありません。\n\n何を探しているのですか？"
    ],
    practical: [
      "座ってください。呼吸を観察してください。\n\nそれだけで十分です。",
      "一歩ずつ。急がず、焦らず。\n\n今できることから始めてみませんか？",
      "答えを求めるより、問いと共に座ってみてください。\n\n何が見えてきますか？",
      "手を開いてください。握りしめているものを手放して。\n\nその空いた手に、何が宿るでしょうか？"
    ],
    emotional: [
      "その痛みも、あなたの一部です。\n\n押し退けず、そっと寄り添ってみませんか？",
      "嵐の中でも、空は変わらず広がっています。\n\nあなたの中にも、そんな静けさがありませんか？",
      "呼吸に意識を向けてください。\n\n吸って、吐いて。今、ここにいることを感じて。",
      "雲は形を変えて流れていきます。\n\n感情もまた、同じではないでしょうか？"
    ],
    general: [
      "風はただ吹いています。\n\nあなたは今、何を感じていますか？",
      "石は投げ込まれた池に波紋を作ります。\n\nその波紋は、やがて静まります。",
      "...。\n\n静寂の中に、すべてがあります。",
      "鳥は歌い、花は咲きます。\n\nそれぞれが、ただあるがままに。"
    ]
  };

  private seasonalElements = {
    spring: ["芽吹き", "桜", "新緑", "そよ風", "始まり"],
    summer: ["青空", "緑陰", "清流", "蝉の声", "生命力"],
    autumn: ["紅葉", "実り", "風涼し", "月", "無常"],
    winter: ["雪", "静寂", "内なる火", "暖炉", "深淵"]
  };

  analyzeIntent(message: string): string {
    for (const [intent, keywords] of Object.entries(this.intentPatterns)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return intent;
      }
    }
    return "general";
  }

  getCurrentTimeContext(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) return "morning";
    if (hour >= 9 && hour < 17) return "day";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }

  getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
  }

  generateResponse(message: string): string {
    const intent = this.analyzeIntent(message);
    const timeContext = this.getCurrentTimeContext();
    const season = this.getCurrentSeason();

    let templates = this.responseTemplates[intent as keyof typeof this.responseTemplates];
    
    if (intent === "greeting" && typeof templates === "object") {
      templates = (templates as any)[timeContext] || (templates as any)["day"];
    }

    const responseArray = Array.isArray(templates) ? templates : [templates].flat();
    const selectedResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    // 季節的要素を時々追加
    if (Math.random() < 0.3) {
      const seasonalElement = this.seasonalElements[season][Math.floor(Math.random() * this.seasonalElements[season].length)];
      return `${seasonalElement}の季節。\n\n${selectedResponse}`;
    }

    return selectedResponse;
  }

  // 品質チェック
  validateResponse(response: string): boolean {
    // 長すぎないか（200文字以内）
    if (response.length > 200) return false;
    
    // 判断的な表現を含んでいないか
    const judgmentalWords = ["べき", "しなければ", "間違い", "正しい", "悪い"];
    if (judgmentalWords.some(word => response.includes(word))) return false;
    
    return true;
  }
}

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
    console.log('API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('API Key length:', process.env.OPENAI_API_KEY?.length || 0);
    
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