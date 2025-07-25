<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import PercentageDonut from '$lib/components/PercentageDonut.svelte';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Track focused elements for each category
	let focusedElements = $state<Record<number, number>>({});

	// Function to handle scroll and detect focused element
	const handleScroll = (event: Event, categoryIndex: number) => {
		const container = event.target as HTMLElement;
		const cards = container.querySelectorAll('.card-item');
		const containerRect = container.getBoundingClientRect();
		const containerCenter = containerRect.left + containerRect.width / 2;

		let closestIndex = -1;
		let closestDistance = Infinity;

		cards.forEach((card, index) => {
			const cardRect = card.getBoundingClientRect();
			const cardCenter = cardRect.left + cardRect.width / 2;
			const distance = Math.abs(cardCenter - containerCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = index;
			}
		});

		focusedElements = { ...focusedElements, [categoryIndex]: closestIndex };
	};

	const categories = $derived(() => {
		console.log('topics', data.topics);
		if (!data.topics || !data.categories) return [];
		const res = data.topics;
		// Group topics by category while preserving order
		const groupedTopics = res.reduce((acc: Record<string, any[]>, topic: any) => {
			const category = topic?.expand?.currentVersion?.expand?.category?.id || 'Uncategorized';
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(topic);
			return acc;
		}, {});
		console.log('groupedTopics', groupedTopics);

		// Convert to array of category groups and sort by category order
		const groupedArray = Object.entries(groupedTopics).map(([category, topics]) => ({
			category,
			topics: topics.sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort topics by order column
		}));
		
		// Sort categories by their order field
		return groupedArray.sort((a, b) => {
			const catA = data.categories?.find(c => c.id === a.category);
			const catB = data.categories?.find(c => c.id === b.category);
			return (catA?.order || 0) - (catB?.order || 0);
		});
	});

	const currentCategory = (categoryId: string) => {
		// First try to find the category in the categories array
		const category = data.categories?.find((c) => c.id === categoryId);
		return category;
	};

	const isTopicCompleted = (topicId: string) => {
		return data.completionStatus?.[topicId] || false;
	};

	// Calculate completion statistics
	const completionStats = $derived(() => {
		if (!data.topics || !data.completionStatus) {
			return { completed: 0, total: 0, percentage: 0 };
		}

		const total = data.topics.length;
		// Count only topics that exist in the topics collection AND are marked as completed
		const completed = data.topics.filter((topic) => isTopicCompleted(topic.id)).length;
		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

		return { completed, total, percentage };
	});

	// Calculate completion by category
	const getCategoryCompletion = (categoryTopics: any[]) => {
		const total = categoryTopics.length;
		const completed = categoryTopics.filter((topic) => isTopicCompleted(topic.id)).length;
		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
		return { completed, total, percentage };
	};

	// Check if user has any completed modules to show progress section
	const hasCompletions = $derived(() => {
		console.log('data.completionStatus', data.completionStatus);
		return data.completionStatus && Object.keys(data.completionStatus).length > 0;
	});

	// Data for the donut chart
	const donutData = $derived(() => {
		const stats = completionStats();
		return [
			{
				name: 'Abgeschlossen',
				count: stats.completed
			},
			{
				name: 'Verbleibend',
				count: stats.total - stats.completed
			}
		];
	});

	// Colors for the donut chart (green for completed, light gray for remaining)
	const donutColors = ['#22c55e', '#e5e7eb'];
</script>

<style>
	.scroll-container {
		scroll-behavior: smooth;
	}
	
	.card-item {
		transform: scale(1);
		transition: transform 0.3s ease;
	}
</style>

