<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import type { PageData } from './$types';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	
	const goBack = () => {
		window.history.back();
	}
</script>

<div class="mt-1px pt-16">
	<Header />
	<div class="flex h-full w-full flex-col overflow-hidden">
		{#if data.error}
			<p class="text-red-500">{data.error}</p>
		{:else}
			<div class="max-container pb-16">
				<button
					onclick={goBack}
					class="inline-flex items-center gap-2 rounded-full border border-black/10 py-1 pl-2 pr-4 text-sm"
				>
					<ChevronLeft class="size-4" /> zurück
				</button>
				<div class="rounded-b-xl px-2 pb-3 pt-2 mt-6">
					{JSON.stringify(data.analysis)}
				</div>
			</div>
		{/if}
	</div>
	<Footer />
</div>
