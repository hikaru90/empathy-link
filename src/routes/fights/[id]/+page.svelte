<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import DaterangePicker from '$lib/components/DaterangePicker.svelte';
	import FightOverview from '$lib/components/FightOverview.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t, locale } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard';
	import { NumberFormatter } from '@internationalized/number';
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { page } from '$app/stores';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Card from '$lib/components/ui/card';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';

	export let data: PageData;
	let initialized = false;
	let pending = true;
	let record = undefined;

	const fetchData = async () => {
		record = await pb.collection('fights').getOne($page.params.id, {
      expand: 'feelings, needs'
    });
	};

	onMount(async () => {
		await fetchData();
		initialized = true;
		pending = false;
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="flex h-full flex-grow flex-col justify-between">
		<div class="flex-grow">
			<Menu />

			<div class="max-container relative py-10">
				<div class="mb-10 flex flex-col items-start justify-between md:flex-row md:items-center">
					<h1 class="font-heading mb-2 text-xl font-semibold md:mb-0">
						{$t('default.page.fight.heading')}
						{$locale === 'en' ? 'with' : 'mit'}
						<span class="capitalize">
							{record.name}
						</span>
					</h1>
					<div>
						{$locale === 'en' ? 'on the' : 'am'}
						{new Intl.DateTimeFormat('de-DE').format(new Date($startDate))}
					</div>
				</div>

				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<div
								class="h-8 w-8 rounded-full bg-observation-background fill-observation-foreground p-1"
							>
								{@html IconEye}
							</div>
							{$t('default.page.fight.card.observation')}</Card.Title
						>
						<!-- <Card.Description>Card Description</Card.Description> -->
					</Card.Header>
					<Card.Content>
						<p>{record.observation}</p>
					</Card.Content>
					<div class="border-b border-input"></div>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<div
								class="h-8 w-8 rounded-full bg-feelings-background fill-feelings-foreground p-1"
							>
								{@html IconHeart}
							</div>
							{$t('default.page.fight.card.feelings')}</Card.Title
						>
					</Card.Header>
					<Card.Content class="flex flex-wrap gap-2">
            {#each Object.values(record.expand.feelings) as feeling}
            <div class="rounded-full bg-feelings-background fill-feelings-foreground px-3 py-0.5">
              {$locale === 'en' ? feeling.nameEN : feeling.nameDE}
            </div>
            {/each}
					</Card.Content>
					<div class="border-b border-input"></div>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<div
								class="h-8 w-8 rounded-full bg-needs-background fill-needs-foreground p-1"
							>
								{@html IconSwirl}
							</div>
							{$t('default.page.fight.card.needs')}</Card.Title
						>
					</Card.Header>
					<Card.Content class="flex flex-wrap gap-2">
						{#each Object.values(record.expand.needs) as need}
            <div class="rounded-full bg-needs-background fill-needs-foreground px-3 py-0.5">
              {$locale === 'en' ? need.nameEN : need.nameDE}
            </div>
            {/each}
					</Card.Content>
					<div class="border-b border-input"></div>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<div
								class="h-8 w-8 rounded-full bg-request-background fill-request-foreground p-1"
							>
								{@html IconSteps}
							</div>
							{$t('default.page.fight.card.request')}</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<p>{record.request}</p>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>
{/if}
