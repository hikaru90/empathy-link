import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { bullshiftChats } from '$lib/server/gemini';
import { pb } from '$scripts/pocketbase';
import { shouldAnalyzeFeelingsTool, analyzeAndSaveFeelings, saveTrace, queueMemoryExtraction } from '$lib/server/tools';

const sanitizeText = (text: string) => {
	console.log('text', text);
	// Replace multiple newlines with single newline
	let sanitized = text.replace(/\n{2,}/g, '\n');
	// Replace multiple tabs with single tab
	sanitized = sanitized.replace(/\t{2,}/g, '\t');
	// Trim whitespace from start and end

	return sanitized.trim();
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { chatId, message, userId } = await request.json();

		if (!chatId || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const chat = bullshiftChats.get(chatId);
		if (!chat) {
			return json({ error: 'Chat session not found' }, { status: 404 });
		}

        await queueMemoryExtraction(userId, 'pending')
			
		const shouldAnalyzeFeelings = await shouldAnalyzeFeelingsTool(message, chatId, userId);
		if (shouldAnalyzeFeelings) {
			await analyzeAndSaveFeelings(message, chatId, userId);
		}

		// Send message and get response
		const result = await chat.sendMessage({ message });
		const text = sanitizeText(result.text);

		console.log('text', text);
		const history = await chat.getHistory();
		console.log('history', history.slice(-1)[0].parts);

		// Update chat history in database if needed
		await pb.collection('chats').update(chatId, { history: await chat.getHistory() });

		saveTrace('sendMessage', message, 'bullshift', chatId, userId, text);

		return json({
			response: text,
			timestamp: Date.now()
		});
	} catch (error) {
		console.error('Error sending message:', error);
		return json({ error: 'Failed to send message' }, { status: 500 });
	}
};
