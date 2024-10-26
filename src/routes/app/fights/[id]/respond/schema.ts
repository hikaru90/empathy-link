import { z } from 'zod';
import { t, locale } from '$lib/translations';
import { get } from 'svelte/store';

export const schemaStep1 = z.object({
});
export const schemaStep2 = z.object({
});
export const schemaStep3 = z.object({
});
export const schemaStep4 = z.object({
});
export const schemaStep5 = z.object({
});
export const schemaStep6 = z.object({
});
export const schemaStep7 = z.object({
});
export const schemaStep8 = z.object({
});
export const schemaStep9 = schemaStep1.extend({
	observation: z.string().min(10, { message: get(t)('default.page.fights.form.observation.tooShortError') })
});
export const schemaStep10 = schemaStep2.extend({
	feelings: z.array(z.string()).min(1, { message: get(t)('default.page.fights.form.feelings.tooFewError') })
});
export const schemaStep11 = schemaStep3.extend({
	needs: z.array(z.string()).min(1, { message: get(t)('default.page.fights.form.needs.tooFewError') })
});
export const schemaStep12 = schemaStep4.extend({
	request: z.string().optional()
});
