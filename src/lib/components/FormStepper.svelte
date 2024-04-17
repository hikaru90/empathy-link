<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/translations';
	import { ArrowRight } from 'radix-icons-svelte';

	const dispatch = createEventDispatcher();

	export let step: number;

	let className: string | undefined = undefined;
	export { className as class };
	export let primaryButtonClass: string | undefined = undefined;

	const toPrev = () => {
		console.log('toPrev');
		dispatch('toPrev');
	};
</script>

<div class="flex justify-between gap-1 pb-4 pt-8 {className}">
	{#if step > 1}
		<div class="group relative transform overflow-visible active:translate-y-1">
			<Button
				on:click={toPrev}
				class="skeumorphic-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-black dark:text-white"
			>
				{$t('default.page.fights.form.general.prev')}
			</Button>
			<div
				class="pointer-events-none absolute left-1/2 top-1 z-0 block h-full w-full -translate-x-1/2 transform rounded-md border border-black/10 bg-black/10 group-active:top-0"
			></div>
		</div>
	{/if}
	<div class="group relative flex-grow transform overflow-visible active:translate-y-1">
		<Button
			type="submit"
			class="skeumorphic-button group {primaryButtonClass} hover:{primaryButtonClass} relative z-10 m-[1px] flex w-[calc(100%-2px)] items-center justify-between py-6 font-bold text-black dark:text-white"
		>
			{$t('default.page.fights.form.general.next')}
			<ArrowRight class="h-3 w-3" />
		</Button>
		<div
			class="pointer-events-none absolute left-1/2 top-1 z-0 block h-full w-full -translate-x-1/2 transform rounded-md border border-black/10 bg-black/10 group-active:top-0"
		></div>
	</div>
</div>

<style lang="scss">
	// , -10px -10px 20px rgba(255,255,255,1)
	:global(.group .skeumorphic-button) {
		transition: box-shadow 50ms;
		box-shadow:
			-10px -10px 20px rgba(255, 255, 255, 0.3),
			10px 10px 8px rgba(0, 0, 0, 0.2);
	}
	:global(.group:active .skeumorphic-button) {
		box-shadow:
			0 0 0 rgba(255, 255, 255, 0.6),
			0 0 0 rgba(0, 0, 0, 0.2);
	}
</style>
