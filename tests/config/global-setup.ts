import { chromium, type FullConfig } from '@playwright/test';
import { TEST_CONFIG, debugLog } from './test-config';

async function globalSetup(config: FullConfig) {
  debugLog('Starting global test setup');
  
  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Wait for the web server to be ready
    debugLog('Waiting for web server to be ready...');
    await page.goto(TEST_CONFIG.BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Verify critical pages are accessible
    const criticalPaths = ['/', '/app/auth/login', '/app/auth/register'];
    
    for (const path of criticalPaths) {
      debugLog(`Checking accessibility of ${path}`);
      const response = await page.goto(`${TEST_CONFIG.BASE_URL}${path}`);
      
      if (!response || response.status() >= 400) {
        throw new Error(`Critical path ${path} is not accessible (status: ${response?.status()})`);
      }
    }
    
    // Test database connectivity by trying to access a protected route
    debugLog('Testing database connectivity...');
    const dbTestResponse = await page.goto(`${TEST_CONFIG.BASE_URL}/app/dashboard`);
    // Should redirect to login (302/303) or show login page, not crash with 500
    if (dbTestResponse && dbTestResponse.status() >= 500) {
      console.warn('Database connectivity issue detected, some tests may fail');
    }
    
    debugLog('Global setup completed successfully');
    
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;