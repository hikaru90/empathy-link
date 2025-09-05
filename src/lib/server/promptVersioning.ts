/**
 * Prompt Versioning and Scoring System
 * Handles versioned prompts with test scores for performance tracking
 */

export interface PromptVersion {
	id: string;
	slug: string;
	name: string;
	content: string;
	category: string;
	description: string;
	version: number;
	active: boolean;
	parent_id?: string; // Previous version ID
	created: string;
	updated: string;
	
	// New scoring fields
	test_scores?: PromptTestScores;
	performance_metrics?: PromptPerformanceMetrics;
	test_history?: PromptTestHistory[];
}

export interface PromptTestScores {
	overall_score: number; // 0-100
	last_tested: string; // ISO timestamp
	test_count: number;
	
	// Category scores
	user_growth_score: number;
	nvc_compliance_score: number;
	path_switching_score: number;
	circular_prevention_score: number;
	conversation_balance_score: number;
	
	// Performance indicators
	pass_rate: number; // Percentage of tests passed
	consistency_score: number; // How consistent across different scenarios
	improvement_trend: 'improving' | 'stable' | 'declining';
}

export interface PromptPerformanceMetrics {
	best_categories: string[];
	worst_categories: string[];
	strengths: string[];
	weaknesses: string[];
	recommended_improvements: string[];
}

export interface PromptTestHistory {
	test_date: string;
	test_type: string; // 'basic', 'advanced', 'category'
	overall_score: number;
	category_scores: {
		user_growth: number;
		nvc_compliance: number;
		path_switching: number;
		circular_prevention: number;
		conversation_balance: number;
	};
	scenarios_tested: number;
	scenarios_passed: number;
}

export class PromptVersioningService {
	
