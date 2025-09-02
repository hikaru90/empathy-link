<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import GardenView from '$lib/components/Garden/GardenView.svelte';
	import SeedInventory from '$lib/components/Garden/SeedInventory.svelte';
	import type { PageData } from './$types';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import GardenInfoButton from '$lib/components/GardenInfoButton.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let isLoading = $state(true);
	let infoDrawerActive = $state('300px');

	const translatedWeather = $derived(data.garden.current_weather === 'sunny' ? 'Sonnig' : data.garden.current_weather === 'partly_cloudy' ? 'Teilweise bewölkt' : data.garden.current_weather === 'overcast' ? 'Bedeckt' : data.garden.current_weather === 'rainy' ? 'Regnerisch' : data.garden.current_weather === 'stormy' ? 'Stürmisch' : data.garden.current_weather === 'foggy' ? 'Nebelig' : data.garden.current_weather === 'snowy' ? 'Schneefall' : data.garden.current_weather);

	onMount(() => {
		isLoading = false;
	});
</script>

<svelte:head>
	<title>Community Garden - Empathy Link</title>
	<meta name="description" content="Tend your personal garden and connect with friends in our community space" />
</svelte:head>

<div class="h-svh bg-background flex flex-col">
	<Header user={data.user} class="flex-shrink-0 z-10" />
	<!-- Garden Info Button -->
	<GardenInfoButton />
	
	<main class="flex-1 relative">
			{#if isLoading}
				<div class="flex items-center justify-center min-h-96">
					<SparklePill fast={true} class="h-4 w-8 shadow-xl dark:shadow-gray-200/30" />
				</div>
			{:else}
				<!-- Garden Controls -->
				<div class="absolute top-16 z-10 flex justify-between items-center w-full px-4">
					<div class="flex gap-2">
						<!-- Seed Inventory -->
						<SeedInventory 
							userSeeds={data.userSeeds} 
							plantsAvailable={data.plantsAvailable}
							onPurchase={async (plantId) => {
								try {
									const response = await fetch('/api/garden/purchase', {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({ plantId })
									});

									if (response.ok) {
										// Invalidate all data to refresh seed count and inventory
										await invalidateAll();
									} else {
										const error = await response.text();
										console.error('Fehler beim Kauf:', error);
									}
								} catch (error) {
									console.error('Error purchasing:', error);
								}
							}}
						/>
						
					</div>

					<!-- Garden Stats -->
					<div class="flex gap-2.5 text-sm text-black/80">
						<div class="flex items-center gap-1.5">
							<span class="text-green-500">🌿</span>
							<span>{data.garden.total_plants} Pflanzen</span>
						</div>
						<div class="flex items-center gap-1.5">
							<span class="text-blue-500">🌤️</span>
							<span class="capitalize">{translatedWeather}</span>
						</div>
						<div class="flex items-center gap-1.5">
							<span class="text-purple-500">⭐</span>
							<span>Level {data.garden.garden_level}</span>
						</div>
					</div>
				</div>

				<!-- Main Garden View -->
				<GardenView class="relative z-0"
					garden={data.garden} 
					userSeeds={data.userSeeds}
					plantsAvailable={data.plantsAvailable}
					currentWeather={data.garden.current_weather}
				/>

			{/if}
	</main>

	<Footer user={data.user} class="flex-shrink-0 z-10" />
</div>