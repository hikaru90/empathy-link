/**
 * Automated Test Runner for Conversation Quality
 * Orchestrates running test scenarios and collecting results
 */

import { ai } from './gemini.js';
import { getSystemPromptForPath } from './paths.js';
import { ConversationEvaluator, type ConversationMetricsReport } from './conversationEvaluator.js';
import { TEST_SCENARIOS, ADVANCED_TEST_SCENARIOS, type TestScenario, type TestResult } from './conversationTestSuite.js';

export class ConversationTestRunner {
	private evaluator: ConversationEvaluator;
	private authenticatedPB: any | null = null;
	private authenticatedUser: any | null = null;

	constructor() {
		this.evaluator = new ConversationEvaluator();
	}

	/**
	 * Set authenticated PocketBase instance for database access
	 */
	setAuthenticatedPB(pb: any, user: any) {
		this.authenticatedPB = pb;
		this.authenticatedUser = user;
		console.log('🔑 Test runner authenticated with user:', user?.email || user?.id);
	}

	/**
	 * Run all basic test scenarios
	 */
	async runBasicTests(): Promise<ConversationMetricsReport> {
		console.log('🧪 Starting basic conversation quality tests...');
		const results = await this.runTestScenarios(TEST_SCENARIOS);
		return this.evaluator.generateMetricsReport(results);
	}

	/**
	 * Run advanced test scenarios
	 */
	async runAdvancedTests(): Promise<ConversationMetricsReport> {
		console.log('🔬 Starting advanced conversation quality tests...');
		const results = await this.runTestScenarios(ADVANCED_TEST_SCENARIOS);
		return this.evaluator.generateMetricsReport(results);
	}

	/**
	 * Run all tests (basic + advanced)
	 */
	async runAllTests(): Promise<ConversationMetricsReport> {
		console.log('🎯 Starting comprehensive conversation quality tests...');
		const allScenarios = [...TEST_SCENARIOS, ...ADVANCED_TEST_SCENARIOS];
		const results = await this.runTestScenarios(allScenarios);
		return this.evaluator.generateMetricsReport(results);
	}

	/**
	 * Run specific test scenario by ID
	 */
	async runSingleTest(scenarioId: string): Promise<TestResult | null> {
		const scenario = [...TEST_SCENARIOS, ...ADVANCED_TEST_SCENARIOS]
			.find(s => s.id === scenarioId);
		
		if (!scenario) {
			console.error(`Test scenario ${scenarioId} not found`);
			return null;
		}

		console.log(`🔍 Running single test: ${scenario.name}`);
		const response = await this.generateAIResponse(scenario);
		return this.evaluator.evaluateResponse(scenario, response.aiResponse, response.path);
	}

	/**
	 * Run single test with conversation history for path-based analysis
	 */
	async runSingleTestWithHistory(scenarioId: string): Promise<{
		testResult: TestResult | null;
		conversationHistory: any[];
		scenario: TestScenario | null;
	}> {
		const scenario = [...TEST_SCENARIOS, ...ADVANCED_TEST_SCENARIOS]
			.find(s => s.id === scenarioId);
		
		if (!scenario) {
			console.error(`Test scenario ${scenarioId} not found`);
			return {
				testResult: null,
				conversationHistory: [],
				scenario: null
			};
		}

		console.log(`🔍 Running single test with history: ${scenario.name}`);
		const response = await this.generateAIResponseWithHistory(scenario);
		
		const testResult = this.evaluator.evaluateResponse(scenario, response.aiResponse, response.path);
		
		return {
			testResult,
			conversationHistory: response.conversationHistory,
			scenario
		};
	}

	/**
	 * Run tests for specific category
	 */
	async runCategoryTests(category: string): Promise<ConversationMetricsReport> {
		const categoryScenarios = [...TEST_SCENARIOS, ...ADVANCED_TEST_SCENARIOS]
			.filter(s => s.category === category);
		
		if (categoryScenarios.length === 0) {
			throw new Error(`No tests found for category: ${category}`);
		}

		console.log(`📊 Running ${categoryScenarios.length} tests for category: ${category}`);
		const results = await this.runTestScenarios(categoryScenarios);
		return this.evaluator.generateMetricsReport(results);
	}

