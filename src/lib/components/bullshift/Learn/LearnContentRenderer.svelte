<script lang="ts">
	import { onMount, getContext, setContext } from 'svelte';
	import { replaceState } from '$app/navigation';
	import LearnTimer from '$lib/components/bullshift/Learn/LearnTimer.svelte';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnTitleCard from '$lib/components/bullshift/Learn/LearnTitleCard.svelte';
	import LearnHeading from '$lib/components/bullshift/Learn/LearnHeading.svelte';
	import LearnList from '$lib/components/bullshift/Learn/LearnList.svelte';
	import LearnText from '$lib/components/bullshift/Learn/LearnText.svelte';
	import LearnTask from '$lib/components/bullshift/Learn/LearnTask.svelte';
	import LearnCompletionNotes from '$lib/components/bullshift/Learn/LearnCompletionNotes.svelte';
	import LearnBodyMap from '$lib/components/LearnBodyMap.svelte';
	import LearnSortable from '$lib/components/bullshift/Learn/LearnSortable.svelte';
	import LearnMultipleChoice from '$lib/components/bullshift/Learn/LearnMultipleChoice.svelte';
	import LearnAIQuestion from '$lib/components/bullshift/Learn/LearnAIQuestion.svelte';
	import LearnFeelingsDetective from '$lib/components/bullshift/Learn/LearnFeelingsDetective.svelte';
	import LearnNeedsDetective from '$lib/components/bullshift/Learn/LearnNeedsDetective.svelte';
	import LearnNeedsRubiksCube from '$lib/components/bullshift/Learn/LearnNeedsRubiksCube.svelte';
	import LearningSummary from '$lib/components/bullshift/Learn/LearningSummary.svelte';
	import LearnNextPage from '$lib/components/bullshift/Learn/LearnNextPage.svelte';
	import LearnPageNavigation from '$lib/components/bullshift/Learn/LearnPageNavigation.svelte';
	import LearnImage from '$lib/components/bullshift/Learn/LearnImage.svelte';
	import LearnAudio from '$lib/components/bullshift/Learn/LearnAudio.svelte';
	import LearnBreathe from '$lib/components/bullshift/Learn/LearnBreathe.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import { learningSession } from '$lib/stores/learningSession';
	import { pb } from '$scripts/pocketbase';
	import * as Dialog from '$lib/components/ui/dialog';
	import SparklePill from '$lib/components/SparklePill.svelte';

	// Learning Context Types (kept for compatibility but no longer used for context management)
	export interface LearningNavigationContext {
		gotoNextStep: () => void;
		gotoPrevStep: () => void;
		aiQuestionStep?: 'question' | 'response';
		setAIQuestionStep: (step: 'question' | 'response' | undefined) => void;
	}

	// Navigation helper functions (simplified since context management is removed)
	const gotoNextStep = async () => {
		// Simply move to next page
		if (currentStep < totalStepsCount()) {
			const newStep = currentStep + 1;
			currentStep = newStep;
		}

		updateQueryParams();

		// Save current step to session (with error handling for auto-cancellation)
		if (!isPreview && currentSession) {
			try {
				await learningSession.updateCurrentPage(currentSession.id, currentStep);
			} catch (error: any) {
				// Don't log auto-cancellation errors as they're expected during navigation
				if (!error?.message?.includes('autocancelled') && error?.name !== 'AbortError') {
					console.error('Error saving step to session:', error);
				}
			}
		}
	};

	const gotoPrevStep = async () => {
		// Simply move to previous page
		if (currentStep > 0) {
			const newStep = currentStep - 1;
			currentStep = newStep;
		}
		updateQueryParams();

		// Save current step to session (with error handling for auto-cancellation)
		if (!isPreview && currentSession) {
			try {
				await learningSession.updateCurrentPage(currentSession.id, currentStep);
			} catch (error: any) {
				// Don't log auto-cancellation errors as they're expected during navigation
				if (!error?.message?.includes('autocancelled') && error?.name !== 'AbortError') {
					console.error('Error saving step to session:', error);
				}
			}
		}
	};

	interface Props {
		// Data from server
		record: any;
		categories: any[];
		user?: any;

		// Step state
		initialStep?: number;

		// Mode flags
		isPreview: boolean;

		// Editor specific
		selectedVersionData?: any;
		session?: LearningSession | null; // For preview mode

		// Callbacks
		onStepChange?: (step: number) => void;
		onSessionChange?: (session: LearningSession | null) => void;
	}

	let {
		record,
		categories,
		user,
		initialStep = 0,
		isPreview,
		selectedVersionData,
		session,
		onStepChange,
		onSessionChange
	}: Props = $props();

	// Step state
	let currentStep = $state(initialStep);
	let aiQuestionStep = $state<'question' | 'response' | undefined>(undefined);

	// Session state (only for non-preview mode)
	let currentSession = $state<LearningSession | null>(null);
	let showNewSessionConfirm = $state(false);
	let completedSession = $state<LearningSession | null>(null);
	let sessionInitData = $state<{
		userId: string;
		mainTopicId: string;
		topicVersionId: string;
	} | null>(null);

	// Use provided session in preview mode, otherwise use currentSession
	const activeSession = $derived(() => {
		return isPreview ? session || null : currentSession;
	});

	// Derived values
	const currentCategory = $derived(() => {
		if (!record?.expand?.currentVersion?.expand?.category) {
			// Fallback to categories array if expanded category is not available
			if (!categories || !record) return { color: '#000000' };
			const res = categories.find((c) => c.id === record?.expand?.currentVersion?.category);
			return res ? { color: res.color || '#000000' } : { color: '#000000' };
		}
		// Use expanded category data
		const category = record.expand.currentVersion.expand.category;
		return { color: category.color || '#000000' };
	});

	const topic = $derived(() => {
		// Use selected version data from editor if available, otherwise fall back to server data
		if (selectedVersionData) {
			return selectedVersionData;
		}
		if (!record?.expand?.currentVersion) {
			return {
				content: [],
				titleDE: isPreview ? 'Loading...' : '',
				titleEN: isPreview ? 'Loading...' : '',
				id: ''
			};
		}
		const version = record.expand.currentVersion;
		// Ensure content is always an array
		if (!version.content || !Array.isArray(version.content)) {
			return { ...version, content: [] };
		}
		return version;
	});

	const getComponentStepCount = (component: any) => {
		if (component.type === 'aiQuestion') {
			return 2;
		}
		if (component.type === 'feelingsDetective') {
			return 5;
		}
		if (component.type === 'needsDetective') {
			return 4; // Fixed: should be 4 steps (0,1,2,3), not 5
		}
		if (component.type === 'needsRubiksCube') {
			return 2;
		}
		return 1;
	};

	const totalSteps = $derived(() => {
		if (!topic().content) return [];
		const componentData = topic().content?.map((el: any, index: number) => {
			return {
				component: el.type,
				stepCount: getComponentStepCount(el),
				blockIndex: index
			};
		});
		componentData.unshift({
			component: 'title',
			stepCount: 1,
			blockIndex: -1
		});
		componentData.push({
			component: 'summary',
			stepCount: 1,
			blockIndex: -1
		});

		// Flatten the steps array to account for multi-step components
		const flatSteps = componentData.flatMap((component: any) => {
			if (component.stepCount > 1) {
				// Create an array with proper internal step indices
				return Array(component.stepCount)
					.fill(null)
					.map((_, index) => ({
						component: component.component,
						internalStep: index,
						blockIndex: component.blockIndex
					}));
			}
			return {
				component: component.component,
				internalStep: 0,
				blockIndex: component.blockIndex
			};
		});

		return flatSteps;
	});
	const totalStepsCount = $derived(() => {
		return totalSteps().reduce((acc: number, curr: any) => acc + 1, 0);
	});

	// Get components directly - no more pages structure
	const components = $derived(() => topic().content || []);

	// Navigation functions
	const updateQueryParams = () => {
		if (onStepChange) {
			onStepChange(currentStep);
		}

		// Only update URL in non-preview mode
		if (!isPreview) {
			const url = new URL(window.location.href);
			url.searchParams.set('step', currentStep.toString());
			replaceState(url, {
				step: currentStep
			});
		}
	};

	// Session management functions (only for non-preview mode)
	const handleStartNewSession = async () => {
		if (!sessionInitData || isPreview) return;

		try {
			const session = await learningSession.init(
				sessionInitData.userId,
				sessionInitData.mainTopicId,
				sessionInitData.topicVersionId
			);
			currentSession = session;
			if (onSessionChange) onSessionChange(session);

			// Reset to first page for new session
			currentStep = 0;
			updateQueryParams();

			// Close confirmation dialog
			showNewSessionConfirm = false;
			completedSession = null;
			sessionInitData = null;
		} catch (error) {
			console.error('Error creating new session:', error);
		}
	};

	const handleContinueOldSession = () => {
		if (!completedSession || isPreview) return;

		currentSession = completedSession;
		if (onSessionChange) onSessionChange(completedSession);

		// Go to summary step to show results
		currentStep = totalStepsCount() - 1;
		updateQueryParams();

		// Close confirmation dialog
		showNewSessionConfirm = false;
		completedSession = null;
		sessionInitData = null;
	};

	// Note: Learning context management has been removed - components now use direct props

	// Update step when initialStep changes (only when initialStep itself changes)
	let previousInitialStep = $state(initialStep);
	$effect(() => {
		if (initialStep !== previousInitialStep && initialStep !== undefined) {
			currentStep = initialStep;
			previousInitialStep = initialStep;
		}
	});

	// Mark session as completed when reaching summary page
	$effect(() => {
		if (
			!isPreview &&
			currentSession &&
			components().length > 0 &&
			currentStep === totalStepsCount() - 1
		) {
			handleSessionCompletion();
		}
	});

	// Session initialization (only for non-preview mode)
	onMount(async () => {
		if (isPreview) return;

		// Uses server-provided user data (no client-side auth checks)
		if (user?.id && record?.id && record?.expand?.currentVersion?.id) {
			const userId = user.id;
			const mainTopicId = record.id; // This is the main topic ID stored in session.topic
			const topicVersionId = record.expand.currentVersion.id; // This is the version ID stored in session.topicVersion

			try {
				// Check for existing incomplete session - use the MAIN topic ID, not the version ID
				const existingSessions = await pb.collection('learnSessions').getList(1, 1, {
					filter: `user = "${userId}" && topic = "${mainTopicId}"`,
					sort: '-created'
				});

				if (existingSessions.items.length > 0) {
					// Check if the latest session is not completed
					const latestSession = existingSessions.items[0] as unknown as LearningSession;

					if (!latestSession.completed) {
						// Resume existing incomplete session
						currentSession = latestSession;
						if (onSessionChange) onSessionChange(latestSession);

						// Resume from saved step if available
						if (currentSession.currentPage !== currentStep) {
							currentStep = currentSession.currentPage;
							updateQueryParams();
						}
					} else {
						// Latest session is completed, ask user if they want to start a new one
						completedSession = latestSession;
						sessionInitData = { userId, mainTopicId, topicVersionId };
						showNewSessionConfirm = true;
					}
				} else {
					// Create new session
					const session = await learningSession.init(
						userId, // ← From server data
						mainTopicId, // ← Main topic ID (what gets stored in session.topic)
						topicVersionId // ← Version ID (what gets stored in session.topicVersion)
					);
					currentSession = session;
					if (onSessionChange) onSessionChange(session);

					// Resume from saved step if available
					if (session.currentPage !== currentStep) {
						currentStep = session.currentPage;
						updateQueryParams();
					}
				}
			} catch (error) {
				console.error('Error during session initialization:', error);
			}
		}
	});

	// Helper function to handle response saving
	const handleResponse = async (blockType: string, response: any, content: any, currentBlockIndex?: number) => {
		const session = activeSession();
		if (!session) return;

		// For multi-step components, we don't need to track pageIndex anymore
		// since we're using blockType and blockContent for identification
		const targetPageIndex = currentStep;

		if (isPreview) {
			// For preview mode, update the mock session in memory
			const validBlockType = blockType as
				| 'text'
				| 'list'
				| 'heading'
				| 'task'
				| 'timer'
				| 'breathe'
				| 'bodymap'
				| 'taskCompletion'
				| 'sortable'
				| 'multipleChoice'
				| 'aiQuestion'
				| 'feelingsDetective'
				| 'needsDetective'
				| 'needsRubiksCube'
				| 'image'
				| 'audio'
				| 'nextPage'
				| 'pageNavigation';

			const newResponse = {
				
				blockIndex: currentBlockIndex || 0,
				blockType: validBlockType,
				response,
				timestamp: new Date().toISOString(),
				topicVersionId: topic().id,
				blockContent: content
			};

			// Ensure responses array exists
			const existingResponses = session.responses || [];

			// Remove any existing response for this page and block type  
			const updatedResponses = existingResponses.filter(
				(r) => !(r.blockType === blockType && JSON.stringify(r.blockContent) === JSON.stringify(content))
			);
			updatedResponses.push(newResponse);

			const updatedSession = {
				...session,
				responses: updatedResponses,
				updated: new Date().toISOString()
			};

			if (onSessionChange) {
				onSessionChange(updatedSession);
			}
		} else {
			// For live mode, save to database
			try {
				const validBlockType = blockType as
					| 'text'
					| 'list'
					| 'heading'
					| 'task'
					| 'timer'
					| 'breathe'
					| 'bodymap'
					| 'taskCompletion'
					| 'sortable'
					| 'multipleChoice'
					| 'aiQuestion'
					| 'feelingsDetective'
					| 'needsDetective'
					| 'needsRubiksCube'
					| 'image'
					| 'audio'
					| 'nextPage'
					| 'pageNavigation';
				await learningSession.saveResponseImmediate(
					session.id,
					
					currentBlockIndex || 0,
					validBlockType,
					response,
					topic().id,
					content
				);
				// Refresh session data if callback provided
				if (onSessionChange) {
					const refreshedSession = await pb.collection('learnSessions').getOne(session.id, {
						requestKey: `refreshSession-${session.id}-${Date.now()}`
					});
					const refreshedLearningSession = refreshedSession as unknown as LearningSession;
					currentSession = refreshedLearningSession;
					onSessionChange(refreshedLearningSession);
				}
			} catch (error) {
				console.error('Failed to save response:', error);
			}
		}
	};

	// Helper function to handle feedback saving
	const handleFeedbackSubmit = async (feedback: any) => {
		if (isPreview || !currentSession) {
			return;
		}

		try {
			await learningSession.saveFeedback(currentSession.id, feedback);
		} catch (error) {
			console.error('Failed to save feedback:', error);
		}
	};

	// Helper function to mark session as completed
	const handleSessionCompletion = async () => {
		if (isPreview || !currentSession) {
			return;
		}

		try {
			await learningSession.complete(currentSession.id);
		} catch (error) {
			console.error('Failed to mark session as completed:', error);
		}
	};
