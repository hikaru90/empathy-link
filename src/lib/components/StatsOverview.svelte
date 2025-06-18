<script lang="ts">
	import { pb } from '$scripts/pocketbase';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	import StatsFeelings from '$src/lib/components/StatsFeelings.svelte';
	import StatsNeeds from '$src/lib/components/StatsNeeds.svelte';
	import StatsChatOverview from './StatsChatOverview.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

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

<div class="flex flex-col gap-6 py-4">
	<StatsChatOverview data={data.analyses} />
	<StatsFeelings data={getFeelings()} />
	<StatsNeeds data={getNeeds()} />
</div>
