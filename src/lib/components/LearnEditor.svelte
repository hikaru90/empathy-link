<script lang="ts">
  import { onMount } from 'svelte';

  const { currentPage, topicId } = $props();

  console.log('currentPage',currentPage);

  const getVersions = async () => {
    console.log('topicId',topicId);
    // const response = await fetch(`/api/versions/${data.id}`);
    // const data = await response.json();
    // return data;
  };
  
  onMount(async () => {
    const versions = await getVersions();
    console.log(versions);
  });
</script>

Editor
