<script lang="ts">
	import type { ContentBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	const { onSelectType }: { onSelectType: (blockType: ContentBlock['type']) => void } = $props();

	let isOpen = $state(false);

	const blockTypes = [
		{ type: 'text' as const, label: 'Text' },
		{ type: 'list' as const, label: 'List' },
		{ type: 'task' as const, label: 'Task' },
		{ type: 'timer' as const, label: 'Timer' },
		{ type: 'breathe' as const, label: 'Breathe' },
		{ type: 'image' as const, label: 'Image' },
		{ type: 'audio' as const, label: 'Audio' },
		{ type: 'bodymap' as const, label: 'Bodymap' },
		{ type: 'taskCompletion' as const, label: 'Task Completion' },
		{ type: 'sortable' as const, label: 'Sortable' },
		{ type: 'multipleChoice' as const, label: 'Multiple Choice' },
		{ type: 'aiQuestion' as const, label: 'AI Question' },
		{ type: 'nextPage' as const, label: 'Next Button' },
		{ type: 'pageNavigation' as const, label: 'Page Navigation' }
	];
</script>

<div class="flex items-center justify-between">
	<h2 class="text-lg font-semibold">Content Blocks</h2>
	<div class="flex items-center gap-2">
		<div class="w-full overflow-hidden rounded-md border border-blue-500">
			<button
				type="button"
				class="flex w-full items-center justify-between bg-blue-500 px-4 py-2 text-left text-sm font-medium text-white"
				onclick={() => (isOpen = !isOpen)}
			>
				<span>+ Add Block</span>
				<ChevronDown
					class="size-4 transform transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
				/>
			</button>
		</div>
	</div>
</div>
{#if isOpen}
	<div class="flex flex-wrap p-2 -m-0.5">
		{#each blockTypes as blockType}
		<div class="w-1/4 flex p-0.5">
			<button
			type="button"
			onclick={() => onSelectType(blockType.type)}
			class="flex-grow flex flex-col items-center rounded bg-offwhite px-1 py-0.5 text-xs hover:bg-black/10"
			>
			<img src={`/blocks/${blockType.type}.svg`} alt={blockType.label} class="size-10" />
			<span class="mb-1">
				{blockType.label}
			</span>
		</button>
	</div>
		{/each}
	</div>
{/if}
