/**
 * Utility functions for working with test_runs collection
 */

export interface TestRun {
	id: string;
	created: string;
	user: string;
	test_type: string;
	total_tests: number;
	passed: number;
	pass_rate: number;
	average_score: number;
	total_conversations: number;
	unique_paths_used: string[];
	path_switching_quality: number;
	test_scenarios: string[];
	prompt_versions_tested: string[];
	debug_mode: boolean;
	notes: string;
	duration_ms: number;
	export_url: string;
	detailed_results: any[];
}

/**
 * Get the latest test run entry for the current user
 * @returns Promise<TestRun | null> - The latest test run or null if none exists
 */
export async function getLatestTestRun(): Promise<TestRun | null> {
	try {
		const response = await fetch('/api/test-runs?latest=true');
		if (response.ok) {
			const data = await response.json();
			return data.latestTestRun;
		}
	} catch (error) {
		console.error('Error loading latest test run:', error);
	}
	return null;
}

/**
 * Get the latest test run entry using the dedicated endpoint
 * @returns Promise<TestRun | null> - The latest test run or null if none exists
 */
export async function getLatestTestRunFromEndpoint(): Promise<TestRun | null> {
	try {
		const response = await fetch('/api/test-runs/latest');
		if (response.ok) {
			const data = await response.json();
			return data.latestTestRun;
		}
	} catch (error) {
		console.error('Error loading latest test run:', error);
	}
	return null;
}

/**
 * Get all test runs for the current user (sorted by newest first)
 * @param limit - Maximum number of test runs to return (default: 50)
 * @returns Promise<TestRun[]> - Array of test runs
 */
export async function getAllTestRuns(limit: number = 50): Promise<TestRun[]> {
	try {
		const response = await fetch(`/api/test-runs?limit=${limit}`);
		if (response.ok) {
			const data = await response.json();
			return data.testRuns || [];
		}
	} catch (error) {
		console.error('Error loading test runs:', error);
	}
	return [];
}

/**
 * Get test runs filtered by test type
 * @param testType - The type of test to filter by
 * @param limit - Maximum number of test runs to return (default: 20)
 * @returns Promise<TestRun[]> - Array of filtered test runs
 */
export async function getTestRunsByType(testType: string, limit: number = 20): Promise<TestRun[]> {
	try {
		const response = await fetch(`/api/test-runs?test_type=${testType}&limit=${limit}`);
		if (response.ok) {
			const data = await response.json();
			return data.testRuns || [];
		}
	} catch (error) {
		console.error('Error loading test runs by type:', error);
	}
	return [];
}
