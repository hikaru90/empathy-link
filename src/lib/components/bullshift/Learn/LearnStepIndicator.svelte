<script lang="ts">
  interface Props {
    topic: any;
    currentPage: number;
    currentCategory: any;
  }

  let { topic, currentPage, currentCategory }: Props = $props();
  
  // Calculate total steps including summary and completion pages
  const totalSteps = $derived(() => topic().content.length + 2); // +2 for summary and completion pages
</script>

<div class="flex items-center justify-center gap-1 bg-white/20 p-1 rounded-full shadow-xl">
  {#each Array.from({ length: totalSteps() }, (_, index) => index) as stepIndex}
    <div
      style="background-color: {currentPage >= stepIndex ? currentCategory().color : 'rgba(255,255,255,0.4)'}"
      class="h-2 w-4 rounded-full {stepIndex >= totalSteps() - 2 ? 'opacity-80' : ''}"
    ></div>
  {/each}
</div>