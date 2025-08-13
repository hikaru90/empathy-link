import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { extractMemories } from '$lib/server/tools';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		console.log('extracting Memories on the serverSide for user:', user.id);
		// Use authenticated user's ID instead of accepting it from request body
		extractMemories(user.id);

		return json({ success: true });
	} catch (error) {
		console.error('Error extracting memories', error);
		return json({ error: 'Failed to extracting memories' }, { status: 500 });
	}
};
