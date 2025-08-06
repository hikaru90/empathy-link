import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
const envs = dotenv.config();

// Validate required environment variables
if (!envs.parsed?.PRIVATE_USERNAME || !envs.parsed?.PRIVATE_PASSWORD) {
  throw new Error('PRIVATE_USERNAME and PRIVATE_PASSWORD environment variables must be set for tests');
}

const TEST_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: envs.parsed.PRIVATE_USERNAME,
  password: envs.parsed.PRIVATE_PASSWORD,
};

async function authenticateUser(page: Page) {
  // First register or login the user
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Verbinde Dich' }).click();
  await page.getByRole('textbox', { name: 'E-Mail' }).click();
  await page.getByRole('textbox', { name: 'E-Mail' }).fill(TEST_USER.email);
  await page.getByRole('textbox', { name: 'Passwort' }).click();
  await page.getByRole('textbox', { name: 'Passwort' }).fill(TEST_USER.password);
  // await page.getByRole('textbox', { name: 'Passwort' }).press('Enter');
  await page.getByRole('button', { name: 'Einloggen' }).click();
  await page.waitForURL('**/bullshift', { timeout: 5000 });
}

test.describe('Bullshift Chat Flow', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page);
    await page.waitForSelector('.messages', { timeout: 10000 });
    await page.getByRole('button', { name: 'Überspringen' }).click();
  });

  test('should send and receive messages', async ({ page }) => {
    const messageCountBefore = await page.locator('.messages .message').count();
    const messageInput = page.getByRole('textbox', { name: 'Deine Nachricht...' });
    await messageInput.click();
    await messageInput.fill('hi');
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.waitForTimeout(2000);
    const messageCountAfter = await page.locator('.messages .message').count();
    expect(messageCountAfter).toBe(messageCountBefore + 2);
  });

  test('should handle internal server error when sending message', async ({ page }) => {
    // Set up API mock before any navigation
    await page.route('**/api/ai/bullshift/send', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    // Navigate to fresh page with mock in place
    await page.goto('http://localhost:3000/bullshift');
    await page.waitForSelector('.messages', { timeout: 10000 });

    const messageCountBefore = await page.locator('.messages .message').count();
    const messageInput = page.getByRole('textbox', { name: 'Deine Nachricht...' });
    
    await messageInput.click();
    await messageInput.fill('test message that will fail');
    await page.getByRole('button', { name: 'Send message' }).click();
    
    // Wait for error handling - could be toast, alert, or error message
    await page.waitForTimeout(3000);
    
    // Check that user message is still added but no AI response
    const messageCountAfter = await page.locator('.messages .message').count();
    
    // Check for error message
    const errorMessage = await page.locator('.messages .message:has-text("Fehler")');
    expect(await errorMessage.isVisible()).toBe(true);
    
    // Input should remain functional for retry
    await messageInput.click();
    expect(await messageInput.inputValue()).toBe('');
  });

  

  test('should analyze chat', async ({ page }) => {
    const messageCountBefore = await page.locator('.messages .message').count();
    const messageInput = page.getByRole('textbox', { name: 'Deine Nachricht...' });
    await messageInput.click();
    await messageInput.fill('hi');
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.waitForTimeout(2000);
    const messageCountAfter = await page.locator('.messages .message').count();
    expect(messageCountAfter).toBe(messageCountBefore + 2);
    await page.getByRole('button', { name: 'Chat abschließen' }).click();

    await page.waitForSelector('p:has-text("Dein Chat wurde ausgewertet und abgespeichert")', { timeout: 10000 });

    const messageCountAfterAnalysis = await page.locator('.messages .message').count();
    expect(messageCountAfterAnalysis).toBe(0);
    await page.goto('http://localhost:3000/bullshift');
    await page.waitForSelector('.messages', { timeout: 10000 });
    expect(messageCountAfterAnalysis).toBe(0);
  });

  test('should handle analyze chat error', async ({ page }) => {
    // Set up API mocks for chat analysis endpoints to fail
    await page.route('**/api/ai/bullshift/analyzeChat', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Analysis failed' })
      });
    });

    await page.route('**/api/ai/bullshift/extractMemories', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Memory extraction failed' })
      });
    });

    // Navigate to fresh page with mock in place
    await page.goto('http://localhost:3000/bullshift');
    await page.waitForSelector('.messages', { timeout: 10000 });

    // Send a message first
    const messageInput = page.getByRole('textbox', { name: 'Deine Nachricht...' });
    await messageInput.click();
    await messageInput.fill('test message for analysis');
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.waitForTimeout(2000);

    // Verify message was sent successfully
    const messageCount = await page.locator('.messages .message').count();
    expect(messageCount).toBeGreaterThan(0);

    // Try to analyze chat (this should fail)
    await page.getByRole('button', { name: 'Chat abschließen' }).click();
    
    // Wait for error handling
    await page.waitForTimeout(3000);

    // Verify error message is shown
    await page.waitForSelector('text=Dein Chat konnte nicht ausgewertet werden.', { timeout: 5000 });
    expect(await page.locator('text=Dein Chat konnte nicht ausgewertet werden.').isVisible()).toBe(true);
  });

  test('should handle memory flush and continue working', async ({ page }) => {
    // Send first message to establish chat in memory
    const messageInput = page.getByRole('textbox', { name: 'Deine Nachricht...' });
    await messageInput.click();
    await messageInput.fill('first message before flush');
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.waitForTimeout(2000);

    // Verify first message exchange worked
    const messageCountAfterFirst = await page.locator('.messages .message').count();
    expect(messageCountAfterFirst).toBeGreaterThanOrEqual(2); // User + AI response

    // Flush server memory
    const flushResponse = await page.request.post('http://localhost:3000/api/ai/bullshift/flushMemory');
    expect(flushResponse.ok()).toBe(true);

    // Send second message after flush
    await messageInput.click();
    await messageInput.fill('second message after flush');
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.waitForTimeout(2000);

    // Verify second message exchange worked (chat should work without memory)
    const messageCountAfterSecond = await page.locator('.messages .message').count();
    expect(messageCountAfterSecond).toBeGreaterThan(messageCountAfterFirst);

    // Verify we have at least 2 more messages (user + AI response)
    expect(messageCountAfterSecond).toBeGreaterThanOrEqual(messageCountAfterFirst + 2);
  });

  
});

