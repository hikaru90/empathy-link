<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
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
	let feelings = [];
	let colors = [];

	$: data = feelings.map((entry) => {return {name: $locale === 'en' ? entry.feeling.nameEN : entry.feeling.nameDE, count: entry.count};})

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
	<div
		class="rounded-lg bg-feelings-background text-feelings-foreground shadow-2xl shadow-black/10"
	>
		<div class="px-4 pb-2 pt-3">
			<h2 class="text-md mb-2 font-bold">
				{$t('default.page.dashboard.feelings.heading')}
			</h2>
		</div>
		<div class="flex items-center justify-center">
			{#key feelings.length}
				<Donut {colors} {data} />
			{/key}
		</div>
		<div class="px-4 pb-3 pt-2">
			{#each feelings as feeling, index}
				<div
					class="flex items-center justify-between border-b border-feelings-foreground/20 py-1 last:border-b-0"
				>
					<div class="flex items-center gap-4">
						<div style="background-color: {colors[index]};" class="w-5 h-3 rounded-full">

						</div>
						<span>
							{$locale === 'en' ? feeling.feeling.nameEN : feeling.feeling.nameDE}
						</span>
					</div>
					<span>
						{feeling.count}
					</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
