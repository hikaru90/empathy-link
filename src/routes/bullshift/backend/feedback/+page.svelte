<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import BackendNav from '$lib/components/bullshift/BackendNav.svelte';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('de-DE', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getScoreColor(score: number, max: number = 10) {
		const percentage = score / max;
		if (percentage >= 0.8) return 'text-green-600';
		if (percentage >= 0.6) return 'text-yellow-600';
		return 'text-red-600';
	}
</script>

<div class="pt-16 pb-24">
	<Header user={data.user} />
	<BackendNav />
	<div class="flex h-full w-full flex-col">
		{#if data.error}
			<div class="max-container py-8">
				<Card class="border-red-200">
					<CardContent class="pt-6">
						<p class="text-red-600">{data.error}</p>
					</CardContent>
				</Card>
			</div>
		{:else}
			<div class="max-container py-8 space-y-8">
				<!-- Page Header -->
				<div>
					<h1 class="text-3xl font-bold tracking-tight">Chat Feedback Insights</h1>
					<p class="text-muted-foreground">
						User feedback analysis and conversation quality metrics
					</p>
				</div>

				<!-- Overview Statistics -->
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Total Feedback</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold">{data.stats.totalFeedback}</div>
							<p class="text-xs text-muted-foreground">
								+{data.stats.recentActivity.feedback} this month
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Avg Helpfulness</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m14.25-9h-2.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5.904 9.5H7.5v9Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold {getScoreColor(data.stats.avgHelpfulness)}">{data.stats.avgHelpfulness}/10</div>
							<p class="text-xs text-muted-foreground">
								User satisfaction rating
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">Would Recommend</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold {getScoreColor(data.stats.wouldRecommendPercentage, 100)}">{data.stats.wouldRecommendPercentage}%</div>
							<p class="text-xs text-muted-foreground">
								Recommendation rate
							</p>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle class="text-sm font-medium">New Insights</CardTitle>
							<div class="h-4 w-4 text-muted-foreground">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m4.5 0a12.052 12.052 0 0 0-.438-2.7A12.057 12.057 0 0 0 16.5 12.75M12 18a12.052 12.052 0 0 1-.438 2.022 12.057 12.057 0 0 1-1.875-.189 12.06 12.06 0 0 1 4.5 0m-4.126-7.478A12.06 12.06 0 0 0 7.5 12.75M12 18a10.97 10.97 0 0 0 4.5-3.75M12 18a10.97 10.97 0 0 1-4.5-3.75m9.75 0c.375 0 .75.336.75.75v1.875c0 .414-.336.75-.75.75H20.5a.75.75 0 0 1-.75-.75V15c0-.414.336-.75.75-.75h1.875Zm-4.125 0c0 .414-.336.75-.75.75h-1.125a.75.75 0 0 1-.75-.75v-1.5c0-.414.336-.75.75-.75h1.125c.414 0 .75.336.75.75v1.5ZM8.25 15c0 .414-.336.75-.75.75H6.375a.75.75 0 0 1-.75-.75v-1.5c0-.414.336-.75.75-.75h1.125c.414 0 .75.336.75.75v1.5Z" />
								</svg>
							</div>
						</CardHeader>
						<CardContent>
							<div class="text-2xl font-bold {getScoreColor(data.stats.newInsightsPercentage, 100)}">{data.stats.newInsightsPercentage}%</div>
							<p class="text-xs text-muted-foreground">
								Users gained insights
							</p>
						</CardContent>
					</Card>
				</div>

				<!-- Analysis Quality Metrics -->
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader>
							<CardTitle>Conversation Quality</CardTitle>
							<CardDescription>Average user-reported quality</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="text-3xl font-bold {getScoreColor(data.stats.avgConversationQuality)}">{data.stats.avgConversationQuality}/10</div>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader>
							<CardTitle>NVC Compliance</CardTitle>
							<CardDescription>Nonviolent Communication rating</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="text-3xl font-bold {getScoreColor(data.stats.avgNvcCompliance)}">{data.stats.avgNvcCompliance}/10</div>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader>
							<CardTitle>Orchestrator</CardTitle>
							<CardDescription>Path switching effectiveness</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="text-3xl font-bold {getScoreColor(data.stats.avgOrchestratorEffectiveness)}">{data.stats.avgOrchestratorEffectiveness}/10</div>
						</CardContent>
					</Card>

					<Card class="bg-offwhite border-white/20 shadow-md shadow-black/5">
						<CardHeader>
							<CardTitle>Understanding</CardTitle>
							<CardDescription>Users felt understood</CardDescription>
						</CardHeader>
						<CardContent>
							<div class="text-3xl font-bold {getScoreColor(data.stats.understandingPercentage, 100)}">{data.stats.understandingPercentage}%</div>
						</CardContent>
					</Card>
				</div>

				<!-- Automatic Analysis Insights -->
				<Card class="bg-offwhite border-white/20">
					<CardHeader>
						<CardTitle>Automatic Analysis Insights</CardTitle>
						<CardDescription>
							AI-generated analysis of conversation quality ({data.stats.automaticAnalysisStats.totalAnalyzed} conversations analyzed)
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="grid gap-4 md:grid-cols-4 mb-6">
							<div class="text-center">
								<div class="text-2xl font-bold {getScoreColor(data.stats.automaticAnalysisStats.avgFlowRating)}">{data.stats.automaticAnalysisStats.avgFlowRating}/10</div>
								<p class="text-sm text-muted-foreground">Flow Rating</p>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold {getScoreColor(data.stats.automaticAnalysisStats.avgNvcOverall)}">{data.stats.automaticAnalysisStats.avgNvcOverall}/10</div>
								<p class="text-sm text-muted-foreground">NVC Overall</p>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold {getScoreColor(data.stats.automaticAnalysisStats.avgOrchestratorOverall)}">{data.stats.automaticAnalysisStats.avgOrchestratorOverall}/10</div>
								<p class="text-sm text-muted-foreground">Orchestrator Overall</p>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold {getScoreColor(data.stats.automaticAnalysisStats.avgGoalAchievement)}">{data.stats.automaticAnalysisStats.avgGoalAchievement}/10</div>
								<p class="text-sm text-muted-foreground">Goal Achievement</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Detailed Feedback List -->
				<Card class="bg-offwhite border-white/20">
					<CardHeader>
						<CardTitle>Recent Feedback Details</CardTitle>
						<CardDescription>
							Detailed feedback entries with automatic analysis insights
						</CardDescription>
					</CardHeader>
					<CardContent class="max-h-[600px] overflow-y-auto">
						<div class="space-y-6">
							{#each data.feedbackItems as feedback}
								<div class="border rounded-lg p-4 bg-white">
									<div class="flex justify-between items-start mb-3">
										<div class="text-sm text-muted-foreground">
											<span>Chat: {feedback.chatId}</span> • 
											<span>{formatDate(feedback.created)}</span>
										</div>
										<div class="flex gap-2">
											<span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
												Helpfulness: {feedback.userFeedback.helpfulness}/10
											</span>
										</div>
									</div>

									{#if feedback.analysis}
										<div class="grid gap-4 md:grid-cols-2">
											<!-- Conversation Flow -->
											{#if feedback.analysis.conversationFlow}
												<div>
													<h4 class="font-medium text-sm mb-2">Conversation Flow</h4>
													<div class="text-xs space-y-1">
														<div>Flow Rating: <span class="{getScoreColor(feedback.analysis.conversationFlow.flowRating)}">{feedback.analysis.conversationFlow.flowRating}/10</span></div>
														<div>Path Switches: {feedback.analysis.conversationFlow.pathSwitches}</div>
														<div>Total Messages: {feedback.analysis.conversationFlow.totalMessages}</div>
														{#if feedback.analysis.conversationFlow.flowExplanation}
															<p class="text-muted-foreground mt-1 text-xs">{feedback.analysis.conversationFlow.flowExplanation.substring(0, 120)}...</p>
														{/if}
													</div>
												</div>
											{/if}

											<!-- NVC Compliance -->
											{#if feedback.analysis.nvcCompliance}
												<div>
													<h4 class="font-medium text-sm mb-2">NVC Compliance</h4>
													<div class="text-xs space-y-1">
														<div>Overall: <span class="{getScoreColor(feedback.analysis.nvcCompliance.overallCompliance)}">{feedback.analysis.nvcCompliance.overallCompliance}/10</span></div>
														<div>Feelings vs Thoughts: {feedback.analysis.nvcCompliance.feelingsVsThoughts}/10</div>
														<div>Needs vs Strategies: {feedback.analysis.nvcCompliance.needsVsStrategies}/10</div>
														{#if feedback.analysis.nvcCompliance.strengthsAndWeaknesses}
															<p class="text-muted-foreground mt-1 text-xs">{feedback.analysis.nvcCompliance.strengthsAndWeaknesses.substring(0, 120)}...</p>
														{/if}
													</div>
												</div>
											{/if}

											<!-- Overall Assessment -->
											{#if feedback.analysis.overallAssessment}
												<div>
													<h4 class="font-medium text-sm mb-2">Overall Assessment</h4>
													<div class="text-xs space-y-1">
														<div>Quality: <span class="{getScoreColor(feedback.analysis.overallAssessment.conversationQuality)}">{feedback.analysis.overallAssessment.conversationQuality}/10</span></div>
														<div>Goal Achievement: <span class="{getScoreColor(feedback.analysis.overallAssessment.goalAchievement)}">{feedback.analysis.overallAssessment.goalAchievement}/10</span></div>
														<div>User Engagement: <span class="{getScoreColor(feedback.analysis.overallAssessment.userEngagement)}">{feedback.analysis.overallAssessment.userEngagement}/10</span></div>
													</div>
												</div>
											{/if}

											<!-- User Feedback -->
											<div>
												<h4 class="font-medium text-sm mb-2">User Feedback</h4>
												<div class="text-xs space-y-1">
													<div class="flex gap-2">
														{#if feedback.userFeedback.understanding}<span class="bg-green-100 text-green-800 px-1 rounded">Understanding</span>{/if}
														{#if feedback.userFeedback.newInsights}<span class="bg-blue-100 text-blue-800 px-1 rounded">New Insights</span>{/if}
														{#if feedback.userFeedback.wouldRecommend}<span class="bg-purple-100 text-purple-800 px-1 rounded">Would Recommend</span>{/if}
													</div>
													{#if feedback.userFeedback.bestAspects}
														<div><strong>Best:</strong> {feedback.userFeedback.bestAspects}</div>
													{/if}
													{#if feedback.userFeedback.improvements}
														<div><strong>Improvements:</strong> {feedback.userFeedback.improvements}</div>
													{/if}
													{#if feedback.userFeedback.additionalComments}
														<div><strong>Comments:</strong> {feedback.userFeedback.additionalComments}</div>
													{/if}
												</div>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>
			</div>
		{/if}
	</div>
	<Footer />
</div>

<style>
	.max-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.25rem;
	}
</style>