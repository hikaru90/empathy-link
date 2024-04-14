<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import FormStepper from '$lib/components/FormStepper.svelte';
	import FormStepDisplay from '$lib/components/FormStepDisplay.svelte';
	import type { PageData } from './$types.js';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { t } from '$lib/translations';
	import { get } from 'svelte/store';
	import { Button as SparkleButton } from '$lib/components/ui/button-sparkle';
	import { Plus } from 'radix-icons-svelte';
	export let data: PageData;
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { schemaStep1, schemaStep2, schemaStep3, schemaStep4, schemaStep5 } from './schema';
	import IconFolder from "$assets/icons/icon-folder.svg?raw";
	import IconEye from "$assets/icons/icon-eye.svg?raw";
	import IconHeart from "$assets/icons/icon-heart.svg?raw";
	import IconSwirl from "$assets/icons/icon-swirl.svg?raw";
	import IconSteps from "$assets/icons/icon-steps.svg?raw";

	const steps = [zod(schemaStep1), zod(schemaStep2), zod(schemaStep3), zod(schemaStep4), zod(schemaStep5)];
	let step = 1;

	const getValidators = () => {
		const value = steps[step - 1]
		console.log('value', value);
		return value
	}
	
	$: options.validators = getValidators()
	
	const { form, errors, message, enhance, validateForm, options } = superForm(data.form, {
		// No need for hidden fields with dataType: 'json'
		dataType: 'json',
		async onSubmit({ cancel }) {
			console.log('onSubmit');
			// If on last step, make a normal request
			if (step == steps.length) return;
			else cancel();

			// Make a manual client-side validation, since we have cancelled
			const result = await validateForm({ update: true });
			if (result.valid) step = step + 1;
		},

		async onUpdated({ form }) {
			if (form.valid) step = 1;
		}
	});

	let stepConstructor = [
		{
			slug: 'info',
			name: get(t)('default.page.fights.form.steps.info'),
			icon: IconFolder,
			invertedTextColor: false
		},
		{
			slug: 'observation',
			name: get(t)('default.page.fights.form.steps.observation'),
			icon: IconEye,
			invertedTextColor: true
		},
		{
			slug: 'feelings',
			name: get(t)('default.page.fights.form.steps.feelings'),
			icon: IconHeart,
			invertedTextColor: false
		},
		{
			slug: 'needs',
			name: get(t)('default.page.fights.form.steps.needs'),
			icon: IconSwirl,
			invertedTextColor: false
		},
		{
			slug: 'request',
			name: get(t)('default.page.fights.form.steps.request'),
			icon: IconSteps,
			invertedTextColor: false
		}
	];

	t.subscribe((value) => {
		const newSteps = stepConstructor.map((entry) => {
			const translation = value(`default.page.fights.form.steps.${entry.slug}`);
			entry.name = translation;
			return entry;
		});
		stepConstructor = [...newSteps];
	});



	const decreaseStep = () => {
			if (step > 1) {
				console.log('step',step);
				step = step -1;
				console.log('step',step);
			}
	};
</script>

<!-- {#if $message}
	<div class="status" class:error={$page.status >= 400} class:success={$page.status == 200}>
		{$message}
	</div>
{/if} -->

<div class="flex flex-grow flex-col justify-between {`bg-${stepConstructor[step-1].slug}-background`}">
	<div class="max-container flex h-dvh flex-grow flex-col relative">
		<Menu />
		<form method="POST" use:enhance class="flex flex-grow flex-col h-full pt-1 pb-[74px]">
			<div class="flex justify-center">
				<FormStepDisplay step={step} steps={stepConstructor} />
			</div>
			{#key step}
			{#if step === 1}
				<div class="flex-grow overflow-y-auto">
					<label>
						Name<br />
						<input
							name="name"
							aria-invalid={$errors.name ? 'true' : undefined}
							bind:value={$form.name}
						/>
						{#if $errors.name}<span class="invalid">{$errors.name}</span>{/if}
					</label>
				</div>
			{:else if step === 2}
			<div class="flex-grow overflow-y-auto">
				<label>
					firstName<br />
					<input
						name="firstName"
						aria-invalid={$errors.firstName ? 'true' : undefined}
						bind:value={$form.firstName}
					/>
					{#if $errors.firstName}<span class="invalid">{$errors.firstName}</span>{/if}
				</label>
			</div>
			{:else if step === 3}
			<div class="flex-grow overflow-y-auto">
				<label>
					lastName<br />
					<input
						name="lastName"
						aria-invalid={$errors.lastName ? 'true' : undefined}
						bind:value={$form.lastName}
					/>
					{#if $errors.lastName}<span class="invalid">{$errors.lastName}</span>{/if}
				</label>
			</div>
			{:else if step === 4}
			<div class="flex-grow overflow-y-auto">
				<label>
					haha<br />
					<input
						name="haha"
						aria-invalid={$errors.haha ? 'true' : undefined}
						bind:value={$form.haha}
					/>
					{#if $errors.haha}<span class="invalid">{$errors.haha}</span>{/if}
				</label>
			</div>
			{:else}
			<div class="flex-grow overflow-y-auto">
				<label>
					hoho<br />
					<input
						name="hoho"
						aria-invalid={$errors.hoho ? 'true' : undefined}
						bind:value={$form.hoho}
					/>
					{#if $errors.hoho}<span class="invalid">{$errors.hoho}</span>{/if}
				</label>
			</div>
			{/if}
			{/key}
			<FormStepper {step} on:toPrev={decreaseStep} class="{`bg-${stepConstructor[step-1].slug}-background`} flex-shrink-0" />
		</form>
	</div>
</div>
