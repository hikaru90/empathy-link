<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import IsometricGrid from './IsometricGrid.svelte';
	import PlantShop from './PlantShop.svelte';
	import WeatherOverlay from './WeatherOverlay.svelte';
	import { cn } from '$lib/utils';
	import { pb } from '$scripts/pocketbase';

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
			sprite?: string;
		}>;
		currentWeather: string;
		class?: string;
	}

	let { garden, userSeeds, plantsAvailable, currentWeather, class: className = undefined }: Props = $props();

	let showShop = $state(false);
	let showItemInventory = $state(false);
	let showUnplantDialog = $state(false);
	let selectedPlot = $state<{ x: number; y: number } | null>(null);
	let userInventory = $state<Array<{
		id: string;
		item: string;
		quantity: number;
		itemData?: {
			id: string;
			name: string;
			description: string;
			category: string;
			sprite?: string;
		};
	}>>([]);

	const loadUserInventory = async () => {
		try {
			const response = await fetch('/api/garden/inventory');
			if (response.ok) {
				const data = await response.json();
				userInventory = data.inventory || [];
			}
		} catch (error) {
			console.error('Error loading inventory:', error);
		}
	};

	const handlePlotClick = async (x: number, y: number) => {
		selectedPlot = { x, y };
		
		// Check if plot has a plant
		const plot = garden.grid_data.plots.find(p => p.x === x && p.y === y);
		if (plot?.plant_id) {
			// Plot has a plant - show unplant dialog
			showUnplantDialog = true;
		} else {
			// Empty plot - show inventory to plant
			await loadUserInventory();
			showItemInventory = true;
		}
	};

	const handleSeedsClick = () => {
		showShop = true;
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
				// Refresh the data to show updated garden state
				await invalidateAll();
			} else {
				const error = await response.text();
				console.error('Fehler beim Pflanzen:', error);
			}
		} catch (error) {
			console.error('Error planting:', error);
		}

		showShop = false;
		selectedPlot = null;
	};

	const handlePlantFromInventory = async (itemId: string) => {
		if (!selectedPlot) return;
		
		try {
			const response = await fetch('/api/garden/plant', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					plotX: selectedPlot.x,
					plotY: selectedPlot.y,
					plantId: itemId
				})
			});

			if (response.ok) {
				// Refresh the data to show updated garden state
				await invalidateAll();
			} else {
				const error = await response.text();
				console.error('Fehler beim Pflanzen:', error);
			}
		} catch (error) {
			console.error('Error planting:', error);
		}
	};

	const closeShop = () => {
		showShop = false;
	};

	const closeItemInventory = () => {
		showItemInventory = false;
		selectedPlot = null;
	};

	const handleUnplant = async () => {
		if (!selectedPlot) return;
		
		try {
			const response = await fetch('/api/garden/unplant', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					plotX: selectedPlot.x,
					plotY: selectedPlot.y
				})
			});

			if (response.ok) {
				// Refresh the data to show updated garden state
				await invalidateAll();
			} else {
				const error = await response.text();
				console.error('Fehler beim Entfernen:', error);
			}
		} catch (error) {
			console.error('Error unplanting:', error);
		}
		
		showUnplantDialog = false;
		selectedPlot = null;
	};

	const closeUnplantDialog = () => {
		showUnplantDialog = false;
		selectedPlot = null;
	};

	// Expose method for parent components
	export const openShop = () => {
		console.log('GardenView openShop called');
		console.log('plantsAvailable:', plantsAvailable);
		showShop = true;
		console.log('showShop set to:', showShop);
	};
</script>

