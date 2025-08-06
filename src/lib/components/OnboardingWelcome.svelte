<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { goto } from '$app/navigation';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import { marked } from 'marked';

	interface Props {
		onComplete?: () => void;
	}

	let { onComplete }: Props = $props();

	let currentStep = $state(0);

	const steps = [
		{
			title: 'Willkommen bei Empathy Link',
			content: `Schön, dass du hier bist! Empathie-Link hilft dir dabei, dich mit dir selbst und anderen Menschen zu verbinden - auch in schwierigen Momenten.`,
			icon: '👋',
			image: 'welcomeColor.svg'
		},
		{
			title: 'Was ist Gewaltfreie Kommunikation?',
			content: `Gewaltfreie Kommunikation (GFK) nach Marshall Rosenberg ist eine Art zu sprechen und zuzuhören, die Empathie und ehrlichen Ausdruck fördert. Sie hilft uns, Konflikte friedlich zu lösen und tiefere Verbindungen aufzubauen.`,
			icon: '💝'
		},
		{
			title: 'Die 4 Schritte der GFK',
			content: `
- **Beobachten**
Beschreibe objektiv, was du wahrnimmst, ohne zu bewerten oder zu urteilen.

- **Fühlen**
Teile mit, welche Emotionen durch die Beobachtung ausgelöst wurden.

- **Bedürfnisse erkennen**
Identifiziere die dahinterliegenden Bedürfnisse, die deine Gefühle verursachen.

- **Bitten**
Formuliere eine konkrete, erfüllbare Bitte, die zur Erfüllung deiner Bedürfnisse beiträgt.
			`,
			icon: '🪜'
		},
		{
			title: 'Deine Empathie-Reise beginnt',
			content: `Mit Empathie-Link kannst du:

- **Selbstempathie** praktizieren und dich besser verstehen
- **Konflikte** empathisch und konstruktiv lösen
- **Lernen** und deine GFK-Fähigkeiten vertiefen
- **Verbindungen** zu anderen Menschen stärken`,
			icon: '🌱'
		},
		{
			title: 'Bereit loszulegen?',
			content: `Du bist jetzt bereit, Empathie-Link zu erkunden! Beginne mit dem Dashboard, um einen Überblick über deine Reise zu bekommen, oder starte direkt mit einer Selbstempathie-Session.`,
			icon: '🚀'
		}
	];
	const formattedSteps = steps.map((step, index) => {
		return {
			component: 'onboarding',
			stepCount: 1
		};
	});
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
			goto('/bullshift');
		}
	}
	function skipOnboarding() {
		console.log('skipOnboarding');
		completeOnboarding();
	}
</script>

<div class="fixed inset-0 z-[1000] flex flex-col justify-between bg-offwhite p-6">
	<div class="flex justify-center">
		<LearnStepIndicator
			topic="onboarding"
			totalSteps={formattedSteps}
			totalStepsCount={steps.length}
			{currentStep}
			currentCategory={() => 'onboarding'}
			onPrevStep={() => prevStep()}
			onNextStep={() => nextStep()}
			class="w-32"
		/>
	</div>

	<div class="flex max-w-sm flex-col gap-4">
		<img src={`/diagrams/${steps[currentStep].image}`} alt={steps[currentStep].title} class="h-40" />
		<h3 class="font-bold">
			{steps[currentStep].title}
		</h3>

		<div class="marked flex flex-col gap-2">
			{@html marked(steps[currentStep].content)}
		</div>
	</div>

	<LearnGotoNextButton
		onClick={() => {
			nextStep?.();
		}}
		displaySkipButton={true}
		onSkip={() => {
			skipOnboarding();
		}}
	>
		Weiter
	</LearnGotoNextButton>
</div>
