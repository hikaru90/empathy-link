<script lang="ts">
	import type { ContentBlock } from '$routes/bullshift/learn/[id]/edit/schema';

	const { onAddBlock }: { onAddBlock: (blockType: ContentBlock['type']) => void } = $props();

	const blockTypes = [
		{ type: 'text' as const, label: 'Text', color: 'blue' },
		{ type: 'heading' as const, label: 'Heading', color: 'purple' },
		{ type: 'list' as const, label: 'List', color: 'yellow' },
		{ type: 'task' as const, label: 'Task', color: 'green' },
		{ type: 'timer' as const, label: 'Timer', color: 'orange' },
		{ type: 'bodymap' as const, label: 'Bodymap', color: 'pink' }
	];
</script>

<div class="mb-4 flex flex-wrap gap-2">
	<span class="text-sm font-medium text-gray-600">Add Block:</span>
	{#each blockTypes as blockType}
		<button
			type="button"
			onclick={() => onAddBlock(blockType.type)}
			class="rounded bg-{blockType.color}-100 px-2 py-1 text-xs text-{blockType.color}-700 hover:bg-{blockType.color}-200"
		>
			{blockType.label}
		</button>
	{/each}
</div> 