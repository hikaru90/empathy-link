import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const message = await pb.collection('messages').getOne(params.id, {
			filter: `userId = "${user.id}" || type = "public_announcement"`,
			requestKey: `message-get-${params.id}-${user.id}`
		});

		return json({ message });
	} catch (error) {
		console.error('Error fetching message:', error);
		return json({ error: 'Message not found' }, { status: 404 });
	}
};

export const PATCH: RequestHandler = async ({ request, locals, params }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const updates = await request.json();
		
		// Verify the message belongs to the user or is a public announcement
		const message = await pb.collection('messages').getOne(params.id, {
			filter: `userId = "${user.id}" || type = "public_announcement"`,
			requestKey: `message-update-check-${params.id}-${user.id}`
		});

		if (!message) {
			return json({ error: 'Message not found' }, { status: 404 });
		}

		// Only allow updating read status for now
		const allowedUpdates = { read: updates.read };
		
		const updatedMessage = await pb.collection('messages').update(params.id, allowedUpdates, {
			requestKey: `message-update-${params.id}-${user.id}-${Date.now()}`
		});
		
		return json({ message: updatedMessage });
	} catch (error) {
		console.error('Error updating message:', error);
		return json({ error: 'Failed to update message' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Verify the message belongs to the user (can't delete public announcements)
		const message = await pb.collection('messages').getOne(params.id, {
			filter: `userId = "${user.id}"`,
			requestKey: `message-delete-check-${params.id}-${user.id}`
		});

		if (!message) {
			return json({ error: 'Message not found or cannot be deleted' }, { status: 404 });
		}

		await pb.collection('messages').delete(params.id, {
			requestKey: `message-delete-${params.id}-${user.id}-${Date.now()}`
		});
		
		return json({ success: true });
	} catch (error) {
		console.error('Error deleting message:', error);
		return json({ error: 'Failed to delete message' }, { status: 500 });
	}
};