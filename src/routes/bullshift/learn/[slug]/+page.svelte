<script lang="ts">
	import type { PageData } from './$types';
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/bullshift/Header.svelte';
	import Footer from '$lib/components/bullshift/Footer.svelte';
	import LearnTimer from '$lib/components/bullshift/Learn/LearnTimer.svelte';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnTitleCard from '$lib/components/bullshift/Learn/LearnTitleCard.svelte';
	import LearnHeading from '$lib/components/bullshift/Learn/LearnHeading.svelte';
	import LearnList from '$lib/components/bullshift/Learn/LearnList.svelte';
	import LearnText from '$lib/components/bullshift/Learn/LearnText.svelte';
	import LearnTask from '$lib/components/bullshift/Learn/LearnTask.svelte';
	import LearnCompletionNotes from '$lib/components/bullshift/Learn/LearnCompletionNotes.svelte';
	import LearnBodyMap from '$lib/components/LearnBodyMap.svelte';
	import LearnSortableWithFeedback from '$lib/components/bullshift/Learn/LearnSortableWithFeedback.svelte';
	import LearnMultipleChoice from '$lib/components/bullshift/Learn/LearnMultipleChoice.svelte';
	import LearnAIQuestion from '$lib/components/bullshift/Learn/LearnAIQuestion.svelte';
	import LearnAIQuestionStep from '$lib/components/bullshift/Learn/LearnAIQuestionStep.svelte';
	import LearnAIResponseStep from '$lib/components/bullshift/Learn/LearnAIResponseStep.svelte';
	import LearningSummary from '$lib/components/bullshift/Learn/LearningSummary.svelte';
	import LearnCompletion from '$lib/components/bullshift/Learn/LearnCompletion.svelte';
	import LearnNextPage from '$lib/components/bullshift/Learn/LearnNextPage.svelte';
	import LearnPageNavigation from '$lib/components/bullshift/Learn/LearnPageNavigation.svelte';
	import { learningSession } from '$lib/stores/learningSession';
	import { setLearningContext } from '$lib/contexts/learningContext';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import type { ComponentStepInfo, ComponentStepState } from '$lib/contexts/learningContext';
	import { pb } from '$scripts/pocketbase';
	import * as Dialog from '$lib/components/ui/dialog';
	import LearnImage from '$lib/components/bullshift/Learn/LearnImage.svelte';
	import LearnAudio from '$lib/components/bullshift/Learn/LearnAudio.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let currentPage = $state(data.currentPage || 0);
	let currentSession = $state<LearningSession | null>(null);
	let showNewSessionConfirm = $state(false);
	let completedSession = $state<LearningSession | null>(null);
	let sessionInitData = $state<{userId: string, mainTopicId: string, topicVersionId: string} | null>(null);
	let aiQuestionStep = $state<'question' | 'response' | undefined>(undefined);

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
		if (!data.record?.expand?.currentVersion) return { content: [], titleDE: '', id: '' };
		const version = data.record.expand.currentVersion;
		// Ensure content is always an array
		if (!version.content || !Array.isArray(version.content)) {
			return { ...version, content: [] };
		}
		return version;
	});

	// Get components directly - no more pages structure
	const components = $derived(() => topic().content || []);

	const goBack = () => {
		window.history.back();
	};

	const handleStartNewSession = async () => {
		if (!sessionInitData) return;
		
		try {
			console.log('🆕 User confirmed, creating new session...');
			const session = await learningSession.init(
				sessionInitData.userId,
				sessionInitData.mainTopicId,
				sessionInitData.topicVersionId
			);
			console.log('✅ New session created:', session.id);
			currentSession = session;
			
			// Reset to first page for new session
			currentPage = 0;
			updateQueryParams();
			
			// Close confirmation dialog
			showNewSessionConfirm = false;
			completedSession = null;
			sessionInitData = null;
		} catch (error) {
			console.error('❌ Error creating new session:', error);
		}
	};

	const handleContinueOldSession = () => {
		if (!completedSession) return;
		
		console.log('🔄 User chose to continue with completed session');
		currentSession = completedSession;
		
		// Go to summary page to show results
		currentPage = topic().content.length;
		updateQueryParams();
		
		// Close confirmation dialog
		showNewSessionConfirm = false;
		completedSession = null;
		sessionInitData = null;
	};
	const gotoNextPage = async () => {
		// Allow navigating to summary page
		if (currentPage <= components().length) { // Allow going to summary page
			currentPage++;
			
			if (currentSession && currentPage <= components().length) {
				// Only update current page in session if still within content pages
				await learningSession.updateCurrentPage(currentSession.id, currentPage);
				// Refresh session data to ensure components get latest responses
				try {
					const refreshedSession = await pb.collection('learnSessions').getOne(currentSession.id);
					currentSession = refreshedSession as unknown as LearningSession;
				} catch (error) {
					console.error('Failed to refresh session data:', error);
				}
			}
			if (currentPage === components().length + 1 && currentSession) {
				// Complete and mark session as completed when reaching the summary page
				console.log(`Completing learning session for topic: ${currentSession.topic}`);
				await learningSession.complete(currentSession.id);
				await learningSession.markAsCompleted(currentSession.id);
			}
		}
		updateQueryParams();
	};
	const gotoPrevPage = async () => {
		if (currentPage > 0) {
			currentPage--;
			if (currentSession && currentPage < components().length) {
				// Only update current page in session if moving within content pages
				await learningSession.updateCurrentPage(currentSession.id, currentPage);
				// Refresh session data to ensure components get latest responses
				try {
					const refreshedSession = await pb.collection('learnSessions').getOne(currentSession.id);
					currentSession = refreshedSession as unknown as LearningSession;
				} catch (error) {
					console.error('Failed to refresh session data:', error);
				}
			}
		}
		updateQueryParams();
	};

	// Component step management
	let componentSteps = $state<Map<string, ComponentStepInfo>>(new Map());
	let componentStepsVersion = $state(0); // Force reactivity trigger
	
	// Global step state management
	let componentStepStates = $state<Map<string, ComponentStepState>>(new Map());

	// Set up learning context with reactive state
	const learningContextState = $state({
		get currentPage() { return currentPage; },
		get totalPages() { return components().length + 2; }, // Title + Components + Summary
		get canGoNext() { return currentPage <= components().length; },
		get canGoPrev() { return currentPage > 0; },
		get aiQuestionStep() { return aiQuestionStep; },
		gotoNextPage: gotoNextPage,
		gotoPrevPage: gotoPrevPage,
		gotoPage: async (page: number) => {
			if (page >= 0 && page <= components().length + 1) {
				currentPage = page;
				updateQueryParams();
				// Refresh session data when navigating directly to a page
				if (currentSession && page > 0 && page <= components().length) {
					try {
						const refreshedSession = await pb.collection('learnSessions').getOne(currentSession.id);
						currentSession = refreshedSession as unknown as LearningSession;
					} catch (error) {
						console.error('Failed to refresh session data:', error);
					}
				}
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
		
		// Global step state management
		getComponentStepState: (pageIndex: number, blockIndex: number) => {
			const key = `${pageIndex}-${blockIndex}`;
			return componentStepStates.get(key) || null;
		},
		
		setComponentStepState: (pageIndex: number, blockIndex: number, stepState: ComponentStepState) => {
			const key = `${pageIndex}-${blockIndex}`;
			componentStepStates.set(key, stepState);
		},
		
		computeComponentStep: (pageIndex: number, blockIndex: number, componentType: string, session: any) => {
			// Global logic to determine which step a component should be on
			if (componentType === 'aiQuestion') {
				// Check if there's a completed response for this AI question
				if (session && session.responses) {
					const existingResponse = session.responses.find(
						r => r.pageIndex === pageIndex && r.blockIndex === blockIndex && r.blockType === 'aiQuestion'
					);
					
					if (existingResponse && existingResponse.response.userAnswer && existingResponse.response.aiResponse) {
						// User has completed the interaction, show response step
						return 2;
					}
				}
				// No completed response, show question step
				return 1;
			}
			
			// For other component types, default to step 1
			return 1;
		}
	});

	// Set the context
	setLearningContext(learningContextState);

	// Initialize learning session on mount
	onMount(async () => {
		console.log('🔍 Session initialization starting...');
		console.log('📊 Available data:', {
			hasUser: !!data.user,
			userId: data.user?.id,
			hasRecord: !!data.record,
			recordId: data.record?.id,
			hasCurrentVersion: !!data.record?.expand?.currentVersion,
			currentVersionId: data.record?.expand?.currentVersion?.id
		});
		
		// Uses server-provided user data (no client-side auth checks)
		if (data.user?.id && data.record?.id && data.record?.expand?.currentVersion?.id) {
			const userId = data.user.id;
			const mainTopicId = data.record.id; // This is the main topic ID stored in session.topic
			const topicVersionId = data.record.expand.currentVersion.id; // This is the version ID stored in session.topicVersion

			console.log('✅ All required data available, proceeding with session init');
			console.log('🆔 IDs:', { userId, mainTopicId, topicVersionId });

			try {
				// Check for existing incomplete session - use the MAIN topic ID, not the version ID
				console.log('🔍 Checking for existing sessions...');
				console.log('🔍 Filter query:', `user = "${userId}" && topic = "${mainTopicId}"`);
				
				const existingSessions = await pb.collection('learnSessions').getList(1, 1, {
					filter: `user = "${userId}" && topic = "${mainTopicId}"`,
					sort: '-created'
				});

				console.log('📋 Existing sessions found:', existingSessions.items.length);

				if (existingSessions.items.length > 0) {
					// Check if the latest session is not completed
					const latestSession = existingSessions.items[0] as unknown as LearningSession;
					console.log('📋 Latest session completed status:', latestSession.completed);
					
					if (!latestSession.completed) {
						// Resume existing incomplete session
						console.log('🔄 Resuming existing incomplete session');
						currentSession = latestSession;
						
						// Resume from saved page if available
						if (currentSession.currentPage !== currentPage) {
							console.log('📄 Resuming from saved page:', currentSession.currentPage);
							currentPage = currentSession.currentPage;
							updateQueryParams();
						}
					} else {
						// Latest session is completed, ask user if they want to start a new one
						console.log('🆕 Latest session is completed, asking user if they want to start anew...');
						completedSession = latestSession;
						sessionInitData = { userId, mainTopicId, topicVersionId };
						showNewSessionConfirm = true;
						console.log('📋 Dialog state set - showNewSessionConfirm:', showNewSessionConfirm);
					}
				} else {
					// Create new session
					console.log('🆕 Creating new session...');
					const session = await learningSession.init(
						userId,  // ← From server data
						mainTopicId, // ← Main topic ID (what gets stored in session.topic)
						topicVersionId // ← Version ID (what gets stored in session.topicVersion)
					);
					console.log('✅ New session created:', session.id);
					currentSession = session;
					
					// Resume from saved page if available
					if (session.currentPage !== currentPage) {
						console.log('📄 Setting page from new session:', session.currentPage);
						currentPage = session.currentPage;
						updateQueryParams();
					}
				}
			} catch (error) {
				console.error('❌ Error during session initialization:', error);
			}
		} else {
			console.log('❌ Missing required data for session initialization');
			console.log('Missing:', {
				user: !data.user?.id ? 'user ID' : null,
				record: !data.record?.id ? 'record ID' : null,
				currentVersion: !data.record?.expand?.currentVersion?.id ? 'current version ID' : null
			});
		}
	});
</script>

<div class="pb-32 pt-6 h-svh overflow-hidden">
	<Header class="z-20" user={data.user} />
	<div class="max-container py-10">
		<!-- Step indicator -->
		<LearnStepIndicator 
			{topic}
			{currentPage}
			currentCategory={currentCategory}
			{aiQuestionStep}
		/>

		<!-- Only show content if not waiting for user confirmation -->
		{#if !showNewSessionConfirm}
			{#if currentPage === 0}
				<LearnTitleCard currentCategory={currentCategory()} topic={topic()} />
			{/if}

			<!-- Show summary page (now the final page) -->
			{#if components().length > 0 && currentPage === components().length + 1}
				{#await currentSession ? pb.collection('learnSessions').getOne(currentSession.id).then(session => session as unknown as LearningSession) : Promise.resolve(null)}
					<div class="text-center p-8">
						<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
						<p class="mt-4 text-gray-600">Loading your results...</p>
					</div>
				{:then reloadedSession}
					<LearningSummary 
						session={reloadedSession}
						topic={topic()}
						color={currentCategory().color}
						onFeedbackSubmit={async (feedback) => {
							if (currentSession) {
								try {
									await learningSession.saveFeedback(currentSession.id, feedback);
									console.log('Feedback saved successfully');
									// You could show a toast notification here
								} catch (error) {
									console.error('Failed to save feedback:', error);
									// You could show an error notification here
								}
							}
						}}
					/>
				{:catch error}
					<div class="text-center p-8">
						<p class="text-red-600">Error loading results: {error.message}</p>
					</div>
				{/await}
			{:else if components().length > 0 && currentPage > 0 && currentPage <= components().length}
				<!-- Show single component per page -->
				{@const content = components()[currentPage - 1]}
				{@const pageIndex = currentPage}
				{@const blockIndex = 0}
				{#if content && content.type === 'text'}
					<LearnText {content} isPreview={false} />
				{:else if content && content.type === 'task'}
					<LearnTask 
						color={currentCategory().color} 
						{content} 
						isPreview={false}
					/>
				{:else if content && content.type === 'heading'}
					<LearnHeading {content} isPreview={false} />
				{:else if content && content.type === 'image'}
					<LearnImage {content} />
				{:else if content && content.type === 'audio'}
					<LearnAudio color={currentCategory().color} {content} isPreview={false} />
				{:else if content && content.type === 'timer'}
					<LearnTimer 
						duration={content.duration} 
						color={currentCategory().color}
						{pageIndex}
						{blockIndex}
						session={currentSession}
						onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'timer', response, topic().id, content)}
					/>
				{:else if content && content.type === 'bodymap'}
					<LearnBodyMap 
						{content} 
						color={currentCategory().color}
						{pageIndex}
						{blockIndex}
						session={currentSession}
						contentBlock={content}
						topicVersionId={topic().id}
						onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'bodymap', response, topic().id, content)}
					/>
				{:else if content && content.type === 'taskCompletion'}
					<LearnCompletionNotes 
						{content} 
						color={currentCategory().color}
						{pageIndex}
						{blockIndex}
						session={currentSession}
						onResponse={(response) => currentSession && learningSession.saveResponse(currentSession.id, pageIndex, blockIndex, 'taskCompletion', response, topic().id, content)}
					/>
				{:else if content && content.type === 'list'}
					<LearnList {content} currentCategory={currentCategory()} />
				{:else if content && content.type === 'sortable'}
					<LearnSortableWithFeedback 
						{content} 
						color={currentCategory().color}
						currentCategory={currentCategory()}
						{pageIndex}
						{blockIndex}
						session={currentSession}
						topicVersionId={topic().id}
						onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'sortable', response, topic().id, content)}
					/>
				{:else if content && content.type === 'multipleChoice'}
					<LearnMultipleChoice 
						{content} 
						color={currentCategory().color}
						{pageIndex}
						{blockIndex}
						session={currentSession}
						contentBlock={content}
						topicVersionId={topic().id}
						onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'multipleChoice', response, topic().id, content)}
					/>
				{:else if content && content.type === 'aiQuestion'}
					<LearnAIQuestion 
						{content} 
						color={currentCategory().color}
						pageIndex={pageIndex}
						{blockIndex}
						session={currentSession}
						contentBlock={content}
						topicVersionId={topic().id}
						onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'aiQuestion', response, topic().id, content)}
						isPreview={false}
					/>
				{:else if content && content.type === 'aiQuestionStep'}
					<LearnAIQuestionStep 
						{content} 
						color={currentCategory().color}
						pageIndex={pageIndex}
						{blockIndex}
						session={currentSession}
						contentBlock={content}
						topicVersionId={topic().id}
						onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'aiQuestionStep', response, topic().id, content)}
						isPreview={false}
					/>
				{:else if content && content.type === 'aiResponseStep'}
					<LearnAIResponseStep 
						{content} 
						color={currentCategory().color}
						pageIndex={pageIndex}
						{blockIndex}
						session={currentSession}
						contentBlock={content}
						topicVersionId={topic().id}
						onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'aiResponseStep', response, topic().id, content)}
						isPreview={false}
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
		{/if}
		
	</div>
	<Footer />
</div>

<!-- New Session Confirmation Dialog -->
<Dialog.Root bind:open={showNewSessionConfirm}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold text-gray-900">
				Modul neu starten?
			</Dialog.Title>
			<Dialog.Description class="text-gray-600">
				Möchtest du das Modul erneut durchlaufen oder deine bisherigen Ergebnisse ansehen?
			</Dialog.Description>
		</Dialog.Header>
		
		<Dialog.Footer class="flex gap-3 sm:justify-start">
			<button
			type="button"
			onclick={handleStartNewSession}
			class="flex-1 py-2 px-4 text-white rounded-lg hover:opacity-90 transition-colors"
			style="background-color: {currentCategory().color}"
			>
			Neu starten
		</button>
		<button
			type="button"
			onclick={handleContinueOldSession}
			class="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
		>
			Ergebnisse ansehen
		</button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
