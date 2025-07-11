<script lang="ts">
  import { marked } from 'marked';
  import { getLearningContext } from '$lib/contexts/learningContext';
  import StoryNavigation from './StoryNavigation.svelte';
  
	interface Props {
		content: {
			duration?: number;
			content: string;
		};
		color: string;
		isPreview?: boolean;
	}

	let { content, color, isPreview = false }: Props = $props();

	const durationString = $derived(content.duration && content.duration > 60 ? `${content.duration / 60} min` : `${content.duration} s`);

	let isCompleted = $state(false);

	const learningContext = getLearningContext();

	const markCompleted = () => {
		isCompleted = true;
		
		// Auto-advance after brief delay
		if (!isPreview) {
			learningContext?.autoAdvanceAfter(1500);
		}
	};
</script>

<div class="rounded-xl bg-white/20 px-3 py-4 mb-4">
	<div class="flex items-center text-xs rounded-full mb-4">
		<div class="py-0.5 flex-shrink-0 flex-grow">
			Zeit zu üben
		</div>
		{#if content.duration !== undefined}
			<div class="bg-white px-2 py-0.5 rounded-full flex-shrink-0">
				Dauer: {durationString}
			</div>
		{/if}
	</div>
  {@html marked(content.content)}
  
  {#if !isCompleted && !isPreview}
    <button 
      onclick={markCompleted}
      class="mt-4 w-full py-2 px-4 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-medium"
    >
      Mark as Completed
    </button>
  {:else if isCompleted}
    <div class="mt-4 flex items-center justify-center gap-2 text-green-300">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      <span class="font-medium">Completed!</span>
    </div>
  {/if}

  <!-- Manual navigation for uncompleted tasks -->
  {#if !isCompleted && !isPreview}
    <StoryNavigation 
      variant="minimal"
      nextText="Skip"
      nextDisabled={false}
      {isPreview}
    />
  {/if}
</div>
