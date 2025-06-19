import { z } from 'zod';
import { m } from '$lib/translations';
import { get } from 'svelte/store';

export const formSchema = z.object({
	firstName: z
		.string()
		.min(3, { message: m.page_register_form_firstname_tooShortError() })
		.max(30, { message: m.page_register_form_firstname_tooLongError() }),
	lastName: z
		.string()
		.min(3, { message: m.page_register_form_lastname_tooShortError() })
		.max(30, { message: m.page_register_form_lastname_tooLongError() }),
	email: z.string().email({ message: m.page_register_form_email_validEmailError() }),
	password: z
		.string()
		.min(6, { message: m.page_register_form_password_tooShortError() })
		.max(30, { message: m.page_register_form_password_tooLongError() })
});
export type FormSchema = typeof formSchema;
