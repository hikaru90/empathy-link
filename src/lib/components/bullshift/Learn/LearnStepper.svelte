<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { t } from '$lib/translations';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';

	interface Props {
		step: number;
		color: string;
		class?: string | undefined;
		gotoPrevPage: () => void;
		gotoNextPage: () => void;
		absolute?: boolean;
	}

	let { gotoNextPage, gotoPrevPage, color, class: className = undefined, step, absolute = false }: Props = $props();

	const goForward = () => {
		scrollToTop()
		gotoNextPage();
	};

	const goBack = () => {
		scrollToTop()
		if (step === 0) window.history.back();
		else gotoPrevPage();
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};
</script>

<div
	style="background-color: {color};"
	class="flex justify-between {className} {absolute ? 'absolute' : 'fixed'} bottom-[84px] left-4 right-4 rounded-full p-2 shadow-xl"
>
	<button
		style="border: 2px solid {color}; box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3), -4px -4px 8px 0 rgba(255, 255, 255, 0.3);"
		onclick={goBack}
		class="flex size-8 flex-shrink-0 items-center justify-center gap-2 rounded-full border border-black/10"
	>
		<ChevronLeft class="size-4" />
	</button>
	<button
		style="border: 2px solid {color}; box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.3), -4px -4px 8px 0 rgba(255, 255, 255, 0.3);"
		onclick={() => goForward()}
		class="flex items-center gap-2 rounded-full px-4 text-sm"
	>
		{$t('default.page.fights.form.general.next')}
		<ArrowRight class="h-3 w-3" />
	</button>
</div>

<style lang="scss">
	// , -10px -10px 20px rgba(255,255,255,1)
	:global(.group .light-button) {
		transition:
			box-shadow 50ms,
			background-color 700ms;
		// box-shadow: 0 5px 5px rgba(255, 255, 255, 0.1);
	}
	:global(.group:active .light-button) {
		box-shadow:
			0 0 0 rgba(255, 255, 255, 0.6),
			0 0 0 rgba(0, 0, 0, 0.2);
	}
</style>
