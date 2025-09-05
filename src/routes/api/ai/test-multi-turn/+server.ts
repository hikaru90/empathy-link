/**
 * API endpoint for running multi-turn conversation tests
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MultiTurnTestRunner, MULTI_TURN_TEST_SCENARIOS } from '$lib/server/multiTurnTestSuite.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	
	// Require authentication for test execution
	if (!user) {
		return error(401, 'Authentication required');
	}
	
	try {
		const { testType, scenarioId, maxTurns } = await request.json();
		
		const testRunner = new MultiTurnTestRunner();
		
		let results;
		
		switch (testType) {
			case 'single':
				if (!scenarioId) {
					return error(400, 'Scenario ID required for single test');
				}
				
				const scenario = MULTI_TURN_TEST_SCENARIOS.find(s => s.id === scenarioId);
				if (!scenario) {
					return error(404, 'Test scenario not found');
				}
				
				// Override maxTurns if provided
				if (maxTurns && typeof maxTurns === 'number' && maxTurns > 0) {
					scenario.maxTurns = Math.min(maxTurns, 15); // Cap at 15 turns max
				}
				
				console.log(`🔄 Running multi-turn test: ${scenario.name} (max ${scenario.maxTurns} turns)`);
				
				const result = await testRunner.runMultiTurnTest(scenario, locals.pb, request.signal);
				
				// Extract path information from the test results
				const uniquePathsUsed = result.pathResults?.map(pr => pr.pathId) || [];
				const pathResults = result.pathResults || [];
				
				console.log(`📍 Paths used in test:`, uniquePathsUsed);
				console.log(`📊 Path-specific results:`, pathResults.map(pr => ({
					pathId: pr.pathId,
					pathName: pr.pathName,
					turnsInPath: pr.turnsInPath,
					pathScore: pr.pathScore
				})));
				
				return json({
					testType: 'single',
					scenarioId: scenario.id,
					scenarioName: scenario.name,
					result,
					pathResults, // NEW: Include path-specific results
					uniquePathsUsed, // NEW: Include list of paths used
					summary: {
						success: result.passed,
						totalTurns: result.totalTurns,
						overallScore: result.overallScore,
						conversationAnalysis: result.conversationAnalysis,
						keyInsights: result.turnResults
							.filter(turn => turn.progressAchieved.length > 0)
							.map(turn => `Turn ${turn.turnNumber}: ${turn.progressAchieved.join(', ')}`),
						criticalIssues: result.turnResults
							.filter(turn => turn.criticalFailures.length > 0)
							.map(turn => `Turn ${turn.turnNumber}: ${turn.criticalFailures.join(', ')}`),
						pathInsights: pathResults.map(pr => `${pr.pathName}: ${pr.turnsInPath} turns, score ${pr.pathScore.toFixed(1)}`)
					}
				});
				
			case 'all':
				console.log(`🔄 Running all ${MULTI_TURN_TEST_SCENARIOS.length} multi-turn tests`);
				
				const allResults = [];
				let totalScore = 0;
				let passedTests = 0;
				
				for (const scenario of MULTI_TURN_TEST_SCENARIOS) {
					console.log(`Running: ${scenario.name}`);
					
					try {
						// Check for cancellation before each test
						if (request.signal?.aborted) {
							throw new Error('Test suite cancelled by user');
						}
						
						const testResult = await testRunner.runMultiTurnTest(scenario, locals.pb, request.signal);
						allResults.push({
							scenarioId: scenario.id,
							scenarioName: scenario.name,
							...testResult
						});
						
						totalScore += testResult.overallScore;
						if (testResult.passed) passedTests++;
						
						// Small delay between tests (reduced for faster execution)
						await new Promise(resolve => setTimeout(resolve, 200));
						
					} catch (testError) {
						console.error(`Test ${scenario.id} failed:`, testError);
						allResults.push({
							scenarioId: scenario.id,
							scenarioName: scenario.name,
							passed: false,
							overallScore: 0,
							totalTurns: 0,
							turnResults: [],
							conversationAnalysis: {},
							comparabilityMetrics: {},
							error: testError.message
						});
					}
				}
				
				const avgScore = totalScore / MULTI_TURN_TEST_SCENARIOS.length;
				const passRate = (passedTests / MULTI_TURN_TEST_SCENARIOS.length) * 100;
				
				return json({
					testType: 'all',
					results: allResults,
					summary: {
						totalTests: MULTI_TURN_TEST_SCENARIOS.length,
						passed: passedTests,
						passRate: passRate,
						averageScore: avgScore,
						overallAssessment: passRate >= 80 ? 'Excellent' : 
										   passRate >= 70 ? 'Good' : 
										   passRate >= 60 ? 'Needs Improvement' : 'Poor',
						keyStrengths: this.extractStrengths(allResults),
						criticalWeaknesses: this.extractWeaknesses(allResults),
						recommendations: this.generateRecommendations(allResults, passRate, avgScore)
					}
				});
				
			default:
				return error(400, 'Invalid test type. Use: single or all');
		}
		
	} catch (err: any) {
		console.error('❌ Multi-turn test execution error:', err);
		console.error('❌ Error stack:', err.stack);
		return error(500, `Test execution failed: ${err.message || 'Unknown error'}`);
	}
};

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;
	
	if (!user) {
		return error(401, 'Authentication required');
	}
	
	const action = url.searchParams.get('action');
	
	switch (action) {
		case 'scenarios':
			return json({
				scenarios: MULTI_TURN_TEST_SCENARIOS.map(s => ({
					id: s.id,
					name: s.name,
					description: s.description,
					category: s.category,
					targetPath: s.targetPath,
					maxTurns: s.maxTurns,
					personaName: s.personaId
				}))
			});
			
		case 'personas':
			const { TEST_PERSONAS } = await import('$lib/server/testUserSimulator.js');
			return json({
				personas: Object.values(TEST_PERSONAS).map(p => ({
					id: p.id,
					name: p.name,
					background: p.background,
					emotionalState: p.emotionalState,
					communicationStyle: p.communicationStyle,
					coreIssue: p.coreIssue
				}))
			});
			
		default:
			return json({
				availableActions: ['scenarios', 'personas'],
				testTypes: ['single', 'all'],
				description: 'Multi-turn conversation testing API',
				totalScenarios: MULTI_TURN_TEST_SCENARIOS.length
			});
	}
};

/**
 * Helper functions for analysis
 */
