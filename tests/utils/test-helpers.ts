import type { Page } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  name?: string;
}

export const TEST_USERS = {
  primary: {
    email: 'test.primary@example.com',
    password: 'testpassword123',
    name: 'Primary Test User'
  },
  secondary: {
    email: 'test.secondary@example.com', 
    password: 'testpassword456',
    name: 'Secondary Test User'
  }
} as const;

/**
 * Create a test user account
 */
export async function createTestUser(page: Page, user: TestUser): Promise<void> {
  await page.goto('/app/auth/register');
  await page.fill('[name="email"]', user.email);
  await page.fill('[name="password"]', user.password);
  await page.fill('[name="passwordConfirm"]', user.password);
  if (user.name) {
    await page.fill('[name="name"]', user.name);
  }
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

/**
 * Login with existing test user
 */
export async function loginTestUser(page: Page, user: TestUser): Promise<void> {
  await page.goto('/app/auth/login');
  await page.fill('[name="email"]', user.email);
  await page.fill('[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

/**
 * Authenticate user (login or register if needed)
 */
export async function authenticateUser(page: Page, user: TestUser = TEST_USERS.primary): Promise<void> {
  try {
    await loginTestUser(page, user);
  } catch {
    // If login fails, try registration
    try {
      await createTestUser(page, user);
    } catch (e) {
      // If both fail, the user might already exist, try login again
      await loginTestUser(page, user);
    }
  }
}

/**
 * Make authenticated API request
 */
export async function makeAuthenticatedRequest(
  page: Page, 
  endpoint: string, 
  data?: any, 
  method = 'POST'
): Promise<Response> {
  const cookies = await page.context().cookies();
  const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieString
    }
  };

  if (data !== undefined && method !== 'GET') {
    options.body = JSON.stringify(data);
  }
  
  return await page.request.fetch(`/api${endpoint}`, options);
}

/**
 * Initialize a bullshift chat and return chatId
 */
export async function initializeBullshiftChat(page: Page, locale = 'en'): Promise<string> {
  const response = await makeAuthenticatedRequest(page, '/ai/bullshift/initChat', {
    locale
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to initialize chat: ${response.status()}`);
  }
  
  const data = await response.json();
  return data.chatId;
}

/**
 * Send a message to a bullshift chat
 */
export async function sendBullshiftMessage(
  page: Page, 
  chatId: string, 
  message: string, 
  locale = 'en'
): Promise<any> {
  const response = await makeAuthenticatedRequest(page, '/ai/bullshift/send', {
    chatId,
    message,
    userId: 'test-user-id',
    locale
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to send message: ${response.status()}`);
  }
  
  return await response.json();
}

/**
 * Initialize a self-empathy chat and return chatId
 */
export async function initializeSelfEmpathyChat(page: Page, locale = 'en'): Promise<string> {
  const response = await makeAuthenticatedRequest(page, '/ai/selfempathy/initChat', {
    locale
  });
  
  if (!response.ok()) {
    throw new Error(`Failed to initialize self-empathy chat: ${response.status()}`);
  }
  
  const data = await response.json();
  return data.chatId;
}

/**
 * Wait for element with timeout
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000): Promise<void> {
  await page.waitForSelector(selector, { timeout });
}

/**
 * Check if user is authenticated by checking dashboard access
 */
export async function isUserAuthenticated(page: Page): Promise<boolean> {
  try {
    await page.goto('/app/dashboard');
    await page.waitForURL('**/dashboard', { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Logout current user
 */
export async function logout(page: Page): Promise<void> {
  await page.goto('/app/auth/logout');
  await page.waitForURL('/', { timeout: 5000 });
}

/**
 * Generate random test data
 */
export const generateTestData = {
  email: () => `test.${Date.now()}@example.com`,
  chatMessage: () => `Test message ${Date.now()}`,
  feelings: () => ['anxious', 'frustrated', 'hopeful'],
  needs: () => ['connection', 'understanding', 'peace']
};

/**
 * Clean up test data (placeholder for future implementation)
 */
export async function cleanupTestData(page: Page): Promise<void> {
  // This could be implemented to clean up test chats, users, etc.
  // For now, it's a placeholder
  console.log('Cleaning up test data...');
}

/**
 * Assert API response structure
 */
export function assertApiResponse(response: any, expectedFields: string[]): void {
  for (const field of expectedFields) {
    if (!(field in response)) {
      throw new Error(`Expected field '${field}' not found in response`);
    }
  }
}

/**
 * Mock API response for testing
 */
export async function mockApiResponse(
  page: Page, 
  endpoint: string, 
  mockData: any,
  status = 200
): Promise<void> {
  await page.route(`**/api${endpoint}`, route => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(mockData)
    });
  });
}

/**
 * Test data generators for different AI endpoints
 */
export const testDataGenerators = {
  bullshiftMessage: () => ({
    chatId: 'test-chat-id',
    message: 'I am feeling overwhelmed with work',
    userId: 'test-user-id',
    locale: 'en'
  }),
  
  selfEmpathyMessage: () => ({
    chatId: 'test-chat-id',
    message: 'I need help understanding my emotions',
    history: []
  }),
  
  learningQuestion: () => ({
    context: 'Understanding emotions and needs',
    locale: 'en'
  }),
  
  feelingsAnalysis: () => ({
    userInput: 'I am feeling sad, angry, and confused',
    locale: 'en'
  }),
  
  needsAnalysis: () => ({
    userInput: 'I need more support and understanding from my family',
    locale: 'en'
  })
};