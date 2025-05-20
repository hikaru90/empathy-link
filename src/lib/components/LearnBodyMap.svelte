<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import Box from 'lucide-svelte/icons/box';

	interface Props {
		content: object;
		color: string;
	}

	let { content, color }: Props = $props();

	let points = $state<{ x: number; y: number }[]>([]);
	let feelings = $state<any[]>([]);
	let selectedFeelings = $state<any[]>([]);
	let showFeelings = $state<boolean>(false);
	let feelingsElement = $state<HTMLElement | null>(null);
	let activePoint = $state<{ x: number; y: number } | null>(null);

	const drawPoint = (event: TouchEvent) => {
		event.preventDefault();
		const button = event.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		console.log('button',rect);
		const touch = event.touches[0];
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;
		
		activePoint = { x, y };
		points = [...points, activePoint];
	};

	const updatePoint = (event: TouchEvent) => {
		event.preventDefault();
		if (!activePoint) return;
		const button = event.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		const touch = event.touches[0];
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;
		
		activePoint.x = x;
		activePoint.y = y;
		points = [...points];
	};

	const endPoint = () => {
		activePoint = null;
		showFeelings = true;
		scrollToFeelings();
	};

	const initFeelings = async () => {
		const records = await pb.collection('feelings').getFullList({
			sort: 'category,sort'
		});
		const data = serializeNonPOJOs(records);
		let res = groupBy(data, 'positive');
		res.map((entry) => {
			entry.content = groupBy(entry.content, 'category');
			entry.content.map((category) => (category.visible = false));
			return entry;
		});
		console.log('feelings res', res);
		feelings = res;
	};
	const toggleFeelingsCatgeory = (feeling, category: string) => {
		if (feeling.nameEN !== category) return;
		const target0 = feelings[0].content.find((entry) => entry.category === category);
		const target1 = feelings[1].content.find((entry) => entry.category === category);
		if (target0) target0.visible = !target0.visible;
		if (target1) target1.visible = !target1.visible;
		feelings = [...feelings];
	};
	const categoryIsVisible = (feeling, category) => {
		const feelingSlug = feeling.nameEN;
		const categorySlug = category.category;
		if (feelingSlug === categorySlug) return true;
		if (category.visible) return true;
		return false;
	};
	const selectFeeling = (feeling) => {
		if (selectedFeelings.includes(feeling.id)) {
			selectedFeelings = selectedFeelings.filter((id) => id !== feeling.id);
		} else {
			selectedFeelings.push(feeling.id);
		}
	};
	const scrollToFeelings = () => {
		if (!feelingsElement) return;
		setTimeout(() => {
			const offset = feelingsElement.getBoundingClientRect().top + window.scrollY + 200; // 100px offset from top
			console.log('offset',offset);
		window.scrollTo({
				top: offset,
				behavior: 'smooth'
			});
		}, 100);
	};

	function touchAction(node: HTMLElement) {
		const options = { passive: false };
		
		function handleTouchStart(e: TouchEvent) {
			e.preventDefault();
			drawPoint(e);
		}
		
		function handleTouchMove(e: TouchEvent) {
			e.preventDefault();
			updatePoint(e);
		}
		
		node.addEventListener('touchstart', handleTouchStart, options);
		node.addEventListener('touchmove', handleTouchMove, options);
		node.addEventListener('touchend', endPoint);
		node.addEventListener('touchcancel', endPoint);
		
		return {
			destroy() {
				node.removeEventListener('touchstart', handleTouchStart);
				node.removeEventListener('touchmove', handleTouchMove);
				node.removeEventListener('touchend', endPoint);
				node.removeEventListener('touchcancel', endPoint);
			}
		};
	}

	onMount(async () => {
		initFeelings();
	});
</script>

{JSON.stringify(selectedFeelings)}

<div class="flex justify-center">
	<div
		class="relative flex flex-col items-center justify-center gap-1 w-full"
	>
	<button aria-label="bodyscan map" use:touchAction class="relative touch-none">
			{#each points as point}
				<div
					class="absolute z-10 size-4 rounded-full bg-white"
					style="left: {point.x}px; top: {point.y}px;"
				></div>
			{/each}
			<img src="/learn/character.svg" alt="bodyscan" class="w-52" />
		</button>

		<div bind:this={feelingsElement}></div>
		{#if showFeelings}
				<ToggleGroup.Root
					id="feeling-selector"
					type="multiple"
					bind:value={feelings}
					class="flex flex-col gap-4"
				>
					{#if feelings.length > 0}
						<div class="">
							<div class="-mx-1 flex w-full flex-wrap justify-start transition-all">
								{#each feelings as positive}
									<!-- <div class="mb-1 mt-3 flex items-center gap-3 text-xs">
                {positive.category === 'true' ? 'Positiv' : 'Negativ'}
                <div class="mr-2 flex-grow border-b border-black border-opacity-20"></div>
              </div> -->
									{#each positive.content as category}
										{#each category.content as feeling}
											<button
												type="button"
												onclick={() => toggleFeelingsCatgeory(feeling, category.category)}
												class="{categoryIsVisible(feeling, category) ||
												selectedFeelings.includes(feeling.id)
													? 'pointer-events-auto max-w-[300px] p-0.5 opacity-100'
													: 'pointer-events-none m-0 max-w-0 opacity-0 text-[2px]'} h-7 block leading-none transition-all"
											>
												<ToggleGroup.Item
													value={feeling.id}
													onclick={() => selectFeeling(feeling)}
													class="{feeling.nameEN === category.category
														? `bg-white/40 hover:bg-white/30`
														: ''} h-auto max-w-[300px] rounded-full px-2 py-0.5 text-xs text-black hover:bg-white/30 hover:text-black data-[state=on]:bg-white"
												>
												{#if feeling.nameEN === category.category}
													<div class="size-1.5 rounded-full -ml-0.5 mr-1 {positive.category === 'true'
														? 'bg-green-400'
														: 'bg-red-400'}" ></div>
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
	</div>
</div>
