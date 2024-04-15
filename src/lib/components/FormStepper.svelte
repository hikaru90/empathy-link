<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { createEventDispatcher } from 'svelte';
	import { t } from '$lib/translations';
  import { ArrowRight } from 'radix-icons-svelte';

	const dispatch = createEventDispatcher();

	export let step: number;

	let className: string | undefined = undefined;
	export { className as class };
  export let primaryButtonClass:string | undefined = undefined;

	const toPrev = () => {
    console.log('toPrev');
		dispatch('toPrev');
	};
</script>

<div class="flex justify-between py-2 {className}">
	<div>
		{#if step > 1}
			<Button on:click={toPrev} variant="ghost" class="py-6 hover:bg-transparent">
				{$t('default.page.fights.form.general.prev')}
			</Button>
		{/if}
	</div>
	<Button type="submit" class="py-6 flex-grow flex items-center justify-between bg-white/10 hover:bg-white/20 text-black dark:text-white font-bold">
		{$t('default.page.fights.form.general.next')}
    <ArrowRight />
	</Button>
</div>
