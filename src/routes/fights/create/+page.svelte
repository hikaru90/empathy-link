<script lang="ts">
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { type SuperValidated, type Infer, defaults, superForm } from 'sveltekit-superforms';
	import FormStepper from '$lib/components/FormStepper.svelte';
	import FormStepDisplay from '$lib/components/FormStepDisplay.svelte';
	import { t, locale } from '$lib/translations';
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
	import { pb } from '$scripts/pocketbase';
	import { onMount } from 'svelte';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import { Textarea } from '$lib/components/ui/textarea';
	import Mascot from '$lib/components/Mascot.svelte';
	import { user } from '$store/auth';

	const data: SuperValidated<Infer<FormSchema>> = defaults(zod(lastStep));
	let feelings = [];
	let needs = [];

	const steps = [
		zod(schemaStep1),
		zod(schemaStep2),
		zod(schemaStep3),
		zod(schemaStep4),
		zod(lastStep)
	];
	let step = 1;
	let formSubmitted = false;
	let formSuccess = false;

	$: options.validators = steps[step - 1];

	const handleSubmit = async () => {
		try {
			let data = $formData;
			data.owner = $user.id;
			console.log('submit form', data);
			const record = await pb.collection('fights').create(data);
			formSuccess = true;
			formSubmitted = true;
		} catch (err) {
			console.log('error handling submit', err);
			formSuccess = false;
			formSubmitted = true;
		}
	};

	const checkSingleValidationStep = async (step: number) => {
		const validations = [schemaStep1, schemaStep2, schemaStep3, schemaStep4, lastStep];
		const constraints = Object.keys(zod(validations[step - 1]).constraints);
		let allFieldsValid = true;

		for (const constraint of constraints) {
			const res = await validate(constraint, { update: false });
			if (res) allFieldsValid = false;
		}

		if (!allFieldsValid) {
			// errors.set(validationResult.errors);
			return false;
		}
		return true;
	};
	const checkValidation = async () => {
		const validationResult = await validateForm($formData, lastStep);
		if (!validationResult.valid) {
			errors.set(validationResult.errors);
			return false;
		}
		return true;
	};

	const form = superForm(data, {
		// SPA: true,
		resetForm: false,
		validators: zodClient(lastStep),
		async onSubmit({ validators, cancel }) {
			console.log('onSubmit');

			cancel();
			// Make a manual client-side validation, since we have cancelled
			if (await checkValidation()) {
				if (step == steps.length) handleSubmit();
				else step++;
			}
		},
		async onUpdated({ form }) {
			console.log('onUpdated');
			if (form.valid) step = 1;
		}
	});

	const {
		form: formData,
		errors,
		message,
		enhance,
		validate,
		validateForm,
		options,
		updateForm
	} = form;

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
	const initFeelings = async () => {
		const records = await pb.collection('feelings').getFullList({
			sort: 'category'
		});
		const data = serializeNonPOJOs(records);
		let res = groupBy(data, 'positive');
		res.map((entry) => {
			entry.content = groupBy(entry.content, 'category');
			entry.content.map((category) => (category.visible = false));
			return entry;
		});
		console.log('res', res);
		feelings = res;
	};
	const initNeeds = async () => {
		const records = await pb.collection('needs').getFullList({
			sort: 'category'
		});
		const data = serializeNonPOJOs(records);
		let res = groupBy(data, 'category');
		res.map((category) => (category.visible = false));

		console.log('res', res);
		needs = res;
	};

	const changeStep = async (payload) => {
		console.log('changeStep');
		const newStep: number = payload.detail.step;
		const targetStepIsValid = await checkSingleValidationStep(newStep);
		console.log('targetStepIsValid', targetStepIsValid);
		if (targetStepIsValid) {
			step = newStep;
		}
	};

	const toggleNeedsCatgeory = (feeling, category: string) => {
		if (feeling.nameEN !== category) return;
		const target = needs.find((entry) => entry.category === category);
		if (target) target.visible = !target.visible;
		needs = [...needs];
	};

	const toggleFeelingsCatgeory = (feeling, category: string) => {
		if (feeling.nameEN !== category) return;
		const target0 = feelings[0].content.find((entry) => entry.category === category);
		const target1 = feelings[1].content.find((entry) => entry.category === category);
		if (target0) target0.visible = !target0.visible;
		if (target1) target1.visible = !target1.visible;
		feelings = [...feelings];
	};

	const categoryIsVisible = (feeling, category) => {
		const feelingSlug = feeling.nameEN;
		const categorySlug = category.category;
		if (feelingSlug === categorySlug) return true;
		if (category.visible) return true;
		return false;
	};

	onMount(async () => {
		await initFeelings();
		await initNeeds();
	});

	//todo: remove
	step = 1;
