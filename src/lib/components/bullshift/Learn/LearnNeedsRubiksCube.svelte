<script lang="ts">
	import { marked } from 'marked';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import IconPaperPlane from '$assets/icons/icon-paper-plane.svg?raw';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';

	interface Props {
		content: any;
		color: string;
		session: LearningSession | null;
		contentBlock: any;
		currentStep: number;
		totalSteps: { component: string; internalStep: number }[];
		topicVersionId: string;
		onResponse: (response: any) => void;
		gotoNextStep?: () => void;
		isPreview?: boolean;
	}

	let {
		content,
		color,
		session,
		contentBlock,
		currentStep,
		totalSteps,
		topicVersionId,
		onResponse,
		gotoNextStep,
		isPreview = false
	}: Props = $props();

	let userSentence = $state('');
	let transformedNeeds = $state<string[]>([]);
	let isLoading = $state(false);
	let hasSubmitted = $state(false);
	let responseTime = $state<number | null>(null);
	let errorMessage = $state('');

	const internalStep = $derived(() => {
		return totalSteps[currentStep].internalStep;
	});

	// Check for existing response in session
	const existingResponse = $derived(() => {
		if (!session) return null;
		return session.responses.find(
			(r) =>
				r.blockType === 'needsRubiksCube' &&
				JSON.stringify(r.blockContent) === JSON.stringify(contentBlock)
		);
	});

	// Initialize from existing response if available
	$effect(() => {
		if (existingResponse()) {
			const response = existingResponse()?.response;
			if (response) {
				userSentence = response.userSentence || '';
				transformedNeeds = response.transformedNeeds || [];
				hasSubmitted = !!response.transformedNeeds?.length;
				responseTime = response.responseTime || null;
			}
		}
	});

	// Clear error message when user starts typing
	$effect(() => {
		if (userSentence && errorMessage) {
			errorMessage = '';
		}
	});

	const submitSentence = async () => {
		if (!userSentence.trim() || isLoading || isPreview) return;

		isLoading = true;
		errorMessage = '';
		const startTime = Date.now();

		try {
			const response = await fetch('/api/ai/learn/needsRubiksCube', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sentence: userSentence.trim(),
					instruction: content.instruction || 'Transform this sentence into underlying needs'
				})
			});

			if (!response.ok) {
				throw new Error('Failed to transform sentence into needs');
			}

			const data = await response.json();
			const endTime = Date.now();
			responseTime = Math.floor((endTime - startTime) / 1000);

			transformedNeeds = data.needs;
			hasSubmitted = true;

			// Save the response
			onResponse({
				userSentence: userSentence.trim(),
				transformedNeeds: data.needs,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			});

			gotoNextStep?.();
		} catch (error) {
			console.error('Error transforming sentence:', error);
			errorMessage = "Sorry, I couldn't transform your sentence right now. Please try again.";
			hasSubmitted = false;
		} finally {
			isLoading = false;
		}
	};

	// Mock data for preview mode
	const mockNeeds = [
		'Verständnis',
		'Respekt', 
		'Wertschätzung',
		'Sicherheit',
		'Verbindung'
	];

	// Use mock data in preview mode
	$effect(() => {
		if (isPreview && userSentence.trim()) {
			transformedNeeds = mockNeeds;
			hasSubmitted = true;
		}
	});
</script>

<div class="flex h-full flex-col justify-between space-y-4 rounded-lg backdrop-blur">
	{#if internalStep() === 0}
		<!-- Step 1: Sentence Input -->
		<div class="flex flex-grow flex-col items-center justify-center space-y-2 gap-4">
			<img src="/diagrams/rubiksCube.svg" alt="Rubiks Cube" class="w-20" />
			<h3 class="font-medium text-gray-900 text-center max-w-sm">
				{@html marked(content.title || 'Gib einen schwierigen Satz ein, den du gehört hast')}
			</h3>
		</div>

		<div class="space-y-2">
			<div
				class="flex flex-col gap-2 rounded-2xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<AutoTextarea
					bind:value={userSentence}
					placeholder={content.placeholder || 'Schreibe hier den schwierigen Satz, den du gehört hast...'}
					class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
				/>

				<div class="flex items-end justify-between">
					<div>
						{#if existingResponse()}
							<button
								type="button"
								onclick={() => gotoNextStep?.()}
								style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
								class="flex items-center gap-2 rounded-full bg-white py-1 pl-3 pr-1 text-xs"
							>
								Zu den Bedürfnissen
								<div
									class="flex size-4 items-center justify-center rounded-full bg-black/5 fill-black/60"
								>
									<ChevronRight class="size-3" />
								</div>
							</button>
						{/if}
					</div>
					<button
						onclick={isPreview ? () => {
							if (userSentence.trim()) {
								transformedNeeds = mockNeeds;
								hasSubmitted = true;
								gotoNextStep?.();
							}
						} : submitSentence}
						disabled={!userSentence.trim() || isLoading}
						type="submit"
						style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
						class="flex size-10 items-center justify-center rounded-full bg-black text-white disabled:opacity-50"
					>
						{#if isLoading}
							<Loader2 class="size-4 animate-spin" />
						{:else}
							<div class="w-[1.2em] fill-white">
								{@html IconPaperPlane}
							</div>
						{/if}
					</button>
				</div>
			</div>

			<!-- Error message display -->
			{#if errorMessage}
				<div class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
					<p class="text-sm text-red-800">{errorMessage}</p>
				</div>
			{/if}
		</div>
	{:else if internalStep() === 1 && (existingResponse() || isPreview)}
		<!-- Step 2: Transformed Needs Display -->
		{#if hasSubmitted && transformedNeeds.length > 0}
			<div class="flex flex-col flex-grow items-center justify-center space-y-4 rounded-lg p-6">
				<div class="text-center">
					<img src="/diagrams/rubiksCubeSolved.svg" alt="Rubiks Cube" class="w-20" />
					<h4 class="mb-4 font-medium text-gray-900">
						{content.resultsTitle || 'Diese Bedürfnisse stecken dahinter:'}
					</h4>
				</div>
				
				<div class="flex flex-wrap justify-center gap-3">
					{#each transformedNeeds as need}
						<div
							class="rounded-full border border-gray-200 bg-gradient-to-b from-white to-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
							style="color: {color}; border-color: {color}20; background: linear-gradient(to bottom, white, {color}10);"
						>
							{need}
						</div>
					{/each}
				</div>

				{#if responseTime}
					<div class="text-center text-xs text-gray-500">
						Analysiert in {responseTime} Sekunden
					</div>
				{/if}
			</div>
		{/if}

		<!-- Navigation for next step -->
		<LearnGotoNextButton
			onClick={() => {
				if (isPreview) return;
				gotoNextStep?.();
			}}
			disabled={isPreview}
		>
			Weiter
		</LearnGotoNextButton>
	{/if}
</div>