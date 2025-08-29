<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { m } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import { groupBy, sortByKey, generateHslaColors, generateHslaColorGroup } from '$scripts/helpers';
	import Donut from '$lib/components/Donut.svelte';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';

	interface Props {
		data: any;
		user?: App.User;
		rawAnalyses?: any[];
	}

	let { data, user, rawAnalyses }: Props = $props();

	let pending = true;
	let showMore = $state(false);
	let selectedTimeframe = $state('lastWeek');

	const timeframeOptions = [
		{ value: 'today', label: 'Heute' },
		{ value: 'lastWeek', label: 'Letzte Woche' },
		{ value: 'lastMonth', label: 'Letzter Monat' },
		{ value: 'lastYear', label: 'Letztes Jahr' }
	];

	// Function to filter analyses by timeframe
	const getDateFilter = (timeframe: string) => {
		const now = new Date();
		let startDate: Date;

		switch (timeframe) {
			case 'today':
				startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				break;
			case 'lastWeek':
				startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case 'lastMonth':
				startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
				break;
			case 'lastYear':
				startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
				break;
			default:
				startDate = new Date(0); // All time
		}

		return startDate;
	};

	// Reactive filtered data based on selected timeframe
	const filteredData = $derived.by(() => {
		if (!rawAnalyses) return data || []; // Fallback to original data or empty array

		const startDate = getDateFilter(selectedTimeframe);
		
		// Filter analyses by date
		const filteredAnalyses = rawAnalyses.filter((analysis) => {
			const analysisDate = new Date(analysis.created);
			return analysisDate >= startDate;
		});

		// Process feelings from filtered analyses
		const feelings = filteredAnalyses.map((analysis) => analysis.feelings).filter(Boolean);
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
	});

	// const colors = $derived(generateHslaColors(268, 60, 62, filteredData.length));
	const colors = $derived(generateHslaColorGroup(['bg-rose', 'bg-lilac', 'bg-black', 'bg-forest', 'bg-orange'], filteredData.length));

	onMount(async () => {
		pending = false;
	});
</script>

<div class="relative">
	<div
		style="background: radial-gradient(circle at center, hsl(var(--bg-rose) / 1), transparent 67%);"
		class="absolute right-0 top-60 z-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 transform opacity-50"
	></div>
	<div
		class="relative z-10 rounded-xl bg-offwhite shadow-2xl shadow-black/10 dark:bg-muted"
	>
		<div class="flex items-center justify-between pl-4 pr-3 pb-2 pt-3 mb-2">
			<h2 class="text-md font-bold flex items-center gap-2">
				<div class="size-5 fill-white bg-lilac rounded-full flex items-center justify-center p-0.5">
					{@html IconHeart}
				</div>
				{m.page_dashboard_feelings_heading()}
			</h2>
			<Select.Root bind:value={selectedTimeframe} type="single">
				<Select.Trigger class="w-[140px] border-none shadow-none">
					{timeframeOptions.find(opt => opt.value === selectedTimeframe)?.label || 'Zeitraum wählen'}
				</Select.Trigger>
				<Select.Content>
					{#each timeframeOptions as option}
						<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex items-center justify-center">
			{#if filteredData}
				{#key filteredData.length}
					<Donut {colors} data={filteredData} />
				{/key}
			{/if}
		</div>
		<div class="px-4 pb-3 pt-2">
			{#if filteredData.length === 0}
				{m.page_dashboard_feelings_empty()}
			{:else}
				{#each filteredData as feeling, index}
				{#if showMore || index < 3}
						<div
							class="flex items-center justify-between border-t border-white/10 py-1 first:border-t-0"
						>
							<div class="flex items-center gap-4">
								<div style="background-color: {colors[index]};" class="h-3 w-5 rounded-full"></div>
								<span>
									{feeling.value}
								</span>
							</div>
							<span>
								{feeling.count}
							</span>
						</div>
					{/if}
				{/each}
				<div class="flex justify-center pt-4">
					{#if !showMore}
					<button onclick={() => (showMore = true)} class="text-xs rounded-full border border-white/20 px-2 py-1">Mehr anzeigen</button>
					{:else}
					<button onclick={() => (showMore = false)} class="text-xs rounded-full border border-white/20 px-2 py-1">Weniger anzeigen</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	:global(.solid-button) {
		@apply border-2 border-feelings-foreground/0 bg-feelings-foreground/60 hover:border-feelings-foreground/60 hover:bg-feelings-foreground;
	}
	:global(.border-button) {
		@apply border-2 border-feelings-foreground/60 bg-transparent text-feelings-foreground/60 hover:border-feelings-foreground hover:bg-transparent hover:text-feelings-foreground;
	}
</style>
