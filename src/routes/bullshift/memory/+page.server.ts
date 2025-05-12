import type { PageServerLoad } from './$types';
import { bullshiftChats } from '$lib/server/gemini';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const locale = locals.locale;

	try {
		const records = Array.from(bullshiftChats.entries()).map(async ([id, chat]) => {
			return {
				id,
				history: await chat.getHistory()
			};
		});

		const resolvedRecords = await Promise.all(records);
		console.log('resolvedRecords', resolvedRecords);
		return {
			records: resolvedRecords
		};
	} catch (error) {
		console.error('Error getting bullshift instances:', error);
		return {
			error: 'Error getting bullshift instances'
		};
	}
};
