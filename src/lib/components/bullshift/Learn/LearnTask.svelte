<script lang="ts">
  import { marked } from 'marked';
  
	interface Props {
		content: {
			duration?: number;
			content: string;
		};
		color: string;
	}

	let { content, color }: Props = $props();

	const durationString = $derived(content.duration && content.duration > 60 ? `${content.duration / 60} min` : `${content.duration} s`);
</script>

<div class="rounded-xl bg-white/20 px-3 py-4 mb-4">
	<div class="flex items-center text-xs rounded-full mb-4">
		<div class="py-0.5 flex-shrink-0 flex-grow">
			Zeit zu üben
		</div>
		{#if content.duration !== undefined}
			<div class="bg-white px-2 py-0.5 rounded-full flex-shrink-0">
				Dauer: {durationString}
			</div>
		{/if}
	</div>
  {@html marked(content.content)}
</div>
