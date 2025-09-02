import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const reminder = await pb.collection('reminders').getOne(params.id, {
			filter: `userId = "${user.id}"`
		});

		return json({ reminder });
	} catch (error) {
		console.error('Error fetching reminder:', error);
		return json({ error: 'Reminder not found' }, { status: 404 });
	}
};

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const updates = await request.json();
		
		// Verify the reminder belongs to the user
		const reminder = await pb.collection('reminders').getOne(params.id, {
			filter: `userId = "${user.id}"`
		});

		if (!reminder) {
			return json({ error: 'Reminder not found' }, { status: 404 });
		}

		// Process recurring data if present
		if (updates.recurringData && typeof updates.recurringData === 'object') {
			updates.recurringData = JSON.stringify(updates.recurringData);
		}
		
		const updatedReminder = await pb.collection('reminders').update(params.id, updates);
		
		return json({ reminder: updatedReminder });
	} catch (error) {
		console.error('Error updating reminder:', error);
		return json({ error: 'Failed to update reminder' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Verify the reminder belongs to the user
		const reminder = await pb.collection('reminders').getOne(params.id, {
			filter: `userId = "${user.id}"`
		});

		if (!reminder) {
			return json({ error: 'Reminder not found' }, { status: 404 });
		}

		await pb.collection('reminders').delete(params.id);
		
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting reminder:', error);
		return json({ error: 'Failed to delete reminder' }, { status: 500 });
	}
};