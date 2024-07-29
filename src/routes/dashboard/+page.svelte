<script lang="ts">
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import DaterangePicker from '$lib/components/DaterangePicker.svelte';
	import FightOverview from '$lib/components/FightOverview.svelte';
	import FeelingsOverview from '$lib/components/FeelingsOverview.svelte';
	import NeedsOverview from '$lib/components/NeedsOverview.svelte';
	import { startDate, endDate } from '$store/dashboard';
	import { user } from '$store/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const updateStore = (payload) => {
		// console.log('updateStore',payload.detail);
		startDate.set(payload.detail.start);
		endDate.set(payload.detail.end);
	};

	onMount(() => {
		console.log('data', data);
		console.log('onMount: $user', $user);
		const unsubscribe = user.subscribe(($user) => {
			console.log('$user in subscribe', $user);
			if (!$user) {
				goto('/auth/login');
			}
		});
		return unsubscribe;
	});
</script>

{#if $user}
	<div class="flex h-full flex-grow flex-col justify-between pb-60">
		<AppTopMenu />
		<div class="flex-grow">
			<div class="max-container relative">
				<div
					class="mb-8 flex flex-row items-start justify-between py-4 md:items-center md:bg-transparent md:pb-6"
				>
					<h1 class="font-heading text-lg font-semibold">Dashboard</h1>
				</div>

				<div class="mb-10">
					<FightOverview />
				</div>
				<div class="mb-10">
					<FeelingsOverview />
				</div>
				<div class="mb-10">
					<NeedsOverview />
				</div>
			</div>

			<AppBottomMenu>
				<div class="relative md:flex md:justify-center">
					<DaterangePicker on:rangeChanged={updateStore} class="w-full shadow flex-grow " />
				</div>
			</AppBottomMenu>
		</div>
	</div>
{:else}
	Login please
{/if}
