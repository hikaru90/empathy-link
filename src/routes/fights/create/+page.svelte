<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import {
		type SuperValidated,
		type Infer,
		defaults,
		superForm
	} from 'sveltekit-superforms';
	import FormStepper from '$lib/components/FormStepper.svelte';
	import FormStepDisplay from '$lib/components/FormStepDisplay.svelte';
	import { t } from '$lib/translations';
	import { get } from 'svelte/store';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import {
		schemaStep1,
		schemaStep2,
		schemaStep3,
		schemaStep4,
		schemaStep5 as lastStep
	} from './schema';
	import IconFolder from '$assets/icons/icon-folder.svg?raw';
	import IconEye from '$assets/icons/icon-eye.svg?raw';
	import IconHeart from '$assets/icons/icon-heart.svg?raw';
	import IconSwirl from '$assets/icons/icon-swirl.svg?raw';
	import IconSteps from '$assets/icons/icon-steps.svg?raw';

	const data: SuperValidated<Infer<FormSchema>> = defaults(zod(lastStep));

	const steps = [
		zod(schemaStep1),
		zod(schemaStep2),
		zod(schemaStep3),
		zod(schemaStep4),
		zod(lastStep)
	];
	let step = 1;

	$: options.validators = steps[step - 1];

	// const handleSubmit = (formData) => {
	// 	console.log('form submitted', formData);
	// }

	const checkValidationAndContinue = async () => {
		const validationResult = await validateForm($formData, lastStep);
		if (!validationResult.valid) {
			errors.set(validationResult.errors);
			return;
		}
		step++;
	};

	const form = superForm(data, {
		// SPA: true,
		resetForm: false,
		validators: zodClient(lastStep),
		async onSubmit({ validators, cancel }) {
			console.log('onSubmit');
			// If on last step, make a normal request
			if (step == steps.length) return;
			else cancel();

			// Make a manual client-side validation, since we have cancelled
			if (step === 1) checkValidationAndContinue() 
			else if (step === 2) checkValidationAndContinue()
			else if (step === 3) checkValidationAndContinue()
			else if (step === 4) checkValidationAndContinue()
		},
		async onUpdated({ form }) {
			console.log('onUpdated');
			if (form.valid) step = 1;
		}
	});

	const { form: formData, errors, message, enhance, validateForm, options, updateForm } = form;

	formData.subscribe((value) => {
		console.log('form was updated', value);
	});

	let stepConstructor = [
		{
			slug: 'info',
			name: get(t)('default.page.fights.form.general.steps.info'),
			icon: IconFolder,
			invertedTextColor: false
		},
		{
			slug: 'observation',
			name: get(t)('default.page.fights.form.general.steps.observation'),
			icon: IconEye,
			invertedTextColor: true
		},
		{
			slug: 'feelings',
			name: get(t)('default.page.fights.form.general.steps.feelings'),
			icon: IconHeart,
			invertedTextColor: false
		},
		{
			slug: 'needs',
			name: get(t)('default.page.fights.form.general.steps.needs'),
			icon: IconSwirl,
			invertedTextColor: false
		},
		{
			slug: 'request',
			name: get(t)('default.page.fights.form.general.steps.request'),
			icon: IconSteps,
			invertedTextColor: false
		}
	];

	t.subscribe((value) => {
		const newSteps = stepConstructor.map((entry) => {
			const translation = value(`default.page.fights.form.general.steps.${entry.slug}`);
			entry.name = translation;
			return entry;
		});
		stepConstructor = [...newSteps];
	});

	const decreaseStep = () => {
		console.log('decreaseStep');
		if (step > 1) {
			console.log('step', step);
			step = step - 1;
			console.log('step', step);
		}
	};
</script>

<!-- {#if $message}
	<div class="status" class:error={$page.status >= 400} class:success={$page.status == 200}>
		{$message}
	</div>
{/if} -->
<div
	class="flex flex-grow flex-col justify-between {`bg-${stepConstructor[step - 1].slug}-background`}"
>
	<div class="max-container relative flex h-dvh flex-grow flex-col">
		<Menu />
		<form method="POST" use:enhance class="flex h-full flex-grow flex-col pb-[74px] pt-1">
			<div class="flex justify-center">
				<FormStepDisplay {step} steps={stepConstructor} />
			</div>
			{#key step}
				{#if step === 1}
					<div class="flex-grow overflow-y-auto">
						<Form.Field {form} name="name">
							<Form.Control let:attrs>
								<Form.Label>{$t('default.page.fights.form.name.label')}</Form.Label>
								<Input {...attrs} bind:value={$formData.name} />
							</Form.Control>
							<!-- <Form.Description>This is your public display name.</Form.Description> -->
							<Form.FieldErrors />
						</Form.Field>
					</div>
				{:else if step === 2}
					<div class="flex-grow overflow-y-auto">
						<Form.Field {form} name="feelings">
							<Form.Control let:attrs>
								<Form.Label>{$t('default.page.fights.form.feelings.label')}</Form.Label>
								<ToggleGroup.Root type="multiple" {...attrs} bind:value={$formData.feelings}>
									<ToggleGroup.Item value="a">A</ToggleGroup.Item>
									<ToggleGroup.Item value="b">B</ToggleGroup.Item>
									<ToggleGroup.Item value="c">C</ToggleGroup.Item>
								</ToggleGroup.Root>
							</Form.Control>
							<!-- <Form.Description>This is your public display name.</Form.Description> -->
							<Form.FieldErrors />
						</Form.Field>
					</div>
				{:else if step === 3}
					<div class="flex-grow overflow-y-auto">
						<label>
							lastName<br />
							<input name="lastName" bind:value={$formData.lastName} />
						</label>
					</div>
				{:else if step === 4}
					<div class="flex-grow overflow-y-auto">
						<label>
							haha<br />
							<input name="haha" bind:value={$formData.haha} />
						</label>
					</div>
				{:else}
					<div class="flex-grow overflow-y-auto">
						<label>
							hoho<br />
							<input name="hoho" bind:value={$formData.hoho} />
						</label>
					</div>
				{/if}
			{/key}
			<FormStepper
				{step}
				on:toPrev={decreaseStep}
				class="{`bg-${stepConstructor[step - 1].slug}-background`} flex-shrink-0"
			/>
		</form>
	</div>
</div>
