<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema, type FormSchema } from '$routes/app/auth/login/schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { t } from '$lib/translations';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Check } from 'radix-icons-svelte';
	import { pb } from '$scripts/pocketbase';

	let className: string | undefined = undefined;
	export { className as class };
	export let data: SuperValidated<Infer<FormSchema>>;

	let resetPassordDialogOpen = false;

	const form = superForm(data, {
		resetForm: false,
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			console.log('result', result);
			if (result.type === 'failure') toast.error($t('default.page.login.toasts.error'));
			if (result.type === 'success') {
				toast.success($t('default.page.login.toasts.success'));
				// goto('/bullshift');
			}
		}
	});

	const resetPassword = async () => {
		resetPassordDialogOpen = false;
		await pb.collection('users').requestPasswordReset($formData.email);
		toast.success($t('default.page.login.forgotPassword.success'));
	};

	const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
</script>

<!-- <SuperDebug data={formData} /> -->
<form method="POST" use:enhance class={className}>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>{$t('default.page.login.form.email.label')}</Form.Label>
			<Input {...attrs} bind:value={$formData.email} type="email" />
		</Form.Control>
		<!-- <Form.Description>This is your public display name.</Form.Description> -->
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>{$t('default.page.login.form.password.label')}</Form.Label>
			<Input {...attrs} bind:value={$formData.password} type="password" />
		</Form.Control>
		<Form.Description
			><a
				role="button"
				tabindex="0"
				on:click={() => (resetPassordDialogOpen = true)}
				class="text-sm text-muted-foreground hover:underline">{$t('default.page.login.forgotPassword.question')}</a
			></Form.Description
		>
		<Form.FieldErrors />
	</Form.Field>

	<div class="flex items-center justify-between">
		<a href="/app/auth/register" class="text-sm hover:underline"
			>{$t('default.page.login.switchToRegister')}</a
		>
		<Form.Button type="submit" class="bg-primary text-muted">{$t('default.page.login.cta')}</Form.Button>
	</div>
</form>

<Dialog.Root bind:open={resetPassordDialogOpen} preventScroll={false}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="mb-10 leading-tight"
				>{$t('default.page.login.forgotPassword.heading')}</Dialog.Title
			>
			<Dialog.Description>
				{$t('default.page.login.forgotPassword.description')}
				<div class="mt-4 flex justify-end">
					<Button on:click={resetPassword} class="flex items-center gap-3 bg-muted-dark"
						>{$t('default.page.login.forgotPassword.heading')}
						<Check class="text-needs-background" /></Button
					>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
