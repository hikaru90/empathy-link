<script lang="ts">
	import GripVertical from 'lucide-svelte/icons/grip-vertical';
	import { onDestroy } from 'svelte';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';

	interface Props {
		content: {
			bucketA: string;
			bucketB: string;
			items: {
				text: string;
				correctBucket: 'A' | 'B';
			}[];
		};
		currentCategory: {
			color: string;
		};
		color: string;
		onResponse?: (response: { userSorting: { [itemText: string]: 'A' | 'B' | null } }) => void;
		initialUserSorting?: { [itemText: string]: 'A' | 'B' | null };
		gotoNextStep?: () => void;
	}

	let { content, currentCategory, color, onResponse, initialUserSorting, gotoNextStep }: Props =
		$props();

	// Initialize userSorting directly from props or with null values
	const initializeUserSorting = () => {
		if (initialUserSorting && Object.keys(initialUserSorting).length > 0) {
			return { ...initialUserSorting };
		}

		const sorting: { [itemText: string]: 'A' | 'B' | null } = {};
		content.items.forEach((item) => {
			sorting[item.text] = null;
		});
		return sorting;
	};

	// State for user's sorting
	let userSorting = $state<{ [itemText: string]: 'A' | 'B' | null }>(initializeUserSorting());
	let draggedItem = $state<string | null>(null);
	let touchStartPos = $state<{ x: number; y: number } | null>(null);
	let dragPreview = $state<{ x: number; y: number; text: string } | null>(null);

	// Update userSorting when initialUserSorting changes (for loading from session)
	$effect(() => {
		if (initialUserSorting && Object.keys(initialUserSorting).length > 0) {
			// Check if we need to update
			const needsUpdate = content.items.some(
				(item) => userSorting[item.text] !== initialUserSorting[item.text]
			);

			if (needsUpdate) {
				userSorting = { ...initialUserSorting };
			}
		}
	});

	// Drag and drop handlers
	const handleDragStart = (event: DragEvent, itemText: string) => {
		console.log('🎯 Drag start:', itemText);
		draggedItem = itemText;
		event.dataTransfer!.effectAllowed = 'move';
		event.dataTransfer!.setData('text/plain', itemText);
	};

	const handleDragOver = (event: DragEvent) => {
		console.log('🎯 Drag over');
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
	};

	const handleDrop = (event: DragEvent, bucket: 'A' | 'B') => {
		console.log('🎯 Drop:', { draggedItem, bucket });
		event.preventDefault();
		if (draggedItem) {
			userSorting[draggedItem] = bucket;
			console.log('🎯 Updated userSorting:', userSorting);

			// Emit response if callback provided
			if (onResponse) {
				onResponse({ userSorting: { ...userSorting } });
			}
		}
		draggedItem = null;
	};

	const handleDragEnd = () => {
		draggedItem = null;
	};

	// Touch event handlers for mobile
	const handleTouchStart = (event: TouchEvent, itemText: string) => {
		draggedItem = itemText;
		const touch = event.touches[0];
		touchStartPos = { x: touch.clientX, y: touch.clientY };
		dragPreview = { x: touch.clientX, y: touch.clientY, text: itemText };

		// Add global touch move and end listeners
		document.addEventListener('touchmove', handleGlobalTouchMove);
		document.addEventListener('touchend', handleGlobalTouchEnd);
	};

	const handleGlobalTouchMove = (event: TouchEvent) => {
		if (draggedItem && touchStartPos) {
			const touch = event.touches[0];
			dragPreview = { x: touch.clientX, y: touch.clientY, text: draggedItem };
		}
	};

	const handleGlobalTouchEnd = (event: TouchEvent) => {
		if (draggedItem && touchStartPos) {
			const touch = event.changedTouches[0];
			const element = document.elementFromPoint(touch.clientX, touch.clientY);

			// Find the bucket element
			const bucketElement = element?.closest('[data-bucket]');

			if (bucketElement) {
				const bucket = bucketElement.getAttribute('data-bucket') as 'A' | 'B';
				if (bucket) {
					userSorting[draggedItem] = bucket;
					if (onResponse) {
						onResponse({ userSorting: { ...userSorting } });
					}
				}
			}
		}

		// Clean up
		draggedItem = null;
		touchStartPos = null;
		dragPreview = null;

		// Remove global listeners
		document.removeEventListener('touchmove', handleGlobalTouchMove);
		document.removeEventListener('touchend', handleGlobalTouchEnd);
	};

	// Get items for each bucket
	const getBucketItems = (bucket: 'A' | 'B') => {
		return content.items.filter((item) => userSorting[item.text] === bucket);
	};

	// Get unsorted items
	const getUnsortedItems = () => {
		return content.items.filter((item) => userSorting[item.text] === null);
	};

	// Validation state
	let showValidation = $state(false);

	// Check if all items are sorted
	const allItemsSorted = $derived(() => {
		return content.items.every((item) => userSorting[item.text] !== null);
	});

	// Get validation results
	const getValidationResults = () => {
		const results = {
			correctItems: [] as string[],
			incorrectItems: [] as string[],
			incorrectBuckets: [] as ('A' | 'B')[]
		};

		content.items.forEach((item) => {
			const userBucket = userSorting[item.text];
			const correctBucket = item.correctBucket;
			
			if (userBucket !== null) {
				if (userBucket === correctBucket) {
					results.correctItems.push(item.text);
				} else {
					results.incorrectItems.push(item.text);
					if (!results.incorrectBuckets.includes(userBucket)) {
						results.incorrectBuckets.push(userBucket);
					}
				}
			}
		});

		return results;
	};

	const validationResults = $derived(() => getValidationResults());

	// Check if sorting is correct
	const isCorrectlySorted = $derived(() => {
		return allItemsSorted() && validationResults().incorrectItems.length === 0;
	});

	// Trigger validation when all items are sorted
	$effect(() => {
		if (allItemsSorted()) {
			showValidation = true;
		} else {
			showValidation = false;
		}
	});

	// Cleanup function to remove any remaining touch listeners
	const cleanup = () => {
		document.removeEventListener('touchmove', handleGlobalTouchMove);
		document.removeEventListener('touchend', handleGlobalTouchEnd);
	};

	// Cleanup on component destroy
	onDestroy(cleanup);
