<script lang="ts">
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	
</script>

<div class="max-container py-10">
	<div class="mb-10">
		<h1 class="text-lg font-bold">Chat Memory</h1>
	</div>

	{JSON.stringify(data.records)}

</div>
