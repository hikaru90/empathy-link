<script lang="ts">
	import { getLearningContext } from '$lib/contexts/learningContext';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	interface Props {
		text?: string;
		disabled?: boolean;
		customAction?: () => void;
		isPreview?: boolean;
		showIcon?: boolean;
		class?: string;
	}

	let {
		text = 'Next',
		disabled = false,
		customAction,
		isPreview = false,
		showIcon = true,
		class: className = ''
	}: Props = $props();

	const learningContext = getLearningContext();

	const handleClick = () => {
		if (disabled || isPreview) return;

		if (customAction) {
			customAction();
		} else if (learningContext?.gotoNextPage) {
			learningContext.gotoNextPage();
		}
	};

	const canGoNext = $derived(() => {
		if (disabled || isPreview) return false;
		return customAction ? true : learningContext?.canGoNext;
	});
</script>

<div class="absolute bottom-24 w-full flex justify-end -mx-16 px-16">
	<button
		onclick={handleClick}
		{disabled}
		class="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-all duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-50 {className}"
		aria-label={text}
	>
		<span>{text}</span>
		{#if showIcon}
			<ChevronRight class="h-4 w-4" />
		{/if}
	</button>
</div>
