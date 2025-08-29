<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import StatsOverview from '$lib/components/StatsOverview.svelte';
	import type { PageData } from './$types';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Check from 'lucide-svelte/icons/check';
	import Trash from 'lucide-svelte/icons/trash';
	import { pb } from '$scripts/pocketbase';
	import { invalidateAll } from '$app/navigation';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const menu = [
		{
			label: 'Übersicht',
			slug: 'overview'
		},
		{
			label: 'Kommunikationsstil',
			slug: 'memory'
		},
		{
			label: 'Beziehungen',
			slug: 'insights'
		}
	];

	let selectedChats: string[] | [] = $state([]);
	let confirmDelete = $state(false);

	const selectChat = (id: string) => {
		if (selectedChats.includes(id)) {
			selectedChats = selectedChats.filter((chat) => chat !== id);
		} else {
			selectedChats = [...selectedChats, id];
		}
		console.log('selectedChats', selectedChats);
	}

	const deleteChats = async () => {
		await Promise.all(selectedChats.map(id => pb.collection('analyses').delete(id)));
		invalidateAll();
		selectedChats = [];
	}
</script>

<div class="mt-1px pt-16">
	<Header user={data.user} />
	<div class="flex h-full w-full flex-col overflow-hidden">
		{#if data.error}
			<p class="text-red-500">{data.error}</p>
		{:else}
			<div class="max-container pb-16">
				<div class="flex justify-between items-center">
					<a
					href="/bullshift/stats"
					class="flex items-center gap-2 rounded-full border border-black/10 py-1 pl-2 pr-4 text-sm"
					>
					<ChevronLeft class="size-4" /> zurück
				</a>
				{#if selectedChats.length > 0}
					<button onclick={deleteChats} class="rounded-full bg-red-500 text-white py-1 pl-4 pr-2 text-sm flex items-center gap-2">
						löschen <Trash class="size-4" />
					</button>
				{/if}
			</div>
				<div class="mt-6 rounded-b-xl pb-3 pr-2 pt-2 flex flex-col">
					{#each data.analyses as record, index}
						<div class="flex items-center gap-2 border-b border-neutral-500/5 px-2 last:border-b-0 bg-offwhite rounded-full relative">
								<button 
								onclick={() => selectChat(record.id)} 
								class="border-r border-neutral-500/5 py-2 pr-1"
								aria-label="Select chat"
								>
								<div class="size-5 rounded-full border border-black/10 flex items-center justify-center flex-shrink-0 bg-white shadow-inner">
									{#if selectedChats.includes(record.id)}
									<Check class="size-3" />
									{:else}
									<div class="size-3"></div>
									{/if}
								</div>
							</button>
							<a
								href={`/bullshift/stats/chats/${record.id}`}
								class="group flex items-center text-left text-xs relative w-full"
							>
								<div class="w-1/6 flex-shrink-0">
									{new Intl.DateTimeFormat('de-DE', {
										month: 'short',
										day: 'numeric'
										// year: 'numeric',
									}).format(new Date(record.created))}
								</div>
								<div class="w-4 mr-2 overflow-hidden whitespace-nowrap flex-grow">
									{record.title}
								</div>
								<div class="flex justify-end">
									<div
										class="skeumorphic-button flex size-5 items-center justify-center rounded-full group-hover:bg-white group-hover:text-black"
									>
										<ChevronRight class="size-3 rounded-full" />
									</div>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<Footer user={data.user} />
</div>
