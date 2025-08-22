import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkPathCompletion, getCurrentPath } from '$lib/server/gemini';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { chatId, recentMessages } = await request.json();

		if (!chatId || !recentMessages) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const result = await checkPathCompletion(chatId, recentMessages);
		const currentPath = getCurrentPath(chatId);

		return json({
			...result,
			currentPath: currentPath?.activePath,
			pathState: currentPath
		});
	} catch (error) {
		console.error('Error checking path completion:', error);
		return json({ error: 'Failed to check path completion' }, { status: 500 });
	}
};