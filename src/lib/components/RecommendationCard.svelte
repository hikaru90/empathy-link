<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	interface Recommendation {
		slug: string;
		title: string;
		category: string;
	}

	interface Props {
		recommendations: Recommendation[];
	}

	let { recommendations }: Props = $props();

	let isOpen = $state(false);
</script>


<div class="mb-4 flex flex-col gap-2">
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		class="flex w-full items-center justify-between rounded-full bg-bullshift py-1 pl-1 pr-3 text-xs font-medium"
	>
		<div class="flex items-center gap-2">
			<div class="flex size-6 items-center justify-center rounded-full bg-white/20">
				{recommendations.length}
			</div>
			Passende Lerninhalte
		</div>
		<ChevronDown class="size-4 opacity-60 transition duration-300 {isOpen ? 'rotate-180' : ''}" />
	</button>
	{#if isOpen}
	{#each recommendations as recommendation}
		<div
			class="rounded-lg border border-bullshift bg-bullshift/20 p-3 transition-colors"
		>
			<a href="/bullshift/learn/{recommendation.slug}" class="block">
				<div class="mb-1 text-sm font-medium text-black">
					{recommendation.title.split('||')[0]}
					<span class="text-black">
						{recommendation.title.split('||')[1]}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="rounded-full bg-bullshift px-2 py-1 text-xs text-black"
						>{recommendation.category}</span
					>
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium text-blue-700">→</span>
					</div>
				</div>
			</a>
			</div>
		{/each}
	{/if}
</div>
