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

		// Get all read receipts for this user for the current page of messages
		const messageIds = messages.items.map((m: any) => m.id);
		let readReceipts: any[] = [];

		if (messageIds.length > 0) {
			try {
				const receiptsFilter = `user = "${user.id}" && (${messageIds.map(id => `message = "${id}"`).join(' || ')})`;
				const receiptsResult = await pb.collection('message_reads').getFullList({
					filter: receiptsFilter,
					requestKey: `message-reads-${user.id}-${page}`
				});
				readReceipts = receiptsResult;
			} catch (error) {
				console.error('Error fetching read receipts:', error);
			}
		}

		// Create a map of messageId -> read status
		const readMap = new Map(readReceipts.map((r: any) => [r.message, true]));

		// Enhance messages with read status from receipts
		const enhancedMessages = messages.items.map((message: any) => ({
			...message,
			read: readMap.has(message.id) || (message.userId === user.id && message.read)
		}));

		// Filter by unread if requested (now using enhanced read status)
		const filteredMessages = unreadOnly
			? enhancedMessages.filter((m: any) => !m.read)
			: enhancedMessages;

		// Count unread messages (using receipts for accurate count)
		const allMessagesFilter = `userId = "${user.id}" || (type = "public_announcement" && (sentAt <= "${new Date().toISOString()}" || sentAt = ""))`;
		const allMessages = await pb.collection('messages').getFullList({
			filter: allMessagesFilter,
			requestKey: `messages-all-for-count-${user.id}`,
		});

		// Get all read receipts for counting
		const allReadReceipts = await pb.collection('message_reads').getFullList({
			filter: `user = "${user.id}"`,
			requestKey: `message-reads-count-${user.id}`
		});
		const allReadMap = new Map(allReadReceipts.map((r: any) => [r.message, true]));

		// Count unread: messages that are not in the read receipts map
		const unreadCount = allMessages.filter((m: any) => !allReadMap.has(m.id)).length;

		return json({
			messages: filteredMessages,
			totalPages: messages.totalPages,
			currentPage: messages.page,
			unreadCount
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