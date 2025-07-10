<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	interface Props {
		selectedFeelings: string[];
		onFeelingChange: (feelings: string[]) => void;
		pointId: string | number;
		show: boolean;
	}

	interface feeling {
		category: 'true' | 'false';
		content: {
			category: string;
			visible: boolean;
			content: dbFeeling[];
		}[];
	}

	interface dbFeeling {
		id: string;
		nameEN: string;
		nameDE: string;
		category: string;
		positive: boolean;
		sort: number;
	}

	let { selectedFeelings, onFeelingChange, pointId, show }: Props = $props();

	let feelings = $state<dbFeeling[]>([]);
	let groupedFeelings = $state<feeling[]>([]);
	let localSelectedFeelings = $state<string[]>([]);

	// Sync local state with prop
	$effect(() => {
		localSelectedFeelings = selectedFeelings;
	});

	const initFeelings = async () => {
		try {
			const records = await pb.collection('feelings').getFullList({
				sort: 'category,sort'
			});
			const data = serializeNonPOJOs(records) as dbFeeling[];
			if (!data || !Array.isArray(data)) {
				console.error('Invalid feelings data received');
				return;
			}
			
			feelings = data;
			let res = groupBy(data, 'positive') as feeling[];
			if (!res || !Array.isArray(res)) {
				console.error('Invalid grouped feelings data');
				return;
			}
			
			res = res.map((entry) => ({
				category: entry.category as 'true' | 'false',
				content: groupBy(entry.content, 'category').map((category) => ({
					...category,
					visible: false
				}))
			}));
			groupedFeelings = res;
		} catch (error) {
			console.error('Error initializing feelings:', error);
			feelings = [];
			groupedFeelings = [];
		}
	};

	const toggleFeelingsCatgeory = (feeling: dbFeeling, category: string) => {
		if (feeling.nameEN !== category) return;
		if (!groupedFeelings || groupedFeelings.length < 2) return;
		
		const target0 = groupedFeelings[0]?.content?.find((entry) => entry.category === category);
		const target1 = groupedFeelings[1]?.content?.find((entry) => entry.category === category);
		if (target0) target0.visible = !target0.visible;
		if (target1) target1.visible = !target1.visible;
		groupedFeelings = [...groupedFeelings];
	};

	const categoryIsVisible = (
		feeling: dbFeeling,
		category: { category: string; content: any; visible: boolean }
	) => {
		const feelingSlug = feeling.nameEN;
		const categorySlug = category.category;
		if (feelingSlug === categorySlug) return true;
		if (category.visible) return true;
		return false;
	};

	onMount(() => {
		initFeelings();
	});
</script>

{#if show}
	<ToggleGroup.Root
		name={pointId}
		id="feeling-selector"
		type="multiple"
		bind:value={localSelectedFeelings}
		onValueChange={(value: string[]) => {
			onFeelingChange(value);
		}}
		class="duration-800 flex flex-col gap-4 transition-all"
	>
		{#if groupedFeelings && groupedFeelings.length > 0}
			<div class="">
				<div class="-mx-1 flex w-full flex-wrap justify-start transition-all">
					{#each groupedFeelings as positive}
						{#each positive.content as category}
							{#each category.content as feeling}
								<div
									class="{categoryIsVisible(feeling, category) ||
									localSelectedFeelings.includes(feeling.id)
										? 'pointer-events-auto max-w-[300px] p-0.5 opacity-100'
										: 'pointer-events-none m-0 max-w-0 text-[2px] opacity-0'} block h-7 leading-none transition-all"
								>
									{#if feeling.nameEN === category.category}
										<button
											type="button"
											onclick={() => toggleFeelingsCatgeory(feeling, category.category)}
											class="w-full"
										>
											<ToggleGroup.Item
												value={feeling.id}
												class="bg-white/40 hover:bg-white/30 h-auto max-w-[300px] rounded-full px-2 py-0.5 text-xs text-black hover:bg-white/30 hover:text-black data-[state=on]:bg-white"
											>
												<div
													class="-ml-0.5 mr-1 size-1.5 rounded-full {positive.category ===
													'true'
														? 'bg-purple-300'
														: 'bg-bullshift'}"
												></div>
												{feeling.nameDE}
											</ToggleGroup.Item>
										</button>
									{:else}
										<ToggleGroup.Item
											value={feeling.id}
											class="h-auto max-w-[300px] rounded-full px-2 py-0.5 text-xs text-black hover:bg-white/30 hover:text-black data-[state=on]:bg-white"
										>
											{feeling.nameDE}
										</ToggleGroup.Item>
									{/if}
								</div>
							{/each}
						{/each}
					{/each}
				</div>
			</div>
		{/if}
	</ToggleGroup.Root>
{/if}