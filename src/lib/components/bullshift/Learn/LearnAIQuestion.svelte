<script lang="ts">
	import { marked } from 'marked';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import IconPaperPlane from '$assets/icons/icon-paper-plane.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import { pb } from '$scripts/pocketbase';
	import { onMount } from 'svelte';

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
		content: any;
		color: string;
		session: LearningSession | null;
		contentBlock: any;
		currentStep: number;
		totalSteps: { component: string; internalStep: number }[];
		topicVersionId: string;
		onResponse: (response: any) => void;
		gotoNextStep?: () => void;
		gotoPrevStep?: () => void;
		isPreview?: boolean;
	}

	let {
		content,
		color,
		session,
		contentBlock,
		currentStep,
		totalSteps,
		topicVersionId,
		onResponse,
		gotoNextStep,
		gotoPrevStep,
		isPreview = false
	}: Props = $props();

	let userAnswer = $state('');
	let aiResponse = $state('');
	let isLoading = $state(false);
	let hasSubmitted = $state(false);
	let responseTime = $state<number | null>(null);
	let errorMessage = $state('');
	let textareaRef: HTMLTextAreaElement | undefined = $state();
	let feelings = $state<Feeling[]>([]);
	let needs = $state<Need[]>([]);
	let feelingSelectorVisible = $state(false);
	let needSelectorVisible = $state(false);

	const internalStep = $derived(() => {
		return totalSteps[currentStep].internalStep;
	});

	// Check for existing response in session
	const existingResponse = $derived(() => {
		if (!session) return null;
		return session.responses.find(
			(r) =>
				r.blockType === 'aiQuestion' &&
				JSON.stringify(r.blockContent) === JSON.stringify(contentBlock)
		);
	});

	// Initialize from existing response if available - ONLY ONCE on mount
	$effect(() => {
		const existing = existingResponse();
		if (existing) {
			const response = existing.response;
			if (response) {
				userAnswer = response.userAnswer || '';
				aiResponse = response.aiResponse || '';
				hasSubmitted = !!response.aiResponse;
				responseTime = response.responseTime || null;
			}
		}
	});

	// Clear error message when user starts typing
	$effect(() => {
		if (userAnswer && errorMessage) {
			errorMessage = '';
		}
	});

	const submitAnswer = async () => {
		if (!userAnswer.trim() || isLoading) return;

		isLoading = true;
		errorMessage = ''; // Clear any previous errors
		const startTime = Date.now();

		try {
			const response = await fetch('/api/ai/learn/askQuestion', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					question: content.question,
					userAnswer: userAnswer.trim(),
					systemPrompt: content.systemPrompt
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get AI response');
			}

			const data = await response.json();
			const endTime = Date.now();
			responseTime = Math.floor((endTime - startTime) / 1000);

			aiResponse = data.response;
			hasSubmitted = true;

			// Save the response
			await onResponse({
				userAnswer: userAnswer.trim(),
				aiResponse: data.response,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			});

			gotoNextStep?.();
		} catch (error) {
			console.error('Error getting AI response:', error);
			errorMessage = "Sorry, I couldn't process your answer right now. Please try again.";
			hasSubmitted = false; // Don't mark as submitted if there was an error
		} finally {
			isLoading = false;
		}
	};

	// Functions for feelings and needs
	const getFeelings = async () => {
		try {
			feelings = await pb.collection('feelings').getFullList({
				sort: '-positive,category,sort'
			});
		} catch (error) {
			console.error('Error fetching feelings:', error);
		}
	};

	const getNeeds = async () => {
		try {
			needs = await pb.collection('needs').getFullList({
				sort: 'category,sort'
			});
		} catch (error) {
			console.error('Error fetching needs:', error);
		}
	};

	const addText = (text: string) => {
		if (!textareaRef) {
			// Fallback to old behavior if no textarea ref
			let textToAdd = '';
			if (userAnswer && userAnswer[userAnswer.length - 1] !== ' ') {
				textToAdd = ' ' + text;
			} else {
				textToAdd = text;
			}
			userAnswer += textToAdd;
			return;
		}

		// Get the current selection/cursor position
		const start = textareaRef.selectionStart;
		const end = textareaRef.selectionEnd;
		const currentText = textareaRef.value;

		// Determine what text to insert
		let textToInsert = text;
		
		// Check if we need to add a space before the text
		if (start > 0 && currentText[start - 1] !== ' ') {
			textToInsert = ' ' + text;
		}
		
		// Insert the text at the cursor position
		const newText = currentText.substring(0, start) + textToInsert + currentText.substring(end);
		userAnswer = newText;
		
		// Set the cursor position after the inserted text
		const newCursorPosition = start + textToInsert.length;
		
		// Use requestAnimationFrame to ensure the DOM has updated
		requestAnimationFrame(() => {
			if (textareaRef) {
				textareaRef.focus();
				textareaRef.setSelectionRange(newCursorPosition, newCursorPosition);
			}
		});
	};

	// Load feelings and needs on mount if buttons are enabled
	onMount(async () => {
		if (content.showFeelingsButton) {
			await getFeelings();
		}
		if (content.showNeedsButton) {
			await getNeeds();
		}
	});
