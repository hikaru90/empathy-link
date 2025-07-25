<script lang="ts">
	import { marked } from 'marked';
	import AutoTextarea from '$lib/components/AutoTextarea.svelte';
	import type { LearningSession } from '$routes/bullshift/learn/[slug]/edit/schema';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import IconPaperPlane from '$assets/icons/icon-paper-plane.svg?raw';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import LearnSplashScreen from '$lib/components/bullshift/Learn/LearnSplashScreen.svelte';
	import { pb } from '$scripts/pocketbase';
	import { serializeNonPOJOs } from '$scripts/helpers';
	import { onMount } from 'svelte';

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
	let needsInput = $state('');
	let aiReflection = $state('');
	let aiSummary = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let responseTime = $state<number | null>(null);
	let splashDone = $state(false);
	let needsLookup = $state<Map<string, string>>(new Map());
	let needs = $state<any[]>([]);
	let needSelectorVisible = $state(false);
	let textareaRef: HTMLTextAreaElement | undefined = $state();
	let initialized = $state(false);

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
		
		console.log('Looking for existing response with:', {
			blockType: 'needsDetective',
			contentBlock: contentBlock,
			sessionResponses: session.responses
		});
		
		// Try multiple matching strategies
		const responses = session.responses.filter(r => r.blockType === 'needsDetective');
		
		if (responses.length === 0) {
			console.log('No needsDetective responses found in session');
			return null;
		}
		
		// Strategy 1: Find the most recent response with actual needsInput content
		const responsesWithNeeds = responses
			.filter(r => r.response?.needsInput && r.response.needsInput.trim())
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
		
		if (responsesWithNeeds.length > 0) {
			console.log('Found response with needsInput:', responsesWithNeeds[0]);
			return responsesWithNeeds[0];
		}
		
		// Strategy 2: Exact blockContent match
		const exactMatch = responses.find(r => 
			JSON.stringify(r.blockContent) === JSON.stringify(contentBlock)
		);
		
		if (exactMatch) {
			console.log('Found exact blockContent match');
			return exactMatch;
		}
		
		// Strategy 3: Use the most recent response
		const mostRecent = responses.sort(
			(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		)[0];
		console.log('Using most recent needsDetective response');
		return mostRecent;
	});

	// Initialize from existing response if available
	$effect(() => {
		// Don't initialize until we have session data
		if (!session) {
			console.log('Effect running - waiting for session data');
			return;
		}
		
		if (initialized) return; // Prevent re-initialization
		
		console.log('=== INITIALIZATION EFFECT ===');
		console.log('Session ID:', session?.id);
		console.log('Total responses in session:', session?.responses?.length);
		console.log('All needsDetective responses:', session.responses.filter(r => r.blockType === 'needsDetective'));
		console.log('existingResponse():', existingResponse());
		
		if (existingResponse()) {
			const response = existingResponse()?.response;
			console.log('Response data:', response);
			if (response) {
				// Use situationInput as the primary field, fall back to thoughtsInput if situationInput is empty
				situationInput = response.situationInput || response.thoughtsInput || '';
				thoughtsInput = response.thoughtsInput || response.situationInput || '';
				// Only set needsInput if it exists and has content, otherwise leave it as is
				if (response.needsInput !== undefined && response.needsInput !== null) {
					needsInput = response.needsInput;
				}
				aiReflection = response.aiReflection || '';
				aiSummary = response.aiSummary || '';
				console.log('After initialization - needsInput:', needsInput);
			}
		} else {
			console.log('No existing response found in session');
		}
		
		// Mark as initialized only after we've processed the session
		initialized = true;
	});

	// Initialize needs lookup and load needs
	$effect(() => {
		initNeedsLookup();
		getNeeds();
	});

	// Clear error message when user starts typing
	$effect(() => {
		if ((situationInput || thoughtsInput) && errorMessage) {
			errorMessage = '';
		}
	});




	const submitCombinedInput = async () => {
		if (!situationInput.trim() || isLoading) return;

		isLoading = true;
		errorMessage = '';
		const startTime = Date.now();

		try {
			const response = await fetch('/api/ai/learn/needsDetective', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					step: 'reflection',
					situation: situationInput.trim(),
					thoughts: situationInput.trim() // Use the same input for both since they're combined
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
				thoughtsInput: situationInput.trim(), // Store the combined input in both fields for compatibility
				needsInput,
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
				needsInput,
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

	const submitNeeds = async () => {
		console.log('=== submitNeeds called ===');
		console.log('Current needsInput value:', needsInput);
		console.log('needsInput length:', needsInput?.length);
		console.log('needsInput type:', typeof needsInput);
		
		if (isLoading) return;

		isLoading = true;
		errorMessage = '';

		try {
			// Update response data with needs textarea input
			const responseData = {
				situationInput,
				aiReflection,
				thoughtsInput,
				needsInput,
				aiSummary,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			};
			
			console.log('=== Saving response data ===');
			console.log('Response data needsInput:', responseData.needsInput);
			console.log('Full response data:', responseData);
			
			console.log('=== Calling onResponse ===');
			const result = onResponse(responseData);
			console.log('onResponse result:', result);

			gotoNextStep?.();
		} catch (error) {
			console.error('Error saving needs:', error);
			errorMessage = "Entschuldigung, ich konnte deine Bedürfnisse gerade nicht speichern. Bitte versuche es erneut.";
		} finally {
			isLoading = false;
		}
	};

	const generateSummary = async () => {
		try {
		if (isLoading) return;

		// Validate that we have the required data
		if (!situationInput.trim()) {
			throw 'Bitte vervollständige zuerst die Situationsbeschreibung';
		}
		
		if (!thoughtsInput.trim()) {
			throw 'Bitte vervollständige zuerst die Strategiebeschreibung';
		}

		// Check if user has provided needs
		const hasNeeds = needsInput.trim();
		if (!hasNeeds) {
			throw 'Bitte beschreibe zuerst deine Bedürfnisse';
		}

		isLoading = true;
		errorMessage = '';
		const startTime = Date.now();

			const needsForAPI = needsInput.trim();
			
			const requestData = {
				step: 'summary',
				situation: situationInput,
				thoughts: thoughtsInput,
				needs: needsForAPI
			};

			const response = await fetch('/api/ai/learn/needsDetective', {
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
				needsInput,
				aiSummary: data.response,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			});

			// Don't call gotoNextStep here - the summary should be displayed in the same step
		} catch (error) {
			console.error('Error generating summary:', error);
			errorMessage = "Entschuldigung, ich konnte die Zusammenfassung gerade nicht erstellen. Bitte versuche es erneut.";
		} finally {
			isLoading = false;
		}
	};

	const initNeedsLookup = async () => {
		try {
			const records = await pb.collection('needs').getFullList({
				sort: 'category,sort',
				requestKey: 'needsDetective'
			});
			const data = serializeNonPOJOs(records) as any[];
			const lookup = new Map<string, string>();
			if (data && Array.isArray(data)) {
				data.forEach(need => {
					if (need && need.id && need.nameDE) {
						lookup.set(need.id, need.nameDE);
					}
				});
			}
			needsLookup = lookup;
		} catch (error) {
			console.error('Error initializing needs lookup:', error);
			needsLookup = new Map();
		}
	};

	const getNeeds = async () => {
		needs = await pb.collection('needs').getFullList({
			sort: 'category,sort'
		});
	};

	const addText = (text: string) => {
		// Simple approach: just add text to the end with proper spacing
		let textToAdd = text;
		
		// Add space before if needed
		if (needsInput && needsInput[needsInput.length - 1] !== ' ') {
			textToAdd = ' ' + textToAdd;
		}
		
		// Add the text
		needsInput += textToAdd;
		
		// Try to focus the textarea if available
		setTimeout(() => {
			if (textareaRef && typeof textareaRef.focus === 'function') {
				textareaRef.focus();
			}
		}, 0);
	};

</script>

<LearnSplashScreen 
		color={color} 
		text="Zeit zu Üben"
		on:splashDone={() => {
			splashDone = true;
		}}
	/>

<div class="flex h-full flex-col justify-between space-y-4 rounded-lg backdrop-blur transition-all transform duration-1000 {splashContentClass()}">
	{#if internalStep() === 0}
		<!-- Step 1: Combined Situation and Thoughts Input -->
		<div class="flex flex-grow items-center justify-center space-y-2">
			<h3 class="max-w-xs font-medium text-gray-900 text-center">
				{content.question || 'Beschreibe eine Situation, die du erlebt hast und welche Strategie du verwendet hast, um die Situation zu bewältigen:'}
			</h3>
		</div>

		<div class="space-y-2">
			<div
				class="flex flex-col gap-2 rounded-2xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<AutoTextarea
					bind:value={situationInput}
					placeholder="Ich war bei dem letzten Familienbesuch etwas geladen und habe dann einfach das Thema gewechselt..."
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
						onclick={submitCombinedInput}
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
					{@html marked(aiReflection)} Stimmt diese Aussage?
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
		<!-- Step 3: Needs Input with integrated selector -->
		<div class="flex flex-grow items-center justify-center space-y-2">
			<h3 class="font-medium text-gray-900 max-w-xs">
				Welche Bedürfnisse hast Du Dir dadurch erfüllt?
			</h3>
		</div>

		<div class="space-y-2">
			<div
				class="flex flex-col gap-2 rounded-2xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<!-- Needs selector dropdown -->
				<div
					class="{needSelectorVisible
						? 'flex'
						: 'hidden'} max-h-40 flex-wrap gap-1 overflow-y-auto overscroll-contain"
				>
					{#each needs as need}
						<button
							type="button"
							onclick={() => addText(need.nameDE)}
							class="rounded-full border border-black/5 bg-white px-2 py-0.5 text-xs text-black active:bg-black/5"
						>
							{need.nameDE}
						</button>
					{/each}
				</div>

				<AutoTextarea
					bind:this={textareaRef}
					bind:value={needsInput}
					placeholder="Sicherheit, Verständnis, Autonomie..."
					class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
				/>

				<div class="flex items-end justify-between">
					<div class="flex items-center gap-2">
						<button
							type="button"
							onclick={() => {
								needSelectorVisible = !needSelectorVisible;
							}}
							style="{needSelectorVisible
								? ''
								: 'box-shadow: -2px -2px 5px 0px rgba(255, 255, 255, 0.8), 2px 2px 8px 0px rgba(0, 0, 0, 0.1);'}"
							class="flex items-center gap-1 rounded-full pl-1 pr-2 py-1 text-xs {needSelectorVisible
								? 'text-black shadow-inner bg-black/10'
								: 'text-black/60 bg-white'}"
						>
							<div class="w-[1.2em] rounded-full p-[0.1em] {needSelectorVisible
								? 'bg-black fill-white/80'
								: 'bg-black/10 fill-black/60'}">
								{@html IconSwirl}
							</div>
							Bedürfnisse
						</button>
					</div>
					<button
						onclick={submitNeeds}
						disabled={isLoading}
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
	{:else if internalStep() === 3 && !aiSummary}
		<!-- Step 4: Generate Summary -->
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
			<LearnGotoNextButton onClick={generateSummary}>
				Zusammenfassung erstellen
			</LearnGotoNextButton>
		{/if}
	{:else if internalStep() === 3 && aiSummary}
		<!-- Step 4: Display Summary -->
		<div class="flex flex-grow items-center justify-center space-y-2 rounded-lg p-6">
			<div class="prose prose-sm max-w-sm overflow-y-auto text-gray-700 max-h-80">
				{@html marked(aiSummary)}
			</div>
		</div>

		<LearnGotoNextButton
			onClick={() => {
				gotoNextStep?.();
			}}
		>
			Weiter
		</LearnGotoNextButton>
	{/if}
</div>