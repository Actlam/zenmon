import { test, expect } from '@playwright/test';

test.describe('ZenMon Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock mode を確実に有効にする
    await page.addInitScript(() => {
      window.localStorage.setItem('USE_MOCK_MODE', 'true');
    });
    
    await page.goto('/');
  });

  test('should display initial welcome state', async ({ page }) => {
    await expect(page.getByText('心静かに、お話しください')).toBeVisible();
    await expect(page.getByText('◯')).toBeVisible();
    
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
    
    const submitButton = page.getByRole('button', { name: /send/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeDisabled(); // 初期状態では無効
  });

  test('should enable submit button when input has text', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    await input.fill('こんにちは');
    await expect(submitButton).toBeEnabled();
    
    await input.clear();
    await expect(submitButton).toBeDisabled();
  });

  test('should send message and receive response', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // メッセージを送信
    await input.fill('こんにちは');
    await submitButton.click();
    
    // ユーザーメッセージが表示されることを確認
    await expect(page.getByText('こんにちは')).toBeVisible();
    
    // ローディング状態が表示されることを確認
    await expect(page.locator('.animate-pulse')).toBeVisible();
    
    // 応答が表示されることを確認（数秒以内）
    await expect(page.locator('text=心|静|呼吸|瞑想|今')).toBeVisible({ timeout: 10000 });
    
    // 入力フィールドがクリアされることを確認
    await expect(input).toHaveValue('');
    
    // 送信ボタンが再び無効になることを確認
    await expect(submitButton).toBeDisabled();
  });

  test('should handle multiple messages in conversation', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // 最初のメッセージ
    await input.fill('こんにちは');
    await submitButton.click();
    await expect(page.getByText('こんにちは')).toBeVisible();
    
    // 応答を待つ
    await page.waitForTimeout(2000);
    
    // 二番目のメッセージ
    await input.fill('人生について教えて');
    await submitButton.click();
    await expect(page.getByText('人生について教えて')).toBeVisible();
    
    // 両方のメッセージが表示されることを確認
    await expect(page.getByText('こんにちは')).toBeVisible();
    await expect(page.getByText('人生について教えて')).toBeVisible();
    
    // 応答も2つ表示されることを確認
    const responses = await page.locator('[class*="bg-stone-100"]').count();
    expect(responses).toBeGreaterThanOrEqual(2);
  });

  test('should handle Enter key submission', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    
    await input.fill('こんにちは');
    await input.press('Enter');
    
    // メッセージが送信されることを確認
    await expect(page.getByText('こんにちは')).toBeVisible();
    
    // ローディング状態が表示されることを確認
    await expect(page.locator('.animate-pulse')).toBeVisible();
  });

  test('should handle different types of messages', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    const testMessages = [
      'おはようございます', // 挨拶
      '人生とは何ですか', // 深い質問
      '辛くて悲しいです', // 感情的な内容
      'ありがとうございました', // 別れの挨拶
    ];
    
    for (const message of testMessages) {
      await input.fill(message);
      await submitButton.click();
      
      // メッセージが表示されることを確認
      await expect(page.getByText(message)).toBeVisible();
      
      // 応答を待つ
      await page.waitForTimeout(2000);
    }
    
    // すべてのメッセージが表示されることを確認
    for (const message of testMessages) {
      await expect(page.getByText(message)).toBeVisible();
    }
  });

  test('should scroll to bottom when new messages arrive', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // 複数のメッセージを送信してスクロールを発生させる
    const messages = [
      '最初のメッセージ',
      '二番目のメッセージ',
      '三番目のメッセージ',
      '四番目のメッセージ',
      '五番目のメッセージ',
    ];
    
    for (const message of messages) {
      await input.fill(message);
      await submitButton.click();
      
      // メッセージが表示されることを確認
      await expect(page.getByText(message)).toBeVisible();
      
      // 応答を待つ
      await page.waitForTimeout(1500);
    }
    
    // 最後のメッセージが表示されることを確認
    await expect(page.getByText('五番目のメッセージ')).toBeVisible();
  });

  test('should handle empty input gracefully', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // 空の入力では送信ボタンが無効
    await expect(submitButton).toBeDisabled();
    
    // スペースのみの入力でも送信ボタンが無効
    await input.fill('   ');
    await expect(submitButton).toBeDisabled();
    
    // 有効な入力で送信ボタンが有効
    await input.fill('テスト');
    await expect(submitButton).toBeEnabled();
  });

  test('should maintain responsive design on mobile', async ({ page }) => {
    // モバイルビューポートに設定
    await page.setViewportSize({ width: 375, height: 667 });
    
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // 要素が表示されることを確認
    await expect(input).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // メッセージを送信
    await input.fill('モバイルテスト');
    await submitButton.click();
    
    // メッセージが表示されることを確認
    await expect(page.getByText('モバイルテスト')).toBeVisible();
    
    // 応答を待つ
    await page.waitForTimeout(2000);
    
    // レスポンシブデザインが機能することを確認
    const chatContainer = page.locator('[class*="max-w-4xl"]');
    await expect(chatContainer).toBeVisible();
  });

  test('should handle rapid consecutive messages', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // 連続でメッセージを送信
    await input.fill('最初のメッセージ');
    await submitButton.click();
    
    // 少し待ってから次のメッセージ
    await page.waitForTimeout(500);
    await input.fill('二番目のメッセージ');
    await submitButton.click();
    
    // 両方のメッセージが表示されることを確認
    await expect(page.getByText('最初のメッセージ')).toBeVisible();
    await expect(page.getByText('二番目のメッセージ')).toBeVisible();
    
    // 適切な順序で表示されることを確認
    const userMessages = page.locator('[class*="bg-stone-600"]');
    await expect(userMessages).toHaveCount(2);
  });
});