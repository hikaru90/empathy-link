<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		variant?: 'floating' | 'inline' | 'minimal';
		showNext?: boolean;
		showPrev?: boolean;
		nextText?: string;
		prevText?: string;
		onNextStep?: () => void;
		onPrevStep?: () => void;
	}

	let { 
		variant = 'inline',
		showNext = true,
		showPrev = false,
		nextText = 'Next',
		prevText = 'Previous',
		onNextStep,
		onPrevStep
	}: Props = $props();

	const handleNext = () => {
		if (onNextStep) {
			onNextStep();
		}
	};

	const handlePrev = () => {
		if (onPrevStep) {
			onPrevStep();
		}
	};

	const canGoNext = $derived(() => {
		return onNextStep ? true : false;
	});

	const canGoPrev = $derived(() => {
		return onPrevStep ? true : false;
	});
</script>

{#if variant === 'floating'}
	<!-- Floating story-style navigation -->
	<div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-50">
		{#if showPrev && canGoPrev}
			<button 
				onclick={handlePrev}
				class="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all hover:scale-105 disabled:opacity-50"
				disabled={!canGoPrev}
				aria-label={prevText}
			>
				<ChevronLeft class="w-5 h-5 text-gray-700" />
			</button>
		{/if}

		{#if showNext && canGoNext}
			<button 
				onclick={handleNext}
				class="flex items-center justify-center px-6 h-12 rounded-full bg-blue-500 text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:bg-gray-400"
				disabled={!canGoNext}
			>
				<span class="mr-2">{nextText}</span>
				<ChevronRight class="w-4 h-4" />
			</button>
		{/if}
	</div>
{:else if variant === 'minimal'}
	<!-- Minimal inline navigation -->
	<div class="flex justify-end items-center mt-6">
		{#if showNext && canGoNext}
			<button 
				onclick={handleNext}
				class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-400"
				disabled={!canGoNext}
			>
				{nextText}
				<ChevronRight class="w-4 h-4" />
			</button>
		{/if}
	</div>
{:else}
	<!-- Default navigation -->
	<div class="flex justify-between items-center mt-6">
		{#if showPrev && canGoPrev}
			<button 
				onclick={handlePrev}
				class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300 disabled:opacity-50"
				disabled={!canGoPrev}
			>
				<ChevronLeft class="w-4 h-4" />
				{prevText}
			</button>
		{:else}
			<div></div>
		{/if}

		{#if showNext && canGoNext}
			<button 
				onclick={handleNext}
				class="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:bg-gray-400"
				disabled={!canGoNext}
			>
				{nextText}
				<ChevronRight class="w-4 h-4" />
			</button>
		{/if}
	</div>
{/if}