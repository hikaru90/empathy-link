<script lang="ts">
	import { t, initialized } from '$lib/translations';
	import '$src/app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { blur } from 'svelte/transition';
	import { Toaster } from '$lib/components/ui/sonner';
	import AppMenu from '$lib/components/AppMenu.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { scroll, windowHeight, windowWidth, backgroundColor } from '$store/page';
	import { browser } from '$app/environment';
	import 'simplebar';
	import 'simplebar/dist/simplebar.css';
	import ResizeObserver from 'resize-observer-polyfill';
	import { onNavigate } from '$app/navigation';
	import { getScrollbarWidth } from '$scripts/helpers';
	if (browser) {
		window.ResizeObserver = ResizeObserver;
	}

	export let data;
	let contentReady = false;
	let lastKnownScrollPosition = 0;
	let ticking = false;

	console.log('+layout.svelte - user:', data.user);

	const animationDuration = 400;

	const handleScroll = (value) => {
		scroll.set(value);
	};
	const handleResize = () => {
		const scrollbarWidth: number = getScrollbarWidth();
		windowWidth.set(window.innerWidth - scrollbarWidth);
		windowHeight.set(window.innerHeight);
	};

	onMount(() => {
		handleResize();
		contentReady = true;
		if (browser) {
			document.addEventListener('scroll', (event) => {
				lastKnownScrollPosition = window.scrollY;

				if (!ticking) {
					window.requestAnimationFrame(() => {
						handleScroll(lastKnownScrollPosition);
						ticking = false;
					});

					ticking = true;
				}
			});
			window?.addEventListener('resize', handleResize);
		}
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('scroll', handleScroll);
			window?.removeEventListener('resize', handleResize);
		}
	});
</script>

{#key data.url}
	<main
		id="scrollContainer"
		in:blur={{ duration: animationDuration, delay: animationDuration }}
		out:blur={{ duration: animationDuration }}
		class="{$backgroundColor} flex flex-grow flex-col overflow-x-hidden transition duration-500"
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
			<!-- {#if data.user}
				<AppMenu />
			{/if} -->
		{/if}
	</main>
{/key}
<Toaster />

<style lang="scss">
	@import '../assets/styles/style.scss';
</style>
