<script lang="ts">
	import LearnSortable from './LearnSortable.svelte';
	import LearnSortableFeedback from './LearnSortableFeedback.svelte';
	import { learningSession } from '$lib/stores/learningSession';
	import type { LearningSession } from '$routes/bullshift/learn/[id]/edit/schema';

	interface Props {
		content: {
			bucketA: string;
			bucketB: string;
			items: {
				text: string;
				correctBucket: "A" | "B";
			}[];
		};
		color: string;
		currentCategory: {
			color: string;
		};
		pageIndex: number;
		blockIndex: number;
		session: LearningSession | null;
		onResponse?: (response: { userSorting: { [itemText: string]: "A" | "B" | null } }) => void;
		topicVersionId?: string;
	}

	let { content, currentCategory, pageIndex, blockIndex, session, onResponse, topicVersionId, color }: Props = $props();

	// Check if there's a task completion response for this sortable
	const checkForTaskCompletion = () => {
		if (!session) return false;
		
		// Look for a taskCompletion response on the same page after this block
		const taskCompletionResponse = session.responses.find(response => 
			response.pageIndex === pageIndex && 
			response.blockIndex > blockIndex && 
			response.blockType === 'taskCompletion'
		);
		
		return !!taskCompletionResponse;
	};

	// Get initial sorting from session - make it reactive to session changes
	const getInitialSorting = $derived(() => {
		if (!session) return {};
		
		const existingResponse = session.responses.find(response => 
			response.pageIndex === pageIndex && 
			response.blockIndex === blockIndex && 
			response.blockType === 'sortable'
		);
		
		if (existingResponse && existingResponse.blockType === 'sortable') {
			return existingResponse.response.userSorting;
		}
		
		return {};
	});

	// Simple state - reactive to session but no complex loops
	let currentSorting = $state<{ [itemText: string]: "A" | "B" | null }>({});
	let showFeedback = $state(false);

	// Update currentSorting when session data becomes available
	$effect(() => {
		const sessionSorting = getInitialSorting();
		if (Object.keys(sessionSorting).length > 0) {
			currentSorting = { ...sessionSorting };
		}
		
		// Update feedback state
		showFeedback = checkForTaskCompletion();
	});

	const handleSortableResponse = (response: { userSorting: { [itemText: string]: "A" | "B" | null } }) => {
		// Update the initial sorting so it persists
		currentSorting = response.userSorting;
		
		// Check if task completion was triggered
		if (checkForTaskCompletion()) {
			showFeedback = true;
		}
		
		if (onResponse) {
			onResponse(response);
		}
	};
</script>

{#if showFeedback}
	<LearnSortableFeedback 
		{content} 
		userSorting={currentSorting}
		{currentCategory} 
		{color}
	/>
{:else}
	<LearnSortable 
		{content} 
		{currentCategory} 
		{color}
		initialUserSorting={currentSorting}
		onResponse={handleSortableResponse}
	/>
{/if} 