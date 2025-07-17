<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { m } from '$lib/translations';
	import { Button } from '$lib/components/ui/button';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';

	interface Props {
		currentCategory: any;
		topic: any;
		gotoNextStep?: () => void;
	}

	let { currentCategory, topic, gotoNextStep, isCompleted }: Props = $props();
</script>

<div
	style="background-color: {currentCategory?.color || '#ccc'}"
	class="relative flex h-full w-full flex-grow flex-col items-start justify-between overflow-hidden rounded-lg p-6"
>
	<h1 class="relative z-10 text-xl font-light text-black">
		<div class="mb-1">{topic?.titleDE?.split('||')[0] || 'Loading...'}</div>
		<div class="font-bold">{topic?.titleDE?.split('||')[1] || ''}</div>
	</h1>

	<LearnGotoNextButton
		onClick={() => {
			gotoNextStep?.();
		}}
	>
		Starten
	</LearnGotoNextButton>

	{#if topic?.image && topic?.collectionId && topic?.id}
		<img
			src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic.collectionId}/${topic.id}/${topic.image}`}
			alt={`background ${topic.titleDE || 'topic'}`}
			class="absolute right-0 top-1/2 -z-0 -mr-10 w-2/3 -translate-y-1/2 rotate-12 transform opacity-30"
		/>
	{/if}
</div>
