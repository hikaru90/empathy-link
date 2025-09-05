import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ConversationTestRunner } from '$lib/server/conversationTestRunner.js';
import { PathBasedEvaluator, type ConversationFlowScore } from '$lib/server/pathBasedEvaluator.js';
import { PromptVersioningService } from '$lib/server/promptVersioning.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { 
			testScenarioIds, 
			promptVersionsToTest, // Array of prompt slugs to specifically track
			saveResults = false
		} = body;
		
		console.log('🧪 Starting path-based performance testing...');
		console.log(`📋 Test scenarios: ${testScenarioIds?.length || 'all'}`);
		console.log(`📝 Tracking prompts: ${promptVersionsToTest?.join(', ') || 'all active'}`);

		// Initialize test systems
		const testRunner = new ConversationTestRunner();
		const pathEvaluator = new PathBasedEvaluator();
		const versioningService = new PromptVersioningService();
		
		// Set authenticated PocketBase instance
		testRunner.setAuthenticatedPB(locals.pb, user);
		
		// Get test scenarios to run
		const availableTests = testRunner.getAvailableTests();
		const testsToRun = testScenarioIds 
			? availableTests.filter(test => testScenarioIds.includes(test.id))
			: availableTests.slice(0, 5); // Default to first 5 tests
		
		console.log(`🎯 Running ${testsToRun.length} test scenarios for path-based evaluation`);
		
		// Store results for each test scenario
		const pathPerformanceResults: Array<{
			testScenario: any;
			conversationFlow: ConversationFlowScore;
			conversationHistory: any[];
		}> = [];
		
		// Run each test scenario and evaluate path performance
		for (let i = 0; i < testsToRun.length; i++) {
			const testScenario = testsToRun[i];
			console.log(`\n🔄 Testing scenario ${i + 1}/${testsToRun.length}: ${testScenario.name}`);
			
			try {
				// Check for abort signal from the fetch request
				if (request.signal?.aborted) {
					console.log('⏹️ Test run aborted by user');
					break;
				}
				
				console.log(`  📝 Running conversation test...`);
				// Run the conversation test scenario with history
				const testResult = await testRunner.runSingleTestWithHistory(testScenario.id);
				
				if (!testResult.conversationHistory || testResult.conversationHistory.length === 0) {
					console.warn(`⚠️ No conversation history for scenario ${testScenario.name}`);
					continue;
				}
				
				console.log(`  💭 Conversation generated: ${testResult.conversationHistory.length} messages`);
				console.log(`  🔍 Analyzing path segments...`);
				
				// Use path-based evaluator to analyze the conversation
				const conversationFlow = await pathEvaluator.evaluateConversation(
					testResult.conversationHistory,
					testScenario,
					`test_${testScenario.id}_${Date.now()}`,
					user.id, // userId for tracing
					`path_test_${testScenario.id}_${Date.now()}`, // chatId for tracing
					locals.pb // authenticated PocketBase instance for trace saving
				);
				
				console.log(`  📊 Path analysis complete: ${conversationFlow.pathPerformances.length} path segments analyzed`);
				
				pathPerformanceResults.push({
					testScenario,
					conversationFlow,
					conversationHistory: testResult.conversationHistory
				});
				
				console.log(`✅ Completed scenario ${testScenario.name}:`);
				console.log(`   Total Score: ${conversationFlow.totalScore}/100`);
				console.log(`   Path Flow: ${conversationFlow.pathFlow.join(' → ')}`);
				console.log(`   Best Path: ${conversationFlow.summary.bestPerformingPath}`);
				console.log(`   Worst Path: ${conversationFlow.summary.worstPerformingPath}`);
				
			} catch (error) {
				console.error(`❌ Error testing scenario ${testScenario.name}:`, error);
				continue;
			}
		}
		
		// Aggregate path performance data across all test scenarios
		const pathAggregation = aggregatePathPerformances(pathPerformanceResults);
		
		// Update prompt performance scores if requested
		if (saveResults && promptVersionsToTest) {
			console.log('\n💾 Saving path performance results to prompt versions...');
			
			for (const promptSlug of promptVersionsToTest) {
				const pathData = pathAggregation[promptSlug];
				if (pathData) {
					// Convert path performance to prompt test score format
					const promptTestResults = convertPathDataToPromptScore(pathData, pathPerformanceResults);
					
					// Find the active prompt version for this slug
					const activePrompt = await locals.pb.collection('prompts').getFirstListItem(
						`slug = "${promptSlug}" && active = true`
					);
					
					if (activePrompt) {
						await versioningService.updatePromptTestScores(
							locals.pb,
							activePrompt.id,
							promptTestResults
						);
						console.log(`✅ Updated scores for prompt: ${promptSlug}`);
					}
				}
			}
		}
		
		// Return comprehensive results
		return json({
			success: true,
			summary: {
				totalTests: pathPerformanceResults.length,
				averageScore: pathPerformanceResults.length > 0 
					? Math.round(pathPerformanceResults.reduce((sum, r) => sum + r.conversationFlow.totalScore, 0) / pathPerformanceResults.length)
					: 0,
				totalConversations: pathPerformanceResults.length,
				uniquePathsUsed: Array.from(new Set(pathPerformanceResults.flatMap(r => r.conversationFlow.pathFlow))),
				pathSwitchingQuality: pathPerformanceResults.length > 0
					? Math.round(pathPerformanceResults.reduce((sum, r) => sum + r.conversationFlow.pathSwitchingScore, 0) / pathPerformanceResults.length)
					: 0
			},
			pathAggregation,
			detailedResults: pathPerformanceResults.map(r => ({
				testScenario: r.testScenario.name,
				testScenarioId: r.testScenario.id,
				inputMessage: r.testScenario.inputMessage,
				expectedPath: r.testScenario.expectedPath,
				category: r.testScenario.category,
				description: r.testScenario.description,
				totalScore: r.conversationFlow.totalScore,
				pathFlow: r.conversationFlow.pathFlow,
				pathPerformances: r.conversationFlow.pathPerformances.map(p => ({
					pathId: p.pathId,
					score: p.overallScore,
					strengths: p.strengths,
					weaknesses: p.weaknesses
				})),
				pathSwitchingScore: r.conversationFlow.pathSwitchingScore,
				circularPreventionScore: r.conversationFlow.circularPreventionScore,
				coherenceScore: r.conversationFlow.coherenceScore,
				conversationHistory: r.conversationHistory // Include the full conversation history
			}))
		});

	} catch (error) {
		console.error('❌ Error in path-based performance testing:', error);
		return json({ 
			error: 'Failed to run path performance tests',
			details: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};

/**
 * Aggregate path performance data across multiple test scenarios
 */
function aggregatePathPerformances(results: Array<{
	testScenario: any;
	conversationFlow: ConversationFlowScore;
	conversationHistory: any[];
}>): Record<string, {
	pathId: string;
	totalTests: number;
	averageScore: number;
	bestScore: number;
	worstScore: number;
	averageUserGrowthScore: number;
	averageNvcComplianceScore: number;
	averageEffectivenessScore: number;
	commonStrengths: string[];
	commonWeaknesses: string[];
	recommendations: string[];
}> {
	const pathData: Record<string, any> = {};
	
	// Collect all path performances
	for (const result of results) {
		for (const pathPerf of result.conversationFlow.pathPerformances) {
			const pathId = pathPerf.pathId;
			
			if (!pathData[pathId]) {
				pathData[pathId] = {
					pathId,
					scores: [],
					userGrowthScores: [],
					nvcComplianceScores: [],
					effectivenessScores: [],
					allStrengths: [],
					allWeaknesses: [],
					allRecommendations: []
				};
			}
			
			pathData[pathId].scores.push(pathPerf.overallScore);
			pathData[pathId].userGrowthScores.push(pathPerf.userGrowthScore);
			pathData[pathId].nvcComplianceScores.push(pathPerf.nvcComplianceScore);
			pathData[pathId].effectivenessScores.push(pathPerf.effectivenessScore);
			pathData[pathId].allStrengths.push(...pathPerf.strengths);
			pathData[pathId].allWeaknesses.push(...pathPerf.weaknesses);
			pathData[pathId].allRecommendations.push(...pathPerf.recommendations);
		}
	}
	
	// Calculate aggregates
	const aggregation: Record<string, any> = {};
	
	for (const [pathId, data] of Object.entries(pathData)) {
		const scores = data.scores;
		
		aggregation[pathId] = {
			pathId,
			totalTests: scores.length,
			averageScore: Math.round(scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length),
			bestScore: Math.max(...scores),
			worstScore: Math.min(...scores),
			averageUserGrowthScore: Math.round(data.userGrowthScores.reduce((sum: number, s: number) => sum + s, 0) / data.userGrowthScores.length),
			averageNvcComplianceScore: Math.round(data.nvcComplianceScores.reduce((sum: number, s: number) => sum + s, 0) / data.nvcComplianceScores.length),
			averageEffectivenessScore: Math.round(data.effectivenessScores.reduce((sum: number, s: number) => sum + s, 0) / data.effectivenessScores.length),
			commonStrengths: getMostCommon(data.allStrengths, 3),
			commonWeaknesses: getMostCommon(data.allWeaknesses, 3),
			recommendations: getMostCommon(data.allRecommendations, 3)
		};
	}
	
	return aggregation;
}

/**
 * Get most common items from array
 */
function getMostCommon(items: string[], limit: number): string[] {
	const counts = items.reduce((acc: Record<string, number>, item) => {
		acc[item] = (acc[item] || 0) + 1;
		return acc;
	}, {});
	
	return Object.entries(counts)
		.sort(([,a], [,b]) => b - a)
		.slice(0, limit)
		.map(([item]) => item);
}

/**
 * Convert path performance data to prompt test score format for database storage
 */
function convertPathDataToPromptScore(pathData: any, allResults: any[]): any {
	return {
		summary: {
			averageScore: pathData.averageScore,
			totalTests: pathData.totalTests,
			passed: allResults.filter(r => 
				r.conversationFlow.pathPerformances.some((p: any) => 
					p.pathId === pathData.pathId && p.overallScore >= 70
				)
			).length,
			passRate: Math.round((allResults.filter(r => 
				r.conversationFlow.pathPerformances.some((p: any) => 
					p.pathId === pathData.pathId && p.overallScore >= 70
				)
			).length / allResults.length) * 100)
		},
		categoryBreakdown: {
			user_growth: { averageScore: pathData.averageUserGrowthScore },
			nvc_compliance: { averageScore: pathData.averageNvcComplianceScore },
			path_effectiveness: { averageScore: pathData.averageEffectivenessScore }
		},
		strengths: pathData.commonStrengths,
		criticalIssues: pathData.commonWeaknesses,
		recommendations: pathData.recommendations
	};
}