import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// This endpoint should be called by a cron job or scheduled task
		const { authKey } = await request.json();
		
		// Basic auth check - you should replace this with proper authentication
		if (authKey !== 'your-scheduled-task-auth-key') {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const now = new Date().toISOString();
		
		// Find scheduled messages that are ready to be sent
		const scheduledMessages = await pb.collection('messages').getList(1, 100, {
			filter: `scheduledFor != "" && scheduledFor <= "${now}" && sentAt = ""`
		});

		const processedMessages = [];
		
		for (const message of scheduledMessages.items) {
			try {
				// Update the message to mark it as sent
				await pb.collection('messages').update(message.id, {
					sentAt: now
				});
				
				processedMessages.push({
					id: message.id,
					title: message.title,
					type: message.type,
					status: 'sent'
				});
			} catch (error) {
				console.error(`Failed to process message ${message.id}:`, error);
				processedMessages.push({
					id: message.id,
					title: message.title,
					type: message.type,
					status: 'error',
					error: error.message
				});
			}
		}

		// Process due reminders
		const dueReminders = await pb.collection('reminders').getList(1, 100, {
			filter: `active = true && scheduledFor <= "${now}"`
		});

		const processedReminders = [];
		
		for (const reminder of dueReminders.items) {
			try {
				// Create a message from the reminder
				const messageData = {
					userId: reminder.userId,
					fromUserId: '',
					type: 'reminder',
					title: reminder.title,
					content: reminder.message,
					read: false,
					scheduledFor: '',
					sentAt: now,
					priority: 2, // Reminders are high priority
					reminderData: JSON.stringify({ reminderId: reminder.id })
				};

				await pb.collection('messages').create(messageData);
				
				// Update reminder's lastSent timestamp
				const updates = { lastSent: now };
				
				// Handle recurring reminders
				if (reminder.recurring) {
					const nextSchedule = calculateNextSchedule(reminder.scheduledFor, reminder.recurring, reminder.recurringData);
					if (nextSchedule) {
						updates.scheduledFor = nextSchedule;
					} else {
						updates.active = false; // Deactivate if no next schedule
					}
				} else {
					updates.active = false; // Deactivate one-time reminders
				}
				
				await pb.collection('reminders').update(reminder.id, updates);
				
				processedReminders.push({
					id: reminder.id,
					title: reminder.title,
					status: 'sent',
					nextSchedule: updates.scheduledFor || null
				});
			} catch (error) {
				console.error(`Failed to process reminder ${reminder.id}:`, error);
				processedReminders.push({
					id: reminder.id,
					title: reminder.title,
					status: 'error',
					error: error.message
				});
			}
		}

		return json({
			processedMessages,
			processedReminders,
			summary: {
				messagesProcessed: processedMessages.length,
				remindersProcessed: processedReminders.length,
				messagesSuccess: processedMessages.filter(m => m.status === 'sent').length,
				remindersSuccess: processedReminders.filter(r => r.status === 'sent').length
			}
		});
	} catch (error) {
		console.error('Error processing scheduled messages:', error);
		return json({ error: 'Failed to process scheduled messages' }, { status: 500 });
	}
};

function calculateNextSchedule(currentSchedule: string, recurring: string, recurringData: string): string | null {
	const current = new Date(currentSchedule);
	let next: Date;
	
	try {
		const data = recurringData ? JSON.parse(recurringData) : {};
		
		switch (recurring) {
			case 'daily':
				next = new Date(current);
				next.setDate(current.getDate() + (data.interval || 1));
				break;
				
			case 'weekly':
				next = new Date(current);
				next.setDate(current.getDate() + (7 * (data.interval || 1)));
				break;
				
			case 'monthly':
				next = new Date(current);
				next.setMonth(current.getMonth() + (data.interval || 1));
				break;
				
			default:
				return null;
		}
		
		// Check if there's an end date
		if (data.endDate && next > new Date(data.endDate)) {
			return null;
		}
		
		return next.toISOString();
	} catch (error) {
		console.error('Error calculating next schedule:', error);
		return null;
	}
}