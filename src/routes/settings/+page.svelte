<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import Settings from 'lucide-svelte/icons/settings';
	import { onMount } from 'svelte';
	import type { PageData, ActionData } from './$types';

	interface Props {
		data: PageData;
		form?: ActionData;
	}

	let { data, form }: Props = $props();
	
	let aiAnswerLength = $state('');
	let toneOfVoice = $state('');
	let nvcKnowledge = $state('');
	let isSubmitting = $state(false);

	// Auto-save function
	const savePreferences = async () => {
		if (isSubmitting) return;
		
		console.log('savePreferences called with:', { aiAnswerLength, toneOfVoice, nvcKnowledge });
		
		isSubmitting = true;
		
		const formData = new FormData();
		formData.append('aiAnswerLength', aiAnswerLength);
		formData.append('toneOfVoice', toneOfVoice);
		formData.append('nvcKnowledge', nvcKnowledge);

		try {
			console.log('Making POST request to ?/updatePreferences');
			const response = await fetch('?/updatePreferences', {
				method: 'POST',
				body: formData
			});

			console.log('Response status:', response.status);
			const result = await response.json();
			console.log('Response result:', result);
			
			if (result.type === 'success') {
				console.log('Settings saved successfully');
			}
		} catch (error) {
			console.error('Error saving settings:', error);
		} finally {
			isSubmitting = false;
		}
	};

	// Initialize values on mount
	onMount(() => {
		aiAnswerLength = data.preferences.aiAnswerLength || 'short';
		toneOfVoice = data.preferences.toneOfVoice || 'heartfelt';
		nvcKnowledge = data.preferences.nvcKnowledge || 'beginner';
	});


	const goBack = () => {
		window.history.back();
	};

	const answerLengthOptions = [
		{ value: 'short', label: 'Kurz', description: 'Prägnante, fokussierte Antworten' },
		{ value: 'medium', label: 'Mittel', description: 'Ausgewogene Antworten mit Details' },
		{ value: 'long', label: 'Lang', description: 'Ausführliche, detaillierte Antworten' }
	];

	const toneOptions = [
		{ value: 'heartfelt', label: 'Herzlich', description: 'Empathisch und unterstützend' },
		{ value: 'analytical', label: 'Analytisch', description: 'Sachlich und strukturiert' }
	];

	const knowledgeOptions = [
		{ value: 'beginner', label: 'Einsteiger', description: 'Grundlagen werden erklärt' },
		{ value: 'intermediate', label: 'Fortgeschritten', description: 'Einige GFK-Kenntnisse vorhanden' },
		{ value: 'advanced', label: 'Experte', description: 'Umfassende GFK-Kenntnisse' }
	];
</script>

<div class="min-h-screen bg-background">
	<div class="mx-auto max-w-2xl p-6">
		<!-- Header -->
		<div class="mb-4">
			<button
				onclick={goBack}
				class="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5 transition-colors"
			>
				<ChevronLeft class="size-4" /> Zurück
			</button>
			
			<div class="flex items-center gap-3">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Einstellungen</h1>
					<p class="text-gray-600">Personalisiere deine KI-Erfahrung</p>
				</div>
			</div>
		</div>

		<!-- Success/Error Messages -->
		{#if form?.success}
			<div class="mb-6 rounded-lg bg-teal-100 border border-teal-200 p-4">
				<p class="text-teal-800 text-sm font-medium">{form.message}</p>
			</div>
		{/if}

		{#if form?.error}
			<div class="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
				<p class="text-red-800 text-sm font-medium">{form.error}</p>
			</div>
		{/if}

		<!-- Settings Cards -->
		<div class="space-y-4">
			<!-- AI Answer Length -->
			<Card class="rounded-lg border border-white/30 bg-offwhite shadow-md shadow-black/5">
				<CardHeader>
					<CardTitle>Antwortlänge der KI</CardTitle>
					<CardDescription>
						Wähle, wie ausführlich die KI antworten soll
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Select.Root 
					type="single" 
					bind:value={aiAnswerLength}
					onValueChange={() => savePreferences()}
				>
						<Select.Trigger>
							{answerLengthOptions.find(opt => opt.value === aiAnswerLength)?.label || "Antwortlänge wählen"}
						</Select.Trigger>
						<Select.Content>
							{#each answerLengthOptions as option}
								<Select.Item value={option.value}>
									<div class="flex flex-col">
										<span class="font-medium">{option.label}</span>
										<span class="text-sm text-gray-500">{option.description}</span>
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</CardContent>
			</Card>

			<!-- Tone of Voice -->
			<Card class="rounded-lg border border-white/30 bg-offwhite shadow-md shadow-black/5">
				<CardHeader>
					<CardTitle>Gesprächston</CardTitle>
					<CardDescription>
						Wähle den bevorzugten Kommunikationsstil der KI
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Select.Root 
					type="single" 
					bind:value={toneOfVoice}
					onValueChange={() => savePreferences()}
				>
						<Select.Trigger>
							{toneOptions.find(opt => opt.value === toneOfVoice)?.label || "Gesprächston wählen"}
						</Select.Trigger>
						<Select.Content>
							{#each toneOptions as option}
								<Select.Item value={option.value}>
									<div class="flex flex-col">
										<span class="font-medium">{option.label}</span>
										<span class="text-sm text-gray-500">{option.description}</span>
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</CardContent>
			</Card>

			<!-- NVC Knowledge Level -->
			<Card class="rounded-lg border border-white/30 bg-offwhite shadow-md shadow-black/5">
				<CardHeader>
					<CardTitle>GFK-Kenntnisse</CardTitle>
					<CardDescription>
						Dein aktueller Wissensstand in Gewaltfreier Kommunikation
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Select.Root 
					type="single" 
					bind:value={nvcKnowledge}
					onValueChange={() => savePreferences()}
				>
						<Select.Trigger>
							{knowledgeOptions.find(opt => opt.value === nvcKnowledge)?.label || "Kenntnisstand wählen"}
						</Select.Trigger>
						<Select.Content>
							{#each knowledgeOptions as option}
								<Select.Item value={option.value}>
									<div class="flex flex-col">
										<span class="font-medium">{option.label}</span>
										<span class="text-sm text-gray-500">{option.description}</span>
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</CardContent>
			</Card>

		</div>
	</div>
</div>