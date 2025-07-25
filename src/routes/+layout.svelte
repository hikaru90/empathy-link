<script lang="ts">
	import { m, setLocale, getLocale } from '$lib/translations';
	import '$src/app.pcss';
	import SparklePill from '$lib/components/SparklePill.svelte';
	import { blur } from 'svelte/transition';
	// import { Toaster } from '$lib/components/ui/sonner';
	import AppMenu from '$lib/components/AppMenu.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { scroll, windowHeight, windowWidth, backgroundColor } from '$store/page';
	import { browser } from '$app/environment';
	import ResizeObserver from 'resize-observer-polyfill';
	import { onNavigate } from '$app/navigation';
	import { getScrollbarWidth } from '$scripts/helpers';
	import { page } from '$app/stores';
	import { postHog, featureFlags } from '$store/posthog';
	import  { PUBLIC_INIT_POSTHOG } from '$env/static/public';

	interface Props {
		data: any;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	let currentPath: string;
	if(PUBLIC_INIT_POSTHOG === 'true') {
		featureFlags.set(data.featureFlags);
		postHog.init(data.posthogId, data.featureFlags);
	}

	if (browser) {
		window.ResizeObserver = ResizeObserver;
	}

	let contentReady = $state(false);
	let lastKnownScrollPosition = 0;
	let ticking = false;

	const animationDuration = 400;

	const handleScroll = (value) => {
		scroll.set(value);
	};
	const handleResize = () => {
		const scrollbarWidth: number = getScrollbarWidth();
		windowWidth.set(window.innerWidth - scrollbarWidth);
		windowHeight.set(window.innerHeight);
	};

	// const unsubscribe = backgroundColor.subscribe((value) => {
	// 	if (browser) {
	// 		document.body.classList.remove('bg-white','bg-background','bg-background','bg-observation-background','bg-feelings-background','bg-needs-background','bg-request-background');
	// 		document.body.classList.add(value);
	// 	}
	// });

	const setLangAttribute = () => {
		if (browser) {
			const currentLocale = getLocale();
			document.documentElement.lang = currentLocale;
		}
	}

	$effect(() => {
		if (browser) {
			setLangAttribute();
		}
	});

	let currentLocale = getLocale();
	function switchLocale(locale: 'de' | 'en'
	) {
		setLocale(locale);
		currentLocale = locale;
	}

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

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
		setLangAttribute();

		if (browser) {
			const unsubscribePostHog = postHog.subscribe(({ initialized }) => {
				if (initialized) {
					// Subscribe to page store for SPA navigation
					const unsubscribePage = page.subscribe(($page) => {
						if (currentPath && currentPath !== $page.url.pathname) {
							// Function to run on page exit (SPA navigation)
							postHog.capture('$pageleave');
						}

						// Update the current path
						currentPath = $page.url.pathname;

						// Function to run on page load
						postHog.capture('$pageview');
					});

					// Handler for hard reloads or page exits
					const handleBeforeUnload = () => {
						postHog.capture('$pageleave');
					};
					window.addEventListener('beforeunload', handleBeforeUnload);

					return () => {
						// Cleanup
						unsubscribePage();
						window.removeEventListener('beforeunload', handleBeforeUnload);
					};
				}
			});

			return () => {
				// Unsubscribe from PostHog store when component is destroyed
				unsubscribePostHog();
			};
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('scroll', handleScroll);
			window?.removeEventListener('resize', handleResize);
		}
	});
</script>

{#key data.route}
	<main
		id="scrollContainer"
		in:blur={{ duration: animationDuration, delay: animationDuration }}
		out:blur={{ duration: animationDuration }}
		class="min-h-svh bg-background"
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
			<div class="min-h-svh overflow-hidden"
				in:blur={{ duration: animationDuration, delay: animationDuration }}
				out:blur={{ duration: animationDuration }}
			>
				{@render children?.()}
			</div>
			<!-- {#if data.user}
				<AppMenu />
			{/if} -->
		{/if}
	</main>
{/key}
<!-- <Toaster /> -->

<style lang="scss">
	@use '../assets/styles/style.scss' as *;
</style>

