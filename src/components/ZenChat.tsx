'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ZenChat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  // メッセージが追加されたときに自動スクロール
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // メッセージ配列が変更されたときにスクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ローディング状態が変更されたときにもスクロール
  useEffect(() => {
    if (isLoading) {
      // 少し遅延してスクロール（メッセージが追加される前に実行されるため）
      setTimeout(scrollToBottom, 100);
    }
  }, [isLoading]);

  // カスタムフォーム送信ハンドラー
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    // フォーム送信後に少し遅延してスクロール
    setTimeout(scrollToBottom, 200);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm rounded-lg shadow-lg border border-stone-200/50 dark:border-stone-700/50">
        
        <div 
          ref={messagesContainerRef}
          className="h-96 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="text-center text-stone-500 dark:text-stone-400 py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
                <span className="text-2xl">◯</span>
              </div>
              <p className="text-sm">心静かに、お話しください</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-3 rounded-lg text-sm leading-relaxed",
                  message.role === 'user'
                    ? 'bg-stone-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-stone-100 dark:bg-stone-800">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                <p className="text-sm">
                  申し訳ございません。少し時間をおいてからお試しください。
                </p>
                <details className="mt-2 text-xs opacity-70">
                  <summary>詳細</summary>
                  <pre className="mt-1 text-xs">{error.message}</pre>
                </details>
              </div>
            </div>
          )}
          
          {/* スクロール位置マーカー */}
          <div ref={messagesEndRef} className="h-0" />
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-stone-200/50 dark:border-stone-700/50">
          <div className="flex space-x-3">
            <input
              value={input}
              placeholder="何をお聞きになりたいでしょうか..."
              onChange={handleInputChange}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-transparent border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-500 focus:border-transparent placeholder-stone-500 dark:placeholder-stone-400 text-stone-800 dark:text-stone-200"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-stone-600 hover:bg-stone-700 disabled:bg-stone-300 dark:disabled:bg-stone-700 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}