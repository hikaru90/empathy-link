<script lang="ts">
  import { marked } from 'marked';
  import { Button } from '$lib/components/ui/button';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  
	interface Props {
		content: any;
		gotoNextStep?: () => void;
	}

	let { content, gotoNextStep }: Props = $props();
</script>

<div class="mb-6 flex flex-col h-full">
	<div class="flex-grow flex items-center justify-center">
		{@html marked(content.content || '')}
	</div>
	
	{#if gotoNextStep}
		<div class="mt-6">
			<Button
				onclick={gotoNextStep}
				class="bg-black text-white font-medium pl-6 pr-2 py-3 rounded-full flex items-center justify-between gap-2 w-full"
			>
				Weiter
				<div class="size-6 bg-white/20 rounded-full flex items-center justify-center">
					<ArrowRight class="w-4 h-4" />
				</div>
			</Button>
		</div>
	{/if}
</div>


