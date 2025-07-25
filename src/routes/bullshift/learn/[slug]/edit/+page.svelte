<script lang="ts">
	import type { PageData } from './$types';
	import { replaceState } from '$app/navigation';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import LearnContentRenderer from '$lib/components/bullshift/Learn/LearnContentRenderer.svelte';
	import LearnEditor from '$lib/components/LearnEditor.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
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

	let currentStep = $state(data.currentStep || 0);
	let selectedVersionData = $state<any>(null);
	
	// Create mock session for preview mode - exists only in memory
	let mockSession = $state<LearningSession>({
		id: 'preview-session',
		user: data.user?.id || 'preview-user',
		topic: data.topicId || 'preview-topic',
		topicVersion: 'preview-version',
		currentPage: currentStep,
		responses: [],
		created: new Date().toISOString(),
		updated: new Date().toISOString(),
		completed: false
	});

	// Function to calculate step number for a given block index
	const calculateStepForBlockIndex = (blockIndex: number, content: any[] = []) => {
		if (!content || content.length === 0) return 1; // Default to step 1 if no content
		
		let step = 1; // Start at step 1 (after title step 0)
		
		for (let i = 0; i < blockIndex && i < content.length; i++) {
			const component = content[i];
			if (component.type === 'aiQuestion') {
				step += 2; // aiQuestion takes 2 steps
			} else if (component.type === 'feelingsDetective') {
				step += 5; // feelingsDetective takes 5 steps
			} else if (component.type === 'needsDetective') {
				step += 4; // needsDetective takes 4 steps (combined situation+thoughts, reflection, needs, summary)
			} else if (component.type === 'needsRubiksCube') {
				step += 2; // needsRubiksCube takes 2 steps
			} else {
				step += 1; // All other components take 1 step
			}
		}
		
		return step;
	};

	// Handle step changes from the content renderer
	const handleStepChange = (step: number) => {
		currentStep = step;
		// Update mock session page as well
		mockSession.currentPage = step;
		
		// Only update URL if we're in the browser and router is ready
		if (browser && typeof window !== 'undefined') {
			try {
				const url = new URL(window.location.href);
				url.searchParams.set('step', currentStep.toString());
				replaceState(url, {
					step: currentStep
				});
			} catch (error) {
				// Router not ready yet, just update the step without URL change
				console.log('Router not ready, skipping URL update');
			}
		}
	};

	// Handle block clicks from the editor - calculate correct step
	const handleBlockClick = (blockIndex: number) => {
		// Get current content from selectedVersionData or fallback to record data
		const content = selectedVersionData?.content || data.record?.expand?.currentVersion?.content || [];
		const step = calculateStepForBlockIndex(blockIndex, content);
		handleStepChange(step);
	};

	// Handle session changes from the content renderer (for preview mode)
	const handleSessionChange = (session: LearningSession | null) => {
		if (session) {
			// Update our mock session with new responses
			mockSession = { ...session };
		}
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
		
		// If the event is from a text input or textarea, only handle specific keys
		if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
			// Only stop propagation for backspace to prevent browser navigation
			// Allow other keys like Ctrl+S to bubble up to save handlers
			if (event.key === 'Backspace') {
				event.stopPropagation();
			}
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
					<div class="pb-[82px] pt-6 h-svh overflow-hidden">
						<Header absolute user={data.user} />
						<div class="max-container py-10 w-full h-full">
							<!-- Use centralized content renderer -->
							<LearnContentRenderer 
								record={data.record}
								categories={data.categories || []}
								user={data.user}
								initialStep={currentStep}
								isPreview={true}
								{selectedVersionData}
								session={mockSession}
								onStepChange={handleStepChange}
								onSessionChange={handleSessionChange}
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
				{currentStep} 
				topicId={data.topicId || ''} 
				onVersionDataChange={(versionData) => selectedVersionData = versionData}
				onBlockClick={handleBlockClick}
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