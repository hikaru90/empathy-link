<script lang="ts">
  interface Props {
    topic: any;
    currentPage: number;
    currentCategory: any;
  }

  let { topic, currentPage, currentCategory }: Props = $props();
</script>

<div class="flex items-center justify-center gap-1 bg-white/20 p-1 rounded-full shadow-xl">
  {#each topic().content as page, index}
    <div
      style="background-color: {currentPage >= index ? currentCategory().color : 'rgba(255,255,255,0.4)'}"
      class="h-2 w-4 rounded-full"
    ></div>
  {/each}
</div>