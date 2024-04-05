<script>
	import { ChevronRight } from 'radix-icons-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import Menu from '$lib/components/Menu.svelte';
	import HeroBig from '$lib/components/HeroBig.svelte';
	import Locale from '$lib/components/Locale.svelte';
	import { _ } from 'svelte-i18n';
</script>

<div class="flex h-full flex-col justify-between">
	<div class="flex-grow">
		<Menu />

		<div class="max-container">
			<HeroBig />
			<Button variant="outline" size="icon">
				<ChevronRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
	<div class="flex flex-col mx-4 my-4 gap-2 w-[36px]">
		<Locale />
    <Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</div>

<style lang="scss">
	@import '../assets/styles/style.scss';
</style>
