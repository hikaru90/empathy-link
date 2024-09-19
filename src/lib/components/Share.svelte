<script lang="ts">
	import { daysAgo } from '$scripts/helpers';
	import AppTopMenu from '$lib/components/AppTopMenu.svelte';
	import AppBottomMenu from '$lib/components/AppBottomMenu.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, type Infer, defaults, superForm } from 'sveltekit-superforms';
	import { t, locale } from '$lib/translations';
	import { zodClient, zod } from 'sveltekit-superforms/adapters';
	import { pb } from '$scripts/pocketbase';
	import { onMount, onDestroy } from 'svelte';
	import { Button } from '$lib/components/ui/button-op1/index.js';
	import { z } from 'zod';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import {
		CaretLeft,
		Share1,
		Cross1,
		Clipboard,
		EnvelopeClosed,
		PaperPlane,
		Trash,
		Check
	} from 'radix-icons-svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { copy } from 'svelte-copy';
	import * as Dialog from '$lib/components/ui/dialog';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

  export let id:string;
	let initialized = false;
	let pending = true;
	let record = undefined;
	let responses = [];
	let dialogOpen = false;
	let drawerOpen = false;
	let recipient = '';
	let confirmDeletion = false;

	$: shareableLink = `${$page.url.origin}/app/fights/${id}/respond`;
	$: daysAgoIntl = () => {
		if (!initialized) return '...';
		return daysAgo(record.created);
	};

	const schema = z.object({
		email: z.string().email({ message: get(t)('default.page.login.form.email.validEmailError') })
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
			const sendMailRes = fetch('/api/mails/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					template: 'sendLink',
					locale: $locale,
					to: $formData.email,
					owner: record.expand.owner.firstName,
					recipientName: record.name,
					link: shareableLink
				})
			});
			console.log('sendMailRes', sendMailRes);
			dialogOpen = false;
			toast.success($t('default.menu.share.mailLinkConfirmation'));
		} catch (err) {
			console.log('error sending link per mail');
			toast.error($t('default.menu.share.mailLinkError'));
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

<div class="relative flex h-auto items-center justify-between">
	<a href="/app/dashboard" class="block">
		<Button
			decoration="dark-op1"
			class="flex items-center border-neutral-900 bg-neutral-800 px-1.5 text-sm text-zinc-200"
		>
			<CaretLeft class="h-4 w-4 rounded-full" />
		</Button>
	</a>
	<Button
		on:click={() => (drawerOpen = true)}
		decoration="dark-op1"
		class="flex items-center gap-2 border-neutral-900 bg-neutral-800 text-sm text-zinc-200"
	>
		{$t('default.menu.share.cta')}
		<Share1 />
	</Button>
</div>

<Drawer.Root bind:open={drawerOpen}>
  <Drawer.Content class="">
    <Drawer.Header class="w-full border-b border-black/10">
      <div class="flex items-center justify-between">
        <Drawer.Title>{$t('default.menu.share.cta')}</Drawer.Title>
        <!-- <Drawer.Description>This action cannot be undone.</Drawer.Description> -->
        <Drawer.Close>
          <div class="label bg-feelings-background">
            <div class="icon fill-feelings-foreground">
              <!-- {@html row.icon} -->
              <Cross1 class="text-red-600" />
            </div>
          </div>
        </Drawer.Close>
      </div>
    </Drawer.Header>
    <Drawer.Footer class="flex flex-col gap-4 pb-10">
      <button
        use:copy={shareableLink}
        on:svelte-copy={() => {
          drawerOpen = false;
          toast.success($t('default.menu.share.copyLinkConfirmation'));
        }}
        class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm"
      >
        {$t('default.menu.share.copyLink')}
        <Clipboard />
      </button>

      <button
        on:click={() => ((drawerOpen = false), (dialogOpen = true))}
        class="skeumorphic-button flex w-full items-center justify-between rounded-full px-4 py-1.5 text-sm"
        >{$t('default.menu.share.mailLink')} <EnvelopeClosed /></button
      >
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>

<Dialog.Root bind:open={dialogOpen} preventScroll={false}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title class="mb-10 max-w-[9em] leading-tight"
        >{$t('default.menu.share.mailDialogText')}</Dialog.Title
      >
      <Dialog.Description>
        <form
          on:submit|preventDefault
          use:enhance
          class="-mt-1 flex h-full flex-grow flex-col items-start"
        >
          <Form.Field {form} name="email" class="w-full">
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
          <div class="flex w-full justify-end">
            <Button type="submit" class="flex items-center gap-3"
              >{$t('default.menu.share.cta')} <PaperPlane /></Button
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