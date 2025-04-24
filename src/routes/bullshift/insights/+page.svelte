<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div>
  <h1>Chat Traces</h1>
  <div>
    {#each data.records as record}
      <a class="block" href={`/bullshift/insights/${record.id}`}>{record.id}</a>
    {/each}
  </div>
</div>
