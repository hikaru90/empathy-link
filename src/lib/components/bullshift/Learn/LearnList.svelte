<script lang="ts">
	import { marked } from 'marked';

	interface Props {
		content: object;
		currentCategory: object;
	}

	let { content, currentCategory }: Props = $props();
</script>

{#each content.items as item, index}
	<div class="mb-3 flex gap-2 rounded-xl bg-white/20 pl-2 py-3 pr-6">
		<div
			style="background-color: {currentCategory.color};"
			class="flex mt-1 ml-1 size-4 flex-shrink-0 items-center justify-center rounded-full text-xs text-white"
		>
			{index + 1}
		</div>
		<div>
			{@html marked(item, { breaks: true })}
		</div>
	</div>
{/each}
