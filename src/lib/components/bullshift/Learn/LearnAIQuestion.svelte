<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { Button } from '$lib/components/ui/button';
	import { learningSession } from '$lib/stores/learningSession';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import IconPaperPlane from '$assets/icons/icon-paper-plane.svg?raw';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	interface Props {
		content: any;
		color: string;
		session: LearningSession | null;
		contentBlock: any;
		currentStep: number;
		totalSteps: { component: string, internalStep: number }[];
		topicVersionId: string;
		onResponse: (response: any) => void;
		gotoNextStep?: () => void;
	}

	let { content, color, session, contentBlock, currentStep, totalSteps, topicVersionId, onResponse, gotoNextStep }: Props = $props();

	let userAnswer = $state('');
	let aiResponse = $state('');
	let isLoading = $state(false);
	let hasSubmitted = $state(false);
	let responseTime = $state<number | null>(null);
	let errorMessage = $state('');

	const internalStep = $derived(() => {
		return totalSteps[currentStep].internalStep
	});

	// Check for existing response in session
	const existingResponse = $derived(() => {
		if (!session) return null;
		return session.responses.find(r => r.blockType === 'aiQuestion' && 
			JSON.stringify(r.blockContent) === JSON.stringify(contentBlock));
	});

	// Initialize from existing response if available
	$effect(() => {
		if (existingResponse()) {
			const response = existingResponse()?.response;
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
			onResponse({
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

	const handleKeyDown = (event: KeyboardEvent) => {
		// Handle Ctrl+Enter / Cmd+Enter for submission
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			submitAnswer();
			return;
		}
		
		// Always prevent event bubbling to parent components
		event.stopPropagation();
		
		// Only prevent default for specific problematic keys that might trigger navigation
		if (event.key === 'Backspace' || event.key === 'Escape' || event.key === 'Enter') {
			// Check if we're in a text input context and prevent default behavior
			const target = event.target as HTMLElement;
			if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
				// For backspace in text inputs, don't prevent default (allow normal deletion)
				// but do prevent it from bubbling up to trigger any parent handlers
				return;
			}
		}
	};
</script>

<div class="space-y-4 rounded-lg backdrop-blur h-full flex flex-col justify-between">
	<!-- Debug: Show internal step -->
	{#if internalStep() === 0}
			<!-- Step 1: Question and Answer Input -->
			<div class="space-y-2 flex-grow flex justify-center items-center">
				<h3 class="font-medium text-gray-900">
					{@html marked(content.question)}
				</h3>
			</div>

			<div class="space-y-2">
				<div 
					class="flex flex-col gap-2 rounded-2xl bg-gradient-to-b from-white to-offwhite p-2 border border-white shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
				>
					<AutoTextarea
						bind:value={userAnswer}
						placeholder={content.placeholder || 'Schreibe deine Antwort hier...'}
						class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
					/>
					
					<div class="flex items-end justify-between">
						<div>
							{#if existingResponse()}
								<button 
									type="button"
									onclick={() => gotoNextStep?.()}
									style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
									class="flex items-center gap-2 rounded-full pl-3 pr-1 py-1 text-xs bg-white"
								>
								Zur vorherigen Antwort
								<div class="size-4 rounded-full bg-black/5 fill-black/60 flex items-center justify-center">
									<ChevronRight class="size-3" />
								</div>
								</button>
							{/if}
						</div>
						<button
							onclick={submitAnswer}
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
				<div class="space-y-2 rounded-lg flex-grow flex items-center justify-center p-6">
					<div class="prose prose-sm max-w-none text-gray-700 overflow-y-auto">
						{@html marked(aiResponse)}
					</div>
				</div>
			{/if}

			<!-- Navigation for next step -->
			<Button
			onclick={gotoNextStep}
			class="bg-white text-gray-900 hover:bg-gray-100 font-medium pl-6 pr-2 py-3 rounded-full flex items-center justify-between gap-2 w-full"
		>
			Weiter
			<div class="size-6 bg-black/5 rounded-full flex items-center justify-center">
				<ArrowRight class="w-4 h-4" />
			</div>
		</Button>
		{/if}
</div>