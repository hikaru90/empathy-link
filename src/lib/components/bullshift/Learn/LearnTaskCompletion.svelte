<script lang="ts">
  import { learningSession } from '$lib/stores/learningSession';
  import { onMount } from 'svelte';
  	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
  
	interface Props {
		content: {
			taskId?: string;
			allowNotes?: boolean;
			notesPlaceholder?: string;
		};
		color: string;
		pageIndex: number;
		blockIndex: number;
		session: LearningSession | null;
		onResponse: (response: { completed: boolean; notes?: string; timeSpent?: number }) => void;
	}

	let { content, color, pageIndex, blockIndex, session, onResponse }: Props = $props();
	
	let isCompleted = $state(false);
	let notes = $state('');
	let startTime = $state<number | null>(null);
	let timeSpent = $state(0);

	// Load existing response if available
	onMount(() => {
		if (!session) return;
		const existingResponse = learningSession.getResponse(session, pageIndex, blockIndex);
		if (existingResponse && existingResponse.blockType === 'taskCompletion') {
			isCompleted = existingResponse.response.completed || false;
			notes = existingResponse.response.notes || '';
			timeSpent = existingResponse.response.timeSpent || 0;
		}
	});

	const markCompleted = async () => {
		if (!isCompleted && startTime) {
			timeSpent = Math.floor((Date.now() - startTime) / 1000);
		}
		isCompleted = !isCompleted;
		
		if (isCompleted && !startTime) {
			startTime = Date.now();
		}
		
		// Use immediate save for completion status (important action)
		if (session) {
			await learningSession.saveResponseImmediate(session.id, pageIndex, blockIndex, 'taskCompletion', {
				completed: isCompleted,
				notes: notes || undefined,
				timeSpent: timeSpent || undefined
			});
		}
	};

	const updateNotes = (value: string) => {
		notes = value;
		// Use debounced save for notes (frequent updates)
		onResponse({
			completed: isCompleted,
			notes: notes || undefined,
			timeSpent: timeSpent || undefined
		});
	};
</script>

<div class="rounded-xl bg-white/20 px-4 py-4 mb-4">
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <button
        onclick={markCompleted}
        class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors {isCompleted 
          ? 'bg-green-500 text-white' 
          : 'bg-white/50 text-gray-700 hover:bg-white/70'}"
      >
        <div class="w-4 h-4 rounded border-2 flex items-center justify-center {isCompleted 
          ? 'border-white bg-white' 
          : 'border-gray-400'}"
        >
          {#if isCompleted}
            <svg class="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          {/if}
        </div>
        {isCompleted ? 'Abgeschlossen' : 'Als abgeschlossen markieren'}
      </button>
      
      {#if timeSpent > 0}
        <span class="text-xs text-gray-600">
          Zeit: {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
        </span>
      {/if}
    </div>
    
    {#if content.allowNotes !== false}
      <div>
        <label for="task-completion-notes-{pageIndex}-{blockIndex}" class="block text-sm font-medium text-gray-700 mb-1">
          Notizen (optional)
        </label>
        <textarea
          id="task-completion-notes-{pageIndex}-{blockIndex}"
          bind:value={notes}
          oninput={(e) => updateNotes((e.target as HTMLTextAreaElement).value)}
          placeholder={content.notesPlaceholder || "Fügen Sie hier Ihre Notizen hinzu..."}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="2"
        ></textarea>
      </div>
    {/if}
  </div>
</div> 