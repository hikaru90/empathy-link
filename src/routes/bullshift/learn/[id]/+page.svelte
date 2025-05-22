<script lang="ts">
	import type { PageData } from './$types';
	import { replaceState } from '$app/navigation';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import LearnStepper from '$lib/components/bullshift/Learn/LearnStepper.svelte';
	import LearnTimer from '$lib/components/bullshift/Learn/LearnTimer.svelte';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnTitleCard from '$lib/components/bullshift/Learn/LearnTitleCard.svelte';
	import LearnHeading from '$lib/components/bullshift/Learn/LearnHeading.svelte';
	import LearnList from '$lib/components/bullshift/Learn/LearnList.svelte';
	import LearnText from '$lib/components/bullshift/Learn/LearnText.svelte';
	import LearnTask from '$lib/components/bullshift/Learn/LearnTask.svelte';
	import LearnBodyMap from '$lib/components/LearnBodyMap.svelte';

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
		const res = data.categories.find((c) => c.id === data.record?.expand?.currentVersion?.category);
		return res ? res : { color: '#000000' };
	});

	const topic = $derived(() => {
		if (!data.record?.expand?.currentVersion) return [];
		return data.record.expand.currentVersion;
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

<div class="pb-32 pt-6">
	<Header />
	<div class="max-container py-10">
		<div class="mb-6 flex items-center justify-center">
			<!-- <a
				href="/bullshift/learn"
				class="inline-flex items-center gap-2 rounded-full border border-black/10 py-1 pl-2 pr-4 text-sm"
			>
				<ChevronLeft class="size-4" /> zurück
			</a> -->
			<LearnStepIndicator {topic} {currentPage} {currentCategory} />
		</div>

		{#if currentPage === 0}
			<LearnTitleCard currentCategory={currentCategory()} topic={topic()} />
		{/if}
		{#each topic().content as page, index}
			{#if currentPage === index}
				{#each page.content as content}
					{#if content.type === 'text'}
						<LearnText {content} />
					{:else if content.type === 'task'}
						<LearnTask color={currentCategory().color} {content} />
					{:else if content.type === 'heading'}
						<LearnHeading {content} />
					{:else if content.type === 'timer'}
						<LearnTimer duration={content.duration} color={currentCategory().color} />
					{:else if content.type === 'bodymap'}
						<LearnBodyMap {content} color={currentCategory().color} />
					{:else if content.type === 'list'}
						<LearnList {content} currentCategory={currentCategory()} />
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
