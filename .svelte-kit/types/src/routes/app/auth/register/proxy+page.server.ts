// @ts-nocheck
import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	// console.log('PageServerLoad');

	// if (locals.user) {
	// 	console.log('redirecting');
	// 	throw redirect(303, '/');
	// }
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions = {
	default: async (event: import('./$types').RequestEvent) => {
		console.log('action');
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const allusers = await event.locals.pb.collection('users').getFullList();
		console.log('allusers', allusers);
		const existingUser = await event.locals.pb
			.collection('users')
			.getFirstListItem(`email="${form.data.email}"`);
		console.log('existingUser', existingUser);
		if (existingUser) {
			return setError(form, 'email', 'This email is already registered');
		}

		try {
			const formData = {
				firstName: form.data.firstName,
				lastName: form.data.lastName,
				email: form.data.email,
				password: form.data.password,
				passwordConfirm: form.data.password
			};
			console.log('formData', formData);
			const creationResult = await event.locals.pb.collection('users').create(formData);
			console.log('creationResult', creationResult);

			//send verification mail
			const verifyMail = await event.locals.pb
				.collection('users')
				.requestVerification(String(form.data.email));
			console.log('verifyMail', verifyMail);
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
;null as any as Actions;