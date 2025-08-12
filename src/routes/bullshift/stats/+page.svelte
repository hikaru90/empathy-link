<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import StatsMemories from '$lib/components/StatsMemories.svelte';
	import StatsInsights from '$lib/components/StatsInsights.svelte';

	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const menu = [
		{
			label: 'Übersicht',
			slug: 'overview'
		},
		{
			label: 'Kommunikationsstil',
			slug: 'memories'
		},
		{
			label: 'Beziehungen',
			slug: 'insights'
		},
	];
	let currentSlug = $state(menu[0].slug);
</script>

<div class="pt-16">
	<Header user={data.user} />
	<div class="flex h-full w-full flex-col">
		{#if data.error}
			<p class="text-red-500">{data.error}</p>
		{:else}
			<div
				class="scroll-snap-x scroll-snap-mandatory hidden-scrollbar mb-4 flex gap-1 px-5 justify-center text-xs md:text-base"
			>
				{#each menu as item}
					<button style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.2);"
						class="mt-[1px] rounded-full px-3 py-1 shadow-md {currentSlug === item.slug
							? 'bg-white/80 border border-white'
							: 'bg-white/20 text-black/60 border border-black/10'}"
						onclick={() => (currentSlug = item.slug)}
					>
						{item.label}
					</button>
				{/each}
			</div>

			<div class="max-container pb-16 relative z-0">
				{#if currentSlug === 'overview'}
					<StatsOverview data={data} />
				{:else if currentSlug === 'memories'}
					<StatsMemories data={data.memories} />
				{:else if currentSlug === 'insights'}
					<StatsInsights data={data.memories} />
				{/if}
			</div>
		{/if}
	</div>
	<Footer />
</div>

<style>
	.hidden-scrollbar::-webkit-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
