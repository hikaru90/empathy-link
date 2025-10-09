<script lang="ts">
	import { Button } from '$lib/components/ui/button-op1';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { goto } from '$app/navigation';
	import LearnStepIndicator from '$lib/components/bullshift/Learn/LearnStepIndicator.svelte';
	import LearnGotoNextButton from '$lib/components/bullshift/Learn/LearnGotoNextButton.svelte';
	import UserGoal from '$lib/components/UserGoal.svelte';
	import { marked } from 'marked';
	import Gradient from '$lib/components/Gradient.svelte';

	interface Props {
		onComplete?: () => void;
		user?: App.User;
	}

	let { onComplete, user }: Props = $props();

	let currentStep = $state(0);

	const steps = [
		{
			title: 'Willkommen bei Empathy-Link',
			content: `Schön, dass du hier bist. Wir unterstützen dich dabei, klarer und empathischer zu kommunizieren, um dich selbst und andere besser zu verstehen. 
			`,
			image: 100
		},
		{
			title: 'Was möchtest du mit Empathy-Link erreichen?',
			content: '',
			component: 'userGoal'
		},
		{
			title: 'Empathie lohnt sich',
			content: `Eine Harvard-Studie zeigt: Enge, positive Beziehungen sind einer der wichtigsten Faktoren für Gesundheit, Wohlbefinden und Lebenszufriedenheit – wichtiger als Erfolg, Einkommen oder Status. Gute Verbindung zu anderen bedeutet ein gutes Leben.`,
			image: 5
		},
		{
			title: 'Spür mal rein',
			content: `Weitere Studien zeigen, wenn wir unsere Gefühle benennen, entsteht mehr Klarheit. Wir verstehen uns selbst besser – Irritationen werden greifbar, und wir reagieren weniger impulsiv. Das hilft uns, bewusster und gelassener zu handeln.`,
			image: 3
		},
		{
			title: ' Deine Gespräche gehören dir!',
			content: `Dein persönlicher Coach wird von KI unterstützt. Sie hilft dir, deine Gefühle, Bedürfnisse und Muster zu reflektieren.
			Alle Daten sind sicher verschlüsselt, nur für dich sichtbar und nicht zurückverfolgbar.`,
			image: 6
		},
		{
			title: 'Deine Empathie-Reise kann starten!',
			content: `Danke, dass du dir Zeit genommen hast. Dein Coach ist jetzt für dich da – lass uns gemeinsam beginnen.`,
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

<div class="fixed left-0 top-0 z-[1000] flex h-svh w-full flex-col bg-offwhite p-6 overflow-x-hidden overflow-y-auto">
	<!-- Scrollable content area -->
	<div class="flex flex-1 flex-col gap-6">
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

		<div class="-my-4 flex w-full items-center justify-center">
			<Gradient class="size-48" shape={steps[currentStep].image} blur={true} />
		</div>

		<!-- Scrollable text content -->
		<div class="flex flex-1 flex-col gap-4">
			<h3 class="max-w-[12em] text-2xl font-light">
				{steps[currentStep].title}
			</h3>
			{#if steps[currentStep].component}
				{#if steps[currentStep].component === 'userGoal'}
				<UserGoal {user} />
				{/if}
			{:else}
				<div class="marked flex flex-col gap-2">
					{@html marked(steps[currentStep].content)}
				</div>
			{/if}
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
