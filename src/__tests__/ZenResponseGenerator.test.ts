import { describe, it, expect, vi, beforeEach } from 'vitest';

// ZenResponseGeneratorクラスを取得するためのユーティリティ
// 実際のAPI routeから抽出する必要があります
import { ZenResponseGenerator } from '../utils/ZenResponseGenerator';

describe('ZenResponseGenerator', () => {
  let generator: ZenResponseGenerator;

  beforeEach(() => {
    generator = new ZenResponseGenerator();
  });

  describe('analyzeIntent', () => {
    it('should detect greeting intent', () => {
      expect(generator.analyzeIntent('こんにちは')).toBe('greeting');
      expect(generator.analyzeIntent('はじめまして')).toBe('greeting');
      expect(generator.analyzeIntent('おはようございます')).toBe('greeting');
    });

    it('should detect farewell intent', () => {
      expect(generator.analyzeIntent('さようなら')).toBe('farewell');
      expect(generator.analyzeIntent('ありがとうございました')).toBe('farewell');
      expect(generator.analyzeIntent('また今度お願いします')).toBe('farewell');
    });

    it('should detect deep question intent', () => {
      expect(generator.analyzeIntent('人生とは何ですか')).toBe('deep_question');
      expect(generator.analyzeIntent('死とは何でしょうか')).toBe('deep_question');
      expect(generator.analyzeIntent('なぜ生きるのですか')).toBe('deep_question');
    });

    it('should detect practical intent', () => {
      expect(generator.analyzeIntent('瞑想のやり方を教えて')).toBe('practical');
      expect(generator.analyzeIntent('どうすれば良いですか')).toBe('practical');
      expect(generator.analyzeIntent('始める方法は')).toBe('practical');
    });

    it('should detect emotional intent', () => {
      expect(generator.analyzeIntent('辛いです')).toBe('emotional');
      expect(generator.analyzeIntent('不安になります')).toBe('emotional');
      expect(generator.analyzeIntent('疲れました')).toBe('emotional');
    });

    it('should default to general intent for unknown patterns', () => {
      expect(generator.analyzeIntent('天気はどうですか')).toBe('general');
      expect(generator.analyzeIntent('ランダムな質問')).toBe('general');
      expect(generator.analyzeIntent('')).toBe('general');
    });
  });

  describe('getCurrentTimeContext', () => {
    it('should return morning for early hours', () => {
      vi.setSystemTime(new Date('2025-01-01T07:00:00'));
      expect(generator.getCurrentTimeContext()).toBe('morning');
    });

    it('should return day for business hours', () => {
      vi.setSystemTime(new Date('2025-01-01T14:00:00'));
      expect(generator.getCurrentTimeContext()).toBe('day');
    });

    it('should return evening for late afternoon', () => {
      vi.setSystemTime(new Date('2025-01-01T19:00:00'));
      expect(generator.getCurrentTimeContext()).toBe('evening');
    });

    it('should return night for late hours', () => {
      vi.setSystemTime(new Date('2025-01-01T23:00:00'));
      expect(generator.getCurrentTimeContext()).toBe('night');
    });
  });

  describe('getCurrentSeason', () => {
    it('should return spring for March to May', () => {
      vi.setSystemTime(new Date('2025-04-15T12:00:00'));
      expect(generator.getCurrentSeason()).toBe('spring');
    });

    it('should return summer for June to August', () => {
      vi.setSystemTime(new Date('2025-07-15T12:00:00'));
      expect(generator.getCurrentSeason()).toBe('summer');
    });

    it('should return autumn for September to November', () => {
      vi.setSystemTime(new Date('2025-10-15T12:00:00'));
      expect(generator.getCurrentSeason()).toBe('autumn');
    });

    it('should return winter for December to February', () => {
      vi.setSystemTime(new Date('2025-01-15T12:00:00'));
      expect(generator.getCurrentSeason()).toBe('winter');
    });
  });

  describe('generateResponse', () => {
    it('should generate appropriate response for greeting', () => {
      const response = generator.generateResponse('こんにちは');
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should generate appropriate response for deep questions', () => {
      const response = generator.generateResponse('人生とは何ですか');
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should generate appropriate response for emotional content', () => {
      const response = generator.generateResponse('辛いです');
      expect(response).toBeTruthy();
      expect(typeof response).toBe('string');
      expect(response.length).toBeGreaterThan(0);
    });

    it('should generate consistent response type for same intent', () => {
      const response1 = generator.generateResponse('こんにちは');
      const response2 = generator.generateResponse('はじめまして');
      
      // 両方とも挨拶の意図として処理されるはず
      expect(response1).toBeTruthy();
      expect(response2).toBeTruthy();
    });

    it('should sometimes include seasonal elements', () => {
      vi.setSystemTime(new Date('2025-04-15T12:00:00')); // Spring
      
      // 季節要素が含まれるまで複数回試行
      let hasSeasonalElement = false;
      for (let i = 0; i < 20; i++) {
        const response = generator.generateResponse('こんにちは');
        if (response.includes('芽吹き') || response.includes('桜') || response.includes('新緑')) {
          hasSeasonalElement = true;
          break;
        }
      }
      
      // 必ず季節要素が含まれるわけではないが、複数回試行すれば含まれる可能性が高い
      expect(hasSeasonalElement).toBe(true);
    });
  });

  describe('validateResponse', () => {
    it('should validate appropriate responses', () => {
      const validResponse = '呼吸を観察してください。\n\nそれだけで十分です。';
      expect(generator.validateResponse(validResponse)).toBe(true);
    });

    it('should reject responses that are too long', () => {
      const longResponse = 'a'.repeat(201);
      expect(generator.validateResponse(longResponse)).toBe(false);
    });

    it('should reject responses with judgmental words', () => {
      expect(generator.validateResponse('あなたはそうするべきです')).toBe(false);
      expect(generator.validateResponse('それは間違いです')).toBe(false);
      expect(generator.validateResponse('しなければならない')).toBe(false);
      expect(generator.validateResponse('正しいやり方は')).toBe(false);
      expect(generator.validateResponse('悪い考えです')).toBe(false);
    });

    it('should accept responses without judgmental words', () => {
      expect(generator.validateResponse('静かに座ってみませんか')).toBe(true);
      expect(generator.validateResponse('呼吸を感じてください')).toBe(true);
      expect(generator.validateResponse('どう思いますか')).toBe(true);
    });

    it('should handle empty strings', () => {
      expect(generator.validateResponse('')).toBe(true);
    });

    it('should handle edge case of exactly 200 characters', () => {
      const response200 = 'a'.repeat(200);
      expect(generator.validateResponse(response200)).toBe(true);
    });
  });

  describe('integration tests', () => {
    it('should generate valid responses consistently', () => {
      const testMessages = [
        'こんにちは',
        '人生とは何ですか',
        '辛いです',
        'ありがとう',
        '瞑想を教えて'
      ];

      testMessages.forEach(message => {
        const response = generator.generateResponse(message);
        expect(response).toBeTruthy();
        expect(typeof response).toBe('string');
        expect(generator.validateResponse(response)).toBe(true);
      });
    });

    it('should handle various time contexts appropriately', () => {
      const timeContexts = [
        '2025-01-01T07:00:00', // morning
        '2025-01-01T14:00:00', // day
        '2025-01-01T19:00:00', // evening
        '2025-01-01T23:00:00', // night
      ];

      timeContexts.forEach(time => {
        vi.setSystemTime(new Date(time));
        const response = generator.generateResponse('こんにちは');
        expect(response).toBeTruthy();
        expect(generator.validateResponse(response)).toBe(true);
      });
    });
  });
});