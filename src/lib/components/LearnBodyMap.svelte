<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs } from '$scripts/helpers';
	import Trash from 'lucide-svelte/icons/trash';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import FeelingSelector from '$lib/components/FeelingSelector.svelte';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import LearnSplashScreen from '$lib/components/bullshift/Learn/LearnSplashScreen.svelte';

	interface Props {
		content: object;
		color: string;
		session: LearningSession; // Required, not null
		onResponse: (response: { points: Array<{ x: number; y: number; feelings: string[] }> }) => void;
		contentBlock?: any;
		topicVersionId?: string;
		gotoNextStep: () => void;
	}

	let { content, color, session, onResponse, contentBlock, topicVersionId, gotoNextStep }: Props =
		$props();

	let points = $state<{ id: number; x: number; y: number; feelings: string[] }[]>([]);
	let showFeelings = $state<boolean>(false);
	let feelingsElement = $state<HTMLElement | null>(null);
	let activePointId = $state<number | null>(null);
	let imageElement: HTMLImageElement;
	let feelingsLookup = $state<Map<string, string>>(new Map());
	let splashDone = $state(false);
	let nextPointId = $state(0);
	let isDragging = $state(false);
	let dragStartTime = 0;
	let dragStartPos = { x: 0, y: 0 };
	let lastPointCreationTime = 0;

	const splashContentClass = $derived(() => {
		return splashDone ? 'opacity-100 scale-100' : 'opacity-0 scale-0';
	});



	const initFeelingsLookup = async () => {
		try {
			const records = await pb.collection('feelings').getFullList({
				sort: 'category,sort'
			});
			const data = serializeNonPOJOs(records) as any[];
			const lookup = new Map<string, string>();
			if (data && Array.isArray(data)) {
				data.forEach((feeling) => {
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

	const constrainPoint = (x: number, y: number): { x: number; y: number } => {
		const image = imageElement;
		if (!image) return { x, y };

		const constrainedX = Math.max(0, Math.min(x, image.offsetWidth));
		const constrainedY = Math.max(0, Math.min(y, image.offsetHeight));

		return { x: constrainedX, y: constrainedY };
	};

	const getEventCoordinates = (event: TouchEvent | MouseEvent, container: HTMLElement) => {
		const rect = container.getBoundingClientRect();
		let x: number, y: number;

		if (event instanceof TouchEvent) {
			const touch = event.touches[0] || event.changedTouches[0];
			x = touch.clientX - rect.left;
			y = touch.clientY - rect.top;
		} else {
			x = event.clientX - rect.left;
			y = event.clientY - rect.top;
		}

		return constrainPoint(x, y);
	};

	const saveResponse = () => {
		const responseData = {
			points: points.map((point) => ({
				x: point.x,
				y: point.y,
				feelings: point.feelings
			}))
		};
		console.log('LearnBodyMap saveResponse:', responseData);
		onResponse(responseData);
	};

	const scrollToFeelings = () => {
		setTimeout(() => {
			if (!feelingsElement?.getBoundingClientRect) return;
			try {
				const offset = feelingsElement.getBoundingClientRect().top + window.scrollY + 200;
				window.scrollTo({
					top: offset,
					behavior: 'smooth'
				});
			} catch (error) {
				console.error('Error scrolling to feelings:', error);
			}
		}, 100);
	};

	const createPoint = (event: TouchEvent | MouseEvent) => {
		const container = event.currentTarget as HTMLElement;
		const { x, y } = getEventCoordinates(event, container);

		const newPoint = { id: nextPointId, x, y, feelings: [] };
		points = [...points, newPoint];
		activePointId = nextPointId;
		nextPointId++;
		lastPointCreationTime = Date.now(); // Track when point was created

		showFeelings = true;
		saveResponse();
		scrollToFeelings();
	};

	const updatePointPosition = (pointId: number, event: TouchEvent | MouseEvent) => {
		const container = document.querySelector('.bodyscan-map') as HTMLElement;
		if (!container) return;

		const { x, y } = getEventCoordinates(event, container);
		const pointIndex = points.findIndex((p) => p.id === pointId);

		if (pointIndex !== -1) {
			points[pointIndex] = { ...points[pointIndex], x, y };
			points = [...points];
		}
	};

	const removePoint = (pointId: number) => {
		points = points.filter((point) => point.id !== pointId);

		activePointId = null;
		showFeelings = false;

		saveResponse();
	};

	const handlePointClick = (pointId: number) => {
		activePointId = pointId;
		showFeelings = true;
		const point = points.find((p) => p.id === pointId);
		if (point && point.feelings.length === 0) {
			scrollToFeelings();
		}
	};

	// Map interaction handlers
	const handleMapMouseDown = (event: MouseEvent | TouchEvent) => {
		const target = event.target as HTMLElement;
		if (target.closest('.point-dot') || target.closest('.point-controls')) {
			return;
		}

		if (showFeelings) {
			return; // Let click outside handle this
		}

		event.preventDefault();
		event.stopPropagation();

		// Create point immediately on mouse/touch down
		createPoint(event);

		// Start drag tracking for the new point
		isDragging = true;
		dragStartTime = Date.now();
		if (event instanceof TouchEvent) {
			const touch = event.touches[0];
			dragStartPos = { x: touch.clientX, y: touch.clientY };
		} else {
			dragStartPos = { x: event.clientX, y: event.clientY };
		}
	};

	const handlePointMouseDown = (event: MouseEvent | TouchEvent, pointId: number) => {
		event.preventDefault();
		event.stopPropagation();

		isDragging = true;
		activePointId = pointId;
		dragStartTime = Date.now();
		if (event instanceof TouchEvent) {
			const touch = event.touches[0];
			dragStartPos = { x: touch.clientX, y: touch.clientY };
		} else {
			dragStartPos = { x: event.clientX, y: event.clientY };
		}
	};



	const handleMouseMove = (event: MouseEvent | TouchEvent) => {
		if (!isDragging || activePointId === null) return;

		event.preventDefault();
		updatePointPosition(activePointId, event);
	};

	const handleMouseUp = (event: MouseEvent | TouchEvent) => {
		if (!isDragging || activePointId === null) return;

		event.preventDefault();
		event.stopPropagation();

		const timeDiff = Date.now() - dragStartTime;
		let distance = 0;
		if (event instanceof TouchEvent) {
			const touch = event.changedTouches[0];
			distance = Math.sqrt(
				(touch.clientX - dragStartPos.x) ** 2 + (touch.clientY - dragStartPos.y) ** 2
			);
		} else {
			distance = Math.sqrt(
				(event.clientX - dragStartPos.x) ** 2 + (event.clientY - dragStartPos.y) ** 2
			);
		}

		const pointId = activePointId;
		isDragging = false;

		// Update last interaction time to prevent immediate deletion
		lastPointCreationTime = Date.now();

		// If it was a click (short time and small movement), show feelings
		// For newly created points, always show feelings after creation
		if (timeDiff < 200 && distance < 10) {
			// Short click - ensure feelings are shown and scroll to them
			if (!showFeelings) {
				showFeelings = true;
				const point = points.find((p) => p.id === pointId);
				if (point && point.feelings.length === 0) {
					scrollToFeelings();
				}
			}
		} else {
			// It was a drag, save the new position but keep feelings open
			saveResponse();
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		// Handle click events (after other interactions complete)
		if (event.type !== 'click') {
			return;
		}

		// Don't handle during any interaction
		if (isDragging) {
			return;
		}

		// Don't handle immediately after any mouse interaction
		if (Date.now() - lastPointCreationTime < 300) {
			return;
		}

		// Only handle when a point is active (either point-controls or feelings selector is shown)
		if (activePointId === null) {
			return;
		}

		const target = event.target as HTMLElement;
		const isOutsideFeelings =
			!target.closest('#feeling-selector') &&
			!target.closest('.feeling-selector') &&
			!target.closest('[data-toggle-group-root]') &&
			!target.closest('[data-toggle-group-item]');
		const isOutsidePointControls = !target.closest('.point-controls');
		const isOutsidePointDot = !target.closest('.point-dot');
		const isOutsideMap = !target.closest('.bodyscan-map');

		console.log('isOutsideFeelings', isOutsideFeelings);
		console.log('isOutsidePointControls', isOutsidePointControls);
		console.log('isOutsidePointDot', isOutsidePointDot);
		console.log('isOutsideMap', isOutsideMap);

		if ((isOutsideFeelings && isOutsidePointControls && isOutsidePointDot) || (isOutsideFeelings && isOutsideMap)) {
			// Check if active point has no feelings and delete it
			const activePoint = points.find((point) => point.id === activePointId);
			if (activePoint && activePoint.feelings.length === 0) {
				removePoint(activePointId!);
			} else {
				activePointId = null;
				showFeelings = false;
			}
		}
	};

	onMount(() => {
		initFeelingsLookup();

		// Load existing response if available (session is guaranteed to be present)
		if (contentBlock && session.responses) {
			console.log('Loading existing bodymap response...');
			console.log('- session:', session);
			console.log('- contentBlock:', contentBlock);
			console.log('- session.responses:', session.responses);

			const existingResponse = session.responses.find((r) => {
				console.log('Checking response:', r);
				console.log('- blockType:', r.blockType);
				console.log(
					'- blockContent match:',
					JSON.stringify(r.blockContent) === JSON.stringify(contentBlock)
				);
				return (
					r.blockType === 'bodymap' &&
					JSON.stringify(r.blockContent) === JSON.stringify(contentBlock)
				);
			});

			console.log('Found existing response:', existingResponse);

			if (existingResponse && existingResponse.response && existingResponse.response.points) {
				console.log('Loading existing bodymap response:', existingResponse.response);
				points = existingResponse.response.points.map((point: any, index: number) => ({
					id: index,
					x: point.x,
					y: point.y,
					feelings: point.feelings || []
				}));
				nextPointId = points.length;
				console.log('Loaded points:', points);
				console.log('Next point ID set to:', nextPointId);
			} else {
				console.log('No existing response found or invalid structure');
			}
		}

		document.addEventListener('click', handleClickOutside);
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchmove', handleMouseMove, { passive: false });
		document.addEventListener('touchend', handleMouseUp, { passive: false });

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchmove', handleMouseMove);
			document.removeEventListener('touchend', handleMouseUp);
		};
	});
</script>

<div class="relative mb-6 flex h-full justify-center">
	<LearnSplashScreen
		{color}
		text="Zeit zu Fühlen"
		on:splashDone={() => {
			splashDone = true;
		}}
	/>
	<div
		class="relative flex w-full transform flex-col items-center justify-center gap-1 transition-all duration-1000 {splashContentClass()}"
	>
		<div
			role="button"
			aria-label="bodyscan map"
			class="bodyscan-map relative z-10 flex-shrink-0 touch-none"
			tabindex="0"
			style="touch-action: manipulation;"
			onmousedown={handleMapMouseDown}
			ontouchstart={handleMapMouseDown}
		>
			{#each points as point}
				<div
					class="point-dot absolute z-10 -m-2.5 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
					style="left: {point.x}px; top: {point.y}px;"
					onmousedown={(e) => handlePointMouseDown(e, point.id)}
					ontouchstart={(e) => handlePointMouseDown(e, point.id)}
				>
					<div
						class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-1 py-0.5 text-center text-xs"
					>
						{point.feelings.length}
					</div>

					<div
						class="point-controls absolute left-1/2 z-20 flex -translate-x-1/2 transform flex-col items-center gap-1 rounded-xl bg-white shadow-md {point.y <
						78
							? 'top-full mt-2'
							: 'bottom-full mb-2'} {point.id === activePointId
							? 'max-h-96 opacity-100'
							: 'max-h-0 opacity-0'} pointer-events-auto"
					>
						<div class="flex flex-col gap-1 px-2 pt-2 {point.id === activePointId ? '' : 'pb-2'}">
							{#each point.feelings as feeling}
								<div class="flex items-center justify-center gap-1">
									<div class="text-center text-xs">
										{feelingsLookup.get(feeling) || feeling}
									</div>
								</div>
							{/each}
						</div>
						{#if point.id === activePointId}
							<div class="mt-1 flex items-center gap-1 px-2 pb-2">
								<button
									aria-label="remove point"
									onclick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										removePoint(point.id);
									}}
									class="point-control pointer-events-auto flex min-w-24 touch-none items-center justify-between gap-1 rounded-md bg-red-500 px-2 py-0.5 text-white"
									type="button"
								>
									<span class="text-xs">löschen</span>
									<Trash class="size-3" />
								</button>
							</div>
						{/if}
					</div>

					<div
						class="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full animate-ping rounded-full bg-white"
					></div>
				</div>
			{/each}
			<img
				bind:this={imageElement}
				src="/learn/character.svg"
				alt="bodyscan"
				class="w-48"
				draggable="false"
			/>
		</div>

		<div bind:this={feelingsElement}></div>

		<div class="w-full flex-grow overflow-y-auto overflow-x-hidden p-1">
			{#if showFeelings}
				{#each points as point}
					{#if point.id === activePointId}
						<FeelingSelector
							selectedFeelings={point.feelings}
							onFeelingChange={(feelings) => {
								console.log('LearnBodyMap onFeelingChange:', { pointId: point.id, feelings });
								point.feelings = feelings;
								points = [...points];
								saveResponse();
								console.log('activePointId', activePointId);
							}}
							pointId={point.id}
							show={true}
						/>
					{/if}
				{/each}
			{:else}
				<div class="text-center text-sm text-gray-500">Klicke auf den Körper, um zu beginnen</div>
			{/if}
		</div>

		<LearnGotoNextButton
			onClick={() => {
				if (gotoNextStep) {
					gotoNextStep();
				}
			}}
		>
			Weiter
		</LearnGotoNextButton>
	</div>
</div>
