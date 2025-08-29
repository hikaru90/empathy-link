<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { m } from '$lib/translations';
	import { goto } from '$app/navigation';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		data: any;
		user: App.User;
	}

	let { data, user }: Props = $props();

	let initialized = $state(false);
	let pending = true;
	let records: any[] = [];

	const gotoFight = (id) => {
		console.log('gotoFight');
		goto(`/app/fights/${id}`);
	};

	let showMore = $state(false);

	onMount(async () => {
		initialized = true;
		pending = false;
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}

	<div class="relative z-0">
		<div
			style="background: radial-gradient(circle at center, rgba(255,255,255,0.7), transparent 67%);"
			class="absolute left-0 top-20 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform dark:opacity-10 opacity-60 pointer-events-none"
		></div>
	</div>
	<div class="relative z-10">
		<div
			class="rounded-t-xl border-b border-black/5 bg-offwhite px-5 pb-3 pt-4 shadow-2xl shadow-black/10 dark:bg-muted"
		>
			<div class="flex items-center justify-between">
				<h2 class="text-md mb-2 font-bold">Meine Reflektionen</h2>
				<a
						href="/bullshift/stats/chats"
						class="rounded-full border border-needs-foreground/20 px-2 py-1 text-xs"
						>Alle anzeigen</a>
			</div>
			<div class="flex items-center text-2xs">
				<div class="w-1/6">
					{m.page_dashboard_fights_table_date()}
				</div>
				<div class="w-1/3 flex-grow">Titel</div>
				<div class="w-1/6"></div>
			</div>
		</div>
		<div
			class="rounded-b-xl bg-offwhite px-4 pb-3 pt-2 shadow-2xl shadow-black/10 dark:bg-muted"
		>
			{#each data as record, index}
				{#if showMore || index < 5}
					<a href={`/bullshift/stats/chats/${record.id}`}
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
							<div
								class="skeumorphic-button flex size-5 items-center justify-center rounded-full group-hover:bg-white group-hover:text-black"
							>
								<ChevronRight class="size-3 rounded-full" />
							</div>
						</div>
					</a>
				{/if}
			{/each}
			<!-- <div class="flex justify-center pt-4">
				{#if !showMore}
					<button
						onclick={() => (showMore = true)}
						class="rounded-full border border-needs-foreground/20 px-2 py-1 text-xs"
						>Mehr anzeigen</button
					>
				{:else}
					<button
						onclick={() => (showMore = false)}
						class="rounded-full border border-needs-foreground/20 px-2 py-1 text-xs"
						>Weniger anzeigen</button
					>
				{/if}
			</div> -->
		</div>
	</div>
{/if}

<style lang="scss">
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
