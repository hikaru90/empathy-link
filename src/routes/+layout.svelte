<script>
	import { t, initialized } from '$lib/translations';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { blur } from 'svelte/transition';
	import { Toaster } from '$lib/components/ui/sonner';
	import AppMenu from '$lib/components/AppMenu.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { scroll } from '$store/page';
	import { browser } from '$app/environment';
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import ResizeObserver from 'resize-observer-polyfill';
	if(browser){
		window.ResizeObserver = ResizeObserver;
	}

	export let data;
	let contentReady = false;

	console.log('+layout.svelte - user:', data.user);

	const animationDuration = 400;

	const handleScroll = (event) => {
		scroll.set(event.target.scrollTop);
	};

	onMount(() => {
		contentReady = true;
		if (browser) {
			document.getElementById('scrollContainer')?.addEventListener('scroll', handleScroll);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.getElementById('scrollContainer')?.removeEventListener('scroll', handleScroll);
		}
	});
</script>

{#key data.url}
	<main
		id="scrollContainer"
		in:blur={{ duration: animationDuration, delay: animationDuration }}
		out:blur={{ duration: animationDuration }}
		class="flex flex-grow flex-col overflow-x-hidden bg-offwhite"
	>
		{#if !contentReady}
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
				class="flex flex-grow flex-col"
			>
				<ModeWatcher />
				<slot />
			</div>
			<AppMenu />
		{/if}
	</main>
{/key}
<Toaster />

<style lang="scss">
	@import '../assets/styles/style.scss';
</style>
