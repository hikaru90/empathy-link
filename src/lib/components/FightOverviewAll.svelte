<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { m } from '$lib/translations';
	import { endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import Check from 'lucide-svelte/icons/check'
	import X from 'lucide-svelte/icons/x'
	import Plus from 'lucide-svelte/icons/plus'
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { delay } from '$scripts/helpers';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label/index.js';

	interface Props {
		user: App.User;
	}

	let { user }: Props = $props();

	let initialized = $state(false);
	let pending = $state(true);
	let records: object[] = $state([]);
	let page = 1;
	const perPage = 5;
	let endReached = $state(false);
	let displayResolved = $state(true);

	const fetchData = async () => {
		pending = true;
		const newRecords = await pb.collection('fights').getList(page, perPage, {
			filter: `owner = '${user.id}'`,
			sort: '-updated',
			expand: 'responses'
		});
		if (newRecords.items.length === 0) endReached = true;
		await delay(1000);
		records = [...records, ...newRecords.items];
		pending = false;
	};

	let filteredRecords = $derived(displayResolved ? records : records.filter((record) => !record.resolved));

	endDate.subscribe(async () => {
		console.log('endDate changed -> fetching data');
		pending = true;
		await fetchData();
	});

	const loadMore = () => {
		page++;
		fetchData();
	};

	const gotoFight = (id) => {
		console.log('gotoFight');
		goto(`/app/fights/${id}`);
	};

	onMount(async () => {
		await fetchData();
		console.log('records', records);
		initialized = true;

		console.log('user', user);
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="relative z-0">
		<div
			style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);"
			class="absolute left-0 top-20 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform dark:opacity-10"
		></div>
	</div>
	<div class="relative z-10">
		<div
			class="rounded-t-xl border-b border-black/5 bg-almostwhite px-5 pb-3 pt-4 shadow-2xl shadow-black/10 dark:bg-muted"
		>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-md font-bold">
					{m.page_fight_title()}
				</h2>
				<div class="flex items-center gap-1">
					<Switch
						id="lightMode"
						bind:checked={displayResolved}
						onclick={() => (displayResolved = !displayResolved)}
						class="bg-gray-500 transform scale-75"
						/>
						<Label for="lightMode" class="cursor-pointer">{m.page_fights_displayResolved()}</Label>
					</div>
			</div>
			<div class="flex items-center text-2xs text-neutral-400">
				<div class="w-1/6">
					{m.page_dashboard_fights_table_resolved()}
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
		<div
			class="rounded-b-xl bg-almostwhite px-4 pb-3 pt-2 shadow-2xl shadow-black/10 dark:bg-muted"
		>
			<div>
				{#each filteredRecords as record}
					<button
						onclick={gotoFight(record.id)}
						class="group flex w-full items-center border-b border-black/5 py-2 text-left text-xs last:border-b-0 sm:py-3"
					>
						<div class="flex w-1/6">
							{#if record.resolved}
								<div class="rounded-full text-green-600/80 p-1 text-2xs">
									<Check class="size-3" />
								</div>
								{:else}
								<div class="rounded-full text-red-600/80 p-1 text-2xs">
									<X class="size-3" />
								</div>
							{/if}
						</div>
						<div class="input-fade-right mr-2 w-1/3 overflow-hidden whitespace-nowrap">
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
								<X class="h-3 w-3 text-black" />
							{/if}
						</div>
						<div class="flex w-1/6 justify-end">
							<div class="skeumorphic-button rounded-full p-0.5">
								<ChevronRight
									class="h-4 w-4 rounded-full group-hover:bg-neutral-300 group-hover:text-black"
								/>
							</div>
						</div>
					</button>
				{/each}
			</div>
			{#if !endReached}
				<div class="mt-4 flex items-center justify-center">
					<Button
						decoration="floating-op1"
						noInnerShadow
						onclick={loadMore}
						class="gap-3 border-neutral-100 bg-almostwhite text-black hover:bg-almostwhite dark:border-neutral-800 dark:bg-muted dark:text-white"
					>
						<SparklePill
							fast={true}
							class="-ml-2 -mr-1 h-3 w-5 shadow-xl transition-all duration-500 dark:shadow-gray-200/30 {pending
								? 'max-h-4 max-w-10 opacity-100'
								: 'max-h-0 max-w-0 opacity-0'}"
						/>
						{m.page_fights_loadMore()}
						<Plus class="-mr-2 h-4 w-4" />
					</Button>
				</div>
			{:else}
				<div class="mt-6 flex items-center gap-2 text-2xs text-neutral-400">
					{m.page_dashboard_fights_endReached()}
					<div class="mt-0.5 flex-grow border-t border-black/5"></div>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
