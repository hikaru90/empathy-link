<script lang="ts">
  import SparklePill from '$lib/components/SparklePill.svelte'

  interface Props {
    simplified?: boolean;
  }

  let { simplified = false }: Props = $props();
</script>

{#if simplified}
<div class="font-sans font-semibold flex items-center gap-1 text-xl">
  <div class="hide">
    Empathy
  </div>
  <div>
    <SparklePill class="shadow-md dark:shadow-gray-200/30" />
  </div>
  <div class="hide">
    Link
  </div>
</div>
{:else}
<div class="font-sans font-semibold flex items-center gap-1 text-xl">
  Empathy
  <div>
    <SparklePill class="shadow-md dark:shadow-gray-200/30" />
  </div>
  Link
</div>
{/if}

<style lang="scss">
.hide{
  animation: hide 400ms 2000ms forwards ease-out;
}
@keyframes hide{
  0% {
    @apply opacity-100 max-w-40 overflow-hidden;
  }
  80%{
    @apply opacity-100 max-w-0 overflow-hidden;
  }
  100%{
    @apply opacity-0 max-w-0 overflow-hidden;
  }
}
</style>

