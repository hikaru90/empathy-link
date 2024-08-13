import { z } from 'zod';
import { t, locale } from '$lib/translations';
import { get } from 'svelte/store';

export const schema = z.object({
	email: z.string().email({ message: get(t)('default.page.login.form.email.validEmailError') }),
});
export type FormSchema = typeof schema;