	/**
	 * Core test execution logic
	 */
	private async runTestScenarios(scenarios: TestScenario[]): Promise<TestResult[]> {
		const results: TestResult[] = [];
		
		for (let i = 0; i < scenarios.length; i++) {
			const scenario = scenarios[i];
			console.log(`Running test ${i + 1}/${scenarios.length}: ${scenario.name}`);
			
			try {
				const response = await this.generateAIResponseWithHistory(scenario);
				console.log(`🔍 DEBUG: AI Response for ${scenario.id}:`, response.aiResponse);
				console.log(`🔍 DEBUG: Expected Path: ${scenario.expectedPath}, Actual Path: ${response.path}`);
				
				const evaluation = await this.evaluator.evaluateResponse(
					scenario, 
					response.aiResponse, 
					response.path
				);
				
				console.log(`🔍 DEBUG: Evaluation result for ${scenario.id}:`, {
					score: evaluation.score,
					passed: evaluation.passed,
					strengths: evaluation.evaluation.strengths,
					weaknesses: evaluation.evaluation.weaknesses
				});
				
				results.push(evaluation);
				console.log(`✅ Test ${scenario.id}: Score ${evaluation.score}/100 ${evaluation.passed ? '(PASSED)' : '(FAILED)'}`);
				
			} catch (error) {
				console.error(`❌ Test ${scenario.id} failed:`, error);
				results.push({
					scenarioId: scenario.id,
					passed: false,
					score: 0,
					metrics: {
						userGrowthScore: 0,
						nvcComplianceScore: 0,
						circularPreventionScore: 0,
						pathSwitchingScore: 0,
						conversationBalanceScore: 0
					},
					aiResponse: '',
					evaluation: {
						strengths: [],
						weaknesses: ['Test execution failed'],
						recommendations: ['Debug test execution system']
					}
				});
			}
			
			// Small delay to avoid API rate limits (reduced for faster execution)
			await new Promise(resolve => setTimeout(resolve, 200));
		}
		
		return results;
	}

	/**
	 * Generate AI response for a test scenario
	 */
	private async generateAIResponse(scenario: TestScenario): Promise<{aiResponse: string, path: string}> {
		const context = scenario.contextSetup;
		const currentPath = context?.currentPath || 'idle';
		
		// Get system prompt for current path with authentication
		const systemPrompt = await getSystemPromptForPath(
			currentPath, 
			context?.userProfile || this.getDefaultUserProfile(),
			undefined, // No memory context for tests
			this.authenticatedPB  // Pass authenticated PB instance
		);
		
		// Build conversation history
		const history: Array<{role: 'user' | 'model', parts: Array<{text: string}>}> = [];
		
		// Add context messages if they exist
		if (context?.messageHistory && context.messageHistory.length > 0) {
			// Ensure first message is from user (Gemini requirement)
			const messages = [...context.messageHistory];
			if (messages[0].role === 'model') {
				messages.unshift({
					role: 'user',
					content: '[System: Conversation initialized]',
					timestamp: Date.now() - 1000000
				});
			}
			
			messages.forEach(msg => {
				history.push({
					role: msg.role === 'user' ? 'user' : 'model',
					parts: [{ text: msg.content }]
				});
			});
		}
		
		// Add the current user message
		history.push({
			role: 'user',
			parts: [{ text: scenario.inputMessage }]
		});
		
		// Ensure we start with a user message
		if (history.length === 0 || history[0].role === 'model') {
			history.unshift({
				role: 'user',
				parts: [{ text: '[System: Test conversation initialized]' }]
			});
		}
		
		// Create chat session
		const model = ai.chats.create({
			model: 'gemini-2.5-flash',
			config: {
				temperature: 0.7,
				systemInstruction: systemPrompt
			},
			history: history
		});
		
		// Get AI response
		const result = await model.sendMessage({
			message: scenario.inputMessage
		});
		
		return {
			aiResponse: result.text || '',
			path: currentPath
		};
	}

	/**
	 * Generate AI response with full conversation history for path-based analysis
	 */
	private async generateAIResponseWithHistory(scenario: TestScenario): Promise<{
		aiResponse: string, 
		path: string,
		conversationHistory: any[]
	}> {
		const context = scenario.contextSetup;
		const currentPath = context?.currentPath || 'idle';
		
		// Get system prompt for current path with authentication
		const systemPrompt = await getSystemPromptForPath(
			currentPath, 
			context?.userProfile || this.getDefaultUserProfile(),
			undefined, // No memory context for tests
			this.authenticatedPB  // Pass authenticated PB instance
		);
		
		// Build conversation history
		const history: Array<{role: 'user' | 'model', parts: Array<{text: string}>}> = [];
		
		// Add context messages if they exist
		if (context?.messageHistory && context.messageHistory.length > 0) {
			// Ensure first message is from user (Gemini requirement)
			const messages = [...context.messageHistory];
			if (messages[0].role === 'model') {
				messages.unshift({
					role: 'user',
					content: '[System: Conversation initialized]',
					timestamp: Date.now() - 1000000
				});
			}
			
			messages.forEach(msg => {
				history.push({
					role: msg.role === 'user' ? 'user' : 'model',
					parts: [{ text: msg.content }]
				});
			});
		}
		
		// Don't add the current user message to history since we'll send it via sendMessage
		// This prevents duplication in the conversation
		
		// Ensure we start with a user message
		if (history.length === 0 || history[0].role === 'model') {
			history.unshift({
				role: 'user',
				parts: [{ text: '[System: Test conversation initialized]' }]
			});
		}
		
		// Create chat session
		const model = ai.chats.create({
			model: 'gemini-2.5-flash',
			config: {
				temperature: 0.7,
				systemInstruction: systemPrompt
			},
			history: history
		});
		
		// Get AI response
		const result = await model.sendMessage({
			message: scenario.inputMessage
		});
		
		// Get the complete conversation history from the chat
		const completeHistory = await model.getHistory();
		
		// Add path markers to the conversation history for path-based evaluation
		const historyWithMarkers = await this.addPathMarkersToHistory(completeHistory, currentPath);
		
		return {
			aiResponse: result.text || '',
			path: currentPath,
			conversationHistory: historyWithMarkers
		};
	}

