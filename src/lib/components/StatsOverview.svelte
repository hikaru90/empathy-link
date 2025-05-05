<script lang="ts">
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	export let data;
</script>

<div class="flex items-center justify-between rounded-lg border-2 border-black/30 px-4 py-3">
	<div class="flex items-center gap-4">
		<div
			class="flex size-8 items-center justify-center rounded-full bg-offwhite text-xs font-bold text-black"
		>
			{data.memories?.length}
		</div>
		<h2 class="text-lg">Erinnerungen</h2>
	</div>
	<ChevronRight class="size-4" />
</div>

{#each data.analyses as analysis}
	<div class="flex flex-col">
		<h2 class="text-lg font-bold">{analysis.title}</h2>
		<p class="text-sm text-gray-500">{analysis.description}</p>
	</div>
{/each}
