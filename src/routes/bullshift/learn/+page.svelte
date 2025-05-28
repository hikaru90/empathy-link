<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import CheckCircle from 'lucide-svelte/icons/check-circle';

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
		const completed = categoryTopics.filter(topic => isTopicCompleted(topic.id)).length;
		const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
		return { completed, total, percentage };
	};

	// Check if user has any completed modules to show progress section
	const hasCompletions = $derived(() => {
		return data.completionStatus && Object.keys(data.completionStatus).length > 0;
	});
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
			<div class="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-lg border border-green-100">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="bg-green-500 rounded-full p-2">
							<CheckCircle class="w-5 h-5 text-white" />
						</div>
						<h3 class="text-lg font-semibold text-gray-900">Dein Fortschritt</h3>
					</div>
					<div class="text-sm text-gray-600 font-medium">
						{completionStats().completed} von {completionStats().total} Modulen abgeschlossen
					</div>
				</div>
				<div class="w-full bg-gray-200 rounded-full h-4 mb-3 shadow-inner">
					<div 
						class="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-700 ease-out shadow-sm"
						style="width: {completionStats().percentage}%"
					></div>
				</div>
				<div class="flex justify-between items-center">
					<div class="text-sm text-gray-600">
						{completionStats().percentage}% abgeschlossen
					</div>
					{#if completionStats().percentage === 100}
						<div class="text-sm font-medium text-green-600 flex items-center gap-1">
							<span>🎉 Alle Module abgeschlossen!</span>
						</div>
					{:else if completionStats().percentage >= 75}
						<div class="text-sm font-medium text-blue-600">
							Fast geschafft! 💪
						</div>
					{:else if completionStats().percentage >= 50}
						<div class="text-sm font-medium text-purple-600">
							Auf halbem Weg! 🚀
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<div class="flex flex-col gap-10">
			{#if categories() && data.categories}
				{#each categories() as category}
					{@const categoryCompletion = getCategoryCompletion(category.topics)}
					<div>
						<div class="flex items-center justify-between mb-4">
							<h3 class="text-xl font-bold">
								{currentCategory(category.category)?.nameDE}
							</h3>
							{#if categoryCompletion.total > 0}
								<div class="flex items-center gap-2 text-sm">
									{#if categoryCompletion.completed === categoryCompletion.total}
										<div class="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
											<CheckCircle class="w-4 h-4 text-green-600" />
											<span class="text-green-700 font-medium">Abgeschlossen</span>
										</div>
									{:else}
										<div class="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
											<span class="text-gray-700">{categoryCompletion.completed}/{categoryCompletion.total} abgeschlossen</span>
										</div>
									{/if}
								</div>
							{/if}
						</div>
						<div class="flex gap-4 flex-wrap">
							{#each category.topics as topic}
								<a
									style="background-color: {currentCategory(category.category)?.color}"
									href={`/bullshift/learn/${topic?.id}`}
									class="relative flex h-60 w-52 items-end justify-start overflow-hidden rounded-lg p-4 text-sm group transition-all duration-300 hover:scale-105 hover:shadow-xl {isTopicCompleted(topic.id) ? 'ring-2 ring-green-500 ring-opacity-60 shadow-lg' : ''}"
								>
									<!-- Completion Badge -->
									{#if isTopicCompleted(topic.id)}
										<div class="absolute top-3 right-3 z-20 bg-white rounded-full p-2 shadow-lg ring-2 ring-green-500">
											<CheckCircle class="w-5 h-5 text-green-600" />
										</div>
										<!-- Completion Ribbon -->
										<div class="absolute top-0 right-0 z-15 bg-green-500 text-white text-xs font-bold px-2 py-1 transform rotate-12 translate-x-2 -translate-y-1 shadow-md">
											Fertig
										</div>
									{/if}

									<!-- Completion Overlay for subtle dimming -->
									{#if isTopicCompleted(topic.id)}
										<div class="absolute inset-0 bg-green-500/10 z-5"></div>
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
				{/each}
			{/if}
		</div>
	</div>
	<Footer />
</div>
