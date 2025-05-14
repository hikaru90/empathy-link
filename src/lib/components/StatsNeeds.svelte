<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$lib/translations';
	import { generateHslaColors } from '$scripts/helpers';
	import Donut from '$lib/components/Donut.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let pending = true;
	let colors = generateHslaColors(179, 100, 15, data.length);
	let showMore = $state(false);

	onMount(async () => {
		pending = false;
	});
</script>

<div class="relative">
	<div
		style="background: radial-gradient(circle at center, hsl(var(--needs-background) / 1), transparent 67%);"
		class="absolute right-0 top-60 z-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 transform opacity-50 dark:opacity-40"
	></div>
	<div
		class="relative z-10 rounded-lg bg-needs-background text-needs-foreground shadow-2xl shadow-black/10 dark:bg-muted"
	>
		<div class="flex items-center justify-between px-4 pb-2 pt-3">
			<h2 class="text-md mb-2 font-bold">
				{$t('default.page.dashboard.needs.heading')}
			</h2>
		</div>
		<div class="flex items-center justify-center">
			{#if data}
				{#key data.length}
					<Donut {colors} {data} />
				{/key}
			{/if}
		</div>
		<div class="px-4 pb-3 pt-2">
			{#if data.length === 0}
				{$t('default.page.dashboard.needs.empty')}
			{:else}
				{#each data as need, index}
				{#if showMore || index < 3}
						<div
							class="flex items-center justify-between border-t border-needs-foreground/20 py-1 first:border-t-0"
						>
							<div class="flex items-center gap-4">
								<div style="background-color: {colors[index]};" class="h-3 w-5 rounded-full"></div>
								<span>
									{need.value}
								</span>
							</div>
							<span>
								{need.count}
							</span>
						</div>
					{/if}
				{/each}
				<div class="flex justify-center pt-4">
					{#if !showMore}
					<button onclick={() => (showMore = true)} class="text-xs rounded-full border border-needs-foreground/20 px-2 py-1">Mehr anzeigen</button>
					{:else}
					<button onclick={() => (showMore = false)} class="text-xs rounded-full border border-needs-foreground/20 px-2 py-1">Weniger anzeigen</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	:global(.solid-button) {
		@apply border-2 border-needs-foreground/0 bg-needs-foreground/60 hover:border-needs-foreground/60 hover:bg-needs-foreground;
	}
	:global(.border-button) {
		@apply border-2 border-needs-foreground/60 bg-transparent text-needs-foreground/60 hover:border-needs-foreground hover:bg-transparent hover:text-needs-foreground;
	}
</style>
