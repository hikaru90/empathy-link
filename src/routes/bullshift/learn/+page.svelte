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

	const categories = $derived(() => {
		console.log('topics', data.topics);
		if (!data.topics) return [];
		const res = data.topics;
		// Group topics by category
		const groupedTopics = res.reduce((acc: Record<string, any[]>, topic: any) => {
			const category = topic?.expand?.currentVersion?.expand?.category?.id || 'Uncategorized';
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(topic);
			return acc;
		}, {});
		console.log('groupedTopics', groupedTopics);

		// Convert to array of category groups
		const groupedArray = Object.entries(groupedTopics).map(([category, topics]) => ({
			category,
			topics
		}));
		return groupedArray;
	});

	const currentCategory = (categoryId: string) => {
		return data.categories?.find((c) => c.id === categoryId);
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
		const completed = Object.keys(data.completionStatus).length;
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

	<div class="mb-20 flex flex-col gap-10">
		{#if categories() && data.categories}
			{#each categories() as category}
				{@const categoryCompletion = getCategoryCompletion(category.topics)}
				<div class="mb-4">
					<div class="flex flex-col gap-4">
						<div class="max-container">
							<div class="">
								<h3 class="text-xl font-bold mb-2">
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

					<div style="-ms-overflow-style: none; scrollbar-width: none;" class="scroll-snap-x scroll-snap-mandatory overflow-x-auto p-6">
						<div class="inline-flex gap-4">
							{#each category.topics as topic}
								<a
									style="background-color: {currentCategory(category.category)?.color}"
									href={`/bullshift/learn/${topic?.id}`}
									class="group relative flex h-60 w-52 items-end justify-start overflow-hidden rounded-lg p-4 text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
								>
									<!-- Completion Badge -->
									{#if isTopicCompleted(topic.id)}
										<div
											class="absolute right-3 top-3 flex items-center text-green-600 text-xs bg-white rounded-full px-2 py-1 gap-1"
										>
											<BadgeCheck class="size-3" /> 
											<span>
												fertig
											</span>
										</div>
										<!-- Completion Ribbon -->
									{/if}

									<!-- Completion Overlay for subtle dimming -->
									{#if isTopicCompleted(topic.id)}
										<div class="z-5 absolute inset-0 bg-green-500/10"></div>
									{/if}

									<h4 class="relative z-10 text-xl font-light drop-shadow-md">
										<span>{topic.expand?.currentVersion?.titleDE.split('||')[0]}</span>
										<span>{topic.expand?.currentVersion?.titleDE.split('||')[1]}</span>
									</h4>
									<img
										src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic.expand?.currentVersion?.collectionId}/${topic.expand?.currentVersion?.id}/${topic.expand?.currentVersion?.image}`}
										alt={`background ${topic.expand?.currentVersion?.titleDE}`}
										class="absolute left-1/3 top-0 -z-0 w-full -rotate-6 transform transition-transform group-hover:scale-105"
									/>
								</a>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<Footer />
</div>
