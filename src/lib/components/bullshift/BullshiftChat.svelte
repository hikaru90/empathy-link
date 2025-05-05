<script lang="ts">
	import { marked } from 'marked';
	import { formatTimestamp } from '$lib/utils';
	import { onDestroy, onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { user } from '$store/auth';
	import { locale } from '$lib/translations';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import X from 'lucide-svelte/icons/x';
	import Bug from 'lucide-svelte/icons/bug';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';

	export let chatId: string;
	export let history: any[] = [];
	export let systemInstruction: string;

	let userMessage = '';
	let isLoading = false;
	let chatContainer: HTMLDivElement;
	let chatTerminationModalVisible = false;

	const handleSendMessage = async () => {
		if (!userMessage.trim()) return;
		isLoading = true;
		try {
			const response = await fetch('/api/ai/bullshift/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chatId,
					message: userMessage,
					userId: $user!.id,
					systemInstruction,
					locale: $locale
				})
			});
			const data = await response.json();
			console.log('data from /send', data);
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

	const flushMemory = async () => {
		await fetch('/api/ai/bullshift/flushMemory', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
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

	const analyzeChat = async () => {
		console.log('$user', $user);
		try {
			const response = await fetch('/api/ai/bullshift/analyzeChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: $user, locale: $locale, chatId })
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

	const callMemoryExtraction = async () => {
		try {
			const response = await fetch('/api/ai/bullshift/extractMemories', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error('Failed to extract memories:', error);
		}
	};

	const safelyParseJSON = (jsonString: string) => {
		try {
			return JSON.parse(jsonString);
		} catch (error) {
			return '';
		}
	};

	onMount(async () => {
		// scrollToBottom();
		scrollDown();
	});
</script>

<div class="flex justify-between">
	<Popover.Root>
		<Popover.Trigger>
			<div class="flex items-center gap-2 rounded-full bg-black px-3 py-1 text-xs text-offwhite">
				Debug <Bug class="size-4 text-blue-300" />
			</div>
		</Popover.Trigger>
		<Popover.Content class="m-2 flex w-auto flex-col gap-2 bg-transparent p-0 shadow-none">
			<a
				target="_blank"
				class="flex items-center justify-between gap-2 rounded-full bg-black px-2 py-1 text-xs text-offwhite active:bg-blue-500/50"
				href={`/bullshift/insights/${chatId}`}
			>
				<span class="hidden md:inline">{chatId}: </span>Inspect Chat<span class="text-blue-300"
					>↗</span
				>
			</a>
			<button
				on:click={flushMemory}
				class="flex items-center justify-between gap-2 rounded-full bg-black px-2 py-1 text-xs text-offwhite active:bg-red-500/50"
			>
				Flush Memory <span class="text-yellow-300">↡</span>
			</button>
			<button
				on:click={callMemoryExtraction}
				class="flex items-center justify-between gap-2 rounded-full bg-black px-2 py-1 text-xs text-offwhite active:bg-red-500/50"
			>
				Extract Memory <span class="text-green-300">↳</span>
			</button>
		</Popover.Content>
	</Popover.Root>
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
							{#if 'text' in message.parts[0]}
							{@html marked(message.parts[0].text)}
								<!-- {@html marked(
									message.role === 'user'
										? message.parts[0].text
										: safelyParseJSON(message.parts[0].text).response
								)} -->
							{:else if 'functionCall' in message.parts[0]}
								<div class="text-xs">
									<span class="font-bold">Funktion:</span>
									{message.parts[0].functionCall.name}
									<span class="font-bold">Argumente:</span>
									{JSON.stringify(message.parts[0].functionCall.args)}
								</div>
							{/if}
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
	{#if history.length > 0}
		<button
			class="fixed bottom-36 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-full bg-black px-3 py-1 text-sm text-offwhite"
			on:click={() => {
				chatTerminationModalVisible = true;
			}}
		>
			Chat beenden
			<X class="size-4 text-red-400" />
		</button>
	{/if}
{/if}

<Dialog.Root bind:open={chatTerminationModalVisible}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Chat auswerten?</Dialog.Title>
			<Dialog.Description>Möchtest du den Chat beenden und auswerten lassen?</Dialog.Description>
			<Dialog.Footer>
				<div class="mt-2 flex flex-grow justify-between gap-4">
					<Button
						variant="outline"
						class="bg-transparent shadow-none"
						on:click={() => {
							chatTerminationModalVisible = false;
							clearChat();
						}}
					>
						Nicht auswerten
					</Button>
					<Button
						class="flex-grow bg-bullshift"
						on:click={() => {
							chatTerminationModalVisible = false;
							analyzeChat();
						}}
					>
						Auswerten
					</Button>
				</div>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
