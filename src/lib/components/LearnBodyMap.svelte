<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	interface Props {
		content: object;
		color: string;
	}

	let { content, color }: Props = $props();

	let points = $state<{ x: number; y: number }[]>([]);
	let feelings = $state<any[]>([]);
	let selectedFeelings = $state<any[]>([]);

	const handleClick = (event: MouseEvent) => {
    console.log('event.target',event.currentTarget);
		// Check if clicked element or any of its parents has id "feeling-selector"
		let element = event.target as HTMLElement;
		while (element) {
			if (element.id === 'feeling-selector') {
				return;
			}
			element = element.parentElement as HTMLElement;
		}
    console.log('element',element);
		// if (event.target !== event.currentTarget) return;
		const button = event.currentTarget as HTMLElement;
		const rect = button.getBoundingClientRect();
		// Calculate position relative to the button
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		points.push({ x, y });
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

	onMount(async () => {
		initFeelings();
	});
</script>

{JSON.stringify(selectedFeelings)}

<div class="flex justify-center">
	<button
		aria-label="bodyscan map"
		onclick={(e) => handleClick(e)}
		class="relative flex flex-col items-center justify-center gap-1"
	>
		{#each points as point}
			<div
				class="absolute z-10 size-4 rounded-full bg-white"
				style="left: {point.x}px; top: {point.y}px;"
			>
    <div class="relative">
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-72 bg-offwhite px-3 py-2 rounded-lg">

      <ToggleGroup.Root id="feeling-selector" type="multiple" bind:value={feelings} class="flex flex-col gap-4">
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
                        ? 'pointer-events-auto max-w-[300px] p-0.5 opacity-100 h-auto'
                        : 'pointer-events-none m-0 max-w-0 p-0 opacity-0 h-0'} block leading-none transition-all"
                    >
                      <ToggleGroup.Item
                        value={feeling.id}
                        onclick={() => selectFeeling(feeling)}
                        class="{feeling.nameEN === category.category
                          ? `bg-white/40 font-bold hover:bg-white/30`
                          : ''} border {positive.category === 'true' ? 'border-green-400' : 'border-red-400'} h-auto max-w-[300px] rounded-full px-2 py-0.5 text-black shadow hover:bg-white/30 hover:text-black data-[state=on]:bg-white text-xs"
                      >
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
    </div>
    </div>
  </div>
		{/each}
		<div style="background-color: {color}" class="size-20 rounded-full"></div>
		<div style="background-color: {color}" class="relative h-20 w-24 rounded-xl">
			<div
				style="background-color: {color}"
				class="absolute -left-1 top-0 h-24 w-8 -translate-x-full transform rounded-b-[40px] rounded-tl-[60px] rounded-tr-xl"
			></div>
			<div
				style="background-color: {color}"
				class="absolute -right-1 top-0 h-24 w-8 translate-x-full transform rounded-b-[40px] rounded-tl-xl rounded-tr-[60px]"
			></div>
		</div>
		<div class="relative h-auto w-24 rounded-xl">
			<div style="background-color: {color}" class="h-6 w-full rounded-t-xl"></div>
			<div class="flex justify-between">
				<div style="background-color: {color}" class="h-20 w-10 rounded-b-full"></div>
				<div style="background-color: {color}" class="h-20 w-10 rounded-b-full"></div>
			</div>
		</div>
	</button>
</div>
