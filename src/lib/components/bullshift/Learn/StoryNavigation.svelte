<script lang="ts">
	import { getLearningContext } from '$lib/contexts/learningContext';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		showNext?: boolean;
		showPrev?: boolean;
		nextText?: string;
		prevText?: string;
		nextDisabled?: boolean;
		prevDisabled?: boolean;
		autoAdvanceAfter?: number;
		customNextAction?: () => void;
		customPrevAction?: () => void;
		isPreview?: boolean;
		variant?: 'default' | 'minimal' | 'floating';
	}

	let { 
		showNext = true, 
		showPrev = true, 
		nextText = 'Next', 
		prevText = 'Previous',
		nextDisabled = false,
		prevDisabled = false,
		autoAdvanceAfter,
		customNextAction,
		customPrevAction,
		isPreview = false,
		variant = 'default'
	}: Props = $props();

	const learningContext = getLearningContext();

	$effect(() => {
		if (autoAdvanceAfter && learningContext?.autoAdvanceAfter && !isPreview) {
			learningContext.autoAdvanceAfter(autoAdvanceAfter);
		}
	});

	const handleNext = () => {
		if (customNextAction) {
			customNextAction();
		} else if (learningContext?.gotoNextPage) {
			learningContext.gotoNextPage();
		}
	};

	const handlePrev = () => {
		if (customPrevAction) {
			customPrevAction();
		} else if (learningContext?.gotoPrevPage) {
			learningContext.gotoPrevPage();
		}
	};

	const canGoNext = $derived(() => {
		if (nextDisabled) return false;
		// In preview mode, disable next navigation to prevent leaving preview
		if (isPreview) return false;
		return customNextAction ? true : learningContext?.canGoNext;
	});

	const canGoPrev = $derived(() => {
		if (prevDisabled) return false;
		// In preview mode, allow back navigation
		return customPrevAction ? true : learningContext?.canGoPrev;
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