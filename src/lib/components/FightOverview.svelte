<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { m } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		user: App.User;
	}

	let { user }: Props = $props();

	let initialized = $state(false);
	let pending = true;
	let records: any[] = $state([]);

	const fetchData = async () => {
		const filter = `owner = '${user.id}' && created >= "${$startDate.toString()} 00:00:00" && created < "${$endDate.add({ days: 1 }).toString()} 00:00:00"`;
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
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
<div class="relative z-0">
	<div style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);" class="absolute left-0 top-20 w-[500px] h-[500px] z-0 transform -translate-x-1/2 -translate-y-1/2 dark:opacity-10"></div>
</div>
	<div class="relative z-10">
		<div
			class="rounded-t-xl border-b border-black/5 bg-almostwhite dark:bg-muted px-5 pb-3 pt-4 shadow-2xl shadow-black/10"
		>
			<h2 class="text-md mb-2 font-bold">
				{m.page_dashboard_fights_tableCaption()}
			</h2>
			<div class="flex items-center text-2xs">
				<div class="w-1/6">
					{m.page_dashboard_fights_table_round()}
				</div>
				<div class="w-1/3">
					{m.page_dashboard_fights_table_partner()}
				</div>
				<div class="w-1/4">
					{m.page_dashboard_fights_table_date()}
				</div>
				<div class="w-1/6">
					{m.page_dashboard_fights_table_opened()}
				</div>
				<div class="w-1/6"></div>
			</div>
		</div>
		<div class="rounded-b-xl bg-almostwhite dark:bg-muted px-4 pb-3 pt-2 shadow-2xl shadow-black/10">
			{#each records as record}
				<button onclick={gotoFight(record.id)} class="group w-full text-left flex items-center border-b border-black/5 py-2 sm:py-3 text-xs last:border-b-0">
					<div class="flex w-1/6">
						<div class="scale-75 transform rounded-full bg-black/5 px-2.5 text-2xs font-bold">
							{record.responses?.length + 1}
						</div>
					</div>
					<div class="w-1/3 overflow-hidden mr-2 whitespace-nowrap">
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
							<Check class="w-3 h-3 text-black dark:text-neon" />
							{:else}
							<X class="w-3 h-3 text-black dark:text-neon" />
						{/if}
					</div>
					<div class="w-1/6 flex justify-end">
						<div class="skeumorphic-button rounded-full p-0.5">
							<ChevronRight class="h-4 w-4 rounded-full group-hover:bg-neutral-300 group-hover:text-black" />
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