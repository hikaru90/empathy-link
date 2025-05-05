<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	const menu = [
		{
			label: 'Übersicht',
			slug: 'overview'
		},
		{
			label: 'Kommunikationsstil',
			slug: 'memory'
		},
		{
			label: 'Erkenntnisse',
			slug: 'insights'
		},
	];
	let currentSlug = menu[0].slug;
</script>

<div class="pt-16">
	<Header />
	<div class="flex h-full w-full flex-col">
		{#if data.error}
			<p class="text-red-500">{data.error}</p>
		{:else}
			<div
				class="scroll-snap-x scroll-snap-mandatory hidden-scrollbar mb-4 flex gap-1 overflow-x-auto px-5"
			>
				{#each menu as item}
					<button
						class="rounded-full px-3 py-0.5 {currentSlug === item.slug
							? 'bg-black text-offwhite'
							: 'border-2 border-black text-black'}"
						on:click={() => (currentSlug = item.slug)}
					>
						{item.label}
					</button>
				{/each}
			</div>

			<div class="max-container pb-16">
				{#if currentSlug === 'overview'}
					<StatsOverview data={data} />
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
