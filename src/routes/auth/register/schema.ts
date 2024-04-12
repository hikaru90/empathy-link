import { z } from 'zod';
import { t, locale } from '$lib/translations';
import { get } from 'svelte/store';

console.log('locale', get(locale));

export const formSchema = z.object({
	email: z.string().email({ message: get(t)('default.page.login.form.email.validEmailError') }),
	password: z
		.string()
		.min(6, { message: get(t)('default.page.login.form.password.tooShortError') })
		.max(30, { message: get(t)('default.page.login.form.password.tooLongError') })
});
export type FormSchema = typeof formSchema;
