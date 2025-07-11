<script lang="ts">
	import type { PageData } from './$types';
	import { replaceState } from '$app/navigation';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import LearnTimer from '$lib/components/bullshift/Learn/LearnTimer.svelte';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnTitleCard from '$lib/components/bullshift/Learn/LearnTitleCard.svelte';
	import LearnHeading from '$lib/components/bullshift/Learn/LearnHeading.svelte';
	import LearnList from '$lib/components/bullshift/Learn/LearnList.svelte';
	import LearnText from '$lib/components/bullshift/Learn/LearnText.svelte';
	import LearnTask from '$lib/components/bullshift/Learn/LearnTask.svelte';
	import LearnImage from '$lib/components/bullshift/Learn/LearnImage.svelte';
	import LearnAudio from '$lib/components/bullshift/Learn/LearnAudio.svelte';
	import LearnBodyMap from '$lib/components/LearnBodyMap.svelte';
	import LearnCompletionNotes from '$lib/components/bullshift/Learn/LearnCompletionNotes.svelte';
	import LearnSortableWithFeedback from '$lib/components/bullshift/Learn/LearnSortableWithFeedback.svelte';
	import LearnMultipleChoice from '$lib/components/bullshift/Learn/LearnMultipleChoice.svelte';
	import LearnAIQuestion from '$lib/components/bullshift/Learn/LearnAIQuestion.svelte';
	import LearnAIQuestionStep from '$lib/components/bullshift/Learn/LearnAIQuestionStep.svelte';
	import LearnAIResponseStep from '$lib/components/bullshift/Learn/LearnAIResponseStep.svelte';
	import LearningSummary from '$lib/components/bullshift/Learn/LearningSummary.svelte';
	import LearnCompletion from '$lib/components/bullshift/Learn/LearnCompletion.svelte';
	import LearnNextPage from '$lib/components/bullshift/Learn/LearnNextPage.svelte';
	import LearnPageNavigation from '$lib/components/bullshift/Learn/LearnPageNavigation.svelte';
	import LearnEditor from '$lib/components/LearnEditor.svelte';
	import { setLearningContext } from '$lib/contexts/learningContext';
	import type { ComponentStepInfo, ComponentStepState } from '$lib/contexts/learningContext';
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
	let selectedVersionData = $state(null);
	let aiQuestionStep = $state<'question' | 'response' | undefined>(undefined);

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
		return res ? { color: res.color || '#000000' } : { color: '#000000' };
	});
	const topic = $derived(() => {
		// Use selected version data from editor if available, otherwise fall back to server data
		if (selectedVersionData) {
			return selectedVersionData;
		}
		if (!data.record?.expand?.currentVersion) {
			return { content: [], titleDE: 'Loading...', titleEN: 'Loading...' };
		}
		return data.record.expand.currentVersion;
	});

	// Get components directly - no more pages structure
	const components = $derived(() => topic().content || []);
	const goBack = () => {
		window.history.back();
	};
	const gotoNextPage = () => {
		if (currentPage <= components().length) {
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

	// Component step management
	let componentSteps = $state<Map<string, ComponentStepInfo>>(new Map());
	let componentStepsVersion = $state(0); // Force reactivity trigger
	
	// Global step state management
	let componentStepStates = $state<Map<string, ComponentStepState>>(new Map());

	// Set up learning context for the edit page
	const learningContextState = $state({
		get currentPage() { return currentPage; },
		get totalPages() { return components().length + 2; }, // Title + Components + Summary
		get canGoNext() { return currentPage <= components().length; },
		get canGoPrev() { return currentPage > 0; },
		get aiQuestionStep() { return aiQuestionStep; },
		gotoNextPage: gotoNextPage,
		gotoPrevPage: gotoPrevPage,
		gotoPage: (page: number) => {
			if (page >= 0 && page <= components().length + 1) {
				currentPage = page;
				updateQueryParams();
			}
		},
		setAIQuestionStep: (step: 'question' | 'response' | undefined) => {
			aiQuestionStep = step;
		},
		registerComponentSteps: (info: ComponentStepInfo) => {
			const existing = componentSteps.get(info.componentId);
			const hasChanged = !existing || 
				existing.currentStep !== info.currentStep || 
				existing.totalSteps !== info.totalSteps;
			
			componentSteps.set(info.componentId, info);
			
			// Only trigger reactivity if something actually changed
			if (hasChanged) {
				componentStepsVersion++;
			}
		},
		unregisterComponentSteps: (componentId: string) => {
			componentSteps.delete(componentId);
			componentStepsVersion++; // Trigger reactivity
		},
		getComponentSteps: () => {
			// Access version to ensure reactivity
			componentStepsVersion;
			return Array.from(componentSteps.values());
		},
		
		// Global step state management (simplified for edit mode)
		getComponentStepState: (pageIndex: number, blockIndex: number) => {
			const key = `${pageIndex}-${blockIndex}`;
			return componentStepStates.get(key) || null;
		},
		
		setComponentStepState: (pageIndex: number, blockIndex: number, stepState: ComponentStepState) => {
			const key = `${pageIndex}-${blockIndex}`;
			componentStepStates.set(key, stepState);
		},
		
		// Helper function to update step state for a component
		updateComponentStepState: (pageIndex: number, blockIndex: number, componentType: string, currentStep: number, totalSteps: number) => {
			const stepState: ComponentStepState = {
				pageIndex,
				blockIndex,
				currentStep,
				totalSteps,
				componentType
			};
			const key = `${pageIndex}-${blockIndex}`;
			componentStepStates.set(key, stepState);
		},
		
		computeComponentStep: (pageIndex: number, blockIndex: number, componentType: string, session: any) => {
			// In edit mode, check if we have stored step state for this component
			const key = `${pageIndex}-${blockIndex}`;
			const storedState = componentStepStates.get(key);
			
			if (storedState) {
				return storedState.currentStep;
			}
			
			// Default to step 1 for new components
			return 1;
		}
	});

	// Set the context
	setLearningContext(learningContextState);


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
							<!-- Step indicator for edit preview -->
							<LearnStepIndicator 
								{topic}
								{currentPage}
								currentCategory={currentCategory}
								{aiQuestionStep}
							/>
					
							{#if currentPage === 0}
								<LearnTitleCard currentCategory={currentCategory()} topic={topic()} />
							{/if}


							<!-- Show summary if we're at the summary page (now the final page) -->
							{#if components().length > 0 && currentPage === components().length + 1}
								<LearningSummary 
									session={null}
									topic={topic()}
									color={currentCategory().color}
									onFeedbackSubmit={(feedback) => {
										console.log('Preview feedback:', feedback);
									}}
								/>
							{:else if components().length > 0 && currentPage > 0 && currentPage <= components().length}
								<!-- Show single component per page -->
								{@const content = components()[currentPage - 1]}
								{@const index = currentPage}
								{@const blockIndex = 0}
								
								{#if content && content.type === 'text'}
									<LearnText {content} isPreview={true} />
								{:else if content && content.type === 'task'}
									<LearnTask color={currentCategory().color} {content} />
								{:else if content && content.type === 'heading'}
									<LearnHeading {content} />
								{:else if content && content.type === 'image'}
									<LearnImage {content} />
								{:else if content && content.type === 'audio'}
									<LearnAudio color={currentCategory().color} {content} />
								{:else if content && content.type === 'timer'}
									<LearnTimer duration={content.duration} color={currentCategory().color} />
								{:else if content && content.type === 'bodymap'}
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
								{:else if content && content.type === 'taskCompletion'}
									<LearnCompletionNotes 
										{content} 
										color={currentCategory().color}
										pageIndex={index}
										{blockIndex}
										session={null}
										onResponse={() => {}}
									/>
								{:else if content && content.type === 'list'}
									<LearnList {content} currentCategory={currentCategory()} />
								{:else if content && content.type === 'sortable'}
									<LearnSortableWithFeedback 
										{content} 
										currentCategory={currentCategory()}
										color={currentCategory().color}
										onResponse={() => {}}
									/>
								{:else if content && content.type === 'multipleChoice'}
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
								{:else if content && content.type === 'aiQuestion'}
									<LearnAIQuestion 
										{content} 
										color={currentCategory().color}
										pageIndex={index}
										{blockIndex}
										session={null}
										contentBlock={content}
										topicVersionId={topic().id}
										onResponse={() => {}}
										isPreview={true}
									/>
								{:else if content && content.type === 'aiQuestionStep'}
									<LearnAIQuestionStep 
										{content} 
										color={currentCategory().color}
										pageIndex={index}
										{blockIndex}
										session={null}
										contentBlock={content}
										topicVersionId={topic().id}
										onResponse={() => {}}
										isPreview={true}
									/>
								{:else if content && content.type === 'aiResponseStep'}
									<LearnAIResponseStep 
										{content} 
										color={currentCategory().color}
										pageIndex={index}
										{blockIndex}
										session={null}
										contentBlock={content}
										topicVersionId={topic().id}
										onResponse={() => {}}
										isPreview={true}
									/>
								{:else if content && content.type === 'nextPage'}
									<LearnNextPage {content} isPreview={false} />
								{:else if content && content.type === 'pageNavigation'}
									<LearnPageNavigation {content} isPreview={false} />
								{:else}
									<div class="p-4 bg-gray-100 rounded-lg">
										<p class="text-gray-600">Unknown content type: {content?.type || 'undefined'}</p>
									</div>
								{/if}
							{/if}
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
