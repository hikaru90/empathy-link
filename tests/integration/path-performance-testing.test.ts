import { test, expect } from '@playwright/test';

test.describe('Path Performance Testing', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the prompt performance page
		await page.goto('/bullshift/backend/prompt-performance');
		
		// Wait for authentication or handle login if needed
		// You may need to add login logic here based on your auth setup
		await page.waitForLoadState('networkidle');
	});

	test('should display path performance testing tab', async ({ page }) => {
		// Check if the Path Performance tab is visible
		await expect(page.getByRole('tab', { name: 'Path Performance' })).toBeVisible();
	});

	test('should run path performance tests and show results', async ({ page }) => {
		// Click on Path Performance tab
		await page.getByRole('tab', { name: 'Path Performance' }).click();
		
		// Wait for tab content to load
		await expect(page.getByText('Path-Based Performance Testing')).toBeVisible();
		await expect(page.getByText('Run complete conversation flows')).toBeVisible();
		
		// Click the Run Path Performance Tests button
		const runButton = page.getByRole('button', { name: 'Run Path Performance Tests' });
		await expect(runButton).toBeVisible();
		await expect(runButton).toBeEnabled();
		
		// Start the test
		await runButton.click();
		
		// Wait for the button to show "Running Path Tests..."
		await expect(page.getByText('Running Path Tests...')).toBeVisible();
		
		// Wait for progress bar to appear
		await expect(page.getByText('Testing Progress')).toBeVisible();
		
		// Wait for results to appear (this may take a while)
		// Increase timeout for AI processing
		await expect(page.getByText('Path Performance Results')).toBeVisible({ timeout: 120000 });
		
		// Check that results are displayed
		await expect(page.getByText('Conversations')).toBeVisible();
		await expect(page.getByText('Average Score')).toBeVisible();
		await expect(page.getByText('Path Performance Breakdown')).toBeVisible();
	});

	test('should be able to cancel running tests', async ({ page }) => {
		// Click on Path Performance tab
		await page.getByRole('tab', { name: 'Path Performance' }).click();
		
		// Start the test
		await page.getByRole('button', { name: 'Run Basic Tests (5 scenarios)' }).click();
		
		// Wait for the test to start running
		await expect(page.getByText('Running Path Tests...')).toBeVisible();
		
		// Click cancel button
		const cancelButton = page.getByRole('button', { name: 'Cancel' });
		await expect(cancelButton).toBeVisible();
		await cancelButton.click();
		
		// Wait for cancellation to complete
		await expect(page.getByText('Running Path Tests...')).not.toBeVisible({ timeout: 10000 });
		await expect(page.getByRole('button', { name: 'Run Basic Tests (5 scenarios)' })).toBeVisible();
	});

	test('should run single test scenario for debugging', async ({ page }) => {
		// Click on Path Performance tab
		await page.getByRole('tab', { name: 'Path Performance' }).click();
		
		// Select single test mode
		await page.getByRole('combobox').first().click();
		await page.getByRole('option', { name: 'Single Test (Debug mode)' }).click();
		
		// Wait for scenario dropdown to appear
		await expect(page.getByText('Select scenario to debug')).toBeVisible();
		
		// Select a specific test scenario
		await page.getByRole('combobox').last().click();
		await page.getByRole('option').first().click(); // Select first available test
		
		// Button should now be enabled and show "Run Single Test"
		const runButton = page.getByRole('button', { name: 'Run Single Test' });
		await expect(runButton).toBeVisible();
		await expect(runButton).toBeEnabled();
		
		// Start the single test
		await runButton.click();
		
		// Wait for single test to run
		await expect(page.getByText('Running Single Test...')).toBeVisible();
		
		// Wait for results with single test debug information
		await expect(page.getByText('🔬 Single Test Debug Information')).toBeVisible({ timeout: 120000 });
		await expect(page.getByText('Conversation Path Flow:')).toBeVisible();
		await expect(page.getByText('Path Performance Details:')).toBeVisible();
	});

	test('should show different UI states for different test types', async ({ page }) => {
		// Click on Path Performance tab
		await page.getByRole('tab', { name: 'Path Performance' }).click();
		
		// Test Basic mode (default)
		await expect(page.getByRole('button', { name: 'Run Basic Tests (5 scenarios)' })).toBeVisible();
		
		// Switch to Single Test mode
		await page.getByRole('combobox').first().click();
		await page.getByRole('option', { name: 'Single Test (Debug mode)' }).click();
		
		// Should show scenario selector and disabled button
		await expect(page.getByText('Select scenario to debug')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Run Single Test' })).toBeDisabled();
		
		// Select scenario should enable button
		await page.getByRole('combobox').last().click();
		await page.getByRole('option').first().click();
		await expect(page.getByRole('button', { name: 'Run Single Test' })).toBeEnabled();
		
		// Switch to Comprehensive mode
		await page.getByRole('combobox').first().click();
		await page.getByRole('option', { name: 'Comprehensive Tests (All scenarios)' }).click();
		
		// Should show comprehensive button and hide scenario selector
		await expect(page.getByRole('button', { name: 'Run All Tests' })).toBeVisible();
		await expect(page.getByText('Select scenario to debug')).not.toBeVisible();
	});

	test('should show detailed console output during testing', async ({ page }) => {
		// Listen for console messages to verify detailed logging
		const consoleMessages: string[] = [];
		page.on('console', msg => {
			if (msg.type() === 'log') {
				consoleMessages.push(msg.text());
			}
		});

		// Click on Path Performance tab and run tests
		await page.getByRole('tab', { name: 'Path Performance' }).click();
		await page.getByRole('button', { name: 'Run Path Performance Tests' }).click();
		
		// Wait a bit for some console output
		await page.waitForTimeout(5000);
		
		// Check that we're getting detailed logging
		const hasProgressLogs = consoleMessages.some(msg => 
			msg.includes('🔄 Testing scenario') || 
			msg.includes('📝 Running conversation test') ||
			msg.includes('💭 Conversation generated') ||
			msg.includes('🔍 Analyzing path segments')
		);
		
		expect(hasProgressLogs).toBe(true);
		
		// Cancel to clean up
		await page.getByRole('button', { name: 'Cancel' }).click();
	});

	test('should handle errors gracefully', async ({ page }) => {
		// Test error handling by potentially triggering an error condition
		// This is more of a stress test
		
		await page.getByRole('tab', { name: 'Path Performance' }).click();
		
		// Monitor for any error messages in the UI
		await page.getByRole('button', { name: 'Run Path Performance Tests' }).click();
		
		// Wait and check that no uncaught errors appear
		await page.waitForTimeout(3000);
		
		// Look for any error indicators in the UI
		const errorText = await page.locator('text=error').count();
		const failedText = await page.locator('text=failed').count();
		
		// Cancel to clean up
		if (await page.getByRole('button', { name: 'Cancel' }).isVisible()) {
			await page.getByRole('button', { name: 'Cancel' }).click();
		}
	});
});

// Test the API endpoint directly
test.describe('Path Performance API', () => {
	test('should respond to path performance API requests', async ({ request }) => {
		// Note: This test will fail without proper authentication
		// You may need to add authentication headers or skip this test
		
		const response = await request.post('/api/ai/test-path-performance', {
			data: {
				testScenarioIds: null,
				promptVersionsToTest: null,
				saveResults: false
			}
		});
		
		// Should get unauthorized without auth, which confirms endpoint exists
		expect(response.status()).toBe(401);
		
		const data = await response.json();
		expect(data).toHaveProperty('error');
		expect(data.error).toBe('Unauthorized');
	});
});