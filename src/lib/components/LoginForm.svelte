<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "../../routes/login/schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { t } from '$lib/translations';
 
  let className:string|undefined = undefined;
  export { className as class };
  export let data: SuperValidated<Infer<FormSchema>>;
 
  const form = superForm(data, {
    validators: zodClient(formSchema),
  });
 
  const { form: formData, enhance } = form;
</script>
 
<form method="POST" use:enhance class={className}>
  <Form.Field {form} name="username">
    <Form.Control let:attrs>
      <Form.Label>{$t('default.page.login.form.username.label')}</Form.Label>
      <Input {...attrs} bind:value={$formData.username} />
    </Form.Control>
    <!-- <Form.Description>This is your public display name.</Form.Description> -->
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>