<script lang="ts">
	import { pb } from '$scripts/pocketbase';

	interface Plot {
		x: number;
		y: number;
		type: string;
		plant_id: string | null;
		planted_at: string | null;
		growth_stage: number;
		last_watered: string | null;
		build_level?: number;
	}

	interface Props {
		plots: Plot[];
		items?: Array<{
			id: string;
			name: string;
			sprite?: string;
		}>;
		onPlotClick?: (x: number, y: number) => void;
	}

	let { plots, items = [], onPlotClick }: Props = $props();

	// Zoom and pan state
	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);
	let isDragging = $state(false);
	let lastMouseX = $state(0);
	let lastMouseY = $state(0);

	// Get plant display based on item data or fallback to emoji
	const getPlantDisplay = (plot: Plot): { type: 'sprite' | 'emoji', content: string } => {
		if (!plot.plant_id) return { type: 'emoji', content: '' };

		// Find the item in the items array
		const item = items.find(item => item.id === plot.plant_id);
		
		// Use sprite if item has one
		if (item?.sprite) {
			const imageUrl = `${pb.baseUrl}/api/files/items/${item.id}/${item.sprite}`;
			return { type: 'sprite', content: imageUrl };
		}

		// Handle terraform items (shouldn't appear as plants, but just in case)
		if (item?.category === 'terraform') {
			// Don't show terraform items as plants - they modify the terrain itself
			return { type: 'emoji', content: '' };
		}

		// Fallback to emoji based on growth stage
		const stage = plot.growth_stage;

		// Simple emoji-based sprites for fallback
		if (plot.plant_id.includes('rose')) {
			switch (stage) {
				case 0: return { type: 'emoji', content: '🌱' };
				case 1: return { type: 'emoji', content: '🌿' };
				case 2: return { type: 'emoji', content: '🌹' };
				default: return { type: 'emoji', content: '🌹' };
			}
		} else if (plot.plant_id.includes('oak')) {
			switch (stage) {
				case 0: return { type: 'emoji', content: '🌱' };
				case 1: return { type: 'emoji', content: '🌿' };
				case 2: return { type: 'emoji', content: '🌳' };
				default: return { type: 'emoji', content: '🌳' };
			}
		}

		// Default progression
		switch (stage) {
			case 0: return { type: 'emoji', content: '🌱' };
			case 1: return { type: 'emoji', content: '🌿' };
			case 2: return { type: 'emoji', content: '🌸' };
			default: return { type: 'emoji', content: '🌸' };
		}
	};

	// Zoom and pan handlers
	const handleWheel = (e: WheelEvent) => {
		e.preventDefault();
		const zoomFactor = e.deltaY > 0 ? 0.99 : 1.01;
		const newScale = Math.max(0.5, Math.min(3, scale * zoomFactor));
		scale = newScale;
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (e.button === 0) {
			// Left mouse button
			isDragging = true;
			lastMouseX = e.clientX;
			lastMouseY = e.clientY;
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (isDragging) {
			const deltaX = e.clientX - lastMouseX;
			const deltaY = e.clientY - lastMouseY;

			// Apply panning limits based on scale
			const maxPan = 400 * scale;
			const maxPanY = 200 * scale; // Tighter bottom boundary
			const newTranslateX = Math.max(-maxPan, Math.min(maxPan, translateX + deltaX));
			const newTranslateY = Math.max(-maxPanY, Math.min(maxPan, translateY + deltaY));

			translateX = newTranslateX;
			translateY = newTranslateY;
			lastMouseX = e.clientX;
			lastMouseY = e.clientY;
		}
	};

	const handleMouseUp = () => {
		isDragging = false;
	};

	// Touch handlers for mobile
	let initialPinchDistance = $state(0);
	let initialScale = $state(1);

	const getTouchDistance = (touches: TouchList): number => {
		if (touches.length < 2) return 0;
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	};

	const handleTouchStart = (e: TouchEvent) => {
		if (e.touches.length === 1) {
			isDragging = true;
			lastMouseX = e.touches[0].clientX;
			lastMouseY = e.touches[0].clientY;
		} else if (e.touches.length === 2) {
			// Pinch zoom start
			isDragging = false;
			initialPinchDistance = getTouchDistance(e.touches);
			initialScale = scale;
		}
	};

	const handleTouchMove = (e: TouchEvent) => {
		if (e.touches.length === 1 && isDragging) {
			const deltaX = e.touches[0].clientX - lastMouseX;
			const deltaY = e.touches[0].clientY - lastMouseY;

			// Apply same panning limits for touch
			const maxPan = 400 * scale;
			const maxPanY = 200 * scale; // Tighter bottom boundary
			const newTranslateX = Math.max(-maxPan, Math.min(maxPan, translateX + deltaX));
			const newTranslateY = Math.max(-maxPanY, Math.min(maxPan, translateY + deltaY));

			translateX = newTranslateX;
			translateY = newTranslateY;
			lastMouseX = e.touches[0].clientX;
			lastMouseY = e.touches[0].clientY;
		} else if (e.touches.length === 2) {
			// Pinch zoom
			const currentDistance = getTouchDistance(e.touches);
			if (initialPinchDistance > 0) {
				const scaleChange = currentDistance / initialPinchDistance;
				const newScale = Math.max(0.5, Math.min(3, initialScale * scaleChange));
				scale = newScale;
			}
		}
	};

	const handleTouchEnd = () => {
		isDragging = false;
		initialPinchDistance = 0;
	};

	const diamondHeight = 252;
	const diamondWidth = 504;
</script>

<div
	class="relative mx-auto h-full w-full cursor-grab overflow-hidden"
	class:cursor-grabbing={isDragging}
	style="perspective: 1000px;"
	onwheel={handleWheel}
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseUp}
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
	style:touch-action="none"
	role="button"
	tabindex="0"
