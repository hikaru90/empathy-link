<script lang="ts">
	import { daysAgo } from '$scripts/helpers';
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import { t, locale } from '$lib/translations';
	import { pb } from '$scripts/pocketbase';
	import { onMount, onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import Share from '$lib/components/Share.svelte';

	import FightDisplay from '$lib/components/FightDisplay.svelte';
	import { page } from '$app/stores';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Trash from 'lucide-svelte/icons/trash'
	import Check from 'lucide-svelte/icons/check'
	import { goto } from '$app/navigation';
	import { backgroundColor } from '$store/page';

	let initialized = false;
	let pending = true;
	let record = undefined;
	let responses = [];
	let confirmDeletion = false;

	$: id = $page.params.id;
	$: daysAgoIntl = () => {
		if (!initialized) return '...';
		return daysAgo(record.created);
	};

	const fetchData = async () => {
		pb.collection('fights').subscribe(
			id,
			function (e) {
				record = e.record;
			},
			{ expand: 'feelings, needs, owner' }
		);

		record = await pb.collection('fights').getOne(id, {
			expand: 'feelings, needs, owner'
		});

		pb.collection('responses').subscribe(
			'*',
			function (e) {
				if (e.action === 'create' && e.record.fight === record.id) {
					const newRecord = e.record;
					responses = [...responses, newRecord];
				}
			},
			{
				expand: 'fight, feelings, needs'
			}
		);

		responses = await pb.collection('responses').getFullList({
			filter: `fight = '${record.id}'`,
			expand: 'fight, feelings, needs'
		});
	};

	const deleteFight = async () => {
		try {
			await pb.collection('fights').delete(id);
			confirmDeletion = false;
			goto('/app/auth/login');
		} catch (err) {
			console.error('error deleting fight');
		}
	};

	onMount(async () => {
		await fetchData();
		initialized = true;
		pending = false;
		backgroundColor.set('bg-background');

		console.log('record', record);
		console.log('responses', responses);
	});

	onDestroy(() => {
		pb.collection('responses').unsubscribe('*');
	});
</script>

{#if !initialized}
	<div class="flex h-full items-center justify-center">
		<Skeleton class="h-[20px] w-[100px] rounded-full" />
	</div>
{:else}
	<div class="overflow-hidden">
		<div class="">
			<AppTopMenu />

				<div class="{record.resolved ? 'max-h-40 px-2 py-2 opacity-100' : 'max-h-0 opacity-0'} -mt-0.5 bg-green-600 flex items-center justify-center  text-white transition-all text-sm">
					{$t('default.page.fight.resolved')}
				</div>

			<div class="max-container">
				<div
					class="relative z-10 -mx-5 flex flex-row items-center justify-between gap-3 px-5 py-4 md:items-center md:bg-transparent md:pb-6"
				>
					<h1 class="font-heading flex-grow text-lg font-semibold">
						{$t('default.page.fight.heading')}
						{$locale === 'en' ? 'with' : 'mit'}
						<span class="capitalize">
							{record.name}
						</span>
					</h1>
					<div class="flex flex-shrink-0 flex-col">
						<div
							class="mb-0.5 rounded-full bg-neutral-600 py-0.5 text-center text-2xs text-neutral-300"
						>
							{daysAgoIntl(record.created)}
						</div>

						<div class="text-xs">
							{$locale === 'en' ? 'on the' : 'am'}
							{new Intl.DateTimeFormat('de-DE').format(new Date(record.created))}
						</div>
					</div>

					{#if !confirmDeletion}
						<Button
							on:click={() => (confirmDeletion = true)}
							decoration="floating-op1"
							class="-mr-2 -mt-2 flex items-center justify-center border-red-400 bg-red-600 px-1.5 text-sm text-white transition hover:bg-offwhite"
						>
							<Trash />
						</Button>
					{:else}
						<Button
							on:click={deleteFight}
							decoration="floating-op1"
							class="-mr-2 -mt-2 flex items-center justify-center border-red-400 bg-red-600 px-1.5 text-sm text-white transition hover:bg-offwhite"
						>
							<Check />
						</Button>
					{/if}
				</div>
			</div>

			<div class="max-container relative pb-60 pt-10 md:bg-transparent">
				<div class="relative z-0">
					<div
						style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);"
						class="absolute left-0 top-20 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform opacity-10"
					></div>
				</div>
				<div class="relative z-10">
					<!-- <FightOwnerDisplay {record} /> -->
					<FightDisplay {record} />
				</div>
				{#each responses as response}
					<div class="relative z-0">
						<div
							style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);"
							class="absolute left-96 top-20 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform opacity-10"
						></div>
					</div>
					<div class="relative z-10 mt-8">
						<!-- <FightOwnerDisplay record={response} adversary={record.name} /> -->
						<FightDisplay fight={record} record={response} adversary={record.name} />
					</div>
				{/each}
			</div>

			<AppBottomMenu>
				<div class="flex items-center justify-between gap-3">
					<Share {id} {record} />
				</div>
			</AppBottomMenu>
		</div>
	</div>
{/if}