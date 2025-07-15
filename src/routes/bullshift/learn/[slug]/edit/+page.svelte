<script lang="ts">
	import type { PageData } from './$types';
	import { replaceState } from '$app/navigation';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import LearnContentRenderer from '$lib/components/bullshift/Learn/LearnContentRenderer.svelte';
	import LearnEditor from '$lib/components/LearnEditor.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import { blur } from 'svelte/transition';
	import SparklePill from '$lib/components/SparklePill.svelte';
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
		data: PageData;
	}

	let { data }: Props = $props();

	let currentPage = $state(data.currentPage || 0);
	let selectedVersionData = $state<any>(null);

	// Handle page changes from the content renderer
	const handlePageChange = (page: number) => {
		currentPage = page;
		const url = new URL(window.location.href);
		url.searchParams.set('page', currentPage.toString());
		replaceState(url, {
			page: currentPage
		});
	};

	let currentPath: string;
	if (PUBLIC_INIT_POSTHOG === 'true') {
		// Edit page doesn't have featureFlags/posthogId in PageData, so skip PostHog init
		if (browser && 'featureFlags' in data && 'posthogId' in data) {
			featureFlags.set((data as any).featureFlags || {});
			postHog.init((data as any).posthogId || '', (data as any).featureFlags || {});
		}
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
	// Global keydown handler to prevent backspace from causing issues
	const globalKeyDownHandler = (event: KeyboardEvent) => {
		const target = event.target as HTMLElement;
		
		// If the event is from a text input or textarea, don't interfere
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
			// For text inputs, stop propagation to prevent any parent handlers from firing
			event.stopPropagation();
			return;
		}
		
		// For other elements, prevent backspace from triggering browser navigation
		if (event.key === 'Backspace') {
			event.preventDefault();
			event.stopPropagation();
		}
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
			// Add global keydown handler to prevent backspace issues
			document.addEventListener('keydown', globalKeyDownHandler);
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
			window?.removeEventListener('resize', handleResize);
			// Clean up the global keydown handler
			document.removeEventListener('keydown', globalKeyDownHandler);
		}
	});

</script>


<div class="h-svh">
	<Resizable.PaneGroup
		direction="horizontal"
		class="w-full rounded-lg"
	>
		<Resizable.Pane defaultSize={50}>
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
					<div
						class="h-svh relative"
						in:blur={{ duration: animationDuration, delay: animationDuration }}
						out:blur={{ duration: animationDuration }}
					>
					<div class="pb-32 pt-6 relative h-svh overflow-y-auto scrollableArea">
						<Header absolute user={data.user} />
						<div class="max-container py-10">
							<!-- Use centralized content renderer -->
							<LearnContentRenderer 
								record={data.record}
								categories={data.categories || []}
								initialPage={currentPage}
								isPreview={true}
								{selectedVersionData}
								onPageChange={handlePageChange}
							/>
						</div>
					</div>
					<Footer absolute />
					</div>
				{/if}
			</main>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={50} class="relative">
			<LearnEditor 
				{currentPage} 
				topicId={data.topicId || ''} 
				onVersionDataChange={(versionData) => selectedVersionData = versionData}
			/>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>



<style>
  .scrollableArea {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollableArea::-webkit-scrollbar {
    display: none;
  }
</style>