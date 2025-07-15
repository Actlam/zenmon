import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/chat/route';

// Mock the OpenAI API
vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(() => ({})),
}));

vi.mock('ai', () => ({
  streamText: vi.fn(() => ({
    toDataStreamResponse: vi.fn(() => 
      new Response('mocked response', { status: 200 })
    ),
  })),
}));

describe('Chat API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // デフォルトでモックモードを有効にする
    process.env.USE_MOCK_MODE = 'true';
    delete process.env.OPENAI_API_KEY;
  });

  describe('POST /api/chat', () => {
    it('should handle basic chat request in mock mode', async () => {
      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'こんにちは' }
          ],
        }),
      });

      const response = await POST(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
      
      // レスポンスボディを読み取り
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }
      
      expect(result).toBeTruthy();
      expect(result).toContain('0:'); // Vercel AI SDK streaming format
    });

    it('should handle greeting messages appropriately', async () => {
      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'おはようございます' }
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }
      
      expect(result).toBeTruthy();
    });

    it('should handle deep questions appropriately', async () => {
      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: '人生とは何ですか？' }
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }
      
      expect(result).toBeTruthy();
    });

    it('should handle emotional content appropriately', async () => {
      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: '辛くて悲しいです' }
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }
      
      expect(result).toBeTruthy();
    });

    it('should handle empty messages array', async () => {
      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle invalid JSON gracefully', async () => {
      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      const response = await POST(request);
      expect(response.status).toBe(200); // フォールバックでモックレスポンスを返す
    });

    it('should handle multiple messages in conversation', async () => {
      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'こんにちは' },
            { role: 'assistant', content: '今日はいかがお過ごしですか？' },
            { role: 'user', content: '人生について考えています' }
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }
      
      expect(result).toBeTruthy();
    });

    it('should work with OpenAI API when key is provided', async () => {
      // OpenAI API キーを設定
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.USE_MOCK_MODE = 'false';

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'こんにちは' }
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should fall back to mock mode when OpenAI API fails', async () => {
      process.env.OPENAI_API_KEY = 'test-key';
      process.env.USE_MOCK_MODE = 'false';

      // streamTextがエラーを投げるようにモック
      const { streamText } = await import('ai');
      vi.mocked(streamText).mockImplementationOnce(() => {
        throw new Error('OpenAI API error');
      });

      const request = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'こんにちは' }
          ],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
      }
      
      expect(result).toBeTruthy();
    });
  });
});