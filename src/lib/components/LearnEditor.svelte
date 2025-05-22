<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import type { TopicVersions } from '$routes/bullshift/learn/[id]/edit/schema';

	const { currentPage, topicId } = $props();

	let allVersions: TopicVersions[] = $state([]);

	console.log('currentPage', currentPage);

	const getVersions = async () => {
		try {
			const records = await pb.collection('topicVersions').getFullList({
				filter: `topic = "${topicId}"`
			});
			const data = serializeNonPOJOs(records) as TopicVersions[];
			allVersions = data;
			console.log('data', data);
		} catch (error) {
			console.error('Error getting versions:', error);
		}
	};

	onMount(async () => {
		const versions = await getVersions();
		console.log(versions);
	});
</script>


<div>
  {#each allVersions as version}
    <div>
      <p>{version.id}</p>
    </div>
  {/each}
</div>
