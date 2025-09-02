import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { switchPath, getCurrentPath } from '$lib/server/gemini';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { chatId, newPathId, locale } = await request.json();

		if (!chatId || !newPathId) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const result = await switchPath(chatId, newPathId, user, locale || 'de', locals.pb);

		if (!result.success) {
			return json({ error: 'Failed to switch path' }, { status: 500 });
		}

		// Get updated path state
		const currentPath = getCurrentPath(chatId);

		return json({
			success: true,
			activePath: newPathId,
			systemInstruction: result.newSystemInstruction,
			pathMarkers: result.pathMarkers,
			pathState: currentPath
		});
	} catch (error) {
		console.error('Error switching path:', error);
		return json({ error: 'Failed to switch path' }, { status: 500 });
	}
};