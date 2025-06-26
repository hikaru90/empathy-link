<script lang="ts">
	import type { PageData } from './$types';
	import { replaceState } from '$app/navigation';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import LearnStepper from '$lib/components/bullshift/Learn/LearnStepper.svelte';
	import LearnTimer from '$lib/components/bullshift/Learn/LearnTimer.svelte';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnTitleCard from '$lib/components/bullshift/Learn/LearnTitleCard.svelte';
	import LearnHeading from '$lib/components/bullshift/Learn/LearnHeading.svelte';
	import LearnList from '$lib/components/bullshift/Learn/LearnList.svelte';
	import LearnText from '$lib/components/bullshift/Learn/LearnText.svelte';
	import LearnTask from '$lib/components/bullshift/Learn/LearnTask.svelte';
	import LearnBodyMap from '$lib/components/LearnBodyMap.svelte';
	import LearnCompletionNotes from '$lib/components/bullshift/Learn/LearnCompletionNotes.svelte';
	import LearnSortableWithFeedback from '$lib/components/bullshift/Learn/LearnSortableWithFeedback.svelte';
	import LearnMultipleChoice from '$lib/components/bullshift/Learn/LearnMultipleChoice.svelte';
	import LearningSummary from '$lib/components/bullshift/Learn/LearningSummary.svelte';
	import LearnCompletion from '$lib/components/bullshift/Learn/LearnCompletion.svelte';
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

	let currentPath: string;
	if (PUBLIC_INIT_POSTHOG === 'true') {
		featureFlags.set(data.featureFlags);
		postHog.init(data.posthogId, data.featureFlags);
	}
	if (browser) {
		window.ResizeObserver = ResizeObserver;
	}
	const updateQueryParams = () => {
		const url = new URL(window.location.href);
		url.searchParams.set('page', currentPage.toString());
		replaceState(url, {
			page: currentPage
		});
	};
	let currentCategory = $derived(() => {
		if (!data.categories || !data.record) return { color: '#000000' };
		const res = data.categories.find((c) => c.id === data.record?.expand?.currentVersion?.category);
		return res ? res : { color: '#000000' };
	});
	const topic = $derived(() => {
		if (!data.record?.expand?.currentVersion) return [];
		return data.record.expand.currentVersion;
	});
	const goBack = () => {
		window.history.back();
	};
	const gotoNextPage = () => {
		if (currentPage < topic().content.length + 1) {
			currentPage++;
		}
		updateQueryParams();
	};
	const gotoPrevPage = () => {
		if (currentPage > 0) {
			currentPage--;
		}
		updateQueryParams();
	};


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
						<Header absolute/>
						<div class="max-container py-10">
							<div class="mb-6 flex items-center justify-center">
								<LearnStepIndicator {topic} {currentPage} {currentCategory} />
							</div>
					
							{#if currentPage === 0}
								<LearnTitleCard currentCategory={currentCategory()} topic={topic()} />
							{/if}

							<!-- Show completion page if we're past the summary page -->
							{#if currentPage > topic().content.length}
								<LearnCompletion 
									topic={topic()}
									color={currentCategory().color}
									onReturnToOverview={() => {
										console.log('Preview completion - would return to overview');
									}}
								/>
							<!-- Show summary if we're at the summary page -->
							{:else if currentPage === topic().content.length}
								<LearningSummary 
									session={null}
									topic={topic()}
									color={currentCategory().color}
									onFeedbackSubmit={(feedback) => {
										console.log('Preview feedback:', feedback);
									}}
								/>
							{:else}
								<!-- Show regular content -->
								{#each topic().content as page, index}
									{#if currentPage === index}
										{#each page.content as content, blockIndex}
											{#if content.type === 'text'}
												<LearnText {content} />
											{:else if content.type === 'task'}
												<LearnTask color={currentCategory().color} {content} />
											{:else if content.type === 'heading'}
												<LearnHeading {content} />
											{:else if content.type === 'timer'}
												<LearnTimer duration={content.duration} color={currentCategory().color} />
											{:else if content.type === 'bodymap'}
												<LearnBodyMap 
													{content} 
													color={currentCategory().color}
													pageIndex={index}
													{blockIndex}
													session={null}
													contentBlock={content}
													topicVersionId={topic().id}
													onResponse={() => {}}
												/>
											{:else if content.type === 'taskCompletion'}
												<LearnCompletionNotes 
													{content} 
													color={currentCategory().color}
													pageIndex={index}
													{blockIndex}
													session={null}
													onResponse={() => {}}
												/>
											{:else if content.type === 'list'}
												<LearnList {content} currentCategory={currentCategory()} />
											{:else if content.type === 'sortable'}
												<LearnSortableWithFeedback 
													{content} 
													currentCategory={currentCategory()}
													color={currentCategory().color}
													onResponse={() => {}}
												/>
											{:else if content.type === 'multipleChoice'}
												<LearnMultipleChoice 
													{content} 
													color={currentCategory().color}
													pageIndex={index}
													{blockIndex}
													session={null}
													contentBlock={content}
													topicVersionId={topic().id}
													onResponse={() => {}}
												/>
											{/if}
										{/each}
									{/if}
								{/each}
							{/if}
						</div>
					</div>
					<LearnStepper absolute
						{gotoNextPage}
						{gotoPrevPage}
						color={currentCategory().color}
						step={currentPage}
						totalSteps={topic().content.length + 2}
					/>
					<Footer absolute />
					</div>
				{/if}
			</main>
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={50} class="relative">
			<LearnEditor {currentPage} topicId={data.topicId} />
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