	/**
	 * Generate a summary report of test results
	 */
	generateTestSummary(report: ConversationMetricsReport): string {
		const { summary, categoryBreakdown, criticalIssues, strengths, recommendations } = report;
		
		let summaryText = `
📊 CONVERSATION QUALITY TEST RESULTS

🎯 OVERALL PERFORMANCE:
- Tests Run: ${summary.totalTests}
- Tests Passed: ${summary.passed} (${summary.passRate.toFixed(1)}%)
- Average Score: ${summary.averageScore.toFixed(1)}/100

📈 CATEGORY BREAKDOWN:`;

		Object.entries(categoryBreakdown).forEach(([category, scores]) => {
			summaryText += `\n- ${category.toUpperCase()}: ${scores.averageScore.toFixed(1)}/100 (${scores.passRate.toFixed(1)}% pass rate)`;
		});

		if (strengths.length > 0) {
			summaryText += `\n\n✅ STRENGTHS:\n${strengths.map(s => `- ${s}`).join('\n')}`;
		}

		if (criticalIssues.length > 0) {
			summaryText += `\n\n⚠️ CRITICAL ISSUES:\n${criticalIssues.map(i => `- ${i}`).join('\n')}`;
		}

		if (recommendations.length > 0) {
			summaryText += `\n\n🔧 RECOMMENDATIONS:\n${recommendations.map(r => `- ${r}`).join('\n')}`;
		}

		return summaryText;
	}

	/**
	 * Export detailed results to JSON
	 */
	exportResults(report: ConversationMetricsReport, filename?: string): string {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const exportFilename = filename || `conversation-test-results-${timestamp}.json`;
		
		const exportData = {
			timestamp: new Date().toISOString(),
			summary: report.summary,
			categoryBreakdown: report.categoryBreakdown,
			patterns: {
				criticalIssues: report.criticalIssues,
				strengths: report.strengths
			},
			recommendations: report.recommendations,
			detailedResults: report.detailedResults.map(result => ({
				scenarioId: result.scenarioId,
				passed: result.passed,
				score: result.score,
				metrics: result.metrics,
				strengths: result.evaluation.strengths,
				weaknesses: result.evaluation.weaknesses,
				recommendations: result.evaluation.recommendations,
				// Include AI response for debugging but truncate if too long
				aiResponsePreview: result.aiResponse.length > 200 
					? result.aiResponse.substring(0, 200) + '...'
					: result.aiResponse
			}))
		};
		
		return JSON.stringify(exportData, null, 2);
	}

	/**
	 * Get available test scenarios
	 */
	getAvailableTests(): Array<{id: string, name: string, category: string, description: string}> {
		return [...TEST_SCENARIOS, ...ADVANCED_TEST_SCENARIOS].map(scenario => ({
			id: scenario.id,
			name: scenario.name,
			category: scenario.category,
			description: scenario.description
		}));
	}

	/**
	 * Get test categories
	 */
	getTestCategories(): string[] {
		const categories = new Set([...TEST_SCENARIOS, ...ADVANCED_TEST_SCENARIOS].map(s => s.category));
		return Array.from(categories);
	}

	/**
	 * Get default user profile for testing when none is specified
	 */
	private getDefaultUserProfile() {
		return {
			firstName: 'TestUser',
			aiAnswerLength: 'medium',
			toneOfVoice: 'heartfelt',
			nvcKnowledge: 'advanced'
		};
	}

	/**
	 * Add path markers to conversation history for path-based evaluation
	 */
	private async addPathMarkersToHistory(history: any[], currentPath: string): Promise<any[]> {
		const { createPathMarker } = await import('./paths.js');
		
		// Add path start marker at the beginning
		const historyWithMarkers = [
			{
				role: 'model',
				parts: [{ text: '' }],
				timestamp: Date.now() - 1000,
				pathMarker: createPathMarker('path_start', currentPath)
			},
			...history
		];
		
		// Add path end marker at the end
		historyWithMarkers.push({
			role: 'model',
			parts: [{ text: '' }],
			timestamp: Date.now(),
			pathMarker: createPathMarker('path_end', currentPath)
		});
		
		return historyWithMarkers;
	}
}