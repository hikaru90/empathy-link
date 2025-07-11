<script lang="ts">
	import { createBubbler, preventDefault } from 'svelte/legacy';

	const bubble = createBubbler();
	import { m } from '$lib/translations';
	import { daysAgo } from '$scripts/helpers';
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, defaults, superForm } from 'sveltekit-superforms';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import { pb } from '$scripts/pocketbase';
	import { onMount, onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { z } from 'zod';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	import Share2 from 'lucide-svelte/icons/share-2'
	import X from 'lucide-svelte/icons/x'
	import Clipboard from 'lucide-svelte/icons/clipboard'
	import Mail from 'lucide-svelte/icons/mail'
	import SendHorizontal from 'lucide-svelte/icons/send-horizontal'
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw'
	import Check from 'lucide-svelte/icons/check'
	import * as Drawer from '$lib/components/ui/drawer';
	import { copy } from 'svelte-copy';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { getLocale } from '$src/paraglide/runtime';
	const locale = $derived(getLocale());

	interface Props {
		id: string;
		record: string;
	}

	let { id, record }: Props = $props();

	let initialized = $state(false);
	let pending = true;
	let responses = [];
	let dialogOpen = $state(false);
	let drawerOpen = $state(false);
	let recipient = '';
	let confirmDeletion = false;

	let shareableLink = $derived(`${$page.url.origin}/app/fights/${id}/respond`);
	let daysAgoIntl = $derived(() => {
		if (!initialized) return '...';
		return daysAgo(record.created);
	});

	const schema = z.object({
		email: z.string().email({ message: get(m)('default.page.login.form.email.validEmailError') })
	});
	type FormSchema = typeof schema;

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

	const deleteFight = async () => {
		try {
			await pb.collection('fights').delete(id);
			confirmDeletion = false;
			goto('/app/auth/login');
		} catch (err) {
			console.error('error deleting fight');
		}
	};

	const sendLink = () => {
		try {
			console.log('send link record', record);
			const sendMailRes = fetch('/api/mails/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					template: 'sendLink',
					locale: locale,
					to: $formData.email,
					owner: record.expand.owner.firstName,
					recipientName: record.name,
					link: shareableLink
				})
			});
			console.log('sendMailRes', sendMailRes);
			dialogOpen = false;
			toast.success(m.menu_share_mailLinkConfirmation());
		} catch (err) {
			console.log('error sending link per mail', err);
			toast.error(m.menu_share_mailLinkError());
		}
	};

	const toggleResolution = async () => {
		try {
			await pb.collection('fights').update(id, { resolved: !record.resolved });
		} catch (err) {
			console.error('error resolving fight', err);
		}
	};

	onMount(async () => {
		initialized = true;
		pending = false;

		console.log('record', record);
		console.log('responses', responses);
	});

	onDestroy(() => {
		pb.collection('responses').unsubscribe('*');
	});
</script>

<div class="relative flex h-auto w-full items-center justify-between">
	<a href="/app/dashboard" class="block">
		<Button
			decoration="dark-op1"
			class="flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
		>
			<ChevronLeft class="h-4 w-4 rounded-full" />
		</Button>
	</a>

	<div class="flex items-center">
		{#if !record.resolved}
		<Button
			onclick={toggleResolution}
			decoration="dark-op1"
			class="flex items-center gap-2 border-neutral-900 bg-green-700 text-sm text-zinc-200 hover:bg-green-800"
		>
			{m.page_fight_resolve()}
			<Check class="-mr-2" />
		</Button>
		{:else}
		<Button
			onclick={toggleResolution}
			decoration="dark-op1"
			class="flex items-center gap-2 border-neutral-900 bg-red-700 text-sm text-zinc-200 hover:bg-red-800"
		>
			{m.page_fight_unresolve()}
			<RotateCcw class="-mr-2" />
		</Button>
		{/if}
		<Button
			onclick={() => (drawerOpen = true)}
			decoration="dark-op1"
			class="flex items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
		>
			{m.menu_share_cta()}
			{m.menu_share_cta()}
			<Share2 class="-mr-1" />
		</Button>
	</div>
</div>

<Drawer.Root bind:open={drawerOpen}>
	<Drawer.Content class="">
		<Drawer.Header class="w-full border-b border-black/10">
			<div class="flex items-center justify-between">
				<Drawer.Title>{m.menu_share_cta()}</Drawer.Title>
				<!-- <Drawer.Description>This action cannot be undone.</Drawer.Description> -->
				<Drawer.Close>
					<div class="label bg-feelings-background">
						<div class="icon fill-feelings-foreground">
							<!-- {@html row.icon} -->
							<X class="text-red-600" />
						</div>
					</div>
				</Drawer.Close>
			</div>
		</Drawer.Header>
		<Drawer.Footer class="pb-10">
			<div class="max-container flex flex-col gap-4">
				<button
					use:copy={shareableLink}
					onsvelte-copy={() => {
						drawerOpen = false;
						toast.success(m.menu_share_copyLinkConfirmation());
					}}
					class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm"
				>
					{m.menu_share_copyLink()}
					<Clipboard />
				</button>

				<button
					onclick={() => ((drawerOpen = false), (dialogOpen = true))}
					class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm"
					>{m.default_menu_share_mailLink} <Mail /></button
				>
			</div>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<Dialog.Root bind:open={dialogOpen} preventScroll={false}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="mb-10 max-w-[9em] leading-tight"
				>{$m.default_menu_share_mailDialogText()}</Dialog.Title
			>
			<Dialog.Description>
				<form
					onsubmit={preventDefault(bubble('submit'))}
					use:enhance
					class="-mt-1 flex h-full flex-grow flex-col items-start"
				>
					<Form.Field {form} name="email" class="w-full">
						<Form.Control >
							{#snippet children({ attrs })}
														<Form.Label class="form-label">E-Mail</Form.Label>
								<Input
									{...attrs}
									bind:value={$formData.email}
									type="text"
									placeholder={locale === 'en' ? 'E-Mail' : 'E-Mail Adresse'}
									class="mb-4"
								/>
																				{/snippet}
												</Form.Control>
						<!-- <Form.Description>This is your public display name.</Form.Description> -->
						<Form.FieldErrors />
					</Form.Field>
					<div class="flex w-full justify-end">
						<Button type="submit" class="flex items-center gap-3"
							>{$m.default_menu_share_cta()} <SendHorizontal /></Button
						>
					</div>
				</form>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

<style lang="scss">
	.label {
		box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.4);
		@apply relative h-7 w-7 flex-shrink-0 rounded-full border border-white;
	}
	.label:after {
		content: '';
		box-shadow: /*inset 0 0 4px rgba(0, 0, 0, 0.4),*/ -4px -4px 8px 0 rgba(white, 1);
		@apply block h-full w-full rounded-full;
	}
	.icon {
		@apply absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transform;
	}
	.skeumorphic-button {
		transition: box-shadow 50ms;
		box-shadow: var(--skeumorphic-shadow-light);
	}
</style>
