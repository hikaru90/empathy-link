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

	
	interface Props {
		class?: string | undefined;
		data: SuperValidated<Infer<FormSchema>>;
	}

	let { class: className = undefined, data }: Props = $props();

	const form = superForm(data, {
		resetForm: false,
		validators: zodClient(formSchema),
		onResult: ({ result }) => {
			console.log('result', result);
			if (result.type === 'failure') toast.error(m_page_register_toasts_error());
			if (result.type === 'success') {
				toast.success(m_page_register_toasts_success());
			}
		}
	});

	const { form: formData, errors, enhance, delayed, message, constraints, reset } = form;
	console.log('form', form);
</script>

<!-- <SuperDebug data={formData} /> -->
		<form method="POST" use:enhance class={className}>
			<Form.Field {form} name="firstName">
				<Form.Control >
					{#snippet children({ attrs })}
						<Form.Label>{m.page_register_form_firstname_label()}</Form.Label>
						<Input {...attrs} bind:value={$formData.firstName} />
										{/snippet}
				</Form.Control>
				<!-- <Form.Description>This is your public display name.</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="lastName">
				<Form.Control >
					{#snippet children({ attrs })}
						<Form.Label>{m.page_register_form_lastname_label()}</Form.Label>
						<Input {...attrs} bind:value={$formData.lastName} />
										{/snippet}
				</Form.Control>
				<!-- <Form.Description>This is your public display name.</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control >
					{#snippet children({ attrs })}
						<Form.Label>{m.page_register_form_email_label()}</Form.Label>
						<Input {...attrs} bind:value={$formData.email} type="email" />
										{/snippet}
				</Form.Control>
				<!-- <Form.Description>This is your public display name.</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control >
					{#snippet children({ attrs })}
						<Form.Label>{m.page_register_form_password_label()}</Form.Label>
						<Input {...attrs} bind:value={$formData.password} type="password" />
										{/snippet}
				</Form.Control>
				<!-- <Form.Description>This is your public display name.</Form.Description> -->
				<Form.FieldErrors />
			</Form.Field>
	<div class="flex items-center justify-between">
		<a href="/app/auth/login" class="text-sm hover:underline"
			>{m.page_login_switchToLogin()}</a
		>
				<Form.Button class="bg-primary text-muted">{m.page_register_cta()}</Form.Button>
			</div>
		</form>
