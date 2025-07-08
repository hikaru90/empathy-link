<script lang="ts">
  import { Textarea } from '$lib/components/ui/textarea';
  import { Button } from '$lib/components/ui/button';
  import { marked } from 'marked';
  import type { AIQuestionBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
  import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
  import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
  import Loader2 from 'lucide-svelte/icons/loader-2';

  interface Props {
    content: AIQuestionBlock;
    color: string;
    pageIndex: number;
    blockIndex: number;
    session: LearningSession | null;
    onResponse: (response: { userAnswer: string; aiResponse: string; timestamp: string; responseTime?: number; }) => void;
    topicVersionId?: string;
    contentBlock?: AIQuestionBlock;
  }

  let { content, color, pageIndex, blockIndex, session, onResponse, topicVersionId, contentBlock }: Props = $props();

  let userAnswer = $state('');
  let aiResponse = $state('');
  let isLoading = $state(false);
  let hasSubmitted = $state(false);
  let responseTime = $state<number | null>(null);

  // Load existing response if available
  $effect(() => {
    if (session) {
      const existingResponse = session.responses.find(
        r => r.pageIndex === pageIndex && r.blockIndex === blockIndex && r.blockType === 'aiQuestion'
      );
      if (existingResponse) {
        userAnswer = existingResponse.response.userAnswer || '';
        aiResponse = existingResponse.response.aiResponse || '';
        hasSubmitted = !!(existingResponse.response.userAnswer && existingResponse.response.aiResponse);
        responseTime = existingResponse.response.responseTime || null;
      }
    }
  });

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

    } catch (error) {
      console.error('Error getting AI response:', error);
      aiResponse = 'Sorry, I couldn\'t process your answer right now. Please try again.';
      hasSubmitted = true;
    } finally {
      isLoading = false;
    }
  };

  const editAnswer = () => {
    hasSubmitted = false;
    aiResponse = '';
    responseTime = null;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submitAnswer();
    }
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
    <label class="block text-sm font-medium text-gray-700">
      Deine Antwort:
    </label>
    <div class="relative">
      <Textarea
        bind:value={userAnswer}
        placeholder={content.placeholder || "Schreibe deine Antwort hier..."}
        rows={4}
        disabled={hasSubmitted || isLoading}
        class="resize-none"
        onkeydown={handleKeyDown}
      />
      {#if !hasSubmitted}
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
      {/if}
    </div>
    {#if !hasSubmitted}
      <p class="text-xs text-gray-500">
        Tipp: Drücke Strg+Enter um deine Antwort zu senden
      </p>
    {/if}
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
          <Button
            onclick={editAnswer}
            variant="ghost"
            size="sm"
            class="text-xs"
          >
            Bearbeiten
          </Button>
        </div>
      </div>
      <div class="prose prose-sm max-w-none text-gray-700">
        {@html marked(aiResponse)}
      </div>
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