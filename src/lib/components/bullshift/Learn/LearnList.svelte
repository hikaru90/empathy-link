<script lang="ts">
	import { marked } from 'marked';

	interface Props {
		content: {
			items: {
				title: string;
				text: string;
			}[];
		};
		currentCategory: {
			color: string;
		};
	}

	let { content, currentCategory }: Props = $props();
</script>

<div class="flex flex-col gap-4 mb-6 relative">
	{#each content.items as item, index}
		<div class="flex flex-col gap-2 rounded-xl border border-white/20 shadow-lg shadow-black/5 p-3 relative z-10">
			<div class="flex gap-3 items-center">
				<div
					style="background-color: {currentCategory.color};"
					class="flex size-4 flex-shrink-0 items-center justify-center rounded-full text-2xs font-bold"
				>
					{index + 1}
				</div>
				{#if item.title}
					<div class="text-[0.95em] font-bold leading-tight">
						{@html marked(item.title, { breaks: true })}
					</div>
				{/if}
			</div>
			<div>
				{#if item.text}
					<div class="pl-7 pr-1">
						{@html marked(item.text, { breaks: true })}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
