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
		if (currentPage < topic().content.length - 1) {
			currentPage++;
			if (currentSession) {
				await learningSession.updateCurrentPage(currentSession.id, currentPage);
			}
		} else {
			// Complete session when reaching the end
			if (currentSession) {
				await learningSession.complete(currentSession.id);
			}
		}
		updateQueryParams();
	};
	const gotoPrevPage = async () => {
		if (currentPage > 0) {
			currentPage--;
			if (currentSession) {
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
			const topicId = data.record.expand.currentVersion.id;

			// Check for existing incomplete session
			const existingSessions = await pb.collection('learnSessions').getList(1, 1, {
				filter: `user = "${userId}" && topic = "${topicId}" && completed = false`,
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
					data.record.id,
					topicId
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
					{/if}
				{/each}
			{/if}
		{/each}
		<LearnStepper
			{gotoNextPage}
			{gotoPrevPage}
			color={currentCategory().color}
			step={currentPage}
			class="z-20"
		/>
	</div>
	<Footer />
</div>
