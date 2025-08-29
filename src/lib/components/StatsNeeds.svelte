<script lang="ts">
	import { onMount } from 'svelte';
	import { m } from '$lib/translations';
	import { generateHslaColorGroup } from '$scripts/helpers';
	import Donut from '$lib/components/Donut.svelte';
	import * as Select from '$lib/components/ui/select';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';

	interface Props {
		data: any;
		rawAnalyses?: any[];
	}

	let { data, rawAnalyses }: Props = $props();

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

		// Process needs from filtered analyses
		const needs = filteredAnalyses.map((analysis) => analysis.needs).filter(Boolean);
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
	});

	// const colors = $derived(generateHslaColors(268, 60, 62, filteredData.length));
	const colors = $derived(generateHslaColorGroup(['bg-rose', 'bg-lilac', 'bg-black', 'bg-forest', 'bg-orange'], filteredData.length));

	onMount(async () => {
		pending = false;
	});
</script>

<div class="relative">
	<div
		style="background: radial-gradient(circle at center, hsl(var(--white) / 1), transparent 67%);"
		class="absolute right-0 top-60 z-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 transform opacity-50 dark:opacity-40"
	></div>
	<div
		class="relative z-10 rounded-lg bg-offwhite shadow-2xl shadow-black/10 dark:bg-muted"
	>
		<div class="flex items-center justify-between pl-4 pr-3 pb-2 pt-3 mb-2">
			<h2 class="text-md font-bold flex items-center gap-2">
				<div class="size-5 fill-white bg-forest rounded-full flex items-center justify-center p-0.5">
					{@html IconSwirl}
				</div>
				{m.page_dashboard_needs_heading()}
			</h2>
			<Select.Root bind:value={selectedTimeframe} type="single">
				<Select.Trigger class="w-[140px] border-none shadow-none text-xs">
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
				{m.page_dashboard_needs_empty()}
			{:else}
				{#each filteredData as need, index}
				{#if showMore || index < 3}
						<div
							class="flex items-center justify-between border-t border-white/10 py-1 first:border-t-0"
						>
							<div class="flex items-center gap-4">
								<div style="background-color: {colors[index]};" class="h-3 w-5 rounded-full"></div>
								<span>
									{need.value}
								</span>
							</div>
							<span>
								{need.count}
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
		@apply border-2 border-needs-foreground/0 bg-needs-foreground/60 hover:border-needs-foreground/60 hover:bg-needs-foreground;
	}
	:global(.border-button) {
		@apply border-2 border-needs-foreground/60 bg-transparent text-needs-foreground/60 hover:border-needs-foreground hover:bg-transparent hover:text-needs-foreground;
	}
</style>
