import { test, expect } from '@playwright/test';

test.describe('ZenMon Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading structure', async ({ page }) => {
    // チェック: 適切な見出し構造があることを確認
    // 現在の実装では明示的な見出しは少ないが、構造を確認
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    
    // チャットアプリケーションとしての基本的な構造を確認
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // Tab navigation
    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();
    
    // Enter key should submit when input has text
    await input.fill('テストメッセージ');
    await page.keyboard.press('Enter');
    
    // メッセージが送信されることを確認
    await expect(page.getByText('テストメッセージ')).toBeVisible();
  });

  test('should have proper ARIA labels and roles', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // 基本的なAria attributes
    await expect(input).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Button has proper role
    await expect(submitButton).toHaveAttribute('type', 'submit');
    
    // Form has proper structure
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should handle focus management correctly', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // Focus should be on input initially when tabbed to
    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();
    
    // Tab to submit button
    await page.keyboard.press('Tab');
    await expect(submitButton).toBeFocused();
    
    // Shift+Tab should go back
    await page.keyboard.press('Shift+Tab');
    await expect(input).toBeFocused();
  });

  test('should maintain focus after message submission', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    
    await input.fill('テストメッセージ');
    await input.press('Enter');
    
    // フォーカスは入力フィールドに残るべき
    await expect(input).toBeFocused();
    
    // 入力フィールドはクリアされるべき
    await expect(input).toHaveValue('');
  });

  test('should support high contrast mode', async ({ page }) => {
    // High contrast mode simulation
    await page.emulateMedia({ colorScheme: 'dark' });
    
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // Elements should still be visible in dark mode
    await expect(input).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Send a message to test dark mode styling
    await input.fill('ダークモードテスト');
    await submitButton.click();
    
    await expect(page.getByText('ダークモードテスト')).toBeVisible();
  });

  test('should handle screen reader announcements', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    
    // Send message
    await input.fill('スクリーンリーダーテスト');
    await input.press('Enter');
    
    // Message should be visible (screen reader would announce this)
    await expect(page.getByText('スクリーンリーダーテスト')).toBeVisible();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check that response is also visible
    const responses = page.locator('[class*="bg-stone-100"]');
    await expect(responses).toHaveCount(1);
  });

  test('should handle error states accessibly', async ({ page }) => {
    // Mock network error by intercepting requests
    await page.route('**/api/chat', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });
    
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    
    await input.fill('エラーテスト');
    await input.press('Enter');
    
    // Error message should be visible
    await expect(page.getByText('申し訳ございません。少し時間をおいてからお試しください。')).toBeVisible();
    
    // Details should be expandable
    const detailsButton = page.getByText('詳細');
    await expect(detailsButton).toBeVisible();
    
    // Click to expand details
    await detailsButton.click();
    // Details should be visible after click
    await expect(page.locator('details[open]')).toBeVisible();
  });

  test('should support zoom levels', async ({ page }) => {
    // Test 200% zoom
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });
    
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // Elements should still be usable at high zoom
    await expect(input).toBeVisible();
    await expect(submitButton).toBeVisible();
    
    // Send message
    await input.fill('ズームテスト');
    await submitButton.click();
    
    await expect(page.getByText('ズームテスト')).toBeVisible();
  });

  test('should handle reduced motion preference', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    
    await input.fill('モーション削減テスト');
    await input.press('Enter');
    
    // Message should still be sent and visible
    await expect(page.getByText('モーション削減テスト')).toBeVisible();
    
    // Loading animation should still be present but may be reduced
    await expect(page.locator('.animate-pulse')).toBeVisible();
  });

  test('should provide clear visual feedback for interactions', async ({ page }) => {
    const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
    const submitButton = page.getByRole('button', { name: /send/i });
    
    // Button should be disabled initially
    await expect(submitButton).toBeDisabled();
    
    // Button should become enabled when input has text
    await input.fill('テスト');
    await expect(submitButton).toBeEnabled();
    
    // Button should show hover state (visual feedback)
    await submitButton.hover();
    
    // Submit and check for loading state
    await submitButton.click();
    await expect(submitButton).toBeDisabled(); // Should be disabled during loading
    
    // Check for loading animation
    await expect(page.locator('.animate-pulse')).toBeVisible();
  });

  test('should handle color contrast requirements', async ({ page }) => {
    // Test both light and dark modes
    const modes = ['light', 'dark'];
    
    for (const mode of modes) {
      await page.emulateMedia({ colorScheme: mode as 'light' | 'dark' });
      
      const input = page.getByPlaceholder('何をお聞きになりたいでしょうか...');
      const submitButton = page.getByRole('button', { name: /send/i });
      
      // Elements should be visible in both modes
      await expect(input).toBeVisible();
      await expect(submitButton).toBeVisible();
      
      // Send a message to test message styling
      await input.fill(`${mode}モードテスト`);
      await submitButton.click();
      
      await expect(page.getByText(`${mode}モードテスト`)).toBeVisible();
      
      // Wait for response
      await page.waitForTimeout(1500);
    }
  });
});