function extractStrengths(results: any[]): string[] {
	const strengths = new Set<string>();
	
	results.forEach(result => {
		if (result.passed && result.conversationAnalysis?.consistencyScore > 80) {
			strengths.add('High conversation consistency across turns');
		}
		if (result.conversationAnalysis?.pathProgressionQuality > 85) {
			strengths.add('Excellent path navigation and progression');
		}
		if (result.comparabilityMetrics?.conversationCoherence > 80) {
			strengths.add('Coherent and logical conversation flow');
		}
	});
	
	return Array.from(strengths);
}

function extractWeaknesses(results: any[]): string[] {
	const weaknesses = new Set<string>();
	
	const failedTests = results.filter(r => !r.passed);
	if (failedTests.length > results.length * 0.3) {
		weaknesses.add('High failure rate indicates systemic prompt issues');
	}
	
	const criticalFailures = results.flatMap(r => 
		r.turnResults?.map(t => t.criticalFailures).flat() || []
	);
	
	if (criticalFailures.some(f => f.includes('Judges') || f.includes('Agrees with judgments'))) {
		weaknesses.add('AI sometimes makes judgments instead of staying empathetic');
	}
	
	if (criticalFailures.some(f => f.includes('Repeats same question'))) {
		weaknesses.add('AI gets stuck in circular questioning patterns');
	}
	
	if (criticalFailures.some(f => f.includes('No emotional progress'))) {
		weaknesses.add('AI struggles to facilitate emotional progress');
	}
	
	return Array.from(weaknesses);
}

function generateRecommendations(results: any[], passRate: number, avgScore: number): string[] {
	const recommendations = [];
	
	if (passRate < 70) {
		recommendations.push('Consider revising core prompt structure - low pass rate suggests fundamental issues');
	}
	
	if (avgScore < 65) {
		recommendations.push('Focus on improving empathy and emotional intelligence in responses');
	}
	
	const commonFailures = results
		.flatMap(r => r.turnResults?.map(t => t.criticalFailures).flat() || [])
		.reduce((acc, failure) => {
			acc[failure] = (acc[failure] || 0) + 1;
			return acc;
		}, {});
	
	const topFailure = Object.entries(commonFailures)
		.sort((a, b) => b[1] - a[1])[0];
	
	if (topFailure && topFailure[1] > 2) {
		recommendations.push(`Address recurring issue: ${topFailure[0]} (occurred ${topFailure[1]} times)`);
	}
	
	if (results.some(r => r.totalTurns < r.scenario?.maxTurns / 2)) {
		recommendations.push('Conversations ending too early - improve user engagement strategies');
	}
	
	return recommendations;
}