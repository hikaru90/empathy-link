import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const messageId = params.id;

		// First verify the message exists and user has access to it
		try {
			await pb.collection('messages').getOne(messageId, {
				filter: `userId = "${user.id}" || type = "public_announcement"`,
				requestKey: `message-read-check-${messageId}-${user.id}`
			});
		} catch (error) {
			console.error('Message not found or no access:', messageId);
			return json({ error: 'Message not found' }, { status: 404 });
		}

		// Check if read receipt already exists
		try {
			const existingReceipt = await pb.collection('message_reads').getFirstListItem(
				`message = "${messageId}" && user = "${user.id}"`,
				{
					requestKey: `message-read-receipt-check-${messageId}-${user.id}`
				}
			);

			// Already marked as read
			return json({ success: true, receipt: existingReceipt });
		} catch (error) {
			// No receipt exists, create one
		}

		// Create read receipt
		const receipt = await pb.collection('message_reads').create(
			{
				message: messageId,
				user: user.id,
				readAt: new Date().toISOString()
			},
			{
				requestKey: `message-read-create-${messageId}-${user.id}-${Date.now()}`
			}
		);

		return json({ success: true, receipt });
	} catch (error) {
		console.error('Error creating read receipt:', error);
		return json({ error: 'Failed to mark message as read' }, { status: 500 });
	}
};

export const GET: RequestHandler = async ({ locals, params }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const messageId = params.id;

		// Check if user has read this message
		try {
			const receipt = await pb.collection('message_reads').getFirstListItem(
				`message = "${messageId}" && user = "${user.id}"`,
				{
					requestKey: `message-read-status-${messageId}-${user.id}`
				}
			);

			return json({ read: true, receipt });
		} catch (error) {
			return json({ read: false });
		}
	} catch (error) {
		console.error('Error checking read status:', error);
		return json({ error: 'Failed to check read status' }, { status: 500 });
	}
};
