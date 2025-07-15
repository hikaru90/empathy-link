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
	import LearnSortableWithFeedback from '$lib/components/bullshift/Learn/LearnSortableWithFeedback.svelte';
	import LearnMultipleChoice from '$lib/components/bullshift/Learn/LearnMultipleChoice.svelte';
	import LearnAIQuestion from '$lib/components/bullshift/Learn/LearnAIQuestion.svelte';
	import LearnAIQuestionStep from '$lib/components/bullshift/Learn/LearnAIQuestionStep.svelte';
	import LearningSummary from '$lib/components/bullshift/Learn/LearningSummary.svelte';
	import LearnCompletion from '$lib/components/bullshift/Learn/LearnCompletion.svelte';
	import LearnNextPage from '$lib/components/bullshift/Learn/LearnNextPage.svelte';
	import LearnPageNavigation from '$lib/components/bullshift/Learn/LearnPageNavigation.svelte';
	import LearnImage from '$lib/components/bullshift/Learn/LearnImage.svelte';
	import LearnAudio from '$lib/components/bullshift/Learn/LearnAudio.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import { learningSession } from '$lib/stores/learningSession';
	import { pb } from '$scripts/pocketbase';
	import * as Dialog from '$lib/components/ui/dialog';

	// Learning Context Types (kept for compatibility but no longer used for context management)
	export interface LearningNavigationContext {
		gotoNextStep: () => void;
		gotoPrevStep: () => void;
		aiQuestionStep?: 'question' | 'response';
		setAIQuestionStep: (step: 'question' | 'response' | undefined) => void;
	}

	// Navigation helper functions (simplified since context management is removed)
	const gotoNextStep = () => {
		// Simply move to next page
		if (currentStep <= totalStepsCount()) {
			const newPage = currentStep + 1;
			currentStep = newPage;
			console.log('🔥 page advanced to:', newPage);
		}
		updateQueryParams();
	}

	const gotoPrevStep = (
	) => {
		
		// Simply move to previous page
		if (currentStep > 0) {
			const newPage = currentStep - 1;
			currentStep = newPage;
		}
		updateQueryParams();
	}

	interface Props {
		// Data from server
		record: any;
		categories: any[];
		user?: any;
		
		// Page state  
		initialPage?: number;
		
		// Mode flags
		isPreview: boolean;
		
		// Editor specific
		selectedVersionData?: any;
		
		// Callbacks
		onPageChange?: (page: number) => void;
		onSessionChange?: (session: LearningSession | null) => void;
	}

	let {
		record,
		categories,
		user,
		initialPage = 0,
		isPreview,
		selectedVersionData,
		onPageChange,
		onSessionChange
	}: Props = $props();

	// Page state
	let currentStep = $state(initialPage);
	let aiQuestionStep = $state<'question' | 'response' | undefined>(undefined);
	
	// Session state (only for non-preview mode)
	let currentSession = $state<LearningSession | null>(null);
	let showNewSessionConfirm = $state(false);
	let completedSession = $state<LearningSession | null>(null);
	let sessionInitData = $state<{userId: string, mainTopicId: string, topicVersionId: string} | null>(null);

	// Derived values
	const currentCategory = $derived(() => {
		if (!categories || !record) return { color: '#000000' };
		const res = categories.find((c) => c.id === record?.expand?.currentVersion?.category);
		return res ? { color: res.color || '#000000' } : { color: '#000000' };
	});

	const topic = $derived(() => {
		// Use selected version data from editor if available, otherwise fall back to server data
		if (selectedVersionData) {
			return selectedVersionData;
		}
		if (!record?.expand?.currentVersion) {
			return { content: [], titleDE: isPreview ? 'Loading...' : '', titleEN: isPreview ? 'Loading...' : '', id: '' };
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
		return 1;
	}

	const totalSteps = $derived(() => {
		if (!topic().content) return [];
		const componentData = topic().content?.map((el: any) => {
			return {
				component: el.type,
				stepCount: getComponentStepCount(el)
			}
		});
		componentData.unshift({
			component: 'title',
			stepCount: 1
		});
		componentData.push({
			component: 'summary',
			stepCount: 1
		});

		// Flatten the steps array to account for multi-step components
		const flatSteps = componentData.flatMap((component: any) => {
			if (component.stepCount > 1) {
				// Create an array with proper internal step indices
				return Array(component.stepCount).fill(null).map((_, index) => ({
					component: component.component,
					internalStep: index
				}));
			}
			return {
				component: component.component,
				internalStep: 0
			};
		});

		return flatSteps;
	});
	const totalStepsCount = $derived(() => {
		console.log('totalSteps',totalSteps());
		return totalSteps().reduce((acc: number, curr: any) => acc + 1, 0);
	});

	// Get components directly - no more pages structure
	const components = $derived(() => topic().content || []);

	// Navigation functions
	const updateQueryParams = () => {
		if (onPageChange) {
			onPageChange(currentStep);
		}
		const url = new URL(window.location.href);
		url.searchParams.set('page', currentStep.toString());
		replaceState(url, {
			page: currentStep
		});
	};

	// Session management functions (only for non-preview mode)
	const handleStartNewSession = async () => {
		if (!sessionInitData || isPreview) return;
		
		try {
			console.log('🆕 User confirmed, creating new session...');
			const session = await learningSession.init(
				sessionInitData.userId,
				sessionInitData.mainTopicId,
				sessionInitData.topicVersionId
			);
			console.log('✅ New session created:', session.id);
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
			console.error('❌ Error creating new session:', error);
		}
	};

	const handleContinueOldSession = () => {
		if (!completedSession || isPreview) return;
		
		console.log('🔄 User chose to continue with completed session');
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

	// Update page when initialPage changes
	$effect(() => {
		if (initialPage !== currentStep) {
			currentStep = initialPage;
		}
	});

	// Session initialization (only for non-preview mode)
	onMount(async () => {
		if (isPreview) return;
		
		console.log('🔍 Session initialization starting...');
		console.log('📊 Available data:', {
			hasUser: !!user,
			userId: user?.id,
			hasRecord: !!record,
			recordId: record?.id,
			hasCurrentVersion: !!record?.expand?.currentVersion,
			currentVersionId: record?.expand?.currentVersion?.id
		});
		
		// Uses server-provided user data (no client-side auth checks)
		if (user?.id && record?.id && record?.expand?.currentVersion?.id) {
			const userId = user.id;
			const mainTopicId = record.id; // This is the main topic ID stored in session.topic
			const topicVersionId = record.expand.currentVersion.id; // This is the version ID stored in session.topicVersion

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
						if (onSessionChange) onSessionChange(latestSession);
						
						// Resume from saved page if available
						if (currentSession.currentPage !== currentStep) {
							console.log('📄 Resuming from saved page:', currentSession.currentPage);
							currentStep = currentSession.currentPage;
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
					if (onSessionChange) onSessionChange(session);
					
					// Resume from saved page if available
					if (session.currentPage !== currentStep) {
						console.log('📄 Setting page from new session:', session.currentPage);
						currentStep = session.currentPage;
						updateQueryParams();
					}
				}
			} catch (error) {
				console.error('❌ Error during session initialization:', error);
			}
		} else {
			console.log('❌ Missing required data for session initialization');
			console.log('Missing:', {
				user: !user?.id ? 'user ID' : null,
				record: !record?.id ? 'record ID' : null,
				currentVersion: !record?.expand?.currentVersion?.id ? 'current version ID' : null
			});
		}
	});

	// Helper function to handle response saving
	const handleResponse = async (blockType: string, response: any, content: any) => {
		if (isPreview || !currentSession) return;
		
		try {
			// Cast blockType to the expected union type
			const validBlockType = blockType as "text" | "list" | "heading" | "task" | "timer" | "bodymap" | "taskCompletion" | "sortable" | "multipleChoice" | "aiQuestion" | "aiQuestionStep" | "aiResponseStep" | "image" | "audio" | "nextPage" | "pageNavigation";
			// Use currentStep as the identifier since it's our single source of truth
			await learningSession.saveResponseImmediate(currentSession.id, currentStep, 0, validBlockType, response, topic().id, content);
			// Refresh session data if callback provided
			if (onSessionChange) {
				const refreshedSession = await pb.collection('learnSessions').getOne(currentSession.id);
				const refreshedLearningSession = refreshedSession as unknown as LearningSession;
				currentSession = refreshedLearningSession;
				onSessionChange(refreshedLearningSession);
			}
		} catch (error) {
			console.error('Failed to save response:', error);
		}
	};

	// Helper function to handle feedback saving
	const handleFeedbackSubmit = async (feedback: any) => {
		if (isPreview || !currentSession) {
			console.log('Preview feedback:', feedback);
			return;
		}
		
		try {
			await learningSession.saveFeedback(currentSession.id, feedback);
			console.log('Feedback saved successfully');
		} catch (error) {
			console.error('Failed to save feedback:', error);
		}
	};
</script>

{#if !showNewSessionConfirm}
	<!-- Step indicator -->
	<LearnStepIndicator 
		{topic}
		totalSteps={totalSteps()}
		totalStepsCount={totalStepsCount()}
		{currentStep}
		{currentCategory}
		{aiQuestionStep}
		onPrevStep={() => gotoPrevStep()}
		onNextStep={() => gotoNextStep()}
	/>

	{#if currentStep === 0}
		<LearnTitleCard currentCategory={currentCategory()} topic={topic()} gotoNextStep={() => gotoNextStep()} />
	{/if}

	<!-- Show summary page (only on the last step) -->
	{#if components().length > 0 && currentStep === totalStepsCount() - 1}
		{#if !isPreview && currentSession}
			{#await pb.collection('learnSessions').getOne(currentSession.id).then(session => session as unknown as LearningSession)}
				<div class="text-center p-8">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
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
				<div class="text-center p-8">
					<p class="text-red-600">Error loading results: {error.message}</p>
				</div>
			{/await}
		{:else}
			<LearningSummary 
				session={null}
				topic={topic()}
				color={currentCategory().color}
				onFeedbackSubmit={handleFeedbackSubmit}
			/>
		{/if}
	{:else if components().length > 0 && currentStep > 0 && currentStep < totalStepsCount() - 1}
		<!-- Show single component per step -->
		{@const stepData = totalSteps()[currentStep]}
		{@const componentIndex = topic().content.findIndex((comp: any) => comp.type === stepData.component)}
		{@const content = components()[componentIndex]}
		{@const internalStep = stepData.internalStep}
		{#if content && content.type === 'text'}
			<LearnText {content} {isPreview} />
		{:else if content && content.type === 'task'}
			<LearnTask 
				color={currentCategory().color} 
				{content} 
			/>
		{:else if content && content.type === 'heading'}
			<LearnHeading {content} />
		{:else if content && content.type === 'image'}
			<LearnImage {content} />
		{:else if content && content.type === 'audio'}
			<LearnAudio color={currentCategory().color} {content} {isPreview} />
		{:else if content && content.type === 'timer'}
			<LearnTimer 
				duration={content.duration} 
				color={currentCategory().color}
				session={currentSession}
				onResponse={(response) => handleResponse('timer', response, content)}
			/>
		{:else if content && content.type === 'bodymap'}
			<LearnBodyMap 
				{content} 
				color={currentCategory().color}
				session={currentSession}
				contentBlock={content}
				topicVersionId={topic().id}
				onResponse={(response) => handleResponse('bodymap', response, content)}
			/>
		{:else if content && content.type === 'taskCompletion'}
			<LearnCompletionNotes 
				{content} 
				color={currentCategory().color}
				session={currentSession}
				onResponse={(response) => handleResponse('taskCompletion', response, content)}
			/>
		{:else if content && content.type === 'list'}
			<LearnList {content} currentCategory={currentCategory()} />
		{:else if content && content.type === 'sortable'}
			<LearnSortableWithFeedback 
				{content} 
				color={currentCategory().color}
				currentCategory={currentCategory()}
				session={currentSession}
				topicVersionId={topic().id}
				onResponse={(response) => handleResponse('sortable', response, content)}
			/>
		{:else if content && content.type === 'multipleChoice'}
			<LearnMultipleChoice 
				{content} 
				color={currentCategory().color}
				session={currentSession}
				contentBlock={content}
				topicVersionId={topic().id}
				onResponse={(response) => handleResponse('multipleChoice', response, content)}
			/>
		{:else if content && content.type === 'aiQuestion'}
			<LearnAIQuestion 
				{content} 
				color={currentCategory().color}
				session={currentSession}
				contentBlock={content}
				topicVersionId={topic().id}
				{internalStep}
				onResponse={(response) => handleResponse('aiQuestion', response, content)}
				gotoNextStep={() => gotoNextStep()}
			/>
		{:else if content && content.type === 'aiQuestionStep'}
			<LearnAIQuestionStep 
				{content} 
				color={currentCategory().color}
				session={currentSession}
				contentBlock={content}
				topicVersionId={topic().id}
				onResponse={(response: any) => handleResponse('aiQuestionStep', response, content)}
			/>

		{:else if content && content.type === 'nextPage'}
			<LearnNextPage {content} {isPreview} />
		{:else if content && content.type === 'pageNavigation'}
			<LearnPageNavigation {content} {isPreview} />
		{:else}
			<div class="p-4 bg-gray-100 rounded-lg">
				<p class="text-gray-600">Unknown content type: {content?.type || 'undefined'}</p>
			</div>
		{/if}
	{/if}
{/if}

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