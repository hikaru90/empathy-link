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
			const existingUser = await event.locals.pb.collection('users').getFirstListItem(`email="${form.data.email}"`);
			if (existingUser) {
				return setError(form, 'email', 'A user with this email already exists');
			}
		} catch (err) {
			// If no user is found, getFirstListItem throws an error
			// We can ignore this error as it means the user doesn't exist
			if (err.status !== 404) {
				console.error('Error checking for existing user:', err);
				return fail(500, { form });
			}
		}

		try {
			const formData = {
				firstName: form.data.firstName,
				lastName: form.data.lastName,
				email: form.data.email,
				password: form.data.password,
				passwordConfirm: form.data.password,
				emailVisibility: true,
			};
			console.log('formData', formData);
			const creationResult = await event.locals.pb.collection('users').create(formData);
			console.log('creationResult', creationResult);

			//send verification mail
			await event.locals.pb
				.collection('users')
				.requestVerification(String(form.data.email));
		} catch (err) {
			console.log('error in register form', err);
			return fail(500, {
				form
			});
		}

		redirect(302, '/app/auth/login?verifyMail=true');
		return { form };
	}
};
