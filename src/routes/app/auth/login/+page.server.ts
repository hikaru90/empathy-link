import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$store/auth';

const redirectToFightOrDashboard = (
	cookies,
) => {
	const loginRedirectTarget = cookies.get('loginRedirectTarget');

	if (loginRedirectTarget) {
		redirect(307, loginRedirectTarget);
	} else {
		redirect(307, '/bullshift');
	}
};

export const load: PageServerLoad = async ({ locals, cookies }) => {
	if (locals.user) {
		console.log('user', locals.user);
		user.update((value) => locals.user);
		console.log('redirecting');
		redirectToFightOrDashboard(cookies);
	}
	return {
		form: await superValidate(zod(formSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		console.log('default action');
		try {
			console.log('action');
			const form = await superValidate(event, zod(formSchema));
			console.log('form', form);
			if (!form.valid) {
				console.log('form not valid');
				return fail(400, {
					form
				});
			}

			try {
				const authWithPassword = await event.locals.pb
					.collection('users')
					.authWithPassword(form.data.email, form.data.password);
				console.log('authWithPassword', authWithPassword);
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

			return { form };
			// return message(form, 'Login successfull');
		} catch (err) {
			console.log('error in login action', err);
		}
	}
};
