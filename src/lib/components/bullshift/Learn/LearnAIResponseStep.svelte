<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { marked } from 'marked';
  import type { AIQuestionBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
  import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
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
  let aiResponse = $state('');
  let responseTime = $state<number | null>(null);

  // Load existing response if available
  $effect(() => {
    if (session && !isPreview) {
      const existingResponse = session.responses.find(
        r => r.pageIndex === pageIndex && r.blockIndex === blockIndex && r.blockType === 'aiQuestion'
      );
      if (existingResponse) {
        userAnswer = existingResponse.response.userAnswer || '';
        aiResponse = existingResponse.response.aiResponse || '';
        responseTime = existingResponse.response.responseTime || null;
      }
    } else if (isPreview) {
      // For preview, show sample data
      userAnswer = 'Dies ist eine Beispielantwort für die Vorschau.';
      aiResponse = 'Das ist eine sehr durchdachte Antwort! Hier sind einige zusätzliche Punkte zu bedenken...';
      responseTime = 3;
    }
  });

  const editAnswer = () => {
    if (isPreview) return;
    // Go back to the previous page (question step)
    learningContext?.gotoPrevPage();
  };
</script>

<div class="space-y-4 rounded-lg bg-white/10 p-4 backdrop-blur">
  <!-- Question (for context) -->
  <div class="space-y-2">
    <h3 class="font-medium text-gray-900">
      {@html marked(content.question)}
    </h3>
  </div>

  <!-- User's Answer -->
  <div class="space-y-2 rounded-lg bg-blue-50 p-4">
    <h4 class="font-medium text-gray-900">Deine Antwort:</h4>
    <div class="prose prose-sm max-w-none text-gray-700">
      {userAnswer}
    </div>
  </div>

  <!-- AI Response -->
  {#if aiResponse}
    <div class="space-y-2 rounded-lg bg-gray-50 p-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900">KI-Antwort:</h4>
        <div class="flex items-center gap-2">
          {#if responseTime}
            <span class="text-xs text-gray-500">
              Antwortzeit: {responseTime}s
            </span>
          {/if}
          {#if !isPreview}
            <Button
              onclick={editAnswer}
              variant="ghost"
              size="sm"
              class="text-xs"
            >
              Antwort bearbeiten
            </Button>
          {/if}
        </div>
      </div>
      <div class="prose prose-sm max-w-none text-gray-700">
        {@html marked(aiResponse)}
      </div>
    </div>
  {:else}
    <div class="rounded-lg bg-gray-50 p-4">
      <p class="text-gray-500 text-center">Keine KI-Antwort verfügbar.</p>
    </div>
  {/if}
</div>