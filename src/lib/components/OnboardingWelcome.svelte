<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { goto } from '$app/navigation';

	interface Props {
		onComplete?: () => void;
	}

	let { onComplete }: Props = $props();

	let currentStep = $state(0);
	
	const steps = [
		{
			title: 'Willkommen bei Empathie-Link',
			content: `Schön, dass du hier bist! Empathie-Link hilft dir dabei, dich mit dir selbst und anderen Menschen zu verbinden - auch in schwierigen Momenten.`,
			icon: '👋'
		},
		{
			title: 'Was ist Gewaltfreie Kommunikation?',
			content: `Gewaltfreie Kommunikation (GFK) nach Marshall Rosenberg ist eine Art zu sprechen und zuzuhören, die Empathie und ehrlichen Ausdruck fördert. Sie hilft uns, Konflikte friedlich zu lösen und tiefere Verbindungen aufzubauen.`,
			icon: '💝'
		},
		{
			title: 'Die 4 Schritte der GFK',
			content: `
				<div class="space-y-4">
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">1</div>
						<div>
							<h4 class="font-semibold text-gray-900">Beobachten</h4>
							<p class="text-gray-600 text-sm">Beschreibe objektiv, was du wahrnimmst, ohne zu bewerten oder zu urteilen.</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">2</div>
						<div>
							<h4 class="font-semibold text-gray-900">Fühlen</h4>
							<p class="text-gray-600 text-sm">Teile mit, welche Emotionen durch die Beobachtung ausgelöst wurden.</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">3</div>
						<div>
							<h4 class="font-semibold text-gray-900">Bedürfnisse erkennen</h4>
							<p class="text-gray-600 text-sm">Identifiziere die dahinterliegenden Bedürfnisse, die deine Gefühle verursachen.</p>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">4</div>
						<div>
							<h4 class="font-semibold text-gray-900">Bitten</h4>
							<p class="text-gray-600 text-sm">Formuliere eine konkrete, erfüllbare Bitte, die zur Erfüllung deiner Bedürfnisse beiträgt.</p>
						</div>
					</div>
				</div>
			`,
			icon: '🪜'
		},
		{
			title: 'Deine Empathie-Reise beginnt',
			content: `Mit Empathie-Link kannst du:
				<ul class="list-disc list-inside space-y-2 mt-4 text-gray-700">
					<li><strong>Selbstempathie</strong> praktizieren und dich besser verstehen</li>
					<li><strong>Konflikte</strong> empathisch und konstruktiv lösen</li>
					<li><strong>Lernen</strong> und deine GFK-Fähigkeiten vertiefen</li>
					<li><strong>Verbindungen</strong> zu anderen Menschen stärken</li>
				</ul>`,
			icon: '🌱'
		},
		{
			title: 'Bereit loszulegen?',
			content: `Du bist jetzt bereit, Empathie-Link zu erkunden! Beginne mit dem Dashboard, um einen Überblick über deine Reise zu bekommen, oder starte direkt mit einer Selbstempathie-Session.`,
			icon: '🚀'
		}
	];

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			completeOnboarding();
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	function completeOnboarding() {
		if (onComplete) {
			onComplete();
		} else {
			goto('/app/dashboard');
		}
	}

	function skipOnboarding() {
		completeOnboarding();
	}
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
	<Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
		<CardHeader class="text-center">
			<div class="text-4xl mb-2">{steps[currentStep].icon}</div>
			<CardTitle class="text-xl font-semibold text-gray-900">
				{steps[currentStep].title}
			</CardTitle>
		</CardHeader>
		
		<CardContent class="space-y-6">
			<div class="text-gray-700 leading-relaxed">
				{@html steps[currentStep].content}
			</div>

			<!-- Progress indicator -->
			<div class="flex justify-center space-x-2">
				{#each steps as _, index}
					<div 
						class="w-2 h-2 rounded-full transition-colors {index === currentStep ? 'bg-blue-600' : index < currentStep ? 'bg-blue-300' : 'bg-gray-300'}"
					></div>
				{/each}
			</div>

			<!-- Navigation buttons -->
			<div class="flex justify-between items-center pt-4">
				<div>
					{#if currentStep > 0}
						<Button variant="outline" onclick={prevStep}>
							Zurück
						</Button>
					{:else}
						<Button variant="ghost" onclick={skipOnboarding} class="text-gray-500">
							Überspringen
						</Button>
					{/if}
				</div>

				<div class="text-sm text-gray-500">
					{currentStep + 1} von {steps.length}
				</div>

				<div>
					{#if currentStep < steps.length - 1}
						<Button onclick={nextStep}>
							Weiter
						</Button>
					{:else}
						<Button onclick={completeOnboarding} class="bg-blue-600 hover:bg-blue-700">
							Los geht's!
						</Button>
					{/if}
				</div>
			</div>
		</CardContent>
	</Card>
</div>