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
	let selectedNeeds = $state<string[]>([]);
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
				r.blockType === 'needsDetective' &&
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
				needsInput = response.needsInput || ''; // New field for textarea input
				selectedNeeds = response.selectedNeeds || [];
				aiReflection = response.aiReflection || '';
				aiSummary = response.aiSummary || '';
			}
		}
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

	const submitSituation = async () => {
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
				selectedNeeds,
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
				selectedNeeds,
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
		if (isLoading) return;

		isLoading = true;
		errorMessage = '';

		try {
			// Update response data with needs textarea input
			const responseData = {
				situationInput,
				aiReflection,
				thoughtsInput,
				needsInput: needsInput.trim(),
				selectedNeeds: [...selectedNeeds],
				aiSummary,
				timestamp: new Date().toISOString(),
				responseTime: responseTime
			};
			onResponse(responseData);

			gotoNextStep?.();
		} catch (error) {
			console.error('Error saving needs:', error);
			errorMessage = "Entschuldigung, ich konnte deine Bedürfnisse gerade nicht speichern. Bitte versuche es erneut.";
		} finally {
			isLoading = false;
		}
	};

	const generateSummary = async () => {
		console.log('generateSummary called', { 
			isLoading, 
			situationInput: situationInput.trim(), 
			thoughtsInput: thoughtsInput.trim(), 
			needsInput: needsInput.trim()
		});
		
		if (isLoading) return;

		// Validate that we have the required data
		if (!situationInput.trim()) {
			errorMessage = 'Bitte vervollständige zuerst die Situationsbeschreibung';
			return;
		}
		
		if (!thoughtsInput.trim()) {
			errorMessage = 'Bitte vervollständige zuerst die Strategiebeschreibung';
			return;
		}

		if (!needsInput.trim()) {
			errorMessage = 'Bitte beschreibe zuerst deine Bedürfnisse';
			return;
		}

		isLoading = true;
		errorMessage = '';
		const startTime = Date.now();

		try {
			const requestData = {
				step: 'summary',
				situation: situationInput,
				thoughts: thoughtsInput,
				needs: needsInput // Use the textarea input directly
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
				selectedNeeds,
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

	const handleNeedChange = (needs: string[]) => {
		selectedNeeds = needs;
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
					placeholder="Ich war bei dem letzten Familienbesuch etwas geladen..."
					class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none max-w-xs"
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
		<!-- Step 3: Thoughts and Judgments Input -->
		<div class="flex flex-grow items-center justify-center space-y-2">
			<h3 class="font-medium text-gray-900 max-w-xs">
				Welche Strategie hast du verwendet, um die Situation zu bewältigen?
			</h3>
		</div>

		<div class="space-y-2">
			<div
				class="flex flex-col gap-2 rounded-2xl border border-white bg-gradient-to-b from-white to-offwhite p-2 shadow-[0_5px_20px_0_rgba(0,0,0,0.1)]"
			>
				<AutoTextarea
					bind:value={thoughtsInput}
					placeholder="Ich habe mit niemandem so richtig geredet..."
					class="flex-grow rounded-md bg-transparent px-2 py-1 outline-none"
				/>

				<div class="flex items-end justify-end">
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
		<!-- Step 4: Needs Input with integrated selector -->
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
			<LearnGotoNextButton onClick={generateSummary}>
				Zusammenfassung erstellen
			</LearnGotoNextButton>
		{/if}
	{:else if internalStep() === 4 && aiSummary}
		<!-- Step 5: Display Summary -->
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