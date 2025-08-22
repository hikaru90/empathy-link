import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	const locale = locals.locale;

	try {
		// Load chat records from database instead of memory
		const chats = await pb.collection('chats').getList(1, 50, {
			filter: `user = "${user.id}" && module = "bullshift"`,
			sort: '-created'
		});

		const records = chats.items.map((chat) => ({
			id: chat.id,
			history: chat.history || []
		}));

		console.log('resolved chat records from database:', records.length);
		return {
			records: records
		};
	} catch (error) {
		console.error('Error getting bullshift chat records:', error);
		return {
			error: 'Error getting bullshift chat records'
		};
	}
};
