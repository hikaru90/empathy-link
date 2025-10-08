import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	const pb = locals.pb;

	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { userGoal } = await request.json();

		if (!userGoal || typeof userGoal !== 'string') {
			return json({ error: 'User goal is required' }, { status: 400 });
		}

		// Update user with the selected goal
		await pb.collection('users').update(user.id, {
			userGoal
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error updating user goal:', error);
		return json({ error: 'Failed to update user goal' }, { status: 500 });
	}
};
