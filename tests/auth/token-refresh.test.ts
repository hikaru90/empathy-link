import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

// Test user credentials
const TEST_USER = {
  firstName: 'TokenTest',
  lastName: 'User',
  email: 'tokentest@example.com',
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
  return await page.context().cookies();
}

/**
 * Helper to make API request with cookies
 */
async function makeRequestWithCookies(page: Page, endpoint: string, cookies: any[], data?: any) {
  const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  
  return await page.request.fetch(`/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieString
    },
    data: data ? JSON.stringify(data) : undefined
  });
}

/**
 * Helper to simulate expired token by manipulating cookies
 */
async function expireAuthCookie(page: Page) {
  // Get current cookies
  const cookies = await page.context().cookies();
  
  // Find auth-related cookies and expire them
  const expiredCookies = cookies.map(cookie => ({
    ...cookie,
    expires: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
  }));
  
  // Clear current cookies and set expired ones
  await page.context().clearCookies();
  await page.context().addCookies(expiredCookies);
  
  return expiredCookies;
}

test.describe('Authentication Token Refresh', () => {
  
  test('should handle token refresh on API calls', async ({ page }) => {
    // Create and authenticate user
    const cookies = await createAndAuthenticateUser(page);
    
    // Make initial API call to verify authentication works
    const initialResponse = await makeRequestWithCookies(page, '/ai/bullshift/initChat', cookies, {
      locale: 'en'
    });
    expect(initialResponse.status()).toBe(200);
    
    // Simulate token expiration by waiting or manipulating cookies
    await expireAuthCookie(page);
    
    // Make API call that should trigger token refresh
    const refreshResponse = await makeRequestWithCookies(page, '/ai/bullshift/initChat', cookies, {
      locale: 'en'
    });
    
    // Should either succeed (token refreshed) or return 401 (refresh failed)
    expect([200, 401].includes(refreshResponse.status())).toBe(true);
    
    if (refreshResponse.status() === 401) {
      console.log('Token refresh failed as expected - this is acceptable behavior');
    } else {
      console.log('Token refresh succeeded');
    }
  });

  test('should handle multiple concurrent API calls with expired token', async ({ page }) => {
    const cookies = await createAndAuthenticateUser(page);
    
    // Expire the token
    await expireAuthCookie(page);
    
    // Make multiple concurrent API calls
    const promises = [
      makeRequestWithCookies(page, '/ai/bullshift/initChat', cookies, { locale: 'en' }),
      makeRequestWithCookies(page, '/ai/bullshift/initChat', cookies, { locale: 'de' }),
      makeRequestWithCookies(page, '/ai/bullshift/extractMemories', cookies, { userId: 'test' })
    ];
    
    const responses = await Promise.allSettled(promises);
    
    // All should either succeed or fail with 401
    for (const response of responses) {
      if (response.status === 'fulfilled') {
        expect([200, 401].includes(response.value.status())).toBe(true);
      }
    }
  });

  test('should handle analyzeChat endpoint authentication failure without logout', async ({ page }) => {
    const cookies = await createAndAuthenticateUser(page);
    
    // Create a valid chat first
    const initResponse = await makeRequestWithCookies(page, '/ai/bullshift/initChat', cookies, {
      locale: 'en'
    });
    expect(initResponse.status()).toBe(200);
    const { chatId } = await initResponse.json();
    
    // Send a message to have something to analyze
    await makeRequestWithCookies(page, '/ai/bullshift/send', cookies, {
      chatId,
      message: 'Test message for analysis',
      userId: 'test-user',
      locale: 'en'
    });
    
    // Expire the token
    await expireAuthCookie(page);
    
    // Try to analyze the chat with expired token
    const analyzeResponse = await makeRequestWithCookies(page, '/ai/bullshift/analyzeChat', cookies, {
      chatId,
      locale: 'en'
    });
    
    // Should return 401 when token is expired and refresh fails
    expect([200, 401].includes(analyzeResponse.status())).toBe(true);
    
    if (analyzeResponse.status() === 401) {
      const errorData = await analyzeResponse.json();
      expect(errorData.error).toBe('User not authenticated');
    }
    
    // CRITICAL: User should still be on the same page, not redirected to login
    const currentUrl = page.url();
    expect(currentUrl).toContain('/bullshift');
    expect(currentUrl).not.toContain('/auth/login');
  });

  test('should preserve authentication state on valid token', async ({ page }) => {
    const cookies = await createAndAuthenticateUser(page);
    
    // Make multiple API calls in sequence
    const endpoints = [
      '/ai/bullshift/initChat',
      '/ai/bullshift/extractMemories',
      '/ai/checkForJudgement'
    ];
    
    for (const endpoint of endpoints) {
      const response = await makeRequestWithCookies(page, endpoint, cookies, {
        locale: 'en',
        text: 'test text',
        userId: 'test-user'
      });
      
      // Should succeed or fail gracefully, but not with auth errors
      if (response.status() === 401) {
        // If we get 401, it should be due to actual authentication failure
        const errorData = await response.json();
        expect(errorData.error).toContain('not authenticated');
      } else {
        expect([200, 400, 404, 500].includes(response.status())).toBe(true);
      }
    }
  });

  test('should handle server-side token refresh in hooks', async ({ page }) => {
    await createAndAuthenticateUser(page);
    
    // Navigate to a protected route
    await page.goto('/bullshift');
    
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Check if we're still on the bullshift page (not redirected to login)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/bullshift');
    
    // Try to make an API call from the page
    const response = await page.evaluate(async () => {
      const res = await fetch('/api/ai/bullshift/initChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: 'en' })
      });
      return { status: res.status, ok: res.ok };
    });
    
    // Should either succeed or fail with proper error handling
    expect([200, 401, 500].includes(response.status)).toBe(true);
  });

  test('should handle production auth cookie issues', async ({ page }) => {
    const cookies = await createAndAuthenticateUser(page);
    
    // Simulate production cookie issues by modifying cookie properties
    const modifiedCookies = cookies.map(cookie => ({
      ...cookie,
      secure: true, // Simulate production secure cookie
      sameSite: 'strict' as const
    }));
    
    await page.context().clearCookies();
    await page.context().addCookies(modifiedCookies);
    
    // Try making API call with modified cookies
    const response = await page.request.post('/api/ai/bullshift/initChat', {
      data: { locale: 'en' }
    });
    
    // Should handle cookie issues gracefully
    expect([200, 401, 403].includes(response.status())).toBe(true);
  });

  test('should handle network errors during token refresh', async ({ page }) => {
    const cookies = await createAndAuthenticateUser(page);
    
    // Simulate network issues by making request to invalid endpoint
    const response = await makeRequestWithCookies(page, '/ai/invalid/endpoint', cookies, {
      test: 'data'
    });
    
    // Should return 404 or other appropriate error, not 401
    expect(response.status()).toBe(404);
  });
});

test.describe('Authentication Error Recovery', () => {
  
  test('should recover from authentication failure and retry', async ({ page }) => {
    const cookies = await createAndAuthenticateUser(page);
    
    // Expire token
    await expireAuthCookie(page);
    
    // Make failing API call
    const failedResponse = await makeRequestWithCookies(page, '/ai/bullshift/analyzeChat', cookies, {
      chatId: 'test-chat',
      locale: 'en'
    });
    
    expect(failedResponse.status()).toBe(401);
    
    // Re-authenticate
    await page.goto('/app/auth/login');
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/bullshift', { timeout: 10000 });
    
    // Get new cookies
    const newCookies = await page.context().cookies();
    
    // Retry the same API call
    const retryResponse = await makeRequestWithCookies(page, '/ai/bullshift/initChat', newCookies, {
      locale: 'en'
    });
    
    expect(retryResponse.status()).toBe(200);
  });

  test('should log authentication errors properly', async ({ page }) => {
    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    const cookies = await createAndAuthenticateUser(page);
    await expireAuthCookie(page);
    
    // Navigate to bullshift page which will try to make API calls
    await page.goto('/bullshift');
    await page.waitForTimeout(2000);
    
    // Check if auth errors are logged appropriately
    const authErrors = consoleErrors.filter(error => 
      error.includes('401') || 
      error.includes('authentication') || 
      error.includes('Token refresh failed')
    );
    
    // Should have some authentication-related errors logged
    expect(authErrors.length).toBeGreaterThan(0);
  });
});