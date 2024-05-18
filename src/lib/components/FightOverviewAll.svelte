<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t } from '$lib/translations';
	import { endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import { CaretRight, Check, Cross2 } from 'radix-icons-svelte';
	import { user } from '$store/auth';
	import SparklePill from '$lib/components/SparklePill.svelte';

	let initialized = false;
	let pending = true;
	let records: object[] = [];
	let page = 1;
	const perPage = 5;
	let endReached = false;

	const fetchData = async () => {
		pending = true;
		const newRecords = await pb.collection('fights').getList(page, perPage, {
			filter: `owner = '${$user.id}'`,
			sort: '-updated',
			expand: 'responses'
		});
		if (newRecords.items.length === 0) endReached = true;
		records = [...records, ...newRecords.items];
		pending = false
	};

	endDate.subscribe(async () => {
		console.log('endDate changed -> fetching data');
		pending = true;
		await fetchData();
		setTimeout(() => {
			pending = false;
		}, 200);
	});

	const loadMore = () => {
		page++;
		fetchData();
	};

	const gotoFight = (id) => {
		console.log('gotoFight');
		goto(`/fights/${id}`);
	};

	onMount(async () => {
		await fetchData();
		console.log('records', records);
		initialized = true;
		pending = false;

		console.log('$user', $user);
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="">
		<div
			class="rounded-lg border-b border-black/5 bg-white px-4 pb-2 pt-3 shadow-2xl shadow-black/10"
		>
			<h2 class="text-md mb-2 font-bold">
				{$t('default.page.dashboard.fights.tableCaption')}
			</h2>
			<div class="flex items-center text-2xs">
				<div class="w-1/6">
					{$t('default.page.dashboard.fights.table.round')}
				</div>
				<div class="w-1/3">
					{$t('default.page.dashboard.fights.table.partner')}
				</div>
				<div class="w-1/4">
					{$t('default.page.dashboard.fights.table.date')}
				</div>
				<div class="w-1/6">
					{$t('default.page.dashboard.fights.table.opened')}
				</div>
				<div class="w-1/6"></div>
			</div>
		</div>
		<div class="rounded-lg bg-white px-4 pb-3 pt-2 shadow-2xl shadow-black/10">
			{#each records as record}
				<button
					on:click={gotoFight(record.id)}
					class="group flex w-full items-center border-b border-black/5 py-2 text-left text-xs last:border-b-0 sm:py-3"
				>
					<div class="flex w-1/6">
						<div class="scale-75 transform rounded-full bg-black/5 px-2.5 text-2xs font-bold">
							{record.responses?.length + 1}
						</div>
					</div>
					<div class="w-1/3">
						{record.name}
					</div>
					<div class="w-1/4">
						{new Intl.DateTimeFormat('de-DE', {
							month: 'short',
							day: 'numeric'
							// year: 'numeric',
						}).format(new Date(record.created))}
					</div>
					<div class="w-1/6">
						{#if record.opened}
							<Check class="h-3 w-3 text-black" />
						{:else}
							<Cross2 class="h-3 w-3 text-black" />
						{/if}
					</div>
					<div class="flex w-1/6 justify-end">
						<CaretRight class="h-4 w-4 rounded-full group-hover:bg-neon group-hover:text-black" />
					</div>
				</button>
			{/each}
			{#if !endReached}
				{#if !pending}
				<div class="mt-4 flex justify-center">
					<Button on:click={loadMore}>
						{$t('default.page.fights.loadMore')}
					</Button>
				</div>
				{:else}
				<div class="mt-4 flex justify-center">
					<SparklePill fast={true} class="h-6 w-16 shadow-xl dark:shadow-gray-200/30" />
				</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}
