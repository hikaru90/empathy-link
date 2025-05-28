<script lang="ts">
	import { marked } from 'marked';
	import type { LearningSession, TopicVersion } from '$routes/bullshift/learn/[id]/edit/schema';
	import { Textarea } from '$lib/components/ui/textarea';

	interface Props {
		session: LearningSession | null;
		topic: TopicVersion;
		color: string;
		onFeedbackSubmit?: (feedback: { rating: number; feedback: string; improvements: string; }) => void;
	}

	let { session, topic, color, onFeedbackSubmit }: Props = $props();

	let userRating = $state(0);
	let userFeedback = $state('');
	let improvements = $state('');

	// Calculate learning statistics
	const getSessionStats = $derived(() => {
		if (!session) return null;

		const responses = session.responses;
		const stats = {
			totalTime: 0,
			tasksCompleted: 0,
			totalTasks: 0,
			multipleChoiceScore: 0,
			multipleChoiceTotal: 0,
			sortableScore: 0,
			sortableTotal: 0,
			timersCompleted: 0,
			totalTimers: 0,
			bodymapInteractions: 0,
			completionNotes: [] as string[],
			responsesByType: {} as Record<string, number>
		};

		responses.forEach(response => {
			stats.responsesByType[response.blockType] = (stats.responsesByType[response.blockType] || 0) + 1;

			switch (response.blockType) {
				case 'timer':
					stats.totalTimers++;
					if (response.response.completed) {
						stats.timersCompleted++;
						stats.totalTime += response.response.actualDuration || 0;
					}
					break;

				case 'taskCompletion':
					stats.totalTasks++;
					if (response.response.completed) {
						stats.tasksCompleted++;
						stats.totalTime += response.response.timeSpent || 0;
						if (response.response.notes) {
							stats.completionNotes.push(response.response.notes);
						}
					}
					break;

				case 'multipleChoice':
					if (response.response.completed) {
						const correctAnswers = response.response.questionResponses.filter((q: any) => q.isCorrect).length;
						stats.multipleChoiceScore += correctAnswers;
						stats.multipleChoiceTotal += response.response.questionResponses.length;
						stats.totalTime += response.response.totalTimeSpent || 0;
					}
					break;

				case 'sortable':
					if (response.response.completed) {
						const sortableData = response.blockContent as any;
						if (sortableData?.items) {
							let correctSorts = 0;
							sortableData.items.forEach((item: any) => {
								if (response.response.userSorting[item.text] === item.correctBucket) {
									correctSorts++;
								}
							});
							stats.sortableScore += correctSorts;
							stats.sortableTotal += sortableData.items.length;
						}
					}
					break;

				case 'bodymap':
					if (response.response.points && response.response.points.length > 0) {
						stats.bodymapInteractions += response.response.points.length;
					}
					break;
			}
		});

		return stats;
	});

	// Generate performance insights
	const getPerformanceInsights = $derived(() => {
		const stats = getSessionStats();
		if (!stats) return [];

		const insights = [];

		// Task completion insights
		if (stats.totalTasks > 0) {
			const completionRate = (stats.tasksCompleted / stats.totalTasks) * 100;
			if (completionRate === 100) {
				insights.push({
					type: 'success',
					title: 'Excellent Task Completion',
					description: `You completed all ${stats.totalTasks} tasks in this module! 🎉`
				});
			} else if (completionRate >= 80) {
				insights.push({
					type: 'good',
					title: 'Good Task Completion',
					description: `You completed ${stats.tasksCompleted} out of ${stats.totalTasks} tasks (${Math.round(completionRate)}%).`
				});
			} else {
				insights.push({
					type: 'improvement',
					title: 'Task Completion Opportunity',
					description: `Consider revisiting the ${stats.totalTasks - stats.tasksCompleted} uncompleted tasks to reinforce your learning.`
				});
			}
		}

		// Multiple choice insights
		if (stats.multipleChoiceTotal > 0) {
			const scorePercentage = (stats.multipleChoiceScore / stats.multipleChoiceTotal) * 100;
			if (scorePercentage >= 90) {
				insights.push({
					type: 'success',
					title: 'Excellent Knowledge Assessment',
					description: `You scored ${Math.round(scorePercentage)}% on knowledge questions! Outstanding understanding! 🌟`
				});
			} else if (scorePercentage >= 70) {
				insights.push({
					type: 'good',
					title: 'Good Knowledge Retention',
					description: `You scored ${Math.round(scorePercentage)}% on knowledge questions. Solid understanding with room for growth.`
				});
			} else {
				insights.push({
					type: 'improvement',
					title: 'Knowledge Reinforcement Needed',
					description: `Your score of ${Math.round(scorePercentage)}% suggests reviewing the key concepts would be beneficial.`
				});
			}
		}

		// Time insights
		if (stats.totalTime > 0) {
			const minutes = Math.floor(stats.totalTime / 60);
			const seconds = stats.totalTime % 60;
			insights.push({
				type: 'info',
				title: 'Time Investment',
				description: `You spent ${minutes}m ${seconds}s actively engaging with the content.`
			});
		}

		// Engagement insights
		if (stats.bodymapInteractions > 0) {
			insights.push({
				type: 'success',
				title: 'Great Interactive Engagement',
				description: `You made ${stats.bodymapInteractions} bodymap interactions, showing active participation! 👍`
			});
		}

		// Notes insights
		if (stats.completionNotes.length > 0) {
			insights.push({
				type: 'success',
				title: 'Thoughtful Reflection',
				description: `You provided ${stats.completionNotes.length} thoughtful note(s), demonstrating good self-reflection.`
			});
		}

		return insights;
	});

	// Get overall performance score
	const getOverallScore = $derived(() => {
		const stats = getSessionStats();
		if (!stats) return 0;

		let totalPoints = 0;
		let maxPoints = 0;

		// Task completion (30% weight)
		if (stats.totalTasks > 0) {
			totalPoints += (stats.tasksCompleted / stats.totalTasks) * 30;
			maxPoints += 30;
		}

		// Multiple choice accuracy (40% weight)
		if (stats.multipleChoiceTotal > 0) {
			totalPoints += (stats.multipleChoiceScore / stats.multipleChoiceTotal) * 40;
			maxPoints += 40;
		}

		// Engagement factors (30% weight)
		let engagementScore = 0;
		let engagementMax = 0;

		// Timer completion
		if (stats.totalTimers > 0) {
			engagementScore += (stats.timersCompleted / stats.totalTimers) * 10;
			engagementMax += 10;
		}

		// Bodymap interactions
		if (stats.bodymapInteractions > 0) {
			engagementScore += Math.min(stats.bodymapInteractions * 2, 10);
			engagementMax += 10;
		}

		// Notes provided
		if (stats.completionNotes.length > 0) {
			engagementScore += Math.min(stats.completionNotes.length * 5, 10);
			engagementMax += 10;
		}

		if (engagementMax > 0) {
			totalPoints += (engagementScore / engagementMax) * 30;
			maxPoints += 30;
		}

		return maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
	});

	const handleRatingClick = (rating: number) => {
		userRating = rating;
	};

	const submitFeedback = () => {
		if (onFeedbackSubmit) {
			onFeedbackSubmit({
				rating: userRating,
				feedback: userFeedback,
				improvements: improvements
			});
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 85) return 'text-green-600';
		if (score >= 70) return 'text-yellow-600';
		return 'text-red-600';
	};

	const getScoreMessage = (score: number) => {
		if (score >= 95) return 'Outstanding! You\'ve mastered this content! 🏆';
		if (score >= 85) return 'Excellent work! You\'ve learned well! 🎉';
		if (score >= 70) return 'Good job! Solid understanding achieved! 👏';
		if (score >= 60) return 'Fair effort! Consider reviewing key concepts. 📚';
		return 'Keep practicing! Learning is a journey. 💪';
	};
