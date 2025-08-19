<script lang="ts">
	import { marked } from 'marked';
	import LearnGotoNextButton from './LearnGotoNextButton.svelte';
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
		gotoNextStep: () => void;
		gotoPrevStep?: () => void;
	}

	let { content, currentCategory, gotoNextStep, gotoPrevStep }: Props = $props();
</script>

<div class="flex flex-col justify-between gap-2 mb-6 relative z-0 h-full">
		<div class="flex-grow flex flex-col justify-center gap-2">
			{#each content.items as item, index}
			<div class="flex flex-col gap-2 rounded-xl bg-white/80 border border-white shadow-lg shadow-black/5 p-3 relative z-10">
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

	<LearnGotoNextButton
		onClick={() => {
			if (gotoNextStep) {
				gotoNextStep();
			}
		}}
		onPrev={() => {
			gotoPrevStep?.();
		}}
		displayBackButton={true}
	>
		Weiter
	</LearnGotoNextButton>
</div>
