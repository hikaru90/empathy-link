import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run preview',
		port: 8080,
		timeout: 60000, // 1 minute to start (build is already done)
		reuseExistingServer: !process.env.CI
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	
	// Global test configuration
	timeout: 30000, // 30 seconds per test
	expect: {
		timeout: 10000 // 10 seconds for assertions
	},
	
	// Retry configuration
	retries: process.env.CI ? 2 : 0,
	
	// Worker configuration
	workers: process.env.CI ? 1 : undefined,
	
	// Reporter configuration
	reporter: process.env.CI ? 'github' : 'html',
	
	use: {
		// Base URL for tests
		baseURL: 'http://localhost:8080',
		
		// Browser context options
		viewport: { width: 1280, height: 720 },
		
		// Video and screenshot on failure
		video: 'retain-on-failure',
		screenshot: 'only-on-failure',
		
		// Trace on failure
		trace: 'retain-on-failure'
	},
	
	// Test projects for different scenarios
	projects: [
		{
			name: 'api-tests',
			testMatch: '**/api/**/*.test.ts',
			use: {
				// API tests don't need a browser context
				browserName: 'chromium'
			}
		},
		{
			name: 'integration-tests', 
			testMatch: '**/integration/**/*.test.ts',
			use: {
				browserName: 'chromium'
			}
		},
		{
			name: 'ui-tests',
			testMatch: '**/ui/**/*.test.ts',
			use: {
				browserName: 'chromium'
			}
		}
	],
	
	// Global setup and teardown
	globalSetup: './tests/config/global-setup.ts',
	globalTeardown: './tests/config/global-teardown.ts'
};

export default config;
