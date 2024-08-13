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

	let className: string | undefined = undefined;
	export { className as class };
	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		resetForm: false,
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			console.log('result', result);
			if (result.type === 'failure') toast.error($t('default.page.register.toasts.error'));
			if (result.type === 'success') {
				toast.success($t('default.page.register.toasts.success'));
			}
		}
	});

	const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
	console.log('form', form);
</script>

<!-- <SuperDebug data={formData} /> -->
		<form method="POST" use:enhance class={className}>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>{$t('default.page.register.form.email.label')}</Form.Label>
					<Input {...attrs} bind:value={$formData.email} type="email" />
				</Form.Control>
				<!-- <Form.Description>This is your public display name.</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>{$t('default.page.register.form.password.label')}</Form.Label>
					<Input {...attrs} bind:value={$formData.password} type="password" />
				</Form.Control>
				<!-- <Form.Description>This is your public display name.</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
			<div class="flex items-center justify-between">
				<Button variant="ghost" on:click={() => goto('/app/auth/login')}
					>{$t('default.page.login.cta')}</Button
				>
				<Form.Button>{$t('default.page.register.cta')}</Form.Button>
			</div>
		</form>
