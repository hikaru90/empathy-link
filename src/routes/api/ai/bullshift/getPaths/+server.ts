import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAvailablePaths, getCurrentPath } from '$lib/server/gemini';

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const chatId = url.searchParams.get('chatId');
		const availablePaths = getAvailablePaths();
		let currentPath = null;

		if (chatId) {
			currentPath = getCurrentPath(chatId);
		}

		return json({
			availablePaths,
			currentPath: currentPath?.activePath,
			pathState: currentPath
		});
	} catch (error) {
		console.error('Error getting paths:', error);
		return json({ error: 'Failed to get paths' }, { status: 500 });
	}
};