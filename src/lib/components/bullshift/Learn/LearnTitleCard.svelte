<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { m } from '$lib/translations';
	import { getLearningContext } from '$lib/contexts/learningContext';
	import { Button } from '$lib/components/ui/button';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
  
	interface Props {
		currentCategory: { color?: string };
		topic: { 
			titleDE?: string; 
			image?: string; 
			collectionId?: string; 
			id?: string;
		};
	}

	let { currentCategory, topic }: Props = $props();
	
	const learningContext = getLearningContext();
	
	const handleStart = () => {
		learningContext?.gotoNextPage();
	};
</script>

<div
	style="background-color: {currentCategory?.color || '#ccc'}"
	class="relative mb-10 overflow-hidden rounded-lg p-6"
>
	<h1 class="relative z-10 text-xl font-light text-white">
		<div class="mb-10">{topic?.titleDE?.split('||')[0] || 'Loading...'}</div>
		<div class="font-bold">{topic?.titleDE?.split('||')[1] || ''}</div>
	</h1>
	
	<div class="relative z-10 mt-6">
		<Button
			onclick={handleStart}
			class="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-3 rounded-lg flex items-center gap-2"
		>
			Starten
			<ArrowRight class="w-4 h-4" />
		</Button>
	</div>
	
	{#if topic?.image && topic?.collectionId && topic?.id}
		<img
			src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic.collectionId}/${topic.id}/${topic.image}`}
			alt={`background ${topic.titleDE || 'topic'}`}
			class="absolute right-0 top-1/2 -z-0 -mr-10 w-2/3 -translate-y-1/2 rotate-12 transform opacity-30"
		/>
	{/if}
</div>
