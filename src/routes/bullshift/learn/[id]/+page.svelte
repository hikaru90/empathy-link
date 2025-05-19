<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import LearnStepper from '$lib/components/LearnStepper.svelte';
	import { marked } from 'marked';
	import { replaceState } from '$app/navigation';
	import LearnTimer from '$lib/components/LearnTimer.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let currentPage = $state(data.currentPage || 0);

	const updateQueryParams = () => {
		const url = new URL(window.location.href);
		url.searchParams.set('page', currentPage.toString());
		replaceState(url, {
			page: currentPage
		});
	};

	let currentCategory = $derived(() => {
		if (!data.categories || !data.record) return { color: '#000000' };
		const res = data.categories.find((c) => c.id === data.record?.category);
		return res ? res : { color: '#000000' };
	});

	const topic = $derived(() => {
		if (!data.record) return [];
		return data.record;
	});

	const goBack = () => {
		window.history.back();
	};
	const gotoNextPage = () => {
		if (currentPage < topic().content.length - 1) {
			currentPage++;
		}
		updateQueryParams();
	};
	const gotoPrevPage = () => {
		if (currentPage > 0) {
			currentPage--;
		}
		updateQueryParams();
	};
</script>

<div class="pb-32 pt-8">
	<Header />
	<div class="max-container py-10">
		<div class="mb-6 flex items-center justify-center">
			<!-- <a
				href="/bullshift/learn"
				class="inline-flex items-center gap-2 rounded-full border border-black/10 py-1 pl-2 pr-4 text-sm"
			>
				<ChevronLeft class="size-4" /> zurück
			</a> -->
			<div class="flex items-center justify-center gap-2">
				{#each topic().content as page, index}
					<div
						style="background-color: {currentPage >= index ? currentCategory().color : 'white'}"
						class="h-2 w-4 rounded-full"
					></div>
				{/each}
			</div>
		</div>
		
		{#if currentPage === 0}
			<div
				style="background-color: {currentCategory().color}"
				class="relative mb-10 overflow-hidden rounded-lg p-4"
			>
				<h1 class="relative z-10 text-xl font-light">
					<div class="mb-10">{topic().titleDE.split('||')[0]}</div>
					<div class="font-bold">{topic().titleDE.split('||')[1]}</div>
				</h1>
				<img
					src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic().collectionId}/${topic().id}/${topic().image}`}
					alt={`background ${topic().titleDE}`}
					class="absolute right-0 top-1/2 -z-0 -mr-10 w-2/3 -translate-y-1/2 rotate-12 transform"
				/>
			</div>
		{/if}
		{#each topic().content as page, index}
			{#if currentPage === index}
				{#each page.content as content}
					{#if content.type === 'text'}
						<div class="mb-4">
							{@html marked(content.content)}
						</div>
					{:else if content.type === 'heading'}
					<h2 class="mb-4 text-lg font-bold">{content.content}</h2>
					{:else if content.type === 'timer'}
						<LearnTimer duration={content.duration} color={currentCategory().color} />
					{:else if content.type === 'list'}
						{#each content.items as item}
							<div class="mb-3 flex gap-2">
								<div
									style="background-color: {currentCategory().color}"
									class="mt-2 size-2 flex-shrink-0 rounded-full"
								></div>
								<div>
									{@html marked(item, { breaks: true })}
								</div>
							</div>
						{/each}
					{/if}
				{/each}
			{/if}
		{/each}
		<LearnStepper
			{gotoNextPage}
			{gotoPrevPage}
			color={currentCategory().color}
			step={currentPage}
		/>
	</div>
	<Footer />
</div>
