import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const load: PageServerLoad = async ({ locals }) => {
	// console.log('PageServerLoad');

	// if (locals.user) {
	// 	console.log('redirecting');
	// 	throw redirect(303, '/');
	// }
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		console.log('action');
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await event.locals.pb.collection('users').create({
				email: form.data.email,
				password: form.data.password,
				passwordConfirm: form.data.password
			});
			await event.locals.pb.collection('users').requestVerification(form.data.email);
		} catch (err) {
			console.log('error in register form', err);
			return fail(500, {
				form
			});
		}

		redirect(302, '/auth/login');
		return { form };
	}
};
