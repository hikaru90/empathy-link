import { superValidate, message } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { schemaStep5 as lastStep } from './schema';
import { fail } from '@sveltejs/kit';

export const prerender = false;

// export const GET = async ({ request }) => {
// 	console.log('in get');
// 	// Create the form with the last step, to get all default values
// 	const form = await superValidate(request, zod(lastStep));
// 	return { form };
// };

// export const POST = async ({ request }) => {
// 	const form = await superValidate(request, zod(lastStep));

// 	console.log('POST request',request);

// 	if (!form.valid) return fail(400, { form });

// 	return message(form, 'Form posted successfully!');
// };
