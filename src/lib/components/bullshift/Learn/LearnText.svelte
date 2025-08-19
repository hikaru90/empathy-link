<script lang="ts">
	import { marked } from 'marked';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import MessageSquareQuote from 'lucide-svelte/icons/message-square-quote';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	interface Props {
		content: any;
		gotoNextStep?: () => void;
		gotoPrevStep?: () => void;
	}

	let { content, gotoNextStep, gotoPrevStep }: Props = $props();

	let sourcesVisible = $state(false);


</script>

<div class="mb-6 flex h-full flex-col">
	<div class="flex flex-grow flex-col items-center justify-center gap-2 text-left">
		<div class="relative max-w-[20em]">
			<p class="marked max-h-86 overflow-y-auto">
				{@html marked(content.content || '')}
			</p>
			{#if content.sources}
				{#if content.sources.length > 0}
					<div class="mt-3 flex">
						<div class="rounded-lg border border-black/5 p-1 transition-all {sourcesVisible ? 'max-h-[500px]' : 'max-h-10'}">
							<button
								class="flex items-center gap-2 rounded-md bg-black/10 px-2 py-1 text-xs text-gray-500"
								onclick={() => (sourcesVisible = !sourcesVisible)}
							>
								<MessageSquareQuote class="size-3" />
								<div class="">
									{content.sources.length}
								</div>
								<ChevronDown
									class="size-3 transition-transform {sourcesVisible ? 'rotate-180' : ''}"
								/>
							</button>
							{#if sourcesVisible}
								<div class="px-2 pb-1 pt-3">
									{#each content.sources as source, index}
										<div class="flex items-start justify-start text-xs text-gray-500">
											<div class="flex w-4 flex-shrink-0 flex-grow-0 items-center justify-center">
												{index + 1}
											</div>
											<div>
												{source.author}.
												{source.title}
												<a href={source.url} target="_blank" class="underline">[link]</a>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>

	<LearnGotoNextButton
		onClick={() => {
			gotoNextStep?.();
		}}
		onPrev={() => {
			gotoPrevStep?.();
		}}
		displayBackButton={true}
	>
		{content.ctaText || 'Weiter'}
	</LearnGotoNextButton>
</div>
