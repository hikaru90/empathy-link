<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Trash from 'lucide-svelte/icons/trash';

	interface Props {
		content: object;
		color: string;
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

	let { content, color }: Props = $props();

	let points = $state<{ id: number; x: number; y: number; feelings: string[] }[]>([]);
	let feelings = $state<dbFeeling[]>([]);
	let groupedFeelings = $state<feeling[]>([]);
	let showFeelings = $state<boolean>(false);
	let feelingsElement = $state<HTMLElement | null>(null);
	let activePointId = $state<number | null>(null);
	let imageElement: HTMLImageElement;
	let imageRect: DOMRect | null = null;
	let previousActivePointId = $state<number | null>(null);
	let feelingsContainer: HTMLElement | null = null;

	$effect(() => {
		if (activePointId !== previousActivePointId) {
			groupedFeelings = groupedFeelings.map((group) => ({
				...group,
				content: group.content.map((category) => ({
					...category,
					visible: false
				}))
			}));
			previousActivePointId = activePointId;
		}
	});

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
	const drawPoint = (event: TouchEvent) => {
		event.preventDefault();
		const button = event.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		const touch = event.touches[0];
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;

		// Constrain the new point to image bounds
		const { x: constrainedX, y: constrainedY } = constrainPoint(x, y);

		activePointId = points.length;
		points = [...points, { id: activePointId, x: constrainedX, y: constrainedY, feelings: [] }];
	};
	const initFeelings = async () => {
		const records = await pb.collection('feelings').getFullList({
			sort: 'category,sort'
		});
		const data = serializeNonPOJOs(records) as dbFeeling[];
		feelings = data;
		let res = groupBy(data, 'positive') as feeling[];
		res = res.map((entry) => ({
			category: entry.category as 'true' | 'false',
			content: groupBy(entry.content, 'category').map((category) => ({
				...category,
				visible: false
			}))
		}));
		console.log('feelings res', res);
		groupedFeelings = res;
	};
	const toggleFeelingsCatgeory = (feeling: dbFeeling, category: string) => {
		if (feeling.nameEN !== category) return;
		const target0 = groupedFeelings[0].content.find((entry) => entry.category === category);
		const target1 = groupedFeelings[1].content.find((entry) => entry.category === category);
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
	const selectFeeling = (feeling: dbFeeling) => {
		const activePoint = points.find((point) => point.id === activePointId);
		if (activePoint?.feelings?.includes(feeling.id)) {
			activePoint.feelings = activePoint.feelings.filter((id) => id !== feeling.id);
		} else {
			points.find((point) => point.id === activePointId)?.feelings.push(feeling.id);
		}
	};
	const scrollToFeelings = () => {
		console.log('scrollToFeelings');
		setTimeout(() => {
			if (!feelingsElement) return;
			const offset = feelingsElement.getBoundingClientRect().top + window.scrollY + 200; // 100px offset from top
			window.scrollTo({
				top: offset,
				behavior: 'smooth'
			});
		}, 100);
	};
	const handleTouchMove = (e: TouchEvent) => {
		if (activePointId === null) return;
		e.preventDefault();
		const button = e.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		const touch = e.touches[0];
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;

		// Constrain the dragged point to image bounds
		const { x: constrainedX, y: constrainedY } = constrainPoint(x, y);

		points[activePointId] = { ...points[activePointId], x: constrainedX, y: constrainedY };
		points = [...points];
	};
	const dragPointAction = (node: HTMLElement, index: number) => {
		const handleTouchStart = (e: TouchEvent) => {
			// Don't start drag if clicking on controls
			const target = e.target as HTMLElement;
			if (target.closest('.point-controls')) {
				return;
			}
			e.stopPropagation();
			e.preventDefault();
			activePointId = index;
		};

		node.addEventListener('touchstart', handleTouchStart, { passive: false });
		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
			}
		};
	};
	const touchAction = (node: HTMLElement) => {
		const handleTouchStart = (e: TouchEvent) => {
			const target = e.target as HTMLElement;
			if (target.closest('.point-dot') || target.closest('.point-controls')) {
				return;
			}
			drawPoint(e);
		};
		const handleTouchEnd = () => {
			if (activePointId !== null) {
				showFeelings = true;
				const activePoint = points.find((point) => point.id === activePointId);
				if (activePoint && activePoint.feelings.length === 0) {
					scrollToFeelings();
				}
			}
		};

		node.addEventListener('touchstart', handleTouchStart, { passive: false });
		node.addEventListener('touchmove', handleTouchMove, { passive: false });
		node.addEventListener('touchend', handleTouchEnd);
		node.addEventListener('touchcancel', handleTouchEnd);

		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
				node.removeEventListener('touchend', handleTouchEnd);
				node.removeEventListener('touchcancel', handleTouchEnd);
			}
		};
	};
	const removePoint = (index: number) => {
		console.log('removePoint', index);
		points = points.filter((point) => point.id !== index);
	};
	const trashButtonAction = (node: HTMLElement) => {
		const handleTouchStart = (e: TouchEvent) => {
			// Only prevent default if we're actually on the button
			if (e.target === node || node.contains(e.target as Node)) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		const handleTouchEnd = (e: TouchEvent) => {
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

		node.addEventListener('touchstart', handleTouchStart, { passive: false });
		node.addEventListener('touchend', handleTouchEnd, { passive: false });
		node.addEventListener('click', handleClick);

		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchend', handleTouchEnd);
				node.removeEventListener('click', handleClick);
			}
		};
	};
	const pencilButtonAction = (node: HTMLElement) => {
		const handleTouchStart = (e: TouchEvent) => {
			// Only prevent default if we're actually on the button
			if (e.target === node || node.contains(e.target as Node)) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		const handleTouchEnd = (e: TouchEvent) => {
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

		node.addEventListener('touchstart', handleTouchStart, { passive: false });
		node.addEventListener('touchend', handleTouchEnd, { passive: false });
		node.addEventListener('click', handleClick);

		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchend', handleTouchEnd);
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
			}
		}
	};

	onMount(async () => {
		initFeelings();
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

<div class="flex justify-center">
	<div class="relative flex w-full flex-col items-center justify-center gap-1">
		<div
			role="button"
			aria-label="bodyscan map"
			use:touchAction
			class="bodyscan-map relative touch-none"
			tabindex="0"
			style="touch-action: none;"
		>
			{#each points as point, i}
				<div
					class="point-dot absolute z-10 -m-2.5 size-5 rounded-full bg-white"
					style="left: {point.x}px; top: {point.y}px;"
					use:dragPointAction={i}
				>
					{#if i === activePointId}
						<div class="pointer-events-none relative z-10 h-full w-full">
							<div
								class="point-controls absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 transform flex-col items-center gap-1 rounded-[18px] bg-white p-2"
							>
								<div class="flex flex-col gap-1">
									{#each point.feelings as feeling}
										<div class="flex items-center justify-center gap-1">
											<div class="text-center text-xs">
												{feelings.find((f) => f.id === feeling)?.nameDE}
											</div>
										</div>
									{/each}
								</div>
								<div class="flex items-center gap-1">
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
							</div>
							<div
								class="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full animate-ping rounded-full bg-white"
							></div>
						</div>
					{/if}
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
				<ToggleGroup.Root
					name={point.id}
					id="feeling-selector"
					type="multiple"
					bind:value={point.feelings}
					onValueChange={(value) => {
						console.log('value', value);
					}}
					class="flex flex-col gap-4 transition-all duration-800"
				>
					{#if groupedFeelings.length > 0}
						<div class="">
							<div class="-mx-1 flex w-full flex-wrap justify-start transition-all">
								{#each groupedFeelings as positive}
									{#each positive.content as category}
										{#each category.content as feeling}
											<button
												type="button"
												onclick={() => toggleFeelingsCatgeory(feeling, category.category)}
												class="{categoryIsVisible(feeling, category) ||
												point.feelings.includes(feeling.id)
													? 'pointer-events-auto max-w-[300px] p-0.5 opacity-100'
													: 'pointer-events-none m-0 max-w-0 text-[2px] opacity-0'} block h-7 leading-none transition-all"
											>
												<ToggleGroup.Item
													value={feeling.id}
													class="{feeling.nameEN === category.category
														? `bg-white/40 hover:bg-white/30`
														: ''} h-auto max-w-[300px] rounded-full px-2 py-0.5 text-xs text-black hover:bg-white/30 hover:text-black data-[state=on]:bg-white"
												>
													{#if feeling.nameEN === category.category}
														<div
															class="-ml-0.5 mr-1 size-1.5 rounded-full {positive.category ===
															'true'
																? 'bg-green-400'
																: 'bg-red-400'}"
														></div>
													{/if}
													{feeling.nameDE}
												</ToggleGroup.Item>
											</button>
										{/each}
									{/each}
								{/each}
							</div>
						</div>
					{/if}
				</ToggleGroup.Root>
			{/if}
		{/each}
	</div>
</div>
