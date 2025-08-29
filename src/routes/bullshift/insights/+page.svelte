<script lang="ts">
  import type { PageData } from './$types';
  import Footer from '$lib/components/bullshift/Footer.svelte';
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<div>
  <h1>Chat Traces</h1>
  <div>
    {#each data.records as record}
      <a class="block" href={`/bullshift/insights/${record.id}`}>{record.id}</a>
    {/each}
  </div>
</div>

<Footer user={data.user} />
