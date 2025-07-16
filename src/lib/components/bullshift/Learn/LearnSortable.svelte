<script lang="ts">
	import GripVertical from 'lucide-svelte/icons/grip-vertical'
	import { onDestroy } from 'svelte';

	interface Props {
		content: {
			bucketA: string;
			bucketB: string;
			items: {
				text: string;
				correctBucket: "A" | "B";
			}[];
		};
		currentCategory: {
			color: string;
		};
		color: string;
		onResponse?: (response: { userSorting: { [itemText: string]: "A" | "B" | null } }) => void;
		initialUserSorting?: { [itemText: string]: "A" | "B" | null };
	}

	let { content, currentCategory, color, onResponse, initialUserSorting }: Props = $props();

	// Initialize userSorting directly from props or with null values
	const initializeUserSorting = () => {
		if (initialUserSorting && Object.keys(initialUserSorting).length > 0) {
			return { ...initialUserSorting };
		}
		
		const sorting: { [itemText: string]: "A" | "B" | null } = {};
		content.items.forEach(item => {
			sorting[item.text] = null;
		});
		return sorting;
	};

	// State for user's sorting
	let userSorting = $state<{ [itemText: string]: "A" | "B" | null }>(initializeUserSorting());
	let draggedItem = $state<string | null>(null);
	let touchStartPos = $state<{ x: number; y: number } | null>(null);
	let dragPreview = $state<{ x: number; y: number; text: string } | null>(null);

	// Update userSorting when initialUserSorting changes (for loading from session)
	$effect(() => {
		if (initialUserSorting && Object.keys(initialUserSorting).length > 0) {
			// Check if we need to update
			const needsUpdate = content.items.some(item => 
				userSorting[item.text] !== initialUserSorting[item.text]
			);
			
			if (needsUpdate) {
				userSorting = { ...initialUserSorting };
			}
		}
	});

	// Drag and drop handlers
	const handleDragStart = (event: DragEvent, itemText: string) => {
		draggedItem = itemText;
		event.dataTransfer!.effectAllowed = 'move';
		event.dataTransfer!.setData('text/plain', itemText);
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
	};

	const handleDrop = (event: DragEvent, bucket: "A" | "B") => {
		event.preventDefault();
		if (draggedItem) {
			userSorting[draggedItem] = bucket;
			
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
				const bucket = bucketElement.getAttribute('data-bucket') as "A" | "B";
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
	const getBucketItems = (bucket: "A" | "B") => {
		return content.items.filter(item => userSorting[item.text] === bucket);
	};

	// Get unsorted items
	const getUnsortedItems = () => {
		return content.items.filter(item => userSorting[item.text] === null);
	};

	// Cleanup function to remove any remaining touch listeners
	const cleanup = () => {
		document.removeEventListener('touchmove', handleGlobalTouchMove);
		document.removeEventListener('touchend', handleGlobalTouchEnd);
	};

	// Cleanup on component destroy
	onDestroy(cleanup);
</script>

<div class="space-y-6 mb-10">
	<!-- Unsorted Items -->
	{#if getUnsortedItems().length > 0}
		<div>
			<h4 class="mb-3">Zu sortierende Elemente:</h4>
			<div class="flex flex-wrap gap-2">
				{#each getUnsortedItems() as item}
					<div 
						draggable="true"
						ondragstart={(e) => handleDragStart(e, item.text)}
						ondragend={handleDragEnd}
						ontouchstart={(e) => handleTouchStart(e, item.text)}
						role="button"
						tabindex="0"
						style="background-color: {color}; box-shadow: 0 6px 4px 0 rgba(0, 0, 0, 0.1); touch-action: manipulation;"
						class="rounded-md px-2 py-1 text-sm cursor-move hover:bg-blue-200 transition-colors select-none"
						class:opacity-50={draggedItem === item.text}
					>

						{item.text}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Buckets -->
	<div class="grid grid-cols-2 gap-4">
		{#each [
			{ id: "A" as const, name: content.bucketA },
			{ id: "B" as const, name: content.bucketB }
		] as bucket}
			<div 
				style="border: 2px dashed {color};"
				class="rounded-lg p-3 min-h-[140px] transition-colors flex flex-col {draggedItem ? 'bg-white/60 hover:bg-white/80 border-solid' : ''}"
				ondragover={handleDragOver}
				ondrop={(e) => handleDrop(e, bucket.id)}
				data-bucket={bucket.id}
				role="region"
				aria-label="Ablagebereich für {bucket.name}"
			>
				<div style="" class="text-center rounded-full py-1 text-sm flex-shrink-0 pointer-events-none">
					<h4 class="">
						{bucket.name}
					</h4>
				</div>
				<div class="space-y-2 relative flex-grow">
					<div class="flex flex-wrap gap-1 pt-1">

					{#each getBucketItems(bucket.id) as item}
						<div 
							draggable="true"
							ondragstart={(e) => handleDragStart(e, item.text)}
							ondragend={handleDragEnd}
							ontouchstart={(e) => handleTouchStart(e, item.text)}
							role="button"
							tabindex="0"
							style="background-color: {color}; box-shadow: 0 6px 4px 0 rgba(0, 0, 0, 0.1); touch-action: manipulation;"
							class="rounded-md px-2 py-1 text-sm cursor-move hover:bg-blue-200 transition-colors select-none"
							class:opacity-50={draggedItem === item.text}
						>
							{item.text}
						</div>
					{/each}
					{#if getBucketItems(bucket.id).length === 0}
							<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-center text-black/60 leading-none">
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
			class="fixed pointer-events-none z-50 bg-blue-200 border border-blue-400 rounded px-3 py-2 text-sm shadow-lg transform -translate-x-1/2 -translate-y-1/2"
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
		<div class="w-full bg-gray-200 rounded-full h-2 mt-2">
			<div 
				class="h-2 rounded-full transition-all duration-300"
				style="width: {((content.items.length - getUnsortedItems().length) / content.items.length) * 100}%; background-color: {currentCategory.color};"
			></div>
		</div>
	</div>
</div> 