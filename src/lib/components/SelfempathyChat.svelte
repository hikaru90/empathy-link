<script lang="ts">
	import { marked } from "marked";
	import { initChat } from '$store/chatStore';
	import { formatTimestamp } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase'
	import type { ChatRecord } from '$routes/api/ai/selfempathy/initChat/+server';
	import { user } from '$store/auth';
	let userMessage = '';
	let isLoading = false;
	let chatContainer: HTMLDivElement; // Reference to the chat container
	let chat:ChatRecord;

	$: chatWithoutFirstMessage = chat?.history ? chat.history.slice(1) : [];

	// Function to scroll to bottom
	const scrollToBottom = () => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	};

	async function handleSendMessage() {
		if (!userMessage.trim()) return;

		isLoading = true;
		const messageToSend = userMessage;
		userMessage = ''; // Clear input

		try {
			console.log('sendMessage with history',chat.history);
			const response = await fetch('/api/ai/selfempathy/sendMessage', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: messageToSend,
					history: chat.history,
					chatId: chat.id
				})
			});

			const data = await response.json();
			if (data.error) throw new Error(data.error);
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			isLoading = false;
		}
	}

	// Scroll to bottom on initial load
	onMount(async () => {
		scrollToBottom();
		chat = await initChat();

		pb.collection('chats').subscribe(
			chat.id,
			function (e) {
				// if (e.action === 'create' && e.record.fight === record.id) {
					const newRecord = e.record;
					chat = newRecord;
				// }
			}
			// ,
			// {
			// 	expand: 'fight, feelings, needs'
			// }
		);

		console.log('chat',chat);
	});

	onDestroy(async() => {
		await pb.collection('chats').unsubscribe(chat.id);
	});
</script>

{#if chat}
<div
	class="relative flex h-full flex-col overflow-hidden rounded-lg border-b border-white/80 bg-[rgba(0,0,0,0.03)]"
>
	<div
		bind:this={chatContainer}
		class="chat-shadow h-full flex-grow overflow-y-auto scroll-smooth rounded-lg p-4"
	>
		{#each chatWithoutFirstMessage as message}
		<!-- {JSON.stringify(message)} -->
		<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
			<div
				class="inline-block rounded-lg p-3 {message.role === 'user'
					? 'bg-blue-100'
					: 'bg-gray-100'}"
			>

			
				<div class="text-sm">{@html marked(message.role === 'user' ? message.parts[0].text : JSON.parse(message.parts[0].text).text)}</div>
				<div class="mt-1 text-xs text-gray-500">{formatTimestamp(message.timestamp)}</div>
			</div>
		</div>
			
		{/each}
		{#if isLoading}
			<div class="text-center text-gray-500">Thinking...</div>
		{/if}
	</div>

	<div class="border-t p-4">
		<form on:submit|preventDefault={handleSendMessage} class="flex gap-2">
			<input
				type="text"
				bind:value={userMessage}
				placeholder="Type your message..."
				class="flex-grow rounded-lg border p-2"
			/>
			<button
				type="submit"
				disabled={isLoading}
				class="rounded-lg bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
			>
				Send
			</button>
		</form>
	</div>
</div>
{/if}
