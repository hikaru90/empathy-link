<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import { locale } from '$lib/translations';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import X from 'lucide-svelte/icons/x';
	import Bug from 'lucide-svelte/icons/bug';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import { pb } from '$scripts/pocketbase'

	interface Feeling {
		id: string;
		nameDE: string;
		nameEN: string;
		category: string;
		positive: boolean;
		sort: number;
	}

	interface Need {
		id: string;
		nameDE: string;
		nameEN: string;
		category: string;
		sort: number;
	}

	interface Props {
		chatId: string;
		history?: any[];
		systemInstruction: string;
		user: App.User;
		class?: string | undefined;
	}

	let {
		chatId = $bindable(),
		history = $bindable([]),
		systemInstruction,
		user,
		class: className = undefined
	}: Props = $props();

	let userMessage = $state('');
	let isLoading = $state(false);
	let chatContainer: HTMLDivElement = $state();
	let chatTerminationModalVisible = $state(false);
	let analyzerIsRunning = $state(false);
	let chatAnalysisModalVisible = $state(false);
	let chatAnalysisId = $state('');
	let feelings = $state<Feeling[]>([]);
	let needs = $state<Need[]>([]);
	let feelingSelectorVisible = $state(false);
	let needSelectorVisible = $state(false);

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
					userId: user!.id,
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
	const getFeelings = async() => {
		feelings = await pb.collection('feelings').getFullList({
			sort: '-positive,category,sort'
		});
	};
	const getNeeds = async() => {
		needs = await pb.collection('needs').getFullList({
			sort: 'category,sort'
		});
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
		console.log('user', user);
		try {
			const response = await fetch('/api/ai/bullshift/initChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: user, locale: $locale })
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
		try {
			// Validate required data
			if (!user || !$locale || !chatId) {
				throw new Error('Missing required data for chat analysis');
			}

			const response = await fetch('/api/ai/bullshift/analyzeChat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: user, locale: $locale, chatId })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Validate response data
			if (!data.analysis?.id || !data.initiatedChat?.chatId) {
				throw new Error('Invalid response data from server');
			}
			chatAnalysisId = data.analysis.id;



			await callMemoryExtraction();




			chatId = data.initiatedChat.chatId;
			history = [];
			userMessage = '';
		} catch (error) {
			console.error('Failed to analyze chat:', error);
			// You might want to show an error message to the user here
			// For example: showErrorNotification('Failed to analyze chat. Please try again.');
		} finally {
			analyzerIsRunning = false;
			chatTerminationModalVisible = false;
			chatAnalysisModalVisible = true;
		}
	};
	const callMemoryExtraction = async () => {
		console.log('callMemoryExtraction');
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
	const addText = (text: string) => {
		let textToAdd = '';
		if (userMessage && userMessage[userMessage.length - 1] !== ' ') {
			textToAdd = ' ' + text;
		}else{
			textToAdd = text;
		}
		userMessage += textToAdd;
	};

	const autoGrow = (element: HTMLTextAreaElement) => {
		element.style.height = '5px';
		element.style.height = element.scrollHeight + 'px';
	};

	onMount(async () => {
		scrollDown();

		getFeelings()
		getNeeds()
	});
</script>

{#if user?.role === 'admin'}
	<div class={cn(className, 'flex justify-between')}>
		<Popover.Root>
			<Popover.Trigger>
				<div
					class="flex items-center gap-2 rounded-full bg-black py-1 pl-2 pr-3 text-xs text-offwhite"
				>
					<Bug class="size-4 text-blue-300" /> Debug
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
					onclick={flushMemory}
					class="flex items-center justify-between gap-2 rounded-full bg-black px-2 py-1 text-xs text-offwhite active:bg-red-500/50"
				>
					Flush Memory <span class="text-yellow-300">↡</span>
				</button>
				<button
					onclick={callMemoryExtraction}
					class="flex items-center justify-between gap-2 rounded-full bg-black px-2 py-1 text-xs text-offwhite active:bg-red-500/50"
				>
					Extract Memory <span class="text-green-300">↳</span>
				</button>
			</Popover.Content>
		</Popover.Root>
		<button
			onclick={clearChat}
			class="flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs text-black"
		>
			Neuer Chat
			<RotateCcw class="size-3 text-red-500" />
		</button>
	</div>
{/if}

{#if chatId}
	<div class="">
		<div bind:this={chatContainer} class="rounded-lg pb-52 pt-4">
			<h1 class="mb-3 text-2xl font-light">
				Hi <span class="capitalize">{user?.firstName}</span>, ich bin hier, um den ganzen Bullshit
				in deinem Leben zu durchbrechen.
			</h1>
			<h2 class="mb-6 text-2xl font-light text-black/40">
				Beschreib mir eine Situation, und ich helfe dir, sie zu verarbeiten. Vertrau mir – wir
				schaffen das gemeinsam!
			</h2>
			{#each history as message}
				<!-- {JSON.stringify(message)} -->
				<div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
					<div
						class="inline-block rounded-xl px-3 py-2 break-all {message.role === 'user'
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

		<div class="fixed bottom-[62px] left-0 right-0 px-4 pb-6 pt-4">
			{#if history.length > 0}
				<button
					class="absolute -top-6 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-full bg-black px-3 py-1 text-sm text-offwhite"
					onclick={() => {
						chatTerminationModalVisible = true;
					}}
				>
					Chat beenden
					<X class="size-4 text-red-400" />
				</button>
			{/if}
			<form
				onsubmit={preventDefault(handleSendMessage)}
				class="flex flex-col gap-2 rounded-2xl bg-gradient-to-b from-white to-offwhite p-2 shadow-lg"
			>
				<AutoTextarea
					bind:value={userMessage}
					placeholder="Deine Nachricht..."
					class="flex-grow rounded-md bg-transparent outline-none px-2 py-1"
				></AutoTextarea>





				<div class="{feelingSelectorVisible ? 'flex' : 'hidden'} flex-wrap gap-1 max-h-40 overflow-y-auto overscroll-contain">
					{#each feelings as feeling}
						<button type="button" onclick={() => addText(feeling.nameDE)} class="rounded-full bg-white border border-black/5 active:bg-black/5 px-2 py-0.5 text-xs text-black">{feeling.nameDE}</button>
					{/each}
				</div>
				<div class="{needSelectorVisible ? 'flex' : 'hidden'} flex-wrap gap-1 max-h-40 overflow-y-auto overscroll-contain">
					{#each needs as need}
						<button type="button" onclick={() => addText(need.nameDE)} class="rounded-full bg-white border border-black/5 active:bg-black/5 px-2 py-0.5 text-xs text-black">{need.nameDE}</button>
					{/each}
				</div>






				<div class="flex items-end justify-between">
					<div class="flex items-center gap-2">
						<button type="button" onclick={() => {needSelectorVisible = false; feelingSelectorVisible = !feelingSelectorVisible}}
							style="{feelingSelectorVisible ? '' : 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}"
							class="flex items-center gap-1 rounded-full {feelingSelectorVisible ? 'bg-black/5 shadow-inner text-black/40' : 'bg-white text-black/60'} px-2 py-1 text-xs"
						>
							<div class="w-[1.2em] fill-neutral-500">
								{@html IconHeart}
							</div>
							Gefühle
						</button>
						<button type="button" onclick={() => {feelingSelectorVisible = false; needSelectorVisible = !needSelectorVisible}}
							style="{needSelectorVisible ? '' : 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}	"
							class="flex items-center gap-1 rounded-full {needSelectorVisible ? 'bg-black/5 shadow-inner text-black/40' : 'bg-white text-black/60'} px-2 py-1 text-xs"
						>
							<div class="w-[1.2em] fill-neutral-500">
								{@html IconSwirl}
							</div>
							Bedürfnisse
						</button>
					</div>
					<button
						type="submit"
						onclick={() => {feelingSelectorVisible = false; needSelectorVisible = false}}
						disabled={isLoading}
						style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
						class="flex size-10 items-center justify-center rounded-full bg-bullshift text-black disabled:opacity-50"
					>
						<SendHorizontal class="size-4" />
					</button>
				</div>
			</form>
		</div>
	</div>
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
						onclick={() => {
							chatTerminationModalVisible = false;
							clearChat();
						}}
					>
						Nicht auswerten
					</Button>
					<Button
						class="flex flex-grow items-center justify-between gap-2 bg-black text-white"
						onclick={() => {
							analyzerIsRunning = true;
							analyzeChat();
						}}
					>
						Auswerten
						{#if analyzerIsRunning}
							<LoaderCircle class="size-4 animate-spin" />
						{:else}
							<ChevronRight class="size-4" />
						{/if}
					</Button>
				</div>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={chatAnalysisModalVisible}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Zur Chat auswertung?</Dialog.Title>
			<Dialog.Description>Möchtest Du zur Auswertung gehen?</Dialog.Description>
			<Dialog.Footer>
				<div class="mt-2 flex flex-grow justify-between gap-4">
					<Button
						variant="outline"
						class="bg-transparent shadow-none"
						onclick={() => {
							chatAnalysisModalVisible = false;
						}}
					>
						Schließen
					</Button>
					{#if chatAnalysisId}
						<a
							href={`/bullshift/stats/chats/${chatAnalysisId}`}
							class="flex h-9 flex-grow items-center justify-between gap-2 whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
							onclick={() => {
								chatAnalysisModalVisible = false;
							}}
						>
							Zur Auswertung
							<ChevronRight class="size-4" />
						</a>
					{/if}
				</div>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
