<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { goto } from '$app/navigation';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import { marked } from 'marked';
	import Gradient from '$lib/components/Gradient.svelte';

	interface Props {
		onComplete?: () => void;
	}

	let { onComplete }: Props = $props();

	let currentStep = $state(0);

	const steps = [
		{
			title: 'Schön, dass du hier bist!',
			content: `Empathie-Link hilft dir dabei, dich mit dir selbst und anderen Menschen zu verbinden - auch in schwierigen Momenten. 
			`,
			image: 1
		},
		{
			title: 'Was ist Gewaltfreie Kommunikation?',
			content: `Gewaltfreie Kommunikation (GFK) nach Marshall Rosenberg ist eine Art zu sprechen und zuzuhören, die Empathie und ehrlichen Ausdruck fördert. Sie hilft uns, Konflikte friedlich zu lösen und tiefere Verbindungen aufzubauen.`,
			image: 5
		},
		{
			title: 'Die 4 Schritte der GFK',
			content: `
- **Beobachten**
Beschreibe objektiv, ohne zu bewerten oder zu urteilen.

- **Fühlen**
Teile mit, welche Emotionen durch die Beobachtung ausgelöst wurden.

- **Bedürfnisse erkennen**
Identifiziere die dahinterliegenden Bedürfnisse, die deine Gefühle verursachen.

- **Bitten**
Formuliere eine konkrete, erfüllbare Bitte, die zur Erfüllung deiner Bedürfnisse beiträgt.
			`,
			image: 3
		},
		{
			title: 'Deine Empathie-Reise beginnt',
			content: `Mit Empathie-Link kannst du:

- **Selbstempathie** praktizieren und dich besser verstehen
- **Konflikte** empathisch und konstruktiv lösen
- **Lernen** und deine GFK-Fähigkeiten vertiefen
- **Verbindungen** zu anderen Menschen stärken`,
			image: 6
		},
		{
			title: 'Bereit loszulegen?',
			content: `Du bist jetzt bereit, Empathie-Link zu erkunden! Beginne mit dem Dashboard, um einen Überblick über deine Reise zu bekommen, oder starte direkt mit einer Selbstempathie-Session.`,
			image: 7
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

<div class="fixed left-0 top-0 z-[1000] flex h-screen w-full flex-col bg-offwhite p-6">
	<!-- Scrollable content area -->
	<div class="flex flex-1 flex-col gap-6 overflow-hidden">
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

		<div class="flex w-full items-center justify-center">
			<Gradient class="size-40" shape={steps[currentStep].image} blur={true} />
		</div>
		
		<!-- Scrollable text content -->
		<div class="flex flex-1 flex-col gap-4 overflow-y-auto">
			<h3 class="max-w-[12em] text-2xl font-light">
				{steps[currentStep].title}
			</h3>
			<div class="marked flex flex-col gap-2">
				{@html marked(steps[currentStep].content)}
			</div>
		</div>
	</div>

	<!-- Fixed buttons at bottom -->
	<div class="flex flex-col gap-4 pt-4">
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
</div>
