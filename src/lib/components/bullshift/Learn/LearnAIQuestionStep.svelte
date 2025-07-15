<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { Button } from '$lib/components/ui/button';
	import { learningSession } from '$lib/stores/learningSession';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
	import Loader2 from 'lucide-svelte/icons/loader-2';

	interface Props {
		content: any;
		color: string;
		pageIndex: number;
		blockIndex: number;
		session: LearningSession | null;
		contentBlock: any;
		topicVersionId: string;
		onResponse: (response: any) => void;
		onComplete?: () => void;
	}

	let { content, color, pageIndex, blockIndex, session, contentBlock, topicVersionId, onResponse, onComplete }: Props = $props();

	let userAnswer = $state('');
	let isLoading = $state(false);

	const submitAnswer = async () => {
		if (!userAnswer.trim() || isLoading) return;

		isLoading = true;
		const startTime = Date.now();

		try {
			const response = await fetch('/api/ai/learn/askQuestion', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
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
			const responseTime = Math.floor((endTime - startTime) / 1000);
			
			// Save the response
			onResponse({
				userAnswer: userAnswer.trim(),
				aiResponse: data.response,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			});

		} catch (error) {
			console.error('Error getting AI response:', error);
			// Save error response and advance
			onResponse({
				userAnswer: userAnswer.trim(),
				aiResponse: 'Sorry, I couldn\'t process your answer right now. Please try again.',
				timestamp: new Date().toISOString()
			});
			
		} finally {
			isLoading = false;
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			submitAnswer();
			return;
		}
		
		// Always prevent event bubbling to parent components
		event.stopPropagation();
	};
</script>

<div class="space-y-4 rounded-lg bg-white/10 p-4 backdrop-blur">
  <!-- Question -->
  <div class="space-y-2">
    <h3 class="font-medium text-gray-900">
      {@html marked(content.question)}
    </h3>
  </div>

  <!-- Answer Input -->
  <div class="space-y-2">
    <label for="user-answer-input" class="block text-sm font-medium text-gray-700">
      Deine Antwort:
    </label>
    <div class="relative">
      <Textarea
        id="user-answer-input"
        bind:value={userAnswer}
        placeholder={content.placeholder || "Schreibe deine Antwort hier..."}
        rows={4}
        disabled={isLoading}
        class="resize-none"
        onkeydown={handleKeyDown}
      />
      <div class="absolute bottom-2 right-2">
        <Button
          onclick={submitAnswer}
          disabled={!userAnswer.trim() || isLoading}
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
    <p class="text-xs text-gray-500">
      Tipp: Drücke Strg+Enter um deine Antwort zu senden
    </p>
  </div>

  <!-- Loading State -->
  {#if isLoading}
    <div class="flex items-center justify-center space-x-2 py-4">
      <Loader2 class="size-5 animate-spin" style="color: {color};" />
      <span class="text-sm text-gray-600">KI denkt nach...</span>
    </div>
  {/if}
</div>