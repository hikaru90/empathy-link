<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t, locale } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import { groupBy, sortByKey, generateHslaColors } from '$scripts/helpers';
	import Donut from '$lib/components/Donut.svelte';

	interface Props {
		data: any;
		user: App.User;
	}

	let { data, user }: Props = $props();

	let pending = true;
	let colors = generateHslaColors(1, 100, 56, data.length);
	let showMore = $state(false);

	onMount(async () => {
		pending = false;
	});
</script>

<div class="relative">
	<div
		style="background: radial-gradient(circle at center, hsl(var(--feelings-background) / 1), transparent 67%);"
		class="absolute right-0 top-60 z-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 transform opacity-50 dark:opacity-40"
	></div>
	<div
		class="relative z-10 rounded-lg bg-feelings-background text-feelings-foreground shadow-2xl shadow-black/10 dark:bg-muted"
	>
		<div class="flex items-center justify-between px-4 pb-2 pt-3">
			<h2 class="text-md mb-2 font-bold">
				{$t('default.page.dashboard.feelings.heading')}
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
				{$t('default.page.dashboard.feelings.empty')}
			{:else}
				{#each data as feeling, index}
				{#if showMore || index < 3}
						<div
							class="flex items-center justify-between border-t border-feelings-foreground/20 py-1 first:border-t-0"
						>
							<div class="flex items-center gap-4">
								<div style="background-color: {colors[index]};" class="h-3 w-5 rounded-full"></div>
								<span>
									{feeling.value}
								</span>
							</div>
							<span>
								{feeling.count}
							</span>
						</div>
					{/if}
				{/each}
				<div class="flex justify-center pt-4">
					{#if !showMore}
					<button onclick={() => (showMore = true)} class="text-xs rounded-full border border-feelings-foreground/20 px-2 py-1">Mehr anzeigen</button>
					{:else}
					<button onclick={() => (showMore = false)} class="text-xs rounded-full border border-feelings-foreground/20 px-2 py-1">Weniger anzeigen</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	:global(.solid-button) {
		@apply border-2 border-feelings-foreground/0 bg-feelings-foreground/60 hover:border-feelings-foreground/60 hover:bg-feelings-foreground;
	}
	:global(.border-button) {
		@apply border-2 border-feelings-foreground/60 bg-transparent text-feelings-foreground/60 hover:border-feelings-foreground hover:bg-transparent hover:text-feelings-foreground;
	}
</style>
