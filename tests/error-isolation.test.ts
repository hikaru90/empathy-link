import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Test user credentials
const TEST_USER = {
  firstName: 'ErrorTest',
  lastName: 'User',
  email: 'errortest@example.com',
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

test.describe('Error Isolation - No Logouts', () => {
  
  test('trace failures should not cause logout', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Mock traces collection to always fail
    await page.route('**/collections/traces/**', (route) => {
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to create record.' })
      });
    });
    
    // Mock other API to succeed but trigger trace saves
    await page.route('**/api/ai/bullshift/send', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          response: 'Test response', 
          timestamp: Date.now() 
        })
      });
    });
    
    // Try to send a message (which will trigger trace saving)
    const textArea = page.locator('textarea').first();
    const sendButton = page.locator('button:has-text("Send"), button[type="submit"]').first();
    
    if (await textArea.isVisible() && await sendButton.isVisible()) {
      await textArea.fill('Test message');
      await sendButton.click();
      await page.waitForTimeout(2000);
    }
    
    // User should still be logged in despite trace failures
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
  });

  test('database relation errors should not cause logout', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Mock various database operations to fail
    await page.route('**/collections/memories/**', (route) => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid relation ID' })
      });
    });
    
    await page.route('**/collections/analyses/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database error' })
      });
    });
    
    // Navigate to stats page which uses these collections
    await page.goto('/bullshift/stats');
    await page.waitForTimeout(2000);
    
    // Should not be redirected to login despite database errors
    const currentUrl = page.url();
    expect(currentUrl).toContain('/bullshift');
    expect(currentUrl).not.toContain('/auth/login');
  });

  test('PocketBase collection errors should be logged but not crash', async ({ page }) => {
    await createAndAuthenticateUser(page);
    
    // Track console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/bullshift');
    
    // Mock collection operations to fail
    await page.route('**/collections/**', (route) => {
      // Let auth-related requests pass, but fail others
      if (route.request().url().includes('auth-refresh') || 
          route.request().url().includes('users')) {
        route.continue();
      } else {
        route.fulfill({
          status: 403,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Collection access denied' })
        });
      }
    });
    
    await page.waitForTimeout(3000);
    
    // Should have error logs but still be authenticated
    expect(consoleErrors.length).toBeGreaterThan(0);
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
    
    // Should have trace-related error logs
    const traceErrors = consoleErrors.filter(error => 
      error.includes('Failed to save trace') || 
      error.includes('non-critical')
    );
    expect(traceErrors.length).toBeGreaterThan(0);
  });

  test('multiple concurrent API failures should not cause logout', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Mock multiple APIs to fail simultaneously
    const failingEndpoints = [
      '**/api/ai/bullshift/analyzeChat',
      '**/api/ai/bullshift/extractMemories', 
      '**/collections/traces/**',
      '**/collections/memories/**',
      '**/collections/analyses/**'
    ];
    
    for (const endpoint of failingEndpoints) {
      await page.route(endpoint, (route) => {
        route.fulfill({
          status: Math.random() > 0.5 ? 500 : 403,
          contentType: 'application/json',
          body: JSON.stringify({ 
            error: `Simulated failure for ${endpoint}` 
          })
        });
      });
    }
    
    // Try various operations that would trigger these APIs
    await page.waitForTimeout(2000);
    
    // Navigate around the app
    const navigation = page.locator('a[href*="/bullshift"]').first();
    if (await navigation.isVisible()) {
      await navigation.click();
      await page.waitForTimeout(1000);
    }
    
    // Despite all these failures, user should remain logged in
    expect(page.url()).toContain('/bullshift');
    expect(page.url()).not.toContain('/auth/login');
  });

  test('server load function errors should not cause logout', async ({ page }) => {
    await createAndAuthenticateUser(page);
    
    // Mock user data to be invalid in server load
    await page.route('**/collections/users/**', (route) => {
      // Simulate auth refresh failure
      if (route.request().url().includes('auth-refresh')) {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Token expired' })
        });
      } else {
        route.continue();
      }
    });
    
    // Navigate to stats page which has server load function
    await page.goto('/bullshift/stats');
    await page.waitForTimeout(2000);
    
    // Should handle server load errors gracefully
    const currentUrl = page.url();
    // Either stays on stats with error state, or redirects but not to login
    if (currentUrl.includes('/auth/login')) {
      // This would be a failure - we don't want redirects to login
      expect(currentUrl).not.toContain('/auth/login');
    }
  });

  test('async error propagation should be contained', async ({ page }) => {
    await createAndAuthenticateUser(page);
    await page.goto('/bullshift');
    
    // Track unhandled promise rejections
    const unhandledRejections: string[] = [];
    await page.addInitScript(() => {
      window.addEventListener('unhandledrejection', (event) => {
        (window as any).unhandledRejections = (window as any).unhandledRejections || [];
        (window as any).unhandledRejections.push(event.reason.toString());
      });
    });
    
    // Mock various async operations to fail
    await page.route('**/api/**', (route) => {
      // Let essential auth pass
      if (route.request().url().includes('auth')) {
        route.continue();
      } else {
        // Randomly fail other requests
        if (Math.random() > 0.7) {
          route.abort('failed');
        } else {
          route.fulfill({
            status: 500,
            contentType: 'application/json', 
            body: JSON.stringify({ error: 'Random failure' })
          });
        }
      }
    });
    
    await page.waitForTimeout(5000);
    
    // Check for unhandled rejections
    const rejections = await page.evaluate(() => (window as any).unhandledRejections || []);
    
    // Should not have auth-related unhandled rejections that could cause logout
    const authRejections = rejections.filter((r: string) => 
      r.includes('401') && r.includes('auth')
    );
    expect(authRejections.length).toBe(0);
    
    // User should still be logged in
    expect(page.url()).toContain('/bullshift');
  });
});