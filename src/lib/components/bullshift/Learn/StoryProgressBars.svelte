<script lang="ts">
	interface Props {
		totalSteps: number;
		currentStep: number;
		color?: string;
		showNumbers?: boolean;
	}

	let { totalSteps, currentStep, color = '#3B82F6', showNumbers = false }: Props = $props();

	const progressBars = $derived(() => {
		const safeTotalSteps = Math.max(totalSteps || 0, 1);
		const safeCurrentStep = Math.max(currentStep || 0, 0);
		
		return Array.from({ length: safeTotalSteps }, (_, index) => {
			const stepIndex = index;
			const isCompleted = stepIndex < safeCurrentStep;
			const isCurrent = stepIndex === safeCurrentStep;
			
			return {
				index: stepIndex,
				isCompleted,
				isCurrent,
				progress: isCompleted ? 100 : (isCurrent ? 0 : 0)
			};
		});
	});
</script>

<div class="fixed top-4 left-4 right-4 z-50">
	<div class="flex gap-2 items-center">
		{#each progressBars as bar (bar.index)}
			<div class="flex-1 relative">
				<!-- Background bar -->
				<div class="h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
					<!-- Progress fill -->
					<div 
						class="h-full rounded-full transition-all duration-500 ease-out"
						style="background-color: {color}; width: {bar.isCompleted ? 100 : (bar.isCurrent ? 100 : 0)}%"
					></div>
				</div>
				
				{#if showNumbers}
					<div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
						<span class="text-xs text-white/70 font-medium">
							{bar.index + 1}
						</span>
					</div>
				{/if}
			</div>
		{/each}
		
		<!-- Current step indicator -->
		{#if !showNumbers}
			<div class="ml-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
				<span class="text-sm font-medium text-white">
					{currentStep + 1} / {totalSteps}
				</span>
			</div>
		{/if}
	</div>
</div>