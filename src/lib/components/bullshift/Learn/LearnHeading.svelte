<script lang="ts">
	interface Props {
		content: object;
	}

	let { content }: Props = $props();
</script>

{#if content.hierarchy === 1}
<h1 class="mb-4 text-xl font-bold">{content.content}</h1>
{:else if content.hierarchy === 2}
<h2 class="mb-4 text-lg font-bold">{content.content}</h2>
{:else if content.hierarchy === 3}
<h3 class="mb-4 text-md font-bold">{content.content}</h3>
{/if}
