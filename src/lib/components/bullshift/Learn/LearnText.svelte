<script lang="ts">
	import { marked } from 'marked';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';

	interface Props {
		content: any;
		gotoNextStep?: () => void;
	}

	let { content, gotoNextStep }: Props = $props();
</script>

<div class="mb-6 flex h-full flex-col">
	<div class="flex flex-grow items-center justify-center">
		<div class="max-w-[20em] text-center">
			{@html marked(content.content || '')}
		</div>
	</div>

		<LearnGotoNextButton
			onClick={() => {
				gotoNextStep?.();
			}}
		>
			Weiter
		</LearnGotoNextButton>
</div>
