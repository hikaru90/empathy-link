import { z } from 'zod';
import { t, locale } from '$lib/translations';
import { get } from 'svelte/store';

export const schemaStep1 = z.object({
	name: z.string().min(3, { message: get(t)('default.page.fights.form.name.tooShortError') })
});
export const schemaStep2 = schemaStep1.extend({
	feelings: z.array(z.string()).min(1, { message: get(t)('default.page.fights.form.feelings.tooFewError') })
});
export const schemaStep3 = schemaStep2.extend({
	lastName: z.string().min(1)
});
export const schemaStep4 = schemaStep3.extend({
	haha: z.string().min(1)
});
export const schemaStep5 = schemaStep4.extend({
	hoho: z.string().min(1)
});
