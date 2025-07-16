<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import LearnCompletion from './LearnCompletion.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import PercentageDonut from '$lib/components/PercentageDonut.svelte';
	import FeedbackModule from '$lib/components/bullshift/Learn/FeedbackModule.svelte';
	import { Button } from '$lib/components/ui/button';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		session: LearningSession | null;
		topic: any;
		color: string;
		onFeedbackSubmit: (feedback: any) => void;
		onComplete?: () => void;
	}

	let { session, topic, color, onFeedbackSubmit, onComplete }: Props = $props();

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

		if (!responses) {
			return stats;
		}

		responses.forEach((response) => {
			stats.responsesByType[response.blockType] =
				(stats.responsesByType[response.blockType] || 0) + 1;

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
						const correctAnswers = response.response.questionResponses.filter(
							(q: any) => q.isCorrect
						).length;
						stats.multipleChoiceScore += correctAnswers;
						stats.multipleChoiceTotal += response.response.questionResponses.length;
						stats.totalTime += response.response.totalTimeSpent || 0;
					}
					break;

				case 'sortable':
					if (response.response.userSorting) {
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

				case 'aiQuestion':
					if (response.response.aiResponse) {
						stats.totalTasks++;
						stats.tasksCompleted++;
					}
					break;

				case 'audio':
					if (response.response.completed) {
						stats.totalTasks++;
						stats.tasksCompleted++;
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
					description: `You completed all ${stats.totalTasks} tasks in this module`
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
					description: `You scored ${Math.round(scorePercentage)}% on knowledge questions. Outstanding understanding`
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
				description: `You made ${stats.bodymapInteractions} bodymap interactions, showing active participation`
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

		// Multiple choice accuracy (30% weight)
		if (stats.multipleChoiceTotal > 0) {
			totalPoints += (stats.multipleChoiceScore / stats.multipleChoiceTotal) * 30;
			maxPoints += 30;
		}

		// Sortable exercises (30% weight)
		if (stats.sortableTotal > 0) {
			totalPoints += (stats.sortableScore / stats.sortableTotal) * 30;
			maxPoints += 30;
		}

		// Engagement factors (10% weight)
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
			totalPoints += (engagementScore / engagementMax) * 10;
			maxPoints += 10;
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
	const getScoreHeading = (score: number) => {
		if (score >= 95) return 'Perfekt';
		if (score >= 85) return 'Exzellente Arbeit';
		if (score >= 70) return 'Gute Arbeit';
		if (score >= 60) return 'Starker Fortschritt';
		return 'Bleib dran';
	};
	const getScoreMessage = (score: number) => {
		if (score >= 95) return 'Du hast den Inhalt gemeistert';
		if (score >= 85) return 'Du hast sehr gut gelernt';
		if (score >= 70) return 'Gutes Verständnis erreicht';
		if (score >= 60) return 'Wiederhole die wichtigsten Konzepte';
		return 'Lernen ist ein Prozess';
	};

	const donutData = $derived(() => {
		const stats = getSessionStats();
		if (!stats) {
			return [
				{ name: 'Abgeschlossen', count: 0 },
				{ name: 'Verbleibend', count: 1 }
			];
		}

		// Calculate total completed activities
		const completed =
			stats.tasksCompleted +
			stats.timersCompleted +
			(stats.multipleChoiceTotal > 0
				? stats.multipleChoiceScore === stats.multipleChoiceTotal
					? 1
					: 0
				: 0) +
			(stats.sortableTotal > 0 ? (stats.sortableScore === stats.sortableTotal ? 1 : 0) : 0);

		// Calculate total activities
		const total =
			stats.totalTasks +
			stats.totalTimers +
			(stats.multipleChoiceTotal > 0 ? 1 : 0) +
			(stats.sortableTotal > 0 ? 1 : 0);

		return [
			{
				name: 'Abgeschlossen',
				count: completed
			},
			{
				name: 'Verbleibend',
				count: Math.max(0, total - completed)
			}
		];
	});

	const completionStats = $derived(() => {
		const stats = getSessionStats();
		if (!stats) {
			return { completed: 0, total: 0, percentage: 0 };
		}

		// Calculate completion same as donut data
		const completed =
			stats.tasksCompleted +
			stats.timersCompleted +
			(stats.multipleChoiceTotal > 0
				? stats.multipleChoiceScore === stats.multipleChoiceTotal
					? 1
					: 0
				: 0) +
			(stats.sortableTotal > 0 ? (stats.sortableScore === stats.sortableTotal ? 1 : 0) : 0);

		const total =
			stats.totalTasks +
			stats.totalTimers +
			(stats.multipleChoiceTotal > 0 ? 1 : 0) +
			(stats.sortableTotal > 0 ? 1 : 0);

		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

		return { completed, total, percentage };
	});

	const donutColors = ['#10b981', '#e5e7eb']; // green for completed, gray for remaining

	// Derived variable for stat cards content
	const statCards = $derived(() => {
		const stats = getSessionStats();
		if (!stats) return [];

		const cards = [];

		// Tasks completion card
		if (stats.totalTasks > 0) {
			cards.push({
				value: `${stats.tasksCompleted}/${stats.totalTasks}`,
				label: 'Aufgaben erledigt'
			});
		}

		// Multiple choice score card
		if (stats.multipleChoiceTotal > 0) {
			cards.push({
				value: `${Math.round((stats.multipleChoiceScore / stats.multipleChoiceTotal) * 100)}%`,
				label: 'Wissenstest Ergebnis'
			});
		}

		// Time spent card
		if (stats.totalTime > 0) {
			cards.push({
				value: `${Math.floor(stats.totalTime / 60)}m ${stats.totalTime % 60}s`,
				label: 'Aktive Lernzeit'
			});
		}

		// Bodymap interactions card
		if (stats.bodymapInteractions > 0) {
			cards.push({
				value: stats.bodymapInteractions.toString(),
				label: 'Körperkarte Interaktionen'
			});
		}

		// Sorting accuracy card
		if (stats.sortableTotal > 0) {
			cards.push({
				value: `${Math.round((stats.sortableScore / stats.sortableTotal) * 100)}%`,
				label: 'Sortier-Genauigkeit'
			});
		}

		// Reflection notes card
		if (stats.completionNotes.length > 0) {
			cards.push({
				value: stats.completionNotes.length.toString(),
				label: 'Reflexionsnotizen'
			});
		}

		return cards;
	});
</script>

<div
	class="h-[calc(100vh-140px)] max-w-4xl space-y-5 overflow-y-auto overflow-x-hidden -mx-6 px-6"
	style="touch-action: pan-y;"
>
	<!-- Back button -->

	<div class="rounded-xl bg-white px-4 py-5 shadow-lg shadow-green-800/10">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<PercentageDonut
					data={donutData()}
					colors={donutColors}
					percentage={completionStats().percentage}
					class="size-16"
				/>
				<div class="flex flex-col">
					<h3 class="font-bold leading-tight">Modul abgeschlossen</h3>
					<span class="text-xs text-black/50">
						{getScoreMessage(getOverallScore())}
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="relative">
		<div
			style="background: radial-gradient(circle at center, hsl(var(--offwhite) / 1), transparent 67%);"
			class="absolute right-0 top-60 z-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 transform opacity-50 dark:opacity-40"
		></div>
		<div class="relative z-10 rounded-lg bg-white shadow-2xl shadow-black/10 dark:bg-muted">
			<div class="px-6 pb-6 pt-5">
				<h2 class="text-md mb-4 font-bold">Deine Lernzusammenfasung</h2>

				<div class="flex flex-col gap-4">
					{#each statCards() as card}
						<div class="rounded-lg bg-black/5 p-4 text-center">
							<div class="text-2xl font-bold">
								{card.value}
							</div>
							<div class="text-sm text-black/60">{card.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Detailed Statistics -->

	<!-- User Notes Summary -->
	{#if getSessionStats()?.completionNotes?.length}
		{@const stats = getSessionStats()}
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 font-bold text-gray-900">Deine Reflexionsnotizen</h2>
			<div class="space-y-3">
				{#each stats?.completionNotes || [] as note, index}
					<div class="rounded-lg bg-gray-50 p-3">
						<p class="text-sm text-gray-700">{note}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Module Feedback -->
	<div class="relative">
		<FeedbackModule
			feedbackType="learnContent"
			name={topic.titleDE || 'Learning Module'}
			{color}
			{onFeedbackSubmit}
		/>
	</div>

	<div class="flex items-center justify-center relative z-10">
		<a
			href="/bullshift/learn"
			class="bg-black text-white font-medium pl-6 pr-1.5 py-3 rounded-full flex items-center justify-between gap-2 w-full"
		>
			<span class="">Zurück zur Lernübersicht</span>
			<div class="size-6 bg-white/20 rounded-full flex items-center justify-center">
				<ChevronRight class="size-3" />
			</div>
		</a>
	</div>
</div>
