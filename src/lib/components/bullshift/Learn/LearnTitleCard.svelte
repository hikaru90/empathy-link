<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { m } from '$lib/translations';
	import { Button } from '$lib/components/ui/button';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	interface Props {
		currentCategory: any;
		topic: any;
		gotoNextStep?: () => void;
	}

	let { currentCategory, topic, gotoNextStep }: Props = $props();
	
</script>

<div
	style="background-color: {currentCategory?.color || '#ccc'}"
	class="relative mb-10 overflow-hidden rounded-lg p-6 w-full h-full flex items-start justify-between flex-col"
>
	<h1 class="relative z-10 text-xl font-light text-white">
		<div class="mb-1">{topic?.titleDE?.split('||')[0] || 'Loading...'}</div>
		<div class="font-bold">{topic?.titleDE?.split('||')[1] || ''}</div>
	</h1>
	
		<Button
			onclick={gotoNextStep}
			class="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg flex items-center justify-between gap-2 w-full"
		>
			Starten
			<ArrowRight class="w-4 h-4" />
		</Button>
	
	{#if topic?.image && topic?.collectionId && topic?.id}
		<img
			src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic.collectionId}/${topic.id}/${topic.image}`}
			alt={`background ${topic.titleDE || 'topic'}`}
			class="absolute right-0 top-1/2 -z-0 -mr-10 w-2/3 -translate-y-1/2 rotate-12 transform opacity-30"
		/>
	{/if}
</div>
