<script lang="ts">
	interface Plant {
		id: string;
		name: string;
		category: string;
		seed_cost: number;
		description: string;
		rarity: string;
	}

	interface Props {
		plantsAvailable: Plant[];
		userSeeds: {
			seed_inventory: Record<string, number>;
		};
		onPurchase: (plantId: string) => void;
		onClose: () => void;
		selectedPlot: { x: number; y: number };
	}

	let { plantsAvailable, userSeeds, onPurchase, onClose, selectedPlot }: Props = $props();

	const categories = [
		{ key: 'flower', label: 'Blumen', emoji: '🌸' },
		{ key: 'tree', label: 'Bäume', emoji: '🌳' },
		{ key: 'vegetable', label: 'Gemüse', emoji: '🥕' },
		{ key: 'decoration', label: 'Deko', emoji: '✨' }
	];

	let selectedCategory = $state('flower');

	const getSeedTypeForPlant = (category: string): string => {
		switch (category) {
			case 'flower': return 'flower_seeds';
			case 'tree': return 'tree_seeds';
			case 'decoration': return 'decoration_tokens';
			default: return 'basic';
		}
	};

	const canAfford = (plant: Plant): boolean => {
		const seedType = getSeedTypeForPlant(plant.category);
		return (userSeeds.seed_inventory[seedType] || 0) >= plant.seed_cost;
	};

	const getPlantEmoji = (plant: Plant): string => {
		if (plant.name.toLowerCase().includes('rose')) return '🌹';
		if (plant.name.toLowerCase().includes('oak')) return '🌳';
		if (plant.name.toLowerCase().includes('sunflower')) return '🌻';
		if (plant.name.toLowerCase().includes('tulip')) return '🌷';
		if (plant.name.toLowerCase().includes('daisy')) return '🌼';
		if (plant.name.toLowerCase().includes('tree')) return '🌳';
		if (plant.category === 'flower') return '🌸';
		if (plant.category === 'tree') return '🌳';
		if (plant.category === 'vegetable') return '🥕';
		if (plant.category === 'decoration') return '✨';
		return '🌱';
	};

	const getRarityColor = (rarity: string): string => {
		switch (rarity) {
			case 'common': return 'text-gray-600';
			case 'rare': return 'text-blue-500';
			case 'legendary': return 'text-orange-500';
			default: return 'text-gray-600';
		}
	};

	const filteredPlants = $derived(
		plantsAvailable.filter(plant => plant.category === selectedCategory)
	);
</script>

<!-- Modal Backdrop -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onclick={onClose}>
	<!-- Modal Content -->
	<div 
		class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Header -->
		<div class="p-6 border-b border-gray-200 dark:border-gray-700">
			<div class="flex justify-between items-center">
				<div>
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						🌱 Pflanzenshop
					</h2>
					<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
						Platz {selectedPlot.x + 1}-{selectedPlot.y + 1} bepflanzen
					</p>
				</div>
				<button 
					onclick={onClose}
					class="text-gray-400 hover:text-gray-600 text-2xl"
				>
					×
				</button>
			</div>
		</div>

		<!-- Category Tabs -->
		<div class="px-6 pt-4">
			<div class="flex gap-2 overflow-x-auto">
				{#each categories as category}
					<button
						class="flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
							{selectedCategory === category.key 
								? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
								: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
						onclick={() => selectedCategory = category.key}
					>
						<span class="text-lg">{category.emoji}</span>
						<span class="text-sm font-medium">{category.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Plants Grid -->
		<div class="p-6 overflow-y-auto max-h-96">
			{#if filteredPlants.length === 0}
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">
					<div class="text-4xl mb-2">🌱</div>
					<p>Keine Pflanzen in dieser Kategorie verfügbar</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each filteredPlants as plant}
						{@const affordable = canAfford(plant)}
						{@const seedType = getSeedTypeForPlant(plant.category)}
						{@const userSeedCount = userSeeds.seed_inventory[seedType] || 0}
						
						<div 
							class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all
								{affordable 
									? 'hover:border-green-400 hover:shadow-md cursor-pointer' 
									: 'opacity-50 cursor-not-allowed'}"
							onclick={() => affordable && onPurchase(plant.id)}
						>
							<!-- Plant Header -->
							<div class="flex items-start justify-between mb-3">
								<div class="flex items-center gap-3">
									<span class="text-3xl">{getPlantEmoji(plant)}</span>
									<div>
										<h3 class="font-semibold text-gray-900 dark:text-white">
											{plant.name}
										</h3>
										<span class="text-xs {getRarityColor(plant.rarity)} capitalize">
											{plant.rarity}
										</span>
									</div>
								</div>
								
								<!-- Cost -->
								<div class="text-right">
									<div class="flex items-center gap-1 text-sm">
										<span class="text-lg">
											{seedType === 'flower_seeds' ? '🌸' : 
											 seedType === 'tree_seeds' ? '🌳' : 
											 seedType === 'decoration_tokens' ? '✨' : '🌰'}
										</span>
										<span class="font-bold {affordable ? 'text-green-600' : 'text-red-500'}">
											{plant.seed_cost}
										</span>
									</div>
									<div class="text-xs text-gray-500">
										Du hast: {userSeedCount}
									</div>
								</div>
							</div>

							<!-- Description -->
							<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
								{plant.description}
							</p>

							<!-- Purchase Button -->
							<button
								class="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors
									{affordable 
										? 'bg-green-500 hover:bg-green-600 text-white' 
										: 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}"
								disabled={!affordable}
								onclick={() => affordable && onPurchase(plant.id)}
							>
								{affordable ? 'Pflanzen' : 'Nicht genügend Samen'}
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>