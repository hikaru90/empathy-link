<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t, locale } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import { CaretRight, Check, Cross2 } from 'radix-icons-svelte';
	import { user } from '$store/auth';
	import { groupBy, sortByKey, generateHslaColors } from '$scripts/helpers';
	import Donut from '$lib/components/Donut.svelte';

	let initialized = false;
	let pending = true;
	let needs = [];
	let colors = [];
	let displaySelfcenteredNeeds = false;

	$: data = needs.map((entry) => {
		return { name: $locale === 'en' ? entry.need.nameEN : entry.need.nameDE, count: entry.count };
	});

	const fetchData = async () => {
		const filter = `owner = '${$user.id}' && created >= "${$startDate.toString()} 00:00:00" && created < "${$endDate.add({ days: 1 }).toString()} 00:00:00"`;
		console.log('filter', filter);
		const fights = await pb.collection('fights').getFullList({
			filter: filter,
			sort: '-updated',
			expand: 'needs',
			requestKey: 'needs'
		});
		const unsortedNeeds = groupNeeds(
			fights.map((entry) => entry.expand.needs).flat(Infinity),
			'id'
		);
		needs = sortByKey(unsortedNeeds, 'count');

		colors = generateHslaColors(179, 100, 15, needs.length);

		console.log('needs', needs);
	};

	endDate.subscribe(async () => {
		console.log('endDate changed -> fetching data');
		pending = true;
		await fetchData();
		setTimeout(() => {
			pending = false;
		}, 200);
	});

	const groupNeeds = (array: object[], key: string) => {
		return Object.entries(
			array.reduce((result, currentValue) => {
				const groupKey = currentValue[key];
				result[groupKey] = result[groupKey] || [];
				result[groupKey].push(currentValue);
				return result;
			}, {})
		).map(([needId, content]) => ({ need: content[0], count: content.length }));
	};

	const gotoFight = (id) => {
		console.log('gotoFight');
		goto(`/fights/${id}`);
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
	<div class="rounded-lg bg-needs-background text-needs-foreground shadow-2xl shadow-black/10">
		<div class="flex items-center justify-between px-4 pb-2 pt-3">
			<h2 class="text-md mb-2 font-bold">
				{$t('default.page.dashboard.needs.heading')}
			</h2>
			<div class="flex items-center gap-2">
				<Button
					on:click={() => (displaySelfcenteredNeeds = false)}
					class="{displaySelfcenteredNeeds === false
						? 'solid-need-button'
						: 'border-need-button'} h-7 rounded-full px-4 leading-tight transition"
				>
					{$t('default.page.dashboard.needs.community')}
				</Button>
				<Button
					on:click={() => (displaySelfcenteredNeeds = true)}
					class="{displaySelfcenteredNeeds === true
						? 'solid-need-button'
						: 'border-need-button'} h-7 rounded-full px-4 leading-tight"
				>
					{$t('default.page.dashboard.needs.selfcentered')}
				</Button>
			</div>
		</div>
		<div class="flex items-center justify-center">
			{#if needs}
			{#key needs.length}
				<Donut {colors} {data} />
			{/key}
			{/if}
		</div>
		<div class="px-4 pb-3 pt-2">
			{#if needs.length === 0}
				{$t('default.page.dashboard.needs.empty')}
			{:else}
				{#each needs as need, index}
					{#if displaySelfcenteredNeeds === need.need.selfcentered}
						<div
							class="flex items-center justify-between border-b border-needs-foreground/20 py-1 last:border-b-0"
						>
							<div class="flex items-center gap-4">
								<div style="background-color: {colors[index]};" class="h-3 w-5 rounded-full"></div>
								<span>
									{$locale === 'en' ? need.need.nameEN : need.need.nameDE}
								</span>
							</div>
							<span>
								{need.count}
							</span>
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	:global(.solid-need-button){
		@apply bg-needs-foreground/60 hover:bg-needs-foreground border-2 border-needs-foreground/0 hover:border-needs-foreground/60;
	}
	:global(.border-need-button){
		@apply border-2 border-needs-foreground/60 text-needs-foreground/60 hover:border-needs-foreground hover:text-needs-foreground bg-transparent hover:bg-transparent;
	}
</style>