<script lang="ts">
	import Menu from '$lib/components/Menu.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, defaults, superForm } from 'sveltekit-superforms';
	import { t, locale } from '$lib/translations';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';
	import { pb } from '$scripts/pocketbase';
	import { onMount, onDestroy } from 'svelte';
	import { serializeNonPOJOs, groupBy } from '$scripts/helpers';
	import { Textarea } from '$lib/components/ui/textarea';
	import Mascot from '$lib/components/Mascot.svelte';
	import { TriangleDown, TriangleUp } from 'radix-icons-svelte';
	import { user } from '$store/auth';
	import { Button } from '$lib/components/ui/button-op1/index.js';

	import { clsx } from 'clsx';
	import FightDisplay from '$lib/components/FightDisplay.svelte';
	import FightOwnerDisplay from '$lib/components/FightOwnerDisplay.svelte';
	import type { PageData } from './$types.js';
	import { startDate, endDate } from '$store/dashboard';
	import { page } from '$app/stores';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		CaretLeft,
		Share1,
		Cross1,
		Clipboard,
		EnvelopeClosed,
		PaperPlane
	} from 'radix-icons-svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { copy } from 'svelte-copy';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { sendMail } from '$scripts/brevo';

	let initialized = false;
	let pending = true;
	let record = undefined;
	let responses = [];
	let dialogOpen = false;
	let drawerOpen = false;
	let recipient = '';

	$: shareableLink = `${$page.url.origin}/fights/${$page.params.id}/respond`;

	const fetchData = async () => {
		record = await pb.collection('fights').getOne($page.params.id, {
			expand: 'feelings, needs, owner'
		});

		pb.collection('responses').subscribe(
			'*',
			function (e) {
				//todo: replace with create
				if (e.action === 'create' && e.record.fight === record.id) {
					const newRecord = e.record;
					responses = [...responses, newRecord];
				}
			},
			{
				expand: 'fight, feelings, needs'
			}
		);

		responses = await pb.collection('responses').getFullList({
			filter: `fight = '${record.id}'`,
			expand: 'fight, feelings, needs'
		});
	};

	const data: SuperValidated<Infer<FormSchema>> = defaults(zod(schema));
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
		const validationResult = await validateForm($formData, schema);
		if (!validationResult.valid) {
			errors.set(validationResult.errors);
			return false;
		}
		return true;
	};
	const form = superForm(data, {
		// SPA: true,
		resetForm: false,
		validators: zodClient(schema),
		async onSubmit({ validators, cancel }) {
			console.log('onSubmit');

			cancel();
			// Make a manual client-side validation, since we have cancelled
			if (await checkValidation()) {
				sendLink();
			}
		}
		// async onUpdated({ form }) {
		// 	console.log('onUpdated');
		// 	if (form.valid) step = 1;
		// }
	});
	const { form: formData, errors, enhance, validate, validateForm } = form;

	const sendLink = () => {
		try {
			sendMail('sendLink', $locale, $formData.email, {
				owner: record.expand.owner.firstName,
				recipientName: record.name,
				link: shareableLink
			});
			dialogOpen = false;
			toast.success($t('default.menu.share.mailLinkConfirmation'));
		} catch (err) {
			console.log('error sending link per mail');
			toast.error($t('default.menu.share.mailLinkError'));
		}
	};

	onMount(async () => {
		await fetchData();
		initialized = true;
		pending = false;

		console.log('record', record);
		console.log('responses', responses);
	});

	onDestroy(() => {
		pb.collection('responses').unsubscribe('*');
	});
</script>

{#if !initialized}
	<Skeleton class="h-[20px] w-[100px] rounded-full" />
{:else}
	<div class="flex h-full flex-grow flex-col justify-between">
		<div class="flex-grow bg-black/20">
			<div class="bg-offwhite">
				<Menu />

				<div class="relative flex h-auto items-center justify-between">
					<a href="/dashboard" class="block">
						<Button decoration="op1" class="flex items-center px-1.5 text-sm">
							<CaretLeft class="h-4 w-4 rounded-full" />
						</Button>
					</a>
					<div
						class="block h-[52px] w-full flex-grow border border-black/10 bg-black/10 p-[3px] shadow-inner"
					>
						<div
							class="h-full w-full rounded-sm bg-offwhite shadow-inner shadow-white/40 dark:shadow-white/10"
						></div>
					</div>
					<Button
						on:click={() => (drawerOpen = true)}
						decoration="op1"
						class="flex items-center gap-2"
					>
						{$t('default.menu.share.cta')}
						<Share1 />
					</Button>
				</div>
				<div class="mb-6 flex items-center justify-between md:flex-row md:items-center px-4 py-2.5 border-b border-black/20">
					<h1 class="font-heading text-lg font-semibold">
						{$t('default.page.fight.heading')}
						{$locale === 'en' ? 'with' : 'mit'}
						<span class="capitalize">
							{record.name}
						</span>
					</h1>
					<div class="text-xs">
						{$locale === 'en' ? 'on the' : 'am'}
						{new Intl.DateTimeFormat('de-DE').format(new Date($startDate))}
					</div>
				</div>
			</div>

			<div class="max-container relative pb-42 pt-2">
				<div class="relative">
					<!-- <FightOwnerDisplay {record} /> -->
					<FightDisplay {record} />
				</div>
				{#each responses as response}
					<div class="relative mt-8">
						<!-- <FightOwnerDisplay record={response} adversary={record.name} /> -->
						<FightDisplay record={response} adversary={record.name} />
					</div>
				{/each}
			</div>
		</div>
	</div>

	<Drawer.Root bind:open={drawerOpen}>
		<Drawer.Content class="p-4">
			<Drawer.Header>
				<div class="flex items-center justify-between">
					<Drawer.Title>{$t('default.menu.share.cta')}</Drawer.Title>
					<!-- <Drawer.Description>This action cannot be undone.</Drawer.Description> -->
					<Drawer.Close>
						<Cross1 class="text-red-600" />
					</Drawer.Close>
				</div>
			</Drawer.Header>
			<Drawer.Footer class="flex flex-row items-center">
				<button
					use:copy={shareableLink}
					on:click={() => {
						drawerOpen = false;
						toast.success($t('default.menu.share.copyLinkConfirmation'));
					}}
				>
					<Button class="flex items-center gap-2"
						>{$t('default.menu.share.copyLink')} <Clipboard /></Button
					>
				</button>

				<Button
					on:click={() => ((drawerOpen = false), (dialogOpen = true))}
					class="flex items-center gap-2"
					>{$t('default.menu.share.mailLink')} <EnvelopeClosed /></Button
				>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>

	<Dialog.Root bind:open={dialogOpen} preventScroll={false}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title class="mb-10">{$t('default.menu.share.mailDialogText')}</Dialog.Title>
				<Dialog.Description>
					<form
						on:submit|preventDefault
						use:enhance
						class="-mt-1 flex h-full flex-grow flex-col pb-[74px]"
					>
						<Form.Field {form} name="email">
							<Form.Control let:attrs>
								<Form.Label class="form-label">E-Mail</Form.Label>
								<Input
									{...attrs}
									bind:value={$formData.email}
									type="text"
									placeholder={$locale === 'en' ? 'E-Mail' : 'E-Mail Adresse'}
									class="mb-4"
								/>
							</Form.Control>
							<!-- <Form.Description>This is your public display name.</Form.Description> -->
							<Form.FieldErrors />
						</Form.Field>
						<div class="flex justify-end">
							<Button type="submit" class="flex items-center gap-2"
								>{$t('default.menu.share.cta')} <PaperPlane /></Button
							>
						</div>
					</form>
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/if}
