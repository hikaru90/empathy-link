<script lang="ts">
  import { redirect } from '@sveltejs/kit';
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "$routes/auth/login/schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { t } from '$lib/translations';
  import SuperDebug from "sveltekit-superforms";
  import { toast } from "svelte-sonner";
 
  let className:string|undefined = undefined;
  export { className as class };
  export let data: SuperValidated<Infer<FormSchema>>;
 
  const form = superForm(data, {
    resetForm: false,
    validators: zodClient(formSchema),
    onResult: ({ result }) => {
      console.log('result',result);
      if(result.type === 'failure') toast.error($t('default.page.login.toasts.error'))
      if(result.type === 'success') {
        toast.success($t('default.page.login.toasts.success'))
        // redirect(302, '/dashboard');
      }
    },
    // onUpdated: ({ form: f }) => {
    //   console.log('f',f);
    //   if (f.valid) {
    //     toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
    //   } else {
    //     toast.error("Please fix the errors in the form.");
    //   }
    // }
  });
 
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
    <!-- <Form.Description>This is your public display name.</Form.Description> -->
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>{$t('default.page.login.cta')}</Form.Button>
</form>