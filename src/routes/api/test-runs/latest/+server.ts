import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Get the latest test run for the current user
		const records = await pb.collection('test_runs').getList(1, 1, {
			filter: `user = "${user.id}"`,
			sort: '-created'
		});

		const latestTestRun = records.items.length > 0 ? records.items[0] : null;

		return json({
			latestTestRun,
			hasTestRuns: records.items.length > 0
		});

	} catch (error: any) {
		console.error('Error fetching latest test run:', error);
		return json({ 
			error: 'Failed to fetch latest test run',
			details: error.message 
		}, { status: 500 });
	}
};