</script>

<div class="max-w-4xl mx-auto space-y-8">
	<!-- Header -->
	<div class="text-center">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Learning Complete! 🎓</h1>
		<p class="text-lg text-gray-600">Here's a summary of your learning journey</p>
	</div>

	<!-- Overall Score -->
	<div class="bg-white rounded-xl p-8 shadow-lg text-center">
		<div class="text-6xl font-bold mb-4 {getScoreColor(getOverallScore())}">{getOverallScore()}%</div>
		<div class="text-xl font-medium text-gray-700 mb-2">{getScoreMessage(getOverallScore())}</div>
		<div class="text-sm text-gray-600">Overall Learning Score</div>
	</div>

	<!-- Performance Insights -->
	{#if getPerformanceInsights().length > 0}
		<div class="bg-white rounded-xl p-6 shadow-lg">
			<h2 class="text-xl font-bold text-gray-900 mb-4">Your Learning Insights</h2>
			<div class="space-y-4">
				{#each getPerformanceInsights() as insight}
					<div class="flex items-start gap-3 p-4 rounded-lg {
						insight.type === 'success' ? 'bg-green-50 border border-green-200' :
						insight.type === 'good' ? 'bg-blue-50 border border-blue-200' :
						insight.type === 'improvement' ? 'bg-yellow-50 border border-yellow-200' :
						'bg-gray-50 border border-gray-200'
					}">
						<div class="text-2xl">
							{#if insight.type === 'success'}🎉
							{:else if insight.type === 'good'}👍
							{:else if insight.type === 'improvement'}📈
							{:else}ℹ️{/if}
						</div>
						<div class="flex-1">
							<h3 class="font-medium text-gray-900 mb-1">{insight.title}</h3>
							<p class="text-sm text-gray-700">{insight.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Detailed Statistics -->
	{#if getSessionStats()}
		{@const stats = getSessionStats()}
		<div class="bg-white rounded-xl p-6 shadow-lg">
			<h2 class="text-xl font-bold text-gray-900 mb-4">Learning Statistics</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#if stats && stats.totalTasks > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<div class="text-2xl font-bold" style="color: {color}">{stats.tasksCompleted}/{stats.totalTasks}</div>
						<div class="text-sm text-gray-600">Tasks Completed</div>
					</div>
				{/if}

				{#if stats && stats.multipleChoiceTotal > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<div class="text-2xl font-bold" style="color: {color}">
							{Math.round((stats.multipleChoiceScore / stats.multipleChoiceTotal) * 100)}%
						</div>
						<div class="text-sm text-gray-600">Knowledge Quiz Score</div>
					</div>
				{/if}

				{#if stats && stats.totalTime > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<div class="text-2xl font-bold" style="color: {color}">
							{Math.floor(stats.totalTime / 60)}m {stats.totalTime % 60}s
						</div>
						<div class="text-sm text-gray-600">Active Learning Time</div>
					</div>
				{/if}

				{#if stats && stats.bodymapInteractions > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<div class="text-2xl font-bold" style="color: {color}">{stats.bodymapInteractions}</div>
						<div class="text-sm text-gray-600">Bodymap Interactions</div>
					</div>
				{/if}

				{#if stats && stats.sortableTotal > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<div class="text-2xl font-bold" style="color: {color}">
							{Math.round((stats.sortableScore / stats.sortableTotal) * 100)}%
						</div>
						<div class="text-sm text-gray-600">Sorting Accuracy</div>
					</div>
				{/if}

				{#if stats && stats.completionNotes.length > 0}
					<div class="text-center p-4 bg-gray-50 rounded-lg">
						<div class="text-2xl font-bold" style="color: {color}">{stats.completionNotes.length}</div>
						<div class="text-sm text-gray-600">Reflection Notes</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- User Notes Summary -->
	{#if getSessionStats()?.completionNotes && getSessionStats()?.completionNotes.length > 0}
		{@const stats = getSessionStats()}
		<div class="bg-white rounded-xl p-6 shadow-lg">
			<h2 class="text-xl font-bold text-gray-900 mb-4">Your Reflection Notes</h2>
			<div class="space-y-3">
				{#each (stats && stats.completionNotes) || [] as note, index}
					<div class="p-3 bg-gray-50 rounded-lg border-l-4" style="border-left-color: {color}">
						<p class="text-sm text-gray-700">{note}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Module Feedback -->
	<div class="bg-white rounded-xl p-6 shadow-lg">
		<h2 class="text-xl font-bold text-gray-900 mb-4">Help Us Improve</h2>
		<div class="space-y-6">
			<!-- Rating -->
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2">
					How would you rate this learning module?
				</label>
				<div class="flex gap-2">
					{#each [1, 2, 3, 4, 5] as rating}
						<button
							type="button"
							onclick={() => handleRatingClick(rating)}
							class="text-3xl transition-colors {userRating >= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400"
						>
							⭐
						</button>
					{/each}
				</div>
			</div>

			<!-- Feedback -->
			<div>
				<label for="feedback" class="block text-sm font-medium text-gray-700 mb-2">
					What did you think of this module? (optional)
				</label>
				<Textarea
					id="feedback"
					bind:value={userFeedback}
					placeholder="Share your thoughts about the content, exercises, and overall experience..."
					rows={4}
				/>
			</div>

			<!-- Improvements -->
			<div>
				<label for="improvements" class="block text-sm font-medium text-gray-700 mb-2">
					How could we improve this module? (optional)
				</label>
				<Textarea
					id="improvements"
					bind:value={improvements}
					placeholder="Suggestions for improvements, additional content, or changes you'd like to see..."
					rows={3}
				/>
			</div>

			<!-- Submit Button -->
			<button
				type="button"
				onclick={submitFeedback}
				disabled={userRating === 0}
				class="w-full py-3 px-6 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				style="background-color: {userRating > 0 ? color : '#9CA3AF'}"
			>
				Submit Feedback
			</button>
		</div>
	</div>

	<!-- Next Steps -->
	<div class="bg-white rounded-xl p-6 shadow-lg">
		<h2 class="text-xl font-bold text-gray-900 mb-4">What's Next?</h2>
		<div class="space-y-3">
			<div class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
				<div class="text-2xl">📚</div>
				<div>
					<h3 class="font-medium text-gray-900">Review Materials</h3>
					<p class="text-sm text-gray-600">Go through the module again to reinforce your learning</p>
				</div>
			</div>
			<div class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
				<div class="text-2xl">🎯</div>
				<div>
					<h3 class="font-medium text-gray-900">Apply Your Knowledge</h3>
					<p class="text-sm text-gray-600">Practice what you've learned in real situations</p>
				</div>
			</div>
			<div class="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
				<div class="text-2xl">🌱</div>
				<div>
					<h3 class="font-medium text-gray-900">Continue Learning</h3>
					<p class="text-sm text-gray-600">Explore related modules to expand your knowledge</p>
				</div>
			</div>
		</div>
	</div>
</div> 