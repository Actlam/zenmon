import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // ストリーミングではない通常のテキスト生成をテスト
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages,
      maxTokens: 50,
    });

    return Response.json({ 
      success: true, 
      message: result.text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat test error:', error);
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}