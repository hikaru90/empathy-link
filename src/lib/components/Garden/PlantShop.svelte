<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { clsx } from 'clsx';
	import { pb } from '$scripts/pocketbase';

	interface Plant {
		id: string;
		name: string;
		category: string;
		seed_cost: number;
		description: string;
		rarity: string;
		sprite?: string;
	}

	interface Props {
		plantsAvailable: Plant[];
		userSeeds: {
			seed_inventory: Record<string, number>;
		};
		onPurchase: (plantId: string) => void;
		isOpen: boolean;
		onClose: () => void;
	}

	let { plantsAvailable, userSeeds, onPurchase, isOpen, onClose }: Props = $props();

	let activeSnapPoint = $state('500px');

	const canAfford = (plant: Plant): boolean => {
		const totalSeeds = userSeeds.seed_inventory.basic || 0;
		return totalSeeds >= plant.seed_cost;
	};

	const getTotalSeeds = (): number => {
		return userSeeds.seed_inventory.basic || 0;
	};

	const getPlantDisplay = (plant: Plant): { type: 'sprite' | 'emoji', content: string } => {
		// Use sprite if available, otherwise fall back to emoji
		if (plant.sprite) {
			const imageUrl = `${pb.baseUrl}/api/files/items/${plant.id}/${plant.sprite}`;
			return { type: 'sprite', content: imageUrl };
		}
		
		// Terraform items
		if (plant.category === 'terraform') {
			if (plant.name.toLowerCase().includes('dirt')) return { type: 'emoji', content: '🟫' };
			if (plant.name.toLowerCase().includes('water')) return { type: 'emoji', content: '💧' };
			if (plant.name.toLowerCase().includes('path')) return { type: 'emoji', content: '🛤️' };
			return { type: 'emoji', content: '🔧' };
		}
		
		// Fallback emoji logic for plants
		if (plant.name.toLowerCase().includes('rose')) return { type: 'emoji', content: '🌹' };
		if (plant.name.toLowerCase().includes('oak')) return { type: 'emoji', content: '🌳' };
		if (plant.name.toLowerCase().includes('sunflower')) return { type: 'emoji', content: '🌻' };
		if (plant.name.toLowerCase().includes('tulip')) return { type: 'emoji', content: '🌷' };
		if (plant.name.toLowerCase().includes('daisy')) return { type: 'emoji', content: '🌼' };
		if (plant.name.toLowerCase().includes('tree')) return { type: 'emoji', content: '🌳' };
		if (plant.name.toLowerCase().includes('tanne')) return { type: 'emoji', content: '🌲' };
		if (plant.name.toLowerCase().includes('stein')) return { type: 'emoji', content: '🪨' };
		if (plant.category === 'flower') return { type: 'emoji', content: '🌸' };
		if (plant.category === 'tree') return { type: 'emoji', content: '🌳' };
		if (plant.category === 'vegetable') return { type: 'emoji', content: '🥕' };
		if (plant.category === 'decoration') return { type: 'emoji', content: '✨' };
		return { type: 'emoji', content: '🌱' };
	};

	const getCategoryColor = (category: string): string => {
		switch (category) {
			case 'flower': return 'text-pink-500';
			case 'tree': return 'text-green-600';
			case 'vegetable': return 'text-orange-500';
			case 'decoration': return 'text-purple-500';
			case 'terraform': return 'text-amber-600';
			default: return 'text-gray-500';
		}
	};
</script>

{#if isOpen}
<Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()} snapPoints={['500px', 1]} bind:activeSnapPoint>
	<Drawer.Overlay class="fixed inset-0 bg-black/40" />
	<Drawer.Portal>
		<Drawer.Content class="fixed flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
			<div
				class={clsx("flex flex-col max-w-md mx-auto w-full p-4 pt-5", {
					"overflow-y-auto": activeSnapPoint === 1,
					"overflow-hidden": activeSnapPoint !== 1,
				})}
			>
				<!-- Header -->
				<div class="flex items-center justify-center gap-2 mb-4">
					<span class="text-lg">🌱</span>
					<h1 class="text-2xl font-medium text-gray-900 dark:text-white">Pflanzenshop</h1>
				</div>
				
				<div class="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
					Du hast: {getTotalSeeds()} 🌰 Seeds
				</div>

				<!-- Items List -->
				{#if plantsAvailable.length === 0}
					<div class="text-center py-8 text-gray-500 dark:text-gray-400">
						<div class="text-4xl mb-2">🌱</div>
						<p>Keine Items verfügbar</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each plantsAvailable as plant}
							{@const affordable = canAfford(plant)}
							{@const display = getPlantDisplay(plant)}
							
							<div 
								class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all
									{affordable 
										? 'hover:border-green-400 hover:shadow-sm cursor-pointer' 
										: 'opacity-50 cursor-not-allowed'}"
								onclick={() => affordable && onPurchase(plant.id)}
							>
								<!-- Plant Header -->
								<div class="flex items-start justify-between mb-2">
									<div class="flex items-center gap-3">
										{#if display.type === 'sprite'}
											<img src={display.content} alt={plant.name} class="w-8 h-8 object-contain" />
										{:else}
											<span class="text-2xl">{display.content}</span>
										{/if}
										<div>
											<h3 class="font-semibold text-gray-900 dark:text-white text-sm">
												{plant.name}
											</h3>
											<span class="text-xs {getCategoryColor(plant.category)} capitalize">
												{plant.category}
											</span>
										</div>
									</div>
									
									<!-- Cost -->
									<div class="text-right">
										<div class="flex items-center gap-1">
											<span class="text-base">🌰</span>
											<span class="font-bold {affordable ? 'text-green-600' : 'text-red-500'} text-sm">
												{plant.seed_cost}
											</span>
										</div>
									</div>
								</div>

								<!-- Description -->
								<p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
									{plant.description}
								</p>

								<!-- Purchase Button -->
								<Button
									class="w-full h-8 text-xs {affordable 
										? 'bg-green-500 hover:bg-green-600 text-white' 
										: 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}"
									disabled={!affordable}
									onclick={() => affordable && onPurchase(plant.id)}
								>
									{affordable ? 'Kaufen' : 'Nicht genügend Samen'}
								</Button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
{/if}