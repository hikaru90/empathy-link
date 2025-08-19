<script lang="ts">
	import { marked } from 'marked';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import IconPaperPlane from '$assets/icons/icon-paper-plane.svg?raw';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import FeelingSelector from '$lib/components/FeelingSelector.svelte';
	import LearnSplashScreen from '$lib/components/bullshift/Learn/LearnSplashScreen.svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs } from '$scripts/helpers';

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
		gotoPrevStep?: () => void;
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
		gotoPrevStep
	}: Props = $props();

	// Component state
	let situationInput = $state('');
	let thoughtsInput = $state('');
	let selectedFeelings = $state<string[]>([]);
	let aiReflection = $state('');
	let aiSummary = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let responseTime = $state<number | null>(null);
	let splashDone = $state(false);
	let feelingsLookup = $state<Map<string, string>>(new Map());

	let splashContentClass = $derived(() => {
		if (splashDone) {
			return 'opacity-100 scale-100';
		}
		return 'opacity-0 scale-0';
	});

	const internalStep = $derived(() => {
		return totalSteps[currentStep].internalStep;
	});

	// Check for existing response in session
	const existingResponse = $derived(() => {
		if (!session) return null;
		return session.responses.find(
			(r) =>
				r.blockType === 'feelingsDetective' &&
				JSON.stringify(r.blockContent) === JSON.stringify(contentBlock)
		);
	});

	// Initialize from existing response if available
	$effect(() => {
		if (existingResponse()) {
			const response = existingResponse()?.response;
			if (response) {
				situationInput = response.situationInput || '';
				thoughtsInput = response.thoughtsInput || '';
				selectedFeelings = response.selectedFeelings || [];
				aiReflection = response.aiReflection || '';
				aiSummary = response.aiSummary || '';
			}
		}
	});

	// Initialize feelings lookup
	$effect(() => {
		initFeelingsLookup();
	});

	// Clear error message when user starts typing
	$effect(() => {
		if ((situationInput || thoughtsInput) && errorMessage) {
			errorMessage = '';
		}
	});

	const submitSituation = async () => {
		if (!situationInput.trim() || isLoading) return;

		isLoading = true;
		errorMessage = '';
		const startTime = Date.now();

		try {
			const response = await fetch('/api/ai/learn/feelingsDetective', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					step: 'reflection',
					situation: situationInput.trim()
				})
			});

			if (!response.ok) {
				throw new Error('Failed to get AI response');
			}

			const data = await response.json();
			const endTime = Date.now();
			responseTime = Math.floor((endTime - startTime) / 1000);

			aiReflection = data.response;

			// Save partial response
			const responseData = {
				situationInput: situationInput.trim(),
				aiReflection: data.response,
				thoughtsInput,
				selectedFeelings,
				aiSummary,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			};
			onResponse(responseData);

			gotoNextStep?.();
		} catch (error) {
			console.error('Error getting AI response:', error);
			errorMessage = "Sorry, I couldn't process your answer right now. Please try again.";
		} finally {
			isLoading = false;
		}
	};

	const submitThoughts = async () => {
		if (!thoughtsInput.trim() || isLoading) return;

		isLoading = true;
		errorMessage = '';

		try {
			// Update response data with thoughts
			const responseData = {
				situationInput,
				aiReflection,
				thoughtsInput: thoughtsInput.trim(),
				selectedFeelings,
				aiSummary,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			};
			onResponse(responseData);

			gotoNextStep?.();
		} catch (error) {
			console.error('Error saving thoughts:', error);
			errorMessage = "Sorry, I couldn't save your thoughts right now. Please try again.";
		} finally {
			isLoading = false;
		}
	};

	const submitFeelings = async () => {
		if (selectedFeelings.length === 0 || isLoading) return;

		isLoading = true;
		errorMessage = '';

		try {
			// Update response data with feelings
			const responseData = {
				situationInput,
				aiReflection,
				thoughtsInput,
				selectedFeelings: [...selectedFeelings],
				aiSummary,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			};
			onResponse(responseData);

			gotoNextStep?.();
		} catch (error) {
			console.error('Error saving feelings:', error);
			errorMessage = "Sorry, I couldn't save your feelings right now. Please try again.";
		} finally {
			isLoading = false;
		}
	};

	const generateSummary = async () => {
		console.log('generateSummary called', {
			isLoading,
			situationInput: situationInput.trim(),
			thoughtsInput: thoughtsInput.trim(),
			selectedFeelings
		});

		if (isLoading) return;

		// Validate that we have the required data
		if (!situationInput.trim()) {
			errorMessage = 'Please complete the situation input first';
			return;
		}

		if (!thoughtsInput.trim()) {
			errorMessage = 'Please complete the thoughts input first';
			return;
		}

		isLoading = true;
		errorMessage = '';
		const startTime = Date.now();

		try {
			// Convert feeling IDs to feeling names
			const feelingNames = selectedFeelings.map((id) => feelingsLookup.get(id) || id);

			const requestData = {
				step: 'summary',
				situation: situationInput,
				thoughts: thoughtsInput,
				feelings: feelingNames
			};

			const response = await fetch('/api/ai/learn/feelingsDetective', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestData)
			});

			if (!response.ok) {
				throw new Error('Failed to get AI summary');
			}

			const data = await response.json();
			const endTime = Date.now();
			responseTime = Math.floor((endTime - startTime) / 1000);

			aiSummary = data.response;

			// Save final complete response
			onResponse({
				situationInput,
				aiReflection,
				thoughtsInput,
				selectedFeelings,
				aiSummary: data.response,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			});

			// Don't call gotoNextStep here - the summary should be displayed in the same step
		} catch (error) {
			console.error('Error generating summary:', error);
			errorMessage = "Sorry, I couldn't generate the summary right now. Please try again.";
		} finally {
			isLoading = false;
		}
	};

	const initFeelingsLookup = async () => {
		try {
			const records = await pb.collection('feelings').getFullList({
				sort: 'category,sort',
				requestKey: 'feelingsDetective'
			});
			const data = serializeNonPOJOs(records) as any[];
			const lookup = new Map<string, string>();
			if (data && Array.isArray(data)) {
				data.forEach((feeling) => {
					if (feeling && feeling.id && feeling.nameDE) {
						lookup.set(feeling.id, feeling.nameDE);
					}
				});
			}
			feelingsLookup = lookup;
		} catch (error) {
			console.error('Error initializing feelings lookup:', error);
			feelingsLookup = new Map();
		}
	};

	const handleFeelingChange = (feelings: string[]) => {
		selectedFeelings = feelings;
	};
