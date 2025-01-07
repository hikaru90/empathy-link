import { z } from 'zod';
import { t, locale } from '$lib/translations';
import { get } from 'svelte/store';

export const schemaStep1 = z.object({
	balance: z.number().min(1).max(5),
	awareness: z.number().min(1).max(5),
	energy: z.number().min(1).max(5),
	calmness: z.number().min(1).max(5),
	kindness: z.number().min(1).max(5)
});
export const schemaStep2 = schemaStep1.extend({
	observation: z.string().min(10, { message: get(t)('default.page.fights.form.observation.tooShortError') })
});
export const schemaStep3 = schemaStep2.extend({
	feelings: z.array(z.string()).min(1, { message: get(t)('default.page.fights.form.feelings.tooFewError') })
});
export const schemaStep4 = schemaStep3.extend({
	needs: z.array(z.string()).min(1, { message: get(t)('default.page.fights.form.needs.tooFewError') })
});
export const schemaStep5 = schemaStep4.extend({
	request: z.string().optional()
});
