import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Test user credentials
const TEST_USER = {
  firstName: 'NoLogout',
  lastName: 'Test',
  email: 'nologout@example.com',
  password: 'testpassword123'
};

/**
 * Helper to create and authenticate a user
 */
async function createAndAuthenticateUser(page: Page) {
  await page.goto('/app/auth/register');
  await page.fill('[name="firstName"]', TEST_USER.firstName);
  await page.fill('[name="lastName"]', TEST_USER.lastName);
  await page.fill('[name="email"]', TEST_USER.email);
  await page.fill('[name="password"]', TEST_USER.password);
  await page.fill('[name="passwordConfirm"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/bullshift', { timeout: 10000 });
}

test.describe('No Logout on API Errors', () => {
  
  test('should stay logged in when analyzeChat fails with 401', async ({ page }) => {
    await createAndAuthenticateUser(page);
    
    // Navigate to bullshift page
    await page.goto('/bullshift');
    await page.waitForTimeout(1000);
    
    // Mock a failing analyzeChat API call
    await page.route('**/api/ai/bullshift/analyzeChat', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'User not authenticated' })
      });
    });
    
    // Try to trigger analyzeChat by interacting with the chat
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      // Fill message and try to send
      const textArea = page.locator('textarea').first();
      if (await textArea.isVisible()) {
        await textArea.fill('Test message that will trigger analysis');
        await sendButton.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // Verify user is still on bullshift page and not redirected to login
    const currentUrl = page.url();
    expect(currentUrl).toContain('/bullshift');
    expect(currentUrl).not.toContain('/auth/login');
    
    // Check that no redirect to login happened
    const loginElements = page.locator('text=Login, text=Anmelden, [name="email"]');
    expect(await loginElements.count()).toBe(0);
  });

  test('should show error message instead of redirecting on API failure', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Mock failing send API call
    await page.route('**/api/ai/bullshift/send', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Authentication failed' })
      });
    });
    
    // Try to send a message
    const textArea = page.locator('textarea').first();
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    
    if (await textArea.isVisible() && await sendButton.isVisible()) {
      await textArea.fill('Test message');
      await sendButton.click();
      await page.waitForTimeout(2000);
      
      // Should show error message instead of redirecting
      const errorMessage = page.locator('text=konnte nicht gesendet werden, text=versuche es erneut');
      expect(await errorMessage.count()).toBeGreaterThan(0);
    }
    
    // Still should be on bullshift page
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
  });

  test('should handle multiple failed API calls without logout', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Mock multiple API endpoints to fail
    await page.route('**/api/ai/bullshift/**', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Authentication failed' })
      });
    });
    
    // Try to make multiple API calls through UI interactions
    await page.waitForTimeout(3000); // Let any auto-requests fail
    
    // Navigate within the app to trigger more API calls
    const navigation = page.locator('nav a, [href*="/bullshift"]').first();
    if (await navigation.isVisible()) {
      await navigation.click();
      await page.waitForTimeout(1000);
    }
    
    // User should still be authenticated and on the app
    expect(page.url()).not.toContain('/auth/login');
    expect(page.url()).not.toContain('/auth/register');
    
    // Should still have app UI elements visible
    const appElements = page.locator('nav, header, [class*="bullshift"]');
    expect(await appElements.count()).toBeGreaterThan(0);
  });

  test('should preserve user session through network errors', async ({ page }) => {
    await createAndAuthenticateUser(page);
    
    // Simulate network failure on API calls
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });
    
    await page.goto('/bullshift');
    await page.waitForTimeout(2000);
    
    // Even with network failures, user should stay logged in
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
    
    // Remove network failure and verify session is still valid
    await page.unroute('**/api/**');
    
    // Make a successful API call to verify session persistence
    await page.route('**/api/ai/bullshift/initChat', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ chatId: 'test-chat-id', success: true })
      });
    });
    
    // Try to reload the page - should not redirect to login
    await page.reload();
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
  });

  test('should handle server errors gracefully without logout', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Mock server errors (500, 503, etc.)
    await page.route('**/api/ai/bullshift/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.waitForTimeout(2000);
    
    // Server errors should not cause logout
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
    
    // User interface should still be accessible
    const chatInterface = page.locator('textarea, input[type="text"]');
    expect(await chatInterface.count()).toBeGreaterThan(0);
  });

  test('should maintain authentication after token refresh failures', async ({ page }) => {
    await createAndAuthenticateUser(page);
    
    // Mock token refresh to fail, but don't clear the session completely
    await page.route('**/api/collections/users/auth-refresh', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Token refresh failed' })
      });
    });
    
    await page.goto('/bullshift');
    await page.waitForTimeout(3000); // Allow token refresh attempt to fail
    
    // User should still be on the app page
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
    
    // App should still function (though some features might be limited)
    const appHeader = page.locator('header, nav, [role="banner"]');
    expect(await appHeader.count()).toBeGreaterThan(0);
  });

  test('should show appropriate error messages for different failure types', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Mock different types of API failures
    await page.route('**/api/ai/bullshift/send', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Authentication failed' })
      });
    });
    
    const textArea = page.locator('textarea').first();
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    
    if (await textArea.isVisible() && await sendButton.isVisible()) {
      await textArea.fill('Test error handling');
      await sendButton.click();
      await page.waitForTimeout(2000);
    }
    
    // Should have appropriate error logging
    const authErrors = consoleErrors.filter(error => 
      error.includes('authentication failed') || 
      error.includes('keeping user logged in')
    );
    expect(authErrors.length).toBeGreaterThan(0);
    
    // Should NOT have redirect-related errors
    const redirectErrors = consoleErrors.filter(error => 
      error.includes('redirecting to login') ||
      error.includes('window.location.href')
    );
    expect(redirectErrors.length).toBe(0);
  });
});