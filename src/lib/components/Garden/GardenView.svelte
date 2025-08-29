<script lang="ts">
	import { onMount } from 'svelte';
	import IsometricGrid from './IsometricGrid.svelte';
	import PlantShop from './PlantShop.svelte';
	import WeatherOverlay from './WeatherOverlay.svelte';

	interface Props {
		garden: {
			id: string;
			grid_data: {
				plots: Array<{
					x: number;
					y: number;
					type: string;
					plant_id: string | null;
					planted_at: string | null;
					growth_stage: number;
					last_watered: string | null;
				}>;
			};
			current_weather: string;
		};
		userSeeds: {
			seed_inventory: Record<string, number>;
		};
		plantsAvailable: Array<{
			id: string;
			name: string;
			category: string;
			seed_cost: number;
			description: string;
			rarity: string;
		}>;
		currentWeather: string;
	}

	let { garden, userSeeds, plantsAvailable, currentWeather }: Props = $props();

	let showShop = $state(false);
	let selectedPlot = $state<{ x: number; y: number } | null>(null);

	const handlePlotClick = (x: number, y: number) => {
		const plotIndex = y * 9 + x;
		const plot = garden.grid_data.plots[plotIndex];
		
		// If plot is empty, allow planting
		if (!plot.plant_id) {
			selectedPlot = { x, y };
			showShop = true;
		}
	};

	const handlePlantPurchase = async (plantId: string) => {
		if (!selectedPlot) return;
		
		try {
			const response = await fetch('/api/garden/plant', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					plotX: selectedPlot.x,
					plotY: selectedPlot.y,
					plantId: plantId
				})
			});

			if (response.ok) {
				// Refresh the page to show updated garden state
				window.location.reload();
			} else {
				const error = await response.text();
				alert('Fehler beim Pflanzen: ' + error);
			}
		} catch (error) {
			console.error('Error planting:', error);
			alert('Fehler beim Pflanzen');
		}

		showShop = false;
		selectedPlot = null;
	};

	const closeShop = () => {
		showShop = false;
		selectedPlot = null;
	};
</script>

<div class="relative w-full h-full">
	<!-- Weather Overlay -->
	<WeatherOverlay weather={currentWeather} />
	
	<!-- Main Garden Grid -->
	<div class="relative h-full w-full">
		<IsometricGrid 
			plots={garden.grid_data.plots} 
			onPlotClick={handlePlotClick}
		/>
	</div>

	<!-- Plant Shop Modal -->
	{#if showShop && selectedPlot}
		<PlantShop 
			{plantsAvailable}
			{userSeeds}
			onPurchase={handlePlantPurchase}
			onClose={closeShop}
			selectedPlot={selectedPlot}
		/>
	{/if}
</div>