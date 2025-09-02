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
		const activeOnly = url.searchParams.get('active') !== 'false';

		let filter = `userId = "${user.id}"`;
		
		if (activeOnly) {
			filter += ' && active = true';
		}

		const reminders = await pb.collection('reminders').getList(page, perPage, {
			filter,
			sort: 'scheduledFor',
			requestKey: `reminders-list-${user.id}-${page}-${activeOnly}`,
		});

		return json({
			reminders: reminders.items,
			totalPages: reminders.totalPages,
			currentPage: reminders.page
		});
	} catch (error) {
		console.error('Error fetching reminders:', error);
		return json({ error: 'Failed to fetch reminders' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	const pb = locals.pb;
	if (!user || !pb) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { title, message, scheduledFor, recurring, recurringData } = await request.json();

		if (!title || !message || !scheduledFor) {
			return json({ error: 'Title, message and scheduledFor are required' }, { status: 400 });
		}

		const reminderData = {
			userId: user.id,
			title,
			message,
			scheduledFor,
			recurring: recurring || '',
			recurringData: recurringData ? JSON.stringify(recurringData) : '',
			active: true,
			lastSent: ''
		};

		const reminder = await pb.collection('reminders').create(reminderData, {
			requestKey: `create-reminder-${user.id}-${Date.now()}`
		});
		return json({ reminder });
	} catch (error) {
		console.error('Error creating reminder:', error);
		return json({ error: 'Failed to create reminder' }, { status: 500 });
	}
};