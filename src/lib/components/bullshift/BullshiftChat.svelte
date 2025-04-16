<script lang="ts">
	import { marked } from 'marked';
	import { formatTimestamp } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { user } from '$store/auth';
	import { locale } from '$lib/translations';
	import { SendHorizontal, RotateCcw } from 'lucide-svelte/icons';
	import { LoaderCircle } from 'lucide-svelte/icons';

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
			history = [
				...history,
				{ role: 'user', parts: [{ text: userMessage }], timestamp: Date.now() },
				{ role: 'model', parts: [{ text: data.response }], timestamp: data.timestamp }
			];
			userMessage = '';
		} catch (error) {
			console.error('Failed to send message:', error);
		} finally {
			isLoading = false;
			setTimeout(() => {
				scrollDown();
			}, 500);
		}
	};

	const scrollDown = () => {
		window.scroll({
			top: document.body.scrollHeight,
			left: 0,
			behavior: 'smooth'
		});
	};

	const clearChat = async () => {
		console.log('$user', $user);
		try {
			const response = await fetch('/api/ai/bullshift/initChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: $user, locale: $locale })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			if (data.error) throw new Error(data.error);

			// Update the chat ID and clear history
			chatId = data.chatId;
			history = [];
			userMessage = '';
		} catch (error) {
			console.error('Failed to clear chat:', error);
		}
	};

	onMount(async () => {
		// scrollToBottom();
		scrollDown();
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
		<div bind:this={chatContainer} class="rounded-lg pb-36 pt-4">
			<h1 class="mb-3 text-2xl font-light">
				Hi Alex, ich bin hier, um den ganzen Bullshit in deinem Leben zu durchbrechen.
			</h1>
			<h2 class="mb-6 text-2xl font-light text-black/40">
				Beschreib mir eine Situation, und ich helfe dir, sie zu verarbeiten. Vertrau mir – wir
				schaffen das gemeinsam!
			</h2>
			{#each history as message}
				<!-- {JSON.stringify(message)} -->
				<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
					<div
						class="inline-block rounded-xl px-3 py-2 {message.role === 'user'
							? 'border border-white'
							: 'bg-white'}"
					>
						<div class="text-sm">
							{@html marked(
								message.role === 'user' ? message.parts[0].text : JSON.parse(message.parts[0].text).response
							)}
						</div>
					</div>
				</div>
			{/each}
			{#if isLoading}
				<div class="flex items-center justify-center">
					<LoaderCircle class="size-6 animate-spin text-bullshift" />
				</div>
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
					class="-m-1 flex size-12 items-center justify-center rounded-full bg-bullshift text-black disabled:opacity-50"
				>
					<SendHorizontal class="" />
				</button>
			</form>
		</div>
	</div>
{/if}
