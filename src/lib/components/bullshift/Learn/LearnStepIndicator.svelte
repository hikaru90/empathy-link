<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	interface Props {
    totalSteps: {
      component: string;
      stepCount: number;
    }[];
    totalStepsCount: number;
		topic: any;
		currentStep: number;
		currentCategory: any;
		aiQuestionStep?: 'question' | 'response'; // Optional prop to track AI question sub-step
		onPrevStep?: () => void;
		onNextStep?: () => void;
	}

	let { totalSteps, totalStepsCount, topic, currentStep, currentCategory, aiQuestionStep, onPrevStep, onNextStep }: Props = $props();

</script>

currentStep: {currentStep}
totalStepsCount: {totalStepsCount}
<div class="mb-4 flex items-center justify-center">
	<div
		class="flex items-center justify-center gap-1 rounded-full bg-neutral-500/5 p-1 shadow-inner"
	>
		{#each Array.from({ length: totalStepsCount }, (_, index) => index) as stepIndex}
			<div
				style="background-color: {currentStep >= stepIndex
					? currentCategory()?.color || '#666'
					: 'rgba(255,255,255,0.8)'}"
				class="h-2 w-4 rounded-full {stepIndex >= totalStepsCount ? 'opacity-80' : ''}"
			></div>
		{/each}
	</div>
</div>

{#if currentStep > 0}
	<button
							onclick={() => onPrevStep?.()}
		class="absolute z-30 left-14 top-8 transform -translate-y-1/2 size-8 rounded-full flex items-center justify-center"
	>
		<ChevronLeft class="size-5" />
	</button>
{/if}