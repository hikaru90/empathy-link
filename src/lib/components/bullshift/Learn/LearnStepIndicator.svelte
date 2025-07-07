<script lang="ts">
  interface Props {
    topic: any;
    currentPage: number;
    currentCategory: any;
  }

  let { topic, currentPage, currentCategory }: Props = $props();
  
  // Calculate total steps including summary page only
  const totalSteps = $derived(() => {
    const topicData = topic();
    if (!topicData || !topicData.content) return 1; // Default to just summary if no content
    return topicData.content.length + 1; // +1 for summary page only
  });
</script>

<div class="flex items-center justify-center gap-1 bg-neutral-500/5 shadow-inner p-1 rounded-full">
  {#each Array.from({ length: totalSteps() }, (_, index) => index) as stepIndex}
    <div
      style="background-color: {currentPage >= stepIndex ? (currentCategory()?.color || '#666') : 'rgba(255,255,255,0.8)'}"
      class="h-2 w-4 rounded-full {stepIndex >= totalSteps() - 1 ? 'opacity-80' : ''}"
    ></div>
  {/each}
</div>