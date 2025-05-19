<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import { PUBLIC_BACKEND_URL } from '$env/static/public'

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const currentCategory = $derived(() => {
		if (!data.categories || !data.record) return '#000000';
		return data.categories.find((c) => c.id === data.record?.category);
	});

	const topic = $derived(() => {
		if (!data.record) return [];
		return data.record;
	});

	const goBack = () => {
		window.history.back();
	};
</script>

<div class="pt-8 pb-16">
	<Header />
	<div class="max-container py-10">
		<div class="flex items-center justify-between mb-6">
			<button
				onclick={goBack}
				class="inline-flex items-center gap-2 rounded-full border border-black/10 py-1 pl-2 pr-4 text-sm"
			>
				<ChevronLeft class="size-4" /> zurück
			</button>
		</div>
		<div style="background-color: {currentCategory().color}" class="mb-10 rounded-lg p-4 relative overflow-hidden">
			<h1 class="text-xl font-light relative z-10">
				<div class="mb-6">{topic().titleDE.split('||')[0]}</div>
				<div>{topic().titleDE.split('||')[1]}</div>
			</h1>
			<img src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic().collectionId}/${topic().id}/${topic().image}`} alt={`background ${topic().titleDE}`} class="absolute top-1/2 right-0 -mr-10 transform -translate-y-1/2 rotate-12 w-2/3 -z-0">
		</div>
		{#each topic().content as page}
			<div class="mb-10 rounded-lg p-4 relative overflow-hidden">
				<h2 class="text-xl font-light relative z-10">
					{JSON.stringify(page)}
				</h2>
			</div>
		{/each}
	</div>
	<Footer />
</div>
