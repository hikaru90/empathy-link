<script lang="ts">
	import { cn } from '$lib/utils';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';

	
	interface Props {
    totalSteps: {
      component: string;
      stepCount: number;
    }[];
		class?: string;
    totalStepsCount: number;
		topic: any;
		currentStep: number;
		currentCategory: any;
		aiQuestionStep?: 'question' | 'response'; // Optional prop to track AI question sub-step
		onPrevStep?: () => void;
		onNextStep?: () => void;
	}

	let { class: className = undefined, totalSteps, totalStepsCount, topic, currentStep, currentCategory, aiQuestionStep, onPrevStep, onNextStep }: Props = $props();

</script>

<div class={cn('mb-4 flex items-center justify-center', className)}>
	<div
		class="flex items-center justify-center gap-0.5 rounded-full bg-neutral-500/5 p-1 shadow-inner w-3/4"
	>
		{#each Array.from({ length: totalStepsCount }, (_, index) => index) as stepIndex}
			<div
				style="background-color: {currentStep >= stepIndex
					? currentCategory()?.color || '#666'
					: 'rgba(255,255,255,0.8)'}"
				class="h-2 flex-grow rounded-md {stepIndex >= totalStepsCount ? 'opacity-80' : ''}"
			></div>
		{/each}
	</div>
</div>
