import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const load: PageServerLoad = async ({ locals }) => {
		console.log('PageServerLoad');

		if (locals.user) {
			console.log('redirecting');
			throw redirect(303, '/dashboard');
		}
		return {
			form: await superValidate(zod(formSchema))
		};
};

export const actions: Actions = {
	default: async (event) => {
		try {
			console.log('action');
			const form = await superValidate(event, zod(formSchema));
			if (!form.valid) {
				return fail(400, {
					form
				});
			}

			try {
				await event.locals.pb
					.collection('users')
					.authWithPassword(form.data.email, form.data.password);
				if (!event.locals.pb?.authStore?.model?.verified) {
					event.locals.pb.authStore.clear();
					console.log('user not verified');
					return fail(400, {
						form
					});
				}
			} catch (err) {
				console.log('error in form', err);
				return fail(400, {
					form
				});
			}

			redirect(302, '/dashboard');
			return { form };
			// return message(form, 'Login successfull');
		} catch (err) {
			console.log('error in login action', err);
		}
	}
};