</script>

{#if !showNewSessionConfirm}
	<!-- Loading state - ensure data is fully loaded -->
	{#if !record || !categories || !record.expand?.currentVersion}
		<div class="flex h-full w-full items-center justify-center">
			<div class="text-center">
				<div
					class="flex h-svh items-center justify-center"
				>
					<SparklePill fast={true} class="h-6 w-16 shadow-xl dark:shadow-gray-200/30" />
				</div>
			</div>
		</div>
	{:else}
		<!-- Step indicator -->
		<LearnStepIndicator
			{topic}
			totalSteps={totalSteps()}
			totalStepsCount={totalStepsCount()}
			{currentStep}
			{currentCategory}
			onPrevStep={() => gotoPrevStep()}
			onNextStep={() => gotoNextStep()}
		/>

		{#if currentStep === 0}
			<LearnTitleCard
				currentCategory={currentCategory()}
				topic={topic()}
				gotoNextStep={async () => {
					await gotoNextStep();
				}}
			/>
		{/if}

		<!-- Show summary page (only on the last step) -->
		{#if components().length > 0 && currentStep === totalStepsCount() - 1}
			{@const currentActiveSession = activeSession()}
			{#if !isPreview && currentActiveSession}
				{#await pb
					.collection('learnSessions')
					.getOne(currentActiveSession.id)
					.then((session) => session as unknown as LearningSession)}
					<div class="p-8 text-center">
						<div
							class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"
						></div>
						<p class="mt-4 text-gray-600">Loading your results...</p>
					</div>
				{:then reloadedSession}
					<LearningSummary
						session={reloadedSession}
						topic={topic()}
						color={currentCategory().color}
						onFeedbackSubmit={handleFeedbackSubmit}
					/>
				{:catch error}
					<div class="p-8 text-center">
						<p class="text-red-600">Error loading results: {error.message}</p>
					</div>
				{/await}
			{:else}
				<LearningSummary
					session={currentActiveSession || null}
					topic={topic()}
					color={currentCategory().color}
					onFeedbackSubmit={handleFeedbackSubmit}
				/>
			{/if}
		{:else if components().length > 0 && currentStep > 0 && currentStep < totalStepsCount() - 1}
			<!-- Show single component per step -->
			{@const stepData = totalSteps()[currentStep]}
			{@const content = stepData.blockIndex >= 0 ? components()[stepData.blockIndex] : null}
			{@const internalStep = stepData.internalStep}
			{#if content && content.type === 'text'}
				<LearnText {content} gotoNextStep={() => gotoNextStep()} />
			{:else if content && content.type === 'task'}
				<LearnTask color={currentCategory().color} {content} />
			{:else if content && content.type === 'heading'}
				<LearnHeading {content} />
			{:else if content && content.type === 'image'}
				<LearnImage {content} currentVersion={topic()} gotoNextStep={() => gotoNextStep()} />
			{:else if content && content.type === 'audio'}
				<LearnAudio
					color={currentCategory().color}
					{content}
					session={activeSession()}
					onResponse={(response) => handleResponse('audio', response, content)}
					gotoNextStep={() => gotoNextStep()}
				/>
			{:else if content && content.type === 'timer'}
				<LearnTimer
					duration={content.duration}
					color={currentCategory().color}
					session={activeSession()}
					onResponse={(response) => handleResponse('timer', response, content)}
				/>
			{:else if content && content.type === 'breathe'}
				<LearnBreathe
					{content}
					
					blockIndex={stepData.blockIndex}
					{isPreview}
					gotoNextStep={() => gotoNextStep()}
				/>
			{:else if content && content.type === 'bodymap'}
				<LearnBodyMap
					{content}
					color={currentCategory().color}
					session={activeSession()}
					contentBlock={content}
					topicVersionId={topic().id}
					onResponse={(response) => handleResponse('bodymap', response, content)}
					gotoNextStep={() => gotoNextStep()}
				/>

				<LearnCompletionNotes
					{content}
					color={currentCategory().color}
					session={activeSession()}
					onResponse={(response) => handleResponse('taskCompletion', response, content)}
				/>
			{:else if content && content.type === 'list'}
				<LearnList
					{content}
					currentCategory={currentCategory()}
					gotoNextStep={() => gotoNextStep()}
				/>
			{:else if content && content.type === 'sortable'}
				{@const sortableResponses = activeSession()?.responses?.filter(r => 
					r.blockIndex === stepData.blockIndex && 
					r.blockType === 'sortable' &&
					JSON.stringify(r.blockContent) === JSON.stringify(content)
				) || []}
				{@const savedResponse = sortableResponses.length > 0 
					? sortableResponses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
					: null}
				<LearnSortable
					{content}
					color={currentCategory().color}
					currentCategory={currentCategory()}
					initialUserSorting={savedResponse?.response?.userSorting || {}}
					onResponse={(response) => handleResponse('sortable', response, content, stepData.blockIndex)}
					gotoNextStep={() => gotoNextStep()}
				/>
			{:else if content && content.type === 'multipleChoice'}
				<LearnMultipleChoice
					{content}
					color={currentCategory().color}
					session={activeSession()}
					contentBlock={content}
					topicVersionId={topic().id}
					onResponse={(response) => handleResponse('multipleChoice', response, content)}
				/>
			{:else if content && content.type === 'aiQuestion'}
				<LearnAIQuestion
					{content}
					color={currentCategory().color}
					session={activeSession()}
					contentBlock={content}
					{currentStep}
					totalSteps={totalSteps()}
					topicVersionId={topic().id}
					onResponse={(response) => handleResponse('aiQuestion', response, content)}
					gotoNextStep={() => gotoNextStep()}
				/>
			{:else if content && content.type === 'feelingsDetective'}
				<LearnFeelingsDetective
					{content}
					color={currentCategory().color}
					session={activeSession()}
					contentBlock={content}
					{currentStep}
					totalSteps={totalSteps()}
					topicVersionId={topic().id}
					onResponse={(response) => handleResponse('feelingsDetective', response, content)}
					gotoNextStep={() => gotoNextStep()}
					gotoPrevStep={() => gotoPrevStep()}
				/>
			{:else if content && content.type === 'needsDetective'}
				<LearnNeedsDetective
					{content}
					color={currentCategory().color}
					session={activeSession()}
					contentBlock={content}
					{currentStep}
					totalSteps={totalSteps()}
					topicVersionId={topic().id}
					onResponse={(response) => handleResponse('needsDetective', response, content)}
					gotoNextStep={() => gotoNextStep()}
					gotoPrevStep={() => gotoPrevStep()}
				/>
			{:else if content && content.type === 'needsRubiksCube'}
				<LearnNeedsRubiksCube
					{content}
					color={currentCategory().color}
					session={activeSession()}
					contentBlock={content}
					{currentStep}
					totalSteps={totalSteps()}
					topicVersionId={topic().id}
					onResponse={(response) => handleResponse('needsRubiksCube', response, content)}
					gotoNextStep={() => gotoNextStep()}
					{isPreview}
				/>
			{:else if content && content.type === 'nextPage'}
				<LearnNextPage {content} />
			{:else if content && content.type === 'pageNavigation'}
				<LearnPageNavigation {content} />
			{:else}
				<div class="rounded-lg bg-gray-100 p-4">
					<p class="text-gray-600">Unknown content type: {content?.type || 'undefined'}</p>
				</div>
			{/if}
		{/if}
	{/if}
{/if}

<!-- New Session Confirmation Dialog -->
<Dialog.Root bind:open={showNewSessionConfirm}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="text-xl font-bold text-gray-900">Modul neu starten?</Dialog.Title>
			<Dialog.Description class="text-gray-600">
				Möchtest du das Modul erneut durchlaufen oder deine bisherigen Ergebnisse ansehen?
			</Dialog.Description>
		</Dialog.Header>

		<Dialog.Footer class="flex gap-3 sm:justify-start">
			<button
				type="button"
				onclick={handleStartNewSession}
				class="flex-1 rounded-lg px-4 py-2 text-white transition-colors hover:opacity-90"
				style="background-color: {currentCategory().color}"
			>
				Neu starten
			</button>
			<button
				type="button"
				onclick={handleContinueOldSession}
				class="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
			>
				Ergebnisse ansehen
			</button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
