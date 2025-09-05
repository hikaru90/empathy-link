/**
 * API endpoint for updating prompt test scores after running quality tests
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PromptVersioningService } from '$lib/server/promptVersioning.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	
	if (!user) {
		return error(401, 'Authentication required');
	}
	
	try {
		const { promptId, testResults } = await request.json();
		
		if (!promptId || !testResults) {
			return error(400, 'Missing promptId or testResults');
		}
		
		const versioningService = new PromptVersioningService();
		const result = await versioningService.updatePromptTestScores(
			locals.pb,
			promptId,
			testResults
		);
		
		if (result.success) {
			return json({ 
				success: true, 
				message: 'Prompt test scores updated successfully'
			});
		} else {
			return error(500, result.error || 'Failed to update scores');
		}
		
	} catch (err: any) {
		console.error('Error updating prompt scores:', err);
		return error(500, `Failed to update prompt scores: ${err.message}`);
	}
};

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = locals.user;
	
	if (!user) {
		return error(401, 'Authentication required');
	}
	
	try {
		const versioningService = new PromptVersioningService();
		const overview = await versioningService.getPromptPerformanceOverview(locals.pb);
		
		return json({
			overview,
			summary: {
				total_prompts: overview.length,
				avg_score: overview.reduce((sum, p) => sum + p.best_score, 0) / overview.length,
				high_performers: overview.filter(p => p.best_score >= 85).length,
				need_attention: overview.filter(p => p.best_score < 70).length
			}
		});
		
	} catch (err: any) {
		console.error('Error getting prompt overview:', err);
		return error(500, `Failed to get prompt overview: ${err.message}`);
	}
};