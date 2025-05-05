<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/translations';
	import { ArrowRight, CaretLeft } from 'radix-icons-svelte';

	const dispatch = createEventDispatcher();

	export let step: number;
	export let checkForJudgement: boolean;

	let className: string | undefined = undefined;
	export { className as class };

	const toPrev = () => {
		console.log('toPrev');
		dispatch('toPrev');
	};

	const handleJudgementCheck = () => {
		dispatch('validateObservation');
		// dispatch('disableJudgementCheck')
	};
</script>

<div class="flex justify-between {className}">
	<div
		class="{step > 1
			? 'max-w-60 opacity-100'
			: 'max-w-0 opacity-0'} group relative transform overflow-visible"
	>
		<Button
			on:click={toPrev}
			decoration="dark-op1"
			class="flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
		>
			<CaretLeft class="h-4 w-4 rounded-full" />
		</Button>
	</div>
	{#if checkForJudgement}
		<Button
			on:click={handleJudgementCheck}
			decoration="dark-op1"
			wrapperClass="w-full"
			class="flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
		>
			<!-- <Button
			type="submit"
			class="light-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-foreground dark:border-x dark:border-t dark:border-white/5"
		> -->
			{$t('default.page.fights.form.general.checkJudgement')}
			<ArrowRight class="h-3 w-3" />
		</Button>
	{:else}
		<Button
			type="submit"
			decoration="dark-op1"
			wrapperClass="w-full"
			class="flex w-full items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
		>
			<!-- <Button
			type="submit"
			class="light-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-foreground dark:border-x dark:border-t dark:border-white/5"
		> -->
			{#if step === 1}
				{$t('default.page.fights.form.general.yes')}
			{:else if step === 2}
				{$t('default.page.fights.form.general.knowledge')}
			{:else}
				{$t('default.page.fights.form.general.next')}
			{/if}
			<ArrowRight class="h-3 w-3" />
		</Button>
	{/if}
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
