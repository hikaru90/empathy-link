<script lang="ts">
	import type { PageData } from './$types';
	import { replaceState } from '$app/navigation';
	import { onMount } from 'svelte';
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
	import LearnCompletionNotes from '$lib/components/bullshift/Learn/LearnCompletionNotes.svelte';
	import LearnBodyMap from '$lib/components/LearnBodyMap.svelte';
	import LearnSortableWithFeedback from '$lib/components/bullshift/Learn/LearnSortableWithFeedback.svelte';
	import LearnMultipleChoice from '$lib/components/bullshift/Learn/LearnMultipleChoice.svelte';
	import LearningSummary from '$lib/components/bullshift/Learn/LearningSummary.svelte';
	import LearnCompletion from '$lib/components/bullshift/Learn/LearnCompletion.svelte';
	import { learningSession } from '$lib/stores/learningSession';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import { pb } from '$scripts/pocketbase';
	import * as Dialog from '$lib/components/ui/dialog';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let currentPage = $state(data.currentPage || 0);
	let currentSession = $state<LearningSession | null>(null);
	let showNewSessionConfirm = $state(false);
	let completedSession = $state<LearningSession | null>(null);
	let sessionInitData = $state<{userId: string, mainTopicId: string, topicVersionId: string} | null>(null);

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
		return data.record.expand.currentVersion;
	});

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
		// Allow navigating to summary page only
		if (currentPage < topic().content.length) { // Only allow going to summary page
			currentPage++;
			
			if (currentSession && currentPage < topic().content.length) {
				// Only update current page in session if still within content pages
				await learningSession.updateCurrentPage(currentSession.id, currentPage);
			}
			if (currentPage === topic().content.length && currentSession) {
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
			if (currentSession && currentPage < topic().content.length) {
				// Only update current page in session if moving within content pages
				await learningSession.updateCurrentPage(currentSession.id, currentPage);
			}
		}
		updateQueryParams();
	};

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

<div class="pb-32 pt-6">
	<Header class="z-20" user={data.user} />
	<div class="max-container py-10">
		<div class="mb-6 flex items-center justify-center">
			<!-- <a
				href="/bullshift/learn"
				class="inline-flex items-center gap-2 rounded-full border border-black/10 py-1 pl-2 pr-4 text-sm"
			>
				<ChevronLeft class="size-4" /> zurück
			</a> -->
			<LearnStepIndicator {topic} {currentPage} {currentCategory} />
		</div>

		<!-- Only show content if not waiting for user confirmation -->
		{#if !showNewSessionConfirm}
			{#if currentPage === 0}
				<LearnTitleCard currentCategory={currentCategory()} topic={topic()} />
			{/if}

			<!-- Show summary page (now the final page) -->
			{#if currentPage === topic().content.length && topic().content.length > 0}
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
			{:else}
				<!-- Show regular content -->
				{#each topic().content as page, pageIndex}
					{#if currentPage === pageIndex}
						{#each page.content as content, blockIndex}
							{#if content.type === 'text'}
								<LearnText {content} />
							{:else if content.type === 'task'}
								<LearnTask 
									color={currentCategory().color} 
									{content} 
								/>
							{:else if content.type === 'heading'}
								<LearnHeading {content} />
							{:else if content.type === 'timer'}
								<LearnTimer 
									duration={content.duration} 
									color={currentCategory().color}
									{pageIndex}
									{blockIndex}
									session={currentSession}
									onResponse={(response) => currentSession && learningSession.saveResponseImmediate(currentSession.id, pageIndex, blockIndex, 'timer', response, topic().id, content)}
								/>
							{:else if content.type === 'bodymap'}
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
							{:else if content.type === 'taskCompletion'}
								<LearnCompletionNotes 
									{content} 
									color={currentCategory().color}
									{pageIndex}
									{blockIndex}
									session={currentSession}
									onResponse={(response) => currentSession && learningSession.saveResponse(currentSession.id, pageIndex, blockIndex, 'taskCompletion', response, topic().id, content)}
								/>
							{:else if content.type === 'list'}
								<LearnList {content} currentCategory={currentCategory()} />
							{:else if content.type === 'sortable'}
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
							{:else if content.type === 'multipleChoice'}
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
							{/if}
						{/each}
					{/if}
				{/each}
			{/if}
		{/if}
		
		<LearnStepper
			{gotoNextPage}
			{gotoPrevPage}
			color={currentCategory().color}
			step={currentPage}
			totalSteps={topic().content.length + 1}
			class="z-20"
		/>
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