</script>

<LearnSplashScreen
	{color}
	text="Zeit zu Üben"
	on:splashDone={() => {
		splashDone = true;
	}}
/>

<div
	class="flex h-full transform flex-col justify-between space-y-4 rounded-lg backdrop-blur transition-all duration-1000 {splashContentClass()}"
>
	{#if internalStep() === 0}
		<!-- Step 1: Situation Input -->
		<div class="flex flex-grow items-center justify-center space-y-2">
			<h3 class="max-w-xs font-medium text-gray-900">
				{content.question || 'Beschreibe eine Situation, die du erlebt hast:'}
			</h3>
		</div>

		<div class="space-y-2">
			<div
				class="flex flex-col gap-2 rounded-2xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<AutoTextarea
					bind:value={situationInput}
					placeholder="Mein Chef meinte ich würde seine Erwartungen enttäuschen..."
					class="max-w-xs flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
					onEnter={submitSituation}
				/>

				<div class="flex items-end justify-between">
					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => gotoPrevStep?.()}
							style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
							class="flex items-center gap-2 rounded-full bg-white px-1 py-1 text-xs"
						>
							<div class="flex size-4 items-center justify-center rounded-full fill-black/60">
								<ChevronLeft class="size-3" />
							</div>
						</button>
						{#if existingResponse()}
							<button
								type="button"
								onclick={() => gotoNextStep?.()}
								style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
								class="flex items-center gap-2 rounded-full bg-white py-1 pl-3 pr-1 text-xs"
							>
								Zur vorherigen Antwort
								<div
									class="flex size-4 items-center justify-center rounded-full bg-black/5 fill-black/60"
								>
									<ChevronRight class="size-3" />
								</div>
							</button>
						{/if}
					</div>
					<button
						onclick={submitSituation}
						disabled={!situationInput.trim() || isLoading}
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

			{#if errorMessage}
				<div class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
					<p class="text-sm text-red-800">{errorMessage}</p>
				</div>
			{/if}
		</div>
	{:else if internalStep() === 1 && aiReflection}
		<!-- Step 2: AI Non-judgmental Reflection -->
		<div class="flex flex-grow items-center justify-center space-y-2 rounded-lg p-6">
			<div class="max-w-xs">
				<div class="prose prose-sm overflow-y-auto text-gray-700">
					{@html marked(aiReflection)}
				</div>
			</div>
		</div>

		<LearnGotoNextButton
			onClick={() => {
				gotoNextStep?.();
			}}
			onPrev={() => {
				gotoPrevStep?.();
			}}
			displayBackButton={true}
			backButtonText="Nein"
		>
			Genau
		</LearnGotoNextButton>
	{:else if internalStep() === 2}
		<!-- Step 3: Thoughts and Judgments Input -->
		<div class="flex flex-grow items-center justify-center space-y-2">
			<h3 class="max-w-xs font-medium text-gray-900">
				Welche Urteile und Bewertungen hattest Du spontan im Kopf?
			</h3>
		</div>

		<div class="space-y-2">
			<div
				class="flex flex-col gap-2 rounded-2xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<AutoTextarea
					bind:value={thoughtsInput}
					placeholder="Ich habe gedacht ich sei nicht gut genug..."
					class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
					onEnter={submitThoughts}
				/>

				<div class="flex items-end justify-between">
					<button
						type="button"
						onclick={() => gotoPrevStep?.()}
						style="box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);"
						class="flex items-center gap-2 rounded-full bg-white px-1 py-1 text-xs"
					>
						<div class="flex size-4 items-center justify-center rounded-full fill-black/60">
							<ChevronLeft class="size-3" />
						</div>
					</button>
					<button
						onclick={submitThoughts}
						disabled={!thoughtsInput.trim() || isLoading}
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

			{#if errorMessage}
				<div class="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
					<p class="text-sm text-red-800">{errorMessage}</p>
				</div>
			{/if}
		</div>
	{:else if internalStep() === 3}
		<!-- Step 4: Feelings Selection -->
		<div class="flex flex-grow flex-col justify-center space-y-4">
			<div class="flex flex-grow items-center justify-center text-center font-medium text-gray-900">
				<h3 class="max-w-xs">Welche Gefühle löst diese Situation in Dir aus?</h3>
			</div>

			<div class="max-h-64 overflow-y-auto overflow-x-hidden">
				<FeelingSelector
					{selectedFeelings}
					onFeelingChange={handleFeelingChange}
					pointId="feelingsDetective"
					show={true}
				/>
			</div>
		</div>

		<LearnGotoNextButton
			onClick={submitFeelings}
			onPrev={() => {
				gotoPrevStep?.();
			}}
			disabled={selectedFeelings.length === 0}
			displayBackButton={true}>Weiter</LearnGotoNextButton
		>
	{:else if internalStep() === 4 && !aiSummary}
		<!-- Step 5: Generate Summary -->
		<div class="flex flex-grow items-center justify-center space-y-2">
			<h3 class="font-medium text-gray-900">
				Lass uns eine Zusammenfassung deiner Erkenntnisse erstellen.
			</h3>
		</div>

		{#if isLoading}
			<div class="flex items-center justify-center">
				<Loader2 class="size-6 animate-spin" />
				<span class="ml-2">Erstelle Zusammenfassung...</span>
			</div>
		{:else}
			<LearnGotoNextButton
				onClick={generateSummary}
				onPrev={() => {
					gotoPrevStep?.();
				}}
				displayBackButton={true}
			>
				Zusammenfassung erstellen
			</LearnGotoNextButton>
		{/if}
	{:else if internalStep() === 4 && aiSummary}
		<!-- Step 5: Display Summary -->
		<div class="flex flex-grow items-center justify-center space-y-2 rounded-lg p-6">
			<div class="prose prose-sm max-h-80 max-w-sm overflow-y-auto text-gray-700">
				{@html marked(aiSummary)}
			</div>
		</div>

		<LearnGotoNextButton
			onClick={() => {
				gotoNextStep?.();
			}}
			onPrev={() => {
				gotoPrevStep?.();
			}}
			displayBackButton={true}
		>
			Weiter
		</LearnGotoNextButton>
	{/if}
</div>
