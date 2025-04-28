<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t, locale } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import { user } from '$store/auth';
	import { groupBy, sortByKey, generateHslaColors } from '$scripts/helpers';
	import Donut from '$lib/components/Donut.svelte';

	let initialized = false;
	let pending = true;
	let feelings = [];
	let colors = [];
	let displayPositiveFeelings = false;

	$: data = feelings.map((entry) => {
		return {
			name: $locale === 'en' ? entry.feeling.nameEN : entry.feeling.nameDE,
			count: entry.count
		};
	});

	const fetchData = async () => {
		const filter = `owner = '${$user.id}' && created >= "${$startDate.toString()} 00:00:00" && created < "${$endDate.add({ days: 1 }).toString()} 00:00:00"`;
		console.log('filter', filter);
		const fights = await pb.collection('fights').getFullList({
			filter: filter,
			sort: '-updated',
			expand: 'feelings',
			requestKey: 'feelings'
		});
		const unsortedFeelings = groupFeelings(
			fights.map((entry) => entry.expand.feelings).flat(Infinity),
			'id'
		);
		feelings = sortByKey(unsortedFeelings, 'count');

		console.log('feelings.length',feelings.length);
		colors = generateHslaColors(1, 100, 56, feelings.length);

		console.log('feelings', feelings);
	};

	endDate.subscribe(async () => {
		console.log('endDate changed -> fetching data');
		pending = true;
		await fetchData();
		setTimeout(() => {
			pending = false;
		}, 200);
	});

	const groupFeelings = (array: object[], key: string) => {
		return Object.entries(
			array.reduce((result, currentValue) => {
				const groupKey = currentValue[key];
				result[groupKey] = result[groupKey] || [];
				result[groupKey].push(currentValue);
				return result;
			}, {})
		).map(([feelingId, content]) => ({ feeling: content[0], count: content.length }));
	};

	const gotoFight = (id) => {
		console.log('gotoFight');
		goto(`/app/fights/${id}`);
	};

	onMount(async () => {
		await fetchData();
		initialized = true;
		pending = false;

		console.log('$user', $user);
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="relative">
		<div
			style="background: radial-gradient(circle at center, hsl(var(--feelings-background) / 1), transparent 67%);"
			class="absolute right-0 top-60 z-0 h-[800px] w-[800px] translate-x-1/2 -translate-y-1/2 transform dark:opacity-40"
		></div>
		<div
			class="relative z-10 rounded-lg bg-feelings-background dark:bg-muted text-feelings-foreground shadow-2xl shadow-black/10"
		>
			<div class="flex items-center justify-between px-4 pb-2 pt-3">
				<h2 class="text-md mb-2 font-bold">
					{$t('default.page.dashboard.feelings.heading')}
				</h2>
				<div class="flex items-center gap-2">
					<Button
						on:click={() => (displayPositiveFeelings = false)}
						class="{displayPositiveFeelings === false
							? 'solid-button text-white'
							: 'border-button'} h-7 rounded-full px-4 leading-tight transition"
					>
						{$t('default.page.dashboard.feelings.negative')}
					</Button>
					<Button
						on:click={() => (displayPositiveFeelings = true)}
						class="{displayPositiveFeelings === true
							? 'solid-button text-white'
							: 'border-button'} h-7 rounded-full px-4 leading-tight"
					>
						{$t('default.page.dashboard.feelings.positive')}
					</Button>
				</div>
			</div>
			<div class="flex items-center justify-center">
				{#if feelings}
					{#key feelings.length}
						<Donut {colors} {data} />
					{/key}
				{/if}
			</div>
			<div class="px-4 pb-3 pt-2">
				{#if feelings.length === 0}
					{$t('default.page.dashboard.feelings.empty')}
				{:else}
					{#each feelings as feeling, index}
						{#if displayPositiveFeelings === feeling.feeling.positive}
							<div
								class="flex items-center justify-between border-b border-feelings-foreground/20 py-1 last:border-b-0"
							>
								<div class="flex items-center gap-4">
									<div
										style="background-color: {colors[index]};"
										class="h-3 w-5 rounded-full"
									></div>
									<span>
										{$locale === 'en' ? feeling.feeling.nameEN : feeling.feeling.nameDE}
									</span>
								</div>
								<span>
									{feeling.count}
								</span>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	:global(.solid-button) {
		@apply border-2 border-feelings-foreground/0 bg-feelings-foreground/60 hover:border-feelings-foreground/60 hover:bg-feelings-foreground;
	}
	:global(.border-button) {
		@apply border-2 border-feelings-foreground/60 bg-transparent text-feelings-foreground/60 hover:border-feelings-foreground hover:bg-transparent hover:text-feelings-foreground;
	}
</style>
