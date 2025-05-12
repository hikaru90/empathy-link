import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { extractMemories } from '$lib/server/tools';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { userId } = await request.json();

		// if (!chatId) {
		//   return json({ error: 'No chat ID provided' }, { status: 400 });
		// }

		console.log('extracting Memories on the serverSide');
		// Remove chat from memory
		extractMemories(userId);

		return json({ success: true });
	} catch (error) {
		console.error('Error extracting memories', error);
		return json({ error: 'Failed to extracting memories' }, { status: 500 });
	}
};