</script>

<div class="flex h-full flex-col justify-between rounded-lg backdrop-blur">
	<!-- Debug: Show internal step -->
	{#if internalStep() === 0}
		<!-- Step 1: Question and Answer Input -->
		<div class="flex flex-grow items-center justify-center">
			<h3 class="marked font-medium text-gray-900">
				{@html marked(content.question)}
			</h3>
		</div>

		<div class="">
			<div
				class="flex flex-col gap-2 rounded-2xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<AutoTextarea
					bind:value={userAnswer}
					placeholder={content.placeholder || 'Schreibe deine Antwort hier...'}
					class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
					bind:textarea={textareaRef}
					onEnter={submitAnswer}
				/>

				<!-- Feelings selector -->
				{#if content.showFeelingsButton && feelingSelectorVisible}
					<div class="flex max-h-40 flex-wrap gap-1 overflow-y-auto overscroll-contain">
						{#each feelings as feeling}
							<button
								type="button"
								onclick={() => addText(feeling.nameDE)}
								class="rounded-full border border-black/5 bg-white px-2 py-0.5 text-xs text-black active:bg-black/5"
							>
								{feeling.nameDE}
							</button>
						{/each}
					</div>
				{/if}

				<!-- Needs selector -->
				{#if content.showNeedsButton && needSelectorVisible}
					<div class="flex max-h-40 flex-wrap gap-1 overflow-y-auto overscroll-contain">
						{#each needs as need}
							<button
								type="button"
								onclick={() => addText(need.nameDE)}
								class="rounded-full border border-black/5 bg-white px-2 py-0.5 text-xs text-black active:bg-black/5"
							>
								{need.nameDE}
							</button>
						{/each}
					</div>
				{/if}

				<div class="flex items-end justify-between">
					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => gotoPrevStep?.()}
							style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
							class="flex items-center gap-2 rounded-full bg-white px-1 py-1 text-xs"
						>
							<div class="flex size-4 items-center justify-center rounded-full fill-black/60">
								<ChevronLeft class="size-3" />
							</div>
						</button>
						{#if existingResponse()}
							<button
								type="button"
								onclick={() => gotoNextStep?.()}
								style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
								class="flex items-center gap-2 rounded-full bg-white py-1 pl-3 pr-1 text-xs"
							>
								Zur vorherigen Antwort
								<div
									class="flex size-4 items-center justify-center rounded-full bg-black/5 fill-black/60"
								>
									<ChevronRight class="size-3" />
								</div>
							</button>
						{/if}
						
						<!-- Feelings button -->
						{#if content.showFeelingsButton && !isPreview}
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
						{/if}
						
						<!-- Needs button -->
						{#if content.showNeedsButton && !isPreview}
							<button
								type="button"
								onclick={() => {
									feelingSelectorVisible = false;
									needSelectorVisible = !needSelectorVisible;
								}}
								style={needSelectorVisible
									? ''
									: 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}
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
						{/if}
					</div>
					<button
						onclick={() => {
							feelingSelectorVisible = false;
							needSelectorVisible = false;
							submitAnswer();
						}}
						disabled={!userAnswer.trim() || isLoading}
						type="submit"
						style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
						class="flex size-10 items-center justify-center rounded-full bg-black text-white disabled:opacity-50"
					>
						{#if isLoading}
							<Loader2 class="size-4 animate-spin" />
						{:else}
							<div class="w-[1.2em] fill-white">
								{@html IconPaperPlane}
							</div>
						{/if}
					</button>
				</div>
			</div>

			<!-- Error message display -->
			{#if errorMessage}
				<div class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
					<p class="text-sm text-red-800">{errorMessage}</p>
				</div>
			{/if}
		</div>
	{:else if internalStep() === 1 && existingResponse()}
		<!-- AI Response -->
		{#if hasSubmitted && aiResponse}
		<div class="flex-grow flex justify-center items-center">
			<div class=" rounded-lg p-4 max-w-sm max-h-80 overflow-y-auto">
				{@html marked(aiResponse)}
			</div>
		</div>
		{/if}

		<!-- Navigation for next step -->
		<LearnGotoNextButton
			onClick={() => {
				gotoNextStep?.();
			}}
			onPrev={() => {
				gotoPrevStep?.();
			}}
			displayBackButton={true}
		>
			Weiter
		</LearnGotoNextButton>
	{/if}
</div>
