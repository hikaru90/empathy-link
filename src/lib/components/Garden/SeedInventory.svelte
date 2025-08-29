<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { clsx } from 'clsx';

	interface Props {
		userSeeds: {
			seed_inventory: Record<string, number>;
			total_seeds_earned: number;
		};
	}

	let { userSeeds }: Props = $props();

	const seedTypes = [
		{ key: 'basic', label: 'Basic', emoji: '🌰', color: 'text-yellow-600' },
		{ key: 'flower_seeds', label: 'Blumen', emoji: '🌸', color: 'text-pink-500' },
		{ key: 'tree_seeds', label: 'Bäume', emoji: '🌳', color: 'text-green-600' },
		{ key: 'decoration_tokens', label: 'Deko', emoji: '✨', color: 'text-purple-500' },
		{ key: 'rare', label: 'Selten', emoji: '💎', color: 'text-blue-500' },
		{ key: 'legendary', label: 'Legendär', emoji: '⭐', color: 'text-orange-500' }
	];

	let activeSnapPoint = $state('355px');

	const getInventoryCount = (key: string): number => {
		return userSeeds.seed_inventory[key] || 0;
	};

	const totalSeeds = seedTypes.reduce((total, type) => total + getInventoryCount(type.key), 0);
</script>

<Drawer.Root snapPoints={['355px', 1]} bind:activeSnapPoint>
	<Drawer.Trigger>
		<button
			class="flex items-center gap-2 rounded-lg border border-white/20 bg-white/80 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-700/90"
		>
			<span class="text-lg">🌰</span>
			<span class="font-semibold text-gray-900 dark:text-white">{totalSeeds}</span>
		</button>
	</Drawer.Trigger>
	<Drawer.Overlay class="fixed inset-0 bg-black/40" />
	<Drawer.Portal>
		<Drawer.Content class="fixed flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]">
			<div
				class={clsx("flex flex-col max-w-md mx-auto w-full p-4 pt-5", {
					"overflow-y-auto": activeSnapPoint === 1,
					"overflow-hidden": activeSnapPoint !== 1,
				})}
			>
				<div class="flex items-center justify-center gap-2 mb-4">
					<span class="text-lg">🌰</span>
					<h1 class="text-2xl font-medium text-gray-900 dark:text-white">Meine Samen</h1>
				</div>

				<div class="grid grid-cols-3 gap-3 mb-6">
					{#each seedTypes as seedType}
						{@const count = getInventoryCount(seedType.key)}
						<div class="flex flex-col items-center text-center">
							<div class="text-2xl mb-1">{seedType.emoji}</div>
							<div class="text-lg font-bold {seedType.color}">{count}</div>
							<div class="text-xs text-gray-600 dark:text-gray-400">{seedType.label}</div>
						</div>
					{/each}
				</div>

				<div class="border-t border-gray-200 dark:border-gray-600 pt-3">
					<div class="text-center text-sm text-gray-600 dark:text-gray-300">
						Insgesamt verdient: <span class="font-semibold text-green-600">{userSeeds.total_seeds_earned}</span> Samen
					</div>
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
