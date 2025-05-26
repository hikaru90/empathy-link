<script lang="ts">
	interface Props {
		content: object;
	}

	let { content }: Props = $props();
</script>

{#if content.hierarchy === 1}
<h1 class="mt-10 mb-6 text-xl font-bold">{content.content}</h1>
{:else if content.hierarchy === 2}
<h2 class="mt-8 mb-4 text-lg font-bold">{content.content}</h2>
{:else if content.hierarchy === 3}
<h3 class="mt-6 mb-3 text-md font-bold">{content.content}</h3>
{/if}
