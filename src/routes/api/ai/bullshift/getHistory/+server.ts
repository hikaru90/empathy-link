import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$scripts/pocketbase';

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const chatId = url.searchParams.get('chatId');
		if (!chatId) {
			return json({ error: 'Missing chatId parameter' }, { status: 400 });
		}

		// Get chat from database
		const chatInDb = await pb.collection('chats').getOne(chatId);
		if (!chatInDb) {
			return json({ error: 'Chat not found' }, { status: 404 });
		}

		// Verify user owns this chat
		if (chatInDb.user !== user.id) {
			return json({ error: 'Unauthorized access to chat' }, { status: 403 });
		}

		return json({
			history: chatInDb.history || []
		});
	} catch (error) {
		console.error('Error fetching chat history:', error);
		return json({ error: 'Failed to fetch chat history' }, { status: 500 });
	}
};