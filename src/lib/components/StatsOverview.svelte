<script lang="ts">
	import { pb } from '$scripts/pocketbase';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	import { locale } from '$lib/translations';
	import StatsFeelings from '$src/lib/components/StatsFeelings.svelte';
	import StatsNeeds from '$src/lib/components/StatsNeeds.svelte';
	import StatsChatOverview from './StatsChatOverview.svelte';


	export let data;

	const getFeelings = () => {
		const feelings = data.analyses.map((analysis) => {
			return analysis.feelings;
		});
		const res = feelings.flat();
		const grouped = res.reduce((acc: { [key: string]: string[] }, feeling: string) => {
			(acc[feeling] = acc[feeling] || []).push(feeling);
			return acc;
		}, {});
		const countArray = Object.entries(grouped).map(([value, arr]) => ({
			value,
			count: arr.length
		}));
		countArray.sort((a, b) => b.count - a.count);
		return countArray;
	};
	const getNeeds = () => {
		const needs = data.analyses.map((analysis) => {
			return analysis.needs;
		});
		const res = needs.flat();
		const grouped = res.reduce((acc: { [key: string]: string[] }, need: string) => {
			(acc[need] = acc[need] || []).push(need);
			return acc;
		}, {});
		const countArray = Object.entries(grouped).map(([value, arr]) => ({
			value,
			count: arr.length
		}));
		countArray.sort((a, b) => b.count - a.count);
		return countArray;
	};
</script>

<div class="flex flex-col gap-4 py-4">

	<div class="flex items-center justify-between rounded-lg border border-black/30 px-4 py-3">
		<div class="flex items-center gap-4">
			<div
			class="flex size-8 items-center justify-center rounded-full bg-offwhite text-xs font-bold text-black"
			>
			{data.memories?.length}
		</div>
		<h2 class="text-lg">Erinnerungen</h2>
	</div>
	<ChevronRight class="size-4" />
</div>

<StatsChatOverview data={data.analyses} />
<StatsFeelings data={getFeelings()} />
<StatsNeeds data={getNeeds()} />

{#each data.analyses as analysis}
<div class="flex flex-col">
	<h2 class="text-lg font-bold">{analysis.title}</h2>
	<p class="text-sm text-gray-500">{analysis.description}</p>
</div>
{/each}
</div>
