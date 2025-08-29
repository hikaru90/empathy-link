<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import GardenView from '$lib/components/Garden/GardenView.svelte';
	import SeedInventory from '$lib/components/Garden/SeedInventory.svelte';
	import type { PageData } from './$types';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { clsx } from 'clsx';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let isLoading = $state(true);
	let infoDrawerActive = $state('300px');

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
						<SeedInventory userSeeds={data.userSeeds} />
						
						<!-- Garden Info Button -->
						<Drawer.Root snapPoints={['300px', 1]} bind:activeSnapPoint={infoDrawerActive}>
							<Drawer.Trigger>
								<button class="flex items-center gap-2 rounded-lg border border-white/20 bg-white/80 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-700/90">
									<span class="text-lg">❓</span>
									<span class="font-semibold text-gray-900 dark:text-white">Info</span>
								</button>
							</Drawer.Trigger>
							<Drawer.Overlay class="fixed inset-0 bg-black/40" />
							<Drawer.Portal>
								<Drawer.Content class="fixed flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
									<div
										class={clsx("flex flex-col max-w-md mx-auto w-full p-4 pt-5", {
											"overflow-y-auto": infoDrawerActive === 1,
											"overflow-hidden": infoDrawerActive !== 1,
										})}
									>
										<div class="flex items-center justify-center gap-2 mb-4">
											<span class="text-lg">🌱</span>
											<h1 class="text-2xl font-medium text-gray-900 dark:text-white">Wie funktioniert der Garten?</h1>
										</div>

										<div class="space-y-4">
											<div class="flex items-start gap-3">
												<span class="text-2xl">💬</span>
												<div>
													<h3 class="font-medium text-gray-900 dark:text-white mb-1">
														Gespräche abschließen
													</h3>
													<p class="text-gray-600 dark:text-gray-300">
														Klicke auf "Chat Abschließen" um Samen zu verdienen
													</p>
												</div>
											</div>
											<div class="flex items-start gap-3">
												<span class="text-2xl">🌱</span>
												<div>
													<h3 class="font-medium text-gray-900 dark:text-white mb-1">
														Pflanzen kaufen
													</h3>
													<p class="text-gray-600 dark:text-gray-300">
														Verwende deine Samen um Blumen, Bäume und Dekorationen zu kaufen
													</p>
												</div>
											</div>
											<div class="flex items-start gap-3">
												<span class="text-2xl">🌤️</span>
												<div>
													<h3 class="font-medium text-gray-900 dark:text-white mb-1">
														Wetter & Stimmung
													</h3>
													<p class="text-gray-600 dark:text-gray-300">
														Das Wetter in deinem Garten spiegelt deine aktuelle Stimmung wider
													</p>
												</div>
											</div>
										</div>
									</div>
								</Drawer.Content>
							</Drawer.Portal>
						</Drawer.Root>
					</div>

					<!-- Garden Stats -->
					<div class="flex gap-4 text-sm text-gray-600 dark:text-gray-300">
						<div class="flex items-center gap-2">
							<span class="text-green-500">🌿</span>
							<span>{data.garden.total_plants} Pflanzen</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-500">🌤️</span>
							<span class="capitalize">{data.garden.current_weather}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-purple-500">⭐</span>
							<span>Level {data.garden.garden_level}</span>
						</div>
					</div>
				</div>

				<!-- Main Garden View -->
				<GardenView 
					garden={data.garden} 
					userSeeds={data.userSeeds}
					plantsAvailable={data.plantsAvailable}
					currentWeather={data.garden.current_weather}
				/>

			{/if}
	</main>

	<Footer user={data.user} class="flex-shrink-0 z-10" />
</div>