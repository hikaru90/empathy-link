import { z } from 'zod';
import { m } from '$lib/translations';
import { getLocale } from '$src/paraglide/runtime';
const locale = getLocale();

export const formSchema = z.object({
	email: z.string().email({ message: m.page_login_form_email_validEmailError() }),
	password: z
		.string()
		.min(6, { message: m.page_login_form_password_tooShortError() })
		.max(30, { message: m.page_login_form_password_tooLongError() })
});
export type FormSchema = typeof formSchema;
