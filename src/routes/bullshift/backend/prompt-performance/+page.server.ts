import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';
import { redirect } from '@sveltejs/kit';
import { PromptVersioningService } from '$lib/server/promptVersioning.js';
import { ConversationTestRunner } from '$lib/server/conversationTestRunner.js';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		redirect(302, '/app/auth/login');
	}

	try {
		const versioningService = new PromptVersioningService();
		const overview = await versioningService.getPromptPerformanceOverview(locals.pb);
		
		// Calculate dashboard statistics
		const stats = {
			totalPrompts: overview.length,
			avgScore: overview.length > 0 
				? Math.round(overview.reduce((sum, p) => sum + p.best_score, 0) / overview.length)
				: 0,
			highPerformers: overview.filter(p => p.best_score >= 85).length,
			needAttention: overview.filter(p => p.best_score < 70).length,
			recentTests: overview.filter(p => {
				const testDate = new Date(p.last_tested);
				const weekAgo = new Date();
				weekAgo.setDate(weekAgo.getDate() - 7);
				return testDate > weekAgo;
			}).length
		};
		
		// Group by category for analysis
		const categoryStats = overview.reduce((acc: any, prompt) => {
			if (!acc[prompt.category]) {
				acc[prompt.category] = {
					count: 0,
					totalScore: 0,
					highPerformers: 0,
					needAttention: 0
				};
			}
			
			acc[prompt.category].count++;
			acc[prompt.category].totalScore += prompt.best_score;
			if (prompt.best_score >= 85) acc[prompt.category].highPerformers++;
			if (prompt.best_score < 70) acc[prompt.category].needAttention++;
			
			return acc;
		}, {});
		
		// Calculate category averages
		Object.keys(categoryStats).forEach(category => {
			const cat = categoryStats[category];
			cat.avgScore = Math.round(cat.totalScore / cat.count);
		});
		
		// Get test runner data for quality testing
		const testRunner = new ConversationTestRunner();
		const availableTests = testRunner.getAvailableTests();
		const testCategories = testRunner.getTestCategories();
		
		return {
			user,
			overview,
			stats,
			categoryStats,
			availableTests,
			testCategories
		};
		
	} catch (error) {
		console.error('Error loading prompt performance data:', error);
		// Even on error, provide test runner data
		const testRunner = new ConversationTestRunner();
		
		return {
			user,
			overview: [],
			stats: {
				totalPrompts: 0,
				avgScore: 0,
				highPerformers: 0,
				needAttention: 0,
				recentTests: 0
			},
			categoryStats: {},
			availableTests: testRunner.getAvailableTests(),
			testCategories: testRunner.getTestCategories(),
			error: 'Failed to load performance data'
		};
	}
};