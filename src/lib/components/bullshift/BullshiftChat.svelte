<script lang="ts">
	import { marked } from 'marked';
	import { formatTimestamp } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import type { ChatRecord } from '$routes/api/ai/bullshift/initChat/+server';
	import { user } from '$store/auth';
	import { SendHorizontal, RotateCcw } from 'lucide-svelte/icons';

	export let chatId: string;
	export let history: any[] = [];

	let userMessage = '';
	let isLoading = false;
	let chatContainer: HTMLDivElement;

	const handleSendMessage = async () => {
		if (!userMessage.trim()) return;
		isLoading = true;
		try {
			const response = await fetch('/api/ai/bullshift/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ chatId, message: userMessage })
			});
			const data = await response.json();
			if (data.error) throw new Error(data.error);
			history = [...history, 
				{ role: 'user', parts: [{ text: userMessage }], timestamp: Date.now() },
				{ role: 'model', parts: [{ text: data.response }], timestamp: data.timestamp }
			];
			userMessage = '';
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			isLoading = false;
			scrollDown()
		}
	};

	const scrollDown = () => {
		window.scroll({
			top:document.body.scrollHeight,
			left:0,
			behavior: 'smooth'
		});
	};

	const clearChat = () => {
		console.log('clearChat');
	}

	onMount(async () => {
		// scrollToBottom();
			scrollDown()
	});

</script>

<div class="flex justify-end">
	<button
		on:click={clearChat}
		class="flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs text-black"
	>
		Neuer Chat
		<RotateCcw class="size-3 text-red-500" />
	</button>
</div>
{#if chatId}
	<div class="">
		<div bind:this={chatContainer} class="rounded-lg px-4 pb-36 pt-4 ">
			{#each history as message}
				<!-- {JSON.stringify(message)} -->
				<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
					<div
						class="inline-block rounded-lg p-3 {message.role === 'user'
							? 'bg-blue-100'
							: 'bg-gray-100'}"
					>
						<div class="text-sm">
							{@html marked(
								message.role === 'user' ? message.parts[0].text : message.parts[0].text
							)}
						</div>
						<div class="mt-1 text-xs text-gray-500">{formatTimestamp(message.timestamp)}</div>
					</div>
				</div>
			{/each}
			{#if isLoading}
				<div class="text-center text-gray-500">Thinking...</div>
			{/if}
		</div>

		<div class="fixed bottom-16 left-0 right-0 bg-background px-4 pb-6 pt-4">
			<form on:submit|preventDefault={handleSendMessage} class="flex gap-4">
				<input
					type="text"
					bind:value={userMessage}
					placeholder="Deine Nachricht..."
					class="flex-grow rounded-full border px-4 py-2"
				/>
				<button
					type="submit"
					disabled={isLoading}
					class="-m-1 flex size-12 items-center justify-center rounded-full bg-bullshift text-white disabled:opacity-50"
				>
					<SendHorizontal class="" />
				</button>
			</form>
		</div>
	</div>
{/if}
