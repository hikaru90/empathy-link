<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t } from '$lib/translations';
	import { endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import Check from 'lucide-svelte/icons/check'
	import X from 'lucide-svelte/icons/x'
	import { delay } from '$scripts/helpers';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label/index.js';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';

	interface Props {
		user: App.User;
		class?: string | undefined;
	}

	let { user, class: className = undefined }: Props = $props();
	

	let initialized = $state(false);
	let pending = true;
	let records: object[] = $state([]);
	let page = 1;
	let endReached = false;
	let displayResolved = $state(true);

	let openedFights: string[] = [];

	const fetchData = async () => {
		try {
			pending = true;

      // load existing records from db
      const existingRecords = await pb.collection('fights').getFullList({
        filter: `opponent = '${user.id}'`,
        requestKey: 'existingRecords',
        expand: 'owner'
      });
      records = existingRecords;
      console.log('existingRecords', existingRecords.map((record) => record.id));
			




      // remove existing ids from openFights
			//["kucb0dqftelwkmn","cq5en7nds89tr5c","kehjsy88aqqa0cm"]
      openedFights = openedFights.filter((fightId) => !existingRecords.map((record) => record.id).includes(fightId));
      console.log('openedFights', openedFights);
			// all fight ids that are in localstorage but not in existingRecords

			const filterString = openedFights.map((fightId) => `owner != '${user.id}' && id = '${fightId}'`).join(' || ');
			console.log('filterString', filterString);

			if(filterString){
				//fetch the underlying fight
				const newRecords = await pb.collection('fights').getFullList({
					sort: '-created',
					filter: filterString,
					requestKey: 'receivedLinks',
					expand: 'owner'
				});
				// set the opponent of the new fights
				transferOpenedLinks(newRecords);
			}


			await delay(1000);
			records = [...records, ...newRecords];
      console.log('newRecords',newRecords);
			pending = false;
		} catch (error) {
			console.error('Error fetching receivedLinksdata', error);
		}
	};

	let filteredRecords = $derived(displayResolved ? records : records.filter((record) => !record.resolved));

  const transferOpenedLinks = (records) => {
      console.log('transferRecords', records);
			if (browser) {
				localStorage.removeItem('openedFights');
			}
      
      records.forEach(async (record) => {
        if(user.id === record.owner) return;
        await pb.collection('fights').update(record.id, { opponent: user.id });
        // Remove the openedFights entry from localStorage entirely
      })
  }


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
		goto(`/app/fights/${id}/respond`);
	};

	onMount(async () => {
		if (browser) {
			const storedFights = localStorage.getItem('openedFights');
			if (storedFights) {
				openedFights = JSON.parse(storedFights);
			}
		}

		await fetchData();
		initialized = true;

	});
</script>

<div class={cn(className, '')}>
	{#if !initialized}
		<Skeleton class="h-[20px] w-[100px] rounded-full" />
	{:else}
		<div class="relative z-0">
			<div
				style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);"
				class="absolute right-0 top-20 z-0 h-[500px] w-[500px] translate-x-1/2 -translate-y-1/2 transform dark:opacity-10"
			></div>
		</div>
		<div class="relative z-10 shadow-2xl shadow-black/10">
			<div
				class="rounded-t-xl border-b border-black/5 bg-white/30 dark:bg-neutral-900 px-5 pb-3 pt-4 "
			>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-md font-bold">
						{$t('default.page.fights.receivedLinks.heading')}
					</h2>
					<div class="flex items-center gap-1">
						<Switch
							id="lightMode"
							bind:checked={displayResolved}
							onclick={() => (displayResolved = !displayResolved)}
							class="scale-75 transform bg-gray-500"
						/>
						<Label for="lightMode" class="cursor-pointer"
							>{$t('default.page.fights.displayResolved')}</Label
						>
					</div>
				</div>
				<div class="flex items-center text-2xs text-neutral-400">
					<div class="w-1/6">
						{$t('default.page.dashboard.fights.table.resolved')}
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
			<div
				class="rounded-b-xl bg-white/30 dark:bg-neutral-900 px-4 pb-3 pt-2 shadow-2xl shadow-black/10"
			>
				<div>
					{#each filteredRecords as record}
						<button
							onclick={gotoFight(record.id)}
							class="group flex w-full items-center border-b border-black/5 py-2 text-left text-xs last:border-b-0 sm:py-3"
						>
							<div class="flex w-1/6">
								{#if record.resolved}
									<div class="rounded-full p-1 text-2xs text-green-600/80">
										<Check class="size-3" />
									</div>
								{:else}
									<div class="rounded-full p-1 text-2xs text-red-600/80">
										<X class="size-3" />
									</div>
								{/if}
							</div>
							<div class="input-fade-right mr-2 w-1/3 overflow-hidden whitespace-nowrap">
								{record.expand.owner.firstName}
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
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
