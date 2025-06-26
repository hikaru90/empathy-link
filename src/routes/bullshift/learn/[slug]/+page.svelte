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
	import type { LearningSession } from '$routes/bullshift/learn/[id]/edit/schema';
	import { pb } from '$scripts/pocketbase';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let currentPage = $state(data.currentPage || 0);
	let currentSession = $state<LearningSession | null>(null);

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
	const gotoNextPage = async () => {
		// Allow navigating beyond content pages to summary and completion
		if (currentPage < topic().content.length + 1) { // +1 for completion page after summary
			currentPage++;
			
			if (currentSession && currentPage < topic().content.length) {
				// Only update current page in session if still within content pages
				await learningSession.updateCurrentPage(currentSession.id, currentPage);
			}
			if (currentPage === topic().content.length && currentSession) {
				// Complete session when reaching the summary page
				console.log(`Completing learning session for topic: ${currentSession.topic}`);
				await learningSession.complete(currentSession.id);
			}
			if (currentPage === topic().content.length + 1 && currentSession) {
				// Mark as done when reaching the final completion page
				console.log(`Marking learning session as done for topic: ${currentSession.topic}`);
				await learningSession.markAsDone(currentSession.id);
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
		// Uses server-provided user data (no client-side auth checks)
		if (data.user?.id && data.record?.id && data.record?.expand?.currentVersion?.id) {
			const userId = data.user.id;
			const mainTopicId = data.record.id; // This is the main topic ID stored in session.topic
			const topicVersionId = data.record.expand.currentVersion.id; // This is the version ID stored in session.topicVersion

			// Check for existing incomplete session - use the MAIN topic ID, not the version ID
			const existingSessions = await pb.collection('learnSessions').getList(1, 1, {
				filter: `user = "${userId}" && topic = "${mainTopicId}" && done = false`,
				sort: '-created'
			});

			if (existingSessions.items.length > 0) {
				// Resume existing session
				currentSession = existingSessions.items[0] as unknown as LearningSession;
				
				// Resume from saved page if available
				if (currentSession.currentPage !== currentPage) {
					currentPage = currentSession.currentPage;
					updateQueryParams();
				}
			} else {
				// Create new session
				const session = await learningSession.init(
					userId,  // ← From server data
					mainTopicId, // ← Main topic ID (what gets stored in session.topic)
					topicVersionId // ← Version ID (what gets stored in session.topicVersion)
				);
				currentSession = session;
				
				// Resume from saved page if available
				if (session.currentPage !== currentPage) {
					currentPage = session.currentPage;
					updateQueryParams();
				}
			}
		}
	});
</script>

<div class="pb-32 pt-6">
	<Header class="z-20" />
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

		{#if currentPage === 0}
			<LearnTitleCard currentCategory={currentCategory()} topic={topic()} />
		{/if}

		<!-- Show completion page if we're past the summary page -->
		{#if currentPage > topic().content.length}
			<LearnCompletion 
				topic={topic()}
				color={currentCategory().color}
				onReturnToOverview={() => {
					window.location.href = '/bullshift/learn';
				}}
			/>
		<!-- Show summary if we're at the summary page -->
		{:else if currentPage === topic().content.length}
			<LearningSummary 
				session={currentSession}
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
		<LearnStepper
			{gotoNextPage}
			{gotoPrevPage}
			color={currentCategory().color}
			step={currentPage}
			totalSteps={topic().content.length + 2}
			class="z-20"
		/>
	</div>
	<Footer />
</div>
