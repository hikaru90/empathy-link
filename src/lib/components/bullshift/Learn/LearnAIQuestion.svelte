<script lang="ts">
  import { Textarea } from '$lib/components/ui/textarea';
  import { Button } from '$lib/components/ui/button';
  import { marked } from 'marked';
  import type { AIQuestionBlock } from '$routes/bullshift/learn/[slug]/edit/schema';
  import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
  import SendHorizontal from 'lucide-svelte/icons/send-horizontal';
  import Loader2 from 'lucide-svelte/icons/loader-2';
  import { getLearningContext } from '$lib/contexts/learningContext';
  import LearnStepComponent from './LearnStepComponent.svelte';

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
  let isLoading = $state(false);
  let hasSubmitted = $state(false);
  let responseTime = $state<number | null>(null);
  let currentStep = $state<'question' | 'response'>('question');
  let errorMessage = $state('');
  
  // Component step management
  let updateSteps: ((newCurrentStep: number, newTotalSteps?: number) => void) | null = null;

  // Load existing response and compute step state globally
  $effect(() => {
    if (session && !isPreview) {
      const existingResponse = session.responses.find(
        r => r.pageIndex === pageIndex && r.blockIndex === blockIndex && r.blockType === 'aiQuestion'
      );
      if (existingResponse) {
        userAnswer = existingResponse.response.userAnswer || '';
        aiResponse = existingResponse.response.aiResponse || '';
        hasSubmitted = !!(existingResponse.response.userAnswer && existingResponse.response.aiResponse);
        responseTime = existingResponse.response.responseTime || null;
      }
      
      // Use global step computation
      const computedStep = learningContext?.computeComponentStep?.(pageIndex, blockIndex, 'aiQuestion', session) || 1;
      currentStep = computedStep === 2 ? 'response' : 'question';
      learningContext?.setAIQuestionStep?.(currentStep);
      updateSteps?.(computedStep);
      // Persist initial step state globally for editor preview
      learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', computedStep, 2);
    } else if (isPreview) {
      // For preview, setup sample data and respect global step computation
      userAnswer = 'Dies ist eine Beispielantwort für die Vorschau.';
      aiResponse = 'Das ist eine sehr durchdachte Antwort! Hier sind einige zusätzliche Punkte zu bedenken...';
      hasSubmitted = true;
      responseTime = 3;
      
      // Use global step computation for preview too - don't always reset to step 1!
      const computedStep = learningContext?.computeComponentStep?.(pageIndex, blockIndex, 'aiQuestion', null) || 1;
      currentStep = computedStep === 2 ? 'response' : 'question';
      learningContext?.setAIQuestionStep?.(currentStep);
      updateSteps?.(computedStep);
      // Only persist the step if it's the initial default, don't override stored state
      if (computedStep === 1) {
        learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', computedStep, 2);
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
    if (!userAnswer.trim() || isLoading || isPreview) return;

    isLoading = true;
    errorMessage = ''; // Clear any previous errors
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

      // Transition to response step instead of navigating to next page
      currentStep = 'response';
      learningContext?.setAIQuestionStep?.('response');
      updateSteps?.(2); // Update to step 2
      // Persist step state globally for editor preview
      learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', 2, 2);

    } catch (error) {
      console.error('Error getting AI response:', error);
      errorMessage = 'Sorry, I couldn\'t process your answer right now. Please try again.';
      hasSubmitted = false; // Don't mark as submitted if there was an error
      
      // Stay on question step for retry
      currentStep = 'question';
      learningContext?.setAIQuestionStep?.('question');
      updateSteps?.(1); // Stay on step 1
      // Persist step state globally for editor preview
      learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', 1, 2);
    } finally {
      isLoading = false;
    }
  };

  const editAnswer = () => {
    if (isPreview) return;
    hasSubmitted = false;
    aiResponse = '';
    responseTime = null;
    errorMessage = '';
    currentStep = 'question';
    learningContext?.setAIQuestionStep?.('question');
    updateSteps?.(1); // Update to step 1
    // Persist step state globally for editor preview
    learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', 1, 2);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submitAnswer();
    }
  };
</script>

<LearnStepComponent 
  {pageIndex} 
  {blockIndex} 
  componentType="aiQuestion" 
  totalSteps={2} 
  currentStep={currentStep === 'question' ? 1 : 2}
  let:updateSteps={stepUpdateFn}
>
  {#if !updateSteps}
    <!-- Initialize updateSteps reference -->
    {(updateSteps = stepUpdateFn) && ''}
  {/if}
  
  <div class="space-y-4 rounded-lg bg-white/10 p-4 backdrop-blur">
  {#if currentStep === 'question'}
    <!-- Question Step -->
    <div class="space-y-2">
      <h3 class="font-medium text-gray-900">
        {@html marked(content.question)}
      </h3>
    </div>

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
      
      <!-- Error message display -->
      {#if errorMessage}
        <div class="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <p class="text-sm text-red-800">{errorMessage}</p>
        </div>
      {/if}
      
      <!-- Show option to view previous response if it exists -->
      {#if hasSubmitted && aiResponse && !isPreview}
        <div class="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-blue-800">
              <strong>Du hast bereits eine Antwort eingereicht.</strong>
            </div>
            <Button
              onclick={() => {
                currentStep = 'response';
                learningContext?.setAIQuestionStep?.('response');
                updateSteps?.(2); // Update to step 2
                // Persist step state globally for editor preview
                learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', 2, 2);
              }}
              variant="ghost"
              size="sm"
              class="text-blue-600 hover:text-blue-800"
            >
              Antwort ansehen
            </Button>
          </div>
        </div>
      {/if}
      
      <!-- Navigation for question step - same for both preview and real -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex justify-between">
          <Button
            onclick={() => learningContext?.gotoPrevPage()}
            variant="outline"
            class="flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Zurück
          </Button>
          
          <!-- Show next button only if answer is submitted -->
          {#if hasSubmitted && aiResponse}
            <Button
              onclick={() => {
                currentStep = 'response';
                learningContext?.setAIQuestionStep?.('response');
                updateSteps?.(2); // Update to step 2
                // Persist step state globally for editor preview
                learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', 2, 2);
              }}
              style="background-color: {color};"
              class="text-white hover:opacity-90 flex items-center gap-2"
            >
              KI-Antwort ansehen
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </Button>
          {/if}
        </div>
      </div>
    </div>

    <!-- Loading State -->
    {#if isLoading}
      <div class="flex items-center justify-center space-x-2 py-4">
        <Loader2 class="size-5 animate-spin" style="color: {color};" />
        <span class="text-sm text-gray-600">KI denkt nach...</span>
      </div>
    {/if}

  {:else if currentStep === 'response'}
    <!-- Response Step -->
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

    <!-- Navigation buttons for response step - same for both preview and real -->
    <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
      <Button
        onclick={() => {
          if (isPreview) {
            currentStep = 'question';
            learningContext?.setAIQuestionStep?.('question');
            updateSteps?.(1); // Update to step 1
            // Persist step state globally for editor preview
            learningContext?.updateComponentStepState?.(pageIndex, blockIndex, 'aiQuestion', 1, 2);
          } else {
            editAnswer();
          }
        }}
        variant="outline"
        class="flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Zurück zur Frage
      </Button>
      
      <Button
        onclick={() => learningContext?.gotoNextPage()}
        style="background-color: {color};"
        class="text-white hover:opacity-90 flex items-center gap-2"
      >
        Weiter
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </Button>
    </div>
  {/if}
  </div>
</LearnStepComponent> 