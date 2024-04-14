import { z } from 'zod';

export const schemaStep1 = z.object({
	// name: z.string().min(1)
});
export const schemaStep2 = schemaStep1.extend({
	// firstName: z.string().min(1)
});
export const schemaStep3 = schemaStep2.extend({
	// lastName: z.string().min(1)
});
export const schemaStep4 = schemaStep3.extend({
	// haha: z.string().min(1)
});
export const schemaStep5 = schemaStep4.extend({
	// hoho: z.string().min(1)
});
