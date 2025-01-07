import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { schemaStep5 as lastStep } from './schema';
import { fail } from '@sveltejs/kit';

export const prerender = false;

export const load = async () => {
	// Create the form with the last step, to get all default values
	const form = await superValidate(zod(lastStep));
	console.log('server:form',form);
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(lastStep));

		if (!form.valid) return fail(400, { form });

		return message(form, 'Form posted successfully!');
	}
};