<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from '$routes/app/auth/login/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { m } from '$lib/translations';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Check from 'lucide-svelte/icons/check'
	import { pb } from '$scripts/pocketbase';

	
	interface Props {
		class?: string | undefined;
		data: SuperValidated<Infer<FormSchema>>;
	}

	let { class: className = undefined, data }: Props = $props();

	let resetPasswordDialogOpen = $state(false);
	let isSubmitting = $state(false);

	const form = superForm(data, {
		resetForm: false,
		validators: zodClient(formSchema),
		onSubmit: () => {
			isSubmitting = true;
		},
		onResult: ({ result }) => {
			isSubmitting = false;
			console.log('result', result);
			if (result.type === 'failure') toast.error(m.page_login_toasts_error());
			if (result.type === 'success') {
				toast.success(m.page_login_toasts_success());
				// goto('/bullshift');
			}
		}
	});

	const resetPassword = async () => {
		resetPasswordDialogOpen = false;
		await pb.collection('users').requestPasswordReset($formData.email);
		toast.success(m.page_login_forgotPassword_success());
	};

	const openResetDialog = (event: MouseEvent) => {
		// Prevent any potential event bubbling
		event.preventDefault();
		event.stopPropagation();
		
		// Don't open dialog if form is being submitted
		if (isSubmitting) {
			return;
		}
		
		resetPasswordDialogOpen = true;
	};

	const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
</script>

<!-- <SuperDebug data={formData} /> -->
<form method="POST" use:enhance class={className}>
	<Form.Field {form} name="email">
		<Form.Control >
			{#snippet children({ attrs })}
						<Form.Label>{m.page_login_form_email_label()}</Form.Label>
				<Input {...attrs} bind:value={$formData.email} type="email" />
								{/snippet}
				</Form.Control>
		<!-- <Form.Description>This is your public display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control >
			{#snippet children({ attrs })}
						<Form.Label>{m.page_login_form_password_label()}</Form.Label>
				<Input {...attrs} bind:value={$formData.password} type="password" />
								{/snippet}
				</Form.Control>
		<Form.Description>
			<button 
				type="button"
				onclick={openResetDialog}
				disabled={isSubmitting}
				class="text-sm text-muted-foreground hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{m.page_login_forgotPassword_question()}
			</button>
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex items-center justify-between">
		<a href="/app/auth/register" class="text-sm hover:underline"
			>{m.page_login_switchToRegister()}</a
		>
		<Form.Button type="submit" class="bg-primary text-muted">{m.page_login_cta()}</Form.Button>
	</div>
</form>

<Dialog.Root bind:open={resetPasswordDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="mb-10 leading-tight"
				>{m.page_login_forgotPassword_heading()}</Dialog.Title
			>
			<Dialog.Description>
				{m.page_login_forgotPassword_description()}
				<div class="mt-4 flex justify-end">
					<Button onclick={resetPassword} class="flex items-center gap-3 bg-muted-dark"
						>{m.page_login_forgotPassword_heading()}
						<Check class="text-needs-background" /></Button
					>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
