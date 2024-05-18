<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import Menu from '$lib/components/Menu.svelte';
	import * as Form from '$lib/components/ui/form';
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
		schemaStep5,
		schemaStep6,
		schemaStep7,
		schemaStep8,
		schemaStep9,
		schemaStep10,
		schemaStep11,
		schemaStep12 as lastStep
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
	import {
		Cross1,
	} from 'radix-icons-svelte';

	const data: SuperValidated<Infer<FormSchema>> = defaults(zod(lastStep));
	let feelings = [];
	let needs = [];
	let fight = undefined;

	const steps = [
		zod(schemaStep1),
		zod(schemaStep2),
		zod(schemaStep3),
		zod(schemaStep4),
		zod(schemaStep5),
		zod(schemaStep6),
		zod(schemaStep7),
		zod(schemaStep8),
		zod(schemaStep9),
		zod(schemaStep10),
		zod(schemaStep11),
		zod(lastStep)
	];
	let step = 1;
	let formSubmitted = false;
	let formSuccess = false;
	let drawerOpen = false;

	$: options.validators = steps[step - 1];

	const handleSubmit = async () => {
		try {
			let data = $formData;
			data.fight = fight.id
			// data.owner = $user.id;
			console.log('submit form', data);
			const record = await pb.collection('responses').create(data);
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
			slug: 'greeting',
			name: get(t)('default.page.fights.form.general.steps.info'),
			icon: IconFolder,
			invertedTextColor: false,
			hidden: true
		},
		{
			slug: 'disclaimer',
			name: get(t)('default.page.fights.form.general.steps.info'),
			icon: IconFolder,
			invertedTextColor: false,
			hidden: true
		},
		{
			slug: 'breathe',
			name: get(t)('default.page.fights.form.general.steps.info'),
			icon: IconFolder,
			invertedTextColor: false,
			hidden: true
		},
		{
			slug: 'observation',
			name: get(t)('default.page.fights.form.general.steps.observation'),
			icon: IconEye,
			invertedTextColor: true,
			hidden: true
		},
		{
			slug: 'feelings',
			name: get(t)('default.page.fights.form.general.steps.feelings'),
			icon: IconHeart,
			invertedTextColor: false,
			hidden: true
		},
		{
			slug: 'needs',
			name: get(t)('default.page.fights.form.general.steps.needs'),
			icon: IconSwirl,
			invertedTextColor: false,
			hidden: true
		},
		{
			slug: 'request',
			name: get(t)('default.page.fights.form.general.steps.request'),
			icon: IconSteps,
			invertedTextColor: false,
			hidden: true
		},
		{
			slug: 'pause',
			name: get(t)('default.page.fights.form.general.steps.observation'),
			icon: IconEye,
			invertedTextColor: true,
			hidden: true
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
	const initFight = async () => {
		const record = await pb.collection('fights').getOne($page.params.id, {
			expand: 'owner, feelings, needs'
		});
		fight = serializeNonPOJOs(record);
		console.log('fight', fight);
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
		await initFight();
	});

	//todo: remove
	step = 4;
</script>

<!-- {#if $message}
	<div class="status" class:error={$page.status >= 400} class:success={$page.status == 200}>
		{$message}
	</div>
{/if} -->

<div
	class="flex flex-grow flex-col justify-between transition duration-700 {`bg-${stepConstructor[step - 1].slug}-background`}"
>
	<div class="max-container relative flex h-dvh flex-grow flex-col">
		<Menu />
		<form
			on:submit|preventDefault
			use:enhance
			class="-mt-1 flex h-full flex-grow flex-col pb-[74px]"
		>
			{#if !formSubmitted && !formSuccess}
				{#if step > 8}
					<FormStepDisplay
						on:changeStep={changeStep}
						{step}
						steps={stepConstructor}
						stepBackground={stepConstructor[step - 1].slug}
					/>
				{/if}
				<Mascot {step} stepName={stepConstructor[step - 1].slug} />
			{/if}
			{#if fight}
				{#key step}
					{#if step === 1}
						<div class="form-content flex flex-col justify-between items-center pt-10 pb-1 text-center">
							<div></div>
							<div class="flex flex-col gap-4 max-w-[18em]">
								<div>
									{fight.expand.owner.firstName}
									{$t('default.page.respond.steps.greeting.heading')}
								</div>
								<div class="flex justify-center">
									<Button on:click={() => (drawerOpen = true)} class="bg-white/40 text-black"
										>{$t('default.page.respond.steps.greeting.explanationCta')}</Button
										>
									</div>
								</div>
								<div class="max-w-[18em]">{$t('default.page.respond.steps.greeting.question')}</div>
						</div>
					{:else if step === 2}
						<div class="form-content flex flex-col justify-center items-center text-center">
							<div class="flex flex-col gap-4 text-center max-w-[18em]">
								{$t('default.page.respond.steps.disclaimer.heading')} —<br />
								{$t('default.page.respond.steps.disclaimer.description')}
							</div>
						</div>
					{:else if step === 3}
						<div class="form-content flex items-center justify-center">
							<div class="flex flex-col text-center relative">
								<span class="relative z-10 -mb-2">
									{$t('default.page.respond.steps.breathe.heading')}
								</span>
								<div class="breathe"></div>
								<div class="breathe2"></div>
							</div>
						</div>
					{:else if step === 4}
						<div data-simplebar class="form-content">
							<div class="form-label pt-10">
								{fight.expand.owner.firstName}
								{$t('default.page.respond.steps.ownerObservation.heading')}
							</div>
							<div class="bg-white/10 px-4 py-3 rounded shadow-xl">
								{fight.observation}
							</div>
						</div>
					{:else if step === 5}
						<div data-simplebar class="form-content">
							<div class="form-label pt-10">
								{fight.expand.owner.firstName}
								{$t('default.page.respond.steps.ownerFeelings.heading')}
							</div>
							<div class="flex items-center flex-wrap gap-2">
								{#each fight.expand.feelings as feeling}
								<div class="bg-white/20 shadow-lg px-4 py-2 rounded-md">
									{$locale === 'de' ? feeling.nameDE : feeling.nameEN}
								</div>
								{/each}
							</div>
						</div>
					{:else if step === 6}
					<div data-simplebar class="form-content">
						<div class="form-label pt-10">
							{fight.expand.owner.firstName}
							{$t('default.page.respond.steps.ownerNeeds.heading')}
						</div>
						<div class="flex items-center flex-wrap gap-2">
							{#each fight.expand.needs as need}
							<div class="bg-white/10 shadow-lg px-4 py-2 rounded-md">
								{$locale === 'de' ? need.nameDE : need.nameEN}
							</div>
							{/each}
						</div>
					</div>
					{:else if step === 7}
					<div data-simplebar class="form-content">
						<div class="form-label pt-10">
							{fight.expand.owner.firstName}
							{$t('default.page.respond.steps.ownerRequest.heading')}
						</div>
						<div class="bg-white/10 px-4 py-3 rounded shadow-xl">
							{fight.request}
						</div>
					</div>
					{:else if step === 8}
					<div class="form-content flex items-center justify-center">
						<div class="flex flex-col gap-4 text-center max-w-[18em]">
							{$t('default.page.respond.steps.pause.heading')}
						</div>
					</div>
					{:else if step === 9}
						<div data-simplebar class="form-content">
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
					{:else if step === 10}
						<div data-simplebar class="form-content">
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
																	$formData.feelings?.includes(feeling.id)
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
					{:else if step === 11}
						<div data-simplebar class="form-content">
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
															$formData.needs?.includes(need.id)
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
						<div data-simplebar class="form-content">
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
			{/if}
			{#if !formSubmitted && !formSuccess}
				<FormStepper
					{step}
					on:toPrev={decreaseStep}
					primaryButtonClass={`bg-${stepConstructor[step - 1].slug}-background`}
					class="flex-shrink-0"
				/>
			{/if}
		</form>
	</div>
</div>

<Drawer.Root bind:open={drawerOpen}>
	<Drawer.Content class="p-4">
		<Drawer.Header>
			<div class="flex items-center justify-between">
				<Drawer.Title>{$t('default.page.respond.explanationTitle')}</Drawer.Title>
				<!-- <Drawer.Description>This action cannot be undone.</Drawer.Description> -->
				<Drawer.Close>
					<Cross1 class="text-red-600" />
				</Drawer.Close>
			</div>
		</Drawer.Header>
		<p class="mb-20 p-4">{$t('default.page.respond.explanation')}</p>
	</Drawer.Content>
</Drawer.Root>

<style lang="scss">
	:global(.form-content) {
		@apply h-60 flex-grow overflow-y-auto overflow-x-hidden px-[1px];
		--mask: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 0,
			rgba(0, 0, 0, 1) 3%,
			rgba(0, 0, 0, 1) 97%,
			rgba(0, 0, 0, 0) 100%
		);
		-webkit-mask: var(--mask);
		mask: var(--mask);
	}
	:global(.form-label) {
		@apply mb-2 mt-4 block w-full pb-2 text-xl font-bold leading-tight;
		&:not([data-fs-error]) {
			@apply dark:text-foreground;
		}
	}

	.breathe{
		animation: breathe 5s infinite alternate forwards;
		&:after{
			content: '';
			@apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 w-72 h-72 rounded-full -z-10;
		}
	}
	.breathe2{
		animation: breathe 5s ease-in-out infinite alternate forwards;
		animation-delay: 1s;
		&:after{
			content: '';
			@apply absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-40 h-40 rounded-full -z-10;
		}
	}

	@keyframes breathe{
		0%{
			transform: scale(0.2);
			opacity:0;
		}
		100%{
			transform: scale(1);
			opacity:0.8;
		}
	}
</style>