</script>

<!-- {#if $message}
	<div class="status" class:error={$page.status >= 400} class:success={$page.status == 200}>
		{$message}
	</div>
{/if} -->
<div
	class="flex flex-grow flex-col justify-between transition duration-700 {`bg-${stepConstructor[step - 1].slug}-background`}"
>
	<AppTopMenu />
	<div class="max-container relative flex flex-grow flex-col pb-40">
		<form
			on:submit|preventDefault
			use:enhance
			class="-mt-1 flex h-full flex-grow flex-col pb-[74px]"
		>
			{#if !formSubmitted && !formSuccess}
				<FormStepDisplay
					on:changeStep={changeStep}
					{step}
					steps={stepConstructor}
					stepBackground={stepConstructor[step - 1].slug}
				/>
				{/if}
				<div class="relative z-0">
				<Mascot {step} stepName={stepConstructor[step - 1].slug} />
				{#key step}
					{#if step === 1}
						<div class="form-content">
							<Form.Field {form} name="name">
								<Form.Control let:attrs>
									<Form.Label class="form-label "
										>{$t('default.page.fights.form.name.label')}</Form.Label
									>
									<Input {...attrs} bind:value={$formData.name} />
								</Form.Control>
								<!-- <Form.Description>This is your public display name.</Form.Description> -->
								<Form.FieldErrors />
							</Form.Field>
						</div>
					{:else if step === 2}
						<div class="form-content">
							<Form.Field {form} name="observation">
								<Form.Control let:attrs>
									<Form.Label class="form-label"
										>{$t('default.page.fights.form.observation.label')}</Form.Label
									>
									<Textarea {...attrs} bind:value={$formData.observation} class="min-h-60" />
								</Form.Control>
								<!-- <Form.Description>This is your public display name.</Form.Description> -->
								<Form.FieldErrors />
							</Form.Field>
						</div>
					{:else if step === 3}
						<div class="form-content">
							<Form.Field {form} name="feelings">
								<Form.Control let:attrs>
									<Form.Label class="form-label"
										>{$t('default.page.fights.form.feelings.label')}</Form.Label
									>
									<ToggleGroup.Root
										type="multiple"
										{...attrs}
										bind:value={$formData.feelings}
										class="flex flex-col gap-4"
									>
										{#if feelings.length > 0}
											<div class="">
												{#each feelings as positive}
													<div
														class="text-{stepConstructor[step - 1]
															.slug}-foreground mb-1 mt-3 flex items-center gap-3 text-xs"
													>
														{positive.category === 'true'
															? $t('default.page.fights.form.general.goodFeelings')
															: $t('default.page.fights.form.general.badFeelings')}
														<div
															class="border-b border-{stepConstructor[step - 1]
																.slug}-foreground mr-2 flex-grow border-opacity-20"
														></div>
													</div>
													<div class="-mx-1 flex w-full flex-wrap justify-start transition-all">
														{#each positive.content as category}
															{#each category.content as feeling}
																<button
																	type="button"
																	on:click={toggleFeelingsCatgeory(feeling, category.category)}
																	class="{categoryIsVisible(feeling, category) ||
																	$formData.feelings.includes(feeling.id)
																		? 'pointer-events-auto max-w-[1000px] p-1 opacity-100'
																		: 'pointer-events-none m-0 max-w-0 p-0 opacity-0'} transition-all"
																>
																	<ToggleGroup.Item
																		value={feeling.id}
																		class="{feeling.nameEN === category.category
																			? `bg-white/40 font-bold`
																			: 'border border-white/40'} py-0 text-black  shadow hover:text-black data-[state=on]:bg-feelings-foreground data-[state=on]:text-white dark:text-white dark:hover:bg-black/20"
																	>
																		{$locale === 'de' ? feeling.nameDE : feeling.nameEN}
																	</ToggleGroup.Item>
																</button>
															{/each}
														{/each}
													</div>
												{/each}
											</div>
										{/if}
									</ToggleGroup.Root>
								</Form.Control>
								<!-- <Form.Description>This is your public display name.</Form.Description> -->
								<Form.FieldErrors />
							</Form.Field>
						</div>
					{:else if step === 4}
						<div class="form-content">
							<Form.Field {form} name="needs">
								<Form.Control let:attrs>
									<Form.Label class="form-label"
										>{$t('default.page.fights.form.needs.label')}</Form.Label
									>
									<ToggleGroup.Root
										type="multiple"
										{...attrs}
										bind:value={$formData.needs}
										class=""
									>
										{#if needs.length > 0}
											<div class="-m-1 flex w-full flex-wrap justify-start transition-all">
												{#each needs as category}
													{#each category.content as need}
														<button
															type="button"
															on:click={toggleNeedsCatgeory(need, category.category)}
															class="{categoryIsVisible(need, category) ||
															$formData.needs.includes(need.id)
																? 'pointer-events-auto max-h-60 max-w-[1000px] p-1 opacity-100'
																: 'pointer-events-none m-0 max-h-0 max-w-0 p-0 opacity-0'} transition-all"
														>
															<ToggleGroup.Item
																value={need.id}
																class="{need.nameEN === category.category
																	? `bg-white/40 font-bold`
																	: 'border border-white/40'} py-0 text-black  shadow hover:text-black data-[state=on]:bg-needs-foreground data-[state=on]:text-white dark:text-white dark:hover:bg-black/20"
															>
																{$locale === 'de' ? need.nameDE : need.nameEN}
															</ToggleGroup.Item>
														</button>
													{/each}
												{/each}
											</div>
										{/if}
									</ToggleGroup.Root>
								</Form.Control>
								<!-- <Form.Description>This is your public display name.</Form.Description> -->
								<Form.FieldErrors />
							</Form.Field>
						</div>
					{:else if !formSubmitted}
						<div class="form-content">
							<Form.Field {form} name="request">
								<Form.Control let:attrs>
									<Form.Label class="form-label"
										>{$t('default.page.fights.form.request.label')}</Form.Label
									>
									<Textarea {...attrs} bind:value={$formData.request} class="min-h-60" />
								</Form.Control>
								<!-- <Form.Description>This is your public display name.</Form.Description> -->
								<Form.FieldErrors />
							</Form.Field>
						</div>
					{:else if formSuccess}
						Success
					{:else}
						Error in Submit
					{/if}
				{/key}

				{#if !formSubmitted && !formSuccess}
					<AppBottomMenu>
						<FormStepper
							{step}
							on:toPrev={decreaseStep}
							primaryButtonClass={`bg-${stepConstructor[step - 1].slug}-background`}
							class="flex-shrink-0"
						/>
					</AppBottomMenu>
				{/if}
			</div>
		</form>
	</div>
</div>

<style lang="scss">
	/* .data-\[state\=on\]\:text-accent-foreground[data-state=on] */
	// :global(.toggle-group-item[data-state=on]) {
	// 	@apply var(--current-foreground-color);
	// }

	:global(.form-label) {
		@apply mb-2 mt-4 block w-full pb-2 text-xl font-bold leading-tight;
		&:not([data-fs-error]) {
			@apply dark:text-foreground;
		}
	}
</style>
