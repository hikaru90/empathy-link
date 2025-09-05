<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import BackendNav from '$lib/components/bullshift/BackendNav.svelte';
	import {
		TrendingUp,
		TrendingDown,
		Minus,
		Trophy,
		AlertTriangle,
		Target,
		Clock,
		BarChart3,
		Zap,
		Play,
		Download,
		X,
		TestTube,
		RefreshCw
	} from 'lucide-svelte';

	export let data;

	// Performance Dashboard State
	let selectedCategory = 'all';
	let sortBy = 'score';
	let sortOrder = 'desc';

	// Test Runner State
	let selectedTestType = 'multi_turn'; // 'multi_turn', 'path_performance'
	let selectedQualityTestType = 'single'; // For multi-turn tests: 'all', 'single'
	let selectedTestCategory = '';
	let selectedScenario = 'mt_ug_01_defensive_to_vulnerable';
	let selectedPromptId = '';
	let isRunning = false;
	let testResults: any = null;
	let testSummary = '';
	let exportData = '';
	let progress = 0;
	let abortController: AbortController | null = null;
	let isCancelling = false;
	let activeTab = 'dashboard';

	// Path Testing State
	let pathTestResults: any = null;
	let pathAbortController: AbortController | null = null;
	let selectedPathTestType = 'basic'; // 'basic', 'single', 'comprehensive'
	let selectedPathTestScenario = '';
	let debugMode = true; // Enable debug mode by default
	let rawResponse: any = null; // Store raw API response for debugging

	// Test Run History State
	let testRuns: any[] = [];
	let selectedTestRun: any = null;
	let latestTestRunData: any = null;
	let showAllTestRuns = false; // Control showing more than 3 test runs

	// Progress tracking state
	let currentTestName = '';
	let completedTests = 0;
	let totalTests = 0;

	// Get promptId from URL if testing specific prompt
	let urlParams: URLSearchParams;
	if (typeof window !== 'undefined') {
		urlParams = new URLSearchParams(window.location.search);
		selectedPromptId = urlParams.get('promptId') || '';
		if (selectedPromptId) {
			activeTab = 'testing'; // Switch to testing tab if prompt specified
		}
	}

	// Filter and sort prompts for dashboard
	$: filteredPrompts = data.overview
		.filter((prompt) => selectedCategory === 'all' || prompt.category === selectedCategory)
		.sort((a, b) => {
			const aVal =
				sortBy === 'score'
					? a.best_score
					: sortBy === 'name'
						? a.name
						: sortBy === 'tests'
							? a.total_tests
							: new Date(a.last_tested).getTime();
			const bVal =
				sortBy === 'score'
					? b.best_score
					: sortBy === 'name'
						? b.name
						: sortBy === 'tests'
							? b.total_tests
							: new Date(b.last_tested).getTime();

			if (sortBy === 'name') {
				return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			}

			return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
		});

	// Get categories for filter
	$: categories = Array.from(new Set(data.overview.map((p) => p.category))).sort();

	// Test execution
	async function runTests() {
		isRunning = true;
		isCancelling = false;
		testResults = null;
		testSummary = '';
		progress = 0;

		// Create abort controller for cancellation
		abortController = new AbortController();

		try {
			const requestBody: any = { testType: selectedTestType };

			if (selectedTestType === 'category' && selectedTestCategory) {
				requestBody.category = selectedTestCategory;
			}

			if (selectedTestType === 'single' && selectedScenario) {
				requestBody.scenarioId = selectedScenario;
			}

			// Include promptId if testing specific prompt
			if (selectedPromptId) {
				requestBody.promptId = selectedPromptId;
			}

			const response = await fetch('/api/ai/test-conversation-quality', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestBody),
				signal: abortController.signal
			});

			// Check if cancelled
			if (abortController.signal.aborted) {
				throw new Error('Test run cancelled by user');
			}

			if (!response.ok) {
				throw new Error(`Test failed: ${response.statusText}`);
			}

			const result = await response.json();
			testResults = result.report || result;
			testSummary = result.summary;
			exportData = result.exportData;
			progress = 100;

			// If we tested a specific prompt, reload the page data to show updated scores
			if (selectedPromptId) {
				window.location.reload();
			}
		} catch (error: any) {
			if (error.name === 'AbortError' || error.message.includes('cancelled')) {
				console.log('Test execution cancelled');
				testSummary = '🛑 Test execution cancelled by user';
			} else {
				console.error('Test execution failed:', error);
				testSummary = `❌ Test execution failed: ${error.message}`;
			}
		} finally {
			isRunning = false;
			isCancelling = false;
			abortController = null;
		}
	}

	// Cancel test execution
	function cancelTests() {
		if (abortController && isRunning) {
			isCancelling = true;
			abortController.abort();
		}
	}

	// Download results
	function downloadResults() {
		if (!exportData) return;

		const blob = new Blob([exportData], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `conversation-quality-tests-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	// Helper functions
	function getScoreColor(score: number): string {
		if (score >= 85) return 'text-green-600';
		if (score >= 70) return 'text-yellow-600';
		return 'text-red-600';
	}

	function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
		if (score >= 85) return 'default';
		if (score >= 70) return 'secondary';
		return 'destructive';
	}

	function getTrendIcon(trend: string) {
		switch (trend) {
			case 'improving':
				return TrendingUp;
			case 'declining':
				return TrendingDown;
			default:
				return Minus;
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString();
	}

	function testPrompt(promptId: string) {
		selectedPromptId = promptId;
		activeTab = 'testing';
		// Update URL without page reload
		if (typeof window !== 'undefined') {
			const url = new URL(window.location);
			url.searchParams.set('promptId', promptId);
			window.history.pushState({}, '', url);
		}
	}

	function formatPercentage(value: number) {
		return `${Math.round(value)}%`;
	}

	// Path-based testing functions
	async function runPathTesting() {
		isRunning = true;
		isCancelling = false;
		pathTestResults = null;
		rawResponse = null;
		progress = 0;
		currentTestName = '';
		completedTests = 0;

		// Create abort controller for cancellation
		pathAbortController = new AbortController();

		// Determine test scenarios based on selected type
		let testsToRun: any[] = [];

		if (selectedPathTestType === 'single' && selectedPathTestScenario) {
			testsToRun = data.availableTests.filter((t) => t.id === selectedPathTestScenario);
			console.log(`🔬 Running single test scenario: ${selectedPathTestScenario}`);
		} else if (selectedPathTestType === 'basic') {
			testsToRun = data.availableTests.slice(0, 5); // First 5 tests
			console.log(`🧪 Running basic test suite (5 scenarios)`);
		} else if (selectedPathTestType === 'comprehensive') {
			testsToRun = data.availableTests;
			console.log(`🔬 Running comprehensive test suite (${data.availableTests.length} scenarios)`);
		}

		totalTests = testsToRun.length;
		console.log(
			`🚀 Running ${totalTests} path tests:`,
			testsToRun.map((t) => t.name)
		);

		if (totalTests === 0) {
			throw new Error('No tests found to run');
		}

		try {
			// Initialize results collection
			const individualResults = [];
			const allDetailedResults = [];
			let totalScore = 0;
			let passedTests = 0;
			const pathAggregation = {};

			// Run each test individually
			for (let i = 0; i < testsToRun.length; i++) {
				const test = testsToRun[i];

				// Check if cancelled
				if (pathAbortController.signal.aborted) {
					throw new Error('Path testing cancelled by user');
				}

				// Update current test info
				currentTestName = test.name;
				console.log(`🧪 Running path test ${i + 1}/${totalTests}: ${test.name}`);

				try {
					// Send individual test request
					const requestBody = {
						testScenarioIds: [test.id],
						promptVersionsToTest: null,
						saveResults: false,
						debugMode: debugMode
					};

					const response = await fetch('/api/ai/test-path-performance', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(requestBody),
						signal: pathAbortController.signal
					});

					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`Test "${test.name}" failed: ${response.statusText} - ${errorText}`);
					}

					const result = await response.json();
					console.log(`✅ Path test "${test.name}" completed:`, result);

					// Extract individual test result
					const testResult = result.detailedResults?.[0];
					if (testResult) {
						individualResults.push({
							testName: test.name,
							testId: test.id,
							score: testResult.totalScore || 0,
							passed: (testResult.totalScore || 0) >= 70, // 70% threshold
							pathFlow: testResult.pathFlow || [],
							pathPerformances: testResult.pathPerformances || [],
							conversationHistory: testResult.conversationHistory || [],
							details: testResult
						});

						totalScore += testResult.totalScore || 0;
						if ((testResult.totalScore || 0) >= 70) passedTests++;

						// Add to detailed results
						allDetailedResults.push(testResult);

						// Aggregate path data
						if (testResult.pathPerformances) {
							testResult.pathPerformances.forEach((pathPerf: any) => {
								const pathId = pathPerf.pathId;
								if (!pathAggregation[pathId]) {
									pathAggregation[pathId] = {
										pathId: pathId,
										totalTests: 0,
										totalScore: 0,
										bestScore: 0,
										worstScore: 100,
										commonStrengths: [],
										commonWeaknesses: []
									};
								}

								const pathData = pathAggregation[pathId];
								pathData.totalTests++;
								pathData.totalScore += pathPerf.score;
								pathData.bestScore = Math.max(pathData.bestScore, pathPerf.score);
								pathData.worstScore = Math.min(pathData.worstScore, pathPerf.score);
							});
						}
					}
				} catch (error) {
					console.error(`❌ Path test "${test.name}" failed:`, error);
					individualResults.push({
						testName: test.name,
						testId: test.id,
						score: 0,
						passed: false,
						pathFlow: [],
						pathPerformances: [],
						conversationHistory: [],
						details: { error: error.message }
					});
				}

				// Update progress
				completedTests = i + 1;
				progress = Math.round((completedTests / totalTests) * 100);
				console.log(`📊 Progress: ${completedTests}/${totalTests} (${progress}%)`);
			}

			// Calculate aggregated results
			const averageScore = totalTests > 0 ? totalScore / totalTests : 0;
			const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

			// Calculate path aggregation averages
			Object.values(pathAggregation).forEach((pathData: any) => {
				pathData.averageScore =
					pathData.totalTests > 0 ? pathData.totalScore / pathData.totalTests : 0;
			});

			// Create aggregated result object
			const aggregatedResult = {
				summary: {
					totalTests: totalTests,
					passed: passedTests,
					failed: totalTests - passedTests,
					passRate: passRate,
					averageScore: averageScore,
					totalScore: totalScore,
					uniquePathsUsed: Object.keys(pathAggregation),
					pathSwitchingQuality: averageScore // Simplified for now
				},
				detailedResults: allDetailedResults,
				pathAggregation: pathAggregation,
				individualResults: individualResults
			};

			console.log('📊 Aggregated path results:', aggregatedResult);

			// Save results to test_runs collection
			await saveTestResultsToDatabase('path_performance', aggregatedResult);

			// Reload test runs to show the new entry
			await loadTestRuns();

			pathTestResults = aggregatedResult;
			rawResponse = aggregatedResult; // Store for debugging
			progress = 100;

			// Log detailed debugging info
			if (debugMode) {
				console.log('🔍 Debug Info:');
				console.log('- Total tests:', aggregatedResult.summary?.totalTests);
				console.log('- Average score:', aggregatedResult.summary?.averageScore);
				console.log(
					'- Path aggregation keys:',
					Object.keys(aggregatedResult.pathAggregation || {})
				);
				console.log('- Detailed results count:', aggregatedResult.detailedResults?.length);

				if (aggregatedResult.detailedResults?.length > 0) {
					console.log('- First test result:', aggregatedResult.detailedResults[0]);
				}
			}
		} catch (error: any) {
			if (error.name === 'AbortError' || error.message.includes('cancelled')) {
				console.log('Path testing was cancelled by user');
			} else {
				console.error('Path testing failed:', error);
				pathTestResults = { error: `Path testing failed: ${error.message}` };
			}
		} finally {
			isRunning = false;
			isCancelling = false;
			pathAbortController = null;
			currentTestName = '';
			
			// Refresh data after test completion
			invalidateAll();
		}
	}

	function cancelPathTesting() {
		if (pathAbortController) {
			isCancelling = true;
			pathAbortController.abort();
		}
	}

	// Unified testing functions
	function isTestConfigurationInvalid(): boolean {
		if (selectedTestType === 'multi_turn') {
			return selectedQualityTestType === 'single' && !selectedScenario;
		} else if (selectedTestType === 'path_performance') {
			return selectedPathTestType === 'single' && !selectedPathTestScenario;
		}
		return false;
	}

	function getTestButtonText(): string {
		if (selectedTestType === 'multi_turn') {
			return selectedQualityTestType === 'all'
				? 'All Multi-Turn Conversations'
				: selectedQualityTestType === 'single'
					? 'Single Conversation Test'
					: 'Multi-Turn Tests';
		} else if (selectedTestType === 'path_performance') {
			return selectedPathTestType === 'basic'
				? 'Basic Path Tests'
				: selectedPathTestType === 'single'
					? 'Single Path Test'
					: selectedPathTestType === 'comprehensive'
						? 'All Path Tests'
						: 'Path Performance Tests';
		}
		return 'Tests';
	}

	async function runUnifiedTests() {
		if (selectedTestType === 'multi_turn') {
			await runMultiTurnTests();
		} else if (selectedTestType === 'path_performance') {
			await runPathTesting();
		}
	}

	async function runMultiTurnTests() {
		isRunning = true;
		isCancelling = false;
		testResults = null;
		testSummary = '';
		progress = 0;
		currentTestName = '';
		completedTests = 0;
		totalTests = selectedQualityTestType === 'all' ? 3 : 1; // 3 scenarios total

		// Create abort controller for cancellation
		abortController = new AbortController();

		// Start duration tracking
		const testStartTime = Date.now();

		try {
			progress = 10;
			currentTestName = 'Preparing multi-turn conversation tests...';

			const requestBody = {
				testType: selectedQualityTestType, // 'all' or 'single'
				scenarioId: selectedQualityTestType === 'single' ? selectedScenario : undefined,
				promptId: selectedPromptId || undefined
			};

			console.log('🔄 Starting multi-turn tests:', requestBody);

			progress = 20;
			currentTestName = 'Running conversation scenarios...';

			const response = await fetch('/api/ai/test-multi-turn', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestBody),
				signal: abortController.signal
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Test request failed: ${errorText}`);
			}

			progress = 50;
			currentTestName = 'Processing conversation results...';

			const result = await response.json();
			console.log('📊 Multi-turn test results:', result);

			progress = 80;
			currentTestName = 'Generating summary...';

			// Process results for display
			testResults = {
				...result,
				testType: 'multi_turn'
			};

			// Generate summary text
			if (result.testType === 'single') {
				testSummary = generateMultiTurnSummary(result);
			} else {
				testSummary = generateAllMultiTurnSummary(result);
			}

			progress = 90;

			// Calculate actual test duration
			const actualDuration = Date.now() - testStartTime;
			console.log(`⏱️ Test completed in ${actualDuration}ms`);

			// Save results to database
			await saveTestResultsToDatabase('multi_turn', result, actualDuration);

			progress = 100;
			currentTestName = 'Multi-turn tests completed!';
		} catch (error: any) {
			if (error.name === 'AbortError' || error.message.includes('cancelled')) {
				console.log('Multi-turn testing was cancelled by user');
			} else {
				console.error('Multi-turn testing failed:', error);
				testResults = { error: `Multi-turn testing failed: ${error.message}` };
			}
		} finally {
			isRunning = false;
			isCancelling = false;
			abortController = null;
			currentTestName = '';
			
			// Refresh data after test completion
			invalidateAll();
		}
	}

	function generateSingleConversationSummary(result: any): string {
		const r = result.result;
		return `
🔄 SINGLE CONVERSATION TEST RESULTS

📊 Overall Performance:
- Status: ${r.passed ? '✅ PASSED' : '❌ FAILED'}
- Overall Score: ${r.overallScore.toFixed(1)}/100
- Conversation Turns: ${r.totalTurns}/${result.result.scenario?.maxTurns || 'unknown'}

🎯 Conversation Analysis:
- User Growth: ${r.conversationAnalysis.userGrowthAchieved?.join(', ') || 'None'}
- Path Progression Quality: ${r.conversationAnalysis.pathProgressionQuality}/100
- Consistency Score: ${r.conversationAnalysis.consistencyScore}/100
- Avoided Critical Issues: ${r.conversationAnalysis.avoidanceCriteriaSuccess ? '✅' : '❌'}

💬 Turn-by-Turn Highlights:
${
	r.turnResults
		.filter((t) => t.progressAchieved.length > 0)
		.map((t) => `Turn ${t.turnNumber}: ${t.progressAchieved.join(', ')}`)
		.slice(0, 3)
		.join('\n') || 'No significant progress recorded'
}

${
	r.turnResults.some((t) => t.criticalFailures.length > 0)
		? `⚠️ Critical Issues:\n${r.turnResults
				.filter((t) => t.criticalFailures.length > 0)
				.map((t) => `Turn ${t.turnNumber}: ${t.criticalFailures.join(', ')}`)
				.join('\n')}`
		: '✅ No critical issues detected'
}
		`;
	}

	function generateMultiTurnSummary(result: any): string {
		const r = result.result;
		if (!r || !r.turnResults) {
			return '❌ Invalid multi-turn test result structure';
		}

		// Calculate additional metrics from turnResults
		const turnScores = r.turnResults.map((t: any) => t.turnScore || 0);
		const minScore = Math.min(...turnScores);
		const maxScore = Math.max(...turnScores);
		const progressTurns = r.turnResults.filter((t: any) => t.progressAchieved?.length > 0);
		const failureTurns = r.turnResults.filter((t: any) => t.criticalFailures?.length > 0);

		return `
🔄 MULTI-TURN CONVERSATION TEST RESULTS

📊 Overall Performance:
- Status: ${r.passed ? '✅ PASSED' : '❌ FAILED'}
- Overall Score: ${r.overallScore?.toFixed(1) || '0'}/100
- Conversation Turns: ${r.totalTurns || r.turnResults.length}
- Score Range: ${minScore}-${maxScore} (avg: ${r.averageTurnScore?.toFixed(1) || 'N/A'})

🎯 Conversation Quality:
- User Growth: ${r.userGrowthAchieved?.join(', ') || 'None achieved'}
- Conversation Coherence: ${r.conversationCoherence || r.comparabilityMetrics?.conversationCoherence || 'N/A'}%
- Path Progression Quality: ${r.pathProgressionQuality || r.conversationAnalysis?.pathProgressionQuality || 'N/A'}/100
- Consistency Score: ${r.consistencyScore || r.conversationAnalysis?.consistencyScore || 'N/A'}/100
- Critical Issues Avoided: ${r.conversationAnalysis?.avoidanceCriteriaSuccess ? '✅' : '❌'}

💬 Turn-by-Turn Analysis:
${
	progressTurns
		.map(
			(t: any) => `Turn ${t.turnNumber}: ${t.progressAchieved.join(', ')} (Score: ${t.turnScore})`
		)
		.slice(0, 5)
		.join('\n') || 'No progress milestones recorded'
}

📈 Progress Summary:
- Total Progress Events: ${r.progressAchievedCount || 0}
- Successful Turns: ${progressTurns.length}/${r.turnResults.length}
- Growth Trajectory: ${r.userGrowthAchieved?.length ? 'Positive' : 'Limited'}

${
	failureTurns.length > 0
		? `⚠️ Critical Issues Detected:
${failureTurns
	.map((t: any) => `Turn ${t.turnNumber}: ${t.criticalFailures.join(', ')}`)
	.join('\n')}`
		: '✅ No critical issues detected'
}

🔍 Conversation Flow:
${r.turnResults
	.slice(0, 3)
	.map(
		(t: any, i: number) =>
			`${i === 0 ? 'Opening' : i === 1 ? 'Development' : 'Progression'}: "${t.userResponse?.substring(0, 80) || 'No response'}${t.userResponse?.length > 80 ? '...' : ''}"`
	)
	.join('\n')}
		`;
	}

	function generateAllMultiTurnSummary(result: any): string {
		const summary = result.summary;
		const results = result.results || [];

		// Aggregate metrics from all results
		const totalTurns = results.reduce((sum: number, r: any) => sum + (r.totalTurns || 0), 0);
		const avgCoherence =
			results.reduce((sum: number, r: any) => sum + (r.conversationCoherence || 0), 0) /
			results.length;
		const allGrowth = results.flatMap((r: any) => r.userGrowthAchieved || []);
		const uniqueGrowth = [...new Set(allGrowth)];

		return `
🔄 ALL MULTI-TURN CONVERSATIONS RESULTS

📊 Overall Performance:
- Total Tests: ${summary.totalTests || results.length}
- Passed: ${summary.passed || 0}/${summary.totalTests || results.length} (${summary.passRate?.toFixed(1) || '0'}%)
- Average Score: ${summary.averageScore?.toFixed(1) || '0'}/100
- Overall Assessment: ${summary.overallAssessment || 'Unknown'}

💬 Conversation Metrics:
- Total Conversation Turns: ${totalTurns}
- Average Coherence: ${avgCoherence.toFixed(1)}%
- Unique Growth Types: ${uniqueGrowth.join(', ') || 'None'}

📈 Performance by Scenario:
${results
	.map(
		(r: any) =>
			`• ${r.scenarioId}: ${r.passed ? '✅' : '❌'} ${r.overallScore?.toFixed(1) || '0'}/100 (${r.totalTurns || 0} turns)`
	)
	.join('\n')}

${
	summary.keyStrengths?.length > 0
		? `💪 Key Strengths:
${summary.keyStrengths.map((s: string) => `• ${s}`).join('\n')}`
		: ''
}

${
	summary.criticalWeaknesses?.length > 0
		? `⚠️ Areas for Improvement:
${summary.criticalWeaknesses.map((w: string) => `• ${w}`).join('\n')}`
		: ''
}

${
	summary.recommendations?.length > 0
		? `🎯 Recommendations:
${summary.recommendations.map((r: string) => `• ${r}`).join('\n')}`
		: ''
}
		`;
	}

	function generateAllConversationsSummary(result: any): string {
		const summary = result.summary;
		return `
🔄 ALL MULTI-TURN CONVERSATIONS RESULTS

📊 Overall Performance:
- Tests Run: ${summary.totalTests}
- Tests Passed: ${summary.passed} (${summary.passRate.toFixed(1)}%)
- Average Score: ${summary.averageScore.toFixed(1)}/100
- Assessment: ${summary.overallAssessment}

💪 Key Strengths:
${summary.keyStrengths.map((s) => `- ${s}`).join('\n') || '- None identified'}

⚠️ Critical Weaknesses:
${summary.criticalWeaknesses.map((w) => `- ${w}`).join('\n') || '- None identified'}

🔧 Recommendations:
${summary.recommendations.map((r) => `- ${r}`).join('\n') || '- Continue current approach'}

📈 Detailed Results:
${result.results
	.map(
		(r) =>
			`${r.scenarioName}: ${r.passed ? '✅' : '❌'} ${r.overallScore.toFixed(1)}/100 (${r.totalTurns} turns)`
	)
	.join('\n')}
		`;
	}

	async function runQualityTests() {
		isRunning = true;
		isCancelling = false;
		testResults = null;
		testSummary = '';
		progress = 0;
		currentTestName = '';
		completedTests = 0;

		// Create abort controller for cancellation
		abortController = new AbortController();

		try {
			// Get the list of tests to run based on test type
			let testsToRun = [];

			switch (selectedQualityTestType) {
				case 'basic':
					// Basic test suite - first 5 tests
					testsToRun = data.availableTests.slice(0, 5);
					break;
				case 'advanced':
					// Advanced test suite - tests 6-13
					testsToRun = data.availableTests.slice(5, 13);
					break;
				case 'all':
					// All tests
					testsToRun = data.availableTests;
					break;
				case 'category':
					// Category tests - filter by selected category
					if (selectedTestCategory) {
						testsToRun = data.availableTests.filter(
							(test) => test.category.toLowerCase() === selectedTestCategory.toLowerCase()
						);
					}
					break;
				case 'single':
					// Single test
					if (selectedScenario) {
						testsToRun = data.availableTests.filter((test) => test.id === selectedScenario);
					}
					break;
				default:
					testsToRun = data.availableTests.slice(0, 5); // Default to basic
			}

			totalTests = testsToRun.length;
			console.log(
				`🚀 Running ${totalTests} quality tests:`,
				testsToRun.map((t) => t.name)
			);

			if (totalTests === 0) {
				throw new Error('No tests found to run');
			}

			// Initialize results collection
			const individualResults = [];
			const allDetailedResults = [];
			let totalScore = 0;
			let passedTests = 0;

			// Run each test individually
			for (let i = 0; i < testsToRun.length; i++) {
				const test = testsToRun[i];

				// Check if cancelled
				if (abortController.signal.aborted) {
					throw new Error('Quality testing cancelled by user');
				}

				// Update current test info
				currentTestName = test.name;
				console.log(`🧪 Running test ${i + 1}/${totalTests}: ${test.name}`);

				try {
					// Send individual test request
					const requestBody = {
						testType: 'single',
						scenarioId: test.id,
						promptId: selectedPromptId
					};

					const response = await fetch('/api/ai/test-conversation-quality', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(requestBody),
						signal: abortController.signal
					});

					if (!response.ok) {
						const errorText = await response.text();
						throw new Error(`Test "${test.name}" failed: ${response.statusText} - ${errorText}`);
					}

					const result = await response.json();
					console.log(`✅ Test "${test.name}" completed:`, result);

					// Extract individual test result with better debugging
					let testResult = null;

					// Try different possible response structures
					if (result.result) {
						// Single test response structure
						testResult = result.result;
						console.log(`📊 Found result in result.result (single test):`, testResult);
					} else if (result.report?.detailedResults?.[0]) {
						testResult = result.report.detailedResults[0];
						console.log(`📊 Found result in result.report.detailedResults[0]:`, testResult);
					} else if (result.report) {
						testResult = result.report;
						console.log(`📊 Found result in result.report:`, testResult);
					} else if (result.detailedResults?.[0]) {
						testResult = result.detailedResults[0];
						console.log(`📊 Found result in result.detailedResults[0]:`, testResult);
					} else if (result.summary) {
						testResult = result;
						console.log(`📊 Found result in result:`, testResult);
					} else {
						console.log(`⚠️ No test result found in response:`, result);
					}

					if (testResult) {
						// Determine if test passed based on score threshold
						const score = testResult.score || testResult.totalScore || 0;
						const passed = score >= 70; // 70% threshold for passing

						console.log(`📊 Test "${test.name}" - Score: ${score}, Passed: ${passed}`);

						individualResults.push({
							testName: test.name,
							testId: test.id,
							category: test.category,
							score: score,
							passed: passed,
							feedback: testResult.feedback || testResult.reason || '',
							details: testResult
						});

						totalScore += score;
						if (passed) passedTests++;

						// Add to detailed results
						allDetailedResults.push(testResult);
					} else {
						console.log(`❌ No valid test result found for "${test.name}"`);
						individualResults.push({
							testName: test.name,
							testId: test.id,
							category: test.category,
							score: 0,
							passed: false,
							feedback: 'No test result found in response',
							details: { error: 'No test result found' }
						});
					}
				} catch (error) {
					console.error(`❌ Test "${test.name}" failed:`, error);
					individualResults.push({
						testName: test.name,
						testId: test.id,
						category: test.category,
						score: 0,
						passed: false,
						feedback: `Test failed: ${error.message}`,
						details: { error: error.message }
					});
				}

				// Update progress
				completedTests = i + 1;
				progress = Math.round((completedTests / totalTests) * 100);
				console.log(`📊 Progress: ${completedTests}/${totalTests} (${progress}%)`);
			}

			// Calculate aggregated results
			const averageScore = totalTests > 0 ? totalScore / totalTests : 0;
			const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

			console.log(`📊 Final calculations:`);
			console.log(`- Total tests: ${totalTests}`);
			console.log(`- Total score: ${totalScore}`);
			console.log(`- Passed tests: ${passedTests}`);
			console.log(`- Average score: ${averageScore}`);
			console.log(`- Pass rate: ${passRate}%`);
			console.log(`- Individual results:`, individualResults);

			// Create aggregated result object
			const aggregatedResult = {
				report: {
					summary: {
						totalTests: totalTests,
						passed: passedTests,
						failed: totalTests - passedTests,
						passRate: passRate,
						averageScore: averageScore,
						totalScore: totalScore
					},
					detailedResults: allDetailedResults,
					categoryBreakdown: createCategoryBreakdown(individualResults)
				},
				summary: `Completed ${totalTests} tests with ${passRate.toFixed(1)}% pass rate and ${averageScore.toFixed(1)} average score.`,
				exportData: {
					timestamp: new Date().toISOString(),
					testType: selectedQualityTestType,
					totalTests: totalTests,
					averageScore: averageScore,
					passRate: passRate,
					results: individualResults
				}
			};

			console.log('📊 Aggregated results:', aggregatedResult);

			// Save results to test_runs collection
			await saveTestResultsToDatabase('quality', aggregatedResult);

			// Reload test runs to show the new entry
			await loadTestRuns();

			testResults = aggregatedResult.report;
			testSummary = aggregatedResult.summary;
			exportData = aggregatedResult.exportData;
			progress = 100;
		} catch (error: any) {
			if (error.name === 'AbortError' || error.message.includes('cancelled')) {
				console.log('Quality testing was cancelled by user');
			} else {
				console.error('Quality testing failed:', error);
				testResults = { error: `Quality testing failed: ${error.message}` };
			}
		} finally {
			isRunning = false;
			isCancelling = false;
			abortController = null;
			currentTestName = '';
			
			// Refresh data after test completion
			invalidateAll();
		}
	}

	// Helper function to create category breakdown from individual results
	function createCategoryBreakdown(individualResults: any[]) {
		const categoryMap = new Map();

		individualResults.forEach((result) => {
			const category = result.category;
			if (!categoryMap.has(category)) {
				categoryMap.set(category, {
					testCount: 0,
					totalScore: 0,
					passed: 0,
					scores: []
				});
			}

			const categoryData = categoryMap.get(category);
			categoryData.testCount++;
			categoryData.totalScore += result.score;
			categoryData.scores.push(result.score);
			if (result.passed) categoryData.passed++;
		});

		const breakdown = {};
		categoryMap.forEach((data, category) => {
			breakdown[category] = {
				testCount: data.testCount,
				averageScore: data.totalScore / data.testCount,
				passRate: (data.passed / data.testCount) * 100,
				scores: data.scores
			};
		});

		return breakdown;
	}

	async function runComprehensiveTests() {
		// Run both quality and path performance tests
		console.log('🧪 Running comprehensive tests...');

		// First run quality tests
		await runQualityTests();

		// Then run path performance tests
		await runPathTesting();

		console.log('✅ Comprehensive tests completed');
	}

	// Save test results to test_runs collection
	async function saveTestResultsToDatabase(testType: string, result: any, actualDuration?: number) {
		try {
			console.log('💾 Saving test results to database...');
			console.log('📊 Raw result structure:', result);

			// Handle different result structures for quality vs path performance tests
			let testScenarios: string[] = [];
			let totalTests: number = 0;
			let averageScore: number = 0;
			let passed: number = 0;
			let passRate: number = 0;
			let totalConversations: number = 0;
			let uniquePathsUsed: string[] = [];
			let pathSwitchingQuality: number = 0;
			let detailedResults: any[] = [];

			if (testType === 'quality') {
				// Quality test structure: result.report.summary and result.report.detailedResults
				const report = result.report || result;
				const summary = report.summary || {};

				totalTests = summary.totalTests || 0;
				averageScore = summary.averageScore || 0;
				passed = summary.passed || 0;
				passRate = summary.passRate || 0;
				totalConversations = totalTests; // For quality tests, conversations = tests

				// Extract test scenarios from detailed results
				detailedResults = report.detailedResults || [];
				testScenarios = detailedResults.map(
					(r: any) => r.testScenario || r.scenarioId || 'unknown'
				);

				console.log('🔍 Quality test data extracted:', {
					totalTests,
					averageScore,
					passed,
					passRate,
					testScenarios: testScenarios.length
				});
			} else if (testType === 'multi_turn') {
				// Multi-turn test structure - handle both single and all test types
				if (result.testType === 'single' && result.result) {
					// Single multi-turn test
					const testResult = result.result;

					totalTests = 1;
					averageScore = testResult.overallScore || 0;
					passed = testResult.passed ? 1 : 0;
					passRate = testResult.passed ? 100 : 0;
					totalConversations = 1;
					uniquePathsUsed = []; // Multi-turn tests don't track paths
					pathSwitchingQuality = 0; // Multi-turn tests don't measure path switching

					// Extract rich multi-turn data
					testScenarios = [result.scenarioId || testResult.scenarioId || 'single_conversation'];
					detailedResults = [
						{
							...testResult,
							// Add multi-turn specific metrics
							totalTurns: testResult.turnResults?.length || 0,
							averageTurnScore:
								testResult.turnResults?.reduce(
									(sum: number, turn: any) => sum + turn.turnScore,
									0
								) / (testResult.turnResults?.length || 1),
							userGrowthAchieved: testResult.conversationAnalysis?.userGrowthAchieved || [],
							conversationCoherence: testResult.comparabilityMetrics?.conversationCoherence || 0,
							pathProgressionQuality: testResult.conversationAnalysis?.pathProgressionQuality || 0,
							consistencyScore: testResult.conversationAnalysis?.consistencyScore || 0,
							criticalFailuresCount:
								testResult.turnResults?.reduce(
									(count: number, turn: any) => count + (turn.criticalFailures?.length || 0),
									0
								) || 0,
							progressAchievedCount:
								testResult.turnResults?.reduce(
									(count: number, turn: any) => count + (turn.progressAchieved?.length || 0),
									0
								) || 0
						}
					];
				} else if (result.testType === 'all' && result.results) {
					// Multiple multi-turn tests
					const summary = result.summary || {};

					totalTests = summary.totalTests || result.results.length || 0;
					averageScore = summary.averageScore || 0;
					passed = summary.passed || 0;
					passRate = summary.passRate || 0;
					totalConversations = totalTests;
					uniquePathsUsed = [];
					pathSwitchingQuality = 0;

					testScenarios = result.results.map((r: any) => r.scenarioId || 'unknown');
					detailedResults = result.results.map((testResult: any) => ({
						...testResult,
						totalTurns: testResult.turnResults?.length || 0,
						averageTurnScore:
							testResult.turnResults?.reduce((sum: number, turn: any) => sum + turn.turnScore, 0) /
							(testResult.turnResults?.length || 1),
						userGrowthAchieved: testResult.conversationAnalysis?.userGrowthAchieved || [],
						conversationCoherence: testResult.comparabilityMetrics?.conversationCoherence || 0,
						pathProgressionQuality: testResult.conversationAnalysis?.pathProgressionQuality || 0,
						consistencyScore: testResult.conversationAnalysis?.consistencyScore || 0,
						criticalFailuresCount:
							testResult.turnResults?.reduce(
								(count: number, turn: any) => count + (turn.criticalFailures?.length || 0),
								0
							) || 0,
						progressAchievedCount:
							testResult.turnResults?.reduce(
								(count: number, turn: any) => count + (turn.progressAchieved?.length || 0),
								0
							) || 0
					}));
				} else {
					// Fallback for unexpected structure
					console.warn('⚠️ Unexpected multi-turn result structure:', result);
					totalTests = 1;
					averageScore = 0;
					passed = 0;
					passRate = 0;
					totalConversations = 1;
					uniquePathsUsed = [];
					pathSwitchingQuality = 0;
					testScenarios = ['unknown'];
					detailedResults = [result];
				}

				console.log('🔍 Multi-turn test data extracted:', {
					testType: result.testType,
					totalTests,
					averageScore,
					passed,
					passRate,
					testScenarios,
					detailedResultsCount: detailedResults.length,
					firstResult: detailedResults[0]
						? {
								scenarioId: detailedResults[0].scenarioId,
								overallScore: detailedResults[0].overallScore,
								totalTurns: detailedResults[0].totalTurns,
								userGrowthAchieved: detailedResults[0].userGrowthAchieved
							}
						: null
				});
			} else if (testType === 'path_performance') {
				// Path performance test structure: result.summary and result.detailedResults
				const summary = result.summary || {};

				totalTests = summary.totalTests || 0;
				averageScore = summary.averageScore || 0;
				passed = summary.passed || 0;
				passRate = summary.passRate || 0;
				totalConversations = summary.totalConversations || totalTests;
				uniquePathsUsed = result.pathAggregation ? Object.keys(result.pathAggregation) : [];
				pathSwitchingQuality = summary.pathSwitchingQuality || 0;

				// Extract test scenarios from detailed results
				detailedResults = result.detailedResults || [];
				testScenarios = detailedResults.map(
					(r: any) => r.testScenario || r.scenarioId || 'unknown'
				);

				console.log('🔍 Path performance test data extracted:', {
					totalTests,
					averageScore,
					passed,
					passRate,
					totalConversations,
					uniquePathsUsed: uniquePathsUsed.length,
					pathSwitchingQuality
				});
			}

			// Generate descriptive notes for multi-turn tests
			let testNotes = `Multi-turn test run: ${testType}`;
			if (testType === 'multi_turn' && detailedResults.length > 0) {
				const firstResult = detailedResults[0];
				if (firstResult.totalTurns) {
					testNotes += ` | ${firstResult.totalTurns} turns`;
				}
				if (firstResult.userGrowthAchieved?.length > 0) {
					testNotes += ` | Growth: ${firstResult.userGrowthAchieved.join(', ')}`;
				}
				if (firstResult.conversationCoherence) {
					testNotes += ` | Coherence: ${firstResult.conversationCoherence}%`;
				}
			}

			// Prepare test run data to match PocketBase schema
			const testRunData = {
				test_type: testType,
				test_scenarios: testScenarios,
				prompt_versions_tested: [], // Multi-turn tests don't track prompt versions
				debug_mode: debugMode,
				notes: testNotes,
				total_tests: totalTests,
				passed: passed,
				pass_rate: passRate,
				average_score: averageScore,
				total_conversations: totalConversations,
				unique_paths_used: uniquePathsUsed,
				path_switching_quality: pathSwitchingQuality,
				detailed_results: detailedResults,
				duration_ms: actualDuration || 0, // Use actual test duration
				export_url: '', // Not used for multi-turn tests
				user: data.user?.id || null
			};

			console.log('📊 Test run data to save:', testRunData);

			// Save to test_runs collection
			const saveResponse = await fetch('/api/test-runs', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testRunData)
			});

			if (!saveResponse.ok) {
				const errorText = await saveResponse.text();
				console.error('❌ Failed to save test results:', errorText);
				throw new Error(`Failed to save test results: ${errorText}`);
			}

			const savedTestRun = await saveResponse.json();
			console.log('✅ Test results saved successfully:', savedTestRun.id);
		} catch (error) {
			console.error('❌ Error saving test results:', error);
			// Don't throw - we don't want to fail the entire test if saving fails
		}
	}

	// Load test run history
	async function loadTestRuns() {
		try {
			const response = await fetch('/api/test-runs');
			if (response.ok) {
				const data = await response.json();
				testRuns = data.testRuns || [];
			}
		} catch (error) {
			console.error('Error loading test runs:', error);
		}
	}

	// Toggle showing all test runs
	function toggleShowAllTestRuns() {
		showAllTestRuns = !showAllTestRuns;
	}

	// Get the latest test run entry
	async function getLatestTestRun() {
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

	// Alternative: Get latest test run using the dedicated endpoint
	async function getLatestTestRunFromEndpoint() {
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

	// Load and display latest test run
	async function loadLatestTestRun() {
		try {
			const latestTestRun = await getLatestTestRun();
			if (latestTestRun) {
				console.log('📊 Latest test run loaded:', latestTestRun);
				latestTestRunData = latestTestRun;
				
				// Analyze the latest test run for path and prompt information
				if (latestTestRun.detailed_results?.length > 0) {
					const firstResult = latestTestRun.detailed_results[0];
					console.log('🔍 Analyzing latest test result:', firstResult);
					
					// Extract path information
					if (latestTestRun.unique_paths_used?.length > 0) {
						console.log('📍 Paths used in test:', latestTestRun.unique_paths_used);
					}
					
					// Extract prompt information from path results
					if (firstResult.pathResults?.length > 0) {
						console.log('💬 Path-specific results:');
						firstResult.pathResults.forEach(pathResult => {
							console.log(`  - ${pathResult.pathName} (${pathResult.pathId}): ${pathResult.turnsInPath} turns, score ${pathResult.pathScore.toFixed(1)}`);
							console.log(`    Prompt: ${pathResult.promptUsed.substring(0, 100)}...`);
						});
					}
					
					// For multi-turn tests, check turn results
					if (firstResult.turnResults?.length > 0) {
						console.log('🔄 Turn-by-turn path usage:');
						firstResult.turnResults.forEach(turn => {
							if (turn.pathUsed) {
								console.log(`  Turn ${turn.turnNumber}: ${turn.pathUsed}`);
							}
						});
					}
				}
			}
		} catch (error) {
			console.error('Error loading latest test run:', error);
		}
	}

	// View test run details
	function viewTestRunDetails(testRun: any) {
		selectedTestRun = testRun;
		// You could open a modal or navigate to a details page
		console.log('Viewing test run details:', testRun);
	}

	// Load test runs on component mount
	onMount(() => {
		loadTestRuns();
		loadLatestTestRun(); // Also load the latest test run for analysis
	});
</script>

<svelte:head>
	<title>Prompt Performance & Testing - Empathy Link</title>
</svelte:head>

<div class="pb-24 pt-16">
	<Header user={data.user} />
	<BackendNav />
	<div class="container mx-auto max-w-6xl space-y-8 px-4 py-8">
		<!-- Header -->
		<div class="text-center">
			<h1 class="mb-4 text-3xl font-bold">Prompt Performance & Testing</h1>
			<p class="mx-auto max-w-2xl text-muted-foreground">
				Monitor conversation quality scores, track prompt performance over time, and run
				comprehensive tests to optimize your AI conversations.
			</p>
			{#if selectedPromptId}
				<div class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
					<p class="font-medium text-blue-800">
						🎯 Selected prompt: {selectedPromptId}
					</p>
					<p class="text-sm text-blue-600">
						Test results will be automatically saved to this prompt's performance history.
					</p>
				</div>
			{/if}
		</div>

		<!-- Main Content -->
		<Tabs.Root bind:value={activeTab}>
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="dashboard">Performance Dashboard</Tabs.Trigger>
				<Tabs.Trigger value="testing">Testing Suite</Tabs.Trigger>
			</Tabs.List>

			<!-- Performance Dashboard Tab -->
			<Tabs.Content value="dashboard" class="mt-6 space-y-6">
				<!-- Overview Statistics -->
				<div class="grid grid-cols-2 gap-4 md:grid-cols-5">
					<Card>
						<CardHeader class="pb-2">
							<CardTitle class="flex items-center text-sm font-medium">
								<Target class="mr-2 h-4 w-4" />
								Total Prompts
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalPrompts}</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader class="pb-2">
							<CardTitle class="flex items-center text-sm font-medium">
								<BarChart3 class="mr-2 h-4 w-4" />
								Avg Score
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold {getScoreColor(data.stats.avgScore)}">
								{data.stats.avgScore}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader class="pb-2">
							<CardTitle class="flex items-center text-sm font-medium">
								<Trophy class="mr-2 h-4 w-4" />
								High Performers
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold text-green-600">{data.stats.highPerformers}</div>
							<p class="text-xs text-muted-foreground">85+ score</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader class="pb-2">
							<CardTitle class="flex items-center text-sm font-medium">
								<AlertTriangle class="mr-2 h-4 w-4" />
								Need Attention
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold text-red-600">{data.stats.needAttention}</div>
							<p class="text-xs text-muted-foreground">&lt;70 score</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader class="pb-2">
							<CardTitle class="flex items-center text-sm font-medium">
								<Clock class="mr-2 h-4 w-4" />
								Recent Tests
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.recentTests}</div>
							<p class="text-xs text-muted-foreground">past 7 days</p>
						</CardContent>
					</Card>
				</div>

				<!-- Category Performance -->
				{#if Object.keys(data.categoryStats).length > 0}
					<Card>
						<CardHeader>
							<CardTitle>Performance by Category</CardTitle>
							<CardDescription>Average scores across different prompt categories</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="space-y-4">
								{#each Object.entries(data.categoryStats) as [category, stats]}
									<div class="flex items-center justify-between">
										<div class="space-y-1">
											<p class="font-medium capitalize">{category.replace(/_/g, ' ')}</p>
											<p class="text-sm text-muted-foreground">
												{stats.count} prompts • {stats.highPerformers} high performers
											</p>
										</div>
										<div class="flex items-center space-x-3">
											<Progress value={stats.avgScore} class="w-32" />
											<Badge variant={getScoreBadgeVariant(stats.avgScore)}>
												{stats.avgScore}
											</Badge>
										</div>
									</div>
								{/each}
							</div>
						</CardContent>
					</Card>
				{/if}

				<!-- Latest Test Run Summary -->
				{#if testRuns.length > 0}
					<Card>
						<CardHeader>
							<CardTitle class="flex items-center justify-between">
								📊 Latest Test Run
								<Button onclick={loadLatestTestRun} variant="outline" size="sm">
									<RefreshCw class="mr-2 h-4 w-4" />
									Refresh
								</Button>
							</CardTitle>
							<CardDescription>Most recent conversation quality test results</CardDescription>
						</CardHeader>
						<CardContent>
							{#if testRuns[0]}
								{@const latestRun = testRuns[0]}
								<div class="space-y-4">
									<!-- Test Run Overview -->
									<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
										<div class="text-center">
											<div class="text-lg font-bold">{latestRun.average_score || 0}</div>
											<div class="text-xs text-gray-600">Average Score</div>
										</div>
										<div class="text-center">
											<div class="text-lg font-bold">
												{latestRun.passed || 0}/{latestRun.total_tests || 0}
											</div>
											<div class="text-xs text-gray-600">Tests Passed</div>
										</div>
										<div class="text-center">
											<div class="text-lg font-bold">
												{formatPercentage(latestRun.pass_rate || 0)}
											</div>
											<div class="text-xs text-gray-600">Pass Rate</div>
										</div>
										<div class="text-center">
											<div class="text-lg font-bold">{latestRun.test_type || 'Unknown'}</div>
											<div class="text-xs text-gray-600">Test Type</div>
										</div>
									</div>

									<!-- Test Details -->
									<div class="space-y-2">
										<div class="flex items-center justify-between text-sm">
											<span class="text-gray-600">Test Scenarios:</span>
											<span class="font-medium"
												>{latestRun.test_scenarios?.length || 0} scenarios</span
											>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-gray-600">Duration:</span>
											<span class="font-medium"
												>{latestRun.duration_ms
													? `${Math.round(latestRun.duration_ms / 1000)}s`
													: 'N/A'}</span
											>
										</div>
										<div class="flex items-center justify-between text-sm">
											<span class="text-gray-600">Created:</span>
											<span class="font-medium">{new Date(latestRun.created).toLocaleString()}</span
											>
										</div>
										{#if latestRun.notes}
											<div class="rounded bg-gray-50 p-2 text-sm text-gray-600">
												<strong>Notes:</strong>
												{latestRun.notes}
											</div>
										{/if}
									</div>

									<!-- Multi-Turn Specific Data -->
									{#if latestRun.test_type === 'quality' && latestRun.detailed_results?.length > 0}
										{@const firstResult = latestRun.detailed_results[0]}
										{#if firstResult.turnResults}
											<div class="space-y-3">
												<h4 class="text-sm font-medium">🔄 Multi-Turn Analysis</h4>
												<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
													<div class="text-center">
														<div class="text-lg font-bold">
															{firstResult.totalTurns || firstResult.turnResults?.length || 0}
														</div>
														<div class="text-xs text-gray-600">Total Turns</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold">
															{firstResult.averageTurnScore?.toFixed(1) || 'N/A'}
														</div>
														<div class="text-xs text-gray-600">Avg Turn Score</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold text-green-600">
															{firstResult.progressAchievedCount || 0}
														</div>
														<div class="text-xs text-gray-600">Progress Events</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold text-red-600">
															{firstResult.criticalFailuresCount || 0}
														</div>
														<div class="text-xs text-gray-600">Critical Issues</div>
													</div>
												</div>

												{#if firstResult.userGrowthAchieved?.length > 0}
													<div class="text-sm">
														<span class="font-medium text-green-600">User Growth Achieved:</span>
														<span class="text-green-600">
															{firstResult.userGrowthAchieved.join(', ')}</span
														>
													</div>
												{/if}
											</div>
										{/if}
									{/if}

									<!-- Path Information -->
									{#if latestRun.unique_paths_used?.length > 0}
										<div class="space-y-3">
											<h4 class="text-sm font-medium">📍 Paths Used</h4>
											<div class="space-y-2">
												{#each latestRun.unique_paths_used as pathId}
													<div class="flex items-center justify-between text-sm">
														<span class="text-gray-600">Path:</span>
														<span class="font-medium">{pathId}</span>
													</div>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Path Results from Detailed Results -->
									{#if latestRun.detailed_results?.[0]?.pathResults?.length > 0}
										{@const pathResults = latestRun.detailed_results[0].pathResults}
										<div class="space-y-3">
											<h4 class="text-sm font-medium">📍 Path Analysis</h4>
											<div class="space-y-3">
												{#each pathResults as pathResult}
													<div class="rounded-lg border p-3">
														<div class="mb-2 flex items-center justify-between">
															<h5 class="font-medium">{pathResult.pathName}</h5>
															<Badge variant={pathResult.pathScore >= 70 ? 'default' : pathResult.pathScore >= 50 ? 'secondary' : 'destructive'}>
																{pathResult.pathScore.toFixed(1)}/100
															</Badge>
														</div>
														<div class="grid grid-cols-2 gap-4 text-xs">
															<div>
																<span class="text-gray-600">Turns in Path:</span>
																<span class="font-medium">{pathResult.turnsInPath}</span>
															</div>
															<div>
																<span class="text-gray-600">Effectiveness:</span>
																<span class="font-medium">{pathResult.pathAnalysis.effectiveness.toFixed(1)}%</span>
															</div>
														</div>
														{#if pathResult.pathAnalysis.userGrowth.length > 0}
															<div class="mt-2">
																<span class="text-xs text-gray-600">User Growth:</span>
																<div class="mt-1 rounded bg-green-50 p-2 text-xs text-green-600">
																	{pathResult.pathAnalysis.userGrowth.join(', ')}
																</div>
															</div>
														{/if}
														{#if pathResult.pathAnalysis.criticalIssues.length > 0}
															<div class="mt-2">
																<span class="text-xs text-gray-600">Critical Issues:</span>
																<div class="mt-1 rounded bg-red-50 p-2 text-xs text-red-600">
																	{pathResult.pathAnalysis.criticalIssues.join(', ')}
																</div>
															</div>
														{/if}
														{#if pathResult.promptUsed}
															<div class="mt-2">
																<span class="text-xs text-gray-600">Prompt Used:</span>
																<div class="mt-1 rounded bg-blue-50 p-2 text-xs text-blue-600 max-h-20 overflow-y-auto">
																	{pathResult.promptUsed.substring(0, 200)}...
																</div>
															</div>
														{/if}
													</div>
												{/each}
											</div>
										</div>
									{/if}

									<!-- Action Buttons -->
									<div class="flex gap-2">
										<Button
											onclick={() => viewTestRunDetails(latestRun)}
											variant="outline"
											size="sm"
										>
											View Details
										</Button>
										{#if latestRun.detailed_results?.length > 0}
											<Button
												onclick={() => {
													// Structure the data to match the expected format from test execution
													testResults = {
														testType: 'multi_turn',
														detailedResults: latestRun.detailed_results.map((result: any) => ({
															...result,
															overallScore: result.overallScore || result.averageTurnScore || 0,
															passed: result.passed !== undefined ? result.passed : (result.overallScore || result.averageTurnScore || 0) >= 60
														}))
													};
													activeTab = 'testing';
												}}
												variant="outline"
												size="sm"
											>
												View Results
											</Button>
										{/if}
									</div>
								</div>
							{:else}
								<div class="py-8 text-center text-gray-500">
									<p>No test runs found</p>
									<p class="text-sm">Run a test to see results here</p>
								</div>
							{/if}
						</CardContent>
					</Card>
				{/if}

				<!-- Prompt Performance Details -->
				<Card>
					<CardHeader>
						<CardTitle>Prompt Performance Details</CardTitle>
						<CardDescription>Individual prompt scores, trends, and testing history</CardDescription>
					</CardHeader>
					<CardContent>
						<!-- Filter Controls -->
						<div class="mb-6 flex flex-wrap gap-4">
							<div class="flex items-center space-x-2">
								<label class="text-sm font-medium">Category:</label>
								<select bind:value={selectedCategory} class="rounded-md border px-3 py-1 text-sm">
									<option value="all">All Categories</option>
									{#each categories as category}
										<option value={category}>{category.replace(/_/g, ' ').toUpperCase()}</option>
									{/each}
								</select>
							</div>

							<div class="flex items-center space-x-2">
								<label class="text-sm font-medium">Sort by:</label>
								<select bind:value={sortBy} class="rounded-md border px-3 py-1 text-sm">
									<option value="score">Best Score</option>
									<option value="name">Name</option>
									<option value="tests">Total Tests</option>
									<option value="date">Last Tested</option>
								</select>
							</div>

							<div class="flex items-center space-x-2">
								<label class="text-sm font-medium">Order:</label>
								<select bind:value={sortOrder} class="rounded-md border px-3 py-1 text-sm">
									<option value="desc">Descending</option>
									<option value="asc">Ascending</option>
								</select>
							</div>
						</div>

						<!-- Prompt Performance List -->
						<div class="space-y-4">
							{#each filteredPrompts as prompt}
								<div class="space-y-3 rounded-lg border p-4">
									<!-- Header Row -->
									<div class="flex items-center justify-between">
										<div class="flex items-center space-x-3">
											<h3 class="font-semibold">{prompt.name}</h3>
											<Badge variant="outline">{prompt.category}</Badge>
											{#if !prompt.best_is_current}
												<Badge variant="secondary">v{prompt.current_version}</Badge>
											{/if}
										</div>

										<div class="flex items-center space-x-3">
											<svelte:component
												this={getTrendIcon(prompt.trending)}
												class="h-4 w-4 {prompt.trending === 'improving'
													? 'text-green-500'
													: prompt.trending === 'declining'
														? 'text-red-500'
														: 'text-gray-500'}"
											/>
											<Badge variant={getScoreBadgeVariant(prompt.best_score)}>
												{prompt.best_score}/100
											</Badge>
											<Button
												onclick={() =>
													testPrompt(
														prompt.versions.find((v) => v.active)?.id || prompt.versions[0].id
													)}
												size="sm"
												variant="outline"
											>
												<Zap class="mr-1 h-4 w-4" />
												Test
											</Button>
										</div>
									</div>

									<!-- Details Row -->
									<div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
										<div>
											<p class="text-muted-foreground">Versions</p>
											<p class="font-medium">{prompt.total_versions}</p>
										</div>
										<div>
											<p class="text-muted-foreground">Total Tests</p>
											<p class="font-medium">{prompt.total_tests}</p>
										</div>
										<div>
											<p class="text-muted-foreground">Last Tested</p>
											<p class="font-medium">{formatDate(prompt.last_tested)}</p>
										</div>
										<div>
											<p class="text-muted-foreground">Status</p>
											<p class="font-medium">
												{prompt.best_is_current ? 'Optimal' : `Best: v${prompt.best_version}`}
											</p>
										</div>
									</div>

									<!-- Strengths and Improvements -->
									{#if prompt.strengths.length > 0 || prompt.needs_improvement.length > 0}
										<div class="grid gap-4 border-t pt-2 md:grid-cols-2">
											{#if prompt.strengths.length > 0}
												<div>
													<p class="mb-2 text-sm font-medium text-green-600">Strengths</p>
													<div class="flex flex-wrap gap-1">
														{#each prompt.strengths.slice(0, 3) as strength}
															<Badge variant="outline" class="bg-green-50 text-xs">
																{strength.replace(/_/g, ' ')}
															</Badge>
														{/each}
													</div>
												</div>
											{/if}

											{#if prompt.needs_improvement.length > 0}
												<div>
													<p class="text-orange-600 mb-2 text-sm font-medium">Needs Improvement</p>
													<div class="flex flex-wrap gap-1">
														{#each prompt.needs_improvement.slice(0, 3) as area}
															<Badge variant="outline" class="bg-orange-50 text-xs">
																{area.replace(/_/g, ' ')}
															</Badge>
														{/each}
													</div>
												</div>
											{/if}
										</div>
									{/if}

									<!-- Version History Preview -->
									{#if prompt.versions.length > 1}
										<details class="border-t pt-2">
											<summary class="cursor-pointer text-sm font-medium text-muted-foreground">
												Version History ({prompt.versions.length} versions)
											</summary>
											<div class="mt-3 space-y-2">
												{#each prompt.versions.slice(0, 5) as version}
													<div class="flex items-center justify-between text-sm">
														<span>
															v{version.version}
															{version.active ? '(current)' : ''}
														</span>
														<div class="flex items-center space-x-2">
															<Badge variant={getScoreBadgeVariant(version.score)} class="text-xs">
																{version.score}
															</Badge>
															<span class="text-muted-foreground">
																{formatDate(version.created)}
															</span>
														</div>
													</div>
												{/each}
											</div>
										</details>
									{/if}
								</div>
							{/each}

							{#if filteredPrompts.length === 0}
								<div class="py-12 text-center">
									<p class="text-muted-foreground">No prompts found matching your filters.</p>
									<p class="mt-2 text-sm text-muted-foreground">
										Try adjusting your category or sort settings.
									</p>
								</div>
							{/if}
						</div>
					</CardContent>
				</Card>
			</Tabs.Content>

			<!-- Unified Testing Suite Tab -->
			<Tabs.Content value="testing" class="mt-6 space-y-6">
				<!-- Testing Introduction -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center">
							<TestTube class="mr-2 h-5 w-5" />
							Unified Testing Suite
						</CardTitle>
						<CardDescription>
							Run comprehensive conversation quality tests and path performance analysis in one
							place. Choose between quality-focused tests or complete conversation flow analysis.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-2 text-sm text-gray-600">
							<p><strong>Available Test Types:</strong></p>
							<ul class="ml-4 list-inside list-disc space-y-1">
								<li>
									<strong>Multi-Turn Conversations:</strong> Test realistic full conversations with AI-simulated
									users for comprehensive flow analysis
								</li>
								<li>
									<strong>Path Performance Tests (Legacy):</strong> Original conversation path and transition
									analysis system
								</li>
							</ul>
							<div class="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
								<p class="font-medium text-blue-800">🔄 New: Multi-Turn Testing</p>
								<p class="text-sm text-blue-700">
									Experience realistic conversation flows with AI-powered user simulation. Each test
									runs 6-10 turns of authentic dialogue with consistent personas, giving you deeper
									insights into conversation quality and natural flow.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Test Configuration -->
				<Card>
					<CardHeader>
						<CardTitle>Test Configuration</CardTitle>
						<CardDescription
							>Choose the type of tests to run and configure parameters</CardDescription
						>
					</CardHeader>
					<CardContent class="space-y-6">
						<!-- Test Type Selection -->
						<div class="space-y-2">
							<label class="text-sm font-medium">Test Type</label>
							<Select.Root
								type="single"
								bind:value={selectedTestType}
								onValueChange={() => {
									// Reset dependent values when test type changes
									selectedTestCategory = '';
									selectedScenario = '';
									selectedPathTestType = 'basic';
									selectedPathTestScenario = '';
								}}
							>
								<Select.Trigger>
									{selectedTestType === 'multi_turn'
										? 'Multi-Turn Conversations (Realistic conversation flows)'
										: selectedTestType === 'path_performance'
											? 'Path Performance Tests (Complete conversations)'
											: 'Select test type'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="multi_turn"
										>Multi-Turn Conversations (Realistic conversation flows)</Select.Item
									>
									<Select.Item value="path_performance"
										>Path Performance Tests (Legacy - Complete conversations)</Select.Item
									>
								</Select.Content>
							</Select.Root>
						</div>

						<!-- Multi-Turn Test Configuration -->
						{#if selectedTestType === 'multi_turn'}
							<div class="space-y-4">
								<h4 class="font-medium">Multi-Turn Conversation Options</h4>
								<div class="space-y-2">
									<label class="text-sm font-medium">Test Scope</label>
									<Select.Root
										type="single"
										bind:value={selectedQualityTestType}
										onValueChange={() => {
											if (selectedQualityTestType !== 'single') {
												selectedScenario = '';
											}
										}}
									>
										<Select.Trigger>
											{selectedQualityTestType === 'all'
												? 'All Multi-Turn Scenarios (Complete test suite)'
												: selectedQualityTestType === 'single'
													? 'Single Conversation (Individual scenario)'
													: 'Select test scope'}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="all"
												>All Multi-Turn Scenarios (Complete test suite)</Select.Item
											>
											<Select.Item value="single"
												>Single Conversation (Individual scenario)</Select.Item
											>
										</Select.Content>
									</Select.Root>
								</div>

								<!-- Scenario Selection (for single tests) -->
								{#if selectedQualityTestType === 'single'}
									<div class="space-y-2">
										<label class="text-sm font-medium">Multi-Turn Scenario</label>
										<Select.Root type="single" bind:value={selectedScenario}>
											<Select.Trigger>
												{selectedScenario === 'mt_ug_01_defensive_to_vulnerable'
													? 'Angry Partner → Self-Awareness (8 turns)'
													: selectedScenario === 'mt_nvc_01_observation_vs_evaluation'
														? 'Judgment Separation Challenge (6 turns)'
														: selectedScenario === 'mt_ps_01_natural_path_transition'
															? 'Natural Path Switching (10 turns)'
															: 'Select conversation scenario'}
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													<Select.Label>Available Conversation Scenarios</Select.Label>
													<Select.Item value="mt_ug_01_defensive_to_vulnerable">
														<div class="space-y-1">
															<div class="font-medium">Angry Partner → Self-Awareness</div>
															<div class="text-xs text-muted-foreground">
																Frustrated partner learns to move from blame to self-awareness (8
																turns)
															</div>
														</div>
													</Select.Item>
													<Select.Item value="mt_nvc_01_observation_vs_evaluation">
														<div class="space-y-1">
															<div class="font-medium">Judgment Separation Challenge</div>
															<div class="text-xs text-muted-foreground">
																Tests AI ability to separate observations from evaluations
																consistently (6 turns)
															</div>
														</div>
													</Select.Item>
													<Select.Item value="mt_ps_01_natural_path_transition">
														<div class="space-y-1">
															<div class="font-medium">Natural Path Switching</div>
															<div class="text-xs text-muted-foreground">
																Self-critical user progresses to action planning with smooth
																transitions (10 turns)
															</div>
														</div>
													</Select.Item>
												</Select.Group>
											</Select.Content>
										</Select.Root>
									</div>
								{/if}
							</div>
						{/if}

						<!-- Path Performance Test Configuration -->
						{#if selectedTestType === 'path_performance'}
							<div class="space-y-4">
								<h4 class="font-medium">Path Performance Test Options</h4>
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div class="space-y-2">
										<label class="text-sm font-medium">Test Scope</label>
										<Select.Root
											type="single"
											bind:value={selectedPathTestType}
											onValueChange={() => (selectedPathTestScenario = '')}
										>
											<Select.Trigger>
												{selectedPathTestType === 'basic'
													? 'Basic Tests (5 scenarios)'
													: selectedPathTestType === 'single'
														? 'Single Test (Debug mode)'
														: selectedPathTestType === 'comprehensive'
															? 'Comprehensive Tests (All scenarios)'
															: 'Select test scope'}
											</Select.Trigger>
											<Select.Content>
												<Select.Group>
													<Select.Label>Test Types</Select.Label>
													<Select.Item value="basic">Basic Tests (5 scenarios)</Select.Item>
													<Select.Item value="single">Single Test (Debug mode)</Select.Item>
													<Select.Item value="comprehensive"
														>Comprehensive Tests (All scenarios)</Select.Item
													>
												</Select.Group>
											</Select.Content>
										</Select.Root>
									</div>

									{#if selectedPathTestType === 'single'}
										<div class="space-y-2">
											<label class="text-sm font-medium">Test Scenario</label>
											<Select.Root type="single" bind:value={selectedPathTestScenario}>
												<Select.Trigger>
													{data.availableTests.find((t) => t.id === selectedPathTestScenario)
														?.name || 'Select scenario to debug'}
												</Select.Trigger>
												<Select.Content>
													<Select.Group>
														<Select.Label>Available Test Scenarios</Select.Label>
														{#each data.availableTests as test}
															<Select.Item value={test.id}>{test.name}</Select.Item>
														{/each}
													</Select.Group>
												</Select.Content>
											</Select.Root>
										</div>
									{/if}
								</div>
							</div>
						{/if}

						<!-- Debug Mode Toggle -->
						<div class="flex items-center space-x-2">
							<input type="checkbox" id="debugMode" bind:checked={debugMode} class="h-4 w-4" />
							<label for="debugMode" class="text-sm font-medium">Debug Mode</label>
							<Badge variant="outline" class="text-xs">Shows detailed conversation logs</Badge>
						</div>

						<!-- Run/Cancel Tests Buttons -->
						{#if !isRunning}
							<Button
								onclick={runUnifiedTests}
								disabled={isTestConfigurationInvalid()}
								class="w-full"
							>
								<Play class="mr-2 h-4 w-4" />
								Run {getTestButtonText()}
							</Button>
						{:else}
							<div class="flex gap-2">
								<Button disabled variant="secondary" class="flex-1">
									<Play class="mr-2 h-4 w-4" />
									{isCancelling ? 'Cancelling...' : 'Running Tests...'}
								</Button>
								<Button
									onclick={cancelTests}
									disabled={isCancelling}
									variant="destructive"
									class="flex-shrink-0"
								>
									<X class="mr-2 h-4 w-4" />
									{isCancelling ? 'Cancelling...' : 'Cancel'}
								</Button>
							</div>
						{/if}

						{#if isRunning}
							<div class="space-y-2">
								<Progress value={progress} class="w-full" />
								<div class="text-center text-sm text-muted-foreground">
									<p>
										{isCancelling
											? 'Cancelling tests...'
											: progress === 0
												? 'Initializing tests...'
												: progress < 10
													? 'Starting test execution...'
													: progress < 100
														? 'Running individual tests...'
														: 'Completing...'}
									</p>
									{#if totalTests > 0 && progress > 0 && progress < 100}
										<p class="mt-1 text-xs">
											{completedTests} of {totalTests} tests completed
											{#if currentTestName}
												• Currently: {currentTestName}
											{/if}
										</p>
									{/if}
								</div>
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Test Run History -->
				<Card>
					<CardHeader>
						<CardTitle>Test Run History</CardTitle>
						<CardDescription>View your recent test runs and their results</CardDescription>
					</CardHeader>
					<CardContent class="space-y-4">
						{#if testRuns && testRuns.length > 0}
							<div class="space-y-3">
								{#each (showAllTestRuns ? testRuns : testRuns.slice(0, 3)) as testRun}
									<div class="flex items-center justify-between rounded-lg border p-3">
										<div class="flex-1">
											<div class="mb-1 flex items-center gap-2">
												<Badge variant="outline" class="text-xs">
													{testRun.test_type === 'quality'
														? 'Quality Test'
														: testRun.test_type === 'path_performance'
															? 'Path Performance'
															: testRun.test_type === 'comprehensive'
																? 'Comprehensive'
																: testRun.test_type}
												</Badge>
												<span class="text-sm text-gray-600">
													{new Date(testRun.created).toLocaleString()}
												</span>
											</div>
											<div class="text-sm">
												<span class="font-medium">{testRun.total_tests} tests</span>
												<span class="mx-2">•</span>
												<span class="font-medium">{testRun.average_score}/100 avg</span>
												<span class="mx-2">•</span>
												<span class="font-medium">{testRun.pass_rate}% pass rate</span>
											</div>
										</div>
										<Button variant="outline" size="sm" onclick={() => viewTestRunDetails(testRun)}>
											View Details
										</Button>
									</div>
								{/each}
								
								{#if testRuns.length > 3}
									<div class="flex justify-center pt-2">
										<Button 
											variant="ghost" 
											size="sm" 
											onclick={toggleShowAllTestRuns}
											class="text-blue-600 hover:text-blue-700"
										>
											{showAllTestRuns ? 'Show Less' : `Show More (${testRuns.length - 3} more)`}
										</Button>
									</div>
								{/if}
							</div>
						{:else}
							<div class="py-8 text-center text-gray-500">
								<p>No test runs found.</p>
								<p class="text-sm">Run some tests to see your history here.</p>
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Test Run Details -->
				{#if selectedTestRun}
					<Card>
						<CardHeader>
							<CardTitle class="flex items-center justify-between">
								Test Run Details
								<Button variant="outline" size="sm" onclick={() => (selectedTestRun = null)}>
									<X class="mr-2 h-4 w-4" />
									Close
								</Button>
							</CardTitle>
							<CardDescription>
								Detailed results from {new Date(selectedTestRun.created).toLocaleString()}
							</CardDescription>
						</CardHeader>
						<CardContent class="space-y-6">
							<!-- Test Run Summary -->
							{#if selectedTestRun.test_type === 'quality' && selectedTestRun.detailed_results?.[0]?.totalTurns}
								<!-- Multi-Turn Test Summary -->
								{@const passedTests = selectedTestRun.detailed_results.filter(
									(r) => r.passed
								).length}
								{@const actualPassRate = (
									(passedTests / selectedTestRun.total_tests) *
									100
								).toFixed(1)}
								{@const totalTurns = selectedTestRun.detailed_results.reduce(
									(sum, r) => sum + (r.totalTurns || 0),
									0
								)}
								{@const avgCoherence =
									selectedTestRun.detailed_results.reduce(
										(sum, r) => sum + (r.conversationCoherence || 0),
										0
									) / selectedTestRun.detailed_results.length}

								<div class="grid grid-cols-2 gap-4 md:grid-cols-5">
									<div class="text-center">
										<div class="text-2xl font-bold">{selectedTestRun.total_tests}</div>
										<div class="text-xs text-gray-600">Total Tests</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold text-{passedTests > 0 ? 'green' : 'red'}-600">
											{actualPassRate}%
										</div>
										<div class="text-xs text-gray-600">Pass Rate</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold">
											{selectedTestRun.average_score.toFixed(1)}/100
										</div>
										<div class="text-xs text-gray-600">Average Score</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold text-blue-600">{totalTurns}</div>
										<div class="text-xs text-gray-600">Total Turns</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold text-purple-600">{avgCoherence.toFixed(1)}%</div>
										<div class="text-xs text-gray-600">Avg Coherence</div>
									</div>
								</div>
							{:else}
								<!-- Legacy Test Summary -->
								<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
									<div class="text-center">
										<div class="text-2xl font-bold">{selectedTestRun.total_tests}</div>
										<div class="text-xs text-gray-600">Total Tests</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold">{selectedTestRun.average_score}/100</div>
										<div class="text-xs text-gray-600">Average Score</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold">{selectedTestRun.pass_rate}%</div>
										<div class="text-xs text-gray-600">Pass Rate</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold">{selectedTestRun.duration_ms}ms</div>
										<div class="text-xs text-gray-600">Duration</div>
									</div>
								</div>
							{/if}

							<!-- Test Type Info -->
							<div class="rounded-lg bg-gray-50 p-4">
								<h3 class="mb-3 font-semibold">Test Configuration</h3>
								<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<div class="text-sm font-medium text-gray-700">Test Type:</div>
										<div class="text-sm">
											{#if selectedTestRun.test_type === 'quality' && selectedTestRun.detailed_results?.[0]?.totalTurns}
												<span class="font-medium text-blue-600">Multi-Turn Conversation</span>
											{:else}
												{selectedTestRun.test_type === 'quality'
													? 'Quality Test'
													: selectedTestRun.test_type === 'path_performance'
														? 'Path Performance'
														: selectedTestRun.test_type === 'comprehensive'
															? 'Comprehensive'
															: selectedTestRun.test_type}
											{/if}
										</div>
									</div>
									<div>
										<div class="text-sm font-medium text-gray-700">Debug Mode:</div>
										<div class="text-sm">{selectedTestRun.debug_mode ? 'Enabled' : 'Disabled'}</div>
									</div>
									{#if selectedTestRun.test_scenarios}
										<div>
											<div class="text-sm font-medium text-gray-700">Test Scenarios:</div>
											<div class="text-sm">{selectedTestRun.test_scenarios}</div>
										</div>
									{/if}
									{#if selectedTestRun.unique_paths_used}
										<div>
											<div class="text-sm font-medium text-gray-700">Paths Used:</div>
											<div class="text-sm">{selectedTestRun.unique_paths_used}</div>
										</div>
									{/if}
								</div>
							</div>

							<!-- Path Summary -->
							{#if selectedTestRun.detailed_results?.[0]?.pathResults?.length > 0}
								{@const pathResults = selectedTestRun.detailed_results[0].pathResults}
								<div class="rounded-lg bg-blue-50 p-4">
									<h3 class="mb-3 font-semibold">📍 Path Analysis Summary</h3>
									<div class="space-y-3">
										{#each pathResults as pathResult}
											<div class="rounded-lg border bg-white p-3">
												<div class="mb-2 flex items-center justify-between">
													<h4 class="font-medium">{pathResult.pathName}</h4>
													<Badge variant={pathResult.pathScore >= 70 ? 'default' : pathResult.pathScore >= 50 ? 'secondary' : 'destructive'}>
														{pathResult.pathScore.toFixed(1)}/100
													</Badge>
												</div>
												<div class="grid grid-cols-2 gap-4 text-sm">
													<div>
														<span class="text-gray-600">Turns:</span>
														<span class="font-medium">{pathResult.turnsInPath}</span>
													</div>
													<div>
														<span class="text-gray-600">Effectiveness:</span>
														<span class="font-medium">{pathResult.pathAnalysis.effectiveness.toFixed(1)}%</span>
													</div>
												</div>
												{#if pathResult.pathAnalysis.userGrowth.length > 0}
													<div class="mt-2">
														<span class="text-sm text-gray-600">User Growth:</span>
														<div class="mt-1 rounded bg-green-50 p-2 text-sm text-green-600">
															{pathResult.pathAnalysis.userGrowth.join(', ')}
														</div>
													</div>
												{/if}
												{#if pathResult.pathAnalysis.criticalIssues.length > 0}
													<div class="mt-2">
														<span class="text-sm text-gray-600">Critical Issues:</span>
														<div class="mt-1 rounded bg-red-50 p-2 text-sm text-red-600">
															{pathResult.pathAnalysis.criticalIssues.join(', ')}
														</div>
													</div>
												{/if}
												{#if pathResult.promptUsed}
													<div class="mt-2">
														<span class="text-sm text-gray-600">Prompt Used:</span>
														<div class="mt-1 rounded bg-blue-50 p-2 text-sm text-blue-600 max-h-24 overflow-y-auto">
															{pathResult.promptUsed.substring(0, 300)}...
														</div>
													</div>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Detailed Results with Conversations -->
							{#if selectedTestRun.detailed_results && selectedTestRun.detailed_results.length > 0}
								<div class="space-y-4">
									<h3 class="font-semibold">💬 Individual Test Conversations</h3>

									<div class="space-y-6">
										{#each selectedTestRun.detailed_results as testResult, index}
											{#if testResult.turnResults && testResult.turnResults.length > 0}
												<!-- Multi-Turn Conversation Detail View -->
												<details class="rounded-lg border">
													<summary
														class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
													>
														🎯 {testResult.scenarioId ||
															testResult.scenarioName ||
															`Test ${index + 1}`}
														<Badge
															variant={testResult.passed ? 'default' : 'destructive'}
															class="ml-2"
														>
															{testResult.overallScore || testResult.score || 0}/100
														</Badge>
														<span class="ml-2 text-xs text-gray-600">
															{testResult.turnResults.length} turns
														</span>
													</summary>
													<div class="space-y-6 p-4">
														<!-- Multi-Turn Test Overview -->
														<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.overallScore || testResult.score || 0}
																</div>
																<div class="text-xs text-gray-600">Overall Score</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.passed ? '✅' : '❌'}
																</div>
																<div class="text-xs text-gray-600">Status</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">{testResult.turnResults.length}</div>
																<div class="text-xs text-gray-600">Total Turns</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.averageTurnScore?.toFixed(1) || 'N/A'}
																</div>
																<div class="text-xs text-gray-600">Avg Turn Score</div>
															</div>
														</div>

														<!-- Conversation Analysis Metrics -->
														{#if testResult.conversationAnalysis || testResult.userGrowthAchieved}
															<div class="space-y-3">
																<h4 class="text-sm font-medium">🎯 Conversation Analysis</h4>
																<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600"
																				>User Growth Achieved:</span
																			>
																			<span class="text-xs font-medium">
																				{testResult.userGrowthAchieved?.length ||
																					testResult.conversationAnalysis?.userGrowthAchieved
																						?.length ||
																					0} milestones
																			</span>
																		</div>
																		{#if testResult.userGrowthAchieved?.length > 0 || testResult.conversationAnalysis?.userGrowthAchieved?.length > 0}
																			<div class="rounded bg-green-50 p-2 text-xs text-green-600">
																				{testResult.userGrowthAchieved?.join(', ') ||
																					testResult.conversationAnalysis?.userGrowthAchieved?.join(
																						', '
																					)}
																			</div>
																		{/if}
																	</div>
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600"
																				>Path Progression Quality:</span
																			>
																			<span class="text-xs font-medium">
																				{testResult.pathProgressionQuality ||
																					testResult.conversationAnalysis?.pathProgressionQuality ||
																					0}/100
																			</span>
																		</div>
																		<Progress
																			value={testResult.pathProgressionQuality ||
																				testResult.conversationAnalysis?.pathProgressionQuality ||
																				0}
																			class="h-2"
																		/>
																	</div>
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600"
																				>Conversation Coherence:</span
																			>
																			<span class="text-xs font-medium">
																				{testResult.conversationCoherence ||
																					testResult.comparabilityMetrics?.conversationCoherence ||
																					0}%
																			</span>
																		</div>
																		<Progress
																			value={testResult.conversationCoherence ||
																				testResult.comparabilityMetrics?.conversationCoherence ||
																				0}
																			class="h-2"
																		/>
																	</div>
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600">Consistency Score:</span>
																			<span class="text-xs font-medium">
																				{testResult.consistencyScore ||
																					testResult.conversationAnalysis?.consistencyScore ||
																					0}/100
																			</span>
																		</div>
																		<Progress
																			value={testResult.consistencyScore ||
																				testResult.conversationAnalysis?.consistencyScore ||
																				0}
																			class="h-2"
																		/>
																	</div>
																</div>
															</div>
														{/if}

														<!-- Turn-by-Turn Conversation Flow -->
														<div class="space-y-3">
															<h4 class="text-sm font-medium">🔄 Turn-by-Turn Conversation Flow</h4>
															<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
																<div class="space-y-4">
																	{#each testResult.turnResults as turn, turnIndex}
																		<div class="border-l-4 border-blue-200 pl-4">
																			<!-- Turn Header -->
																			<div class="mb-2 flex items-center justify-between">
																				<div class="flex items-center space-x-2">
																					<span class="text-sm font-medium"
																						>Turn {turn.turnNumber}</span
																					>
																					<Badge
																						variant={turn.turnScore >= 70
																							? 'default'
																							: turn.turnScore >= 50
																								? 'secondary'
																								: 'destructive'}
																						class="text-xs"
																					>
																						{turn.turnScore}/100
																					</Badge>
																				</div>
																				{#if turn.progressAchieved?.length > 0}
																					<span class="text-xs text-green-600">✅ Progress</span>
																				{/if}
																				{#if turn.criticalFailures?.length > 0}
																					<span class="text-xs text-red-600">⚠️ Issues</span>
																				{/if}
																			</div>

																			<!-- AI Response -->
																			<div class="mb-2">
																				<div class="mb-1 text-xs text-gray-500">
																					🤖 AI Assistant:
																				</div>
																				<div class="rounded border bg-white p-2 text-sm">
																					{turn.aiResponse}
																				</div>
																			</div>

																			<!-- User Response -->
																			<div class="mb-2">
																				<div class="mb-1 text-xs text-gray-500">👤 User:</div>
																				<div
																					class="rounded border border-blue-200 bg-blue-50 p-2 text-sm"
																				>
																					{turn.userResponse}
																				</div>
																			</div>

																			<!-- Turn Analysis -->
																			<div class="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
																				{#if turn.progressAchieved?.length > 0}
																					<div class="text-green-600">
																						<span class="font-medium">Progress:</span>
																						{turn.progressAchieved.join(', ')}
																					</div>
																				{/if}
																				{#if turn.criticalFailures?.length > 0}
																					<div class="text-red-600">
																						<span class="font-medium">Issues:</span>
																						{turn.criticalFailures.join(', ')}
																					</div>
																				{/if}
																			</div>
																		</div>
																	{/each}
																</div>
															</div>
														</div>

														<!-- Progress Summary -->
														{#if testResult.progressAchievedCount > 0 || testResult.criticalFailuresCount > 0}
															<div class="space-y-3">
																<h4 class="text-sm font-medium">📊 Progress Summary</h4>
																<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
																	<div class="text-center">
																		<div class="text-lg font-bold text-green-600">
																			{testResult.progressAchievedCount || 0}
																		</div>
																		<div class="text-xs text-gray-600">Progress Events</div>
																	</div>
																	<div class="text-center">
																		<div class="text-lg font-bold text-red-600">
																			{testResult.criticalFailuresCount || 0}
																		</div>
																		<div class="text-xs text-gray-600">Critical Issues</div>
																	</div>
																	<div class="text-center">
																		<div class="text-lg font-bold">
																			{testResult.turnResults.filter(
																				(t) => t.progressAchieved?.length > 0
																			).length}
																		</div>
																		<div class="text-xs text-gray-600">Successful Turns</div>
																	</div>
																	<div class="text-center">
																		<div class="text-lg font-bold">
																			{testResult.turnResults.filter(
																				(t) => t.criticalFailures?.length > 0
																			).length}
																		</div>
																		<div class="text-xs text-gray-600">Problematic Turns</div>
																	</div>
																</div>
															</div>
														{/if}
													</div>
												</details>
											{:else if testResult.conversationHistory && testResult.conversationHistory.length > 0}
												<!-- Legacy Path Performance Test Detail View -->
												<details class="rounded-lg border">
													<summary
														class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
													>
														🎯 Test {index + 1}: {testResult.testScenario ||
															testResult.scenarioId ||
															`Test ${index + 1}`}
														<Badge
															variant={testResult.score >= 70 ? 'default' : 'destructive'}
															class="ml-2"
														>
															{testResult.score || 0}/100
														</Badge>
													</summary>
													<div class="space-y-4 p-4">
														<!-- Test Info -->
														<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
															<div class="text-center">
																<div class="text-lg font-bold">{testResult.score || 0}</div>
																<div class="text-xs text-gray-600">Score</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.passed ? '✅' : '❌'}
																</div>
																<div class="text-xs text-gray-600">Status</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.conversationHistory.length}
																</div>
																<div class="text-xs text-gray-600">Messages</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.category || 'Unknown'}
																</div>
																<div class="text-xs text-gray-600">Category</div>
															</div>
														</div>

														<!-- Conversation Display -->
														<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
															<div class="space-y-4">
																{#each testResult.conversationHistory.filter((msg, idx, arr) => {
																	// Remove duplicate consecutive messages
																	if (idx === 0) return true;
																	const prevMsg = arr[idx - 1];
																	const currentText = msg.parts?.[0]?.text || msg.content || '';
																	const prevText = prevMsg.parts?.[0]?.text || prevMsg.content || '';
																	return currentText !== prevText || msg.role !== prevMsg.role;
																}) as message, msgIndex}
																	<div
																		class="flex gap-3 {message.role === 'user'
																			? 'justify-end'
																			: 'justify-start'}"
																	>
																		<div
																			class="max-w-[80%] {message.role === 'user' ? 'order-2' : ''}"
																		>
																			<!-- Message bubble -->
																			<div
																				class="rounded-lg p-3 {message.role === 'user'
																					? 'bg-blue-100 text-blue-900'
																					: 'border bg-white'}"
																			>
																				<div class="text-sm">
																					{#if message.parts && message.parts[0]?.text}
																						{message.parts[0].text}
																					{:else if message.content}
																						{message.content}
																					{:else}
																						[No content]
																					{/if}
																				</div>
																			</div>

																			<!-- Message metadata -->
																			<div
																				class="mt-1 text-xs text-gray-500 {message.role === 'user'
																					? 'text-right'
																					: 'text-left'}"
																			>
																				<span class="font-medium"
																					>{message.role === 'user' ? 'User' : 'AI Assistant'}</span
																				>
																				{#if message.timestamp}
																					<span class="mx-2">•</span>
																					<span
																						>{new Date(
																							message.timestamp
																						).toLocaleTimeString()}</span
																					>
																				{/if}
																			</div>
																		</div>
																	</div>
																{/each}
															</div>
														</div>

														<!-- Test Evaluation -->
														{#if testResult.evaluation}
															<div class="space-y-3">
																<h4 class="text-sm font-medium">Evaluation Details</h4>
																<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
																	{#if testResult.evaluation.strengths && testResult.evaluation.strengths.length > 0}
																		<div>
																			<div class="mb-1 text-xs font-medium text-green-600">
																				Strengths:
																			</div>
																			<ul class="space-y-1 text-xs text-green-600">
																				{#each testResult.evaluation.strengths as strength}
																					<li class="flex items-start">
																						<span class="mr-1">✓</span>
																						{strength}
																					</li>
																				{/each}
																			</ul>
																		</div>
																	{/if}

																	{#if testResult.evaluation.weaknesses && testResult.evaluation.weaknesses.length > 0}
																		<div>
																			<div class="mb-1 text-xs font-medium text-red-600">
																				Areas for Improvement:
																			</div>
																			<ul class="space-y-1 text-xs text-red-600">
																				{#each testResult.evaluation.weaknesses as weakness}
																					<li class="flex items-start">
																						<span class="mr-1">⚠</span>
																						{weakness}
																					</li>
																				{/each}
																			</ul>
																		</div>
																	{/if}
																</div>

																{#if testResult.evaluation.recommendations && testResult.evaluation.recommendations.length > 0}
																	<div>
																		<div class="mb-1 text-xs font-medium text-blue-600">
																			Recommendations:
																		</div>
																		<ul class="space-y-1 text-xs text-blue-600">
																			{#each testResult.evaluation.recommendations as recommendation}
																				<li class="flex items-start">
																					<span class="mr-1">💡</span>
																					{recommendation}
																				</li>
																			{/each}
																		</ul>
																	</div>
																{/if}
															</div>
														{/if}
													</div>
												</details>
											{/if}
										{/each}
									</div>
								</div>
							{/if}

							<div class="space-y-6">
								{#each selectedTestRun.detailed_results as testResult, index}
									<details class="rounded-lg border">
										<summary
											class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
										>
											🎯 Test {index + 1}: {testResult.testScenario ||
												testResult.scenarioId ||
												`Test ${index + 1}`}
											<Badge
												variant={testResult.score >= 70 ? 'default' : 'destructive'}
												class="ml-2"
											>
												{testResult.score || 0}/100
											</Badge>
										</summary>
										<div class="space-y-4 p-4">
											<!-- Test Scenario Information -->
											{#if testResult.inputMessage || testResult.description || testResult.category}
												<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
													<h4 class="mb-3 text-sm font-medium text-blue-800">
														🎯 Test Scenario Details
													</h4>

													{#if testResult.inputMessage}
														<div class="mb-3">
															<div class="mb-1 text-sm font-medium text-blue-700">
																User Message:
															</div>
															<div class="rounded border bg-white p-3">
																<div class="text-sm font-medium text-blue-900">
																	"{testResult.inputMessage}"
																</div>
															</div>
														</div>
													{/if}

													<div class="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
														{#if testResult.category}
															<div>
																<div class="font-medium text-blue-700">Category:</div>
																<div class="capitalize text-blue-900">
																	{testResult.category.replace(/_/g, ' ')}
																</div>
															</div>
														{/if}
														{#if testResult.expectedPath}
															<div>
																<div class="font-medium text-blue-700">Expected Path:</div>
																<div class="text-blue-900">{testResult.expectedPath}</div>
															</div>
														{/if}
														{#if testResult.testScenarioId}
															<div>
																<div class="font-medium text-blue-700">Test ID:</div>
																<div class="font-mono text-xs text-blue-900">
																	{testResult.testScenarioId}
																</div>
															</div>
														{/if}
													</div>

													{#if testResult.description}
														<div class="mt-3">
															<div class="mb-1 text-sm font-medium text-blue-700">Description:</div>
															<div class="text-sm text-blue-800">{testResult.description}</div>
														</div>
													{/if}
												</div>
											{/if}

											<!-- Multi-Turn Test Metrics -->
											{#if selectedTestRun.test_type === 'quality' && testResult.totalTurns}
												<!-- This is multi-turn data -->
												<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
													<div class="text-center">
														<div
															class="text-lg font-bold text-{testResult.passed
																? 'green'
																: 'red'}-600"
														>
															{testResult.overallScore?.toFixed(1) || testResult.score || 0}
														</div>
														<div class="text-xs text-gray-600">Overall Score</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold">{testResult.passed ? '✅' : '❌'}</div>
														<div class="text-xs text-gray-600">Status</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold">{testResult.totalTurns || 0}</div>
														<div class="text-xs text-gray-600">Turns</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold text-blue-600">
															{testResult.conversationCoherence || 0}%
														</div>
														<div class="text-xs text-gray-600">Coherence</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold text-purple-600">
															{testResult.userGrowthAchieved?.length || 0}
														</div>
														<div class="text-xs text-gray-600">Growth</div>
													</div>
												</div>

												<!-- Multi-Turn Specific Metrics -->
												<div
													class="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4"
												>
													<h4 class="mb-3 text-sm font-medium text-blue-800">
														📊 Multi-Turn Conversation Analysis
													</h4>

													<div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
														<div>
															<div class="mb-1 font-medium text-blue-700">
																User Growth Achieved:
															</div>
															<div class="text-blue-900">
																{#if testResult.userGrowthAchieved?.length > 0}
																	{#each testResult.userGrowthAchieved as growth}
																		<span
																			class="mb-1 mr-1 inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800"
																			>{growth}</span
																		>
																	{/each}
																{:else}
																	<span class="text-gray-500">None achieved</span>
																{/if}
															</div>
														</div>

														<div>
															<div class="mb-1 font-medium text-blue-700">Quality Metrics:</div>
															<div class="space-y-1">
																<div class="text-blue-900">
																	Coherence: <span class="font-mono"
																		>{testResult.conversationCoherence || 0}%</span
																	>
																</div>
																<div class="text-blue-900">
																	Progression: <span class="font-mono"
																		>{testResult.pathProgressionQuality || 0}/100</span
																	>
																</div>
																<div class="text-blue-900">
																	Consistency: <span class="font-mono"
																		>{testResult.consistencyScore || 0}/100</span
																	>
																</div>
															</div>
														</div>

														<div>
															<div class="mb-1 font-medium text-blue-700">Turn Performance:</div>
															<div class="space-y-1">
																<div class="text-blue-900">
																	Avg Score: <span class="font-mono"
																		>{testResult.averageTurnScore?.toFixed(1) || 'N/A'}</span
																	>
																</div>
																<div class="text-blue-900">
																	Progress Events: <span class="font-mono"
																		>{testResult.progressAchievedCount || 0}</span
																	>
																</div>
																<div class="text-blue-900">
																	Critical Issues: <span class="font-mono"
																		>{testResult.criticalFailuresCount || 0}</span
																	>
																</div>
															</div>
														</div>
													</div>
												</div>

												<!-- Turn-by-Turn Analysis -->
												{#if testResult.turnResults?.length > 0}
													<div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
														<h4 class="mb-3 text-sm font-medium text-gray-800">
															💬 Turn-by-Turn Breakdown
														</h4>
														<div class="max-h-60 space-y-2 overflow-y-auto">
															{#each testResult.turnResults as turn, turnIndex}
																<div class="rounded border bg-white p-3">
																	<div class="mb-2 flex items-center justify-between">
																		<span class="text-sm font-medium">Turn {turn.turnNumber}</span>
																		<span
																			class="font-mono text-sm bg-{turn.turnScore >= 70
																				? 'green'
																				: turn.turnScore >= 50
																					? 'yellow'
																					: 'red'}-100 text-{turn.turnScore >= 70
																				? 'green'
																				: turn.turnScore >= 50
																					? 'yellow'
																					: 'red'}-800 rounded px-2 py-1"
																		>
																			{turn.turnScore}/100
																		</span>
																	</div>
																	{#if turn.progressAchieved?.length > 0}
																		<div class="mb-2">
																			<span class="text-xs font-medium text-green-700"
																				>Progress:
																			</span>
																			{#each turn.progressAchieved as progress}
																				<span
																					class="mr-1 inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800"
																					>{progress}</span
																				>
																			{/each}
																		</div>
																	{/if}
																	{#if turn.criticalFailures?.length > 0}
																		<div class="mb-2">
																			<span class="text-xs font-medium text-red-700">Issues: </span>
																			{#each turn.criticalFailures as failure}
																				<span
																					class="mr-1 inline-block rounded bg-red-100 px-2 py-1 text-xs text-red-800"
																					>{failure}</span
																				>
																			{/each}
																		</div>
																	{/if}
																	<div class="truncate text-xs text-gray-600">
																		<strong>User:</strong>
																		{turn.userResponse?.substring(0, 100) || 'No response'}...
																	</div>
																</div>
															{/each}
														</div>
													</div>
												{/if}
											{:else}
												<!-- Legacy/Single-turn Test Info -->
												<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
													<div class="text-center">
														<div class="text-lg font-bold">{testResult.score || 0}</div>
														<div class="text-xs text-gray-600">Score</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold">{testResult.passed ? '✅' : '❌'}</div>
														<div class="text-xs text-gray-600">Status</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold">
															{testResult.conversationHistory?.length || 0}
														</div>
														<div class="text-xs text-gray-600">Messages</div>
													</div>
													<div class="text-center">
														<div class="text-lg font-bold">{testResult.category || 'Unknown'}</div>
														<div class="text-xs text-gray-600">Category</div>
													</div>
												</div>
											{/if}

											<!-- Test Evaluation Details -->
											{#if testResult.evaluation}
												<div class="space-y-4">
													<!-- Individual Metric Scores -->
													{#if testResult.metrics}
														<div class="rounded-lg border bg-white p-4">
															<h4 class="mb-3 text-sm font-medium">📊 Individual Metric Scores</h4>
															<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
																<div class="rounded bg-blue-50 p-3 text-center">
																	<div class="text-xl font-bold text-blue-700">
																		{testResult.metrics.userGrowthScore}/100
																	</div>
																	<div class="text-xs text-blue-600">User Growth</div>
																</div>
																<div class="rounded bg-green-50 p-3 text-center">
																	<div class="text-xl font-bold text-green-700">
																		{testResult.metrics.nvcComplianceScore}/100
																	</div>
																	<div class="text-xs text-green-600">NVC Compliance</div>
																</div>
																<div class="rounded bg-purple-50 p-3 text-center">
																	<div class="text-xl font-bold text-purple-700">
																		{testResult.metrics.pathSwitchingScore}/100
																	</div>
																	<div class="text-xs text-purple-600">Path Switching</div>
																</div>
																<div class="bg-orange-50 rounded p-3 text-center">
																	<div class="text-orange-700 text-xl font-bold">
																		{testResult.metrics.circularPreventionScore}/100
																	</div>
																	<div class="text-orange-600 text-xs">Circular Prevention</div>
																</div>
																<div class="rounded bg-indigo-50 p-3 text-center">
																	<div class="text-xl font-bold text-indigo-700">
																		{testResult.metrics.conversationBalanceScore}/100
																	</div>
																	<div class="text-xs text-indigo-600">Conversation Balance</div>
																</div>
																<div
																	class="rounded border-2 border-gray-300 bg-gray-50 p-3 text-center"
																>
																	<div class="text-xl font-bold text-gray-700">
																		{testResult.score}/100
																	</div>
																	<div class="text-xs text-gray-600">Overall Score</div>
																</div>
															</div>

															<!-- Detailed Metric Information -->
															<details class="mt-4">
																<summary
																	class="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900"
																>
																	📋 View Detailed Metric Data
																</summary>
																<div class="mt-3 rounded border bg-gray-50 p-3">
																	<pre class="overflow-auto text-xs">{JSON.stringify(
																			testResult.metrics,
																			null,
																			2
																		)}</pre>
																</div>
															</details>
														</div>
													{/if}

													<!-- Full Evaluation Text Response -->
													{#if testResult.evaluation}
														<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
															<h4 class="mb-3 text-sm font-medium text-yellow-800">
																📝 Full Evaluation Text Response
															</h4>
															<details>
																<summary
																	class="mb-2 cursor-pointer text-sm font-medium text-yellow-700 hover:text-yellow-900"
																>
																	View Complete Evaluation
																</summary>
																<div class="mt-3 rounded border bg-white p-3">
																	<pre
																		class="max-h-96 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(
																			testResult.evaluation,
																			null,
																			2
																		)}</pre>
																</div>
															</details>
														</div>
													{/if}

													<!-- Evaluation Strengths -->
													{#if testResult.evaluation.strengths && testResult.evaluation.strengths.length > 0}
														<div class="rounded-lg border border-green-200 bg-green-50 p-4">
															<h4 class="mb-3 text-sm font-medium text-green-800">✅ Strengths</h4>
															<ul class="space-y-2">
																{#each testResult.evaluation.strengths as strength}
																	<li class="flex items-start text-sm text-green-700">
																		<span class="mr-2 mt-0.5 text-green-500">•</span>
																		<span>{strength}</span>
																	</li>
																{/each}
															</ul>
														</div>
													{/if}

													<!-- Evaluation Weaknesses -->
													{#if testResult.evaluation.weaknesses && testResult.evaluation.weaknesses.length > 0}
														<div class="rounded-lg border border-red-200 bg-red-50 p-4">
															<h4 class="mb-3 text-sm font-medium text-red-800">⚠️ Weaknesses</h4>
															<ul class="space-y-2">
																{#each testResult.evaluation.weaknesses as weakness}
																	<li class="flex items-start text-sm text-red-700">
																		<span class="mr-2 mt-0.5 text-red-500">•</span>
																		<span>{weakness}</span>
																	</li>
																{/each}
															</ul>
														</div>
													{/if}

													<!-- Evaluation Recommendations -->
													{#if testResult.evaluation.recommendations && testResult.evaluation.recommendations.length > 0}
														<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
															<h4 class="mb-3 text-sm font-medium text-blue-800">
																💡 Recommendations
															</h4>
															<ul class="space-y-2">
																{#each testResult.evaluation.recommendations as recommendation}
																	<li class="flex items-start text-sm text-blue-700">
																		<span class="mr-2 mt-0.5 text-blue-500">•</span>
																		<span>{recommendation}</span>
																	</li>
																{/each}
															</ul>
														</div>
													{/if}
												</div>
											{/if}

											<!-- AI Response Display -->
											{#if testResult.aiResponse}
												<div class="rounded-lg bg-gray-50 p-4">
													<h4 class="mb-3 text-sm font-medium">🤖 AI Response</h4>
													<div class="rounded border bg-white p-3">
														<div class="whitespace-pre-wrap text-sm">{testResult.aiResponse}</div>
													</div>
												</div>
											{/if}

											<!-- Raw Test Result Data (Collapsible) -->
											<details class="rounded-lg bg-gray-50">
												<summary class="cursor-pointer p-3 text-sm font-medium text-gray-700">
													🔍 View Raw Test Data
												</summary>
												<div class="px-3 pb-3">
													<pre
														class="max-h-40 overflow-auto rounded border bg-white p-3 text-xs">{JSON.stringify(
															testResult,
															null,
															2
														)}</pre>
												</div>
											</details>

											<!-- Conversation Display -->
											{#if testResult.conversationHistory && testResult.conversationHistory.length > 0}
												<div class="rounded-lg bg-gray-50 p-4">
													<h4 class="mb-3 text-sm font-medium">💬 Full Conversation History</h4>
													<div class="max-h-96 overflow-y-auto rounded border bg-white p-3">
														<div class="space-y-4">
															{#each testResult.conversationHistory as message, msgIndex}
																<div
																	class="flex gap-3 {message.role === 'user'
																		? 'justify-end'
																		: 'justify-start'}"
																>
																	<div
																		class="max-w-[80%] {message.role === 'user' ? 'order-2' : ''}"
																	>
																		<div
																			class="rounded-lg p-3 {message.role === 'user'
																				? 'bg-blue-100 text-blue-900'
																				: 'border bg-white'}"
																		>
																			<div class="whitespace-pre-wrap text-sm">
																				{message.parts?.[0]?.text ||
																					message.content ||
																					'(No content)'}
																			</div>
																		</div>
																		<div
																			class="mt-1 text-xs text-gray-500 {message.role === 'user'
																				? 'text-right'
																				: ''}"
																		>
																			<span class="font-medium"
																				>{message.role === 'user' ? 'User' : 'AI Assistant'}</span
																			>
																		</div>
																	</div>
																</div>
															{/each}
														</div>
													</div>
												</div>
											{:else if testResult.aiResponse}
												<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
													<h4 class="mb-3 text-sm font-medium">💬 Test Conversation</h4>
													<div class="space-y-4">
														<!-- User Message -->
														<div class="flex justify-end gap-3">
															<div class="order-2 max-w-[80%]">
																<div class="rounded-lg bg-blue-100 p-3 text-blue-900">
																	<div class="text-sm">
																		{testResult.scenarioId
																			? testResult.scenarioId
																					.replace(/_/g, ' ')
																					.replace(/\b\w/g, (l) => l.toUpperCase())
																			: 'User input message'}
																	</div>
																</div>
																<div class="mt-1 text-right text-xs text-gray-500">
																	<span class="font-medium">User</span>
																</div>
															</div>
														</div>

														<!-- AI Response -->
														<div class="flex justify-start gap-3">
															<div class="max-w-[80%]">
																<div class="rounded-lg border bg-white p-3">
																	<div class="whitespace-pre-wrap text-sm">
																		{testResult.aiResponse}
																	</div>
																</div>
																<div class="mt-1 text-xs text-gray-500">
																	<span class="font-medium">AI Assistant</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											{:else}
												<div class="rounded-lg bg-gray-50 p-4 text-center text-gray-500">
													<p>No AI response found for this test.</p>
													<p class="mt-1 text-xs">
														This might be because the response data wasn't saved or is in a
														different format.
													</p>
												</div>
											{/if}

											<!-- Test Evaluation -->
											{#if testResult.evaluation}
												<div class="space-y-3">
													<h4 class="text-sm font-medium">Evaluation Details</h4>
													<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
														{#if testResult.evaluation.strengths && testResult.evaluation.strengths.length > 0}
															<div>
																<div class="mb-1 text-xs font-medium text-green-600">
																	Strengths:
																</div>
																<ul class="space-y-1 text-xs text-green-600">
																	{#each testResult.evaluation.strengths as strength}
																		<li class="flex items-start">
																			<span class="mr-1">✓</span>
																			{strength}
																		</li>
																	{/each}
																</ul>
															</div>
														{/if}

														{#if testResult.evaluation.weaknesses && testResult.evaluation.weaknesses.length > 0}
															<div>
																<div class="mb-1 text-xs font-medium text-red-600">
																	Areas for Improvement:
																</div>
																<ul class="space-y-1 text-xs text-red-600">
																	{#each testResult.evaluation.weaknesses as weakness}
																		<li class="flex items-start">
																			<span class="mr-1">⚠</span>
																			{weakness}
																		</li>
																	{/each}
																</ul>
															</div>
														{/if}
													</div>

													{#if testResult.evaluation.recommendations && testResult.evaluation.recommendations.length > 0}
														<div>
															<div class="mb-1 text-xs font-medium text-blue-600">
																Recommendations:
															</div>
															<ul class="space-y-1 text-xs text-blue-600">
																{#each testResult.evaluation.recommendations as recommendation}
																	<li class="flex items-start">
																		<span class="mr-1">💡</span>
																		{recommendation}
																	</li>
																{/each}
															</ul>
														</div>
													{/if}
												</div>
											{/if}
										</div>
									</details>
								{/each}
							</div>

							<!-- Raw Summary -->
							{#if selectedTestRun.summary}
								<div class="space-y-3">
									<h3 class="font-semibold">Detailed Summary</h3>
									<Textarea
										value={selectedTestRun.summary}
										readonly
										class="min-h-[200px] font-mono text-xs"
									/>
								</div>
							{/if}
						</CardContent>
					</Card>
				{/if}
				{#if testResults}
					<Card>
						<CardHeader>
							<CardTitle class="flex items-center justify-between">
								Quality Test Results
								{#if exportData}
									<Button onclick={downloadResults} variant="outline" size="sm">
										<Download class="mr-2 h-4 w-4" />
										Download Results
									</Button>
								{/if}
							</CardTitle>
							<CardDescription
								>Comprehensive analysis of conversation quality metrics</CardDescription
							>
						</CardHeader>
						<CardContent class="space-y-6">
							<!-- Overall Summary -->
							{#if testResults.summary}
								<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
									<div class="space-y-1 text-center">
										<p class="text-2xl font-bold">{testResults.summary.totalTests}</p>
										<p class="text-xs text-muted-foreground">Total Tests</p>
									</div>
									<div class="space-y-1 text-center">
										<p class="text-2xl font-bold text-green-600">{testResults.summary.passed}</p>
										<p class="text-xs text-muted-foreground">Passed</p>
									</div>
									<div class="space-y-1 text-center">
										<p class="text-2xl font-bold">
											{formatPercentage(testResults.summary.passRate)}
										</p>
										<p class="text-xs text-muted-foreground">Pass Rate</p>
									</div>
									<div class="space-y-1 text-center">
										<p class="text-2xl font-bold">{Math.round(testResults.summary.averageScore)}</p>
										<p class="text-xs text-muted-foreground">Avg Score</p>
									</div>
								</div>
							{/if}

							<!-- Category Breakdown -->
							{#if testResults.categoryBreakdown && Object.keys(testResults.categoryBreakdown).length > 0}
								<div class="space-y-3">
									<h3 class="font-semibold">Category Performance</h3>
									<div class="space-y-2">
										{#each Object.entries(testResults.categoryBreakdown) as [category, scores]}
											<div class="flex items-center justify-between rounded-lg border p-3">
												<div class="space-y-1">
													<p class="text-sm font-medium">
														{category.replace(/_/g, ' ').toUpperCase()}
													</p>
													<p class="text-xs text-muted-foreground">{scores.testCount} tests</p>
												</div>
												<div class="flex items-center space-x-2">
													<Badge variant={getScoreBadgeVariant(scores.averageScore)}>
														{Math.round(scores.averageScore)}/100
													</Badge>
													<span class="text-sm text-muted-foreground">
														{formatPercentage(scores.passRate)}
													</span>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Individual Test Conversations (only show if not in Test Run Details view) -->
							{#if testResults.detailedResults && testResults.detailedResults.length > 0 && !selectedTestRun}
								<div class="space-y-4">
									<h3 class="font-semibold">💬 Individual Test Conversations</h3>
									<div class="space-y-6">
										{#each testResults.detailedResults as testResult, index}
											{#if testResult.turnResults && testResult.turnResults.length > 0}
												<!-- Multi-Turn Conversation Detail View -->
												<details class="rounded-lg border">
													<summary
														class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
													>
														🎯 {testResult.scenarioId ||
															testResult.scenarioName ||
															`Test ${index + 1}`}
														<Badge
															variant={testResult.passed ? 'default' : 'destructive'}
															class="ml-2"
														>
															{testResult.overallScore || testResult.score || 0}/100
														</Badge>
														<span class="ml-2 text-xs text-gray-600">
															{testResult.turnResults.length} turns
														</span>
													</summary>
													<div class="space-y-6 p-4">
														<!-- Multi-Turn Test Overview -->
														<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.overallScore || testResult.score || 0}
																</div>
																<div class="text-xs text-gray-600">Overall Score</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.passed ? '✅' : '❌'}
																</div>
																<div class="text-xs text-gray-600">Status</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">{testResult.turnResults.length}</div>
																<div class="text-xs text-gray-600">Total Turns</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.averageTurnScore?.toFixed(1) || 'N/A'}
																</div>
																<div class="text-xs text-gray-600">Avg Turn Score</div>
															</div>
														</div>

														<!-- Conversation Analysis Metrics -->
														{#if testResult.conversationAnalysis || testResult.userGrowthAchieved}
															<div class="space-y-3">
																<h4 class="text-sm font-medium">🎯 Conversation Analysis</h4>
																<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600"
																				>User Growth Achieved:</span
																			>
																			<span class="text-xs font-medium">
																				{testResult.userGrowthAchieved?.length ||
																					testResult.conversationAnalysis?.userGrowthAchieved
																						?.length ||
																					0} milestones
																			</span>
																		</div>
																		{#if testResult.userGrowthAchieved?.length > 0 || testResult.conversationAnalysis?.userGrowthAchieved?.length > 0}
																			<div class="rounded bg-green-50 p-2 text-xs text-green-600">
																				{testResult.userGrowthAchieved?.join(', ') ||
																					testResult.conversationAnalysis?.userGrowthAchieved?.join(
																						', '
																					)}
																			</div>
																		{/if}
																	</div>
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600"
																				>Path Progression Quality:</span
																			>
																			<span class="text-xs font-medium">
																				{testResult.pathProgressionQuality ||
																					testResult.conversationAnalysis?.pathProgressionQuality ||
																					0}/100
																			</span>
																		</div>
																		<Progress
																			value={testResult.pathProgressionQuality ||
																				testResult.conversationAnalysis?.pathProgressionQuality ||
																				0}
																			class="h-2"
																		/>
																	</div>
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600"
																				>Conversation Coherence:</span
																			>
																			<span class="text-xs font-medium">
																				{testResult.conversationCoherence ||
																					testResult.comparabilityMetrics?.conversationCoherence ||
																					0}%
																			</span>
																		</div>
																		<Progress
																			value={testResult.conversationCoherence ||
																				testResult.comparabilityMetrics?.conversationCoherence ||
																				0}
																			class="h-2"
																		/>
																	</div>
																	<div class="space-y-2">
																		<div class="flex items-center justify-between">
																			<span class="text-xs text-gray-600">Consistency Score:</span>
																			<span class="text-xs font-medium">
																				{testResult.consistencyScore ||
																					testResult.conversationAnalysis?.consistencyScore ||
																					0}/100
																			</span>
																		</div>
																		<Progress
																			value={testResult.consistencyScore ||
																				testResult.conversationAnalysis?.consistencyScore ||
																				0}
																			class="h-2"
																		/>
																	</div>
																</div>
															</div>
														{/if}

														<!-- Turn-by-Turn Conversation Flow -->
														<div class="space-y-3">
															<h4 class="text-sm font-medium">🔄 Turn-by-Turn Conversation Flow</h4>
															<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
																<div class="space-y-4">
																	{#each testResult.turnResults as turn, turnIndex}
																		<div class="border-l-4 border-blue-200 pl-4">
																			<!-- Turn Header -->
																			<div class="mb-2 flex items-center justify-between">
																				<div class="flex items-center space-x-2">
																					<span class="text-sm font-medium"
																						>Turn {turn.turnNumber}</span
																					>
																					<Badge
																						variant={turn.turnScore >= 70
																							? 'default'
																							: turn.turnScore >= 50
																								? 'secondary'
																								: 'destructive'}
																						class="text-xs"
																					>
																						{turn.turnScore}/100
																					</Badge>
																				</div>
																				{#if turn.progressAchieved?.length > 0}
																					<span class="text-xs text-green-600">✅ Progress</span>
																				{/if}
																				{#if turn.criticalFailures?.length > 0}
																					<span class="text-xs text-red-600">⚠️ Issues</span>
																				{/if}
																			</div>

																			<!-- AI Response -->
																			<div class="mb-2">
																				<div class="mb-1 text-xs text-gray-500">
																					🤖 AI Assistant:
																				</div>
																				<div class="rounded border bg-white p-2 text-sm">
																					{turn.aiResponse}
																				</div>
																			</div>

																			<!-- User Response -->
																			<div class="mb-2">
																				<div class="mb-1 text-xs text-gray-500">👤 User:</div>
																				<div
																					class="rounded border border-blue-200 bg-blue-50 p-2 text-sm"
																				>
																					{turn.userResponse}
																				</div>
																			</div>

																			<!-- Turn Analysis -->
																			<div class="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
																				{#if turn.progressAchieved?.length > 0}
																					<div class="text-green-600">
																						<span class="font-medium">Progress:</span>
																						{turn.progressAchieved.join(', ')}
																					</div>
																				{/if}
																				{#if turn.criticalFailures?.length > 0}
																					<div class="text-red-600">
																						<span class="font-medium">Issues:</span>
																						{turn.criticalFailures.join(', ')}
																					</div>
																				{/if}
																			</div>
																		</div>
																	{/each}
																</div>
															</div>
														</div>

														<!-- Progress Summary -->
														{#if testResult.progressAchievedCount > 0 || testResult.criticalFailuresCount > 0}
															<div class="space-y-3">
																<h4 class="text-sm font-medium">📊 Progress Summary</h4>
																<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
																	<div class="text-center">
																		<div class="text-lg font-bold text-green-600">
																			{testResult.progressAchievedCount || 0}
																		</div>
																		<div class="text-xs text-gray-600">Progress Events</div>
																	</div>
																	<div class="text-center">
																		<div class="text-lg font-bold text-red-600">
																			{testResult.criticalFailuresCount || 0}
																		</div>
																		<div class="text-xs text-gray-600">Critical Issues</div>
																	</div>
																	<div class="text-center">
																		<div class="text-lg font-bold">
																			{testResult.turnResults.filter(
																				(t) => t.progressAchieved?.length > 0
																			).length}
																		</div>
																		<div class="text-xs text-gray-600">Successful Turns</div>
																	</div>
																	<div class="text-center">
																		<div class="text-lg font-bold">
																			{testResult.turnResults.filter(
																				(t) => t.criticalFailures?.length > 0
																			).length}
																		</div>
																		<div class="text-xs text-gray-600">Problematic Turns</div>
																	</div>
																</div>
															</div>
														{/if}
													</div>
												</details>
											{:else if testResult.conversationHistory && testResult.conversationHistory.length > 0}
												<!-- Legacy Path Performance Test Detail View -->
												<details class="rounded-lg border">
													<summary
														class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
													>
														🎯 Test {index + 1}: {testResult.testScenario ||
															testResult.scenarioId ||
															`Test ${index + 1}`}
														<Badge
															variant={testResult.score >= 70 ? 'default' : 'destructive'}
															class="ml-2"
														>
															{testResult.score || 0}/100
														</Badge>
													</summary>
													<div class="space-y-4 p-4">
														<!-- Test Info -->
														<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
															<div class="text-center">
																<div class="text-lg font-bold">{testResult.score || 0}</div>
																<div class="text-xs text-gray-600">Score</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.passed ? '✅' : '❌'}
																</div>
																<div class="text-xs text-gray-600">Status</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.conversationHistory.length}
																</div>
																<div class="text-xs text-gray-600">Messages</div>
															</div>
															<div class="text-center">
																<div class="text-lg font-bold">
																	{testResult.category || 'Unknown'}
																</div>
																<div class="text-xs text-gray-600">Category</div>
															</div>
														</div>

														<!-- Conversation Display -->
														<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
															<div class="space-y-4">
																{#each testResult.conversationHistory.filter((msg, idx, arr) => {
																	// Remove duplicate consecutive messages
																	if (idx === 0) return true;
																	const prevMsg = arr[idx - 1];
																	const currentText = msg.parts?.[0]?.text || msg.content || '';
																	const prevText = prevMsg.parts?.[0]?.text || prevMsg.content || '';
																	return currentText !== prevText || msg.role !== prevMsg.role;
																}) as message, msgIndex}
																	<div
																		class="flex gap-3 {message.role === 'user'
																			? 'justify-end'
																			: 'justify-start'}"
																	>
																		<div
																			class="max-w-[80%] {message.role === 'user' ? 'order-2' : ''}"
																		>
																			<!-- Message bubble -->
																			<div
																				class="rounded-lg p-3 {message.role === 'user'
																					? 'bg-blue-100 text-blue-900'
																					: 'border bg-white'}"
																			>
																				<div class="text-sm">
																					{#if message.parts && message.parts[0]?.text}
																						{message.parts[0].text}
																					{:else if message.content}
																						{message.content}
																					{:else}
																						[No content]
																					{/if}
																				</div>
																			</div>

																			<!-- Message metadata -->
																			<div
																				class="mt-1 text-xs text-gray-500 {message.role === 'user'
																					? 'text-right'
																					: 'text-left'}"
																			>
																				<span class="font-medium"
																					>{message.role === 'user' ? 'User' : 'AI Assistant'}</span
																				>
																				{#if message.timestamp}
																					<span class="mx-2">•</span>
																					<span
																						>{new Date(
																							message.timestamp
																						).toLocaleTimeString()}</span
																					>
																				{/if}
																			</div>
																		</div>
																	</div>
																{/each}
															</div>
														</div>

														<!-- Test Evaluation -->
														{#if testResult.evaluation}
															<div class="space-y-3">
																<h4 class="text-sm font-medium">Evaluation Details</h4>
																<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
																	{#if testResult.evaluation.strengths && testResult.evaluation.strengths.length > 0}
																		<div>
																			<div class="mb-1 text-xs font-medium text-green-600">
																				Strengths:
																			</div>
																			<ul class="space-y-1 text-xs text-green-600">
																				{#each testResult.evaluation.strengths as strength}
																					<li class="flex items-start">
																						<span class="mr-1">✓</span>
																						{strength}
																					</li>
																				{/each}
																			</ul>
																		</div>
																	{/if}

																	{#if testResult.evaluation.weaknesses && testResult.evaluation.weaknesses.length > 0}
																		<div>
																			<div class="mb-1 text-xs font-medium text-red-600">
																				Areas for Improvement:
																			</div>
																			<ul class="space-y-1 text-xs text-red-600">
																				{#each testResult.evaluation.weaknesses as weakness}
																					<li class="flex items-start">
																						<span class="mr-1">⚠</span>
																						{weakness}
																					</li>
																				{/each}
																			</ul>
																		</div>
																	{/if}
																</div>

																{#if testResult.evaluation.recommendations && testResult.evaluation.recommendations.length > 0}
																	<div>
																		<div class="mb-1 text-xs font-medium text-blue-600">
																			Recommendations:
																		</div>
																		<ul class="space-y-1 text-xs text-blue-600">
																			{#each testResult.evaluation.recommendations as recommendation}
																				<li class="flex items-start">
																					<span class="mr-1">💡</span>
																					{recommendation}
																				</li>
																			{/each}
																		</ul>
																	</div>
																{/if}
															</div>
														{/if}
													</div>
												</details>
											{/if}
										{/each}
									</div>
								</div>
							{/if}

							<!-- Raw Summary -->
							{#if testSummary}
								<div class="space-y-3">
									<h3 class="font-semibold">Detailed Summary</h3>
									<Textarea value={testSummary} readonly class="min-h-[200px] font-mono text-xs" />
								</div>
							{/if}
						</CardContent>
					</Card>
				{/if}
			</Tabs.Content>

			<!-- Path-Based Performance Testing Tab -->
			<Tabs.Content value="path-testing" class="mt-6 space-y-6">
				<!-- Path Testing Introduction -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center">
							<BarChart3 class="mr-2 h-5 w-5" />
							Path-Based Performance Testing
						</CardTitle>
						<CardDescription>
							Run complete conversation flows and evaluate how each prompt/path performs within the
							context. Tests entire conversations and attributes performance to individual prompts
							using path markers.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="space-y-2 text-sm text-gray-600">
							<p><strong>How it works:</strong></p>
							<ul class="ml-4 list-inside list-disc space-y-1">
								<li>Runs complete conversation scenarios with AI-simulated users</li>
								<li>Tracks path transitions (idle → self_empathy → action_planning)</li>
								<li>Evaluates each path segment individually for effectiveness</li>
								<li>
									Attributes performance scores to specific prompts within conversation context
								</li>
								<li>Analyzes path switching quality and conversation coherence</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				<!-- Path Testing Controls -->
				<Card>
					<CardHeader>
						<CardTitle>Run Path Performance Tests</CardTitle>
						<CardDescription
							>Test complete conversation flows and track path-specific performance</CardDescription
						>
					</CardHeader>
					<CardContent class="space-y-4">
						<!-- Test Configuration -->
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="space-y-2">
								<label class="text-sm font-medium">Test Type</label>
								<Select.Root
									type="single"
									bind:value={selectedPathTestType}
									onValueChange={() => (selectedPathTestScenario = '')}
								>
									<Select.Trigger>
										{selectedPathTestType === 'basic'
											? 'Basic Tests (5 scenarios)'
											: selectedPathTestType === 'single'
												? 'Single Test (Debug mode)'
												: selectedPathTestType === 'comprehensive'
													? 'Comprehensive Tests (All scenarios)'
													: 'Select test type'}
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>Test Types</Select.Label>
											<Select.Item value="basic">Basic Tests (5 scenarios)</Select.Item>
											<Select.Item value="single">Single Test (Debug mode)</Select.Item>
											<Select.Item value="comprehensive"
												>Comprehensive Tests (All scenarios)</Select.Item
											>
										</Select.Group>
									</Select.Content>
								</Select.Root>
							</div>

							{#if selectedPathTestType === 'single'}
								<div class="space-y-2">
									<label class="text-sm font-medium">Test Scenario</label>
									<Select.Root type="single" bind:value={selectedPathTestScenario}>
										<Select.Trigger>
											{data.availableTests.find((t) => t.id === selectedPathTestScenario)?.name ||
												'Select scenario to debug'}
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												<Select.Label>Available Test Scenarios</Select.Label>
												{#each data.availableTests as test}
													<Select.Item value={test.id}>{test.name}</Select.Item>
												{/each}
											</Select.Group>
										</Select.Content>
									</Select.Root>
								</div>
							{/if}
						</div>

						<!-- Action Buttons -->
						<div class="flex gap-3">
							<Button
								onclick={runPathTesting}
								disabled={isRunning ||
									isCancelling ||
									(selectedPathTestType === 'single' && !selectedPathTestScenario)}
								class="flex-1"
							>
								{#if isRunning}
									<div
										class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
									></div>
									{selectedPathTestType === 'single'
										? 'Running Single Test...'
										: 'Running Path Tests...'}
								{:else}
									<Play class="mr-2 h-4 w-4" />
									{selectedPathTestType === 'basic'
										? 'Run Basic Tests (5 scenarios)'
										: selectedPathTestType === 'single'
											? 'Run Single Test'
											: selectedPathTestType === 'comprehensive'
												? 'Run All Tests'
												: 'Run Path Performance Tests'}
								{/if}
							</Button>

							{#if isRunning}
								<Button variant="outline" onclick={cancelPathTesting} disabled={isCancelling}>
									{#if isCancelling}
										Cancelling...
									{:else}
										<X class="mr-2 h-4 w-4" />
										Cancel
									{/if}
								</Button>
							{/if}
						</div>

						<!-- Debug Toggle -->
						<div class="flex items-center gap-2 border-t pt-2">
							<input type="checkbox" id="debugMode" bind:checked={debugMode} class="h-4 w-4" />
							<label for="debugMode" class="text-sm font-medium">
								🔍 Enable Debug Mode (Show raw API responses and detailed logging)
							</label>
						</div>

						<!-- Progress Bar -->
						{#if isRunning}
							<div class="space-y-2">
								<div class="flex justify-between text-sm">
									<span>Testing Progress</span>
									<span>{Math.round(progress)}%</span>
								</div>
								<Progress value={progress} class="h-2" />
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Path Test Results -->
				{#if pathTestResults}
					<Card>
						<CardHeader>
							<CardTitle class="flex items-center">
								<Trophy class="mr-2 h-5 w-5" />
								Path Performance Results
							</CardTitle>
							<CardDescription>
								{#if pathTestResults.summary.totalTests === 1}
									Detailed analysis of single test scenario for debugging
								{:else}
									Performance scores for individual prompts within conversation flows
								{/if}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<!-- Debug Information -->
							{#if debugMode && rawResponse}
								<details class="mb-6 rounded-lg border">
									<summary
										class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
									>
										🔍 Debug Information (Raw API Response)
									</summary>
									<div class="space-y-4 p-4">
										<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
											<div class="text-center">
												<div class="text-lg font-bold">{rawResponse.summary?.totalTests || 0}</div>
												<div class="text-xs text-gray-600">Total Tests</div>
											</div>
											<div class="text-center">
												<div class="text-lg font-bold">
													{rawResponse.summary?.averageScore || 0}
												</div>
												<div class="text-xs text-gray-600">Avg Score</div>
											</div>
											<div class="text-center">
												<div class="text-lg font-bold">
													{rawResponse.summary?.uniquePathsUsed?.length || 0}
												</div>
												<div class="text-xs text-gray-600">Paths Used</div>
											</div>
											<div class="text-center">
												<div class="text-lg font-bold">
													{rawResponse.summary?.pathSwitchingQuality || 0}
												</div>
												<div class="text-xs text-gray-600">Switch Quality</div>
											</div>
										</div>

										<div class="space-y-2">
											<h4 class="text-sm font-medium">Path Aggregation Keys:</h4>
											<div class="rounded bg-gray-100 p-2 text-xs">
												{Object.keys(rawResponse.pathAggregation || {}).join(', ') ||
													'No paths found'}
											</div>
										</div>

										<div class="space-y-2">
											<h4 class="text-sm font-medium">Detailed Results Count:</h4>
											<div class="rounded bg-gray-100 p-2 text-xs">
												{rawResponse.detailedResults?.length || 0} results
											</div>
										</div>

										{#if rawResponse.detailedResults?.length > 0}
											<div class="space-y-2">
												<h4 class="text-sm font-medium">First Test Result:</h4>
												<div class="max-h-40 overflow-y-auto rounded bg-gray-100 p-2 text-xs">
													<pre>{JSON.stringify(rawResponse.detailedResults[0], null, 2)}</pre>
												</div>
											</div>
										{/if}

										{#if rawResponse.error}
											<div class="space-y-2">
												<h4 class="text-sm font-medium text-red-600">Error:</h4>
												<div class="rounded bg-red-100 p-2 text-xs text-red-800">
													{rawResponse.error}
												</div>
											</div>
										{/if}
									</div>
								</details>
							{/if}

							<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
								<div class="text-center">
									<div class="text-2xl font-bold">{pathTestResults.summary.totalTests}</div>
									<div class="text-sm text-gray-600">Conversations</div>
								</div>
								<div class="text-center">
									<div class="text-2xl font-bold">{pathTestResults.summary.averageScore}/100</div>
									<div class="text-sm text-gray-600">Average Score</div>
								</div>
								<div class="text-center">
									<div class="text-2xl font-bold">
										{pathTestResults.summary.uniquePathsUsed.length}
									</div>
									<div class="text-sm text-gray-600">Paths Used</div>
								</div>
								<div class="text-center">
									<div class="text-2xl font-bold">
										{pathTestResults.summary.pathSwitchingQuality}/100
									</div>
									<div class="text-sm text-gray-600">Switch Quality</div>
								</div>
							</div>

							<!-- Single Test Debug Information -->
							{#if pathTestResults.summary.totalTests === 1 && pathTestResults.detailedResults.length > 0}
								{@const testResult = pathTestResults.detailedResults[0]}
								<div class="space-y-4 border-t pt-4">
									<h3 class="font-semibold">🔬 Single Test Debug Information</h3>

									<div class="rounded-lg bg-gray-50 p-4">
										<h4 class="mb-3 font-medium">Test Scenario: {testResult.testScenario}</h4>

										<div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
											<div class="rounded bg-white p-3 text-center">
												<div class="text-xl font-bold">{testResult.totalScore}/100</div>
												<div class="text-sm text-gray-600">Overall Score</div>
											</div>
											<div class="rounded bg-white p-3 text-center">
												<div class="text-xl font-bold">{testResult.pathFlow.length}</div>
												<div class="text-sm text-gray-600">Path Segments</div>
											</div>
											<div class="rounded bg-white p-3 text-center">
												<div class="text-xl font-bold">{testResult.pathSwitchingScore}/100</div>
												<div class="text-sm text-gray-600">Switch Quality</div>
											</div>
										</div>

										{#if testResult.pathFlow.length > 0}
											<div class="mb-4">
												<div class="mb-2 text-sm font-medium text-gray-700">
													Conversation Path Flow:
												</div>
												<div class="flex flex-wrap items-center gap-2">
													{#each testResult.pathFlow as pathId, index}
														<Badge variant="outline" class="bg-blue-50"
															>{pathId.replace('_', ' ')}</Badge
														>
														{#if index < testResult.pathFlow.length - 1}
															<span class="text-gray-400">→</span>
														{/if}
													{/each}
												</div>
											</div>
										{/if}

										{#if testResult.pathPerformances.length > 0}
											<div>
												<div class="mb-2 text-sm font-medium text-gray-700">
													Path Performance Details:
												</div>
												<div class="space-y-2">
													{#each testResult.pathPerformances as pathPerf}
														<div
															class="flex items-center justify-between rounded border bg-white p-2"
														>
															<div>
																<span class="font-medium">{pathPerf.pathId.replace('_', ' ')}</span>
																{#if pathPerf.strengths.length > 0}
																	<div class="mt-1 text-xs text-green-600">
																		✓ {pathPerf.strengths.slice(0, 2).join(', ')}
																	</div>
																{/if}
																{#if pathPerf.weaknesses.length > 0}
																	<div class="mt-1 text-xs text-red-600">
																		⚠ {pathPerf.weaknesses.slice(0, 2).join(', ')}
																	</div>
																{/if}
															</div>
															<Badge
																variant={pathPerf.score >= 80
																	? 'default'
																	: pathPerf.score >= 60
																		? 'secondary'
																		: 'destructive'}
															>
																{pathPerf.score}/100
															</Badge>
														</div>
													{/each}
												</div>
											</div>
										{/if}
									</div>
								</div>

								<!-- Conversation History Display -->
								{#if pathTestResults.detailedResults.length > 0 && pathTestResults.detailedResults[0].conversationHistory}
									{@const conversationHistory =
										pathTestResults.detailedResults[0].conversationHistory}
									<div class="space-y-4 border-t pt-4">
										<div class="flex items-center justify-between">
											<h3 class="font-semibold">💬 Generated Conversation</h3>
											<Badge variant="outline">{conversationHistory.length} messages</Badge>
										</div>

										<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
											<div class="space-y-4">
												{#each conversationHistory as message, index}
													<div
														class="flex gap-3 {message.role === 'user'
															? 'justify-end'
															: 'justify-start'}"
													>
														<div class="max-w-[80%] {message.role === 'user' ? 'order-2' : ''}">
															<!-- Message bubble -->
															<div
																class="rounded-lg p-3 {message.role === 'user'
																	? 'bg-blue-100 text-blue-900'
																	: 'border bg-white'}"
															>
																<div class="text-sm">
																	{#if message.parts && message.parts[0]?.text}
																		{message.parts[0].text}
																	{:else if message.content}
																		{message.content}
																	{:else}
																		[No content]
																	{/if}
																</div>
															</div>

															<!-- Message metadata -->
															<div
																class="mt-1 text-xs text-gray-500 {message.role === 'user'
																	? 'text-right'
																	: 'text-left'}"
															>
																<span class="font-medium"
																	>{message.role === 'user' ? 'User' : 'AI Assistant'}</span
																>
																{#if message.pathMarker}
																	<span class="mx-2">•</span>
																	<span
																		class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
																	>
																		{message.pathMarker.type}: {message.pathMarker.path}
																	</span>
																{/if}
																{#if message.timestamp}
																	<span class="mx-2">•</span>
																	<span>{new Date(message.timestamp).toLocaleTimeString()}</span>
																{/if}
															</div>
														</div>
													</div>
												{/each}
											</div>
										</div>

										<!-- Test Scenario Context -->
										<details class="rounded-lg border">
											<summary
												class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
											>
												🎯 Test Scenario Details
											</summary>
											<div class="space-y-2 p-4">
												<div>
													<span class="text-sm font-medium">Scenario ID:</span>
													<span class="ml-2 text-sm text-gray-600">{testResult.testScenario}</span>
												</div>
												{#if data.availableTests.find((t) => t.id === testResult.testScenario)}
													{@const scenario = data.availableTests.find(
														(t) => t.id === testResult.testScenario
													)}
													<div>
														<span class="text-sm font-medium">Description:</span>
														<span class="ml-2 text-sm text-gray-600"
															>{scenario.description || 'No description available'}</span
														>
													</div>
													{#if scenario.inputMessage}
														<div>
															<span class="text-sm font-medium">Test Input:</span>
															<div class="mt-1 rounded bg-gray-100 p-2 text-sm">
																{scenario.inputMessage}
															</div>
														</div>
													{/if}
													{#if scenario.expectedOutcomes}
														<div>
															<span class="text-sm font-medium">Expected Outcomes:</span>
															<ul class="ml-4 mt-1 space-y-1 text-sm text-gray-600">
																{#each scenario.expectedOutcomes as outcome}
																	<li class="flex items-start">
																		<span class="mr-2 text-green-500">✓</span>
																		{outcome}
																	</li>
																{/each}
															</ul>
														</div>
													{/if}
												{/if}
											</div>
										</details>
									</div>
								{/if}
							{/if}

							<!-- Path Performance Breakdown -->
							{#if pathTestResults.pathAggregation}
								<div class="space-y-4">
									<h3 class="font-semibold">Path Performance Breakdown</h3>
									<div class="grid gap-4">
										{#each Object.entries(pathTestResults.pathAggregation) as [pathId, pathData]}
											<div class="rounded-lg border p-4">
												<div class="mb-3 flex items-center justify-between">
													<h4 class="font-medium capitalize">{pathId.replace('_', ' ')}</h4>
													<Badge
														variant={pathData.averageScore >= 80
															? 'default'
															: pathData.averageScore >= 60
																? 'secondary'
																: 'destructive'}
													>
														{pathData.averageScore}/100
													</Badge>
												</div>

												<div class="mb-3 grid grid-cols-3 gap-4 text-sm">
													<div>
														<div class="text-gray-600">Tests</div>
														<div class="font-medium">{pathData.totalTests}</div>
													</div>
													<div>
														<div class="text-gray-600">User Growth</div>
														<div class="font-medium">{pathData.averageUserGrowthScore}/100</div>
													</div>
													<div>
														<div class="text-gray-600">NVC Compliance</div>
														<div class="font-medium">{pathData.averageNvcComplianceScore}/100</div>
													</div>
												</div>

												{#if pathData.commonStrengths?.length > 0}
													<div class="mb-2">
														<div class="mb-1 text-xs text-gray-600">Strengths:</div>
														<div class="text-sm">
															{pathData.commonStrengths.join(', ')}
														</div>
													</div>
												{/if}

												{#if pathData.commonWeaknesses?.length > 0}
													<div>
														<div class="mb-1 text-xs text-gray-600">Areas for Improvement:</div>
														<div class="text-sm text-red-600">
															{pathData.commonWeaknesses.join(', ')}
														</div>
													</div>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- All Conversations Display -->
							{#if pathTestResults.detailedResults && pathTestResults.detailedResults.length > 0}
								<div class="space-y-4 border-t pt-4">
									<h3 class="font-semibold">💬 All Generated Conversations</h3>
									<div class="space-y-6">
										{#each pathTestResults.detailedResults as testResult, index}
											{#if testResult.conversationHistory && testResult.conversationHistory.length > 0}
												<details class="rounded-lg border">
													<summary
														class="cursor-pointer rounded-lg bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200"
													>
														🎯 Test {index + 1}: {testResult.testScenario} (Score: {testResult.totalScore}/100)
													</summary>
													<div class="space-y-4 p-4">
														<!-- Conversation Display -->
														<div class="max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
															<div class="space-y-4">
																{#each testResult.conversationHistory.filter((msg, idx, arr) => {
																	// Remove duplicate consecutive messages
																	if (idx === 0) return true;
																	const prevMsg = arr[idx - 1];
																	const currentText = msg.parts?.[0]?.text || msg.content || '';
																	const prevText = prevMsg.parts?.[0]?.text || prevMsg.content || '';
																	return currentText !== prevText || msg.role !== prevMsg.role;
																}) as message, msgIndex}
																	<div
																		class="flex gap-3 {message.role === 'user'
																			? 'justify-end'
																			: 'justify-start'}"
																	>
																		<div
																			class="max-w-[80%] {message.role === 'user' ? 'order-2' : ''}"
																		>
																			<!-- Message bubble -->
																			<div
																				class="rounded-lg p-3 {message.role === 'user'
																					? 'bg-blue-100 text-blue-900'
																					: 'border bg-white'}"
																			>
																				<div class="text-sm">
																					{#if message.parts && message.parts[0]?.text}
																						{message.parts[0].text}
																					{:else if message.content}
																						{message.content}
																					{:else}
																						[No content]
																					{/if}
																				</div>
																			</div>

																			<!-- Message metadata -->
																			<div
																				class="mt-1 text-xs text-gray-500 {message.role === 'user'
																					? 'text-right'
																					: 'text-left'}"
																			>
																				<span class="font-medium"
																					>{message.role === 'user' ? 'User' : 'AI Assistant'}</span
																				>
																				{#if message.pathMarker}
																					<span class="mx-2">•</span>
																					<span
																						class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800"
																					>
																						{message.pathMarker.type}: {message.pathMarker.path}
																					</span>
																				{/if}
																				{#if message.timestamp}
																					<span class="mx-2">•</span>
																					<span
																						>{new Date(
																							message.timestamp
																						).toLocaleTimeString()}</span
																					>
																				{/if}
																			</div>
																		</div>
																	</div>
																{/each}
															</div>
														</div>

														<!-- Path Flow -->
														{#if testResult.pathFlow && testResult.pathFlow.length > 0}
															<div>
																<div class="mb-2 text-sm font-medium text-gray-700">Path Flow:</div>
																<div class="flex flex-wrap items-center gap-2">
																	{#each testResult.pathFlow as pathId, pathIndex}
																		<Badge variant="outline" class="bg-blue-50"
																			>{pathId.replace('_', ' ')}</Badge
																		>
																		{#if pathIndex < testResult.pathFlow.length - 1}
																			<span class="text-gray-400">→</span>
																		{/if}
																	{/each}
																</div>
															</div>
														{/if}
													</div>
												</details>
											{/if}
										{/each}
									</div>
								</div>
							{/if}
						</CardContent>
					</Card>
				{/if}

				<!-- Available Test Scenarios -->
				<Card>
					<CardHeader>
						<CardTitle>Available Test Scenarios</CardTitle>
						<CardDescription
							>Browse and understand all available conversation quality test scenarios</CardDescription
						>
					</CardHeader>
					<CardContent class="space-y-6">
						<!-- Test Categories Overview -->
						<div class="space-y-4">
							<h3 class="font-semibold">Test Categories</h3>
							<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{#each data.testCategories as category}
									<Card>
										<CardHeader class="pb-2">
											<CardTitle class="text-sm"
												>{category.replace(/_/g, ' ').toUpperCase()}</CardTitle
											>
										</CardHeader>
										<CardContent>
											<p class="text-xs text-muted-foreground">
												Tests focusing on {category.replace(/_/g, ' ')} aspects of conversation quality
											</p>
										</CardContent>
									</Card>
								{/each}
							</div>
						</div>

						<!-- Individual Test Scenarios -->
						<div class="space-y-4">
							<h3 class="font-semibold">Individual Test Scenarios</h3>
							<div class="space-y-4">
								{#each data.availableTests as test}
									<Card>
										<CardHeader>
											<CardTitle class="text-base">{test.name}</CardTitle>
											<CardDescription>{test.description}</CardDescription>
										</CardHeader>
										<CardContent class="space-y-3">
											<div class="flex items-center justify-between">
												<Badge variant="outline">{test.category}</Badge>
												<Badge variant="secondary">{test.difficulty || 'Standard'}</Badge>
											</div>

											{#if test.expectedOutcomes}
												<div class="space-y-2">
													<p class="text-sm font-medium">Expected Outcomes:</p>
													<ul class="space-y-1 text-sm text-muted-foreground">
														{#each test.expectedOutcomes as outcome}
															<li class="flex items-start">
																<span class="mr-2 text-green-500">✓</span>
																{outcome}
															</li>
														{/each}
													</ul>
												</div>
											{/if}

											{#if test.testSteps}
												<div class="space-y-2">
													<p class="text-sm font-medium">Test Steps:</p>
													<ol class="space-y-1 text-sm text-muted-foreground">
														{#each test.testSteps as step}
															<li class="flex items-start">
																<span class="mr-2 font-medium text-blue-500"
																	>{test.testSteps.indexOf(step) + 1}.</span
																>
																{step}
															</li>
														{/each}
													</ol>
												</div>
											{/if}
										</CardContent>
									</Card>
								{/each}
							</div>
						</div>

						<!-- Test Execution Instructions -->
						<div class="space-y-3">
							<h3 class="font-semibold">How to Run Tests</h3>
							<div class="space-y-3">
								<h4 class="font-medium">Test Types</h4>
								<div class="space-y-2 text-sm">
									<div class="flex items-start">
										<span class="mr-2 font-medium text-blue-500">•</span>
										<span
											><strong>Basic Test Suite:</strong> Core scenarios covering fundamental conversation
											quality aspects</span
										>
									</div>
									<div class="flex items-start">
										<span class="mr-2 font-medium text-blue-500">•</span>
										<span
											><strong>Advanced Test Suite:</strong> Complex scenarios testing nuanced conversation
											capabilities</span
										>
									</div>
									<div class="flex items-start">
										<span class="mr-2 font-medium text-blue-500">•</span>
										<span
											><strong>Category Tests:</strong> Focus on specific areas like empathy, clarity,
											or problem-solving</span
										>
									</div>
									<div class="flex items-start">
										<span class="mr-2 font-medium text-blue-500">•</span>
										<span
											><strong>Single Tests:</strong> Run individual scenarios for detailed analysis</span
										>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</Tabs.Content>
		</Tabs.Root>
	</div>
	<Footer />
</div>
