<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { t, locale } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { goto } from '$app/navigation';
	import { user } from '$store/auth';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	export let data;

	let initialized = false;
	let pending = true;
	let records: any[] = [];

	const gotoFight = (id) => {
		console.log('gotoFight');
		goto(`/app/fights/${id}`);
	};

	let showMore = false;

	onMount(async () => {
		initialized = true;
		pending = false;

		console.log('$user', $user);
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="relative z-0">
		<div
			style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);"
			class="absolute left-0 top-20 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform dark:opacity-10"
		></div>
	</div>
	<div class="relative z-10">
		<div
			class="rounded-t-xl border-b border-black/5 bg-almostwhite px-5 pb-3 pt-4 shadow-2xl shadow-black/10 dark:bg-muted"
		>
			<h2 class="text-md mb-2 font-bold">Chats</h2>
			<div class="flex items-center text-2xs">
				<div class="w-1/6">
					{$t('default.page.dashboard.fights.table.date')}
				</div>
				<div class="w-1/3 flex-grow">Titel</div>
				<div class="w-1/6"></div>
			</div>
		</div>
		<div
			class="rounded-b-xl bg-almostwhite px-4 pb-3 pt-2 shadow-2xl shadow-black/10 dark:bg-muted"
		>
			{#each data as record, index}
				{#if showMore || index < 3}
					<button
						on:click={gotoFight(record.id)}
						class="group flex w-full items-center border-b border-black/5 py-2 text-left text-xs last:border-b-0 sm:py-3"
					>
						<div class="w-1/6">
							{new Intl.DateTimeFormat('de-DE', {
								month: 'short',
								day: 'numeric'
								// year: 'numeric',
							}).format(new Date(record.created))}
						</div>
						<div class="mr-2 w-1/3 flex-grow overflow-hidden whitespace-nowrap">
							{record.title}
						</div>
						<div class="flex w-1/6 justify-end">
							<div class="skeumorphic-button rounded-full p-1">
								<ChevronRight
									class="size-3 rounded-full group-hover:bg-neutral-300 group-hover:text-black"
								/>
							</div>
						</div>
					</button>
				{/if}
			{/each}
			<div class="flex justify-center pt-4">
				{#if !showMore}
					<button
						on:click={() => (showMore = true)}
						class="rounded-full border border-needs-foreground/20 px-2 py-1 text-xs"
						>Mehr anzeigen</button
					>
				{:else}
					<button
						on:click={() => (showMore = false)}
						class="rounded-full border border-needs-foreground/20 px-2 py-1 text-xs"
						>Weniger anzeigen</button
					>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
