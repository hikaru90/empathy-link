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

	let initialized = false;
	let pending = true;
	let records = [];

	const fetchData = async () => {
		const filter = `owner = '${$user.id}' && created >= "${$startDate.toString()} 00:00:00" && created < "${$endDate.add({ days: 1 }).toString()} 00:00:00"`;
		console.log('filter', filter);
		records = await pb.collection('fights').getFullList({
			filter: filter,
			sort: '-updated',
			expand: 'responses'
		});
	};

	endDate.subscribe(async () => {
		console.log('endDate changed -> fetching data');
		pending = true;
		await fetchData();
		setTimeout(() => {
			pending = false;
		}, 200);
	});

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
<div class="relative z-0">
	<div style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);" class="absolute left-0 top-20 w-[500px] h-[500px] z-0 transform -translate-x-1/2 -translate-y-1/2"></div>
</div>
	<div class="relative z-10">
		<div
			class="rounded-t-xl border-b border-black/5 bg-almostwhite px-5 pb-3 pt-4 shadow-2xl shadow-black/10"
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
		<div class="rounded-b-xl bg-almostwhite px-4 pb-3 pt-2 shadow-2xl shadow-black/10">
			{#each records as record}
				<button on:click={gotoFight(record.id)} class="group w-full text-left flex items-center border-b border-black/5 py-2 sm:py-3 text-xs last:border-b-0">
					<div class="flex w-1/6">
						<div class="scale-75 transform rounded-full bg-black/5 px-2.5 text-2xs font-bold">
							{record.responses?.length + 1}
						</div>
					</div>
					<div class="w-1/3 overflow-hidden mr-2">
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
							<Check class="w-3 h-3 text-black" />
							{:else}
							<Cross2 class="w-3 h-3 text-black" />
						{/if}
					</div>
					<div class="w-1/6 flex justify-end">
						<div class="skeumorphic-button rounded-full p-0.5">
							<CaretRight class="h-4 w-4 rounded-full group-hover:bg-neutral-300 group-hover:text-black" />
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>