</script>

<div class="flex h-full flex-col justify-between flex-grow-0">
	<div class="flex flex-col flex-grow gap-3">
		<!-- Unsorted Items -->
		{#if getUnsortedItems().length > 0}
				<h4 class="text-sm">Zu sortierende Elemente</h4>
				<div class="flex flex-wrap gap-1">
					{#each getUnsortedItems() as item}
						<div
							draggable="true"
							ondragstart={(e) => handleDragStart(e, item.text)}
							ondragend={handleDragEnd}
							ontouchstart={(e) => handleTouchStart(e, item.text)}
							role="button"
							tabindex="0"
							style="background-color: {color}; touch-action: manipulation;"
							class="cursor-move select-none rounded-xl px-2 py-0.5 text-sm transition-colors hover:bg-blue-200"
							class:opacity-50={draggedItem === item.text}
						>
							{item.text}
						</div>
					{/each}
				</div>
		{/if}

		<!-- Buckets -->
		<div class="grid grid-cols-2 gap-4">
			{#each [{ id: 'A' as const, name: content.bucketA }, { id: 'B' as const, name: content.bucketB }] as bucket}
				<div
					style="border: 2px dashed {showValidation && validationResults().incorrectBuckets.includes(bucket.id) ? '#ef4444' : color};"
					class="flex min-h-[140px] flex-col rounded-lg p-3 transition-colors {draggedItem
						? 'border-solid bg-white/60 hover:bg-white/80'  
						: ''} {showValidation && validationResults().incorrectBuckets.includes(bucket.id) 
						? 'border-solid' 
						: ''}"
					ondragover={handleDragOver}
					ondrop={(e) => handleDrop(e, bucket.id)}
					data-bucket={bucket.id}
					role="region"
					aria-label="Ablagebereich für {bucket.name}"
				>
					<div
						style=""
						class="pointer-events-none flex-shrink-0 rounded-full py-1 text-center text-sm"
					>
						<h4 class="">
							{bucket.name}
						</h4>
					</div>
					<div class="relative flex-grow space-y-2 overflow-y-auto h-32">
						<div class="flex flex-wrap gap-1 pt-1">
							{#each getBucketItems(bucket.id) as item}
								<div
									draggable="true"
									ondragstart={(e) => handleDragStart(e, item.text)}
									ondragend={handleDragEnd}
									ontouchstart={(e) => handleTouchStart(e, item.text)}
									role="button"
									tabindex="0"
									style="background-color: {showValidation && validationResults().incorrectItems.includes(item.text) ? '#ef4444' : color}; touch-action: manipulation;"
									class="cursor-move select-none rounded-xl px-2 py-0.5 text-sm transition-colors hover:bg-blue-200 {showValidation && validationResults().incorrectItems.includes(item.text) ? 'text-white' : ''}"
									class:opacity-50={draggedItem === item.text}
								>
									{item.text}
								</div>
							{/each}
							{#if getBucketItems(bucket.id).length === 0}
								<div
									class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-center text-sm leading-none text-black/60"
								>
									Elemente hier ablegen
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Drag Preview for Mobile -->
		{#if dragPreview}
			<div
				class="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 transform rounded border border-blue-400 bg-blue-200 px-3 py-2 text-sm shadow-lg"
				style="left: {dragPreview.x}px; top: {dragPreview.y}px;"
			>
				{dragPreview.text}
			</div>
		{/if}

		<!-- Progress indicator -->
		<div class="text-center">
			<div class="text-sm text-gray-600">
				{content.items.length - getUnsortedItems().length} von {content.items.length} Elementen sortiert
			</div>
			<div class="mt-2 h-2 w-full rounded-full bg-gray-200">
				<div
					class="h-2 rounded-full transition-all duration-300"
					style="width: {((content.items.length - getUnsortedItems().length) /
						content.items.length) *
						100}%; background-color: {currentCategory.color};"
				></div>
			</div>
		</div>
	</div>

	<div class="flex-shrink-0">
		<LearnGotoNextButton
			disabled={!isCorrectlySorted()}
			onClick={() => {
				if (isCorrectlySorted()) {
					gotoNextStep?.();
				}
			}}
		>
			Weiter
		</LearnGotoNextButton>
	</div>
</div>