<div class="pt-16">
	<Header />
	<div class="max-container">
		<h1 class="mb-3 mt-4 max-w-[15em] text-2xl font-light">
			Stärke deine Empathiefähigkeit, Schritt für Schritt.
		</h1>
		<h2 class="mb-6 max-w-[14em] text-2xl font-light text-black/40">
			Lerne praktische Werkzeuge, um klar, mitfühlend und selbstbewusst zu kommunizieren.
		</h2>

		<!-- Progress Summary -->
		{#if hasCompletions()}
			<div class="mb-8 rounded-xl bg-white px-4 py-5 shadow-lg shadow-green-800/10">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<PercentageDonut
							data={donutData()}
							colors={donutColors}
							percentage={completionStats().percentage}
							class="size-16"
						/>
						<div class="flex flex-col">
							<h3 class="text-lg font-bold leading-tight">Dein Fortschritt</h3>
							<span class="text-xs text-black/50">
								{completionStats().completed} von {completionStats().total} Modulen abgeschlossen
							</span>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="mb-20 flex flex-col gap-4">
		{#if !data.categories || !data.topics}
			<div class="flex h-64 w-full items-center justify-center">
				<div class="text-center">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p class="mt-4 text-gray-600">Loading learning modules...</p>
				</div>
			</div>
		{:else if categories() && data.categories}
			{#each categories() as category, categoryIndex}
				{@const categoryCompletion = getCategoryCompletion(category.topics)}
				<div class="">
					<div class="flex flex-col">
						<div class="max-container">
							<div class="">
								<h3 class="mb-2 text-xl font-bold">
									{currentCategory(category.category)?.nameDE}
								</h3>

								{#if categoryCompletion.total > 0}
									<div class="flex items-center gap-2 text-xs">
										{#if categoryCompletion.completed === categoryCompletion.total}
											<div class="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1">
												<BadgeCheck class="-ml-2 size-4 text-green-600" />
												<span class="font-medium text-green-700">Abgeschlossen</span>
											</div>
										{:else}
											<div class="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
												<span class="text-gray-700"
													>{categoryCompletion.completed}/{categoryCompletion.total} abgeschlossen</span
												>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>
					</div>

					<div
						style="-ms-overflow-style: none; scrollbar-width: none;"
						class="max-container scroll-container snap-x snap-mandatory overflow-x-auto px-6 pt-6 pb-10"
						onscroll={(e) => handleScroll(e, categoryIndex)}
					>
						<div class="flex">
							{#each category.topics as topic, topicIndex}
								<a
									href={`/bullshift/learn/${topic?.slug}`}
									class="card-item relative group h-64 w-72 flex-shrink-0 snap-start px-6 -mx-3 text-sm transition-all duration-100"
									style="transform: {focusedElements[categoryIndex] === topicIndex ? 'scale(1.02)' : 'scale(1)'}"
								>
									<div style="background-color: {currentCategory(category.category)?.color || '#6b7280'}" class="relative h-full w-full flex items-end justify-start overflow-hidden rounded-lg p-4 transition-all duration-400 delay-100 shadow-md shadow-black/5 {focusedElements[categoryIndex] === topicIndex ? 'shadow-xl shadow-black/10' : ''}">
										<!-- Completion Badge -->
										{#if isTopicCompleted(topic.id)}
											<div
												class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-green-600 z-20"
											>
												<BadgeCheck class="size-3" />
												<span> fertig </span>
											</div>
											<!-- Completion Ribbon -->
										{/if}

										<h4 class="transition duration-500 delay-200 relative z-10 text-xl font-light {focusedElements[categoryIndex] === topicIndex ? 'text-black' : 'text-black/50'}">
											<span>{topic.expand?.currentVersion?.titleDE.split('||')[0]}</span>
											<span>{topic.expand?.currentVersion?.titleDE.split('||')[1]}</span>
										</h4>
										<img
											src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic.expand?.currentVersion?.collectionId}/${topic.expand?.currentVersion?.id}/${topic.expand?.currentVersion?.image}`}
											alt={`background ${topic.expand?.currentVersion?.titleDE}`}
											class="absolute left-[20%] top-0 -z-0 w-full -rotate-6 bg-blend-soft-light opacity-30"
										/>
									</div>
								</a>
							{/each}
							<!-- Spacer for proper scroll alignment -->
							<div class="w-52 flex-shrink-0"></div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<Footer />
</div>
