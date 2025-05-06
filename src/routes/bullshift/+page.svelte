<script lang="ts">
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import BullshiftChat from '$lib/components/bullshift/BullshiftChat.svelte';
	import type { PageData } from './$types';
	import { onDestroy } from 'svelte';

	export let data: PageData;

	// Cleanup function
	onDestroy(async () => {
		if (data.chatId) {
			try {
				// Make a request to cleanup endpoint
				await fetch('/api/ai/bullshift/cleanup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						chatId: data.chatId
					})
				});
			} catch (error) {
				console.error('Error cleaning up chat:', error);
			}
		}
	});
</script>

<div>
	<Header />
	<div class="max-container py-16">
		<div class="flex h-full w-full flex-col">
			{#if data.error}
				<p class="text-red-500">{data.error}</p>
			{:else if data.chatId && data.systemPrompt}
				<BullshiftChat
					class="relative"
					chatId={data.chatId}
					history={data.history}
					systemInstruction={data.systemPrompt}
				/>
			{/if}
		</div>
	</div>
	<Footer />
</div>
