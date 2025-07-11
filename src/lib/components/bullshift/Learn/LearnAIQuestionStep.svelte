<script lang="ts">
  import { Textarea } from '$lib/components/ui/textarea';
  import { Button } from '$lib/components/ui/button';
  import { marked } from 'marked';
  import type { AIQuestionBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
  import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
  import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
  import Loader2 from 'lucide-svelte/icons/loader-2';
  import { getLearningContext } from '$lib/contexts/learningContext';

  interface Props {
    content: AIQuestionBlock;
    color: string;
    pageIndex: number;
    blockIndex: number;
    session: LearningSession | null;
    onResponse: (response: { userAnswer: string; aiResponse: string; timestamp: string; responseTime?: number; }) => void;
    topicVersionId?: string;
    contentBlock?: AIQuestionBlock;
    isPreview?: boolean;
  }

  let { content, color, pageIndex, blockIndex, session, onResponse, topicVersionId, contentBlock, isPreview = false }: Props = $props();

  const learningContext = getLearningContext();

  let userAnswer = $state('');
  let isLoading = $state(false);

  // Load existing response if available
  $effect(() => {
    if (session && !isPreview) {
      const existingResponse = session.responses.find(
        r => r.pageIndex === pageIndex && r.blockIndex === blockIndex && r.blockType === 'aiQuestion'
      );
      if (existingResponse && existingResponse.response.userAnswer) {
        userAnswer = existingResponse.response.userAnswer || '';
        // If we already have both user answer and AI response, auto-advance to next page
        if (existingResponse.response.aiResponse) {
          setTimeout(() => {
            learningContext?.gotoNextPage();
          }, 100);
        }
      }
    }
  });

  const submitAnswer = async () => {
    if (!userAnswer.trim() || isLoading || isPreview) return;

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

      // Auto-advance to next page to show the AI response
      setTimeout(() => {
        learningContext?.gotoNextPage();
      }, 500);

    } catch (error) {
      console.error('Error getting AI response:', error);
      // Save error response and advance
      onResponse({
        userAnswer: userAnswer.trim(),
        aiResponse: 'Sorry, I couldn\'t process your answer right now. Please try again.',
        timestamp: new Date().toISOString()
      });
      
      setTimeout(() => {
        learningContext?.gotoNextPage();
      }, 500);
    } finally {
      isLoading = false;
    }
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
        disabled={isLoading || isPreview}
        class="resize-none"
        onkeydown={handleKeyDown}
      />
      {#if !isPreview}
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
    {#if !isPreview}
      <p class="text-xs text-gray-500">
        Tipp: Drücke Strg+Enter um deine Antwort zu senden
      </p>
    {/if}
  </div>

  <!-- Loading State -->
  {#if isLoading}
    <div class="flex items-center justify-center space-x-2 py-4">
      <Loader2 class="size-5 animate-spin" style="color: {color};" />
      <span class="text-sm text-gray-600">KI denkt nach...</span>
    </div>
  {/if}
</div>