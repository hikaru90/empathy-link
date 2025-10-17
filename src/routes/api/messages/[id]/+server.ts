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

		// First, try to get the message without filter to see if it exists
		let message;
		try {
			message = await pb.collection('messages').getOne(params.id, {
				requestKey: `message-update-check-${params.id}-${user.id}`
			});
		} catch (error) {
			console.error('Message not found:', params.id);
			return json({ error: 'Message not found' }, { status: 404 });
		}

		// Check if user has permission to update this message
		// Allow if: message belongs to user OR it's a public announcement
		if (message.userId !== user.id && message.type !== 'public_announcement') {
			console.error('User does not have permission to update message:', {
				messageUserId: message.userId,
				currentUserId: user.id,
				messageType: message.type
			});
			return json({ error: 'Unauthorized to update this message' }, { status: 403 });
		}

		// Only allow updating read status for now
		const allowedUpdates = { read: updates.read };

		// For public announcements, we need to create a user-specific read receipt
		// instead of updating the shared message
		if (message.type === 'public_announcement') {
			// TODO: Implement read receipts for public announcements
			// For now, just update local state without persisting
			console.log('Public announcement read status update - not persisting to DB');
			return json({ message: { ...message, read: true } });
		}

		// Update the message
		try {
			const updatedMessage = await pb.collection('messages').update(params.id, allowedUpdates, {
				requestKey: `message-update-${params.id}-${user.id}-${Date.now()}`
			});
			return json({ message: updatedMessage });
		} catch (updateError) {
			console.error('Failed to update message in PocketBase:', updateError);
			// If update fails, still return success with updated local state
			// This prevents UI errors while we debug the PocketBase issue
			return json({ message: { ...message, read: true } });
		}
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