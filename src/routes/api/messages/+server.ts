import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const perPage = parseInt(url.searchParams.get('perPage') || '20');
		const type = url.searchParams.get('type');
		const unreadOnly = url.searchParams.get('unread') === 'true';

		let filter = `userId = "${user.id}"`;
		
		// Add public announcements
		filter += ` || (type = "public_announcement" && (sentAt <= "${new Date().toISOString()}" || sentAt = ""))`;
		
		if (type) {
			filter += ` && type = "${type}"`;
		}
		
		if (unreadOnly) {
			filter += ` && read = false`;
		}

		const messages = await pb.collection('messages').getList(page, perPage, {
			filter,
			sort: '-created',
			requestKey: `messages-list-${user.id}-${page}-${type}-${unreadOnly}`,
		});

		// Get unread count
		const unreadCount = await pb.collection('messages').getList(1, 1, {
			filter: filter + ` && read = false`,
			requestKey: `messages-unread-count-${user.id}`,
		});

		return json({
			messages: messages.items,
			totalPages: messages.totalPages,
			currentPage: messages.page,
			unreadCount: unreadCount.totalItems
		});
	} catch (error) {
		console.error('Error fetching messages:', error);
		return json({ error: 'Failed to fetch messages' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let messageData;
	try {
		const { title, content, type, scheduledFor, priority, reminderData } = await request.json();

		if (!title || !content || !type) {
			return json({ error: 'Title, content and type are required' }, { status: 400 });
		}

		// Prepare the message data with proper null handling
		messageData = {
			type,
			title,
			content,
			read: false,
			priority: priority || 1
		};

		// Add userId only if not a public announcement
		if (type !== 'public_announcement') {
			messageData.userId = user.id;
		}

		// Add fromUserId (who created the message)
		messageData.fromUserId = user.id;

		// Handle scheduling
		if (scheduledFor) {
			messageData.scheduledFor = scheduledFor;
		} else {
			messageData.sentAt = new Date().toISOString();
		}

		// Add reminder data if present
		if (reminderData) {
			messageData.reminderData = JSON.stringify(reminderData);
		}

		console.log('Creating message with data:', messageData);

		const message = await pb.collection('messages').create(messageData, {
			requestKey: `create-message-${user.id}-${Date.now()}`
		});
		return json({ message });
	} catch (error) {
		console.error('Error creating message:', error);
		console.error('Message data that failed:', messageData);
		
		// Return more detailed error information
		const errorMessage = error?.response?.message || error?.message || 'Failed to create message';
		const errorData = error?.response?.data || {};
		
		return json({ 
			error: errorMessage,
			details: errorData,
			sentData: messageData
		}, { status: 500 });
	}
};