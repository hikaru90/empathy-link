<script lang="ts">
	

	export let step: number;
	export let steps: object[];

	
</script>

<div
	class="my-2 flex items-center justify-between gap-2 rounded-full p-1 bg-black bg-opacity-10 shadow-lg"
>
	{#each steps as entry, index}
		<div
			class="{`bg-${entry.slug}-background text-${entry.slug}-foreground`} flex items-center gap-1 rounded-full p-1"
		>
			<div class="flex h-5 w-5 items-center justify-center rounded-full {`fill-${entry.slug}-foreground`}">
        {@html entry.icon}
			</div>
			{#if step === index + 1}
      <span class="text-sm mr-2">
        {entry.name}
      </span>
			{/if}
		</div>
	{/each}
</div>
