<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import DaterangePicker from '$lib/components/DaterangePicker.svelte';
	import FightOverview from '$lib/components/FightOverview.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
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
		if (!$user) goto('/auth/login');
	});
</script>

{#if $user}
	<div class="flex h-full flex-grow flex-col justify-between">
		<div class="flex-grow">
			<Menu />
			<div class="relative md:flex md:justify-center -mt-1">
				<div class="my-2">
					<div
						class="lcd-screen relative flex items-center gap-[4px] border border-black/10 bg-black/10 p-[2px] dark:bg-black/20 md:rounded"
					>
						<DaterangePicker on:rangeChanged={updateStore} class="w-full md:w-auto shadow" />
					</div>
				</div>
			</div>

			<div class="max-container relative">
				<div class="mb-10 flex flex-col items-start justify-between md:flex-row md:items-center border-b border-black/10 -mx-5 px-5 py-1">
					<h1 class="font-heading mb-2 text-xl font-semibold">Dashboard</h1>
				</div>

				<FightOverview />
			</div>
		</div>
	</div>
{/if}
