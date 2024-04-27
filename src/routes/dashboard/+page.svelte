<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import DaterangePicker from '$lib/components/DaterangePicker.svelte';
	import FightOverview from '$lib/components/FightOverview.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	import { startDate, endDate } from '$store/dashboard'

	export let data: PageData;

	const updateStore = (payload) => {
		// console.log('updateStore',payload.detail);
    startDate.set(payload.detail.start)
    endDate.set(payload.detail.end)
  }

</script>

<div class="flex h-full flex-grow flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<div class="max-container py-10 relative">
			
			<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
				<h1 class="font-semibold font-heading text-xl mb-2 md:mb-0">Dashboard</h1>
				<DaterangePicker on:rangeChanged={updateStore} class="w-full md:w-auto" />
			</div>

			<FightOverview />

		</div>
	</div>
</div>
