import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ZenChat from '@/components/ZenChat';

// Mock the useChat hook from ai/react
const mockHandleSubmit = vi.fn();
const mockHandleInputChange = vi.fn();

vi.mock('ai/react', () => ({
  useChat: vi.fn(() => ({
    messages: [],
    input: '',
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    isLoading: false,
    error: null,
  })),
}));

describe('ZenChat Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render initial empty state', () => {
    render(<ZenChat />);
    
    expect(screen.getByText('心静かに、お話しください')).toBeInTheDocument();
    expect(screen.getByText('◯')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('何をお聞きになりたいでしょうか...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('should display messages when provided', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [
        { role: 'user', content: 'こんにちは' },
        { role: 'assistant', content: 'こんにちは。いかがお過ごしですか？' },
      ],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    expect(screen.getByText('こんにちは')).toBeInTheDocument();
    expect(screen.getByText('こんにちは。いかがお過ごしですか？')).toBeInTheDocument();
    expect(screen.queryByText('心静かに、お話しください')).not.toBeInTheDocument();
  });

  it('should style user and assistant messages differently', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [
        { role: 'user', content: 'ユーザーメッセージ' },
        { role: 'assistant', content: 'アシスタントメッセージ' },
      ],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    const userMessage = screen.getByText('ユーザーメッセージ');
    const assistantMessage = screen.getByText('アシスタントメッセージ');
    
    // ユーザーメッセージは右側に表示され、異なるスタイルを持つ
    expect(userMessage.parentElement).toHaveClass('bg-stone-600', 'text-white');
    expect(assistantMessage.parentElement).toHaveClass('bg-stone-100', 'dark:bg-stone-800');
  });

  it('should handle input changes', async () => {
    const user = userEvent.setup();
    
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: 'テストメッセージ',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    const input = screen.getByPlaceholderText('何をお聞きになりたいでしょうか...');
    await user.type(input, 'テスト');
    
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('should handle form submission', async () => {
    const user = userEvent.setup();
    
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: 'テストメッセージ',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    const form = screen.getByRole('button', { name: /send/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should disable input and submit button when loading', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: true,
      error: null,
    });

    render(<ZenChat />);
    
    const input = screen.getByPlaceholderText('何をお聞きになりたいでしょうか...');
    const submitButton = screen.getByRole('button', { name: /send/i });
    
    expect(input).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when input is empty', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when input has content', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: 'テストメッセージ',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    const submitButton = screen.getByRole('button', { name: /send/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('should show loading indicator when isLoading is true', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [
        { role: 'user', content: 'メッセージ' },
      ],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: true,
      error: null,
    });

    render(<ZenChat />);
    
    // ローディングインジケータ（点の動画）が表示される
    const loadingDots = screen.getAllByRole('generic').filter(
      el => el.classList.contains('animate-pulse')
    );
    expect(loadingDots).toHaveLength(3);
  });

  it('should display error message when error occurs', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: new Error('テストエラー'),
    });

    render(<ZenChat />);
    
    expect(screen.getByText('申し訳ございません。少し時間をおいてからお試しください。')).toBeInTheDocument();
    expect(screen.getByText('詳細')).toBeInTheDocument();
  });

  it('should show error details when clicked', async () => {
    const user = userEvent.setup();
    
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: new Error('テストエラー'),
    });

    render(<ZenChat />);
    
    const detailsButton = screen.getByText('詳細');
    await user.click(detailsButton);
    
    expect(screen.getByText('テストエラー')).toBeInTheDocument();
  });

  it('should handle multiple messages with proper ordering', () => {
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [
        { role: 'user', content: '最初のメッセージ' },
        { role: 'assistant', content: '最初の返答' },
        { role: 'user', content: '二番目のメッセージ' },
        { role: 'assistant', content: '二番目の返答' },
      ],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    const messages = screen.getAllByText(/メッセージ|返答/);
    expect(messages).toHaveLength(4);
    
    // メッセージの順序が正しいか確認
    expect(messages[0]).toHaveTextContent('最初のメッセージ');
    expect(messages[1]).toHaveTextContent('最初の返答');
    expect(messages[2]).toHaveTextContent('二番目のメッセージ');
    expect(messages[3]).toHaveTextContent('二番目の返答');
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    
    const { useChat } = require('ai/react');
    useChat.mockReturnValue({
      messages: [],
      input: 'テストメッセージ',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    render(<ZenChat />);
    
    const input = screen.getByPlaceholderText('何をお聞きになりたいでしょうか...');
    await user.click(input);
    await user.keyboard('{Enter}');
    
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('should scroll to bottom when new messages arrive', async () => {
    const scrollIntoViewMock = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const { useChat } = require('ai/react');
    const { rerender } = render(<ZenChat />);
    
    // 最初は空のメッセージ
    useChat.mockReturnValue({
      messages: [],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    // 新しいメッセージが追加される
    useChat.mockReturnValue({
      messages: [
        { role: 'user', content: '新しいメッセージ' },
      ],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      isLoading: false,
      error: null,
    });

    rerender(<ZenChat />);
    
    // scrollIntoViewが呼ばれることを確認
    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'end'
      });
    });
  });
});