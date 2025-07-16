<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Trash from 'lucide-svelte/icons/trash';
	import { learningSession } from '$lib/stores/learningSession';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import FeelingSelector from '$lib/components/FeelingSelector.svelte';

	interface Props {
		content: object;
		color: string;
		session: LearningSession | null;
		onResponse: (response: { points: Array<{ x: number; y: number; feelings: string[] }> }) => void;
		contentBlock?: any; // The actual content block for content-based identification
		topicVersionId?: string; // Current topic version ID
	}


	let { content, color, session, onResponse, contentBlock, topicVersionId }: Props = $props();

	let points = $state<{ id: number; x: number; y: number; feelings: string[] }[]>([]);
	let showFeelings = $state<boolean>(false);
	let feelingsElement = $state<HTMLElement | null>(null);
	let activePointId = $state<number | null>(null);
	let imageElement: HTMLImageElement;
	let imageRect: DOMRect | null = null;
	let previousActivePointId = $state<number | null>(null);
	let feelingsContainer: HTMLElement | null = null;
	let feelingsLookup = $state<Map<string, string>>(new Map());

	const initFeelingsLookup = async () => {
		try {
			const records = await pb.collection('feelings').getFullList({
				sort: 'category,sort'
			});
			const data = serializeNonPOJOs(records) as any[];
			const lookup = new Map<string, string>();
			if (data && Array.isArray(data)) {
				data.forEach(feeling => {
					if (feeling && feeling.id && feeling.nameDE) {
						lookup.set(feeling.id, feeling.nameDE);
					}
				});
			}
			feelingsLookup = lookup;
		} catch (error) {
			console.error('Error initializing feelings lookup:', error);
			feelingsLookup = new Map();
		}
	};

	const updateImageRect = () => {
		if (imageElement) {
			imageRect = imageElement.getBoundingClientRect();
		}
	};
	const constrainPoint = (x: number, y: number): { x: number; y: number } => {
		if (!imageRect) return { x, y };

		// Constrain x and y to be within the image bounds
		const constrainedX = Math.max(0, Math.min(x, imageRect.width));
		const constrainedY = Math.max(0, Math.min(y, imageRect.height));

		return { x: constrainedX, y: constrainedY };
	};
	const drawPoint = (event: TouchEvent | MouseEvent) => {
		event.preventDefault();
		const button = event.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		
		let x: number, y: number;
		if (event instanceof TouchEvent) {
			const touch = event.touches[0];
			x = touch.clientX - rect.left;
			y = touch.clientY - rect.top;
		} else {
			x = event.clientX - rect.left;
			y = event.clientY - rect.top;
		}

		// Constrain the new point to image bounds
		const { x: constrainedX, y: constrainedY } = constrainPoint(x, y);

		activePointId = points.length;
		points = [...points, { id: activePointId, x: constrainedX, y: constrainedY, feelings: [] }];
	};


	const saveResponse = () => {
		onResponse({
			points: points.map(point => ({
				x: point.x,
				y: point.y,
				feelings: point.feelings
			}))
		});
	};
	const scrollToFeelings = () => {
		console.log('scrollToFeelings');
		setTimeout(() => {
			if (!feelingsElement || !feelingsElement.getBoundingClientRect) return;
			try {
				const offset = feelingsElement.getBoundingClientRect().top + window.scrollY + 200; // 100px offset from top
				window.scrollTo({
					top: offset,
					behavior: 'smooth'
				});
			} catch (error) {
				console.error('Error scrolling to feelings:', error);
			}
		}, 100);
	};
	const handleMove = (e: TouchEvent | MouseEvent) => {
		if (activePointId === null) return;
		e.preventDefault();
		const button = e.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		
		let x: number, y: number;
		if (e instanceof TouchEvent) {
			const touch = e.touches[0];
			x = touch.clientX - rect.left;
			y = touch.clientY - rect.top;
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		// Constrain the dragged point to image bounds
		const { x: constrainedX, y: constrainedY } = constrainPoint(x, y);

		points[activePointId] = { ...points[activePointId], x: constrainedX, y: constrainedY };
		points = [...points];
	};
	const dragPointAction = (node: HTMLElement, index: number) => {
		let isDraggingPoint = false;

		const handleStart = (e: TouchEvent | MouseEvent) => {
			// Don't start drag if clicking on controls
			const target = e.target as HTMLElement;
			if (target.closest('.point-controls')) {
				return;
			}
			e.stopPropagation();
			e.preventDefault();
			activePointId = index;
			isDraggingPoint = true;
		};

		const handleMove = (e: TouchEvent | MouseEvent) => {
			if (!isDraggingPoint || activePointId !== index) return;
			e.preventDefault();
			e.stopPropagation();
			
			// Get the main container (bodyscan-map) to calculate relative position
			const container = node.closest('.bodyscan-map') as HTMLElement;
			if (!container) return;
			
			const rect = container.getBoundingClientRect();
			let x: number, y: number;
			
			if (e instanceof TouchEvent) {
				const touch = e.touches[0];
				x = touch.clientX - rect.left;
				y = touch.clientY - rect.top;
			} else {
				x = e.clientX - rect.left;
				y = e.clientY - rect.top;
			}

			// Constrain the dragged point to image bounds
			const { x: constrainedX, y: constrainedY } = constrainPoint(x, y);

			points[activePointId] = { ...points[activePointId], x: constrainedX, y: constrainedY };
			points = [...points];
		};

		const handleEnd = () => {
			if (isDraggingPoint) {
				// Save response when point position changes
				saveResponse();
			}
			isDraggingPoint = false;
		};

		// Add event listeners to the node
		node.addEventListener('touchstart', handleStart, { passive: false });
		node.addEventListener('mousedown', handleStart);
		
		// Add move and end listeners to document for better drag experience
		document.addEventListener('touchmove', handleMove, { passive: false });
		document.addEventListener('mousemove', handleMove);
		document.addEventListener('touchend', handleEnd);
		document.addEventListener('mouseup', handleEnd);

		return {
			destroy() {
				node.removeEventListener('touchstart', handleStart);
				node.removeEventListener('mousedown', handleStart);
				document.removeEventListener('touchmove', handleMove);
				document.removeEventListener('mousemove', handleMove);
				document.removeEventListener('touchend', handleEnd);
				document.removeEventListener('mouseup', handleEnd);
			}
		};
	};
	const interactionAction = (node: HTMLElement) => {
		let isMouseDown = false;
		let hasCreatedPoint = false;

		const handleStart = (e: TouchEvent | MouseEvent) => {
			const target = e.target as HTMLElement;
			if (target.closest('.point-dot') || target.closest('.point-controls')) {
				return;
			}
			drawPoint(e);
			isMouseDown = true;
			hasCreatedPoint = true;
		};

		const handleEnd = () => {
			if (hasCreatedPoint && activePointId !== null) {
				// Save response when new point is created
				saveResponse();
				showFeelings = true;
				const activePoint = points.find((point) => point.id === activePointId);
				if (activePoint && activePoint.feelings.length === 0) {
					scrollToFeelings();
				}
			}
			isMouseDown = false;
			hasCreatedPoint = false;
		};

		const handleLocalMove = (e: TouchEvent | MouseEvent) => {
			// Only move if we're actively dragging and have created a point
			if (isMouseDown && activePointId !== null) {
				handleMove(e);
			}
		};

		// Touch events
		node.addEventListener('touchstart', handleStart, { passive: false });
		node.addEventListener('touchmove', handleLocalMove, { passive: false });
		node.addEventListener('touchend', handleEnd);
		node.addEventListener('touchcancel', handleEnd);

		// Mouse events
		node.addEventListener('mousedown', handleStart);
		node.addEventListener('mousemove', handleLocalMove);
		node.addEventListener('mouseup', handleEnd);
		node.addEventListener('mouseleave', handleEnd);

		return {
			destroy() {
				// Touch events
				node.removeEventListener('touchstart', handleStart);
				node.removeEventListener('touchmove', handleLocalMove);
				node.removeEventListener('touchend', handleEnd);
				node.removeEventListener('touchcancel', handleEnd);
				
				// Mouse events
				node.removeEventListener('mousedown', handleStart);
				node.removeEventListener('mousemove', handleLocalMove);
				node.removeEventListener('mouseup', handleEnd);
				node.removeEventListener('mouseleave', handleEnd);
			}
		};
	};
	const removePoint = (index: number) => {
		console.log('removePoint', index);
		points = points.filter((point) => point.id !== index);
		saveResponse();
	};
	const trashButtonAction = (node: HTMLElement) => {
		const handleStart = (e: TouchEvent | MouseEvent) => {
			// Only prevent default if we're actually on the button
			if (e.target === node || node.contains(e.target as Node)) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		const handleEnd = (e: TouchEvent | MouseEvent) => {
			// Only trigger if we're actually on the button
			if (e.target === node || node.contains(e.target as Node)) {
				e.preventDefault();
				e.stopPropagation();
				const index = parseInt(node.dataset.index || '0', 10);
				removePoint(index);
			}
		};

		const handleClick = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const index = parseInt(node.dataset.index || '0', 10);
			removePoint(index);
		};

		node.addEventListener('touchstart', handleStart, { passive: false });
		node.addEventListener('touchend', handleEnd, { passive: false });
		node.addEventListener('mousedown', handleStart);
		node.addEventListener('mouseup', handleEnd);
		node.addEventListener('click', handleClick);

		return {
			destroy() {
				node.removeEventListener('touchstart', handleStart);
				node.removeEventListener('touchend', handleEnd);
				node.removeEventListener('mousedown', handleStart);
				node.removeEventListener('mouseup', handleEnd);
				node.removeEventListener('click', handleClick);
			}
		};
	};
	const pencilButtonAction = (node: HTMLElement) => {
		const handleStart = (e: TouchEvent | MouseEvent) => {
			// Only prevent default if we're actually on the button
			if (e.target === node || node.contains(e.target as Node)) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		const handleEnd = (e: TouchEvent | MouseEvent) => {
			// Only trigger if we're actually on the button
			if (e.target === node || node.contains(e.target as Node)) {
				e.preventDefault();
				e.stopPropagation();
				const index = parseInt(node.dataset.index || '0', 10);
				activePointId = index;
				showFeelings = true;
				scrollToFeelings();
			}
		};

		const handleClick = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			const index = parseInt(node.dataset.index || '0', 10);
			activePointId = index;
			showFeelings = true;
			scrollToFeelings();
		};

		node.addEventListener('touchstart', handleStart, { passive: false });
		node.addEventListener('touchend', handleEnd, { passive: false });
		node.addEventListener('mousedown', handleStart);
		node.addEventListener('mouseup', handleEnd);
		node.addEventListener('click', handleClick);

		return {
			destroy() {
				node.removeEventListener('touchstart', handleStart);
				node.removeEventListener('touchend', handleEnd);
				node.removeEventListener('mousedown', handleStart);
				node.removeEventListener('mouseup', handleEnd);
				node.removeEventListener('click', handleClick);
			}
		};
	};

	// Add this function to handle clicks outside
	const handleClickOutside = (event: MouseEvent) => {
		// Check if the click target is outside both the feelings container and point controls
		const target = event.target as HTMLElement;
		const isOutsideFeelings = !target.closest('#feeling-selector');
		const isOutsidePointControls = !target.closest('.point-controls');
		const isOutsidePointDot = !target.closest('.point-dot');

		// Only close if the active point has feelings
		if (isOutsideFeelings && isOutsidePointControls && isOutsidePointDot) {
			const activePoint = points.find((point) => point.id === activePointId);
			if (activePoint && activePoint.feelings.length > 0) {
				showFeelings = false;
				activePointId = null;
			}
		}
	};

	onMount(() => {
		// Initialize feelings lookup
		initFeelingsLookup();
		
		// Load existing response if available
		if (session && contentBlock) {
			const existingResponse = session.responses.find(r => r.blockType === 'bodymap' && 
				JSON.stringify(r.blockContent) === JSON.stringify(contentBlock));
			if (existingResponse) {
				points = existingResponse.response.points.map((point: any, index: number) => ({
					id: index,
					x: point.x,
					y: point.y,
					feelings: point.feelings
				}));
			}
		}
		
		// Update image rect when image loads
		if (imageElement) {
			imageElement.onload = updateImageRect;
			updateImageRect();
		}

		// Add click listener to document
		document.addEventListener('click', handleClickOutside);

		// Clean up listener on component destroy
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<!-- {JSON.stringify(selectedFeelings)}
<br />
{JSON.stringify(activePointId)}
<br />
{JSON.stringify(points)} -->

<div class="flex justify-center mb-6">
	<div class="relative flex w-full flex-col items-center justify-center gap-1">
		<div
			role="button"
			aria-label="bodyscan map"
			use:interactionAction
			class="bodyscan-map relative touch-none"
			tabindex="0"
			style="touch-action: manipulation;"
		>
			{#each points as point, i}
				<div
					class="point-dot absolute z-10 -m-2.5 size-5 rounded-full bg-white"
					style="left: {point.x}px; top: {point.y}px;"
					use:dragPointAction={i}
				>
					<div class="pointer-events-none relative z-10 h-full w-full">
						<div
							class="point-controls absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 transform flex-col items-center gap-1 rounded-[18px] bg-white "
						>
							<div class="flex flex-col gap-1 px-2 pt-2 {i === activePointId ? '' : 'pb-2'}">
								{#each point.feelings as feeling}
									<div class="flex items-center justify-center gap-1">
										<div class="text-center text-xs">
											{feelingsLookup.get(feeling) || feeling}
										</div>
									</div>
								{/each}
							</div>
							{#if i === activePointId}
								<div class="flex items-center gap-1 px-2 pb-2">
									<button
										aria-label="edit feelings"
										use:pencilButtonAction
										data-index={i}
										class="point-control pointer-events-auto touch-none"
										type="button"
									>
										<Pencil class="size-4" />
									</button>
									<div class="h-4 w-[1px] bg-black/5"></div>
									<button
										aria-label="remove point"
										use:trashButtonAction
										data-index={i}
										class="point-control pointer-events-auto touch-none"
										type="button"
									>
										<Trash class="size-4" />
									</button>
								</div>
							{/if}
						</div>
						<div
							class="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full animate-ping rounded-full bg-white"
						></div>
					</div>
				</div>
			{/each}
			<img
				bind:this={imageElement}
				src="/learn/character.svg"
				alt="bodyscan"
				class="w-52"
				onload={updateImageRect}
			/>
		</div>

		<div bind:this={feelingsElement}></div>
		{#each points as point}
			{#if showFeelings && point.id === activePointId}
				<FeelingSelector
					selectedFeelings={point.feelings}
					onFeelingChange={(feelings) => {
						point.feelings = feelings;
						points = [...points];
						saveResponse();
					}}
					pointId={point.id}
					show={true}
				/>
			{/if}
		{/each}
	</div>
</div>
