<script lang="ts">
	import { messages, formatTimestamp, clearChatHistory, userId } from '$store/chatStore';
	import { onMount } from 'svelte';

	let userMessage = '';
	let isLoading = false;
	let chatContainer: HTMLDivElement; // Reference to the chat container

	// Function to scroll to bottom
	const scrollToBottom = () => {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	};

	// Subscribe to messages store to scroll on new messages
	$: if ($messages) {
		// Use setTimeout to ensure DOM is updated
		setTimeout(scrollToBottom, 0);
	}

	async function handleSendMessage() {
		if (!userMessage.trim()) return;

		isLoading = true;
		messages.addMessage('user', userMessage);
		const messageToSend = userMessage;
		userMessage = ''; // Clear input

		try {
			const response = await fetch('/api/ai/selfempathyChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					message: messageToSend,
					history: $messages
				})
			});

			const data = await response.json();
			if (data.error) throw new Error(data.error);

			messages.addMessage('assistant', data.response);
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			isLoading = false;
		}
	}

	// Scroll to bottom on initial load
	onMount(() => {
		scrollToBottom();
	});
</script>

<button
	on:click={() => clearChatHistory(messages, userId)}
>
	x clear history
</button>
<div
	class="relative flex h-full flex-col overflow-hidden rounded-lg border-b border-white/80 bg-[rgba(0,0,0,0.03)]"
>
	<div
		bind:this={chatContainer}
		class="chat-shadow h-full flex-grow overflow-y-auto scroll-smooth rounded-lg p-4"
	>
		{#each $messages as message}
			<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
				<div
					class="inline-block rounded-lg p-3 {message.role === 'user'
						? 'bg-blue-100'
						: 'bg-gray-100'}"
				>
					<div class="text-sm">{message.content}</div>
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