>
	<div
		class="relative h-full w-full transition-transform duration-100 ease-out"
		style="transform: translate({translateX}px, {translateY}px) scale({scale});"
	>
		<div
			class="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform w-[{diamondWidth}px] h-[{diamondHeight}px]"
		>
			<img src="/diagrams/plotBase.svg" style="width: calc(28px * 9);" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-[2] mt-5" alt="Plot Base" />
			{#each plots as plot (plot.x + '-' + plot.y)}
				<!-- Debug: Show plot info for debugging -->
				{#if plot.build_level && plot.build_level > 0}
					{console.log(`Plot ${plot.x}-${plot.y}: type=${plot.type}, build_level=${plot.build_level}`)}
				{/if}
				<div
					class="absolute -mt-3 h-10 w-10 cursor-pointer transition-all duration-200 ease-in-out hover:z-10"
					class:empty={!plot.plant_id}
					class:planted={plot.plant_id}
					class:elevated={plot.build_level && plot.build_level > 0}
					style="left: calc((({plot.x}) - ({plot.y})) * calc(28px / env(device-pixel-ratio, 1)) + 50% - 20px); top: calc((({plot.x}) + ({plot.y})) * calc(14px / env(device-pixel-ratio, 1)) + 50% - 120px); transform: translateY({-(plot.build_level || 0) * 3}px); transform-style: preserve-3d;"
					onclick={() => onPlotClick?.(plot.x, plot.y)}
					onkeydown={(e) => e.key === 'Enter' && onPlotClick?.(plot.x, plot.y)}
					role="button"
					tabindex="0"
				>
					<!-- Plot Base -->
					<div
						class="relative h-full w-full transform-gpu shadow-inner transition-all duration-200 hover:brightness-125 hover:contrast-110"
						class:bg-gradient-to-br={true}
						class:border-amber-800={plot.type === 'soil'}
						class:from-amber-700={plot.type === 'soil'}
						class:to-amber-600={plot.type === 'soil'}
						class:border-blue-400={plot.type === 'water'}
						class:from-blue-500={plot.type === 'water'}
						class:to-blue-600={plot.type === 'water'}
						class:border-gray-600={plot.type === 'path'}
						class:from-gray-500={plot.type === 'path'}
						class:to-gray-400={plot.type === 'path'}
						class:border-amber-900={plot.type === 'dirt'}
						class:from-amber-800={plot.type === 'dirt'}
						class:to-amber-900={plot.type === 'dirt'}
						class:border={true}
						style="transform: scaleY({plot.build_level && plot.build_level > 0 ? (plot.type === 'dirt' ? 0.6 - (plot.build_level * 0.05) : 0.5 - (plot.build_level * 0.05)) : (plot.type === 'dirt' ? 0.6 : 0.5)}) rotate(45deg); box-shadow: inset 0 1px 0 rgba(255,255,255,{plot.type === 'dirt' ? 0.2 : 0.1}), 0 {(plot.build_level || 0) + 2}px 4px rgba(0,0,0,{0.2 + (plot.build_level || 0) * 0.1});"
					></div>

					<!-- Dirt Block Fill (3D effect for elevated plots) -->
					{#if plot.build_level && plot.build_level > 0 && plot.type === 'dirt'}
						<!-- Left side of dirt block -->
						<div
							class="absolute left-1/4 bottom-0 w-1/2 bg-gradient-to-b from-amber-700 to-amber-800"
							style="height: {plot.build_level * 4}px; transform: translateY(50%) translateX(-50%) skewY(-45deg) scaleX(0.7); transform-origin: bottom center; z-index: -1;"
						></div>
						<!-- Right side of dirt block -->
						<div
							class="absolute right-1/4 bottom-0 w-1/2 bg-gradient-to-b from-amber-800 to-amber-900"
							style="height: {plot.build_level * 4}px; transform: translateY(50%) translateX(50%) skewY(45deg) scaleX(0.7); transform-origin: bottom center; z-index: -1;"
						></div>
					{/if}

					<!-- Plant -->
					{#if plot.plant_id}
						{@const display = getPlantDisplay(plot)}
						<div
							class="absolute bottom-2.5 w-10 left-1/2 z-[2] -translate-x-1/2 transform animate-pulse pointer-events-none"
							style="animation: gentle-sway 3s ease-in-out infinite;"
						>
							{#if display.type === 'sprite'}
							<img src={display.content} alt="Plant" class="w-24 pointer-events-none" />
							{:else}
								<span class="block text-2xl drop-shadow-lg pointer-events-none">{display.content}</span>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	@keyframes gentle-sway {
		0%,
		100% {
			transform: translateX(-50%) rotate(0deg);
		}
		25% {
			transform: translateX(-50%) rotate(1deg);
		}
		75% {
			transform: translateX(-50%) rotate(-1deg);
		}
	}


	/* Responsive adjustments */
	@media (max-width: 768px) {
		.garden-grid {
			height: 400px;
		}
	}
</style>
