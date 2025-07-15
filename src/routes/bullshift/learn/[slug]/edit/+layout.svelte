<script lang="ts">
	import { m } from '$lib/translations';
	import '$src/app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import AppMenu from '$lib/components/AppMenu.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { scroll, windowHeight, windowWidth, backgroundColor } from '$store/page';
	import { browser } from '$app/environment';
	import ResizeObserver from 'resize-observer-polyfill';
	import { onNavigate } from '$app/navigation';
	import { getScrollbarWidth } from '$scripts/helpers';
	import { page } from '$app/stores';
	import { postHog, featureFlags } from '$store/posthog';
	import { PUBLIC_INIT_POSTHOG } from '$env/static/public';
	import { getLocale } from '$src/paraglide/runtime';
	const locale = $derived(getLocale());
  

	interface Props {
		data: any;
		children: any;
	}

	let { data, children }: Props = $props();

	let currentPath: string;
	if (PUBLIC_INIT_POSTHOG === 'true') {
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

	const handleScroll = (value: number) => {
		scroll.set(value);
	};
	const handleResize = () => {
		const scrollbarWidth: number = getScrollbarWidth();
		windowWidth.set(window.innerWidth - scrollbarWidth);
		windowHeight.set(window.innerHeight);
	};
	const setLangAttribute = () => {
		if (browser) {
			document.documentElement.lang = locale;
		}
	};
	$effect(() => {
		if (browser) {
			setLangAttribute();
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
	const scrollHandler = (event: Event) => {
		lastKnownScrollPosition = window.scrollY;

		if (!ticking) {
			window.requestAnimationFrame(() => {
				handleScroll(lastKnownScrollPosition);
				ticking = false;
			});

			ticking = true;
		}
	};

	onMount(() => {
		handleResize();
		contentReady = true;
		if (browser) {
			document.addEventListener('scroll', scrollHandler);
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
			document.removeEventListener('scroll', scrollHandler);
			window?.removeEventListener('resize', handleResize);
		}
	});
</script>

{#key data.route}
	{@render children()}
{/key}


<style lang="scss">
	@use '../../../../../assets/styles/style.scss' as *;
</style>
