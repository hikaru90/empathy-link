<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';
	import TrendingUp from 'lucide-svelte/icons/trending-up';
	import AlertTriangle from 'lucide-svelte/icons/alert-triangle';
	import Heart from 'lucide-svelte/icons/heart';
	import Users from 'lucide-svelte/icons/users';

	interface ChatEvaluation {
		nvcConformance: {
			observation: number;
			feelings: number;
			needs: number;
			requests: number;
			overall: number;
		};
		safety: {
			harmfulSuggestions: boolean;
			riskLevel: 'low' | 'medium' | 'high';
			flaggedContent: string[];
			safetyScore: number;
		};
		helpfulness: {
			userSatisfaction: number;
			clarity: number;
			actionability: number;
			empathy: number;
		};
		userExperience: {
			frustrationIndicators: string[];
			frustrationLevel: number;
			engagementSignals: string[];
			completionLikelihood: number;
		};
		metadata: {
			responseLength: number;
			responseTime: number;
			modelUsed: string;
			timestamp: string;
		};
	}

	interface EvaluationRecord {
		id: string;
		chatId: string;
		userId: string;
		evaluation: ChatEvaluation;
		created: string;
		updated: string;
	}

	interface Props {
		evaluations?: any[];
	}

	let { evaluations: rawEvaluations = [] }: Props = $props();
	
	let evaluations: EvaluationRecord[] = $state([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let refreshTrigger = $state(0);

	// Process evaluations from props
	$effect(() => {
		if (rawEvaluations && rawEvaluations.length > 0) {
			evaluations = rawEvaluations.map(record => ({
				id: record.id,
				chatId: record.chatId,
				userId: record.userId,
				evaluation: typeof record.evaluation === 'string' ? JSON.parse(record.evaluation) : record.evaluation,
				created: record.created,
				updated: record.updated
			}));
		}
	});

	async function refreshEvaluations() {
		// Trigger page reload to refresh data
		window.location.reload();
	}

	function getAverageScore(evaluations: EvaluationRecord[], path: string): number {
		if (evaluations.length === 0) return 0;
		
		const sum = evaluations.reduce((acc, record) => {
			const keys = path.split('.');
			let value: any = record.evaluation;
			
			for (const key of keys) {
				value = value?.[key];
			}
			
			const finalValue = typeof value === 'number' ? value : 0;
			return acc + finalValue;
		}, 0);
		
		const average = Math.round((sum / evaluations.length) * 10) / 10;
		return average;
	}

	function getSafetyColor(riskLevel: string): string {
		switch (riskLevel) {
			case 'low': return 'bg-green-100 text-green-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'high': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	}

	function getScoreColor(score: number): string {
		if (score >= 8) return 'text-green-600';
		if (score >= 6) return 'text-yellow-600';
		return 'text-red-600';
	}

	// Use derived state for reactive calculations
	const totalEvaluations = $derived(evaluations.length);
	const averageNVCScore = $derived(getAverageScore(evaluations, 'nvcConformance.overall'));
	const averageSafetyScore = $derived(getAverageScore(evaluations, 'safety.safetyScore'));
	const averageHelpfulnessScore = $derived(getAverageScore(evaluations, 'helpfulness.userSatisfaction'));
	const averageFrustrationLevel = $derived(getAverageScore(evaluations, 'userExperience.frustrationLevel'));
	const highRiskChats = $derived(evaluations.filter(e => e.evaluation.safety.riskLevel === 'high').length);
	const harmfulSuggestions = $derived(evaluations.filter(e => e.evaluation.safety.harmfulSuggestions).length);

	function testCalculations() {
		console.log('=== TESTING CALCULATIONS ===');
		console.log('Evaluations array length:', evaluations.length);
		console.log('First evaluation:', evaluations[0]);
		
		if (evaluations.length > 0) {
			console.log('Average NVC Score:', averageNVCScore);
			console.log('Average Safety Score:', averageSafetyScore);
			console.log('Average Helpfulness Score:', averageHelpfulnessScore);
			console.log('High Risk Chats:', highRiskChats);
			console.log('Harmful Suggestions:', harmfulSuggestions);
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Chat Evaluation Dashboard</h1>
		<div class="flex gap-2">
			<Button onclick={testCalculations} disabled={loading}>
				Test Calculations
			</Button>
			<Button onclick={refreshEvaluations} disabled={loading}>
				<RefreshCw class="w-4 h-4 mr-2" />
				{loading ? 'Loading...' : 'Refresh'}
			</Button>
		</div>
	</div>

	{#if error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
			{error}
		</div>
	{/if}

	<!-- Summary Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
		<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Total Evaluations</CardTitle>
				<Users class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">{totalEvaluations}</div>
				<p class="text-xs text-muted-foreground">Chats evaluated</p>
			</CardContent>
		</Card>

		<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Average NVC Score</CardTitle>
				<Heart class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold {getScoreColor(averageNVCScore)}">{averageNVCScore}/10</div>
				<p class="text-xs text-muted-foreground">NVC conformance</p>
			</CardContent>
		</Card>

		<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">Safety Score</CardTitle>
				<AlertTriangle class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold {getScoreColor(averageSafetyScore)}">{averageSafetyScore}/10</div>
				<p class="text-xs text-muted-foreground">Risk level: {highRiskChats} high</p>
			</CardContent>
		</Card>

		<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
			<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle class="text-sm font-medium">User Satisfaction</CardTitle>
				<TrendingUp class="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold {getScoreColor(averageHelpfulnessScore)}">{averageHelpfulnessScore}/10</div>
				<p class="text-xs text-muted-foreground">Helpfulness score</p>
			</CardContent>
		</Card>
	</div>

	<!-- Detailed Metrics -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
			<CardHeader>
				<CardTitle>NVC Conformance Breakdown</CardTitle>
				<CardDescription>Detailed scores for each NVC component</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-sm">Observation</span>
					<span class="font-medium {getScoreColor(getAverageScore(evaluations, 'nvcConformance.observation'))}">
						{getAverageScore(evaluations, 'nvcConformance.observation')}/10
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm">Feelings</span>
					<span class="font-medium {getScoreColor(getAverageScore(evaluations, 'nvcConformance.feelings'))}">
						{getAverageScore(evaluations, 'nvcConformance.feelings')}/10
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm">Needs</span>
					<span class="font-medium {getScoreColor(getAverageScore(evaluations, 'nvcConformance.needs'))}">
						{getAverageScore(evaluations, 'nvcConformance.needs')}/10
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm">Requests</span>
					<span class="font-medium {getScoreColor(getAverageScore(evaluations, 'nvcConformance.requests'))}">
						{getAverageScore(evaluations, 'nvcConformance.requests')}/10
					</span>
				</div>
			</CardContent>
		</Card>

		<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
			<CardHeader>
				<CardTitle>Safety & Risk Analysis</CardTitle>
				<CardDescription>Safety metrics and flagged content</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-sm">High Risk Chats</span>
					<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{highRiskChats}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm">Harmful Suggestions</span>
					<span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{harmfulSuggestions}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm">Average Frustration</span>
									<span class="font-medium {getScoreColor(10 - averageFrustrationLevel)}">
					{Math.round((10 - averageFrustrationLevel) * 10) / 10}/10
					</span>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Recent Evaluations -->
	<Card class="bg-offwhite border border-white/20 shadow-md shadow-black/5">
		<CardHeader>
			<CardTitle>Recent Evaluations</CardTitle>
			<CardDescription>Latest chat evaluation results</CardDescription>
		</CardHeader>
		<CardContent>
			{#if evaluations.length === 0}
				<div class="text-center py-8 text-muted-foreground">
					No evaluations found. Run the evaluation script to get started.
				</div>
			{:else}
				<div class="space-y-4">
					{#each evaluations.slice(0, 10) as evaluation}
						<div class="flex items-center justify-between p-4 border rounded-lg">
							<div class="flex-1">
								<div class="flex items-center space-x-2">
									<span class="font-medium">Chat {evaluation.chatId.slice(0, 8)}</span>
									<span class="px-2 py-1 text-xs rounded-full {getSafetyColor(evaluation.evaluation.safety.riskLevel)}">
										{evaluation.evaluation.safety.riskLevel}
									</span>
								</div>
								<div class="text-sm text-muted-foreground mt-1">
									NVC: {evaluation.evaluation.nvcConformance.overall}/10 | 
									Safety: {evaluation.evaluation.safety.safetyScore}/10 | 
									Satisfaction: {evaluation.evaluation.helpfulness.userSatisfaction}/10
								</div>
							</div>
							<div class="text-right text-sm text-muted-foreground">
								{new Date(evaluation.created).toLocaleDateString()}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
