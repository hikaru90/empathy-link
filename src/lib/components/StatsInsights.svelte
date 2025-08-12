<script lang="ts">
	import { pb } from '$scripts/pocketbase';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	import StatsFeelings from '$src/lib/components/StatsFeelings.svelte';
	import StatsNeeds from '$src/lib/components/StatsNeeds.svelte';
	import StatsChatOverview from './StatsChatOverview.svelte';
	import Check from 'lucide-svelte/icons/check';
	import { invalidateAll } from '$app/navigation';
	import Trash from 'lucide-svelte/icons/trash';
	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let selectedMemories = $state([]);
	const communicationInsights = $derived(
		data.filter((memory: any) => memory.type === 'relationship')
	);

	const selectChat = (id: string) => {
		if (selectedMemories.includes(id)) {
			selectedMemories = selectedMemories.filter((chat) => chat !== id);
		} else {
			selectedMemories = [...selectedMemories, id];
		}
		console.log('selectedMemories', selectedMemories);
	};

	const deleteMemories = async () => {
		await Promise.all(selectedMemories.map((id) => pb.collection('memories').delete(id)));
		invalidateAll();
		selectedMemories = [];
	};
</script>

<div class="mb-2 flex h-8 items-center justify-end">
	{#if selectedMemories.length > 0}
		<button
			onclick={deleteMemories}
			class="flex items-center gap-2 rounded-full bg-red-500 py-1 pl-4 pr-2 text-sm text-white"
		>
			löschen <Trash class="size-4" />
		</button>
	{/if}
</div>

<div class="mb-16 flex flex-col">
	{#each communicationInsights as memory}
		<div
			class="flex items-stretch gap-2 rounded-[22px] border-b border-neutral-500/5 bg-offwhite px-2 last:border-b-0"
		>
			<button
				onclick={() => selectChat(memory.id)}
				class="border-r border-neutral-500/5 py-2 pr-1 flex items-start"
				aria-label="Select chat"
			>
				<div
					class="mt-[2px] flex size-5 flex-shrink-0 items-center justify-center rounded-full border border-black/10 bg-white shadow-inner"
				>
					{#if selectedMemories.includes(memory.id)}
						<Check class="size-3" />
					{:else}
						<div class="size-3"></div>
					{/if}
				</div>
			</button>
			<div class="relative flex flex-col gap-2 py-2 w-full">
				<div class="absolute right-0 top-2 flex items-center gap-2 rounded-full bg-white px-2 py-1">
					<span class="text-xs text-neutral-500"> Gewissheit </span>
					{#if memory.confidence === 'certain'}
						<div class="flex gap-[1px]">
							<div class="h-3 w-2 rounded-md border-r border-black/5 bg-green-500"></div>
							<div class="h-3 w-2 rounded-md border-r border-black/5 bg-green-500"></div>
							<div class="h-3 w-2 rounded-md bg-green-500"></div>
						</div>
					{:else if memory.confidence === 'likely'}
						<div class="flex gap-[1px]">
							<div class="h-3 w-2 rounded-md border-r border-black/5 bg-blue-300"></div>
							<div class="h-3 w-2 rounded-md bg-blue-300"></div>
							<div class="h-3 w-2 rounded-md bg-neutral-100"></div>
						</div>
						{:else}
						<div class="flex gap-[1px]">
							<div class="h-3 w-2 rounded-md bg-orange-500"></div>
							<div class="h-3 w-2 rounded-md bg-neutral-100"></div>
							<div class="h-3 w-2 rounded-md bg-neutral-100"></div>
						</div>
					{/if}
				</div>
				<div class="max-w-[8em] mb-4 text-neutral-700 text-sm">
					{memory.key}
				</div>

				<div class="mb-2">
					{memory.value}
				</div>
			</div>
		</div>
	{/each}
</div>
