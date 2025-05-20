<script lang="ts">
  import { marked } from 'marked';
  
	interface Props {
		content: object;
		color: string;
	}

	let { content, color }: Props = $props();

	const durationString = $derived(content.duration > 60 ? `${content.duration / 60} min` : `${content.duration} s`);
</script>

<div class="rounded-xl bg-white/20 px-3 py-4 mb-4">
	<div class="flex items-center text-xs rounded-full mb-4">
		<div class="py-0.5 flex-shrink-0 flex-grow">
			Aufgabenstellung
		</div>
		<!-- <div class="flex-grow h-[1px] w-auto bg-black/80 mx-2">
		</div> -->
		<div class="bg-white px-2 py-0.5 rounded-full flex-shrink-0">
			Dauer: {durationString}
		</div>
	</div>
  {@html marked(content.content)}
</div>
