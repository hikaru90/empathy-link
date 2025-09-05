/**
 * API endpoint for running conversation quality tests
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ConversationTestRunner } from '$lib/server/conversationTestRunner.js';
import { PromptVersioningService } from '$lib/server/promptVersioning.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	
	// Require authentication for test execution
	if (!user) {
		return error(401, 'Authentication required');
	}
	
	// Optional: Restrict to admin users
	// if (user.role !== 'admin') {
	// 	return error(403, 'Admin access required');
	// }
	
	try {
		const { testType, category, scenarioId, promptId } = await request.json();
		
		// Check if request was aborted
		if (request.signal?.aborted) {
			return json({ error: 'Request cancelled' }, { status: 499 });
		}
		
		const testRunner = new ConversationTestRunner();
		
		// Pass authenticated PB instance to test runner
		testRunner.setAuthenticatedPB(locals.pb, user);
		
		let report;
		
		switch (testType) {
			case 'basic':
				report = await testRunner.runBasicTests();
				break;
			case 'advanced':
				report = await testRunner.runAdvancedTests();
				break;
			case 'all':
				report = await testRunner.runAllTests();
				break;
			case 'category':
				if (!category) {
					return error(400, 'Category parameter required for category tests');
				}
				report = await testRunner.runCategoryTests(category);
				break;
			case 'single':
				if (!scenarioId) {
					return error(400, 'Scenario ID required for single test');
				}
				const singleResult = await testRunner.runSingleTest(scenarioId);
				if (!singleResult) {
					return error(404, 'Test scenario not found');
				}
				return json({ 
					result: singleResult,
					summary: testRunner.generateTestSummary({
						summary: {
							totalTests: 1,
							passed: singleResult.passed ? 1 : 0,
							passRate: singleResult.passed ? 100 : 0,
							averageScore: singleResult.score
						},
						categoryBreakdown: {},
						criticalIssues: singleResult.evaluation.weaknesses,
						strengths: singleResult.evaluation.strengths,
						recommendations: singleResult.evaluation.recommendations,
						detailedResults: [singleResult]
					})
				});
			default:
				return error(400, 'Invalid test type. Use: basic, advanced, all, category, or single');
		}
		
		const summary = testRunner.generateTestSummary(report);
		
		// Optionally save test scores to prompt if promptId is provided
		if (promptId) {
			try {
				const versioningService = new PromptVersioningService();
				const result = await versioningService.updatePromptTestScores(
					locals.pb,
					promptId,
					report
				);
				
				if (result.success) {
					console.log(`✅ Saved test scores for prompt: ${promptId}`);
				}
			} catch (scoreError) {
				console.warn('Failed to save test scores:', scoreError);
			}
		}
		
		return json({
			report,
			summary,
			exportData: testRunner.exportResults(report),
			promptId: promptId || null
		});
		
	} catch (err: any) {
		console.error('Test execution error:', err);
		return error(500, `Test execution failed: ${err.message}`);
	}
};

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;
	
	if (!user) {
		return error(401, 'Authentication required');
	}
	
	const action = url.searchParams.get('action');
	const testRunner = new ConversationTestRunner();
	
	switch (action) {
		case 'scenarios':
			return json({
				scenarios: testRunner.getAvailableTests()
			});
		case 'categories':
			return json({
				categories: testRunner.getTestCategories()
			});
		default:
			return json({
				availableActions: ['scenarios', 'categories'],
				testTypes: ['basic', 'advanced', 'all', 'category', 'single']
			});
	}
};