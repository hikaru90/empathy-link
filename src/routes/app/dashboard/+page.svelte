<script lang="ts">
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import DaterangePicker from '$lib/components/DaterangePicker.svelte';
	import FightOverview from '$lib/components/FightOverview.svelte';
	import FeelingsOverview from '$lib/components/FeelingsOverview.svelte';
	import NeedsOverview from '$lib/components/NeedsOverview.svelte';
	import OnboardingWelcome from '$lib/components/OnboardingWelcome.svelte';
	import { startDate, endDate } from '$store/dashboard';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	interface Props {
		data: App.Locals;
	}

	let { data }: Props = $props();
	let popoverOpen = $state(false);
	let showOnboarding = $state(false);

	const updateStore = (payload) => {
		// console.log('updateStore',payload.detail);
		startDate.set(payload.detail.start);
		endDate.set(payload.detail.end);
	};

	const completeOnboarding = () => {
		showOnboarding = false;
		if (browser) {
			localStorage.setItem('onboardingCompleted', 'true');
		}
	};

	onMount(() => {
		if (browser) {
			const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
			if (!hasCompletedOnboarding) {
				showOnboarding = true;
			}
		}
	});
</script>

	<div class="app/dashboard/page bg-background overflow-hidden">
		<AppTopMenu user={data.user} />
		<div class="flex-grow">
			<div class="max-container relative">
				<div
					class="relative z-10 mb-8 flex flex-row items-center justify-between py-4 md:items-center md:bg-transparent md:pb-6"
				>
					<h1 class="font-heading text-lg font-semibold">Dashboard</h1>
					<button onclick={() => popoverOpen = true}
						class="mb-0.5 rounded-full bg-neutral-600 py-0.5 text-center text-2xs text-neutral-300 px-2"
					>
						{new Intl.DateTimeFormat('de-DE', {
							month: 'short',
							day: 'numeric'
							// year: 'numeric',
						}).format(new Date($startDate))}
						- {new Intl.DateTimeFormat('de-DE', {
							month: 'short',
							day: 'numeric',
							year: 'numeric'
						}).format(new Date($endDate))}
					</button>
				</div>

				<div class="mb-10">
					<FightOverview user={data.user} />
				</div>
				<div class="mb-10">
					<FeelingsOverview user={data.user} />
				</div>
				<div class="mb-10 pb-40">
					<NeedsOverview user={data.user} />
				</div>
			</div>

			<AppBottomMenu>
				<div class="relative md:flex md:justify-center w-full">
					<DaterangePicker on:rangeChanged={updateStore} bind:popoverOpen={popoverOpen} class="w-full flex-grow shadow " />
				</div>
			</AppBottomMenu>
		</div>

		{#if showOnboarding}
			<OnboardingWelcome onComplete={completeOnboarding} />
		{/if}
	</div>
