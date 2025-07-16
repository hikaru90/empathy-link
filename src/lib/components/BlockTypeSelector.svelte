<script lang="ts">
	import type { ContentBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	const { onAddBlock }: { onAddBlock: (blockType: ContentBlock['type']) => void } = $props();

	let isOpen = $state(false);

	const blockTypes = [
		{ type: 'text' as const, label: 'Text' },
		{ type: 'heading' as const, label: 'Heading' },
		{ type: 'list' as const, label: 'List' },
		{ type: 'task' as const, label: 'Task' },
		{ type: 'timer' as const, label: 'Timer' },
		{ type: 'image' as const, label: 'Image' },
		{ type: 'audio' as const, label: 'Audio' },
		{ type: 'bodymap' as const, label: 'Bodymap' },
		{ type: 'taskCompletion' as const, label: 'Task Completion' },
		{ type: 'sortable' as const, label: 'Sortable' },
		{ type: 'multipleChoice' as const, label: 'Multiple Choice' },
		{ type: 'aiQuestion' as const, label: 'AI Question' },
		{ type: 'aiQuestionStep' as const, label: 'AI Question Step' },
		{ type: 'aiResponseStep' as const, label: 'AI Response Step' },
		{ type: 'nextPage' as const, label: 'Next Button' },
		{ type: 'pageNavigation' as const, label: 'Page Navigation' }
	];
</script>

<div
	class="w-full overflow-hidden rounded-md border border-blue-500"
>
	<button
		type="button"
		class="w-full bg-blue-500 px-4 py-2 text-left text-sm font-medium text-white flex items-center justify-between"
		onclick={() => (isOpen = !isOpen)}
	>
		<span>+ Add Block</span>
		<ChevronDown
			class="size-4 transform transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
		/>
	</button>
	{#if isOpen}
		<div class="flex flex-wrap gap-2 p-2">
			{#each blockTypes as blockType}
				<button
					type="button"
					onclick={() => onAddBlock(blockType.type)}
					class="flex w-32 flex-col items-center rounded bg-offwhite px-2 py-1 text-xs hover:bg-black/10"
				>
					<img src={`/blocks/${blockType.type}.svg`} alt={blockType.label} class="size-10" />
					<span class="mb-2">
						{blockType.label}
					</span>
				</button>
			{/each}
		</div>
	{/if}
</div>
