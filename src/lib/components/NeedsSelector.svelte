<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	interface Props {
		selectedNeeds: string[];
		onNeedChange: (needs: string[]) => void;
		pointId: string | number;
		show: boolean;
	}

	interface need {
		category: string;
		content: {
			category: string;
			visible: boolean;
			content: dbNeed[];
		}[];
	}

	interface dbNeed {
		id: string;
		nameEN: string;
		nameDE: string;
		category: string;
		sort: number;
	}

	let { selectedNeeds, onNeedChange, pointId, show }: Props = $props();

	let needs = $state<dbNeed[]>([]);
	let groupedNeeds = $state<need[]>([]);
	let localSelectedNeeds = $state<string[]>([]);

	// Sync local state with prop
	$effect(() => {
		localSelectedNeeds = selectedNeeds;
	});

	// Auto-expand categories for pre-selected needs (only once when needs are loaded)
	$effect(() => {
		if (selectedNeeds.length > 0 && groupedNeeds.length > 0 && needs.length > 0) {
			let needsUpdate = false;
			
			selectedNeeds.forEach(needId => {
				const need = needs.find(n => n.id === needId);
				if (need) {
					// Find and expand the category that contains this need
					groupedNeeds.forEach(category => {
						category.content.forEach(subCategory => {
							if (subCategory.content.some(n => n.id === needId) && !subCategory.visible) {
								subCategory.visible = true;
								needsUpdate = true;
							}
						});
					});
				}
			});
			
			// Only update if we actually changed something
			if (needsUpdate) {
				groupedNeeds = [...groupedNeeds];
			}
		}
	});

	const initNeeds = async () => {
		try {
			const records = await pb.collection('needs').getFullList({
				sort: 'category,sort'
			});
			const data = serializeNonPOJOs(records) as dbNeed[];
			if (!data || !Array.isArray(data)) {
				console.error('Invalid needs data received');
				return;
			}
			
			needs = data;
			let grouped = groupBy(data, 'category');
			if (!grouped || !Array.isArray(grouped)) {
				console.error('Invalid grouped needs data');
				return;
			}
			
			// Since needs don't have a positive/negative classification like feelings,
			// we'll group them by their main categories
			groupedNeeds = grouped.map((categoryGroup) => ({
				category: categoryGroup.category,
				content: [{
					category: categoryGroup.category,
					visible: false,
					content: categoryGroup.content
				}]
			}));
		} catch (error) {
			console.error('Error initializing needs:', error);
			needs = [];
			groupedNeeds = [];
		}
	};

	const toggleNeedsCategory = (category: string) => {
		groupedNeeds.forEach(categoryGroup => {
			categoryGroup.content.forEach(subCategory => {
				if (subCategory.category === category) {
					subCategory.visible = !subCategory.visible;
				}
			});
		});
		groupedNeeds = [...groupedNeeds];
	};

	const categoryIsVisible = (category: string) => {
		return groupedNeeds.some(categoryGroup => 
			categoryGroup.content.some(subCategory => 
				subCategory.category === category && subCategory.visible
			)
		);
	};

	const handleNeedToggle = (needId: string) => {
		if (localSelectedNeeds.includes(needId)) {
			localSelectedNeeds = localSelectedNeeds.filter(id => id !== needId);
		} else {
			localSelectedNeeds = [...localSelectedNeeds, needId];
		}
		onNeedChange(localSelectedNeeds);
	};

	onMount(() => {
		initNeeds();
	});
</script>

{#if show}
	<div class="w-full space-y-4">
		{#each groupedNeeds as categoryGroup}
			<div class="space-y-2">
				<button
					type="button"
					class="w-full rounded-lg border bg-gray-50 px-4 py-2 text-left font-medium hover:bg-gray-100"
					onclick={() => toggleNeedsCategory(categoryGroup.category)}
				>
					{categoryGroup.category}
					<span class="float-right">
						{categoryIsVisible(categoryGroup.category) ? '−' : '+'}
					</span>
				</button>

				{#each categoryGroup.content as subCategory}
					{#if subCategory.visible}
						<div class="space-y-2 pl-4">
							<ToggleGroup.Root
								type="multiple"
								value={localSelectedNeeds}
								onValueChange={(value) => {
									localSelectedNeeds = value;
									onNeedChange(value);
								}}
								class="flex flex-wrap gap-2"
							>
								{#each subCategory.content as need}
									<ToggleGroup.Item
										value={need.id}
										class="rounded-full border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-100 data-[state=on]:bg-blue-100 data-[state=on]:border-blue-300"
									>
										{need.nameDE}
									</ToggleGroup.Item>
								{/each}
							</ToggleGroup.Root>
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
{/if}