<div class={cn('relative w-full h-full', className)}>
	<!-- Weather Overlay -->
	<WeatherOverlay weather={currentWeather} class="absolute z-10" />
	
	
	<!-- Main Garden Grid -->
	<div class="relative h-full w-full z-0">
		<IsometricGrid 
			plots={garden.grid_data.plots} 
			items={plantsAvailable}
			onPlotClick={handlePlotClick}
		/>
	</div>

	<!-- Plant Shop Modal (for buying items with seeds) -->
	{#if showShop}
		<PlantShop 
			{plantsAvailable}
			{userSeeds}
			onPurchase={(plantId) => {
				// Add item to inventory instead of planting directly
				console.log('Purchased item:', plantId);
				showShop = false;
			}}
			onClose={closeShop}
			isOpen={showShop}
		/>
	{/if}

	<!-- Item Inventory Modal (for planting owned items) -->
	{#if showItemInventory && selectedPlot}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick={closeItemInventory} onkeydown={(e) => e.key === 'Escape' && closeItemInventory()} role="button" tabindex="0">
			<div 
				class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.key === 'Escape' && e.stopPropagation()}
				role="button"
				tabindex="0"
			>
				<div class="p-6 border-b border-gray-200 dark:border-gray-700">
					<div class="flex justify-between items-center">
						<div>
							<h2 class="text-xl font-bold text-gray-900 dark:text-white">
								🎒 Item Inventory
							</h2>
							<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
								Plant on plot {selectedPlot.x + 1}-{selectedPlot.y + 1}
							</p>
						</div>
						<button 
							onclick={closeItemInventory}
							onkeydown={(e) => e.key === 'Enter' && closeItemInventory()}
							class="text-gray-400 hover:text-gray-600 text-2xl"
						>
							×
						</button>
					</div>
				</div>
				<div class="p-6">
					{#if userInventory.length === 0}
						<div class="text-center text-gray-500">
							<div class="text-4xl mb-2">📦</div>
							<p>No items in inventory</p>
							<p class="text-sm text-gray-400 mt-2">
								Buy items from the shop first!
							</p>
						</div>
					{:else}
						<div class="space-y-3 max-h-64 overflow-y-auto">
							{#each userInventory as inventoryItem}
								{@const itemData = inventoryItem.itemData}
								{#if itemData}
									<div 
										class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 cursor-pointer hover:border-green-400 transition-colors"
										onclick={async () => {
											console.log('Plant item:', inventoryItem);
											await handlePlantFromInventory(inventoryItem.item);
											closeItemInventory();
										}}
										onkeydown={(e) => e.key === 'Enter' && handlePlantFromInventory(inventoryItem.item)}
										role="button"
										tabindex="0"
									>
										<div class="flex items-center gap-3">
											{#if itemData.sprite}
												<img src="{`${pb.baseUrl}/api/files/items/${itemData.id}/${itemData.sprite}`}" alt={itemData.name} class="size-8 object-contain" />
											{:else}
												<span class="text-2xl">🌱</span>
											{/if}
											<div class="flex-1">
												<h3 class="font-semibold text-gray-900 dark:text-white text-sm">
													{itemData.name}
												</h3>
												<p class="text-xs text-gray-600 dark:text-gray-300">
													{itemData.description}
												</p>
											</div>
											<div class="text-right">
												<span class="text-sm font-bold text-green-600">
													×{inventoryItem.quantity}
												</span>
											</div>
										</div>
									</div>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Unplant Dialog -->
	{#if showUnplantDialog && selectedPlot}
		{@const plot = selectedPlot ? garden.grid_data.plots.find(p => p.x === selectedPlot.x && p.y === selectedPlot.y) : null}
		{@const plantItem = plantsAvailable.find(item => item.id === plot?.plant_id)}
		<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick={closeUnplantDialog}>
			<div 
				class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="p-6 border-b border-gray-200 dark:border-gray-700">
					<div class="flex justify-between items-center">
						<div>
							<h2 class="text-xl font-bold text-gray-900 dark:text-white">
								🌱 Pflanze entfernen
							</h2>
							<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
								Plot {selectedPlot?.x + 1}-{selectedPlot?.y + 1}
							</p>
						</div>
						<button 
							onclick={closeUnplantDialog}
							class="text-gray-400 hover:text-gray-600 text-2xl"
						>
							×
						</button>
					</div>
				</div>
				<div class="p-6">
					<div class="text-center mb-6">
						{#if plantItem?.sprite}
							<img src="{`${pb.baseUrl}/api/files/items/${plantItem.id}/${plantItem.sprite}`}" alt={plantItem.name} class="w-16 h-16 object-contain mx-auto mb-3" />
						{:else}
							<span class="text-4xl block mb-3">🌱</span>
						{/if}
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
							{plantItem?.name || 'Unbekannte Pflanze'}
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
							Möchtest du diese Pflanze entfernen und zurück ins Inventar legen?
						</p>
					</div>
					<div class="flex gap-3">
						<button 
							onclick={closeUnplantDialog}
							class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
						>
							Abbrechen
						</button>
						<button 
							onclick={handleUnplant}
							class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
						>
							Entfernen
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>