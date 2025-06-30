<script lang="ts">
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { m } from '$lib/translations';
  
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
</script>

<div
	style="background-color: {currentCategory?.color || '#ccc'}"
	class="relative mb-10 overflow-hidden rounded-lg p-4"
>
	<h1 class="relative z-10 text-xl font-light">
		<div class="mb-10">{topic?.titleDE?.split('||')[0] || 'Loading...'}</div>
		<div class="font-bold">{topic?.titleDE?.split('||')[1] || ''}</div>
	</h1>
	{#if topic?.image && topic?.collectionId && topic?.id}
		<img
			src={`https://${PUBLIC_BACKEND_URL}/api/files/${topic.collectionId}/${topic.id}/${topic.image}`}
			alt={`background ${topic.titleDE || 'topic'}`}
			class="absolute right-0 top-1/2 -z-0 -mr-10 w-2/3 -translate-y-1/2 rotate-12 transform opacity-30"
		/>
	{/if}
</div>
