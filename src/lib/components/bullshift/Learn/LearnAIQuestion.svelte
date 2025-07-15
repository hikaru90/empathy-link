<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { Button } from '$lib/components/ui/button';
	import { learningSession } from '$lib/stores/learningSession';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';

	interface Props {
		content: any;
		color: string;
		pageIndex: number;
		blockIndex: number;
		session: LearningSession | null;
		contentBlock: any;
		topicVersionId: string;
		internalStep?: number;
		onResponse: (response: any) => void;
		gotoNextStep?: () => void;
	}

	let { content, color, pageIndex, blockIndex, session, contentBlock, topicVersionId, internalStep = 0, onResponse, gotoNextStep }: Props = $props();

	let userAnswer = $state('');
	let aiResponse = $state('');
	let isLoading = $state(false);
	let hasSubmitted = $state(false);
	let responseTime = $state<number | null>(null);
	let errorMessage = $state('');
	
	// Simple step management - track whether we've submitted the answer
	let currentStepNumber = $state(1);
	
	const currentStep = $derived(() => {
		return currentStepNumber;
	});

	// Component registration is no longer needed since we removed step management
	$effect(() => {
		// Previously registered component steps, but this is no longer needed
		return () => {
			// Previously unregistered component steps, but this is no longer needed
		};
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
			
			// Move to step 2 to show the response
			currentStepNumber = 2;
			console.log('🔥 AI Question: Moving to step 2');

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

<div class="space-y-4 rounded-lg bg-white/10 p-4 backdrop-blur">
	<!-- Debug: Show current step -->
	<div class="text-xs text-gray-500">Debug: currentStep = {currentStep()}</div>
	{#if currentStep() === 1}
			<!-- Step 1: Question and Answer Input -->
			<div class="space-y-2">
				<h3 class="font-medium text-gray-900">
					{@html marked(content.question)}
				</h3>
			</div>

			<div class="space-y-2">
				<div class="relative">
					<Textarea
						id="user-answer-{pageIndex}-{blockIndex}"
						bind:value={userAnswer}
						placeholder={content.placeholder || 'Schreibe deine Antwort hier...'}
						rows={4}
						class="resize-none"
						onkeydown={handleKeyDown}
					/>
					<div class="absolute bottom-2 right-2">
						<Button
							onclick={submitAnswer}
							disabled={!userAnswer.trim() || isLoading }
							size="sm"
							style="background-color: {color};"
							class="text-white hover:opacity-90"
						>
							{#if isLoading}
								<Loader2 class="size-4 animate-spin" />
							{:else}
								<SendHorizontal class="size-4" />
							{/if}
						</Button>
					</div>
				</div>

				<!-- Error message display -->
				{#if errorMessage}
					<div class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
						<p class="text-sm text-red-800">{errorMessage}</p>
					</div>
				{/if}

				<!-- Loading State -->
				{#if isLoading}
					<div class="flex items-center justify-center space-x-2 py-4">
						<Loader2 class="size-5 animate-spin" style="color: {color};" />
						<span class="text-sm text-gray-600">KI denkt nach...</span>
					</div>
				{/if}
			</div>

		{:else if currentStep() === 2}
			<!-- Step 2: Show User Answer and AI Response -->
			<div class="space-y-2">
				<h3 class="font-medium text-gray-900">
					{@html marked(content.question)}
				</h3>
			</div>

			<!-- AI Response -->
			{#if hasSubmitted && aiResponse}
				<div class="space-y-2 rounded-lg bg-gray-50 p-4">
					<div class="flex items-center justify-between">
						<h4 class="font-medium text-gray-900">KI-Antwort:</h4>
						<div class="flex items-center gap-2">
							{#if responseTime}
								<span class="text-xs text-gray-500">
									Antwortzeit: {responseTime}s
								</span>
							{/if}
						</div>
					</div>
					<div class="prose prose-sm max-w-none text-gray-700 max-h-40 overflow-y-auto">
						{@html marked(aiResponse)}
					</div>
				</div>
			{/if}

			<!-- Navigation for next step -->
			<div class="mt-6 border-t border-gray-200 pt-4">
				<div class="flex justify-between">
					<button
						onclick={() => gotoNextStep?.()}
						style="background-color: {color};"
						class="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-colors"
					>
						Weiter
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
						</svg>
					</button>
				</div>
			</div>
		{/if}
</div>