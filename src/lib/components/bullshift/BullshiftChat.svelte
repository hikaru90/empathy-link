<script lang="ts">
	import { preventDefault } from 'svelte/legacy';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import X from 'lucide-svelte/icons/x';
	import SquareCheck from 'lucide-svelte/icons/square-check';
	import Bug from 'lucide-svelte/icons/bug';
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import IconPaperPlane from '$assets/icons/icon-paper-plane.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { pb } from '$scripts/pocketbase';
	import { getLocale } from '$src/paraglide/runtime';
	import { scroll } from '$store/page';

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
	let chatContainer: HTMLDivElement | undefined = $state();
	let textareaRef: HTMLTextAreaElement | undefined = $state();

	let chatTerminationModalVisible = $state(false);

	let analyzerIsRunning = $state(false);
	let analyzerFailed = $state(false);

	let memorizerIsRunning = $state(false);
	let memorizerFailed = $state(false);

	let chatAnalysisModalVisible = $state(false);

	let chatAnalysisId = $state('');
	let feelings = $state<Feeling[]>([]);
	let needs = $state<Need[]>([]);
	let feelingSelectorVisible = $state(false);
	let needSelectorVisible = $state(false);

	// Get the current locale reactively
	const locale = $derived(getLocale());

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
					locale: locale
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
	const getFeelings = async () => {
		feelings = await pb.collection('feelings').getFullList({
			sort: '-positive,category,sort'
		});
	};
	const getNeeds = async () => {
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
				body: JSON.stringify({ user: user, locale: locale })
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
	const memorizeChatFake = async () => {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
	};
	const startAnalysis = async () => {
		chatAnalysisId = '';
		analyzerIsRunning = true;
		try {
			const [analysisResponse] = await Promise.all([
				analyzeChat(),
				new Promise(resolve => setTimeout(resolve, 2000))
			]);
			
			chatAnalysisId = analysisResponse;
			console.log('chatAnalysisId', chatAnalysisId);
		} catch (error) {
			analyzerFailed = true;
			console.error('Failed to analyze chat:', error);
			return false;
		} finally {
			analyzerIsRunning = false;
		}

		memorizerIsRunning = true;
		try {
			const [memorizationResponse] = await Promise.all([
				extractMemories(),
				new Promise(resolve => setTimeout(resolve, 2000))
			]);
		} catch (error) {
			memorizerFailed = true;
			console.error('Failed to memorize chat:', error);
			return false;
		} finally {
			memorizerIsRunning = false;
		}
	};
	const analyzeChat = async (): Promise<string> => {
		// Validate required data
		if (!locale || !chatId) {
			throw new Error('Missing required data for chat analysis');
		}

		const response = await fetch('/api/ai/bullshift/analyzeChat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ locale: locale, chatId })
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
		// Update to the new chat ID that was created during analysis
		chatId = data.initiatedChat.chatId;
		// Clear the history since we have a new chat
		history = [];
		return data.analysis.id;
	};
	const extractMemories = async (): Promise<boolean> => {
		const response = await fetch('/api/ai/bullshift/extractMemories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userId: user.id })
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return true;
	};
	const safelyParseJSON = (jsonString: string) => {
		try {
			return JSON.parse(jsonString);
		} catch (error) {
			return '';
		}
	};
	const addText = (text: string) => {
		if (!textareaRef) {
			// Fallback to old behavior if no textarea ref
			let textToAdd = '';
			if (userMessage && userMessage[userMessage.length - 1] !== ' ') {
				textToAdd = ' ' + text;
			} else {
				textToAdd = text;
			}
			userMessage += textToAdd;
			return;
		}

		const textarea = textareaRef;
		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const currentValue = userMessage;

		// Determine what text to add
		let textToAdd = text;
		
		// Add space before if needed (cursor is not at start and previous char is not a space)
		if (start > 0 && currentValue[start - 1] !== ' ') {
			textToAdd = ' ' + text;
		}
		
		// Add space after if needed (cursor is not at end and next char is not a space)
		if (end < currentValue.length && currentValue[end] !== ' ') {
			textToAdd = textToAdd + ' ';
		}

		// Insert text at cursor position
		const newValue = currentValue.substring(0, start) + textToAdd + currentValue.substring(end);
		userMessage = newValue;

		// Set cursor position after the inserted text
		setTimeout(() => {
			const newCursorPos = start + textToAdd.length;
			textarea.setSelectionRange(newCursorPos, newCursorPos);
			textarea.focus();
		}, 0);
	};

	const autoGrow = (element: HTMLTextAreaElement) => {
		element.style.height = '5px';
		element.style.height = element.scrollHeight + 'px';
	};

	onMount(async () => {
		scrollDown();

		getFeelings();
		getNeeds();
	});

	$effect(() => {
		// Auto-hide modal when analysis is complete and successful
		if (!analyzerIsRunning && !memorizerIsRunning && !analyzerFailed && !memorizerFailed && chatAnalysisId && chatTerminationModalVisible) {
			setTimeout(() => {
				chatTerminationModalVisible = false;
			}, 1500); // Show success state for 1.5 seconds before auto-hiding
		}
	});
</script>

<!-- {#if user?.role === 'admin'}
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
					onclick={async () => {
						try {
							await extractMemories();
							console.log('Memories extracted successfully');
						} catch (error) {
							console.error('Failed to extract memories:', error);
						}
					}}
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
{/if} -->

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
						class="inline-block break-words rounded-xl px-3 py-2 {message.role === 'user'
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
				<button
					class="{ history.length > 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none' } fixed top-4 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-full bg-bullshift px-3 py-1 text-sm shadow-xl transition"
					onclick={() => {
						chatTerminationModalVisible = true;
						startAnalysis();
					}}
				>
					Chat abschließen
					<SquareCheck class="size-4" />
				</button>
			<form
				onsubmit={preventDefault(handleSendMessage)}
				class="flex flex-col gap-2 rounded-2xl bg-gradient-to-b from-white to-offwhite p-2 border border-white shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<AutoTextarea
					bind:value={userMessage}
					placeholder="Deine Nachricht..."
					class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
					bind:textarea={textareaRef}
				></AutoTextarea>

				<div
					class="{feelingSelectorVisible
						? 'flex'
						: 'hidden'} max-h-40 flex-wrap gap-1 overflow-y-auto overscroll-contain"
				>
					{#each feelings as feeling}
						<button
							type="button"
							onclick={() => addText(feeling.nameDE)}
							class="rounded-full border border-black/5 bg-white px-2 py-0.5 text-xs text-black active:bg-black/5"
							>{feeling.nameDE}</button
						>
					{/each}
				</div>
				<div
					class="{needSelectorVisible
						? 'flex'
						: 'hidden'} max-h-40 flex-wrap gap-1 overflow-y-auto overscroll-contain"
				>
					{#each needs as need}
						<button
							type="button"
							onclick={() => addText(need.nameDE)}
							class="rounded-full border border-black/5 bg-white px-2 py-0.5 text-xs text-black active:bg-black/5"
							>{need.nameDE}</button
						>
					{/each}
				</div>

				<div class="flex items-end justify-between">
					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => {
								needSelectorVisible = false;
								feelingSelectorVisible = !feelingSelectorVisible;
							}}
							style={feelingSelectorVisible
								? ''
								: 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}
							class="flex items-center gap-1 rounded-full pl-1 pr-2 py-1 text-xs {feelingSelectorVisible
							? 'text-black shadow-inner bg-black/10'
							: 'text-black/60 bg-white'}"
						>
						<div class="w-[1.2em] rounded-full p-[0.1em] {feelingSelectorVisible
						? 'bg-black fill-white/80'
						: 'bg-black/10 fill-black/60'}">
								{@html IconHeart}
							</div>
							Gefühle
						</button>
						<button
							type="button"
							onclick={() => {
								feelingSelectorVisible = false;
								needSelectorVisible = !needSelectorVisible;
							}}
							style="{needSelectorVisible
								? ''
								: 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}	"
							class="flex items-center gap-1 rounded-full pl-1 pr-2 py-1 text-xs {needSelectorVisible
								? 'text-black shadow-inner bg-black/10'
								: 'text-black/60 bg-white'}"
						>
							<div class="w-[1.2em] rounded-full p-[0.1em] {needSelectorVisible
								? 'bg-black fill-white/80'
								: 'bg-black/10 fill-black/60'}">
								{@html IconSwirl}
							</div>
							Bedürfnisse
						</button>
					</div>
					<button
						type="submit"
						onclick={() => {
							feelingSelectorVisible = false;
							needSelectorVisible = false;
						}}
						disabled={isLoading}
						style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
						class="flex size-10 items-center justify-center rounded-full bg-black text-white disabled:opacity-50"
					>
						<div class="w-[1.2em] fill-white">
							{@html IconPaperPlane}
						</div>
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if chatTerminationModalVisible}
	<!-- Custom non-interactive modal -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="mx-4 max-w-md rounded-lg bg-white p-6 shadow-xl">
			<div class="text-center">
				<h3 class="mb-4 text-lg font-semibold">Chat wird ausgewertet</h3>
				
				{#if analyzerIsRunning || memorizerIsRunning}
					<!-- Loading state with sparkle pill -->
					<div class="mb-4 flex flex-col items-center gap-3">
						<SparklePill fast={true} class="h-6 w-16 shadow-xl dark:shadow-gray-200/30" />
						{#if analyzerIsRunning}
							<p class="text-sm text-gray-600">Dein Chat wird ausgewertet</p>
						{:else if memorizerIsRunning}
							<p class="text-sm text-gray-600">Dein Chat wird abgespeichert</p>
						{/if}
					</div>
				{:else if analyzerFailed || memorizerFailed}
					<!-- Error state -->
					<div class="mb-4">
						{#if analyzerFailed}
							<p class="mb-4 text-sm text-red-600">Dein Chat konnte nicht ausgewertet werden.</p>
						{:else if memorizerFailed}
							<p class="mb-4 text-sm text-red-600">Dein Chat konnte nicht abgespeichert werden.</p>
						{/if}
						<Button
							class="bg-black text-white"
							onclick={() => {
								startAnalysis();
							}}
						>
							Erneut versuchen
						</Button>
					</div>
				{:else if chatAnalysisId}
					<!-- Success state -->
					<div class="mb-4 flex flex-col items-center gap-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
							<SquareCheck class="h-6 w-6 text-green-600" />
						</div>
						<p class="text-sm text-gray-600">Dein Chat wurde ausgewertet und abgespeichert</p>
					</div>
				{:else}
					<!-- Initial state -->
					<div class="mb-4 flex flex-col items-center gap-3">
						<SparklePill class="w-8" />
						<p class="text-sm text-gray-600">Chat wird vorbereitet...</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}