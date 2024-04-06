<script>
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon } from 'radix-icons-svelte';
	import { toggleMode } from 'mode-watcher';
	import Locale from '$lib/components/Locale.svelte';
	import { _ } from 'svelte-i18n';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { register, t, init, getLocaleFromNavigator, isLoading, locale } from 'svelte-i18n';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { blur } from 'svelte/transition';

	register('de', () => import('../locales/de.json'));
	register('en', () => import('../locales/en.json'));

	export let data;

	init({
		fallbackLocale: 'en'
	});

	locale.set('de');

	const animationDuration = 400;
</script>

{#key data.url}
	<main
		in:blur={{ duration: animationDuration, delay: animationDuration }}
		out:blur={{ duration: animationDuration }}
		class="flex flex-grow flex-col"
	>
		{#if $isLoading}
			<div
				in:blur={{ duration: animationDuration, delay: animationDuration }}
				out:blur={{ duration: animationDuration }}
				class="flex items-center justify-center py-60"
			>
				<SparklePill fast={true} class="h-6 w-16 shadow-xl dark:shadow-gray-200/30" />
			</div>
		{:else}
			<div
				in:blur={{ duration: animationDuration, delay: animationDuration }}
				out:blur={{ duration: animationDuration }}
			>
				<ModeWatcher />
				<slot />
			</div>
		{/if}
	</main>
	<div class="fixed bottom-0 left-0 flex flex-col mx-4 my-4 gap-2 w-[36px]">
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
{/key}

<style lang="scss">
	@import '../assets/styles/style.scss';
</style>