	/**
	 * Create new version of prompt (instead of updating existing)
	 */
	async createNewPromptVersion(
		pb: any,
		existingPromptId: string,
		updatedData: any,
		userId: string
	): Promise<{success: boolean, newVersion?: any, error?: string}> {
		
		try {
			// Get the existing prompt
			const existingPrompt = await pb.collection('prompts').getOne(existingPromptId);
			
			// Deactivate the old version
			await pb.collection('prompts').update(existingPromptId, {
				active: false,
				updated: new Date().toISOString()
			});
			
			// Create new version
			const newVersion = await pb.collection('prompts').create({
				...updatedData,
				version: (existingPrompt.version || 1) + 1,
				parent_id: existingPromptId,
				active: true,
				created: new Date().toISOString(),
				updated: new Date().toISOString(),
				created_by: userId,
				
				// Initialize scoring fields
				test_scores: null,
				performance_metrics: null,
				test_history: []
			});
			
			console.log(`✅ Created new prompt version: ${newVersion.slug} v${newVersion.version}`);
			
			return {
				success: true,
				newVersion
			};
			
		} catch (error) {
			console.error('❌ Error creating prompt version:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}
	
	/**
	 * Update prompt test scores after running tests
	 */
	async updatePromptTestScores(
		pb: any,
		promptId: string,
		testResults: any
	): Promise<{success: boolean, error?: string}> {
		
		try {
			const prompt = await pb.collection('prompts').getOne(promptId);
			
			// Calculate scores from test results
			const testScores: PromptTestScores = {
				overall_score: testResults.summary.averageScore,
				last_tested: new Date().toISOString(),
				test_count: (prompt.test_scores?.test_count || 0) + 1,
				
				user_growth_score: this.calculateCategoryScore(testResults, 'user_growth'),
				nvc_compliance_score: this.calculateCategoryScore(testResults, 'nvc_compliance'),
				path_switching_score: this.calculateCategoryScore(testResults, 'path_switching'),
				circular_prevention_score: this.calculateCategoryScore(testResults, 'circular_detection'),
				conversation_balance_score: this.calculateCategoryScore(testResults, 'balance_check'),
				
				pass_rate: testResults.summary.passRate,
				consistency_score: this.calculateConsistencyScore(testResults),
				improvement_trend: this.calculateTrend(prompt.test_history, testResults.summary.averageScore)
			};
			
			// Calculate performance metrics
			const performanceMetrics: PromptPerformanceMetrics = {
				best_categories: this.identifyBestCategories(testScores),
				worst_categories: this.identifyWorstCategories(testScores),
				strengths: testResults.strengths || [],
				weaknesses: testResults.criticalIssues || [],
				recommended_improvements: testResults.recommendations || []
			};
			
			// Add to test history
			const newHistoryEntry: PromptTestHistory = {
				test_date: new Date().toISOString(),
				test_type: this.determineTestType(testResults),
				overall_score: testResults.summary.averageScore,
				category_scores: {
					user_growth: testScores.user_growth_score,
					nvc_compliance: testScores.nvc_compliance_score,
					path_switching: testScores.path_switching_score,
					circular_prevention: testScores.circular_prevention_score,
					conversation_balance: testScores.conversation_balance_score
				},
				scenarios_tested: testResults.summary.totalTests,
				scenarios_passed: testResults.summary.passed
			};
			
			const updatedHistory = [
				...(prompt.test_history || []),
				newHistoryEntry
			].slice(-20); // Keep last 20 test runs
			
			// Update the prompt with new scores
			await pb.collection('prompts').update(promptId, {
				test_scores: testScores,
				performance_metrics: performanceMetrics,
				test_history: updatedHistory,
				updated: new Date().toISOString()
			});
			
			console.log(`✅ Updated test scores for prompt: ${prompt.slug} (Score: ${testScores.overall_score})`);
			
			return { success: true };
			
		} catch (error) {
			console.error('❌ Error updating prompt test scores:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}
	
	/**
	 * Get prompt performance overview grouped by slug
	 */
	async getPromptPerformanceOverview(pb: any): Promise<PromptPerformanceOverview[]> {
		try {
			// Get all prompts except rule prompts (rule prompts don't need testing)
			const prompts = await pb.collection('prompts').getFullList({
				filter: 'category != "rule"',
				sort: 'slug,-version'
			});
			
			// Group by slug and find best performing version for each
			const groupedBySlug = prompts.reduce((acc: any, prompt: any) => {
				if (!acc[prompt.slug]) {
					acc[prompt.slug] = [];
				}
				acc[prompt.slug].push(prompt);
				return acc;
			}, {});
			
			const overview: PromptPerformanceOverview[] = [];
			
			for (const [slug, versions] of Object.entries(groupedBySlug)) {
				// Handle versions with and without test scores
				const versionsWithScores = (versions as any[]).filter(v => v.test_scores);
				const allVersions = (versions as any[]);
				
				// If we have scored versions, use those; otherwise use all versions  
				const sortedVersions = versionsWithScores.length > 0
					? versionsWithScores.sort((a, b) => b.test_scores.overall_score - a.test_scores.overall_score)
					: allVersions.sort((a, b) => (b.version || 1) - (a.version || 1));
				
				if (sortedVersions.length === 0) continue;
				
				const bestVersion = sortedVersions[0];
				const currentVersion = allVersions.find(v => v.active !== false) || bestVersion;
				
				overview.push({
					slug,
					name: bestVersion.name,
					category: bestVersion.category,
					
					// Current version stats
					current_version: currentVersion.version || 1,
					current_score: currentVersion.test_scores?.overall_score || 0,
					current_active: currentVersion.active !== false,
					
					// Best version stats
					best_version: bestVersion.version || 1,
					best_score: bestVersion.test_scores?.overall_score || 0,
					best_is_current: bestVersion.id === currentVersion.id,
					
					// Historical data
					total_versions: allVersions.length,
					total_tests: allVersions.reduce((sum, v) => sum + (v.test_scores?.test_count || 0), 0),
					last_tested: bestVersion.test_scores?.last_tested || bestVersion.updated || bestVersion.created,
					
					// Performance metrics
					trending: bestVersion.test_scores?.improvement_trend || 'stable',
					strengths: bestVersion.performance_metrics?.strengths || [],
					needs_improvement: bestVersion.performance_metrics?.worst_categories || [],
					
					// Quick access - use all versions, not just scored ones
					versions: allVersions.map(v => ({
						id: v.id,
						version: v.version || 1,
						score: v.test_scores?.overall_score || 0,
						active: v.active !== false,
						created: v.created
					}))
				});
			}
			
			// Sort by best score descending
			return overview.sort((a, b) => b.best_score - a.best_score);
			
		} catch (error) {
			console.error('❌ Error getting prompt performance overview:', error);
			return [];
		}
	}
	
	// Helper methods
	private calculateCategoryScore(testResults: any, category: string): number {
		const categoryData = testResults.categoryBreakdown?.[category];
		return categoryData ? Math.round(categoryData.averageScore) : 0;
	}
	
	private calculateConsistencyScore(testResults: any): number {
		// Calculate how consistent the AI was across different scenarios
		const scores = testResults.detailedResults?.map((r: any) => r.score) || [];
		if (scores.length === 0) return 0;
		
		const mean = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
		const variance = scores.reduce((sum: number, score: number) => sum + Math.pow(score - mean, 2), 0) / scores.length;
		const standardDeviation = Math.sqrt(variance);
		
		// Convert to 0-100 scale (lower deviation = higher consistency)
		const consistencyScore = Math.max(0, 100 - (standardDeviation * 2));
		return Math.round(consistencyScore);
	}
	
	private calculateTrend(history: PromptTestHistory[] = [], currentScore: number): 'improving' | 'stable' | 'declining' {
		if (history.length < 2) return 'stable';
		
		const recent = history.slice(-3).map(h => h.overall_score);
		const average = recent.reduce((sum, score) => sum + score, 0) / recent.length;
		
		if (currentScore > average + 5) return 'improving';
		if (currentScore < average - 5) return 'declining';
		return 'stable';
	}
	
	private identifyBestCategories(scores: PromptTestScores): string[] {
		const categories = [
			{name: 'user_growth', score: scores.user_growth_score},
			{name: 'nvc_compliance', score: scores.nvc_compliance_score},
			{name: 'path_switching', score: scores.path_switching_score},
			{name: 'circular_prevention', score: scores.circular_prevention_score},
			{name: 'conversation_balance', score: scores.conversation_balance_score}
		];
		
		return categories
			.filter(c => c.score >= 80)
			.sort((a, b) => b.score - a.score)
			.slice(0, 3)
			.map(c => c.name);
	}
	
	private identifyWorstCategories(scores: PromptTestScores): string[] {
		const categories = [
			{name: 'user_growth', score: scores.user_growth_score},
			{name: 'nvc_compliance', score: scores.nvc_compliance_score},
			{name: 'path_switching', score: scores.path_switching_score},
			{name: 'circular_prevention', score: scores.circular_prevention_score},
			{name: 'conversation_balance', score: scores.conversation_balance_score}
		];
		
		return categories
			.filter(c => c.score < 70)
			.sort((a, b) => a.score - b.score)
			.slice(0, 2)
			.map(c => c.name);
	}
	
	private determineTestType(testResults: any): string {
		const testCount = testResults.summary?.totalTests || 0;
		if (testCount <= 5) return 'basic';
		if (testCount <= 15) return 'category';
		return 'comprehensive';
	}
}

export interface PromptPerformanceOverview {
	slug: string;
	name: string;
	category: string;
	
	// Current version
	current_version: number;
	current_score: number;
	current_active: boolean;
	
	// Best version
	best_version: number;
	best_score: number;
	best_is_current: boolean;
	
	// Statistics
	total_versions: number;
	total_tests: number;
	last_tested: string;
	
	// Performance
	trending: 'improving' | 'stable' | 'declining';
	strengths: string[];
	needs_improvement: string[];
	
	// Version list
	versions: Array<{
		id: string;
		version: number;
		score: number;
		active: boolean;
		created: string;
	}>;
}